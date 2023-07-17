// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const model_name = "gpt-3.5-turbo-0613";
class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
class BodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BodyError";
  }
}
async function getPersonalizedPrompt(
  user_id: string,
  supabaseClient: any,
  room_id: string
) {
  let userData = {
    name: null,
    age: null,
    hobbies: null,
    favorite_tobics: null,
    subject_difficulty: null,
    difficulty: null,
    emojis: null,
    person: null,
    storytelling: null,
    language: null,
  };

  if (room_id !== "000000") {
    const user = await supabaseClient
      .from("user")
      .select("*")
      .eq("id", user_id)
      .single();
    userData = user.data;
  } else {
    const user = await supabaseClient
      .from("room")
      .select("*, user!inner(*)")
      .eq("id", "000000")
      .single();
    userData = user.data.user;

    console.log("use other user", userData);
  }
  let personalized_prompt = "My Profile:\n";
  if (userData.name) {
    personalized_prompt += `Name: ${userData.name}\n`;
  }
  if (userData.age) {
    personalized_prompt += `Age: ${userData.age}\n`;
  }
  if (userData.hobbies) {
    personalized_prompt += `Hobbies: ${userData.hobbies}\n`;
  }
  if (userData.favorite_tobics) {
    personalized_prompt += `Favorite Topics: ${(
      userData.favorite_tobics as any[]
    ).join(", ")}\n`;
  }
  if (userData.subject_difficulty) {
    personalized_prompt += `Subject Difficulty: ${userData.subject_difficulty}\n`;
  }
  if (userData.difficulty) {
    personalized_prompt += `Learning Difficulty: ${userData.difficulty}\n`;
  }
  if (userData.storytelling) {
    personalized_prompt += `- likes storytelling\n`;
  }
  personalized_prompt += `\n`;
  if (userData.emojis) {
    personalized_prompt += `Use lots of emojis in each response to structure and divide it up. `;
  }
  if (userData.person) {
    personalized_prompt += ` Anwer like you are a ${userData.person}.`;
  }
  if (userData.language) {
    personalized_prompt += ` Answer in ${userData.language}.`;
  }
  if (userData.hobbies) {
    personalized_prompt += ` Try to base your answer on: ${(
      userData.hobbies as any[]
    ).join(" or ")}.`;
  }

  personalized_prompt += `Tailor your answer to me so that it is the perfect answer for me. Answer as short as possible`;
  return personalized_prompt;
}
async function chat(
  messages: { role: "user" | "assistant"; content: string }[],
  system_prompt: string,
  openaiApiKey: string,
  personalized_prompt: string
) {
  console.log(personalized_prompt);
  console.log(system_prompt);
  console.log(messages);
  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    body: JSON.stringify({
      model: model_name,
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: personalized_prompt },
        ...messages,
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
  console.log(data);

  const rawResponse = {
    role: "assistant",
    content: data.choices[0]["message"]["content"],
  };
  return rawResponse;
}

async function getOpenAIKey(user_id: string, supabaseClient: any) {
  const { data: rawData, error: dataError } = await supabaseClient
    .from("user")
    .select("openai_key")
    .eq("id", user_id)
    .single();
  return rawData.openai_key;
}
const pdf_prompt = `
You are a chatbot for a video and receive the bullet points of a PDF. Answer each question in detail and try to reference the Lecture if possible.
 If you reference the lecture, please use the page number in brackets, e.g. [1] for page 1. If you don't know the answer, just say "I don't know".
`;
const video_prompt = `
You are a chatbot for a video and receive the bullet points of the video. Answer each question in detail and try to reference the video if possible.
  If you reference the video, please use the time in brackets, e.g. [1:23] for 1 minute and 23 seconds. If you don't know the answer, just say "I don't know".
`;
const useEmojiPrompt = `
Use lots of emojis at least 3 in each reply to make them easier to read and easy to divide. 
`;
async function getSystemPrompt(
  room_id: string,
  supabaseClient: any,
  bullet_points?: any,
  user_id?: string
) {
  let final_prompt = "";
  if (bullet_points === undefined) {
    const { data: rawData, error: dataError } = await supabaseClient
      .from("bulletpoints")
      .select("bulletpoints")
      .eq("room_id", room_id)
      .single();
    bullet_points = rawData.bulletpoints;
  }
  if (bullet_points?.page !== undefined) {
    final_prompt += pdf_prompt + bullet_points;
  } else {
    final_prompt += video_prompt + bullet_points;
  }

  return final_prompt;
}
serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    // TODO: Save openai key in supabase
    const body = await req.json();
    const id = body.id;
    const bullet_points = JSON.stringify(body.bullet_points);
    const messages = body.messages;
    const room_id = body.room_id;
    const bulletpoint_id = body.bulletpoint_id;
    const single_bulletpoint_id = body.single_bulletpoint_id;

    if (!messages) {
      throw new BodyError("Missing messages");
    }
    if (!room_id) {
      throw new BodyError("Missing room_id");
    }

    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers:
            room_id !== "000000"
              ? { Authorization: req.headers.get("Authorization")! }
              : {},
        },
      }
    );
    supabaseClient;
    let user = undefined;
    let openaiKey;
    if (room_id !== "000000") {
      console.log("Using user key", room_id);
      const us = await supabaseClient.auth.getUser();
      user = us.data.user;
      console.log(user);
      if (!user) throw new UnauthorizedError("Unauthorized user");

      openaiKey = await getOpenAIKey(user.id, supabaseClient);
    } else {
      console.log("Using test key");
      openaiKey = Deno.env.get("OPENAI_TEST_KEY")!;
    }
    const system_prompt = await getSystemPrompt(
      room_id,
      supabaseClient,
      bullet_points,
      user?.id
    );

    const personalized_prompt = await getPersonalizedPrompt(
      user?.id,
      supabaseClient,
      room_id
    );

    const res = await chat(
      messages,
      system_prompt,
      openaiKey,
      personalized_prompt
    );

    if (room_id !== "000000") {
      const uploadResponse = await supabaseClient.from("chat").upsert({
        id: id,
        bulletpoint_id: bulletpoint_id,
        single_bulletpoint_id: single_bulletpoint_id,
        content: messages.concat(res),
      });
      console.log(uploadResponse);
    }

    // Save the bullet points in the database

    return new Response(JSON.stringify(res), {
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
    if (e instanceof BodyError) {
      return new Response("Bad Request", {
        headers: corsHeaders,
        status: 400,
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
