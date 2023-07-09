export interface Segment {
  data: string;
  time: string;
  timeSec: number;
}

export interface Data {
  created_at: number;
  data: string;
  room_id: string;
  id: string;
  page: number;
  video_start_ms: number | null;
  video_end_ms: number | null;
}

// e.g. { "title": "Sparse Coding", "start": "2:05", "end": "14:17" },
export interface Section {
  title: string;
  start: string;
  end: string;
}

export interface SectionWithSeconds {
  title: string;
  start: number;
  end: number;
}

// {
//     "bullet_point": "Bullet Point 1",
//     "longer_explanation": "Longer explanation of bullet point 1.",
//     "start": "03:20"
// }
export interface Bulletpoint {
  bullet_point: string;
  longer_explanation: string;
  start: string;
}

export interface BulletpointWithID extends Bulletpoint {
  id: string;
}

export interface BulletpointSection extends Section {
  bullet_points: BulletpointWithID[];
}

export interface VideoBulletPoints {
  isLong: boolean;
  sections: BulletpointSection[] | undefined;
  bullet_points: BulletpointWithID[] | undefined;
}
