export interface Message {
  sender: "user" | "assistant";
  message: string;
}



export interface Chat {
  thread_id: string;
  title: string;
  updated_at: string;
}

export interface Scenario {
  description: string;
  difficulty: string;
  concepts: string[];
}

export interface InterviewSummary {
  pending_topics: string[];
}

export interface ChatResponse {
  thread_id: string;
  title?: string;
  message: Message;
  scenario?: Scenario;
  interview_summary?: InterviewSummary;
}

export interface ChatDetail {
  thread_id: string;
  // title: string;
  messages: Message[];
  // scenario?: Scenario;
  // interview_summary?: InterviewSummary;
}