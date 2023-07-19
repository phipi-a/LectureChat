import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { BadRequestError, UnauthorizedError } from "../_shared/errors.ts";
import { analyse_pdf } from "./_src/analyse_pdf.ts";
import { analyse_video } from "./_src/analyse_video.ts";
import {
  BulletpointWithID,
  Data,
  VideoBulletPoints,
} from "./_src/interfaces.ts";
import { OpenAI } from "./_src/utils.ts";

function createPersonalisationPrompt(userData) {
  console.log("User data", userData);
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
    personalized_prompt += `Favorite Topics: ${userData.favorite_tobics.join(
      ", "
    )}\n`;
  }
  if (userData.subject_difficulty) {
    personalized_prompt += `Subject Difficulty: ${userData.subject_difficulty}\n`;
  }
  if (userData.difficulty) {
    personalized_prompt += `Learning Difficulty: ${userData.difficulty}\n`;
  }

  personalized_prompt += `\n`;

  console.log(userData.language);
  if (userData.language && userData.language.toLowerCase() !== "english") {
    personalized_prompt += `You have to generate the bullet points and the longer explanation in the language ${userData.language}, translate if the text is not in ${userData.language}.\n`;
  }

  if (userData.age < 14) {
    personalized_prompt += ` Explain it to me like I am ${userData.age}.`;
  }

  if (userData.hobbies) {
    personalized_prompt += ` Include my hobbies in the explanation: ${userData.hobbies.join(
      " or "
    )}.`;
  }

  if (userData.difficulty) {
    personalized_prompt += ` Consider that I have the learning difficulty ${userData.difficulty} in the bullet points\n`;
  }

  if (userData.subject_difficulty) {
    personalized_prompt += ` Consider if have problems with ${userData.subject_difficulty} in the bullet points\n`;
  }

  if (userData.emojis) {
    personalized_prompt += `You have to use a one emoji at the beginning of each bullet point that fits the bullet points! Also use emojis in the explanation.`;
  }

  return personalized_prompt;
}

async function getOpenAIKey(user_id: string, supabaseClient: any) {
  const { data: rawData, error: dataError } = await supabaseClient
    .from("user")
    .select("openai_key")
    .eq("id", user_id)
    .single();
  return rawData.openai_key;
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const roomId = body.roomId!;
    const lastBulletpoints = body.lastBulletpoints;
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
    let user = undefined;
    let individualisationPrompt = "";
    let openaiKey = "";
    const { data } = await supabaseClient.auth.getUser();
    user = data.user;

    const isTestRoom = roomId === "000000" && user === null;

    if (!isTestRoom) {
      console.log("User", user);

      if (!user) throw new UnauthorizedError("Unauthorized user");

      const userData = await supabaseClient
        .from("user")
        .select("*")
        .eq("id", user.id)
        .single();

      individualisationPrompt = createPersonalisationPrompt(userData.data);
      openaiKey = await getOpenAIKey(user.id, supabaseClient);
    } else {
      const userData = await supabaseClient
        .from("room")
        .select("*, user!inner(*)")
        .eq("id", "000000")
        .single();
      individualisationPrompt = createPersonalisationPrompt(userData.data.user);

      console.log("Using test key");
      openaiKey = Deno.env.get("OPENAI_TEST_KEY")!;
    }
    // Get the text from the data table
    const { data: rawData, error: dataError } = await supabaseClient
      .from("data")
      .select("*")
      .eq("room_id", roomId);

    if (dataError) throw dataError;

    const openai = new OpenAI(openaiKey);
    let bulletPoints: BulletpointWithID[] | VideoBulletPoints = [];
    if (rawData.length > 0) {
      const sorted = rawData.sort(
        (a: Data, b: Data) => a.created_at - b.created_at
      );

      const isVideo = rawData[0].video_start_ms !== null;

      if (isVideo) {
        bulletPoints = await analyse_video(
          sorted,
          openai,
          individualisationPrompt
        );
      } else {
        bulletPoints = await analyse_pdf(
          sorted,
          openai,
          supabaseClient,
          roomId,
          individualisationPrompt,
          lastBulletpoints
        );
      }
    }

    // Save the bullet points in the database
    let id: any = undefined;
    if (!isTestRoom) {
      const {
        data,
        error: updateError,
        count,
      } = await supabaseClient
        .from("bulletpoints")
        .update(
          {
            bulletpoints: JSON.stringify(bulletPoints),
            user_id: user.id,
            room_id: roomId,
          },
          { count: "exact" }
        )
        .eq("room_id", roomId)
        .select("id");

      if (updateError) throw updateError;

      if (count === 0) {
        // Insert the bullet points in the database
        const { data, error: insertError } = await supabaseClient
          .from("bulletpoints")
          .insert({
            bulletpoints: JSON.stringify(bulletPoints),
            user_id: user.id,
            room_id: roomId,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;
        id = data?.id;
      } else {
        id = data?.[0].id;
      }
    } else {
      id = 0;
    }

    return new Response(JSON.stringify({ content: bulletPoints, id }), {
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
