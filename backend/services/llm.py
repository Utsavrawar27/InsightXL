import os
from typing import Any

from dotenv import load_dotenv
from openai import AsyncOpenAI

from models.schemas import ChatRequest, ChatResponse


load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

client: AsyncOpenAI | None = None


def get_openai_client() -> AsyncOpenAI | None:
    """Lazy initialization of OpenAI client"""
    global client
    if client is None and OPENAI_API_KEY:
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    return client


SYSTEM_PROMPT = """
You are InsightXL, an Excel / spreadsheet AI agent.

You receive:
- a natural language instruction from the user
- optionally, a tabular representation of the current sheet

Your job:
- understand the user's intent
- describe what should change in the sheet (rows/cols/values)
- optionally, propose a chart specification (type, data range, labels)
- respond with a concise, user-friendly explanation of what you did or suggest.

For now, you are only returning high-level natural language guidance.
The backend will later execute pandas operations based on your instructions.
"""


async def run_llm_agent(payload: ChatRequest) -> ChatResponse:
    """
    Thin wrapper around GPT-4o (or similar) with a stable interface for the rest
    of the backend. Right now it returns a simple reply; you can evolve this
    into a tool-calling / code-writing agent that generates pandas code.
    """
    client = get_openai_client()
    if client is None:
        # Fallback behavior when API key is not configured.
        return ChatResponse(
            reply=(
                "InsightXL is not fully configured yet (missing OpenAI API key). "
                "However, based on your message I would: "
                f'"{payload.message}". Once configured, I will analyze your sheet '
                "and generate concrete transformations and visualizations."
            )
        )

    messages: list[dict[str, Any]] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": (
                f"User message: {payload.message}\n\n"
                f"Sheet snapshot (may be empty): {payload.sheet.model_dump() if payload.sheet else 'None'}"
            ),
        },
    ]

    completion = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.3,
    )

    reply = completion.choices[0].message.content or ""
    return ChatResponse(reply=reply)


async def generate_suggestions(df: Any, columns: list[str], numeric_cols: list[str]) -> list[str]:
    """
    Generate smart suggestions based on the uploaded data.
    Analyzes the DataFrame and returns relevant questions/operations.
    """
    client = get_openai_client()
    if client is None:
        # Fallback suggestions when API key is not configured
        return [
            "What is the summary statistics of the numerical columns?",
            "Show me the first 10 rows of the data",
            "Create a visualization of the data distribution"
        ]
    
    # Prepare data context
    data_info = f"""
Data Overview:
- Total Rows: {len(df)}
- Columns: {', '.join(columns[:10])}{'...' if len(columns) > 10 else ''}
- Numeric Columns: {', '.join(numeric_cols[:5])}{'...' if len(numeric_cols) > 5 else ''}
- Sample Data (first 3 rows):
{df.head(3).to_string()}
"""
    
    system_prompt = """You are an AI assistant that generates smart, relevant questions about Excel/CSV data.
Based on the data provided, suggest 3 specific, actionable questions that would provide valuable insights.
Make the questions specific to the actual column names and data types in the dataset.
Return ONLY the 3 questions, one per line, without numbering or extra formatting."""
    
    try:
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": data_info},
            ],
            temperature=0.7,
            max_tokens=200,
        )
        
        suggestions_text = completion.choices[0].message.content or ""
        # Split by newlines and filter empty lines
        suggestions = [s.strip() for s in suggestions_text.strip().split('\n') if s.strip()]
        
        # Return up to 3 suggestions
        return suggestions[:3] if suggestions else [
            "What are the key insights from this data?",
            "Can you show me summary statistics?",
            "What patterns do you see in the data?"
        ]
    except Exception as e:
        print(f"Error generating suggestions: {e}")
        return [
            "What are the key insights from this data?",
            "Can you show me summary statistics?",
            "What patterns do you see in the data?"
        ]


def is_chart_request(query: str) -> bool:
    """
    Detect if the user is requesting a chart/visualization.
    """
    chart_keywords = [
        "chart", "graph", "plot", "visualize", "visualization", "draw",
        "bar chart", "pie chart", "line chart", "area chart", "radar",
        "histogram", "scatter", "donut", "treemap", "heatmap",
        "show me a", "create a", "make a", "generate a", "display a"
    ]
    query_lower = query.lower()
    
    # Check for chart-related keywords
    for keyword in chart_keywords:
        if keyword in query_lower:
            return True
    
    return False


