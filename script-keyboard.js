/* MigaKeyboard — an on-screen keyboard for writing systems the visitor's own
 * keyboard does not have. Used by Alphabet Forge and Flashcard Forge.
 *
 *   MigaKeyboard.open({ layout: 'thai', target: inputOrTextarea })
 *   MigaKeyboard.attach(el, () => 'russian')   // adds a ⌨️ button beside a field
 *   MigaKeyboard.setChartKeys('thai', ['ก', 'ข', …])   // “ABC order” view
 *   MigaKeyboard.registerLayout('ai-armenian', { name, lang, dir, chart: [...] })
 *
 * Every layout has a “Standard” view that follows the real keyboard layout of
 * that language (so the visitor's physical keys can type it too, matched by key
 * position, whatever keyboard their computer uses) and, where a chart is known,
 * an “ABC order” view that lists the letters in the order they are taught.
 * Korean syllables are assembled from letters as you type (ㅎ+ㅏ+ㄴ → 한),
 * Japanese can be typed in romaji (ka → か) and Mandarin in pinyin with tone
 * numbers (ma3 → mǎ) plus a picker for common characters.
 * Nothing leaves the browser.
 */
(function (window, document) {
  'use strict';
  if (window.MigaKeyboard) return;

  // Physical key codes for the four character rows of a standard keyboard.
  const CODES = [
    ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'],
    ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
    ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
    ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash']
  ];
  const LATIN = ['` 1 2 3 4 5 6 7 8 9 0 - =', 'q w e r t y u i o p [ ] \\', 'a s d f g h j k l ; \'', 'z x c v b n m , . /'];
  const LATIN_SHIFT = ['~ ! @ # $ % ^ & * ( ) _ +', 'Q W E R T Y U I O P { } |', 'A S D F G H J K L : "', 'Z X C V B N M < > ?'];
  const DIGITS = '` 1 2 3 4 5 6 7 8 9 0 - =';

  const L = {};
  L.latin = { name: 'Latin (English)', lang: 'en-US', rows: LATIN, shiftRows: LATIN_SHIFT };
  L.russian = {
    name: 'Russian (ЙЦУКЕН)', lang: 'ru-RU', font: "'Noto Sans'",
    rows: ['ё 1 2 3 4 5 6 7 8 9 0 - =', 'й ц у к е н г ш щ з х ъ \\', 'ф ы в а п р о л д ж э', 'я ч с м и т ь б ю .'],
    shiftRows: ['Ё ! " № ; % : ? * ( ) _ +', 'Й Ц У К Е Н Г Ш Щ З Х Ъ /', 'Ф Ы В А П Р О Л Д Ж Э', 'Я Ч С М И Т Ь Б Ю ,']
  };
  L.ukrainian = {
    name: 'Ukrainian', lang: 'uk-UA', font: "'Noto Sans'",
    rows: ['ʼ 1 2 3 4 5 6 7 8 9 0 - =', 'й ц у к е н г ш щ з х ї ґ', 'ф і в а п р о л д ж є', 'я ч с м и т ь б ю .'],
    shiftRows: ['₴ ! " № ; % : ? * ( ) _ +', 'Й Ц У К Е Н Г Ш Щ З Х Ї Ґ', 'Ф І В А П Р О Л Д Ж Є', 'Я Ч С М И Т Ь Б Ю ,']
  };
  L.greek = {
    name: 'Greek', lang: 'el-GR', font: "'Noto Sans'",
    rows: [DIGITS, '; ς ε ρ τ υ θ ι ο π [ ] \\', 'α σ δ φ γ η ξ κ λ ΄ \'', 'ζ χ ψ ω β ν μ , . /'],
    shiftRows: ['~ ! @ # $ % ^ & * ( ) _ +', ': Σ Ε Ρ Τ Υ Θ Ι Ο Π { } |', 'Α Σ Δ Φ Γ Η Ξ Κ Λ ¨ "', 'Ζ Χ Ψ Ω Β Ν Μ < > ?'],
    // ΄ and ¨ are dead keys: press them, then the vowel.
    dead: {
      '΄': { α: 'ά', ε: 'έ', η: 'ή', ι: 'ί', ο: 'ό', υ: 'ύ', ω: 'ώ', Α: 'Ά', Ε: 'Έ', Η: 'Ή', Ι: 'Ί', Ο: 'Ό', Υ: 'Ύ', Ω: 'Ώ' },
      '¨': { ι: 'ϊ', υ: 'ϋ', Ι: 'Ϊ', Υ: 'Ϋ' }
    }
  };
  L.hebrew = {
    name: 'Hebrew', lang: 'he-IL', dir: 'rtl', font: "'Noto Sans Hebrew'",
    rows: [';' + DIGITS.slice(1), '/ \' ק ר א ט ו ן ם פ ] [ \\', 'ש ד ג כ ע י ח ל ך ף ,', 'ז ס ב ה נ מ צ ת ץ .'],
    extra: ['ַ', 'ָ', 'ֶ', 'ֵ', 'ִ', 'ֹ', 'ֻ', 'ְ', 'ּ', 'ׁ', 'ׂ', '־', '״', '׳']
  };
  L.arabic = {
    name: 'Arabic', lang: 'ar-SA', dir: 'rtl', font: "'Noto Naskh Arabic'",
    rows: ['ذ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٠ - =', 'ض ص ث ق ف غ ع ه خ ح ج د \\', 'ش س ي ب ل ا ت ن م ك ط', 'ئ ء ؤ ر لا ى ة و ز ظ'],
    shiftRows: ['ّ ! @ # $ % ^ & * ) ( _ +', 'َ ً ُ ٌ لإ إ ‘ ÷ × ؛ > < |', 'ِ ٍ ] [ لأ أ ـ ، / : "', '~ ْ } { لآ آ ’ , . ؟'],
    extra: ['َ', 'ِ', 'ُ', 'ً', 'ٍ', 'ٌ', 'ْ', 'ّ', 'أ', 'إ', 'آ', 'ؤ', 'ئ', 'ء', 'ة', 'ى', '،', '؟']
  };
  L.persian = {
    name: 'Persian (Farsi)', lang: 'fa-IR', dir: 'rtl', font: "'Noto Naskh Arabic'",
    rows: ['‍ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ ۰ - =', 'ض ص ث ق ف غ ع ه خ ح ج چ پ', 'ش س ی ب ل ا ت ن م ک گ', 'ظ ط ز ر ذ د ئ و . /'],
    shiftRows: ['÷ ! ٬ ٫ ﷼ ٪ × ، * ) ( ـ +', 'ْ ٌ ٍ ً ُ ِ َ ّ ] [ } { |', 'ؤ ئ ي إ أ آ ة » « : ؛', 'ك ٓ ژ ٰ ‌ ٔ ء > < ؟'],
    extra: ['پ', 'چ', 'ژ', 'گ', 'ک', 'ی', '‌', 'َ', 'ِ', 'ُ', 'ّ', '،', '؟']
  };
  L.georgian = {
    name: 'Georgian', lang: 'ka-GE', font: "'Noto Sans Georgian'", noCase: true,
    rows: [DIGITS, 'ქ წ ე რ ტ ყ უ ი ო პ [ ] \\', 'ა ს დ ფ გ ჰ ჯ კ ლ ; \'', 'ზ ხ ც ვ ბ ნ მ , . /'],
    shiftMap: { KeyW: 'ჭ', KeyR: 'ღ', KeyT: 'თ', KeyS: 'შ', KeyJ: 'ჟ', KeyZ: 'ძ', KeyC: 'ჩ' }
  };
  L.armenian = {
    name: 'Armenian (phonetic)', lang: 'hy-AM', font: "'Noto Sans'",
    rows: ['՝ է թ փ ձ ջ ւ և ր չ ճ - ժ', 'ք ո ե ռ տ ը ւ ի օ պ խ ծ շ', 'ա ս դ ֆ գ հ յ կ լ ; \'', 'զ ղ ց վ բ ն մ , . /']
  };
  L.hangul = {
    name: 'Korean (2-set)', lang: 'ko-KR', font: "'Noto Sans KR'", noCase: true, compose: 'hangul',
    rows: [DIGITS, 'ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ [ ] \\', 'ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ ; \'', 'ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ , . /'],
    shiftMap: { KeyQ: 'ㅃ', KeyW: 'ㅉ', KeyE: 'ㄸ', KeyR: 'ㄲ', KeyT: 'ㅆ', KeyO: 'ㅒ', KeyP: 'ㅖ' }
  };
  L.thai = {
    name: 'Thai (Kedmanee)', lang: 'th-TH', font: "'Noto Sans Thai'", noCase: true,
    rows: ['_ ๅ / - ภ ถ ุ ึ ค ต จ ข ช', 'ๆ ไ ำ พ ะ ั ี ร น ย บ ล ฃ', 'ฟ ห ก ด เ ้ ่ า ส ว ง', 'ผ ป แ อ ิ ื ท ม ใ ฝ'],
    shiftRows: ['% + ๑ ๒ ๓ ๔ ู ฿ ๕ ๖ ๗ ๘ ๙', '๐ " ฎ ฑ ธ ํ ๊ ณ ฯ ญ ฐ , ฅ', 'ฤ ฆ ฏ โ ฌ ็ ๋ ษ ศ ซ .', '( ) ฉ ฮ ฺ ์ ? ฒ ฬ ฦ']
  };
  L.devanagari = {
    name: 'Hindi (InScript)', lang: 'hi-IN', font: "'Noto Sans Devanagari'", noCase: true,
    rows: ['ॊ १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ', 'ौ ै ा ी ू ब ह ग द ज ड ़ ॉ', 'ो े ् ि ु प र क त च ट', 'ॆ ं म न व ल स , . य'],
    shiftRows: ['ऒ ऍ ॅ ्र र् ज्ञ त्र क्ष श्र ( ) ः ऋ', 'औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ', 'ओ ए अ इ उ फ ऱ ख थ छ ठ', 'ऎ ँ ण ऩ ऴ ळ श ष । य़'],
    extra: ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ं', 'ँ', 'ः', '्', '़', '।']
  };
  L.hiragana = { name: 'Japanese hiragana (type romaji)', lang: 'ja-JP', font: "'Noto Sans JP'", compose: 'kana', rows: LATIN, shiftRows: LATIN_SHIFT, chartFirst: true };
  L.katakana = { name: 'Japanese katakana (type romaji)', lang: 'ja-JP', font: "'Noto Sans JP'", compose: 'kata', rows: LATIN, shiftRows: LATIN_SHIFT, chartFirst: true };
  L.mandarin = { name: 'Mandarin (pinyin → 汉字)', lang: 'zh-CN', font: "'Noto Sans SC'", compose: 'pinyin', rows: LATIN, shiftRows: LATIN_SHIFT };
  L.pinyin = { name: 'Pinyin with tone marks', lang: 'zh-CN', compose: 'pinyin-only', rows: LATIN, shiftRows: LATIN_SHIFT };
  L.accents = {
    name: 'Latin accents (é, ñ, ü, å…)', lang: 'en-US', rows: LATIN, shiftRows: LATIN_SHIFT,
    extra: ['á', 'à', 'â', 'ä', 'ã', 'å', 'æ', 'ç', 'é', 'è', 'ê', 'ë', 'í', 'ì', 'î', 'ï', 'ñ', 'ó', 'ò', 'ô', 'ö', 'õ', 'ø', 'œ', 'ß', 'ú', 'ù', 'û', 'ü', 'ý', 'ÿ', 'ğ', 'ı', 'ş', 'č', 'š', 'ž', 'ł', '¿', '¡', '€']
  };

  // Kana charts in gojūon order (used as the “ABC order” view).
  const HIRA_CHART = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもや ゆ よらりるれろわ を ん'.replace(/ /g, '').split('')
    .concat(['゛', '゜', 'ゃ', 'ゅ', 'ょ', 'っ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ー', '、', '。']);
  const toKata = s => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
  L.hiragana.chart = HIRA_CHART;
  L.katakana.chart = HIRA_CHART.map(toKata);
  L.accents.chart = null;

  // ------------------------------------------------------------ romaji → kana
  const ROMA = {};
  (function () {
    const V = 'aiueo';
    'あいうえお'.split('').forEach((k, i) => { ROMA[V[i]] = k; });
    [['k', 'かきくけこ'], ['g', 'がぎぐげご'], ['s', 'さしすせそ'], ['z', 'ざじずぜぞ'], ['t', 'たちつてと'], ['d', 'だぢづでど'], ['n', 'なにぬねの'],
      ['h', 'はひふへほ'], ['b', 'ばびぶべぼ'], ['p', 'ぱぴぷぺぽ'], ['m', 'まみむめも'], ['r', 'らりるれろ']]
      .forEach(([c, ks]) => ks.split('').forEach((k, i) => { ROMA[c + V[i]] = k; }));
    Object.assign(ROMA, { ya: 'や', yu: 'ゆ', yo: 'よ', wa: 'わ', wo: 'を', shi: 'し', chi: 'ち', tsu: 'つ', fu: 'ふ', ji: 'じ', "n'": 'ん', 'xn': 'ん',
      fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ', she: 'しぇ', je: 'じぇ', che: 'ちぇ', ti: 'てぃ', di: 'でぃ', wi: 'うぃ', we: 'うぇ', va: 'ゔぁ', vi: 'ゔぃ', vu: 'ゔ', ve: 'ゔぇ', vo: 'ゔぉ',
      xtu: 'っ', ltu: 'っ', xtsu: 'っ', xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', lya: 'ゃ', lyu: 'ゅ', lyo: 'ょ', '-': 'ー', ',': '、', '.': '。', '?': '？', '!': '！', '[': '「', ']': '」' });
    'ぁぃぅぇぉ'.split('').forEach((k, i) => { ROMA['x' + V[i]] = k; ROMA['l' + V[i]] = k; });
    [['ky', 'き'], ['gy', 'ぎ'], ['sh', 'し'], ['sy', 'し'], ['j', 'じ'], ['jy', 'じ'], ['zy', 'じ'], ['ch', 'ち'], ['ty', 'ち'], ['cy', 'ち'], ['dy', 'ぢ'],
      ['ny', 'に'], ['hy', 'ひ'], ['by', 'び'], ['py', 'ぴ'], ['my', 'み'], ['ry', 'り']]
      .forEach(([c, k]) => { ROMA[c + 'a'] = k + 'ゃ'; ROMA[c + 'u'] = k + 'ゅ'; ROMA[c + 'o'] = k + 'ょ'; });
  })();
  const ROMA_KEYS = Object.keys(ROMA);
  const isPrefix = b => ROMA_KEYS.some(k => k.length > b.length && k.startsWith(b));
  const CONS = /^[bcdfghjklmpqrstvwxyz]$/;
  // Converts as much of a romaji buffer as possible; returns [kana, rest].
  function romaji(buf, flush) {
    let b = buf.toLowerCase(), out = '';
    for (let guard = 0; b && guard < 50; guard++) {
      if (b === 'nn') { if (flush) { out += 'ん'; b = ''; } break; }
      if (b.startsWith('nn') && b.length >= 3) { out += 'ん'; b = /[aiueoy]/.test(b[2]) ? b.slice(1) : b.slice(2); continue; }
      if (b[0] === 'n' && b.length >= 2 && !/[aiueoyn']/.test(b[1])) { out += 'ん'; b = b.slice(1); continue; }
      if (b.length >= 2 && b[0] === b[1] && CONS.test(b[0]) && b[0] !== 'n') { out += 'っ'; b = b.slice(1); continue; }
      if (ROMA[b] && !isPrefix(b)) { out += ROMA[b]; b = ''; break; }
      if (!isPrefix(b) && !ROMA[b]) {
        // Longest known start, else pass the first character through.
        let hit = '';
        for (let n = Math.min(4, b.length); n > 0; n--) if (ROMA[b.slice(0, n)]) { hit = b.slice(0, n); break; }
        if (hit) { out += ROMA[hit]; b = b.slice(hit.length); } else { out += b[0]; b = b.slice(1); }
        continue;
      }
      if (flush) {
        if (b === 'n' || b === 'nn') { out += 'ん'; b = ''; } else if (ROMA[b]) { out += ROMA[b]; b = ''; } else { out += b[0]; b = b.slice(1); }
        continue;
      }
      break;
    }
    return [out, b];
  }
  const DAKU = { か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ', た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど', は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ', う: 'ゔ' };
  const HANDAKU = { は: 'ぱ', ひ: 'ぴ', ふ: 'ぷ', へ: 'ぺ', ほ: 'ぽ' };
  function kanaMark(prev, mark) {
    const kata = /[ァ-ヶ]/.test(prev), h = kata ? String.fromCharCode(prev.charCodeAt(0) - 0x60) : prev;
    const r = mark === '゛' ? DAKU[h] : HANDAKU[h];
    return r ? (kata ? toKata(r) : r) : null;
  }

  // ------------------------------------------------------------ pinyin
  const TONES = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', ü: 'ǖǘǚǜ' };
  function toneMark(syl, t) {
    syl = syl.replace(/v/g, 'ü').replace(/V/g, 'Ü');
    if (!(t >= 1 && t <= 4)) return syl;
    const low = syl.toLowerCase();
    let i = low.indexOf('a');
    if (i < 0) i = low.indexOf('e');
    if (i < 0 && low.includes('ou')) i = low.indexOf('o');
    if (i < 0) { for (let k = low.length - 1; k >= 0; k--) if ('iouü'.includes(low[k])) { i = k; break; } }
    if (i < 0) return syl;
    const ch = low[i], m = TONES[ch][t - 1], up = syl[i] !== low[i];
    return syl.slice(0, i) + (up ? m.toUpperCase() : m) + syl.slice(i + 1);
  }
  const stripTone = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ü|ü/g, 'v').toLowerCase();
  const toneOf = s => { const d = s.normalize('NFD'); return /̄/.test(d) ? 1 : /́/.test(d) ? 2 : /̌/.test(d) ? 3 : /̀/.test(d) ? 4 : 5; };
  // About 300 of the most common characters, as character + pinyin + tone.
  const HZ = ('的de5 一yi1 是shi4 不bu4 了le5 人ren2 我wo3 在zai4 有you3 他ta1 这zhe4 中zhong1 大da4 来lai2 上shang4 国guo2 个ge4 到dao4 说shuo1 们men5 为wei4 子zi5 和he2 你ni3 地di4 出chu1 道dao4 也ye3 时shi2 年nian2 得de2 就jiu4 那na4 要yao4 下xia4 以yi3 生sheng1 会hui4 自zi4 着zhe5 去qu4 之zhi1 过guo4 家jia1 学xue2 对dui4 可ke3 她ta1 里li3 后hou4 小xiao3 么me5 心xin1 多duo1 天tian1 而er2 能neng2 好hao3 都dou1 然ran2 没mei2 日ri4 于yu2 起qi3 还hai2 发fa1 成cheng2 事shi4 只zhi3 作zuo4 当dang1 想xiang3 看kan4 文wen2 无wu2 开kai1 手shou3 十shi2 用yong4 主zhu3 行xing2 方fang1 又you4 如ru2 前qian2 所suo3 本ben3 见jian4 经jing1 头tou2 面mian4 公gong1 同tong2 三san1 已yi3 老lao3 从cong2 动dong4 两liang3 长chang2 知zhi1 民min2 样yang4 现xian4 分fen1 将jiang1 外wai4 但dan4 身shen1 些xie1 与yu3 高gao1 意yi4 进jin4 把ba3 法fa3 此ci3 实shi2 回hui2 二er4 理li3 美mei3 点dian3 月yue4 明ming2 机ji1 很hen3 最zui4 因yin1 气qi4 水shui3 吃chi1 喝he1 爱ai4 叫jiao4 名ming2 字zi4 书shu1 朋peng2 友you5 请qing3 谢xie4 再zai4 见jian4 早zao3 晚wan3 饭fan4 茶cha2 米mi3 肉rou4 鱼yu2 鸡ji1 猫mao1 狗gou3 马ma3 妈ma1 爸ba4 哥ge1 姐jie3 弟di4 妹mei4 儿er2 女nv3 男nan2 孩hai2 师shi1 老lao3 校xiao4 车che1 路lu4 门men2 口kou3 山shan1 火huo3 木mu4 金jin1 土tu3 风feng1 雨yu3 雪xue3 花hua1 草cao3 树shu4 石shi2 白bai2 黑hei1 红hong2 绿lv4 蓝lan2 四si4 五wu3 六liu4 七qi1 八ba1 九jiu3 百bai3 千qian1 万wan4 块kuai4 钱qian2 买mai3 卖mai4 走zou3 跑pao3 坐zuo4 站zhan4 听ting1 读du2 写xie3 问wen4 答da2 给gei3 找zhao3 做zuo4 睡shui4 觉jiao4 玩wan2 住zhu4 喜xi3 欢huan1 忙mang2 累lei4 冷leng3 热re4 快kuai4 慢man4 新xin1 旧jiu4 贵gui4 便pian2 宜yi2 少shao3 左zuo3 右you4 东dong1 西xi1 南nan2 北bei3 今jin1 明ming2 昨zuo2 年nian2 星xing1 期qi1 周zhou1 点dian3 分fen1 钟zhong1 半ban4 岁sui4 医yi1 院yuan4 店dian4 京jing1 海hai3 汉han4 语yu3 英ying1 电dian4 话hua4 视shi4 脑nao3 衣yi1 服fu2 飞fei1 船chuan2 票piao4 房fang2 间jian1 桌zhuo1 椅yi3 杯bei1 米mi3 面mian4 包bao1 果guo3 苹ping2 菜cai4 汤tang1 奶nai3 糖tang2 手shou3 眼yan3 耳er3 鼻bi2 嘴zui3 脚jiao3 病bing4 药yao4 帮bang1 忙mang2 等deng3 让rang4 快kuai4 乐le4 生sheng1 日ri4 谁shei2 什shen2 哪na3 怎zen3 吗ma5 呢ne5 吧ba5 啊a5')
    .split(' ').map(t => { const m = t.match(/^(.)([a-z]+)(\d)$/); return m && { c: m[1], p: m[2], t: +m[3] }; }).filter(Boolean);
  const hzFor = (buf, tone) => {
    const b = stripTone(buf), seen = new Set();
    if (!b) return [];
    return HZ.filter(h => (h.p === b || (!tone && b.length >= 2 && h.p.startsWith(b))) && (!tone || h.t === tone))
      .sort((x, y) => (x.p === b ? 0 : 1) - (y.p === b ? 0 : 1))
      .filter(h => !seen.has(h.c) && seen.add(h.c)).slice(0, 16);
  };

  // ------------------------------------------------------------ Hangul
  const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
  const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const VV = { 'ㅗㅏ': 'ㅘ', 'ㅗㅐ': 'ㅙ', 'ㅗㅣ': 'ㅚ', 'ㅜㅓ': 'ㅝ', 'ㅜㅔ': 'ㅞ', 'ㅜㅣ': 'ㅟ', 'ㅡㅣ': 'ㅢ' };
  const TT = { 'ㄱㅅ': 'ㄳ', 'ㄴㅈ': 'ㄵ', 'ㄴㅎ': 'ㄶ', 'ㄹㄱ': 'ㄺ', 'ㄹㅁ': 'ㄻ', 'ㄹㅂ': 'ㄼ', 'ㄹㅅ': 'ㄽ', 'ㄹㅌ': 'ㄾ', 'ㄹㅍ': 'ㄿ', 'ㄹㅎ': 'ㅀ', 'ㅂㅅ': 'ㅄ' };
  const split2 = (map, v) => { for (const k in map) if (map[k] === v) return [k[0], k[1]]; return null; };
  const isCons = c => CHO.includes(c) || JONG.includes(c) && c !== '';
  const isVow = c => JUNG.includes(c);
  const hangulRender = s => !s ? '' : s.l && s.v ? String.fromCharCode(0xAC00 + (CHO.indexOf(s.l) * 21 + JUNG.indexOf(s.v)) * 28 + JONG.indexOf(s.t || '')) : (s.l || s.v || '');

  // ------------------------------------------------------------ state
  const charts = {};
  let panel = null, target = null, layoutId = 'latin', shift = false, caps = false, view = 'std', physical = true, deadKey = null;
  let comp = null; // {start, len, kind, buf, han}
  let savedInputMode = null, lastTarget = null, getLayoutFor = null;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isMark = c => /^\p{M}+$/u.test(c);
  const showKey = c => isMark(c) ? '◌' + c : c === '‌' ? 'ZWNJ' : c === '‍' ? 'ZWJ' : c;
  const layout = () => L[layoutId] || L.latin;
  const tokens = s => s.split(' ').filter(x => x !== '');

  function css() {
    if (document.getElementById('mkb-css')) return;
    const st = document.createElement('style'); st.id = 'mkb-css';
    st.textContent = '.mkb{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:9999;width:min(920px,calc(100vw - 16px));background:#0E2A47;color:#EDEAE0;border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,.4);font:14px "IBM Plex Sans",system-ui,sans-serif;user-select:none;-webkit-user-select:none;touch-action:manipulation}' +
      '.mkb.min .mkb-body{display:none}.mkb-head{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 10px;cursor:move;border-bottom:1px solid rgba(111,209,224,.25)}' +
      '.mkb-head b{font:700 13px "Space Grotesk",sans-serif;margin-right:auto}.mkb-head select,.mkb-head button{background:#16395e;color:#EDEAE0;border:1px solid rgba(111,209,224,.35);border-radius:6px;padding:5px 8px;font:inherit;font-size:12.5px;cursor:pointer;max-width:48vw}' +
      '.mkb-head button.on{background:#E2A63B;color:#3b2a0c;border-color:#E2A63B}.mkb-body{padding:8px}.mkb-comp{display:flex;gap:6px;align-items:center;flex-wrap:wrap;min-height:0;margin-bottom:6px}.mkb-comp:empty{display:none}' +
      '.mkb-comp .buf{background:#fff;color:#16202B;border-radius:5px;padding:4px 8px;font-size:17px;text-decoration:underline dotted}.mkb-comp button{background:#fff7e6;color:#16202B;border:0;border-radius:5px;padding:4px 8px;font-size:20px;cursor:pointer;line-height:1.2}.mkb-comp button small{display:block;font-size:10px;color:#6b5a33}' +
      '.mkb-row{display:flex;gap:4px;margin-bottom:4px;justify-content:center}.mkb-wrap{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;max-height:38vh;overflow:auto;margin-bottom:4px}' +
      '.mkb-k{flex:1 1 0;min-width:0;max-width:64px;height:46px;background:#EDEAE0;color:#16202B;border:0;border-radius:6px;font-size:21px;cursor:pointer;position:relative;padding:0;line-height:1;box-shadow:0 2px 0 rgba(0,0,0,.35)}' +
      '.mkb-wrap .mkb-k{flex:0 0 auto;width:48px;max-width:none}.mkb-k small{position:absolute;left:4px;top:3px;font-size:9px;color:rgba(22,32,43,.45);font-family:"IBM Plex Sans",sans-serif}' +
      '.mkb-k:active,.mkb-k.hit{background:#E2A63B;transform:translateY(1px)}.mkb-k.fn{background:#3c5f82;color:#fff;font-size:13px;max-width:none;flex:1.6 1 0}.mkb-k.fn.on{background:#E2A63B;color:#3b2a0c}.mkb-k.space{flex:6 1 0;max-width:none}' +
      '.mkb-k.dead{background:#fff2cc}.mkb-extra{border-top:1px dashed rgba(111,209,224,.3);padding-top:6px;margin-top:2px}.mkb-note{font-size:11.5px;color:rgba(237,234,224,.7);margin:4px 2px 0}' +
      '.mkb-btn{display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(22,32,43,.28);background:#fff;color:#16202B;border-radius:4px;padding:0 9px;cursor:pointer;font-size:16px;min-height:38px}' +
      '@media(max-width:620px){.mkb{bottom:0;border-radius:10px 10px 0 0;width:100vw}.mkb-k{height:42px;font-size:18px}.mkb-k small{display:none}.mkb-wrap .mkb-k{width:40px}.mkb-head b{display:none}}';
    document.head.appendChild(st);
  }

  function build() {
    css();
    panel = document.createElement('div'); panel.className = 'mkb'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'On-screen keyboard');
    panel.innerHTML = '<div class="mkb-head"><b>⌨️ Keyboard</b><select class="mkb-layout" aria-label="Keyboard language"></select><select class="mkb-view" aria-label="Key order"><option value="std">Standard layout</option><option value="abc">ABC order</option></select>' +
      '<button type="button" class="mkb-phys" title="When on, your computer’s keys type this script, matched by key position">🖮 My keys type it</button><button type="button" class="mkb-say" title="Read the text aloud">🔊</button><button type="button" class="mkb-min" title="Minimise">▁</button><button type="button" class="mkb-close" title="Close keyboard">✕</button></div>' +
      '<div class="mkb-body"><div class="mkb-comp"></div><div class="mkb-keys"></div><p class="mkb-note"></p></div>';
    document.body.appendChild(panel);
    const sel = panel.querySelector('.mkb-layout');
    sel.innerHTML = Object.keys(L).map(id => '<option value="' + esc(id) + '">' + esc(L[id].name) + '</option>').join('');
    sel.onchange = () => setLayout(sel.value, true);
    panel.querySelector('.mkb-view').onchange = e => { view = e.target.value; render(); };
    panel.querySelector('.mkb-phys').onclick = () => { physical = !physical; render(); };
    panel.querySelector('.mkb-say').onclick = () => {
      const t = target || lastTarget; if (!t || !('speechSynthesis' in window)) return;
      const text = (t.value || '').slice(0, 800); if (!text.trim()) return;
      speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = layout().lang || 'en-US'; u.rate = .85; speechSynthesis.speak(u);
    };
    panel.querySelector('.mkb-min').onclick = () => panel.classList.toggle('min');
    panel.querySelector('.mkb-close').onclick = close;
    // Keep the caret in the text field: keys never take focus.
    panel.addEventListener('pointerdown', e => { if (!e.target.closest('select')) e.preventDefault(); });
    panel.addEventListener('click', e => {
      const k = e.target.closest('[data-k],[data-fn],[data-cand]'); if (!k) return;
      if (k.dataset.cand != null) { commitCandidate(k.dataset.cand); return; }
      if (k.dataset.fn) { fn(k.dataset.fn); return; }
      press(k.dataset.k);
    });
    // Drag the header to move the keyboard.
    const head = panel.querySelector('.mkb-head'); let drag = null;
    head.addEventListener('pointerdown', e => { if (e.target.closest('select,button')) return; const r = panel.getBoundingClientRect(); drag = { dx: e.clientX - r.left, dy: e.clientY - r.top }; head.setPointerCapture(e.pointerId); });
    head.addEventListener('pointermove', e => { if (!drag) return; panel.style.transform = 'none'; panel.style.left = Math.max(0, Math.min(innerWidth - 60, e.clientX - drag.dx)) + 'px'; panel.style.top = Math.max(0, Math.min(innerHeight - 40, e.clientY - drag.dy)) + 'px'; panel.style.bottom = 'auto'; });
    head.addEventListener('pointerup', () => { drag = null; });
  }

  function keyRows() {
    const lay = layout();
    return lay.rows.map((r, ri) => tokens(r).map((ch, ci) => {
      const code = CODES[ri][ci];
      let sh = lay.shiftMap ? (lay.shiftMap[code] || ch) : lay.shiftRows ? (tokens(lay.shiftRows[ri])[ci] || ch) : (lay.noCase ? ch : ch.toUpperCase());
      return { code, n: ch, s: sh };
    }));
  }
  function chartKeys() {
    const lay = layout();
    const list = charts[layoutId] || lay.chart || [];
    return list.concat((lay.extra || []).filter(x => !list.includes(x)));
  }
  function render() {
    if (!panel) return;
    const lay = layout();
    panel.querySelector('.mkb-layout').value = layoutId;
    const hasChart = chartKeys().length > 0 && !!lay.rows;
    const vsel = panel.querySelector('.mkb-view'); vsel.style.display = hasChart ? '' : 'none';
    if (!lay.rows) view = 'abc'; else if (!hasChart) view = 'std';
    vsel.value = view;
    const phys = panel.querySelector('.mkb-phys'); phys.classList.toggle('on', physical); phys.style.display = lay.rows ? '' : 'none';
    const up = shift !== caps;
    let html = '';
    const keyBtn = (out, sub) => { const d = lay.dead && lay.dead[out]; return '<button type="button" class="mkb-k' + (d ? ' dead' : '') + '" data-k="' + esc(out) + '" style="font-family:' + (lay.font || 'inherit') + ',sans-serif" aria-label="' + esc(out) + '">' + (sub ? '<small>' + esc(sub) + '</small>' : '') + esc(showKey(out)) + '</button>'; };
    if (view === 'abc') {
      const keys = chartKeys().map(k => up && !lay.noCase ? k.toUpperCase() : k);
      html += '<div class="mkb-wrap" dir="' + (lay.dir || 'ltr') + '">' + keys.map(k => keyBtn(k)).join('') + '</div>';
    } else {
      const latinRows = LATIN.map(tokens);
      keyRows().forEach((row, ri) => {
        html += '<div class="mkb-row">' + (ri === 3 ? '<button type="button" class="mkb-k fn' + (shift ? ' on' : '') + '" data-fn="shift">⇧ Shift</button>' : ri === 2 ? '<button type="button" class="mkb-k fn' + (caps ? ' on' : '') + '" data-fn="caps">⇪</button>' : '') +
          row.map((k, ci) => keyBtn(up ? k.s : k.n, lay.rows === LATIN ? '' : (latinRows[ri][ci] || ''))).join('') +
          (ri === 0 ? '<button type="button" class="mkb-k fn" data-fn="back">⌫</button>' : ri === 3 ? '<button type="button" class="mkb-k fn' + (shift ? ' on' : '') + '" data-fn="shift">⇧</button>' : '') + '</div>';
      });
      if (lay.extra && lay.extra.length) html += '<div class="mkb-wrap mkb-extra" dir="' + (lay.dir || 'ltr') + '">' + lay.extra.map(k => keyBtn(k)).join('') + '</div>';
    }
    html += '<div class="mkb-row">' + (view === 'abc' ? '<button type="button" class="mkb-k fn' + (shift ? ' on' : '') + '" data-fn="shift">⇧</button>' : '') +
      '<button type="button" class="mkb-k fn" data-fn="left">←</button><button type="button" class="mkb-k space" data-fn="space">space</button><button type="button" class="mkb-k fn" data-fn="right">→</button>' +
      (view === 'abc' ? '<button type="button" class="mkb-k fn" data-fn="back">⌫</button>' : '') + '<button type="button" class="mkb-k fn" data-fn="enter">⏎</button></div>';
    panel.querySelector('.mkb-keys').innerHTML = html;
    const notes = {
      hangul: 'Type letters in order — consonant, vowel, final consonant — and they join into syllable blocks: ㅎ ㅏ ㄴ → 한.',
      kana: 'Type romaji (ka, shi, tsu, kyo, nn) and it turns into kana, or tap kana in ABC order. ゛ and ゜ change the letter before them (か → が).',
      kata: 'Type romaji (ka, shi, tsu, kyo, nn) and it turns into katakana, or tap katakana in ABC order.',
      pinyin: 'Type pinyin, then a tone number 1–4 (ma3 → mǎ). Tap a character to insert it, or Space to keep the pinyin. v = ü.',
      'pinyin-only': 'Type a syllable then its tone number: ma3 → mǎ, lv4 → lǜ.'
    };
    panel.querySelector('.mkb-note').textContent = (notes[lay.compose] || (lay.dead ? 'Yellow keys are accents: press them, then the vowel (΄ then α → ά).' : '')) +
      (physical && lay.rows && view === 'std' ? (notes[lay.compose] || lay.dead ? ' ' : '') + 'Your own keys type in this layout too — small grey letters show which key to press.' : '');
    renderComp();
    panel.dir = 'ltr';
  }
  function renderComp() {
    const box = panel && panel.querySelector('.mkb-comp'); if (!box) return;
    const lay = layout();
    if (!comp || !comp.buf || lay.compose !== 'pinyin' && lay.compose !== 'pinyin-only') { box.innerHTML = ''; return; }
    let h = '<span class="buf">' + esc(comp.buf) + '</span>';
    if (lay.compose === 'pinyin') {
      const t = toneOf(comp.buf), c = hzFor(comp.buf, t < 5 ? t : 0);
      h += c.map(x => '<button type="button" data-cand="' + esc(x.c) + '" style="font-family:\'Noto Sans SC\',sans-serif">' + esc(x.c) + '<small>' + esc(toneMark(x.p, x.t)) + '</small></button>').join('');
      if (!c.length) h += '<span class="mkb-note" style="margin:0">No common character found — press Space to keep the pinyin.</span>';
    }
    box.innerHTML = h;
  }

  // ------------------------------------------------------------ text editing
  function field() { return target && document.body.contains(target) ? target : null; }
  function insert(text, replaceBefore) {
    const t = field(); if (!t) return;
    let s = t.selectionStart, e = t.selectionEnd;
    if (s == null) { t.value += text; fire(t); return; }
    if (replaceBefore) s = Math.max(0, s - replaceBefore);
    t.setRangeText(text, s, e, 'end');
    fire(t);
  }
  function fire(t) { t.dispatchEvent(new Event('input', { bubbles: true })); }
  function caret() { const t = field(); return t ? t.selectionStart : 0; }
  function charBefore() { const t = field(); if (!t) return ''; const s = t.selectionStart; return Array.from(t.value.slice(Math.max(0, s - 2), s)).pop() || ''; }
  // Composition: the text being built sits just before the caret.
  function setComp(text) {
    const t = field(); if (!t || !comp) return;
    t.setRangeText(text, comp.start, comp.start + comp.len, 'end');
    comp.len = text.length; fire(t);
  }
  function endComp(flush) {
    if (!comp) return;
    const lay = layout();
    if (flush && (lay.compose === 'kana' || lay.compose === 'kata') && comp.buf) {
      const [k] = romaji(comp.buf, true); setComp(comp.done + (lay.compose === 'kata' ? toKata(k) : k));
    }
    comp = null; renderComp();
  }
  function compValid() { const t = field(); return comp && t && t.selectionStart === comp.start + comp.len && t.selectionEnd === t.selectionStart; }

  function press(ch) {
    const t = field(); if (!t) return;
    const lay = layout();
    if (comp && !compValid()) comp = null;
    // Dead keys (Greek accents).
    if (lay.dead && lay.dead[ch]) { deadKey = deadKey === ch ? null : ch; if (!deadKey) insert(ch); flashKey(ch); unshift(); return; }
    if (deadKey) { const m = lay.dead[deadKey][ch]; deadKey = null; if (m) { insert(m); unshift(); return; } }
    // Kana voicing marks modify the previous kana.
    if (ch === '゛' || ch === '゜') { endComp(true); const p = charBefore(), r = p && kanaMark(p, ch); if (r) insert(r, 1); unshift(); return; }
    if (lay.compose === 'hangul' && (isCons(ch) || isVow(ch))) { hangul(ch); unshift(); return; }
    if ((lay.compose === 'kana' || lay.compose === 'kata') && /^[a-zA-Z'\-,.?!\[\]]$/.test(ch)) { kana(ch); unshift(); return; }
    if ((lay.compose === 'pinyin' || lay.compose === 'pinyin-only') && /^[a-zA-Z]$/.test(ch)) { pinyinAdd(ch); unshift(); return; }
    if ((lay.compose === 'pinyin' || lay.compose === 'pinyin-only') && /^[1-5]$/.test(ch) && comp && comp.buf) { pinyinTone(+ch); unshift(); return; }
    endComp(true);
    insert(ch); unshift();
  }
  function unshift() { if (shift) { shift = false; render(); } }

  function hangul(ch) {
    const t = field();
    if (!comp || comp.kind !== 'hangul') comp = { kind: 'hangul', start: t.selectionStart, len: 0, han: null };
    const s = comp.han;
    const next = st => { comp = { kind: 'hangul', start: comp.start + comp.len, len: 0, han: st }; setComp(hangulRender(st)); };
    if (isVow(ch)) {
      if (!s) { comp.han = { v: ch }; setComp(ch); return; }
      if (s.l && !s.v) { s.v = ch; setComp(hangulRender(s)); return; }
      if (!s.l && s.v) { const c = VV[s.v + ch]; if (c) { s.v = c; setComp(c); } else next({ v: ch }); return; }
      if (s.l && s.v && !s.t) { const c = VV[s.v + ch]; if (c) { s.v = c; setComp(hangulRender(s)); } else next({ v: ch }); return; }
      if (s.t) { // the final consonant moves to the new syllable: 각+ㅏ → 가가
        const pair = split2(TT, s.t); let carry;
        if (pair) { s.t = pair[0]; carry = pair[1]; } else { carry = s.t; s.t = ''; }
        setComp(hangulRender(s));
        if (CHO.includes(carry)) next({ l: carry, v: ch }); else next({ v: ch });
        return;
      }
    } else {
      if (!s) { comp.han = { l: ch }; setComp(ch); return; }
      if (s.l && s.v && !s.t && JONG.includes(ch)) { s.t = ch; setComp(hangulRender(s)); return; }
      if (s.l && s.v && s.t && TT[s.t + ch]) { s.t = TT[s.t + ch]; setComp(hangulRender(s)); return; }
      next({ l: ch });
    }
  }
  function hangulBack() {
    const s = comp && comp.han; if (!s) return false;
    if (s.t) { const p = split2(TT, s.t); s.t = p ? p[0] : ''; }
    else if (s.v && s.l) { const p = split2(VV, s.v); if (p) s.v = p[0]; else delete s.v; }
    else if (s.v) { const p = split2(VV, s.v); if (p) s.v = p[0]; else { setComp(''); comp = null; return true; } }
    else { setComp(''); comp = null; return true; }
    setComp(hangulRender(s)); return true;
  }
  function kana(ch) {
    const t = field(), lay = layout();
    if (!comp || comp.kind !== 'kana') comp = { kind: 'kana', start: t.selectionStart, len: 0, buf: '', done: '' };
    comp.buf += ch;
    const [k, rest] = romaji(comp.buf, false);
    const conv = lay.compose === 'kata' ? toKata(k) : k;
    comp.done += conv; comp.buf = rest;
    setComp(comp.done + rest);
    if (!rest) { comp = null; }
    else { // keep only the unconverted tail in the composition
      comp.start += comp.done.length; comp.len = rest.length; comp.done = '';
    }
  }
  function pinyinAdd(ch) {
    const t = field();
    if (comp && comp.kind === 'pinyin' && toneOf(comp.buf) < 5) comp = null; // a finished syllable stays as pinyin
    if (!comp || comp.kind !== 'pinyin') comp = { kind: 'pinyin', start: t.selectionStart, len: 0, buf: '' };
    comp.buf = (comp.buf + ch).replace(/v/g, 'ü').replace(/V/g, 'Ü');
    setComp(comp.buf); renderComp();
  }
  function pinyinTone(n) {
    comp.buf = toneMark(stripTone(comp.buf).replace(/v/g, 'ü'), n === 5 ? 0 : n);
    setComp(comp.buf);
    if (layout().compose === 'pinyin-only') { comp = null; renderComp(); return; }
    renderComp();
  }
  function commitCandidate(c) {
    if (!comp || !compValid()) { comp = null; insert(c); return; }
    setComp(c); comp = null; renderComp();
    const t = field(); if (t) t.focus();
  }

  function fn(name) {
    const t = field(); if (!t && name !== 'shift' && name !== 'caps') return;
    if (comp && !compValid()) comp = null;
    if (name === 'shift') { shift = !shift; render(); return; }
    if (name === 'caps') { caps = !caps; render(); return; }
    if (name === 'back') {
      deadKey = null;
      if (comp && comp.kind === 'hangul' && hangulBack()) return;
      if (comp && comp.buf) { comp.buf = Array.from(comp.buf).slice(0, -1).join(''); setComp((comp.done || '') + comp.buf); if (!comp.buf && !comp.done) comp = null; renderComp(); return; }
      comp = null;
      const s = t.selectionStart, e = t.selectionEnd;
      if (s !== e) t.setRangeText('', s, e, 'end');
      else if (s > 0) { const before = t.value.slice(0, s), n = (Array.from(before).pop() || '').length || 1; t.setRangeText('', s - n, s, 'end'); }
      fire(t); return;
    }
    if (name === 'space') { endComp(true); insert(' '); return; }
    if (name === 'enter') {
      if (comp && comp.buf) { endComp(true); return; }
      endComp(true);
      if (t.tagName === 'TEXTAREA') insert('\n');
      else { t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true })); const f = t.form; if (f && f.requestSubmit) try { f.requestSubmit(); } catch (e) {} }
      return;
    }
    if (name === 'left' || name === 'right') {
      endComp(true);
      const p = t.selectionStart + (name === 'left' ? -1 : 1); const q = Math.max(0, Math.min(t.value.length, p)); t.setSelectionRange(q, q); return;
    }
  }
  function flashKey(ch) {
    if (!panel) return;
    panel.querySelectorAll('.mkb-k').forEach(b => { if (b.dataset.k === ch) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 140); } });
  }

  // Physical keyboard: map key positions to the chosen layout.
  document.addEventListener('keydown', e => {
    if (!panel || panel.hidden || !physical || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const t = field(); if (!t || document.activeElement !== t) return;
    const lay = layout(); if (!lay.rows || lay.rows === LATIN && !lay.compose) return;
    if (e.key === 'Backspace' && comp) { e.preventDefault(); fn('back'); return; }
    if ((e.key === ' ' || e.key === 'Enter') && comp && comp.buf) { e.preventDefault(); fn(e.key === ' ' ? 'space' : 'enter'); return; }
    if (e.key === 'Enter' || e.key === 'Tab' || e.key.startsWith('Arrow')) { endComp(true); return; }
    let ri = -1, ci = -1;
    CODES.forEach((r, i) => { const j = r.indexOf(e.code); if (j >= 0) { ri = i; ci = j; } });
    if (ri < 0) return;
    const k = (keyRows()[ri] || [])[ci]; if (!k) return;
    e.preventDefault();
    const up = e.shiftKey !== e.getModifierState('CapsLock');
    const ch = up ? k.s : k.n;
    flashKey(ch);
    press(ch);
  }, true);
  document.addEventListener('focusin', e => {
    if (!panel || panel.hidden) return;
    const el = e.target;
    if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' && /^(text|search|email|url|)$/i.test(el.type || '')) && !panel.contains(el)) {
      if (el !== target) { endComp(false); restoreInputMode(); target = el; lastTarget = el; hidePhoneKeyboard(); if (getLayoutFor) { const id = getLayoutFor(el); if (id && L[id] && id !== layoutId) setLayout(id); } reveal(); }
    }
  });
  document.addEventListener('pointerdown', e => { if (comp && panel && !panel.contains(e.target)) endComp(true); }, true);

  // Scroll so the field being typed in is not hidden behind the keyboard.
  function reveal() {
    const t = field(); if (!t || !panel || panel.hidden || panel.style.top) return;
    requestAnimationFrame(() => {
      const r = t.getBoundingClientRect(), top = panel.getBoundingClientRect().top;
      if (r.bottom > top - 12) window.scrollBy({ top: Math.min(r.top - 80, r.bottom - top + 24), behavior: 'smooth' });
    });
  }
  const coarse = () => window.matchMedia && matchMedia('(pointer:coarse)').matches;
  function hidePhoneKeyboard() { if (target && coarse()) { savedInputMode = target.getAttribute('inputmode'); target.setAttribute('inputmode', 'none'); } }
  function restoreInputMode() { if (target && coarse()) { if (savedInputMode == null) target.removeAttribute('inputmode'); else target.setAttribute('inputmode', savedInputMode); } savedInputMode = null; }

  function setLayout(id, user) {
    if (!L[id]) return;
    endComp(true); layoutId = id; deadKey = null; shift = false;
    const hasChart = !!(charts[id] || L[id].chart);
    if (!L[id].rows) view = 'abc';
    else if (!hasChart) view = 'std';
    else if (L[id].chartFirst) view = 'abc';
    else if (!user) view = 'std';
    render();
    try { localStorage.setItem('migaKeyboardLayout', id); } catch (e) {}
    if (user && target) target.focus();
  }
  function open(opts) {
    opts = opts || {};
    if (!panel) build();
    panel.hidden = false; panel.classList.remove('min');
    if (opts.target) { if (opts.target !== target) restoreInputMode(); target = opts.target; lastTarget = target; hidePhoneKeyboard(); }
    let id = opts.layout;
    if (!id || !L[id]) { try { id = localStorage.getItem('migaKeyboardLayout'); } catch (e) {} }
    if (!id || !L[id]) id = layoutId;
    if (opts.view) view = opts.view;
    setLayout(id);
    if (opts.view) { view = opts.view; render(); }
    if (target) { target.focus(); try { const n = target.value.length; if (document.activeElement === target && target.selectionStart == null) target.setSelectionRange(n, n); } catch (e) {} }
    document.dispatchEvent(new CustomEvent('migakeyboard', { detail: { open: true } }));
    reveal();
  }
  function close() {
    endComp(true); restoreInputMode();
    if (panel) panel.hidden = true;
    document.dispatchEvent(new CustomEvent('migakeyboard', { detail: { open: false } }));
  }
  function isOpen() { return !!panel && !panel.hidden; }
  // Adds a ⌨️ button right after a field. layoutFor is a string or a function returning a layout id.
  function attach(el, layoutFor, label) {
    if (!el || el.dataset.mkb) return null;
    el.dataset.mkb = '1';
    const b = document.createElement('button'); b.type = 'button'; b.className = 'mkb-btn'; b.textContent = label || '⌨️'; b.title = 'Open the on-screen keyboard'; b.setAttribute('aria-label', 'Open the on-screen keyboard');
    b.addEventListener('pointerdown', e => e.preventDefault());
    b.onclick = () => {
      const id = typeof layoutFor === 'function' ? layoutFor(el) : layoutFor;
      if (isOpen() && target === el) { close(); return; }
      open({ layout: id, target: el });
    };
    css();
    el.insertAdjacentElement('afterend', b);
    return b;
  }
  function registerLayout(id, def) {
    L[id] = Object.assign({ name: id, lang: 'en-US' }, def);
    if (def.chart) charts[id] = def.chart.slice();
    if (panel) { const sel = panel.querySelector('.mkb-layout'); sel.innerHTML = Object.keys(L).map(k => '<option value="' + esc(k) + '">' + esc(L[k].name) + '</option>').join(''); render(); }
  }
  function setChartKeys(id, list) {
    const seen = new Set();
    charts[id] = (list || []).filter(x => x && !seen.has(x) && seen.add(x));
    if (panel && id === layoutId) render();
  }
  // Turns chart glyph labels (“Α α”, “–ะ”, “เ–ีย”) into typeable keys.
  function keysFromGlyphs(glyphs) {
    const out = [];
    glyphs.forEach(g => String(g || '').replace(/[–◌\-]/g, ' ').split(/\s+/).forEach(tok => {
      if (!tok) return;
      const cps = Array.from(tok);
      if (cps.length > 1 && cps.some(isMark)) cps.forEach(c => out.push(c)); else out.push(tok);
    }));
    return out;
  }

  window.MigaKeyboard = {
    open, close, isOpen, attach, setLayout: id => setLayout(id, false), registerLayout, setChartKeys, keysFromGlyphs,
    layouts: () => Object.keys(L).map(id => ({ id, name: L[id].name, lang: L[id].lang })),
    has: id => !!L[id], layoutFor: fnc => { getLayoutFor = fnc; },
    // Guess a layout from a BCP-47 speech language such as 'ru-RU'.
    forLang(lang) {
      const b = String(lang || '').toLowerCase().split('-')[0];
      return { ru: 'russian', uk: 'ukrainian', el: 'greek', he: 'hebrew', iw: 'hebrew', ar: 'arabic', fa: 'persian', ka: 'georgian', hy: 'armenian', ko: 'hangul', th: 'thai', hi: 'devanagari', mr: 'devanagari', ne: 'devanagari', ja: 'hiragana', zh: 'mandarin',
        es: 'accents', fr: 'accents', de: 'accents', it: 'accents', pt: 'accents', sv: 'accents', nl: 'accents', tr: 'accents', pl: 'accents', cs: 'accents', no: 'accents', nb: 'accents', da: 'accents', fi: 'accents' }[b] || 'latin';
    },
    // 한 → ['ㅎ', 'ㅏ', 'ㄴ']; anything else → null.
    decomposeHangul(ch) {
      const c = String(ch).charCodeAt(0) - 0xAC00; if (!(c >= 0 && c < 11172)) return null;
      return [CHO[Math.floor(c / 588)], JUNG[Math.floor(c % 588 / 28)], JONG[c % 28]].filter(Boolean);
    },
    // For tests.
    _romaji: romaji, _toneMark: toneMark
  };
})(window, document);
