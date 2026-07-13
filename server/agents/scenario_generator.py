from langgraph.types import interrupt, Command
from langgraph.graph import MessagesState
from langchain_core.messages import AIMessage, HumanMessage
from typing import Literal
import json

from configs import llm
from state_class import InterviewState, Query_Evaluation, Scenario

def scenario_generator_node(state: InterviewState) -> Command[Literal["supervisor"]]:

    query_evaluation_prompt = f"""
    You are a query evaluation specialist with expertise in assessing the clarity, specificity, and technical relevance of user queries. Your task is to evaluate the user's initial query and determine whether it is sufficiently clear and actionable for generating interview scenarios.
    The topic should be related to system design, SQL, API design. The difficulty level should be clearly defined as easy, intermediate, or hard. If the query is vague or lacks specificity, you must enhance it to ensure it is actionable for scenario generation.
    """

    messages = [
        {"role": "system", "content": query_evaluation_prompt}
    ] + state["messages"]

    llm_response = llm.with_structured_output(Query_Evaluation).invoke(messages)
    
    if not llm_response.is_technical:
        print(f"--- Workflow Transition: Scenario Generator → Supervisor (Query Not Technical) ---")
        return Command(
            update={
                "messages": [
                    AIMessage(content="The user's query is not technical or lacks clarity. It needs to be enhanced for scenario generation.", name="scenario-generator")
                ]
            },
            goto="END",
        )       

    enhancer_prompt = f"""
    You are a Query Refinement Specialist.
    
    Your ONLY responsibility is to refine the user's selected interview topic and difficulty level.
    Responsibilities:
    1. Normalize and clarify the topic if it is ambiguous.
    2. Expand the topic with relevant technical context that will help another agent generate a high-quality interview scenario.
    3. Interpret the difficulty level (Beginner, Intermediate, Advanced) and include what depth is expected.
    4. Make reasonable assumptions when necessary.
    5. Do NOT generate an interview scenario.
    6. Do NOT generate interview questions.
    7. Do NOT solve the problem.
    8. Do NOT ask the user any questions.

    Output only a refined specification that another Scenario Generator can use.
    """
    
    messages = [
        {"role": "system", "content": enhancer_prompt}
    ] + state["messages"]
    enhanced_query = llm.invoke(messages).content

    print(f"--- Workflow Transition: Scenario Generator → Supervisor (Query Enhanced) ---")
    print(f"Enhanced Query: {enhanced_query}")
    
    
    system_prompt = ('''
        You are a Scenario Generator, responsible for creating interview scenarios. Your task is to generate new situations for the user to engage with, ensuring that each scenario is unique, relevant, and challenging. Provide a clear and concise description of each scenario, including any necessary context or background information.

        **Your Responsibilities**:
        1. Generate interview scenarios based on the user's choosen topic and difficulty level.
        2. Ensure that each scenario is unique and provides a meaningful challenge for the user.
        3. Provide any necessary context or background information to help the user understand the scenario.
        4. Generate a comprehensive list of concepts required to master the selected topic at the requested difficulty.T
        The concepts should represent the interview syllabus and must include all concepts that may be evaluated later in the interview.

        Your objective is to create engaging and thought-provoking scenarios that will help the user develop their skills and knowledge in a meaningful way.
    ''')
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": enhanced_query},
    ] + state["messages"]

    response = llm.with_structured_output(Scenario).invoke(messages)
    scenario = response.model_dump()

    print(f"--- Workflow Transition: Scenario Generator → Supervisor ---")
    
    return Command(
        update={
            "scenario": scenario,

            "current_question": scenario["description"],

            "previous_questions": [],

            "question_number": 1,
            "follow_up_count": 0,
            "failure_count": 0,

            "interview_summary": {
                "overall_assessment": "",
                "strengths": [],
                "weaknesses": [],
                "covered_topics": [],
                "pending_topics": scenario["concepts"],
                "score": 0.0,
                "next_question": ""
            },
            "avg_score": 0.0,
            "assessment_history":[],

            "messages": [
                    AIMessage(content= json.dumps(scenario, indent=2),
                    name="scenario-generator")
            ]
        },
        goto="wait_for_user"
    )