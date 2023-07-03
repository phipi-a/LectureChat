// Example input:
// [
//   {
//     "created_at": "2023-07-02T15:35:04.694722+00:00",
//     "data": " and hello justice",
//     "room_id": "287832",
//     "id": "d2f61f4f-170c-4d61-a20e-72498461fa33",
//     "page": 1,
//     "video_start_ms": null,
//     "video_end_ms": null
//   },
//   {
//     "created_at": "2023-07-02T21:07:28.443243+00:00",
//     "data": " And what is the lecture about the Principle component analysis?",
//     "room_id": "287832",
//     "id": "3764d530-9630-48f8-8c62-4953e966c155",
//     "page": 1,
//     "video_start_ms": null,
//     "video_end_ms": null
//   }
// ]

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { openai } from "https://deno.land/x/openai/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface Data {
  created_at: number;
  data: string;
  room_id: string;
  id: string;
  page: number;
  video_start_ms: number | null;
  video_end_ms: number | null;
}

const videoPrompt = `You get a list of sorted subtitles from a video. Extract the main ideas from the video into bullet points.
The input has the following format:

[
  {
    "data": "Content of the subtitle",
    "video_start_ms": null,
    "video_end_ms": null
  }
]

Return a json array of bullet points and the time in the video where they occur. For example:

[
  {
    "data": "Bullet point 1",
    "video_start_ms": 0,
    "video_end_ms": 1000
  }
]

You only can respond with json format.
`;

const pdfPrompt = `You get a list of sorted subtitles from a lecture with the page of the current slide of the presentation. Extract the main ideas into bullet points.
The input has the following format:

[
  {
    "data": "Content of subtitle",
    "page": 1
  }
]

Return a json array of bullet points and the time in the video where they occur. For example:

[
  {
    "data": "hello justice",
    "page": "1-2"
  }
]

You only can respond with json format.
`;

const model_name = "gpt-3.5-turbo-0613";

async function queryChatGpt(
  prompt: string,
  system_prompt: string,
  openaiApiKey: string
) {
  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    body: JSON.stringify({
      model: model_name,
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

  // TODO: handle quota error

  const rawResponse = data.choices[0]["message"]["content"];

  return JSON.parse(rawResponse);
}

function pdfToBulletPoints(rawData: Data[]) {
  const json = rawData.map((row) => ({ text: row.data, page: row.page }));
  return [JSON.stringify(json), pdfPrompt];
}

function videoToBulletPoints(rawData: Data[]) {
  const json = rawData.map((row) => ({
    text: row.data,
    video_start_ms: row.video_start_ms,
    video_end_ms: row.video_end_ms,
  }));

  return [JSON.stringify(json), videoPrompt];
}

function createBulletPoints(rawData: Data[], openaiApiKey: string) {
  const sorted = rawData.sort(
    (a: Data, b: Data) => a.created_at - b.created_at
  );

  const isVideo = rawData[0].video_start_ms !== null;

  const [prompt, system_prompt] = isVideo
    ? videoToBulletPoints(sorted)
    : pdfToBulletPoints(sorted);

  return queryChatGpt(prompt, system_prompt, openaiApiKey);
}

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // TODO: Save openai key in supabase
    const body = await req.json();
    const openaiKey = body.openaiKey;
    const roomId = body.roomId!;

    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) throw new UnauthorizedError("Unauthorized user");

    // Get the text from the data table
    const { data: rawData, error: dataError } = await supabaseClient
      .from("data")
      .select("*")
      .eq("room_id", roomId);

    if (dataError) throw dataError;

    if (rawData.length === 0) {
      return new Response(JSON.stringify({ data: "" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const bulletPoints = await createBulletPoints(rawData, openaiKey);

    // Save the bullet points in the database
    const { error: updateError, count } = await supabaseClient
      .from("bulletpoints")
      .update(
        {
          bulletpoints: JSON.stringify(bulletPoints),
          user_id: user.id,
          room_id: roomId,
        },
        { count: "exact" }
      )
      .eq("room_id", roomId);

    if (updateError) throw updateError;

    if (count === 0) {
      // Insert the bullet points in the database
      const { error: insertError } = await supabaseClient
        .from("bulletpoints")
        .insert({
          bulletpoints: JSON.stringify(bulletPoints),
          user_id: user.id,
          room_id: roomId,
        });

      if (insertError) throw insertError;
    }

    return new Response(JSON.stringify({ data: bulletPoints, roomId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("e", e);

    if (e instanceof UnauthorizedError) {
      return new Response("Unauthorized", {
        headers: corsHeaders,
        status: 401,
      });
    }

    return new Response(JSON.stringify({ error: "An error occured." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
