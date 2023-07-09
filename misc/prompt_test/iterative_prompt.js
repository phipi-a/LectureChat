const fs = require("fs");
const tiktoken = require("@dqbd/tiktoken");
const utils = require("./utils");

const openaiApiKey = "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";

// Load video content
// Format:
// [
//   {
//     "data": "Hello World",
//     "video_start_s": 0
//   },
// ]
const video_content = require("./raw/example_video_long_repr_learning.json");

const sectionsPrompt = fs.readFileSync("./prompts/sections_prompt.txt", "utf8");
const bulletPrompt = fs.readFileSync(
  "./prompts/subsection_bullet_points_prompt.txt",
  "utf8"
);

function cut_into_sections(video_content, sections) {
  let video_sections = [];
  console.log(video_content);
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const start = section.start;

    // Not last section
    if (i < sections.length - 1) {
      video_sections.push({
        section_name: section.content,
        content: video_content.filter((subtitle) => {
          console.log(subtitle.timeSec, start, sections[i + 1].start + 120);
          return (
            subtitle.timeSec >= start &&
            subtitle.timeSec < sections[i + 1].start + 30
          );
        }),
      });
    } else {
      video_sections.push({
        section_name: section.content,
        content: video_content.filter((subtitle) => subtitle.timeSec >= start),
      });
    }
  }

  return video_sections;
}

async function queryGPT(system_prompt, prompt) {
  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    body: JSON.stringify({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: prompt },
      ],
    }),
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const data = await response.json();

  try {
    const rawResponse = data.choices[0]["message"]["content"];
    return JSON.parse(rawResponse);
  } catch (e) {
    if (e instanceof SyntaxError) {
      // If the response is not JSON, just return the raw response
      console.log("Response is not JSON, returning raw response");
      console.log(rawResponse);
    }

    console.error("Response", data);
    console.error("Error", e);

    if (data.choices && data.choices[0]) {
      console.log(data.choices[0]["message"]["content"]);
    }
  }
}

async function analyse_video(video_content, title) {
  const segments = utils.cleanText(video_content);
  const converted_text = utils.segments_to_string(segments);

  console.log("Cleaned text");
  console.log("Querying GPT");
  const sectionsRaw = await queryGPT(sectionsPrompt, converted_text);
  console.log("Got sections");

  fs.writeFileSync(
    `./output/long_example_video_sections.json`,
    JSON.stringify(sectionsRaw)
  );

  const sections = sectionsRaw.map((section) => {
    return {
      content: section.title,
      start: utils.convert_min_sec_to_seconds(section.start),
      end: utils.convert_min_sec_to_seconds(section.end),
    };
  });

  console.log("Cutting into sections");
  const video_sections = cut_into_sections(segments, sections);
  console.log("Cutted into sections");
  console.log(video_sections);

  // write sections to file
  let prev_summary = "";
  for (let i = 0; i < video_sections.length; i++) {
    console.log("Section", i, video_sections[i].section_name);
    const currentSection = utils.segments_to_string(video_sections[i].content);

    fs.writeFileSync(
      `./output/long_example_video_${i}_section.txt`,
      currentSection
    );

    const prompt_content = `${
      prev_summary == "" ? "" : "Summary: " + prev_summary
    }\n\n${currentSection}`;

    const res = await queryGPT(bulletPrompt, prompt_content);

    prev_summary = res.summary;
    const bullet_points = res.bullet_points;

    fs.writeFileSync(
      `./output/bp/long_example_video_${i}_summary.json`,
      JSON.stringify(bullet_points)
    );

    console.log("Summary", res.summary);
    console.log("Bullet points", bullet_points);
  }
}

analyse_video(video_content, "Example video");
