import { BadRequestError } from "../../_shared/errors.ts";
import { Data, Segment } from "./interfaces.ts";

export class OpenAI {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async query(
    system_prompt: string,
    prompt: string,
    model: string = "gpt-3.5-turbo-16k",
    temperature: number = 0
  ) {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: prompt },
        ],
        temperature,
      }),
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const data = await response.json();

    try {
      const rawResponse = data.choices[0]["message"]["content"];
      return JSON.parse(rawResponse);
    } catch (e) {
      console.error("Response", data);
      console.error("Error", e);
      throw new BadRequestError(
        "Invalid response from OpenAI. Possible rate limit, insufficient tokens or invalid API key."
      );
    }
  }
}

export function convert_seconds_to_min_sec(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const seconds_remainder = Math.floor(seconds % 60);
  return `${minutes}:${seconds_remainder < 10 ? "0" : ""}${seconds_remainder}`;
}

export function convert_min_sec_to_seconds(min_sec: string) {
  const [min, sec] = min_sec.split(":");
  return parseInt(min) * 60 + parseInt(sec);
}

// Connects
export function cleanText(videoContent: Data[]) {
  const segments: Segment[] = [];

  let i = 0;
  while (i < videoContent.length) {
    const segment = videoContent[i];
    const nextSegment = videoContent[i + 1];

    if (segment.data.endsWith(".") || !nextSegment) {
      // If the segment ends with a period, we can just add it to the list
      segments.push({
        data: segment.data.trim(),
        time: convert_seconds_to_min_sec(segment.video_start_ms!),
        timeSec: Math.floor(segment.video_start_ms!),
      });
      i++;
    } else {
      // If the segment doesn't end with a period, we need to add the next segment
      const idx = nextSegment.data.indexOf(".");

      if (idx == -1) {
        segment.data = segment.data + nextSegment.data;
        videoContent.splice(i + 1, 1);
      } else {
        const firstSentence = nextSegment.data.substring(0, idx + 1);
        const rest = nextSegment.data.substring(idx + 1);

        segments.push({
          data: (segment.data + firstSentence).trim(),
          time: convert_seconds_to_min_sec(segment.video_start_ms!),
          timeSec: Math.floor(segment.video_start_ms!),
        });

        nextSegment.data = rest;
        i++;
      }
    }
  }

  return segments;
}

export function segments_to_string(segments: Segment[]) {
  return segments.reduce((acc, curr) => {
    if (curr.data.trim() == "") {
      return acc;
    }

    return `${acc}[${curr.time}]\n${curr.data}\n\n`;
  }, "");
}
