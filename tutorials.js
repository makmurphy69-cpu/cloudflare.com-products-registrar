(function(){
  'use strict';
  const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const tools={
    'index.html':['Website Builder','describe a business and choose the pages and features you need','Draft the site','preview every page, refine the copy, then download or publish it'],
    'app-forge.html':['App Forge','describe the browser app and the result it should produce','Generate app','test the app, refine it, and download the finished HTML'],
    'bot-forge.html':['Bot Forge','add the website details and questions customers usually ask','Build bot','test answers, refine them, and copy the widget to your site'],
    'cartoon-forge.html':['Cartoon Forge','describe the characters, setting, story, dialogue, and ending','Generate cartoon','play the cartoon, refine scenes, then record or download it'],
    'clip-forge.html':['Clip Forge','upload a video and choose the cut, captions, or translation','Process clip','preview the edit and download the finished clip'],
    'code-forge.html':['Code Forge','choose Python or JavaScript and describe what you want to learn','Start lesson','run the examples, answer the exercises, and continue at your pace'],
    'contract-forge.html':['Contract Forge','choose the agreement type and enter the real parties and terms','Draft contract','review every clause carefully, edit it, and export the document'],
    'document-forge.html':['Document Forge','drop in a document, image, or PDF and choose the output format','Convert & download','check the preview and open the converted download'],
    'file-forge.html':['File Forge','upload an image and choose the new format or size','Convert file','check the preview and download the converted file'],
    'game-forge.html':['Game Forge','describe the game, controls, goal, art style, and difficulty','Generate game','play-test it, request changes, and download the finished game'],
    'invoice-forge.html':['Invoice Forge','enter the seller, customer, line items, prices, and payment terms','Create invoice','verify the totals and download or print the invoice'],
    'logo-forge.html':['Logo Forge','enter the brand name, industry, style, colors, and symbol ideas','Generate logo','compare the result and download the logo, favicon, and brand kit'],
    'merge-forge.html':['Merge Forge','add clips, images, text, and music in the order you want','Merge media','preview the timeline and export the combined video'],
    'model-forge.html':['Model Forge','describe the 3D object and set its measurements and shape','Generate model','inspect it from every angle and export the printable model'],
    'music-forge.html':['Music Forge','choose the mood, tempo, instruments, and length','Generate music','listen, adjust the arrangement, and download the track'],
    'name-forge.html':['Name Forge','describe the business, audience, tone, and useful keywords','Generate names','shortlist the strongest names and check their domains'],
    'paint-forge.html':['Paint Forge','open an image or blank canvas and choose the editing tools','Apply edit','work with layers, compare the result, and export the image'],
    'palette-forge.html':['Palette Forge','choose a starting color or describe the brand mood','Build palette','check contrast and copy or download the accessible colors'],
    'post-forge.html':['Post Forge','choose the platform and describe the message, audience, and goal','Create post','refine the wording and image, then copy or publish the post'],
    'qr-forge.html':['QR Forge','paste the destination link or text and choose the QR style','Create QR code','scan-test it and download the final code'],
    'record-forge.html':['Record Forge','choose the screen or tab, microphone, and recording quality','Start recording','demonstrate the task, stop the recording, and download the WebM file'],
    'screen-forge.html':['Screen Share Forge','create a support session and choose what you want to share','Start session','share the link safely and end the session when help is finished'],
    'slide-forge.html':['Slide Forge','describe the topic, audience, purpose, and number of slides','Generate presentation','review each slide and download the PowerPoint file'],
    'talk-forge.html':['Talk Forge','upload a photo and add or record the spoken audio','Create talking photo','preview the lip movement and export the finished video'],
    'video-forge.html':['Video Forge','upload drawings or images and describe how they should move','Create video','preview the motion, adjust it, and download the video']
  };
  const tool=tools[file]; if(!tool)return;
  const languages={
    en:{label:'English',voice:'en-US',watch:'How to use this tool',hint:'A short guided walkthrough with captions and voice.',play:'Play tutorial',pause:'Pause',restart:'Restart',mute:'Voice on',unmute:'Voice off',step:'Step',steps:[n=>`Welcome to ${n}. This tutorial shows the fastest way to get a good result.`,(_,a)=>`First, ${a}. Specific details produce a much better result.`,(_,a,b)=>`Next, select your settings and press “${b}”. Keep this page open while it works.`,(_,a,b,c)=>`Finally, ${c}. Always check the result before publishing or sharing it.`]},
    es:{label:'Español',voice:'es-ES',watch:'Cómo usar esta herramienta',hint:'Una guía breve con subtítulos y voz.',play:'Ver tutorial',pause:'Pausa',restart:'Reiniciar',mute:'Voz activada',unmute:'Voz desactivada',step:'Paso',steps:[n=>`Bienvenido a ${n}. Este tutorial muestra la forma más rápida de obtener un buen resultado.`,()=>`Primero, introduce claramente el contenido solicitado. Los detalles específicos producen un resultado mucho mejor.`,(_,a,b)=>`Después, elige la configuración y pulsa el botón «${b}». Mantén esta página abierta mientras trabaja.`,()=>`Por último, revisa el resultado, haz los cambios necesarios y descárgalo o compártelo. Compruébalo siempre antes de publicarlo.`]},
    ar:{label:'العربية',voice:'ar-SA',watch:'كيفية استخدام هذه الأداة',hint:'شرح قصير مع ترجمة وصوت.',play:'تشغيل الشرح',pause:'إيقاف مؤقت',restart:'إعادة',mute:'الصوت يعمل',unmute:'الصوت متوقف',step:'الخطوة',steps:[n=>`مرحباً بك في ${n}. يوضح هذا الشرح أسرع طريقة للحصول على نتيجة جيدة.`,(_,a)=>`أولاً، أدخل التفاصيل المطلوبة بوضوح. التفاصيل الدقيقة تعطي نتيجة أفضل.`,(_,a,b)=>`بعد ذلك اختر الإعدادات واضغط زر ${b}. اترك الصفحة مفتوحة أثناء العمل.`,(_,a,b,c)=>`أخيراً، راجع النتيجة وعدّلها ثم نزّلها أو شاركها. تحقق دائماً قبل النشر.`]},
    zh:{label:'中文',voice:'zh-CN',watch:'如何使用此工具',hint:'带字幕和语音的简短操作指南。',play:'播放教程',pause:'暂停',restart:'重新播放',mute:'语音开启',unmute:'语音关闭',step:'步骤',steps:[n=>`欢迎使用${n}。本教程将介绍快速获得好结果的方法。`,(_,a)=>`首先，清楚填写所需内容。越具体，生成结果越好。`,(_,a,b)=>`然后选择设置并点击“${b}”。处理期间请保持页面打开。`,(_,a,b,c)=>`最后，预览、修改并下载结果。发布或分享前请仔细检查。`]},
    sw:{label:'Kiswahili',voice:'sw-KE',watch:'Jinsi ya kutumia zana hii',hint:'Mwongozo mfupi wenye manukuu na sauti.',play:'Cheza mafunzo',pause:'Sitisha',restart:'Anza tena',mute:'Sauti imewashwa',unmute:'Sauti imezimwa',step:'Hatua',steps:[n=>`Karibu kwenye ${n}. Mafunzo haya yanaonyesha njia ya haraka ya kupata matokeo mazuri.`,(_,a)=>`Kwanza, weka maelezo yanayohitajika kwa uwazi. Maelezo mahususi huleta matokeo bora.`,(_,a,b)=>`Kisha chagua mipangilio na ubonyeze ${b}. Acha ukurasa wazi wakati zana inafanya kazi.`,(_,a,b,c)=>`Mwisho, kagua matokeo, yafanyie marekebisho, kisha uyapakue au uyashiriki.`]}
  };
  const box=document.createElement('details');box.className='miga-tutorial';box.open=false;box.innerHTML='<summary><span id="mt-title"></span><span>▶ 1–2 min</span></summary><div class="miga-tutorial-body"><div class="miga-tutorial-copy"><p id="mt-hint"></p><div class="miga-tutorial-controls"><select id="mt-lang" aria-label="Tutorial language"></select><button type="button" data-primary id="mt-play"></button><button type="button" id="mt-voice"></button></div></div><div class="miga-tutorial-screen" aria-live="polite"><span class="miga-tutorial-badge" id="mt-badge"></span><h3 id="mt-heading"></h3><p id="mt-caption"></p><div class="miga-tutorial-progress"><span id="mt-progress"></span></div><div class="miga-tutorial-dots" id="mt-dots"></div></div></div>';
  const anchor=document.querySelector('header')||document.body.firstElementChild;anchor.insertAdjacentElement('afterend',box);
  const q=id=>box.querySelector('#'+id),langSel=q('mt-lang');Object.entries(languages).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.label;langSel.appendChild(o)});
  let index=0,timer=null,playing=false,voice=true;
  const texts=()=>languages[langSel.value].steps.map(fn=>fn(...tool));
  function speak(text){if(!voice||!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=languages[langSel.value].voice;u.rate=.95;speechSynthesis.speak(u)}
  function render(announce){const l=languages[langSel.value],all=texts();box.dir=langSel.value==='ar'?'rtl':'ltr';q('mt-title').textContent=l.watch;q('mt-hint').textContent=l.hint;q('mt-play').textContent=playing?l.pause:(index?l.restart:l.play);q('mt-voice').textContent=voice?l.mute:l.unmute;q('mt-badge').textContent=l.step+' '+(index+1)+' / '+all.length;q('mt-heading').textContent=index===0?tool[0]:l.watch;q('mt-caption').textContent=all[index];q('mt-progress').style.width=((index+1)/all.length*100)+'%';q('mt-dots').innerHTML=all.map((_,i)=>'<span class="'+(i===index?'active':'')+'"></span>').join('');if(announce)speak(all[index])}
  function stop(){playing=false;clearTimeout(timer);timer=null;if('speechSynthesis'in window)speechSynthesis.cancel();render(false)}
  function advance(){if(!playing)return;render(true);timer=setTimeout(()=>{if(index<texts().length-1){index++;advance()}else stop()},11500)}
  q('mt-play').onclick=()=>{box.open=true;if(playing){stop();return}if(index>=texts().length-1)index=0;playing=true;advance();render(false)};
  q('mt-voice').onclick=()=>{voice=!voice;if(!voice&&'speechSynthesis'in window)speechSynthesis.cancel();render(false)};
  langSel.onchange=()=>{index=0;stop();render(false)};
  box.addEventListener('toggle',()=>{if(!box.open)stop()});render(false);
})();
