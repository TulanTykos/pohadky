import { NextResponse } from 'next/server';

export const config = { runtime: 'edge' };

const HTML = `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pohádkový Generátor ✨</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<style>
  :root {
    --gold:#f0c040;--gold-dark:#c8960a;--deep:#1a0a2e;--pink:#e84393;
    --teal:#00c9b1;--cream:#fdf6e3;--card-bg:rgba(255,255,255,0.07);
    --card-border:rgba(240,192,64,0.3);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;background:var(--deep);background-image:radial-gradient(ellipse at 20% 20%,#2d1b69 0%,transparent 55%),radial-gradient(ellipse at 80% 80%,#1a0a2e 0%,transparent 55%),radial-gradient(ellipse at 60% 10%,rgba(232,67,147,.15) 0%,transparent 40%);font-family:'Lora',serif;color:var(--cream);overflow-x:hidden}
  .stars{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
  .star{position:absolute;background:white;border-radius:50%;animation:twinkle var(--dur) ease-in-out infinite var(--delay)}
  @keyframes twinkle{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}}
  .container{position:relative;z-index:1;max-width:960px;margin:0 auto;padding:2rem 1.5rem 4rem}
  header{text-align:center;padding:2.5rem 0 2rem}
  .title-main{font-family:'Cinzel Decorative',cursive;font-size:clamp(1.8rem,5vw,3.2rem);color:var(--gold);text-shadow:0 0 30px rgba(240,192,64,.6),0 2px 4px rgba(0,0,0,.8);line-height:1.2}
  .title-sub{font-size:1.05rem;color:rgba(253,246,227,.7);margin-top:.6rem;font-style:italic}
  .magic-line{width:200px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:1.2rem auto 0}
  .step-label{font-family:'Cinzel Decorative',cursive;font-size:.85rem;color:var(--gold);letter-spacing:.1em;margin-bottom:1rem;display:flex;align-items:center;gap:.6rem}
  .step-label::before,.step-label::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold-dark))}
  .step-label::after{background:linear-gradient(90deg,var(--gold-dark),transparent)}
  .category{margin-bottom:2.5rem}
  .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:.9rem}
  .card{background:var(--card-bg);border:2px solid var(--card-border);border-radius:16px;padding:.8rem .5rem;cursor:pointer;transition:all .25s ease;text-align:center;position:relative;overflow:hidden;user-select:none;backdrop-filter:blur(4px)}
  .card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(240,192,64,.15),transparent 70%);opacity:0;transition:opacity .25s}
  .card:hover{transform:translateY(-4px) scale(1.04);border-color:rgba(240,192,64,.6)}
  .card:hover::before{opacity:1}
  .card.selected{border-color:var(--gold);background:rgba(240,192,64,.18);transform:translateY(-4px) scale(1.06);box-shadow:0 0 20px rgba(240,192,64,.4),0 8px 24px rgba(0,0,0,.4)}
  .card.selected::before{opacity:1}
  .card-emoji{font-size:2.6rem;line-height:1;display:block;margin-bottom:.4rem;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))}
  .card-label{font-size:.72rem;color:rgba(253,246,227,.85);line-height:1.3}
  .card.selected .card-label{color:var(--gold);font-weight:600}
  .check-badge{position:absolute;top:5px;right:5px;width:18px;height:18px;background:var(--gold);border-radius:50%;display:none;align-items:center;justify-content:center;font-size:.6rem;color:var(--deep);font-weight:bold}
  .card.selected .check-badge{display:flex}
  .special-card{border-color:rgba(232,67,147,.5);background:rgba(232,67,147,.08)}
  .special-card::after{content:"⭐";position:absolute;top:4px;left:6px;font-size:.7rem}
  .special-card:hover{border-color:rgba(232,67,147,.9)}
  .special-card.selected{border-color:#e84393;background:rgba(232,67,147,.25);box-shadow:0 0 24px rgba(232,67,147,.5),0 8px 24px rgba(0,0,0,.4)}
  .special-glow{position:absolute;inset:0;border-radius:14px;background:radial-gradient(circle at 50% 0%,rgba(232,67,147,.2),transparent 70%)}
  .card-sublabel{font-size:.62rem;color:rgba(253,246,227,.55);font-style:italic;display:block;margin-top:.15rem}
  .special-card.selected .card-sublabel{color:rgba(255,180,220,.8)}
  .selected-summary{background:rgba(255,255,255,.04);border:1px solid var(--card-border);border-radius:14px;padding:1rem 1.2rem;margin:0 0 2rem;min-height:56px;display:flex;align-items:center;flex-wrap:wrap;gap:.5rem}
  .summary-label{font-size:.8rem;color:rgba(253,246,227,.5);font-style:italic;margin-right:.4rem}
  .tag{background:rgba(240,192,64,.2);border:1px solid rgba(240,192,64,.4);border-radius:20px;padding:.25rem .7rem;font-size:.78rem;color:var(--gold)}
  .generate-btn{display:block;margin:0 auto 2.5rem;padding:1rem 3rem;font-family:'Cinzel Decorative',cursive;font-size:1.1rem;color:var(--deep);background:linear-gradient(135deg,var(--gold),#ffda70,var(--gold-dark));border:none;border-radius:50px;cursor:pointer;box-shadow:0 4px 30px rgba(240,192,64,.5),0 2px 8px rgba(0,0,0,.4);transition:all .3s ease;position:relative;overflow:hidden}
  .generate-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.3),transparent);border-radius:inherit}
  .generate-btn:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 8px 40px rgba(240,192,64,.7)}
  .generate-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .story-box{background:linear-gradient(160deg,rgba(45,27,105,.6),rgba(26,10,46,.8));border:1px solid rgba(240,192,64,.4);border-radius:20px;padding:2.5rem;position:relative;display:none;animation:fadeInUp .6s ease;box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .story-box.visible{display:block}
  @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  .story-box::before{content:'✦ Pohádka ✦';position:absolute;top:-.75rem;left:50%;transform:translateX(-50%);background:var(--deep);padding:0 1rem;font-family:'Cinzel Decorative',cursive;font-size:.75rem;color:var(--gold);letter-spacing:.15em;white-space:nowrap}
  .story-title{font-family:'Cinzel Decorative',cursive;font-size:1.3rem;color:var(--gold);text-align:center;margin-bottom:1.5rem;line-height:1.4}
  .story-text{line-height:1.9;font-size:1.02rem;color:var(--cream)}
  .story-text p{margin-bottom:1em}
  .loading-dots{display:flex;justify-content:center;gap:.5rem;padding:2rem 0}
  .dot{width:10px;height:10px;background:var(--gold);border-radius:50%;animation:bounce 1.2s ease-in-out infinite}
  .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
  @keyframes bounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1.2);opacity:1}}
  .reset-btn{display:block;margin:1.5rem auto 0;background:transparent;border:1px solid rgba(240,192,64,.4);color:rgba(253,246,227,.6);padding:.5rem 1.5rem;border-radius:30px;cursor:pointer;font-family:'Lora',serif;font-size:.85rem;transition:all .2s}
  .reset-btn:hover{color:var(--gold);border-color:var(--gold)}
  @media(max-width:600px){.cards-grid{grid-template-columns:repeat(auto-fill,minmax(85px,1fr));gap:.7rem}.card-emoji{font-size:2rem}.story-box{padding:1.8rem 1.2rem}}
</style>
</head>
<body>
<div class="stars" id="stars"></div>
<div class="container">
  <header>
    <div class="title-main">✨ Pohádkový Generátor ✨</div>
    <div class="title-sub">Klikni na obrázky a já ti vymyslím pohádku!</div>
    <div class="magic-line"></div>
  </header>
  <div class="category"><div class="step-label">Postavy</div><div class="cards-grid" id="grid-postavy"></div></div>
  <div class="category"><div class="step-label">Místo</div><div class="cards-grid" id="grid-mista"></div></div>
  <div class="category"><div class="step-label">Kouzelné věci</div><div class="cards-grid" id="grid-predmety"></div></div>
  <div class="category"><div class="step-label">Jak to dopadne?</div><div class="cards-grid" id="grid-nalada"></div></div>
  <div class="selected-summary" id="summary">
    <span class="summary-label">Vybrané:</span>
    <span id="summary-empty" style="font-size:.8rem;color:rgba(253,246,227,.35);font-style:italic">zatím nic...</span>
  </div>
  <button class="generate-btn" id="generateBtn" onclick="generateStory()">🪄 Vygenerovat pohádku!</button>
  <div class="story-box" id="storyBox">
    <div id="storyContent"></div>
    <button class="reset-btn" onclick="resetAll()">↩ Vybrat znovu</button>
  </div>
</div>
<script>
const categories={postavy:{items:[{emoji:"👸",label:"Princezna"},{emoji:"🤴",label:"Princ"},{emoji:"🧙",label:"Čaroděj"},{emoji:"🧚",label:"Víla"},{emoji:"🐉",label:"Drak"},{emoji:"🦄",label:"Jednorožec"},{emoji:"🐺",label:"Vlk"},{emoji:"🧌",label:"Trpaslík"},{emoji:"🦊",label:"Liška"},{emoji:"🧜",label:"Mořská panna"},{emoji:"🐻",label:"Medvěd"},{emoji:"🏇",label:"Rytíř"},{emoji:"👦",label:"Lukášek",special:true,desc:"5letý blonďatý chlapec"},{emoji:"👧",label:"Emmička",special:true,desc:"2letá blonďatá holčička"}]},mista:{items:[{emoji:"🏰",label:"Hrad"},{emoji:"🌲",label:"Les"},{emoji:"🏔️",label:"Hora"},{emoji:"🌊",label:"Moře"},{emoji:"🏡",label:"Chaloupka"},{emoji:"🌺",label:"Kouzelná zahrada"},{emoji:"🦋",label:"Louka"},{emoji:"🏙️",label:"Království"},{emoji:"🌙",label:"Měsíc"},{emoji:"🌈",label:"Duha"}]},predmety:{items:[{emoji:"🪄",label:"Kouzelná hůlka"},{emoji:"💎",label:"Drahokam"},{emoji:"🗡️",label:"Meč"},{emoji:"🎁",label:"Tajný dar"},{emoji:"📜",label:"Kouzelný svitek"},{emoji:"🍎",label:"Kouzelné jablko"},{emoji:"🔮",label:"Křišťálová koule"},{emoji:"🌟",label:"Padající hvězda"},{emoji:"🫙",label:"Lektvar"},{emoji:"🎶",label:"Kouzelná píseň"}]},nalada:{items:[{emoji:"💖",label:"Šťastný konec"},{emoji:"😂",label:"Vtipně"},{emoji:"😮",label:"S překvapením"},{emoji:"🌈",label:"Dobrodružně"}]}};
const selected={postavy:[],mista:[],predmety:[],nalada:[]};
function buildCards(){for(const[cat,data]of Object.entries(categories)){const grid=document.getElementById('grid-'+cat);data.items.forEach(item=>{const card=document.createElement('div');card.className='card';const isSpecial=item.special;if(isSpecial)card.classList.add('special-card');card.innerHTML=(isSpecial?'<div class="special-glow"></div>':'')+'<div class="check-badge">✓</div><span class="card-emoji">'+item.emoji+'</span><div class="card-label">'+item.label+(isSpecial?'<br><span class="card-sublabel">'+item.desc+'</span>':'')+'</div>';card.addEventListener('click',()=>toggleCard(card,cat,item.label));grid.appendChild(card)})}}
function toggleCard(card,cat,label){const sel=card.classList.contains('selected');if(sel){card.classList.remove('selected');selected[cat]=selected[cat].filter(l=>l!==label)}else{card.classList.add('selected');selected[cat].push(label)}updateSummary()}
function updateSummary(){const el=document.getElementById('summary');const empty=document.getElementById('summary-empty');const all=[...selected.postavy,...selected.mista,...selected.predmety,...selected.nalada];el.querySelectorAll('.tag').forEach(t=>t.remove());if(all.length===0){empty.style.display=''}else{empty.style.display='none';all.forEach(label=>{const tag=document.createElement('span');tag.className='tag';tag.textContent=label;el.appendChild(tag)})}}
async function generateStory(){const all=[...selected.postavy,...selected.mista,...selected.predmety,...selected.nalada];if(all.length===0){alert('Nejdříve vyber aspoň jednu věc! 🌟');return}
const btn=document.getElementById('generateBtn');const storyBox=document.getElementById('storyBox');const storyContent=document.getElementById('storyContent');
btn.disabled=true;storyBox.classList.add('visible');storyBox.scrollIntoView({behavior:'smooth',block:'start'});
storyContent.innerHTML='<div class="loading-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div><p style="text-align:center;font-style:italic;color:rgba(253,246,227,.6)">Kouzelníci připravují tvou pohádku...</p>';
try{const response=await fetch('/api/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({postavy:selected.postavy.join(', '),mista:selected.mista.join(', '),predmety:selected.predmety.join(', '),nalada:selected.nalada.join(', ')})});
const data=await response.json();if(!response.ok)throw new Error(data.error||'HTTP '+response.status);
const text=data.story||'';const lines=text.trim().split('\n').filter(l=>l.trim());const title=lines[0];const body=lines.slice(1).join('\n').trim();
storyContent.innerHTML='<div class="story-title">'+escHtml(title)+'</div><div class="story-text"><p>'+escHtml(body).replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')+'</p></div>';
spawnConfetti()}catch(err){storyContent.innerHTML='<p style="color:#ff8888">Ouha! Kouzelník se unavil. 🧙</p><p style="color:rgba(255,200,200,.7);font-size:.85rem">'+err.message+'</p>'}
btn.disabled=false}
function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function resetAll(){document.querySelectorAll('.card.selected').forEach(c=>c.classList.remove('selected'));for(const k of Object.keys(selected))selected[k]=[];updateSummary();document.getElementById('storyBox').classList.remove('visible');window.scrollTo({top:0,behavior:'smooth'})}
function createStars(){const c=document.getElementById('stars');for(let i=0;i<80;i++){const s=document.createElement('div');const sz=Math.random()*2.5+.5;s.className='star';s.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;--dur:'+(2+Math.random()*3)+'s;--delay:-'+Math.random()*5+'s';c.appendChild(s)}}
function spawnConfetti(){const colors=['#f0c040','#e84393','#00c9b1','#a78bfa','#fff'];const st=document.createElement('style');st.textContent='@keyframes fall{to{transform:translateY('+(window.innerHeight+50)+'px) rotate(720deg);opacity:0}}';document.head.appendChild(st);for(let i=0;i<35;i++){const p=document.createElement('div');const sz=Math.random()*8+4;p.style.cssText='position:fixed;left:'+Math.random()*100+'%;top:-10px;z-index:999;width:'+sz+'px;height:'+sz+'px;background:'+colors[Math.floor(Math.random()*colors.length)]+';border-radius:'+(Math.random()>.5?'50%':'2px')+';animation:fall '+(1.5+Math.random()*2)+'s ease-in forwards;animation-delay:'+Math.random()*.5+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),4000)}}
createStars();buildCards();
</script>
</body>
</html>`;

export default async function handler(req) {
  if (req.method === 'GET') {
    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch { body = {}; }

    const { postavy, mista, predmety, nalada } = body;

    const prompt = `Napiš krátkou českou pohádku pro malé dítě (věk 4-8 let). Pohádka musí:
- Být v češtině
- Být kratší než 300 slov
- Začínat titulkem (první řádek = název pohádky)
- Obsahovat tyto postavy: ${postavy || 'neznámý hrdina'} (pokud je mezi postavami Lukášek, jde o 5letého blonďatého chlapce; pokud je tam Emmička, jde o 2letou blonďatou holčičku - piš o nich jako o skutečných dětech, které prožívají pohádku)
- Odehrávat se na těchto místech: ${mista || 'daleká země'}
- Zahrnovat tyto kouzelné věci: ${predmety || 'kouzelný předmět'}
- Mít tuto náladu/zakončení: ${nalada || 'šťastný konec'}
- Být milá, hravá a s poučením
- Psát jednoduchým jazykem, který pochopí malé dítě
Napiš jen samotný text pohádky, bez dalšího komentáře.`;

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

  return new Response('Method not allowed', { status: 405 });
}
