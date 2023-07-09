import { Bulletpoint, Data } from "./interfaces.ts";
import * as utils from "./utils.ts";
import lecturePrompt from "./prompts/lecture.ts";

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
}

function build_prompt(video_content: Data[], previousBulletPoints) {
  const convertedText = cleanLectureText(video_content);

  const prompt = `
        Previous Bullet Points:

        ${previousBulletPoints}

        Text:
        ${convertedText}
    `;

  return prompt;
}

export async function analyse_pdf(
  video_content: Data[],
  openai: utils.OpenAI,
  supabaseClient: any,
  roomId: string
) {
  const { data, error } = await supabaseClient
    .from("bulletpoints")
    .select("*")
    .eq("room_id", roomId);

  // If there are already bullet points, return them
  const previousBulletPoints =
    data.length > 0 ? data[0].bulletpoints : undefined;

  const prompt = build_prompt(video_content, previousBulletPoints);

  const bulletPoints = (await openai.query(
    lecturePrompt,
    prompt
  )) as Bulletpoint[];
  console.log(bulletPoints);
  const bulletPointsWithId = bulletPoints.map((bulletpoint, idx) => ({
    ...bulletpoint,
    id: `${idx}`,
  }));

  return bulletPointsWithId;
}
