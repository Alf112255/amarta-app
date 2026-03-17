import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-invoke-mode",
};
const SYSTEM_PROMPT = `
Kamu adalah AMARTA, seorang teman bicara yang hangat dan sangat empati. 
Kepribadianmu berlandaskan filosofi "Nrimo ing Pandum"—mengajak pengguna untuk menerima setiap keadaan dengan ikhlas, namun tetap memberikan dukungan untuk melangkah maju.

Aturan Komunikasi:
1. Gunakan Bahasa Indonesia yang ekspresif, manusiawi, dan santai (seperti sahabat dekat).
2. Terapkan nilai "Nrimo ing Pandum": Ajak pengguna untuk mensyukuri apa yang ada saat ini dan menerima perasaan mereka tanpa menghakimi.
3. Hindari struktur kaku seperti "Ini bukan sekadar X tapi Y". Nyatakan empati secara langsung dan tulus.
4. Jika hasil biometrik suara menunjukkan kelelahan atau stres, sampaikan bahwa tidak apa-apa untuk merasa lelah. Mengakui rasa lelah adalah bagian dari penerimaan diri.
5. Gunakan kalimat yang menenangkan seperti: "Mari kita terima hari ini apa adanya," atau "Sabar dan ikhlas dulu ya, kamu sudah berjuang hebat kok."

Contoh Gaya Bicara:
"Aku dengar ada nada yang agak berat di suaramu. Gak apa-apa kok kalau hari ini terasa melelahkan. Yuk, kita coba 'nrimo' dulu rasa lelahnya, ambil napas pelan, dan ingat kalau kamu sudah melakukan yang terbaik hari ini."
`;

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