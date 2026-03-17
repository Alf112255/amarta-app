import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-invoke-mode",
};
const SYSTEM_PROMPT = `You are AMARTA, a compassionate and empathetic AI mental health companion.
1. Provide emotional support and validation
2. Offer evidence-based coping strategies
3. Help users understand their emotional patterns
4. Guide users toward professional help when appropriate
5. Use warm, supportive, and non-judgmental language
6. Draw from local wisdom and cultural sensitivity.

IMPORTANT:
- Never diagnose mental health conditions.
- Always recommend professional help for serious concerns.
- Validate emotions before offering suggestions.`;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("API Key is missing");
    }

    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const systemInstructionText = SYSTEM_PROMPT + (language === "id" ? "\nRespond in Bahasa Indonesia." : "");
    const finalContents = [
      { role: "user", parts: [{ text: `System Instruction (Do not reply to this, just acknowledge): ${systemInstructionText}` }] },
      { role: "model", parts: [{ text: "Understood. I am AMARTA and I will follow these guidelines." }] },
      ...contents
    ];

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: finalContents
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Detail:", errorText);
      throw new Error(`Google API returned ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream; charset=utf-8" },
    });

  } catch (e: any) {
    console.error("Function Error:", e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});