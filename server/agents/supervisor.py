from langgraph.types import interrupt, Command
from langgraph.graph import MessagesState
from langchain_core.messages import AIMessage, HumanMessage
from typing import Literal

from configs import llm
from state_class import Supervisor


def supervisor_node(state: MessagesState) -> Command[Literal["interviewer","scenario-generator", "teacher", "hint-generator", "question_explainer"]]:
    system_prompt = ('''   
        You are a workflow supervisor managing a team of three specialized agents: Prompt Enhancer, Researcher, and Coder. Your role is to orchestrate the workflow by selecting the most appropriate next agent based on the current state and needs of the task. Provide a clear, concise rationale for each decision to ensure transparency in your decision-making process.

        **Team Members**:
        1. Scenario-Generator
        - Creates interview scenarios.
        - Generates new situations for the user.

        2. Teacher
        - Explains concepts.
        - Teaches system design, SQL, API design, etc.

        3. Interviewer
        - Reviews the user's answer.
        - Scores the answer.
        - Provided follow-up questions based on the user's answer.
        - Provides strengths and weaknesses.

        4. Question Explainer
        - Explains the latest interview question or a specific part of it.
        - Route to this node only when the user is asking for clarification about the interviewer's most recent question.
        - This includes explicit requests such as:
            - "Explain the last question."
            - "Can you explain that?"
            - "What does that mean?"
            - "I don't understand the question."
            - "What do you mean by ...?"
        - If the user refers to the latest interview question using ambiguous phrases like "that", "this", "it", "what does that mean?", or "I don't understand", assume they are asking for clarification of the most recent interview question.

        5. Hint Generator
        - Helps the candidate solve the current interview question without revealing the answer.
        - Provides clues, nudges, or guidance.
        - Never explains the interview question itself.
        - Route here ONLY if the user explicitly asks for a hint or guidance.
        Examples:
            - "Give me a hint."
            - "I'm stuck."
            - "Can I get a clue?"
            - "Help me think about it."
            - "Don't answer it, just guide me."
                     
        **Your Responsibilities**:
        1. Analyze each user request and agent response for completeness, accuracy, and relevance.
        2. Route the task to the most appropriate agent at each decision point.
        3. Maintain workflow momentum by avoiding redundant agent assignments.
        4. Continue the process until the user's request is fully and satisfactorily resolved.

        Your objective is to create an efficient workflow that leverages each agent's strengths while minimizing unnecessary steps, ultimately delivering complete and accurate solutions to user requests.           
    ''')
    
    messages = [
        {"role": "system", "content": system_prompt},  
    ] + state["messages"] 

    response = llm.with_structured_output(Supervisor).invoke(messages)

    goto = response.next
    reason = response.reason

    print(f"--- Workflow Transition: Supervisor → {goto.upper()} ---")
    
    return Command(
        update={
            "messages": [
                AIMessage(content=reason, name="supervisor")
            ]
        },
        goto=goto,  
    )