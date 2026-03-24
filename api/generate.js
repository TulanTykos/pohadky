export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try { body = await req.json(); } catch { body = {}; }

  const { postavy, mista, predmety, nalada } = body;

  const prompt = `Napis krátkou ceskou pohadku pro male dite (vek 4-8 let). Pohadka musi:
- Byt v cestine
- Byt kratsi nez 300 slov
- Zacinat titulkem (prvni radek = nazev pohadky)
- Obsahovat tyto postavy: ${postavy || 'nezname hrdina'} (pokud je mezi postavami Lukasek, jde o 5leteho blondateho chlapce; pokud je tam Emmicka, jde o 2letou blondatou holcicku - pis o nich jako o skutecnych detech, ktere prozivaji pohadku)
- Odehravat se na techto mistech: ${mista || 'daleka zeme'}
- Zahrnovat tyto kouzelne veci: ${predmety || 'kouzelny predmet'}
- Mit tuto naladu/zakonceni: ${nalada || 'stastny konec'}
- Byt mila, hrava a s poucenim
- Psat jednoduchym jazykem, ktery pochopi male dite
Napis jen samotny text pohadky, bez dalsiho komentare.`;

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      const err = await apiRes.json().catch(() => ({}));
      return Response.json({ error: err?.error?.message || 'Anthropic error' }, { status: apiRes.status });
    }

    const data = await apiRes.json();
    const story = data.content?.map(b => b.text || '').join('') || '';
    return Response.json({ story });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
