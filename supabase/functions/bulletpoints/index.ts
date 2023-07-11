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

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const openaiKey = body.openaiKey;
    const roomId = body.roomId!;

    const openai = new OpenAI(openaiKey);
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

    let bulletPoints: BulletpointWithID[] | VideoBulletPoints = [];
    if (rawData.length > 0) {
      const sorted = rawData.sort(
        (a: Data, b: Data) => a.created_at - b.created_at
      );

      const isVideo = rawData[0].video_start_ms !== null;

      if (isVideo) {
        bulletPoints = await analyse_video(sorted, openai);
      } else {
        bulletPoints = await analyse_pdf(
          sorted,
          openai,
          supabaseClient,
          roomId
        );
      }
    }

    // Save the bullet points in the database
    let id = undefined;
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
