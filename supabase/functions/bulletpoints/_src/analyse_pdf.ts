import { Bulletpoint, Data } from "./interfaces.ts";
import lecturePrompt from "./prompts/lecture.ts";
import * as utils from "./utils.ts";

function cleanLectureText(videoContent: Data[]) {
  let fullLecture = "";

  let lastPage = -1;
  for (let i = 0; i < videoContent.length; i++) {
    const subtitle = videoContent[i].data;
    const page = videoContent[i].page;

    if (page !== lastPage) {
      fullLecture += fullLecture + `\n[${page}]\n\n${subtitle}`;
    } else {
      fullLecture += subtitle;
    }
    lastPage = page;
  }
  return fullLecture;
}

function build_prompt(video_content: Data[], previousBulletPoints) {
  console.log("content_build_prompt", video_content);
  const convertedText = cleanLectureText(video_content);
  console.log("convertedText", convertedText);

  const prompt = `
        Previous Bullet Points:

        ${previousBulletPoints}

        Text:
        ${convertedText}
    `;
  console.log("prompt", prompt);
  return prompt;
}

export async function analyse_pdf(
  video_content: Data[],
  openai: utils.OpenAI,
  supabaseClient: any,
  roomId: string,
  individualisationPrompt: string,
  lastBulletpoints?: Bulletpoint[]
) {
  console.log("content", video_content);
  let previousBulletPoints;
  if (lastBulletpoints === undefined) {
    const { data, error } = await supabaseClient
      .from("bulletpoints")
      .select("*")
      .eq("room_id", roomId);

    // If there are already bullet points, return them
    previousBulletPoints = data.length > 0 ? data[0].bulletpoints : undefined;
  } else {
    previousBulletPoints = lastBulletpoints;
  }

  const prompt = build_prompt(video_content, previousBulletPoints);

  const bulletPoints = (
    await openai.query(lecturePrompt, [individualisationPrompt, prompt])
  ).map((bulletpoint, idx) => ({
    ...bulletpoint,
    id: `${idx}`,
  })) as Bulletpoint[];

  return { bullet_points: bulletPoints };
}
