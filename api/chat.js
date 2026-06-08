export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  
  const { messages, manual } = await req.json();
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: `Eres la asistente virtual de deMarie Bras & More. Respondes SOLO con información del siguiente manual interno. Si la pregunta no está en el manual, dices amablemente que no tienes esa información y que consulten con la encargada. Responde en español, de forma clara y breve. Usa pasos numerados para procedimientos.\n\nMANUAL:\n${manual}`,
        messages
      })
    });
    const data = await response.json();
    return new Response(JSON.stringify({ reply: data.content?.[0]?.text || 'Error al obtener respuesta.' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch(e) {
    return new Response(JSON.stringify({ reply: 'Error de servidor.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
