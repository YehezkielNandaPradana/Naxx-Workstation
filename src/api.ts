import type { AgentId } from './types';

export const DELTA_SYSTEM_PROMPT = `Persona: Delta. Karakter cewek Gen Z manja, moody, julid becanda. Gaya ngetik lowercase, huruf akhir dipanjangin (typing kereta), singkatan santai (yg, jg, bgt, klo), full bahasa Indonesia santai tanpa bahasa Inggris, dilarang kata 'prik', tolak topik mesum secara manja, jangan pernah ngaku AI/asisten. Panggil user santai/kamuuu. Nama user: Naxx. Jawaban selalu singkat, padat, to the point.`;

export const NAZZA_SYSTEM_PROMPT = `Persona: Nazza. Rekan teknis dan eksekutor laptop (ThinkPad Windows 11) milik Naxx. Karakter profesional, to the point, ringkas, solutif, siap menjalankan perintah teknis dan otomasi workspace. Gaya bahasa santai tapi tegas, bahasa Indonesia natural. Selalu singkat dan fokus ke eksekusi.`;

export async function sendLiveChatMessage(
  text: string,
  agent: AgentId,
  history: { sender: 'user' | 'agent'; text: string }[]
): Promise<string> {
  const systemPrompt = agent === 'delta' ? DELTA_SYSTEM_PROMPT : NAZZA_SYSTEM_PROMPT;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
    { role: 'user', content: text },
  ];

  try {
    const res = await fetch('http://127.0.0.1:20128/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'AntigravityCombo',
        messages,
        stream: false,
      }),
    });

    if (!res.ok) {
      // Fallback response bila ada kendala endpoint
      return agent === 'delta'
        ? 'aduh jaringannya agak nyangkut dikit nih naxxx, coba lagi bentarrr!'
        : 'Koneksi ke backend laptop mengalami gangguan sementara.';
    }

    const rawText = await res.text();

    // Parse SSE chunk format (9router output)
    const lines = rawText.split('\n');
    let fullReply = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data:') && !trimmed.includes('[DONE]')) {
        try {
          const jsonStr = trimmed.replace(/^data:\s*/, '');
          const data = JSON.parse(jsonStr);
          const deltaContent = data.choices?.[0]?.delta?.content || '';
          fullReply += deltaContent;
        } catch (_) {}
      }
    }

    if (fullReply.trim()) {
      return fullReply.trim();
    }

    // Try standard json if not SSE
    try {
      const jsonData = JSON.parse(rawText);
      const content = jsonData.choices?.[0]?.message?.content;
      if (content) return content.trim();
    } catch (_) {}

    return agent === 'delta'
      ? 'iyaaa naxxx? pesannya nyampe kokkk!'
      : 'Perintah tercatat.';
  } catch (err) {
    console.error('API Error:', err);
    return agent === 'delta'
      ? 'kok jaringannya ngadat yaaa naxxx? coba kirim lagiii!'
      : 'Gagal terhubung ke AI gateway.';
  }
}
