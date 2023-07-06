import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import videoPrompt from "../_shared/prompts/video_prompt.ts";
import pdfPrompt from "../_shared/prompts/video_prompt.ts";
import { UnauthorizedError, BadRequestError } from "../_shared/errors.ts";

interface Data {
  created_at: number;
  data: string;
  room_id: string;
  id: string;
  page: number;
  video_start_ms: number | null;
  video_end_ms: number | null;
}

const format_segments_video = (acc, curr) => {
  return `${acc}${curr.data} [${curr.video_start_ms}] `;
};

const format_segments_pdf = (acc, curr) => {
  return `${acc}${curr.data} [${curr.page}] `;
};

async function queryChatGpt(
  prompt: string,
  system_prompt: string,
  openaiApiKey: string
) {
  const numTokens = (prompt.length + system_prompt.length) / 4; // Token are roughly 4 characters long

  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    body: JSON.stringify({
      model: numTokens < 3000 ? "gpt-3.5-turbo" : "gpt-3.5-turbo-16k",
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
    console.error("Response", data);
    console.error("Error", e);
    throw new BadRequestError(
      "Invalid response from OpenAI. Possible rate limit, insufficient tokens or invalid API key."
    );
  }
}

function pdfToBulletPoints(rawData: Data[]) {
  return [rawData.reduce(format_segments_pdf, ""), videoPrompt];
}

function videoToBulletPoints(rawData: Data[]) {
  return [rawData.reduce(format_segments_video, ""), videoPrompt];
}

async function createBulletPoints(rawData: Data[], openaiApiKey: string) {
  const sorted = rawData.sort(
    (a: Data, b: Data) => a.created_at - b.created_at
  );

  const isVideo = rawData[0].video_start_ms !== null;

  const [prompt, system_prompt] = isVideo
    ? videoToBulletPoints(sorted)
    : pdfToBulletPoints(sorted);

  const bulletpoints = await queryChatGpt(prompt, system_prompt, openaiApiKey);
  return bulletpoints.map((bulletpoint, idx) => ({ ...bulletpoint, id: idx }));
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

    if (e instanceof BadRequestError) {
      return new Response(e.message, {
        headers: corsHeaders,
        status: 400,
      });
    }

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
