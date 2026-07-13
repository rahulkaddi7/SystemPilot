from uuid import uuid4

from langchain_core.messages import HumanMessage
from langgraph.types import Command 
from langgraph.graph import StateGraph, START
from langgraph.types import Command
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import InMemorySaver
from IPython.display import Image, display 
from fastapi import FastAPI
import pprint
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

from configs import config
from graph import builder

checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

def display_architecture():
    display(Image(graph.get_graph(xray=True).draw_mermaid_png()))

inputs = {
    "messages": [
        HumanMessage(
            content="topic: Load Balancer, Difficulty: hard"
        )
    ]
}
from pydantic import BaseModel

class ChatRequest(BaseModel):
    thread_id: str
    message: str

thread_id = ""

@app.post("/chat")
async def chat(req: ChatRequest):

    thread_id = req.thread_id or str(uuid4())
    print(thread_id)
    
    config = {
        "configurable": {
            "thread_id": thread_id
        }
    }

    if not req.thread_id:
        graph_input = {
            "messages": [
                HumanMessage(content=req.message)
            ]
        }
    else:
        graph_input = Command(resume=req.message)

    final_message = None

    for event in graph.stream(graph_input, config=config):
        for value in event.values():
            if not value or "messages" not in value:
                continue

            msg = value["messages"][-1]

            if getattr(msg, "name", None) != "supervisor":
                final_message = msg

    return {
        "message": final_message.content if final_message else None
    }