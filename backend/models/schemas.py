from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class CellUpdate(BaseModel):
    row: int
    col: int
    value: Any


class SheetState(BaseModel):
    """
    Lightweight representation of the current sheet.
    Later you can extend this to multiple sheets, styling, etc.
    """

    name: str = "Sheet1"
    rows: List[List[Any]] = Field(default_factory=list)


class ChatRequest(BaseModel):
    message: str = Field(..., description="User's natural language instruction")
    sheet: Optional[SheetState] = Field(
        default=None,
        description="Optional snapshot of the current sheet to give the agent full context.",
    )


class ChatResponse(BaseModel):
    reply: str = Field(..., description="Natural language response from the agent")
    updates: List[CellUpdate] = Field(
        default_factory=list,
        description="Optional cell updates for the frontend to apply to the sheet.",
    )
    chart_spec: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional chart configuration to render on the frontend.",
    )


