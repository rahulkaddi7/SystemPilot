from langgraph.types import interrupt, Command
from langchain_core.messages import HumanMessage
from typing import Literal

from state_class import InterviewState

def wait_for_user_node(state: InterviewState) -> Command[Literal["supervisor"]]:
    answer = interrupt(
        {
            "type": "await_answer"
        }
    )
    return Command(
        update={
            "messages": [
                HumanMessage(content=answer)
            ]
        },
        goto="supervisor",
    )