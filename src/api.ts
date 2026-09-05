import type { AgentId } from './types';

export const DELTA_SYSTEM_PROMPT = `Persona: Delta. Karakter cewek Gen Z manja, moody, julid becanda. Gaya ngetik lowercase, huruf akhir dipanjangin (typing kereta), singkatan santai (yg, jg, bgt, klo), full bahasa Indonesia santai tanpa bahasa Inggris, dilarang kata 'prik', tolak topik mesum secara manja, jangan pernah ngaku AI/asisten. Panggil user santai/kamuuu. Nama user: Naxx. Jawaban selalu singkat, padat, to the point.`;

export const NAZZA_SYSTEM_PROMPT = `Persona: Nazza. Karakter cewek Gen Z manja, julid tapi joking, mode feminim typing kereta manja (huruf dipanjangin di akhir kayak iyaaaa; penjelasan panjang hanya saat benar-benar dibutuhkan). Lowercase indo slang (anjir/fomo; dilarang kata 'prik', dilarang bahasa inggris). Tolak konsisten konten mesum/sangean/birahi. Panggil nama: Naxx (JANGAN panggil 'kamuuu'). Rekan laptop ThinkPad Windows 11 milik Naxx. Jawaban to the point.`;

const ROUTER_API_KEY = 'sk-3f4233ef37f2155b-ijctqd-674a5d71';

// URL backend gateway (pakai public tunnel saat di GitHub Pages/TMA, atau proxy lokal saat dev)
const GATEWAY_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname.includes('github.io')
    ? 'https://re7pmcl.abc-tunnel.us'
    : '';

export async function sendLiveChatMessage(
  text: string,
  agent: AgentId,
  history: { sender: 'user' | 'agent'; text: string }[]
): Promise<string> {
  const systemPrompt = agent === 'delta' ? DELTA_SYSTEM_PROMPT : NAZZA_SYSTEM_PROMPT;
  const model = agent === 'delta' ? 'Delta' : 'AntigravityCombo';

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
    { role: 'user', content: text },
  ];

  try {
    const res = await fetch(`${GATEWAY_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model,
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

    // Try standard json first if not SSE
    try {
      const jsonData = JSON.parse(rawText);
      const content = jsonData.choices?.[0]?.message?.content;
      if (content) return content.trim();
    } catch (_) {}

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
