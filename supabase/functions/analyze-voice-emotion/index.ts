import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

serve(async (req) => {
  try {
    const { filePath } = await req.json()
    
    // 1. Inisialisasi Supabase Admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Ambil file audio dari Storage
    const { data: fileData, error: downloadError } = await supabaseAdmin
      .storage
      .from('voice-recordings')
      .download(filePath)

    if (downloadError) throw downloadError

    // Konversi audio ke Base64 untuk dikirim ke Gemini
    const arrayBuffer = await fileData.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // 3. Panggil Gemini AI
    const prompt = `Analisis emosi dari suara ini. Berikan output dalam format JSON murni: 
    {
      "mood": "label emosi (misal: Cemas, Tenang, Sedih, Bahagia)",
      "score": angka 0-100 (tingkat stres vokal),
      "summary": "penjelasan singkat dan saran medis/psikologis yang empatik"
    }`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "audio/webm", data: base64Audio } }
          ]
        }]
      })
    })

    const result = await response.json()
    const aiText = result.candidates[0].content.parts[0].text
    const cleanJson = JSON.parse(aiText.replace(/```json|```/g, ''))

    // 4. Simpan hasil ke tabel voice_analyses yang kita buat tadi
    await supabaseAdmin
      .from('voice_analyses')
      .insert({
        file_path: filePath,
        mood_label: cleanJson.mood,
        stress_score: cleanJson.score,
        analysis_summary: cleanJson.summary
      })

    return new Response(JSON.stringify(cleanJson), { headers: { 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})