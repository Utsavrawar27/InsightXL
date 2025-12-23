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