async def generate_chart_data(query: str, dataframe: Any, file_info: dict) -> str:
    """
    Generate chart data JSON for visualization requests.
    Returns a JSON string that the frontend can parse and render as a chart.
    """
    import json
    
    client = get_openai_client()
    if client is None:
        return json.dumps({
            "type": "error",
            "message": "InsightXL is not configured (missing OpenAI API key)."
        })
    
    df = dataframe
    
    # Prepare column information
    columns_info = list(df.columns)
    sample_data = df.head(10).to_dict('records')
    
    data_context = f"""
AVAILABLE COLUMNS: {columns_info}

SAMPLE DATA (first 10 rows):
{json.dumps(sample_data, default=str, indent=2)}

TOTAL ROWS: {len(df)}
"""
    
    system_prompt = """You are a Chart Data Generator. Your ONLY job is to output valid JSON for chart visualization.

When the user requests a chart, you MUST:
1. Analyze the data to find the appropriate columns
2. Extract the actual data values from the dataset
3. Return a JSON object with the chart configuration

OUTPUT FORMAT - Return ONLY this JSON structure, nothing else:

{
  "type": "chart",
  "chartType": "bar" | "line" | "pie" | "area" | "radar",
  "title": "A descriptive title for the chart",
  "description": "Brief explanation of what this chart shows",
  "xAxisLabel": "Label for X-axis",
  "yAxisLabel": "Label for Y-axis", 
  "data": [
    {"name": "Category1", "value": 100},
    {"name": "Category2", "value": 200}
  ],
  "insights": ["Key insight 1", "Key insight 2", "Key insight 3"]
}

CHART TYPE MAPPING:
- "bar chart", "bar", "column" → "bar"
- "line chart", "line", "trend" → "line"  
- "pie chart", "pie", "donut" → "pie"
- "area chart", "area" → "area"
- "radar chart", "radar", "spider" → "radar"

CRITICAL RULES:
1. Output ONLY valid JSON - no markdown, no explanation, no extra text
2. Use the ACTUAL data values from the dataset
3. The "data" array should contain real values from the spreadsheet
4. For pie/donut charts, use "name" and "value" keys
5. For bar/line/area charts, use the actual column names as keys
6. Include 3 meaningful insights about the chart data

EXAMPLE for a bar chart request with "Full Name" on x-axis and "Annual Salary" on y-axis:
{
  "type": "chart",
  "chartType": "bar",
  "title": "Employee Annual Salaries",
  "description": "Comparison of annual salaries across all employees",
  "xAxisLabel": "Full Name",
  "yAxisLabel": "Annual Salary ($)",
  "data": [
    {"name": "John Smith", "value": 95000},
    {"name": "Jane Doe", "value": 85000}
  ],
  "insights": [
    "Highest salary: John Smith at $95,000",
    "Salary range spans from $X to $Y",
    "Average salary is approximately $Z"
  ]
}

Remember: OUTPUT ONLY THE JSON OBJECT. No other text."""

    user_message = f"""DATA CONTEXT:
{data_context}

FULL DATA FOR CHART (use ALL rows):
{df.to_json(orient='records', default_handler=str)}

USER REQUEST: {query}

Generate the chart JSON using the ACTUAL data from the spreadsheet. Include ALL data points."""

    try:
        completion = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.1,  # Very low for consistent JSON output
            max_tokens=3000,
        )
        
        response = completion.choices[0].message.content or ""
        
        # Clean up the response - remove markdown code blocks if present
        response = response.strip()
        if response.startswith("```json"):
            response = response[7:]
        if response.startswith("```"):
            response = response[3:]
        if response.endswith("```"):
            response = response[:-3]
        response = response.strip()
        
        # Validate it's valid JSON
        try:
            parsed = json.loads(response)
            # Ensure it has the chart type marker
            if "type" not in parsed:
                parsed["type"] = "chart"
            return json.dumps(parsed)
        except json.JSONDecodeError:
            # If JSON parsing fails, return error
            return json.dumps({
                "type": "error",
                "message": "Failed to generate chart data. Please try rephrasing your request."
            })
        
    except Exception as e:
        print(f"Error generating chart: {e}")
        return json.dumps({
            "type": "error",
            "message": f"Error generating chart: {str(e)}"
        })


