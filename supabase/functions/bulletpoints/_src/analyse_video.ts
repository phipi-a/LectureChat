import {
  Bulletpoint,
  BulletpointSection,
  BulletpointWithID,
  Data,
  Section,
  SectionWithSeconds,
  Segment,
  VideoBulletPoints,
} from "./interfaces.ts";
import * as utils from "./utils.ts";
import shortVideoPrompt from "./prompts/short_video.ts";
import {
  subsectionBulletPointPrompt,
  subsectionPrompt,
} from "./prompts/long_video.ts";

function cut_into_sections(
  video_content: Segment[],
  sections: SectionWithSeconds[]
) {
  const video_sections: {
    section_name: string;
    content: Segment[];
  }[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const start = section.start;

    // Not last section
    if (i < sections.length - 1) {
      video_sections.push({
        section_name: section.title,
        content: video_content.filter((subtitle) => {
          return (
            subtitle.timeSec >= start &&
            subtitle.timeSec < sections[i + 1].start + 30
          );
        }),
      });
    } else {
      video_sections.push({
        section_name: section.title,
        content: video_content.filter((subtitle) => subtitle.timeSec >= start),
      });
    }
  }

  return video_sections;
}

async function analyse_short(
  video_content: Data[],
  openai: utils.OpenAI,
  individualisationPrompt: string
) {
  const segments = utils.cleanText(video_content);
  const convertedText = utils.segments_to_string(segments);
  const bulletPoints = (
    await openai.query(shortVideoPrompt, [
      individualisationPrompt,
      convertedText,
    ])
  ).map((bulletpoint, idx) => ({
    ...bulletpoint,
    id: `${idx}`,
  }));

  return {
    isLong: false,
    bullet_points: bulletPoints,
  } as VideoBulletPoints;
}

async function analyse_long(
  video_content: Data[],
  openai: utils.OpenAI,
  individualisationPrompt: string
) {
  const segments = utils.cleanText(video_content);
  const convertedText = utils.segments_to_string(segments);

  // Get time sections of video
  const sectionsRaw = (await openai.query(subsectionPrompt, [
    convertedText,
  ])) as Section[];

  const sections = sectionsRaw.map((section) => {
    return {
      title: section.title,
      start: utils.convert_min_sec_to_seconds(section.start),
      end: utils.convert_min_sec_to_seconds(section.end),
    };
  }) as SectionWithSeconds[];

  // Get raw content of each section
  const video_sections = cut_into_sections(segments, sections);

  // Get bullet points for each section

  const bulletpoints = {
    isLong: true,
    sections: [] as BulletpointSection[],
  } as VideoBulletPoints;

  let prev_summary = "";
  for (let i = 0; i < video_sections.length; i++) {
    const section = sectionsRaw[i];
    const current = utils.segments_to_string(video_sections[i].content);

    const prompt_content = `${
      prev_summary == "" ? "" : "Summary: " + prev_summary
    }\n\n${current}`;

    const res = await openai.query(subsectionBulletPointPrompt, [
      individualisationPrompt,
      prompt_content,
    ]);

    prev_summary = res.summary;
    const bulletPoints = res.bullet_points.map((bulletpoint, idx) => ({
      ...bulletpoint,
      id: `${i}-${idx}`,
    }));

    bulletpoints.sections!.push({
      title: section.title,
      start: section.start,
      end: section.end,
      bullet_points: bulletPoints,
    });
  }

  return bulletpoints;
}

export async function analyse_video(
  video_content: Data[],
  openai: utils.OpenAI,
  individualisationPrompt: string
) {
  const length = video_content[video_content.length - 1].video_end_ms;
  const maxLength = 60 * 20; // 20 minutes

  if (length && length > maxLength) {
    return await analyse_long(video_content, openai, individualisationPrompt);
  } else {
    return await analyse_short(video_content, openai, individualisationPrompt);
  }
}
