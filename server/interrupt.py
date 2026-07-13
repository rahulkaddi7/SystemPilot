from langgraph.types import Command

from app import app
from configs import config

for event in app.stream(
    Command(
        resume="nah, give me answer for this"),
    config=config,
):  
    print(event)