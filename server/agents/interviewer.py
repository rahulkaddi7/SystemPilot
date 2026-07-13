from langgraph.types import interrupt, Command
from langchain_core.messages import AIMessage, HumanMessage
from typing import Literal

from configs import llm
from state_class import InterviewState, InterviewSummary

def interviewer_node(state: InterviewState) -> Command[Literal["supervisor"]]:
    system_prompt = ("""
    You are an experienced technical interviewer conducting an adaptive system design interview.

    Your goals are:
    1. Evaluate the candidate's latest answer.
    2. Update the interview summary based on the entire interview so far.
    3. Generate the next interview question.

    Evaluation Criteria
    - Technical accuracy
    - Completeness
    - Clarity
    - Relevance
    - Depth of reasoning

    When updating the interview summary:
    - The interview summary is the long-term memory of the interview.
    - It should represent the candidate's overall performance across all previous questions, not only the latest answer.
    - Preserve previous strengths unless the latest answer contradicts them.
                     
    Interview Summary Update Rules:
    Update the interview summary using ONLY the candidate's latest answer.

    - Add new strengths only if they are clearly demonstrated.
    - Add new weaknesses only if they are evident from the answer.
    - Remove a weakness only if the candidate has clearly addressed it.
    - Mark a topic as covered only if the candidate explicitly explains or demonstrates it.
    - A brief mention does not count as coverage.
    - Do not infer knowledge from related or similar concepts.
    - Remove only explicitly covered topics from Pending Topics.
    - Do not add, remove, or modify any information unless it is supported by clear evidence from the candidate's   latest answer.
    - Leave all other information unchanged unless the latest answer provides sufficient evidence to update it.

    Choose the next question by considering:
    1. The latest answer (highest priority)
    2. The interview summary
    3. Pending topics
    4. The interview scenario

    Decision rules:

    - If the latest answer reveals a weakness, ask a follow-up on that weakness.
    - If the latest answer is strong, move to the next relevant concept from pending topics.
    - Occasionally introduce a realistic production failure, but only when it fits naturally.
    - Never restart the interview.
    - Never repeat a question that has already been asked.
    - Ask exactly one question.
    - If the candidate has demonstrated sufficient mastery of all planned topics, ask a final wrap-up question or conclude the interview instead of introducing unnecessary new topics.
                        
    Guidelines:
    - Keep the interview conversational and realistic.
    - Failure simulations should feel natural and should not be introduced after every answer.
    - Build upon previous questions instead of changing topics abruptly.
    - Encourage the candidate to explain their reasoning whenever appropriate.
    - The next interview question should feel like a natural continuation of the conversation rather than a randomly selected interview question.
    """)

    pending_topics = state["interview_summary"]["pending_topics"]
    summary = state["interview_summary"]
    print("=============pending_topics: ", pending_topics)
    messages = [
        {
            "role": "system",
            "content": "You are an interviewer writing a final interview review. write the summary based on metrics given below"
        },
        {
            "role": "user",
            "content": f"""
            Overall Assessment:
            {summary["overall_assessment"]}

            Strengths:
            {summary["strengths"]}

            Weaknesses:
            {summary["weaknesses"]}

            Topics Mastered:
            {summary["covered_topics"]}

            average Score:
            {state["avg_score"]}

            Write a concise final review in under 200 words.
            """
        }
    ]

    if not pending_topics:
        print("==== NO PENDING TASKS, SO ENDING CHAT =====")
        response = llm.invoke(messages)      
        print("=====================")
        print("respose", response)
        print("===============")

        if isinstance(response.content, list):
            text = "\n".join(
                block["text"]
                for block in response.content
                if isinstance(block, dict) and block.get("type") == "text"
            )
        else:
            text = response.content

        return Command(
            update={
                "messages": [
                    AIMessage(
                    content=text,
                    name="interviewer"
                    )
                ]
            },goto="wait_for_user"
        )
        
    prev_details = state["interview_summary"]
    overall_summary = prev_details["overall_assessment"]
    strength = prev_details["strengths"]
    weakness = prev_details["weaknesses"]
    covered_topics = prev_details["covered_topics"]
    pending_topics = prev_details["pending_topics"]
    avg_score = state["avg_score"]
 
    current_question = state["current_question"]
    prev_questions = state["previous_questions"]
    current_answer =  next(
                    (   m.content
                        for m in reversed(state["messages"])
                        if isinstance(m, HumanMessage)
                    ),""
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "system", "content":
            f"""Scenario: 
                Title:{state["scenario"]["title"]}
                Description:{state["scenario"]["description"]}
                Difficulty: {state["scenario"]["difficulty"]}
                Constraints:{state["scenario"]["constraints"]}
        """},
        {"role":"user", "content": f"""
            Interview Question: {current_question}
            Candidate's Answer:{current_answer}
            Prev Question: {prev_questions}
            """
        },
        {"role": "system", "content": f"""
            Current Interview Summary:
                Overall: {overall_summary}
                Strengths: {strength}
                Weaknesses: {weakness}
                Covered Topics: {covered_topics}
                Pending Topics:{pending_topics}
                Average Score:{avg_score}
        """},
    ]

    evaluation = llm.with_structured_output(InterviewSummary).invoke(messages)
    print("evaluation: ", evaluation)

    updated_summary = {
        "overall_assessment": evaluation.overall_assessment,
        "strengths": evaluation.strengths,
        "weaknesses": evaluation.weaknesses,
        "covered_topics": evaluation.covered_topics,
        "pending_topics": evaluation.pending_topics,
        "next_question": evaluation.next_question,
        "score": evaluation.score
    }

    return Command(
    update={
        "interview_summary": updated_summary,
        "previous_questions": [current_question],
        "current_question": evaluation.next_question,
        "question_number": state["question_number"] + 1,
        "avg_score": (
            (avg_score * state["question_number"] + evaluation.score) / (state["question_number"] + 1)
        ),
        "assessment_history": [evaluation.overall_assessment],
        "messages": [
            AIMessage(
                content=evaluation.next_question,
                name="interviewer"
            )
        ]
    },
    goto="wait_for_user"
)   