async def answer_query_with_context(query: str, dataframe: Any, file_info: dict) -> str:
    """
    Answer a user query using ONLY the provided DataFrame context.
    This prevents hallucinations by grounding responses in actual data.
    
    Has TWO MODES:
    1. CHART MODE: If user requests a chart, return JSON for visualization
    2. ANALYSIS MODE: For all other queries, return professional text report
    """
    
    # Check if this is a chart request
    if is_chart_request(query):
        return await generate_chart_data(query, dataframe, file_info)
    
    # Otherwise, continue with analysis mode
    client = get_openai_client()
    if client is None:
        return "InsightXL is not fully configured yet (missing OpenAI API key). Please configure the API key to use this feature."
    
    # Prepare comprehensive data context
    df = dataframe
    
    # Get data summary - send more data for better analysis
    # For small datasets (< 100 rows), send all data
    # For large datasets, send first 50 rows + summary
    max_rows_to_show = 100 if len(df) <= 100 else 50
    
    data_display = df.head(max_rows_to_show).to_string(index=False)
    rows_info = f"ALL {len(df)} ROWS" if len(df) <= max_rows_to_show else f"FIRST {max_rows_to_show} OF {len(df)} ROWS"
    
    data_summary = f"""
FILE: {file_info['filename']}
SHAPE: {file_info['row_count']} rows × {file_info['column_count']} columns

COLUMNS AND TYPES:
{chr(10).join([f"- {col}: {dtype}" for col, dtype in file_info['dtypes'].items()])}

COMPLETE DATA ({rows_info}):
{data_display}

STATISTICAL SUMMARY (numeric columns):
{df.describe().to_string() if not df.select_dtypes(include=['number']).empty else 'No numeric columns'}
"""
    
    system_prompt = """You are a Senior Data Analyst for a Fortune 500 company. 
Your job is to analyze data and produce professional, executive-level reports.

CRITICAL RULES:
1. Answer questions ONLY based on the provided data context
2. NEVER make up or hallucinate information that isn't in the data
3. You have access to the COMPLETE dataset - use ALL rows when analyzing
4. When performing calculations, analyze ALL records in the dataset
5. When ranking or sorting, include ALL items from the data

MANDATORY REPORT FORMAT - You MUST follow this structure for EVERY response:

## [Professional Title for the Analysis]

### Summary
A 2-3 sentence executive summary of what this data shows and the key insight.

### Methodology
Briefly explain how you sorted, filtered, or calculated the data (e.g., "Data was sorted in descending order by Annual Salary column").

### Findings

**Key Observations:**
- Analyze trends (e.g., "The top 10% earn X% of total compensation...")
- Mention the highest and lowest values explicitly with names and amounts
- Note any interesting patterns or outliers

**Data Results:**

| Column1 | Column2 | Column3 | Column4 |
|---------|---------|---------|---------|
| value   | value   | value   | value   |

⚠️ **MANDATORY:** You MUST display ALL relevant data in a properly formatted Markdown table with headers.
Include ALL records when showing rankings or lists - never truncate.

### Conclusions
A strategic recommendation or insight based on the data. What actions could be taken? What does this data suggest for decision-making?

---

FORMATTING RULES:
- Always use Markdown tables (with | and - characters) for data display
- Use **bold** for important values and names
- Use proper headings (##, ###) for sections
- Include specific numbers, percentages, and comparisons
- Never just list data - always tell a story with analysis and context

TONE: Professional, objective, insightful, and executive-ready.
Never give a simple list. Always provide a complete analytical report."""
    
    user_message = f"""DATA CONTEXT:
{data_summary}

USER QUESTION: {query}

MANDATORY INSTRUCTIONS:
1. Use ALL {file_info['row_count']} rows of data in your analysis - do not truncate or omit any records
2. Follow the EXACT report format: Title → Summary → Methodology → Findings (with Markdown table) → Conclusions
3. You MUST include a properly formatted Markdown table showing all relevant data
4. Provide executive-level analysis, not just a list
5. Include insights, trends, and strategic recommendations
6. Reference specific values, names, and percentages from the data

Remember: You are a Senior Data Analyst. Produce a professional report, not a simple list."""
    
    try:
        completion = await client.chat.completions.create(
            model="gpt-4o",  # Use GPT-4o for better reasoning
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,  # Lower temperature for more focused responses
            max_tokens=2000,  # Increased for detailed responses with complete data
        )
        
        response = completion.choices[0].message.content or "I couldn't generate a response. Please try again."
        return response
    
    except Exception as e:
        print(f"Error answering query: {e}")
        return f"I encountered an error while processing your question: {str(e)}. Please try rephrasing your question or try again."


