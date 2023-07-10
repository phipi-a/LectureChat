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
