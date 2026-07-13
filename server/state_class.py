from langgraph.graph import MessagesState
from typing import Annotated, Sequence, List, Literal, TypedDict 
from pydantic import BaseModel, Field 
from operator import add


class Supervisor(BaseModel):
    next: Literal["interviewer","scenario-generator", "teacher","hint-generator", "question_explainer"] = Field(
        description="Determines which specialist to activate next in the workflow sequence: "
                    "'interviewer' when needed to evaluate,"
                    "'scenario-generator' when new scenarios need to be created or explored, "
                    "'teacher' when the user needs guidance or instruction,"
                    "'hint-generator' when user explicitly requests hints or assistance."
                    "'question_explainer' when user needs explanation on the latest question"
    )
    reason: str = Field(
        description="Detailebd justification for the routing decision, explaining the rationale behind selecting the particular specialist and how this advances the task toward completion."
    )


class Scenario(BaseModel):
    title: str = Field(description="Short title of the interview scenario")
    description: str = Field(
        description="Detailed description of the interview scenario"
    )
    difficulty: Literal["easy", "intermediate", "hard"]
    constraints: List = Field(
        description="Any constraints or limitations for the interview scenario"
    )
    concepts: List[str] = Field(
        description="Technical concepts and subtopics that the scenario is intended to assess."
    )
    

class InterviewSummary(BaseModel):
    overall_assessment: str  = Field(description="Overall summary and the reasoning for it")
    strengths: list[str]
    weaknesses: list[str]
    covered_topics: list[str]
    pending_topics: list[str]
    score: float = Field(
        description="""Score rubric
        9-10: Excellent answer
        7-8: Mostly correct with minor omissions
        5-6: Basic understanding
        3-4: Major misconceptions
        0-2: Incorrect
        deduct marks if its off topic or not relevant to latest question"""
    )
    next_question: str


class Query_Evaluation(BaseModel):
    is_technical: bool = Field(
        description="AIMessage indicating whether the user's query is technical in nature, relevant to system design, SQL, API design, or any other technical topic."
    )


class Teacher(BaseModel):
    explained_topics: list[str]
    explanation: str


class InterviewState(MessagesState):
    scenario: Scenario

    previous_questions: Annotated[list[str], add]
    current_question: str

    interview_summary: InterviewSummary
    avg_score: float

    question_number: int
    follow_up_count: int
    failure_count: int

    explained_topics: Annotated[list[str], add]

    assessment_history: Annotated[list[str], add]

    interview_stage: Literal[
        "scenario",
        "waiting_for_answer",
        "evaluating",
        "completed"
    ]