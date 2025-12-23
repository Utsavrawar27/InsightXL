from fastapi import APIRouter

from models.schemas import ChatRequest, ChatResponse
from services.llm import run_llm_agent


router = APIRouter()


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


