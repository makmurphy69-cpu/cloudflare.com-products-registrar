/* Generates the example input files used in the tutorial videos (drawings,
 * photos, a scanned page, PDFs, a short clip and a voice recording). They are
 * drawn with Chromium's canvas and ffmpeg, so there are no licensing questions. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const DRAW = {
  // A friendly cartoon portrait on a plain background (background removal, talking photo)
  'portrait.png': [800, 800, `
    g.fillStyle='#bfe3f2';g.fillRect(0,0,800,800);
    g.fillStyle='#2f6f9f';g.beginPath();g.ellipse(400,820,250,190,0,Math.PI,0);g.fill();
    g.fillStyle='#e9b48f';g.fillRect(360,500,80,80);
    g.beginPath();g.ellipse(400,380,165,195,0,0,Math.PI*2);g.fill();
    g.fillStyle='#3b2416';g.beginPath();g.ellipse(400,245,175,100,0,Math.PI,0);g.fill();g.fillRect(228,240,40,130);g.fillRect(532,240,40,130);
    g.fillStyle='#fff';[[335,370],[465,370]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,30,22,0,0,Math.PI*2);g.fill()});
    g.fillStyle='#2b1a10';[[338,372],[468,372]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,12,0,Math.PI*2);g.fill()});
    g.strokeStyle='#2b1a10';g.lineWidth=7;g.lineCap='round';[[300,322,370,318],[430,318,500,322]].forEach(([a,b,c,d])=>{g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke()});
    g.strokeStyle='#b36b4f';g.lineWidth=6;g.beginPath();g.moveTo(400,395);g.lineTo(388,440);g.lineTo(405,442);g.stroke();
    g.fillStyle='#a3413a';g.beginPath();g.ellipse(400,490,48,20,0,0,Math.PI);g.fill();
    g.fillStyle='rgba(230,120,120,.35)';[[300,440],[500,440]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,26,0,Math.PI*2);g.fill()});`],
  'drawing-house.png': [1000, 750, `
    g.fillStyle='#fffdf6';g.fillRect(0,0,1000,750);g.lineWidth=9;g.lineCap='round';g.lineJoin='round';
    g.fillStyle='#ffd43b';g.beginPath();g.arc(830,140,80,0,Math.PI*2);g.fill();g.strokeStyle='#f5a300';for(let i=0;i<12;i++){const a=i*Math.PI/6;g.beginPath();g.moveTo(830+Math.cos(a)*100,140+Math.sin(a)*100);g.lineTo(830+Math.cos(a)*140,140+Math.sin(a)*140);g.stroke()}
    g.fillStyle='#7bd36b';g.fillRect(0,600,1000,150);
    g.fillStyle='#ff8a65';g.strokeStyle='#5d2e1f';g.fillRect(250,380,330,230);g.strokeRect(250,380,330,230);
    g.fillStyle='#c62828';g.beginPath();g.moveTo(220,390);g.lineTo(415,220);g.lineTo(610,390);g.closePath();g.fill();g.stroke();
    g.fillStyle='#6d4c41';g.fillRect(380,480,70,130);g.fillStyle='#90caf9';g.fillRect(285,430,70,60);g.fillRect(480,430,70,60);g.strokeRect(285,430,70,60);g.strokeRect(480,430,70,60);
    g.fillStyle='#795548';g.fillRect(760,420,40,190);g.fillStyle='#43a047';g.beginPath();g.arc(780,380,95,0,Math.PI*2);g.fill();
    g.fillStyle='#fff';[[140,150],[230,120],[320,150]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,48,0,Math.PI*2);g.fill()});
    g.fillStyle='#37474f';g.font='bold 44px Comic Sans MS, cursive';g.fillText('My house',60,700);`],
  'drawing-rocket.png': [1000, 750, `
    g.fillStyle='#10163a';g.fillRect(0,0,1000,750);g.fillStyle='#fff';for(let i=0;i<90;i++){g.beginPath();g.arc((i*137)%1000,(i*251)%750,2+(i%3),0,Math.PI*2);g.fill()}
    g.fillStyle='#ffca28';g.beginPath();g.arc(170,170,70,0,Math.PI*2);g.fill();
    g.save();g.translate(560,400);g.rotate(-0.5);g.lineWidth=8;g.strokeStyle='#263238';
    g.fillStyle='#ff7043';g.beginPath();g.moveTo(-60,120);g.lineTo(-20,210);g.lineTo(0,150);g.lineTo(20,210);g.lineTo(60,120);g.fill();
    g.fillStyle='#eceff1';g.beginPath();g.moveTo(0,-230);g.quadraticCurveTo(95,-100,70,130);g.lineTo(-70,130);g.quadraticCurveTo(-95,-100,0,-230);g.fill();g.stroke();
    g.fillStyle='#e53935';g.beginPath();g.moveTo(-70,60);g.lineTo(-130,150);g.lineTo(-70,130);g.fill();g.beginPath();g.moveTo(70,60);g.lineTo(130,150);g.lineTo(70,130);g.fill();
    g.fillStyle='#4fc3f7';g.beginPath();g.arc(0,-60,42,0,Math.PI*2);g.fill();g.stroke();g.restore();
    g.fillStyle='#fff';g.font='bold 44px Comic Sans MS, cursive';g.fillText('To the moon!',60,700);`],
  'drawing-cat.png': [1000, 750, `
    g.fillStyle='#fff8e1';g.fillRect(0,0,1000,750);g.lineWidth=9;g.strokeStyle='#4e342e';g.lineCap='round';
    g.fillStyle='#ffb74d';g.beginPath();g.ellipse(520,480,220,160,0,0,Math.PI*2);g.fill();g.stroke();
    g.beginPath();g.arc(330,330,120,0,Math.PI*2);g.fill();g.stroke();
    g.beginPath();g.moveTo(240,260);g.lineTo(250,160);g.lineTo(320,220);g.fill();g.stroke();g.beginPath();g.moveTo(420,260);g.lineTo(410,160);g.lineTo(345,220);g.fill();g.stroke();
    g.fillStyle='#4e342e';g.beginPath();g.arc(290,320,14,0,Math.PI*2);g.arc(370,320,14,0,Math.PI*2);g.fill();
    g.beginPath();g.moveTo(330,360);g.lineTo(315,375);g.lineTo(345,375);g.fill();
    [[250,370,170,350],[250,385,170,395],[410,370,490,350],[410,385,490,395]].forEach(([a,b,c,d])=>{g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke()});
    g.beginPath();g.moveTo(730,470);g.quadraticCurveTo(880,380,820,250);g.stroke();
    g.fillStyle='#e91e63';g.font='bold 44px Comic Sans MS, cursive';g.fillText('Mimi the cat',60,700);`],
  'landscape.jpg': [1600, 1000, `
    const sky=g.createLinearGradient(0,0,0,700);sky.addColorStop(0,'#ff9a5a');sky.addColorStop(.55,'#ffcf8a');sky.addColorStop(1,'#fce3c4');g.fillStyle=sky;g.fillRect(0,0,1600,1000);
    g.fillStyle='#fff3c9';g.beginPath();g.arc(1150,420,110,0,Math.PI*2);g.fill();
    const hill=(c,pts)=>{g.fillStyle=c;g.beginPath();g.moveTo(0,1000);pts.forEach(([x,y])=>g.lineTo(x,y));g.lineTo(1600,1000);g.fill()};
    hill('#8a5a83',[[0,560],[260,380],[480,520],[760,330],[1040,540],[1300,400],[1600,560]]);
    hill('#5d3f73',[[0,700],[300,560],[620,690],[900,540],[1200,700],[1600,600]]);
    hill('#2e2446',[[0,860],[400,760],[800,860],[1200,780],[1600,880]]);`],
  // Photo-like texture (large as PNG, so PDF compression has something to shrink)
  'photo-field.png': [1600, 1100, `
    const sky=g.createLinearGradient(0,0,0,600);sky.addColorStop(0,'#5b9bd5');sky.addColorStop(1,'#cfe6f7');g.fillStyle=sky;g.fillRect(0,0,1600,1100);
    g.fillStyle='#6a9a3a';g.fillRect(0,560,1600,540);
    const d=g.getImageData(0,0,1600,1100),p=d.data;let seed=7;const r=()=>(seed=(seed*16807)%2147483647)/2147483647;
    for(let i=0;i<p.length;i+=4){const y=(i/4)/1600|0,n=(r()-.5)*(y>560?70:18);p[i]+=n;p[i+1]+=n*(y>560?1.2:1);p[i+2]+=n*.6}
    g.putImageData(d,0,0);
    g.fillStyle='rgba(255,210,60,.9)';for(let k=0;k<400;k++){const x=r()*1600,y=600+r()*500;g.beginPath();g.arc(x,y,3+r()*6,0,Math.PI*2);g.fill()}`],
  'scan.png': [1240, 1000, `
    g.fillStyle='#fbfbf7';g.fillRect(0,0,1240,1000);g.fillStyle='#1b1b1b';
    g.font='bold 54px Georgia, serif';g.fillText('Sunrise Bakery',80,120);
    g.font='30px Georgia, serif';['12 Market Street, Nairobi','Receipt no. 4471      24 September 2026','','2 x Sourdough bread           7.00','1 x Carrot cake               4.50','3 x Coffee                    6.75','','Total                        18.25','','Thank you for your visit! Open daily 7:00 - 18:00.'].forEach((t,i)=>g.fillText(t,80,210+i*62));`]
};

const PDF_HTML = (title, body) => `<!doctype html><html><head><meta charset="utf-8"><style>body{font:15px/1.6 Georgia,serif;margin:60px;color:#222}h1{font:700 30px Arial;color:#0E2A47}h2{font:700 20px Arial;color:#0E2A47;margin-top:28px}.box{border:1px solid #bbb;padding:14px;border-radius:6px;background:#f7f7f2}</style></head><body><h1>${title}</h1>${body}</body></html>`;

export async function ensureAssets(browser, ffmpeg, dir) {
  fs.mkdirSync(dir, { recursive: true });
  const need = Object.keys(DRAW).filter(f => !fs.existsSync(path.join(dir, f)));
  const page = await browser.newPage();
  for (const f of need) {
    const [w, h, code] = DRAW[f];
    const url = await page.evaluate(([w, h, code, type]) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); new Function('g', code)(g); return c.toDataURL(type, 0.9); }, [w, h, code, f.endsWith('.jpg') ? 'image/jpeg' : 'image/png']);
    fs.writeFileSync(path.join(dir, f), Buffer.from(url.split(',')[1], 'base64'));
  }
  const pdfs = {
    'rental-agreement.pdf': PDF_HTML('Rental agreement', '<p>This agreement is made on <b>1 October 2026</b> between <b>Amina Otieno</b> (landlord) and <b>Daniel Mwangi</b> (tenant).</p><h2>1. Property</h2><p>Apartment 4B, 22 Riverside Drive, Nairobi.</p><h2>2. Rent</h2><p>The tenant pays 45,000 KES on the first day of each month. The deposit is two months of rent.</p><h2>3. Term</h2><p>The agreement lasts twelve months and can be renewed by both parties.</p><h2>Signatures</h2><div class="box"><p>Landlord: ______________________ Date: __________</p><p>Tenant: ______________________ Date: __________</p></div>'),
    'brochure.pdf': PDF_HTML('Sunrise Bakery — autumn menu', '<p>Fresh bread every morning, baked with local flour.</p><h2>Breads</h2><p>Sourdough · Rye · Seeded wholemeal · Brioche</p><h2>Cakes</h2><p>Carrot cake · Lemon drizzle · Chocolate fudge</p><h2>Coffee</h2><p>Espresso · Cappuccino · Chai latte</p>' + '<p style="page-break-before:always"></p><h1>Opening hours</h1><p>Monday to Saturday 7:00–18:00. Sunday 8:00–14:00.</p><h2>Find us</h2><p>12 Market Street, Nairobi.</p>')
  };
  // A photo-heavy PDF, so compression has something to shrink.
  const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(dir, n)).toString('base64');
  pdfs['art-week.pdf'] = PDF_HTML('Art week — our trip and drawings', ['photo-field.png', 'drawing-house.png', 'photo-field.png'].map((n, i) => (i ? '<p style="page-break-before:always"></p>' : '') + '<img style="width:100%" src="' + img(n) + '"><p>Page ' + (i + 1) + '</p>').join(''));
  for (const [f, html] of Object.entries(pdfs)) {
    if (fs.existsSync(path.join(dir, f))) continue;
    await page.setContent(html); await page.pdf({ path: path.join(dir, f), format: 'A4' });
  }
  await page.close();
  const md = path.join(dir, 'menu.md');
  if (!fs.existsSync(md)) fs.writeFileSync(md, '# Sunrise Bakery menu\n\nFresh bread every morning, baked with local flour.\n\n## Breads\n\n- Sourdough — 350 KES\n- Rye — 320 KES\n- Seeded wholemeal — 330 KES\n\n## Cakes\n\n- Carrot cake — 450 KES a slice\n- Lemon drizzle — 400 KES a slice\n\n## Coffee\n\n- Espresso — 200 KES\n- Cappuccino — 280 KES\n\nOpen Monday to Saturday 7:00–18:00.\n');
  // A short clip with motion and a soft tone, made from the drawings.
  const clip = path.join(dir, 'clip.webm'); // WebM plays in every browser, including open-source Chromium
  if (!fs.existsSync(clip)) {
    execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error',
      '-loop', '1', '-t', '4', '-i', path.join(dir, 'drawing-house.png'), '-loop', '1', '-t', '4', '-i', path.join(dir, 'drawing-rocket.png'),
      '-f', 'lavfi', '-t', '8', '-i', 'sine=frequency=330:sample_rate=44100,volume=0.15',
      '-filter_complex', '[0:v]scale=1280:720,zoompan=z=\'min(zoom+0.0015,1.2)\':d=100:s=1280x720:fps=25[a];[1:v]scale=1280:720,zoompan=z=\'min(zoom+0.0015,1.2)\':d=100:s=1280x720:fps=25[b];[a][b]concat=n=2:v=1:a=0,format=yuv420p[v]',
      '-map', '[v]', '-map', '2:a', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '40', '-deadline', 'realtime', '-cpu-used', '8', '-c:a', 'libopus', '-shortest', clip]);
  }
  // A spoken recording for the audio editor.
  const voice = path.join(dir, 'voice.wav');
  if (!fs.existsSync(voice)) {
    const piper = spawnSync('python3', ['-m', 'piper', '-m', process.env.PIPER_VOICE || path.join(dir, '..', '.cache', 'voices', 'en_US-lessac-high.onnx'), '-f', voice], { input: 'Umm, hello everyone. Welcome to the Sunrise Bakery podcast. Today we talk about baking sourdough bread at home, step by step.' });
    if (piper.status !== 0) throw new Error('Could not make voice.wav: ' + piper.stderr);
  }
}
