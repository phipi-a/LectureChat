export interface BulletPointI {
  bullet_point: string;
  longer_explanation: string;
  page: string | undefined;
  id: number;
  video_start_ms: number | undefined;
  video_end_ms: number | undefined;
}
export interface ChatI {
  id: number | undefined;
  messages: MessageI[];
}
export interface MessageI {
  role: "user" | "assistant";
  content: string;
}
