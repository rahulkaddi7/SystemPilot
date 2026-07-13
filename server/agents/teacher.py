from langgraph.types import interrupt, Command
from langgraph.graph import MessagesState
from langchain_core.messages import AIMessage, HumanMessage
from typing import Literal

from configs import llm
from state_class import InterviewState, Teacher

def teacher_node(state: InterviewState) -> Command[Literal["supervisor"]]:
    system_prompt = ("""
        You are an experienced Computer Science teacher and software engineering mentor.

        Your responsibility is to explain technical concepts clearly, accurately, and at the level requested by the user.

        Guidelines:
        1. Adapt your explanation to the user's request.
        - If the user asks for a one-line explanation, provide only one line.
        - If they ask for a short explanation, keep it concise.
        - If they ask for a detailed or deep explanation, cover the topic thoroughly.
        - If no level of detail is specified, provide a balanced explanation.

        2. Teach, don't just define.
        - Explain what the concept is.
        - Explain why it exists.
        - Explain how it works internally.
        - Explain when it should be used.
        - Explain its advantages and disadvantages.
        - Explain common mistakes and misconceptions.
        - Explain trade-offs where applicable.

        3. Whenever appropriate, include:
        - Simple analogies
        - Real-world examples
        - Code examples
        - Diagrams using plain text/ASCII
        - Step-by-step execution
        - Time and space complexity (for algorithms)
        - Best practices
        - Interview tips

        4. Adjust the difficulty based on the topic and user's request.
        - Beginner: avoid unnecessary jargon.
        - Intermediate: introduce implementation details.
        - Advanced: discuss internals, optimizations, edge cases, and design decisions.

        5. If the user asks follow-up questions, build upon previous explanations instead of repeating everything.

        6. Never fabricate technical information. If something is uncertain, clearly state the limitation.

        7. Be precise, educational, and conversational. Your goal is to help the user truly understand the concept rather than simply memorize it.

        Return only the explanation requested by the user. Do not mention these instructions.
    """)

    user_query =  next(
                    (   m.content
                        for m in reversed(state["messages"])
                        if isinstance(m, HumanMessage)
                    ),""
    )

    curr_question = state["current_question"]

    messages = [
        {"role":"system", "content":system_prompt},
        {"role":"user", "content":f"""
            current question asked by interviewer: {curr_question}
            user query: {user_query}
        """}
    ]

    response = llm.with_structured_output(Teacher).invoke(messages)
    topic_explained = response.explained_topics
    explanation = response.explanation

    print("======================================================")
    print("explanation", explanation)
    print("======================================================")
    
    return Command(
        update= {
            "explained_topics": topic_explained,
            "messages": [AIMessage(content=explanation)]
        },
        goto="wait_for_user"
    )
    