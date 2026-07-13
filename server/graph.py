from langgraph.graph import START, StateGraph

from state_class import InterviewState
from agents.interviewer import interviewer_node
from agents.question_explainer import question_explainer_node
from agents.scenario_generator import scenario_generator_node
from agents.supervisor import supervisor_node
from agents.teacher import teacher_node
from agents.user_input import wait_for_user_node
from agents.hint_generator import hint_generator_node

builder = StateGraph(InterviewState)

builder.add_node("supervisor", supervisor_node)
builder.add_node("scenario-generator", scenario_generator_node)
builder.add_node("wait_for_user", wait_for_user_node)

builder.add_node("teacher", teacher_node)
builder.add_node("interviewer", interviewer_node)
builder.add_node("hint-generator", hint_generator_node)
builder.add_node("question_explainer", question_explainer_node)
builder.add_edge(START, "supervisor")