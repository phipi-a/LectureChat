export interface BulletPointI {
  bullet_point: string;
  longer_explanation: string;
  page: string | undefined;
  id: number;
  start: string | undefined;
}
export interface ChatI {
  id: number | undefined;
  messages: MessageI[];
}
export interface MessageI {
  role: "user" | "assistant";
  content: string;
}
export interface BulletPointsJsonI {
  bullet_points: BulletPointI[];
  isLong: boolean;
}
export interface BulletPointsI {
  content: BulletPointsJsonI;
  id: number | undefined;
}

export interface PersonalInformationI {
  name: string | null;
  age: number | null;
  language: string | null;
  hobbies: string[] | null;
  favorite_topics: string[] | null;
}

export interface LearningDifficultiesI {
  subject_difficulty: string | null;
  difficulty: string | null;
}

export interface LearningStyleI {
  emojis: boolean | null;
  person: string | null;
  storytelling: boolean | null;
}
