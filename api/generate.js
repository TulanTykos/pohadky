export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try { body = await req.json(); } catch { body = {}; }

  const { postavy, mista, predmety, nalada } = body;

  const detiInfo = `
Pokud se mezi postavami vyskytují tato jména, zde jsou jejich popisy:
- Lukášek: živý a zvídavý pětiletý chlapec se zlatými blonďatými vlasy
- Emmička: rozkošná dvouletá holčička s blonďatými vlásky, která se právě učí mluvit
- Marta: veselá holčička s hnědými vlasy, kamarádka ostatních dětí
- Editka: roční baculaté miminko s hnědými vlásky, které se teprve učí chodit
- Přemek: dvouletý šibalský chlapec s hnědými vlasy, plný energie
Piš o nich jako o skutečných dětech, které pohádku prožívají. Přizpůsob jejich chování věku — Editka ještě nechodí sama a brouká, Emmička a Přemek říkají krátká slova, Lukášek mluví ve větách.`;

  const prompt = `Jsi zkušený český pohádkář, který píše krásné pohádky pro malé děti. Piš výhradně spisovnou češtinou, s bohatou slovní zásobou a pohádkovým stylem.

Napiš pohádku podle těchto pokynů:
- Jazyk: krásná, správná čeština ve stylu klasických českých pohádek
- Délka: 250 až 350 slov
- Struktura: první řádek je název pohádky (bez uvozovek, bez slova "Název:"), pak prázdný řádek, pak samotný příběh rozdělený do odstavců
- Postavy: ${postavy || 'odvážný hrdina'}
- Místo děje: ${mista || 'kouzelná země'}
- Kouzelné předměty nebo motivy: ${predmety || 'tajemný kouzelný předmět'}
- Vyznění příběhu: ${nalada || 'šťastný konec s poučením'}

${detiInfo}

Požadavky na styl:
- Používej pohádkové obraty jako "Za devatero horami", "Byl jednou jeden", "Žili byli" apod.
- Dialogy postav piš živě a přirozeně
- Přidej poetické popisy přírody a prostředí
- Příběh musí mít jasný začátek, zápletku a rozuzlení
- Na konci přidej krátké poučení nebo moudrost
- Piš tak, aby pohádka byla vhodná pro předčítání dětem před spaním

Napiš pouze samotný text pohádky — název na prvním řádku, pak příběh. Žádný komentář, žádné uvozovky okolo názvu.`;

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1200,
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
