import os
import uuid
import io
from typing import Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import pandas as pd

from models.schemas import ChatRequest, ChatResponse
from services.llm import run_llm_agent, generate_suggestions, answer_query_with_context


router = APIRouter()

# In-memory storage for uploaded files and their data
# In production, use Redis or database
file_storage: Dict[str, Dict[str, Any]] = {}


class QueryRequest(BaseModel):
    message: str
    file_id: str
    user_id: str


@router.post("/upload")
async def upload_excel_file(file: UploadFile = File(...)):
    """
    Upload and analyze an Excel or CSV file.
    Returns file metadata, data summary, and smart suggestions.
    """
    # Validate file type
    valid_extensions = ['.xlsx', '.xls', '.csv']
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in valid_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Supported formats: {', '.join(valid_extensions)}"
        )
    
    try:
        # Read file content
        contents = await file.read()
        
        # Parse the file based on type
        if file_ext == '.csv':
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Get data summary
        row_count, column_count = df.shape
        columns = df.columns.tolist()
        dtypes = df.dtypes.to_dict()
        
        # Get sample data (first 5 rows)
        sample_data = df.head(5).to_dict(orient='records')
        
        # Get basic statistics for numeric columns
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        stats = {}
        if numeric_cols:
            stats = df[numeric_cols].describe().to_dict()
        
        # Generate data summary text
        summary = f"Analyzed your file successfully! It contains {row_count} rows and {column_count} columns."
        if numeric_cols:
            summary += f" Found {len(numeric_cols)} numeric columns: {', '.join(numeric_cols[:3])}"
            if len(numeric_cols) > 3:
                summary += f" and {len(numeric_cols) - 3} more"
        
        # Store file data
        file_data = {
            'file_id': file_id,
            'filename': file.filename,
            'dataframe': df,
            'row_count': row_count,
            'column_count': column_count,
            'columns': columns,
            'dtypes': {k: str(v) for k, v in dtypes.items()},
            'sample_data': sample_data,
            'stats': {k: {kk: float(vv) if not pd.isna(vv) else None for kk, vv in v.items()} for k, v in stats.items()} if stats else {},
        }
        
        file_storage[file_id] = file_data
        
        # Generate smart suggestions based on data
        suggestions = await generate_suggestions(df, columns, numeric_cols)
        
        return {
            'file_id': file_id,
            'filename': file.filename,
            'row_count': row_count,
            'column_count': column_count,
            'columns': columns,
            'dtypes': file_data['dtypes'],
            'sample_data': sample_data[:3],  # Return only first 3 rows to frontend
            'summary': summary,
            'suggestions': suggestions,
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )


@router.post("/query")
async def query_excel_data(request: QueryRequest):
    """
    Answer a question about uploaded Excel data using GPT-4o.
    The AI will only use the provided data context to prevent hallucinations.
    """
    # Check if file exists
    if request.file_id not in file_storage:
        raise HTTPException(
            status_code=404,
            detail="File not found. Please upload the file again."
        )
    
    file_data = file_storage[request.file_id]
    df = file_data['dataframe']
    
    try:
        # Generate response using LLM with data context
        response = await answer_query_with_context(
            query=request.message,
            dataframe=df,
            file_info=file_data
        )
        
        return {
            'response': response,
            'file_id': request.file_id,
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )


@router.post("", response_model=ChatResponse)
async def chat_with_agent(payload: ChatRequest) -> ChatResponse:
    """
    Core entrypoint for the InsightXL Excel agent.
    
    Takes a natural-language instruction and (optionally) a serialized
    representation of the current spreadsheet, and returns:
      - a friendly natural-language reply
      - optionally, a description of actions to apply to the sheet
    """
    agent_result = await run_llm_agent(payload)
    return agent_result


@router.delete("/file/{file_id}")
async def delete_file(file_id: str):
    """Delete a file from storage"""
    if file_id in file_storage:
        del file_storage[file_id]
        return {"message": "File deleted successfully"}
    raise HTTPException(status_code=404, detail="File not found")
