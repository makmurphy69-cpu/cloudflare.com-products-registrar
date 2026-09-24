/* Data for Alphabet Forge (alphabet-forge.html).
 * Each script: id, name, native, lang (speech voice), dir, type, font, intro,
 * writing (how-to-write tips), sections of items and a why(item, script)
 * function that explains why the symbol sounds the way it does.
 * Item fields: g glyph, n name, r romanisation, s sound, say (text to speak),
 * w example word, wr word romanisation, m meaning, y extra note, plus
 * script-specific fields (c class, f final sound, o origin, sun ...).
 */
(function (window) {
  'use strict';
  const S = [];

  // ------------------------------------------------------------ Thai
  const THAI_CLASS = { M: 'mid', H: 'high', L: 'low' };
  const thai = (g, w, wr, m, c, r, f, y) => ({ g, w, wr, m, c, r, f, y, n: g + ' ' + w, say: g + ' ' + w });
  S.push({
    id: 'thai', name: 'Thai', native: 'อักษรไทย', lang: 'th-TH', type: 'Abugida (consonants carry the vowels around them)', font: "'Noto Sans Thai'",
    region: 'Asia',
    intro: 'Thai has 44 consonants, about 32 vowel forms and 4 tone marks. Every consonant has a name made of its sound plus a word that starts with it, like ก ไก่ “gor gai” (g as in chicken). Consonants are split into three classes — mid, high and low — and the class, together with the vowel length and tone marks, decides which of the five tones a syllable is spoken in.',
    writing: ['Write left to right, with no spaces between words (spaces mark the end of a sentence or phrase).', 'Most letters start at their small loop (the “head”) and then continue in one flowing line.', 'Vowels can sit before, after, above or below the consonant, but you always pronounce the consonant first.', 'Tone marks sit above the consonant (or above an upper vowel).'],
    why(it) {
      if (it.kind === 'vowel') return 'The dash (–) shows where the consonant goes. ' + it.y;
      if (it.kind === 'tone') return it.y;
      const cls = THAI_CLASS[it.c];
      const rule = it.c === 'M' ? 'Mid-class letters give a plain syllable a flat, mid tone — so its name is said with a level voice.'
        : it.c === 'H' ? 'High-class letters give a plain syllable a rising tone — that is why its name is said with the voice going up.'
          : 'Low-class letters give a plain syllable a mid tone. Several low-class letters share their sound with a high-class partner (ข/ค, ถ/ท, ผ/พ, ส/ซ); the class, not the sound, tells you which tone a word takes.';
      return it.g + ' is a ' + cls + '-class consonant pronounced “' + it.r + '” at the start of a syllable' + (it.f ? ' and “' + it.f + '” at the end' : '') + '. Its name uses the word ' + it.w + ' (' + it.wr + ', “' + it.m + '”), which begins with this sound. ' + rule + (it.y ? ' ' + it.y : '');
    },
    sections: [
      { title: 'Consonants (44)', items: [
        thai('ก', 'ไก่', 'gai', 'chicken', 'M', 'g (unaspirated k)', 'k', 'It is like the k in “skin” — no puff of air, which to English ears sounds close to g.'),
        thai('ข', 'ไข่', 'khai', 'egg', 'H', 'kh', 'k', 'The kh is an aspirated k with a puff of air, like the k in “kite”.'),
        thai('ฃ', 'ขวด', 'khuat', 'bottle', 'H', 'kh', 'k', 'This letter is obsolete — it is still learned in the alphabet but no longer used in modern words.'),
        thai('ค', 'ควาย', 'khwai', 'water buffalo', 'L', 'kh', 'k'),
        thai('ฅ', 'คน', 'khon', 'person', 'L', 'kh', 'k', 'Obsolete: it was replaced by ค in modern spelling.'),
        thai('ฆ', 'ระฆัง', 'ra-khang', 'bell', 'L', 'kh', 'k', 'Used mostly in words borrowed from Pali and Sanskrit.'),
        thai('ง', 'งู', 'ngu', 'snake', 'L', 'ng', 'ng', 'Thai allows the “ng” of “sing” at the start of a word — try saying “sing” and dropping the “si”.'),
        thai('จ', 'จาน', 'jan', 'plate', 'M', 'j (unaspirated ch)', 't'),
        thai('ฉ', 'ฉิ่ง', 'ching', 'small cymbals', 'H', 'ch', 't'),
        thai('ช', 'ช้าง', 'chang', 'elephant', 'L', 'ch', 't'),
        thai('ซ', 'โซ่', 'so', 'chain', 'L', 's', 't'),
        thai('ฌ', 'เฌอ', 'choe', 'tree', 'L', 'ch', 't', 'Rare; found in Pali/Sanskrit loanwords.'),
        thai('ญ', 'หญิง', 'ying', 'woman', 'L', 'y', 'n', 'At the end of a syllable it sounds like n.'),
        thai('ฎ', 'ชฎา', 'cha-da', 'dancer’s headdress', 'M', 'd', 't'),
        thai('ฏ', 'ปฏัก', 'pa-tak', 'goad', 'M', 't (unaspirated)', 't'),
        thai('ฐ', 'ฐาน', 'than', 'pedestal', 'H', 'th', 't'),
        thai('ฑ', 'มณโฑ', 'mon-tho', 'Montho, a queen in the Ramakien', 'L', 'th (sometimes d)', 't'),
        thai('ฒ', 'ผู้เฒ่า', 'phu-thao', 'old man', 'L', 'th', 't'),
        thai('ณ', 'เณร', 'nen', 'novice monk', 'L', 'n', 'n'),
        thai('ด', 'เด็ก', 'dek', 'child', 'M', 'd', 't'),
        thai('ต', 'เต่า', 'tao', 'turtle', 'M', 't (unaspirated)', 't', 'Like the t in “stop” — no puff of air.'),
        thai('ถ', 'ถุง', 'thung', 'bag', 'H', 'th', 't', 'Thai th is an aspirated t (as in “top”), never the th of “think”.'),
        thai('ท', 'ทหาร', 'tha-han', 'soldier', 'L', 'th', 't'),
        thai('ธ', 'ธง', 'thong', 'flag', 'L', 'th', 't'),
        thai('น', 'หนู', 'nu', 'mouse', 'L', 'n', 'n'),
        thai('บ', 'ใบไม้', 'bai-mai', 'leaf', 'M', 'b', 'p'),
        thai('ป', 'ปลา', 'pla', 'fish', 'M', 'p (unaspirated)', 'p', 'Like the p in “spin”: no puff of air.'),
        thai('ผ', 'ผึ้ง', 'phueng', 'bee', 'H', 'ph', '', 'Thai ph is an aspirated p (as in “pot”), never an f.'),
        thai('ฝ', 'ฝา', 'fa', 'lid', 'H', 'f', ''),
        thai('พ', 'พาน', 'phan', 'offering tray', 'L', 'ph', 'p'),
        thai('ฟ', 'ฟัน', 'fan', 'tooth', 'L', 'f', 'p'),
        thai('ภ', 'สำเภา', 'sam-phao', 'junk (sailing ship)', 'L', 'ph', 'p'),
        thai('ม', 'ม้า', 'ma', 'horse', 'L', 'm', 'm'),
        thai('ย', 'ยักษ์', 'yak', 'giant', 'L', 'y', 'i (forms diphthongs)'),
        thai('ร', 'เรือ', 'ruea', 'boat', 'L', 'r (rolled or tapped; often l in casual speech)', 'n'),
        thai('ล', 'ลิง', 'ling', 'monkey', 'L', 'l', 'n'),
        thai('ว', 'แหวน', 'waen', 'ring', 'L', 'w', 'o/u (forms diphthongs)'),
        thai('ศ', 'ศาลา', 'sa-la', 'pavilion', 'H', 's', 't'),
        thai('ษ', 'ฤๅษี', 'rue-si', 'hermit', 'H', 's', 't'),
        thai('ส', 'เสือ', 'suea', 'tiger', 'H', 's', 't'),
        thai('ห', 'หีบ', 'hip', 'chest (box)', 'H', 'h', '', 'ห also works silently in front of low-class letters (หนู, หญิง) to give them high-class tones.'),
        thai('ฬ', 'จุฬา', 'chu-la', 'star-shaped kite', 'L', 'l', 'n'),
        thai('อ', 'อ่าง', 'ang', 'basin', 'M', 'silent vowel carrier / glottal stop', '', 'อ holds a vowel when a word starts with a vowel sound, and is also used as the vowel “or”.'),
        thai('ฮ', 'นกฮูก', 'nok-huk', 'owl', 'L', 'h', '')
      ] },
      { title: 'Common vowels', items: [
        ['–ะ', 'a (short)', 'จะ', 'ja', 'will (future marker)', 'A short, clipped “a” that stops quickly, like the u in “cut”.'],
        ['–า', 'aa (long)', 'มา', 'maa', 'to come', 'The same sound as –ะ but held about twice as long; in Thai, length changes meaning.'],
        ['–ิ', 'i (short)', 'ดิน', 'din', 'soil', 'Short “i” as in “bit”, written above the consonant.'],
        ['–ี', 'ii (long)', 'ดี', 'dii', 'good', 'Long “ee” as in “see”.'],
        ['–ึ', 'ue (short)', 'ถึง', 'thueng', 'to arrive', 'Say “ee” while keeping your lips spread and pulling the tongue back — there is no English equivalent.'],
        ['–ื', 'uue (long)', 'มือ', 'muue', 'hand', 'The long version of –ึ; at the end of a word it is followed by a silent อ.'],
        ['–ุ', 'u (short)', 'สุข', 'suk', 'happy', 'Short “u” as in “put”, written below the consonant.'],
        ['–ู', 'uu (long)', 'ดู', 'duu', 'to look', 'Long “oo” as in “food”.'],
        ['เ–', 'ee (long)', 'เวลา', 'wee-laa', 'time', 'Written before the consonant but pronounced after it — like the e in “they” without the y glide.'],
        ['แ–', 'ae (long)', 'แม่', 'mae', 'mother', 'An open “a” as in “cat”, held long.'],
        ['โ–', 'oo (long)', 'โรงเรียน', 'roong-rian', 'school', 'A pure long “o”, without the “w” glide English adds.'],
        ['–อ', 'or (long)', 'พอ', 'phor', 'enough', 'Like “aw” in British “law”.'],
        ['เ–ีย', 'ia', 'เรียน', 'rian', 'to study', 'A glide from “ee” to “a”.'],
        ['เ–ือ', 'uea', 'เรือ', 'ruea', 'boat', 'A glide from the ue sound to “a”.'],
        ['–ัว', 'ua', 'ตัว', 'tua', 'body', 'A glide from “oo” to “a”.'],
        ['ไ–', 'ai', 'ไฟ', 'fai', 'fire', 'Like “eye”. ไ– is the common spelling.'],
        ['ใ–', 'ai', 'ใจ', 'jai', 'heart, mind', 'Sounds exactly like ไ– but is used in only 20 native words, which children memorise with a rhyme.'],
        ['เ–า', 'ao', 'เขา', 'khao', 'he/she; mountain', 'Like “ow” in “cow”.'],
        ['–ำ', 'am', 'น้ำ', 'nam', 'water', 'A vowel that already includes the m sound.']
      ].map(([g, r, w, wr, m, y]) => ({ g, r, w, wr, m, y, kind: 'vowel', say: w, n: g })) },
      { title: 'Tone marks', items: [
        ['่', 'mai ek', 'ไก่', 'gai', 'chicken', 'Mai ek gives a low tone with mid- and high-class letters, and a falling tone with low-class letters.'],
        ['้', 'mai tho', 'บ้าน', 'baan', 'house', 'Mai tho gives a falling tone with mid- and high-class letters, and a high tone with low-class letters.'],
        ['๊', 'mai tri', 'โต๊ะ', 'to', 'table', 'Mai tri is used only with mid-class letters and always gives a high tone.'],
        ['๋', 'mai chattawa', 'จ๋า', 'jaa', 'yes, dear (affectionate)', 'Mai chattawa is used only with mid-class letters and always gives a rising tone.']
      ].map(([g, r, w, wr, m, y]) => ({ g: '◌' + g, r, w, wr, m, y, kind: 'tone', say: w, n: r })) }
    ]
  });

  // ------------------------------------------------------------ Arabic
  const SUN = new Set('تثدذرزسشصضطظلن'.split(''));
  const NONJOIN = new Set('اددذرزو'.split(''));
  const ar = (g, n, r, s, w, wr, m, y) => ({ g, n, r, s, w, wr, m, y, say: n });
  S.push({
    id: 'arabic', name: 'Arabic', native: 'الأبجدية العربية', lang: 'ar-SA', dir: 'rtl', type: 'Abjad (consonants; short vowels are optional marks)', font: "'Noto Naskh Arabic'",
    region: 'Middle East & North Africa',
    intro: 'Arabic has 28 letters, written right to left. Most letters join to the next one, so each letter has up to four shapes: on its own, at the start, in the middle and at the end of a word. Short vowels are usually left out and only shown with small marks (harakat) in the Qur’an, poetry and children’s books.',
    writing: ['Write right to left and join letters within a word without lifting the pen where possible.', 'Six letters (ا د ذ ر ز و) never join to the letter after them, so a word can break into pieces.', 'Dots are added after the main shape; the number and position of dots is often the only difference between letters (ب ت ث).', 'Letters sit on a baseline; some (like ج ع م) dip below it.'],
    why(it) {
      const forms = NONJOIN.has(it.g) ? 'It never joins to the next letter, so it only has an isolated and a final shape.' : 'It joins on both sides, so its shape changes at the start, middle and end of a word.';
      const art = SUN.has(it.g) ? 'It is a “sun letter”: after the article ال the l is not pronounced and this letter is doubled instead — ' + (it.g === 'ش' ? 'الشمس is said ash-shams, not al-shams.' : 'for example ال + ' + it.w + ' is said a' + it.r.replace(/[^a-zʿʾḥṣḍṭẓ]/gi, '').slice(0, 2) + '-' + it.wr + '.')
        : it.g === 'ا' ? '' : 'It is a “moon letter”: the l of the article ال stays — ' + (it.g === 'ق' ? 'القمر is said al-qamar.' : 'ال + ' + it.w + ' is said al-' + it.wr + '.');
      return 'The letter ' + it.n + ' sounds like “' + it.r + '”. ' + it.s + ' ' + forms + ' ' + art + (it.y ? ' ' + it.y : '');
    },
    sections: [{ title: 'Letters (28)', items: [
      ar('ا', 'ألف', 'ā / a', 'Alif is mostly a long “aa” vowel, or a seat for the hamza glottal stop (أ).', 'أسد', 'asad', 'lion'),
      ar('ب', 'باء', 'b', 'A plain b, made with both lips.', 'باب', 'bāb', 'door'),
      ar('ت', 'تاء', 't', 'A light t with the tongue on the back of the teeth.', 'تفاحة', 'tuffāḥa', 'apple'),
      ar('ث', 'ثاء', 'th (as in “think”)', 'The tongue sits between the teeth.', 'ثعلب', 'thaʿlab', 'fox'),
      ar('ج', 'جيم', 'j', 'Like j in “jam” (said “g” in Egypt).', 'جمل', 'jamal', 'camel'),
      ar('ح', 'حاء', 'ḥ', 'A breathy h squeezed from deep in the throat (pharynx) — like breathing on glasses to clean them, but tighter.', 'حليب', 'ḥalīb', 'milk'),
      ar('خ', 'خاء', 'kh', 'A rough sound made at the back of the mouth, like ch in Scottish “loch”.', 'خبز', 'khubz', 'bread'),
      ar('د', 'دال', 'd', 'A plain d.', 'دب', 'dubb', 'bear'),
      ar('ذ', 'ذال', 'dh (as in “this”)', 'The tongue sits between the teeth, with voice.', 'ذهب', 'dhahab', 'gold'),
      ar('ر', 'راء', 'r', 'A tapped or rolled r, like Spanish r.', 'رجل', 'rajul', 'man'),
      ar('ز', 'زاي', 'z', 'A plain z.', 'زيت', 'zayt', 'oil'),
      ar('س', 'سين', 's', 'A plain s.', 'سمك', 'samak', 'fish'),
      ar('ش', 'شين', 'sh', 'Like sh in “ship”.', 'شمس', 'shams', 'sun'),
      ar('ص', 'صاد', 'ṣ', 'An “emphatic” s: the back of the tongue is pulled toward the throat, which makes nearby vowels sound darker.', 'صقر', 'ṣaqr', 'falcon'),
      ar('ض', 'ضاد', 'ḍ', 'An emphatic d. It is considered so special that Arabic is called “the language of the ḍād”.', 'ضفدع', 'ḍifdaʿ', 'frog'),
      ar('ط', 'طاء', 'ṭ', 'An emphatic t with a heavy, dark sound.', 'طائرة', 'ṭāʾira', 'airplane'),
      ar('ظ', 'ظاء', 'ẓ', 'An emphatic “th” as in “this”.', 'ظرف', 'ẓarf', 'envelope'),
      ar('ع', 'عين', 'ʿ', 'A voiced sound made by tightening the throat — there is nothing like it in English. Try saying “ah” while squeezing your throat.', 'عين', 'ʿayn', 'eye'),
      ar('غ', 'غين', 'gh', 'Like a gargled French r, made at the back of the mouth.', 'غيمة', 'ghayma', 'cloud'),
      ar('ف', 'فاء', 'f', 'A plain f.', 'فيل', 'fīl', 'elephant'),
      ar('ق', 'قاف', 'q', 'Like k but made further back, against the uvula (the dangling bit at the back of your mouth).', 'قمر', 'qamar', 'moon'),
      ar('ك', 'كاف', 'k', 'A plain k.', 'كتاب', 'kitāb', 'book'),
      ar('ل', 'لام', 'l', 'A clear l.', 'ليمون', 'laymūn', 'lemon'),
      ar('م', 'ميم', 'm', 'A plain m.', 'ماء', 'māʾ', 'water'),
      ar('ن', 'نون', 'n', 'A plain n.', 'نجمة', 'najma', 'star'),
      ar('ه', 'هاء', 'h', 'A soft h as in “hat”, even at the end of a word.', 'هدية', 'hadiyya', 'gift'),
      ar('و', 'واو', 'w / ū', 'A consonant w, or the long vowel “oo”.', 'وردة', 'warda', 'rose'),
      ar('ي', 'ياء', 'y / ī', 'A consonant y, or the long vowel “ee”.', 'يد', 'yad', 'hand')
    ] }]
  });

  // ------------------------------------------------------------ Mandarin
  const TONES = { 1: 'first tone: high and level, like holding a note', 2: 'second tone: rising, like asking “what?”', 3: 'third tone: dipping low and then up, like a doubtful “well…”', 4: 'fourth tone: sharply falling, like a firm “No!”', 5: 'neutral tone: short and light' };
  function toneOf(p) { if (/[āēīōūǖ]/.test(p)) return 1; if (/[áéíóúǘ]/.test(p)) return 2; if (/[ǎěǐǒǔǚ]/.test(p)) return 3; if (/[àèìòùǜ]/.test(p)) return 4; return 5; }
  const zh = (g, r, m, w, wr, wm, y) => ({ g, r, m: m, w, wr, wm, y, say: g, n: r });
  S.push({
    id: 'mandarin', name: 'Mandarin Chinese', native: '汉字 · 拼音', lang: 'zh-CN', type: 'Logographic (each character is a word or meaning)', font: "'Noto Sans SC'", hanzi: true,
    region: 'Asia',
    intro: 'Chinese is not written with an alphabet: each character stands for a syllable with a meaning. There are thousands of characters, but about 1,000 cover 90% of everyday text. Pinyin is the Latin-letter system used to show the pronunciation, and every syllable has one of four tones (plus a light neutral tone) — the same syllable with a different tone is a different word.',
    writing: ['Each character fits in an imaginary square, whatever its number of strokes.', 'Stroke order rules: top before bottom, left before right, horizontal before vertical, outside before inside, and close the box last.', 'Many characters combine a meaning part (radical) with a sound part, e.g. 妈 = 女 (woman) + 马 (mǎ, sound).', 'Use the “Stroke order” button to watch each stroke, then the writing quiz checks every stroke you draw.'],
    why(it) {
      if (it.kind === 'tone') return it.y;
      if (it.kind === 'initial') return it.y;
      const t = toneOf(it.r);
      return '“' + it.r + '” is spoken in the ' + TONES[t] + '. ' + (it.y || '') + (it.w ? ' In the word ' + it.w + ' (' + it.wr + ') it means “' + it.wm + '”.' : '');
    },
    sections: [
      { title: 'The four tones', items: [
        ['妈', 'mā', 'mother', 'Tone 1 (ā): keep your voice high and flat. With tone 1, “ma” means mother.'],
        ['麻', 'má', 'hemp; numb', 'Tone 2 (á): the voice rises as in a question. “Má” is a different word from “mā”.'],
        ['马', 'mǎ', 'horse', 'Tone 3 (ǎ): the voice dips low and then comes back up. “Mǎ” means horse.'],
        ['骂', 'mà', 'to scold', 'Tone 4 (à): the voice drops sharply. “Mà” means to scold.'],
        ['吗', 'ma', 'question particle', 'Neutral tone: short and light. Adding 吗 to the end of a sentence turns it into a yes/no question.']
      ].map(([g, r, m, y]) => ({ g, r, m, y, kind: 'tone', say: g, n: r })) },
      { title: 'Pinyin initial sounds', items: [
        ['b', '爸', 'bà', 'dad', 'b is an unaspirated p (no puff of air), like the p in “spin”.'],
        ['p', '朋', 'péng', 'friend (朋友)', 'p has a strong puff of air, like p in “pot”.'],
        ['m', '猫', 'māo', 'cat', 'Like English m.'],
        ['f', '飞', 'fēi', 'to fly', 'Like English f.'],
        ['d', '大', 'dà', 'big', 'd is an unaspirated t, like the t in “stop”.'],
        ['t', '天', 'tiān', 'sky; day', 't has a strong puff of air.'],
        ['n', '你', 'nǐ', 'you', 'Like English n.'],
        ['l', '老', 'lǎo', 'old', 'Like English l.'],
        ['g', '狗', 'gǒu', 'dog', 'g is an unaspirated k, like the k in “skin”.'],
        ['k', '口', 'kǒu', 'mouth', 'k has a strong puff of air.'],
        ['h', '好', 'hǎo', 'good', 'Rougher than English h, a little like ch in “loch”.'],
        ['j', '鸡', 'jī', 'chicken', 'Like “jee” said with the tongue flat behind the lower teeth.'],
        ['q', '七', 'qī', 'seven', 'Like “chee” with a puff of air and the tongue flat — not a k sound!'],
        ['x', '小', 'xiǎo', 'small', 'Between s and sh, with a smile. Not like English x.'],
        ['zh', '中', 'zhōng', 'middle', 'Like j in “jump”, with the tongue curled back.'],
        ['ch', '吃', 'chī', 'to eat', 'Like ch in “church”, tongue curled back, with a puff of air.'],
        ['sh', '水', 'shuǐ', 'water', 'Like sh in “shirt”, tongue curled back.'],
        ['r', '人', 'rén', 'person', 'Between English r and the s in “pleasure”.'],
        ['z', '走', 'zǒu', 'to walk', 'Like ds in “beds”.'],
        ['c', '菜', 'cài', 'vegetable; dish', 'Like ts in “cats”, with a puff of air — not k or s!'],
        ['s', '三', 'sān', 'three', 'Like English s.'],
        ['y', '鱼', 'yú', 'fish', 'Like English y (here yú is pronounced like German ü).'],
        ['w', '我', 'wǒ', 'I, me', 'Like English w.']
      ].map(([g, c, r, m, y]) => ({ g, n: g, r: g, w: c, wr: r, wm: m, m: 'as in ' + c + ' ' + r + ' (' + m + ')', y: y + ' Example: ' + c + ' ' + r + ' = ' + m + '.', kind: 'initial', say: c, font: 'latin' })) },
      { title: 'First characters', items: [
        zh('一', 'yī', 'one', '一月', 'yīyuè', 'January', 'A single horizontal stroke — the simplest character.'),
        zh('二', 'èr', 'two', '二十', 'èrshí', 'twenty', 'Two strokes for two.'),
        zh('三', 'sān', 'three', '三天', 'sān tiān', 'three days', 'Three strokes for three.'),
        zh('四', 'sì', 'four', '四个', 'sì gè', 'four (of something)'),
        zh('五', 'wǔ', 'five', '五月', 'wǔyuè', 'May'),
        zh('六', 'liù', 'six', '六点', 'liù diǎn', 'six o’clock'),
        zh('七', 'qī', 'seven', '七天', 'qī tiān', 'seven days'),
        zh('八', 'bā', 'eight', '八月', 'bāyuè', 'August', '8 is considered lucky because bā sounds like fā (to prosper).'),
        zh('九', 'jiǔ', 'nine', '九十', 'jiǔshí', 'ninety'),
        zh('十', 'shí', 'ten', '十月', 'shíyuè', 'October'),
        zh('人', 'rén', 'person', '中国人', 'Zhōngguó rén', 'Chinese person', 'A picture of a person walking: two legs.'),
        zh('大', 'dà', 'big', '大学', 'dàxué', 'university', 'A person 人 stretching the arms wide: “this big”.'),
        zh('小', 'xiǎo', 'small', '小心', 'xiǎoxīn', 'be careful'),
        zh('口', 'kǒu', 'mouth', '人口', 'rénkǒu', 'population', 'A picture of an open mouth.'),
        zh('日', 'rì', 'sun; day', '日本', 'Rìběn', 'Japan', 'Originally a circle with a dot: the sun.'),
        zh('月', 'yuè', 'moon; month', '月亮', 'yuèliang', 'the moon', 'Originally a crescent moon.'),
        zh('山', 'shān', 'mountain', '火山', 'huǒshān', 'volcano', 'Three peaks.'),
        zh('水', 'shuǐ', 'water', '喝水', 'hē shuǐ', 'drink water', 'A stream with drops splashing to the sides.'),
        zh('火', 'huǒ', 'fire', '火车', 'huǒchē', 'train (“fire vehicle”)', 'Flames rising, with sparks.'),
        zh('木', 'mù', 'tree; wood', '木头', 'mùtou', 'wood', 'A tree with branches above and roots below.'),
        zh('中', 'zhōng', 'middle', '中国', 'Zhōngguó', 'China (“Middle Kingdom”)', 'A line through the middle of a box.'),
        zh('天', 'tiān', 'sky; day', '今天', 'jīntiān', 'today', 'A big person 大 with a line above the head: the sky.'),
        zh('女', 'nǚ', 'woman', '女儿', 'nǚ’ér', 'daughter'),
        zh('子', 'zǐ', 'child', '孩子', 'háizi', 'child', 'A baby with arms out. In 孩子 it takes the light neutral tone.'),
        zh('好', 'hǎo', 'good', '你好', 'nǐ hǎo', 'hello', '女 (woman) + 子 (child) — a mother with her child was the picture of “good”. In 你好 both words are tone 3, so the first is said with a rising tone.'),
        zh('心', 'xīn', 'heart', '开心', 'kāixīn', 'happy', 'A picture of the heart.'),
        zh('手', 'shǒu', 'hand', '手机', 'shǒujī', 'mobile phone (“hand machine”)'),
        zh('目', 'mù', 'eye', '目标', 'mùbiāo', 'goal', 'An eye turned on its side.'),
        zh('上', 'shàng', 'up; above', '上午', 'shàngwǔ', 'morning', 'A mark above a line.'),
        zh('下', 'xià', 'down; below', '下雨', 'xià yǔ', 'to rain', 'A mark below a line.'),
        zh('你', 'nǐ', 'you', '你们', 'nǐmen', 'you (plural)', '亻(person) + 尔 (an old word for “you”).'),
        zh('我', 'wǒ', 'I, me', '我们', 'wǒmen', 'we'),
        zh('他', 'tā', 'he', '他们', 'tāmen', 'they', '亻(person) on the left tells you it is about a person.'),
        zh('爱', 'ài', 'love', '爱好', 'àihào', 'hobby', 'The traditional form 愛 has 心 (heart) in the middle.'),
        zh('家', 'jiā', 'home; family', '大家', 'dàjiā', 'everyone', 'A roof 宀 over a pig 豕 — a pig under the roof was the sign of a household.'),
        zh('学', 'xué', 'to study', '学生', 'xuésheng', 'student'),
        zh('门', 'mén', 'door', '门口', 'ménkǒu', 'entrance', 'Simplified from 門, a picture of two swinging doors.'),
        zh('马', 'mǎ', 'horse', '马上', 'mǎshàng', 'immediately (“on horseback”)'),
        zh('鱼', 'yú', 'fish', '金鱼', 'jīnyú', 'goldfish', 'Head, body with scales, and tail.'),
        zh('雨', 'yǔ', 'rain', '下雨', 'xià yǔ', 'to rain', 'Drops falling from a cloud under the sky.')
      ] }
    ]
  });

  // ------------------------------------------------------------ Japanese
  const kana = (rows, kanaOrigin) => rows.map(([g, r, w, wr, m, o, y]) => ({ g, r, w, wr, m, o, y, say: g, n: r }));
  const KANA_SOUND = { shi: 'Written shi, not si: before i, s softens to sh.', chi: 'Written chi, not ti: before i, t becomes ch.', tsu: 'Written tsu, not tu: before u, t becomes ts — like the end of “cats”.', fu: 'Between h and f: blow gently through rounded lips without touching the teeth.', n: 'The only consonant that can stand alone. It takes a full beat of its own and changes to m or ng depending on the next sound.', wo: 'Pronounced just “o”. It is only used as the grammar particle that marks the object of a verb.', ra: 'Japanese r is a quick tap of the tongue, between English r, l and d.', ri: 'Japanese r is a quick tap of the tongue, between English r, l and d.', ru: 'Japanese r is a quick tap of the tongue, between English r, l and d.', re: 'Japanese r is a quick tap of the tongue, between English r, l and d.', ro: 'Japanese r is a quick tap of the tongue, between English r, l and d.', u: 'Said with unrounded lips, and often almost silent between voiceless sounds (desu sounds like “dess”).', ha: 'As the topic particle は it is pronounced “wa”.', he: 'As the direction particle へ it is pronounced “e”.' };
  const kanaWhy = kind => it => 'This ' + kind + ' is read “' + it.r + '”. ' + (it.o ? 'It developed from ' + (kind === 'hiragana' ? 'a flowing, cursive way of writing' : 'a part of') + ' the kanji ' + it.o + ', which was used for its sound. ' : '') + (KANA_SOUND[it.r] || 'Every kana is one beat (mora) long, so Japanese has a very even rhythm.') + (it.y ? ' ' + it.y : '');
  S.push({
    id: 'hiragana', name: 'Japanese Hiragana', native: 'ひらがな', lang: 'ja-JP', type: 'Syllabary (each symbol is a syllable)', font: "'Noto Sans JP'",
    region: 'Asia',
    intro: 'Hiragana is one of three Japanese scripts. Its 46 basic symbols each stand for a syllable (a, ka, shi…). It is used for grammar endings, small words and anything children have not learned the kanji for yet. Two small marks turn sounds voiced (か ka → が ga) or into p (は ha → ぱ pa).',
    writing: ['Hiragana is rounded and flowing — it grew from quickly brushed kanji.', 'Write strokes top to bottom and left to right, and keep each symbol inside an imaginary square.', 'Pay attention to how strokes end: some stop, some flick, and some fade out.', 'Japanese can be written horizontally, or vertically from top to bottom with columns going right to left.'],
    why: kanaWhy('hiragana'),
    sections: [{ title: 'Basic hiragana (46)', items: kana([
      ['あ', 'a', 'あめ', 'ame', 'rain', '安'], ['い', 'i', 'いぬ', 'inu', 'dog', '以'], ['う', 'u', 'うみ', 'umi', 'sea', '宇'], ['え', 'e', 'えき', 'eki', 'station', '衣'], ['お', 'o', 'おかし', 'okashi', 'sweets', '於'],
      ['か', 'ka', 'かさ', 'kasa', 'umbrella', '加'], ['き', 'ki', 'き', 'ki', 'tree', '幾'], ['く', 'ku', 'くるま', 'kuruma', 'car', '久'], ['け', 'ke', 'けいと', 'keito', 'knitting wool', '計'], ['こ', 'ko', 'こども', 'kodomo', 'child', '己'],
      ['さ', 'sa', 'さかな', 'sakana', 'fish', '左'], ['し', 'shi', 'しお', 'shio', 'salt', '之'], ['す', 'su', 'すし', 'sushi', 'sushi', '寸'], ['せ', 'se', 'せんせい', 'sensei', 'teacher', '世'], ['そ', 'so', 'そら', 'sora', 'sky', '曽'],
      ['た', 'ta', 'たまご', 'tamago', 'egg', '太'], ['ち', 'chi', 'ちず', 'chizu', 'map', '知'], ['つ', 'tsu', 'つき', 'tsuki', 'moon', '川'], ['て', 'te', 'て', 'te', 'hand', '天'], ['と', 'to', 'とり', 'tori', 'bird', '止'],
      ['な', 'na', 'なつ', 'natsu', 'summer', '奈'], ['に', 'ni', 'にく', 'niku', 'meat', '仁'], ['ぬ', 'nu', 'ぬいぐるみ', 'nuigurumi', 'soft toy', '奴'], ['ね', 'ne', 'ねこ', 'neko', 'cat', '祢'], ['の', 'no', 'のり', 'nori', 'seaweed', '乃'],
      ['は', 'ha', 'はな', 'hana', 'flower', '波'], ['ひ', 'hi', 'ひと', 'hito', 'person', '比'], ['ふ', 'fu', 'ふね', 'fune', 'boat', '不'], ['へ', 'he', 'へや', 'heya', 'room', '部'], ['ほ', 'ho', 'ほし', 'hoshi', 'star', '保'],
      ['ま', 'ma', 'まど', 'mado', 'window', '末'], ['み', 'mi', 'みみ', 'mimi', 'ear', '美'], ['む', 'mu', 'むし', 'mushi', 'insect', '武'], ['め', 'me', 'め', 'me', 'eye', '女'], ['も', 'mo', 'もり', 'mori', 'forest', '毛'],
      ['や', 'ya', 'やま', 'yama', 'mountain', '也'], ['ゆ', 'yu', 'ゆき', 'yuki', 'snow', '由'], ['よ', 'yo', 'よる', 'yoru', 'night', '与'],
      ['ら', 'ra', 'らいおん', 'raion', 'lion', '良'], ['り', 'ri', 'りんご', 'ringo', 'apple', '利'], ['る', 'ru', 'るす', 'rusu', 'not at home', '留'], ['れ', 're', 'れきし', 'rekishi', 'history', '礼'], ['ろ', 'ro', 'ろうそく', 'rōsoku', 'candle', '呂'],
      ['わ', 'wa', 'わたし', 'watashi', 'I, me', '和'], ['を', 'wo', 'ほんをよむ', 'hon o yomu', 'to read a book', '遠'], ['ん', 'n', 'ほん', 'hon', 'book', '无']
    ]) }]
  });
  S.push({
    id: 'katakana', name: 'Japanese Katakana', native: 'カタカナ', lang: 'ja-JP', type: 'Syllabary (each symbol is a syllable)', font: "'Noto Sans JP'",
    region: 'Asia',
    intro: 'Katakana has the same sounds as hiragana but sharper, straighter shapes. It is used for words borrowed from other languages (コーヒー kōhī, coffee), foreign names, sound effects and emphasis — much like italics in English. A long dash ー makes a vowel long.',
    writing: ['Katakana strokes are mostly straight and angular.', 'Watch out for look-alikes: シ shi / ツ tsu and ソ so / ン n differ only in the angle of the strokes — shi and n are written more flatly, upward from bottom-left, while tsu and so fall from the top.', 'The long-vowel bar ー follows the writing direction: horizontal in horizontal text, vertical in vertical text.'],
    why: kanaWhy('katakana'),
    sections: [{ title: 'Basic katakana (46)', items: kana([
      ['ア', 'a', 'アイス', 'aisu', 'ice cream', '阿'], ['イ', 'i', 'イギリス', 'igirisu', 'Britain', '伊'], ['ウ', 'u', 'ウイルス', 'uirusu', 'virus', '宇'], ['エ', 'e', 'エレベーター', 'erebētā', 'elevator', '江'], ['オ', 'o', 'オレンジ', 'orenji', 'orange', '於'],
      ['カ', 'ka', 'カメラ', 'kamera', 'camera', '加'], ['キ', 'ki', 'キウイ', 'kiui', 'kiwi fruit', '幾'], ['ク', 'ku', 'クッキー', 'kukkī', 'cookie', '久'], ['ケ', 'ke', 'ケーキ', 'kēki', 'cake', '介'], ['コ', 'ko', 'コーヒー', 'kōhī', 'coffee', '己'],
      ['サ', 'sa', 'サラダ', 'sarada', 'salad', '散'], ['シ', 'shi', 'シャツ', 'shatsu', 'shirt', '之'], ['ス', 'su', 'スープ', 'sūpu', 'soup', '須'], ['セ', 'se', 'セーター', 'sētā', 'sweater', '世'], ['ソ', 'so', 'ソファ', 'sofa', 'sofa', '曽'],
      ['タ', 'ta', 'タクシー', 'takushī', 'taxi', '多'], ['チ', 'chi', 'チーズ', 'chīzu', 'cheese', '千'], ['ツ', 'tsu', 'ツアー', 'tsuā', 'tour', '川'], ['テ', 'te', 'テレビ', 'terebi', 'television', '天'], ['ト', 'to', 'トマト', 'tomato', 'tomato', '止'],
      ['ナ', 'na', 'ナイフ', 'naifu', 'knife', '奈'], ['ニ', 'ni', 'ニュース', 'nyūsu', 'news', '二'], ['ヌ', 'nu', 'ヌードル', 'nūdoru', 'noodles', '奴'], ['ネ', 'ne', 'ネクタイ', 'nekutai', 'necktie', '祢'], ['ノ', 'no', 'ノート', 'nōto', 'notebook', '乃'],
      ['ハ', 'ha', 'ハンバーガー', 'hanbāgā', 'hamburger', '八'], ['ヒ', 'hi', 'ヒーロー', 'hīrō', 'hero', '比'], ['フ', 'fu', 'フォーク', 'fōku', 'fork', '不'], ['ヘ', 'he', 'ヘリコプター', 'herikoputā', 'helicopter', '部'], ['ホ', 'ho', 'ホテル', 'hoteru', 'hotel', '保'],
      ['マ', 'ma', 'マスク', 'masuku', 'face mask', '末'], ['ミ', 'mi', 'ミルク', 'miruku', 'milk', '三'], ['ム', 'mu', 'ムード', 'mūdo', 'mood', '牟'], ['メ', 'me', 'メール', 'mēru', 'e-mail', '女'], ['モ', 'mo', 'モデル', 'moderu', 'model', '毛'],
      ['ヤ', 'ya', 'タイヤ', 'taiya', 'tyre', '也'], ['ユ', 'yu', 'ユニフォーム', 'yunifōmu', 'uniform', '由'], ['ヨ', 'yo', 'ヨーグルト', 'yōguruto', 'yoghurt', '与'],
      ['ラ', 'ra', 'ラジオ', 'rajio', 'radio', '良'], ['リ', 'ri', 'リボン', 'ribon', 'ribbon', '利'], ['ル', 'ru', 'ルール', 'rūru', 'rule', '流'], ['レ', 're', 'レモン', 'remon', 'lemon', '礼'], ['ロ', 'ro', 'ロボット', 'robotto', 'robot', '呂'],
      ['ワ', 'wa', 'ワイン', 'wain', 'wine', '和'], ['ヲ', 'wo', '(particle)', 'o', 'object particle — rarely used', '乎', 'Modern text almost always writes this particle in hiragana を.'], ['ン', 'n', 'パン', 'pan', 'bread', '']
    ]) }]
  });

  // ------------------------------------------------------------ Korean
  const ko = (g, n, r, w, wr, m, y, say) => ({ g, n, r, w, wr, m, y, say: say || n });
  S.push({
    id: 'hangul', name: 'Korean Hangul', native: '한글', lang: 'ko-KR', type: 'Featural alphabet (letters show how the mouth makes the sound)', font: "'Noto Sans KR'",
    region: 'Asia',
    intro: 'Hangul was designed in 1443 by King Sejong’s scholars so that everyone could learn to read. Its consonant shapes are pictures of the mouth making the sound, and its vowels are built from three symbols: a dot for heaven, a flat line for earth and a standing line for a person. Letters are grouped into square syllable blocks: 한 = ㅎ + ㅏ + ㄴ.',
    writing: ['Build a syllable block: first consonant, then vowel (to its right or below), then an optional final consonant at the bottom.', 'Write each letter top to bottom and left to right.', 'A syllable that starts with a vowel uses the silent ㅇ as a placeholder: 아, 이, 우.', 'Every block takes up the same square space, whether it has two letters or four.'],
    why(it) { return it.g + ' is read “' + it.r + '”. ' + it.y; },
    sections: [
      { title: 'Basic consonants (14)', items: [
        ko('ㄱ', '기역', 'g/k', '가방', 'gabang', 'bag', 'Its shape is the back of the tongue rising to touch the soft palate — exactly where you make a g or k.'),
        ko('ㄴ', '니은', 'n', '나무', 'namu', 'tree', 'Its shape is the tongue tip touching the ridge behind the upper teeth, where n is made.'),
        ko('ㄷ', '디귿', 'd/t', '다리', 'dari', 'leg; bridge', 'ㄴ with an extra stroke on top: same tongue position, but the air is stopped — so n becomes d.'),
        ko('ㄹ', '리을', 'r/l', '라면', 'ramyeon', 'instant noodles', 'A flap r between vowels and an l at the end of a syllable; the zigzag shape suggests the rolling tongue.'),
        ko('ㅁ', '미음', 'm', '물', 'mul', 'water', 'A square: the shape of closed lips, where m is made.'),
        ko('ㅂ', '비읍', 'b/p', '바다', 'bada', 'sea', 'ㅁ with strokes added: the lips close and then burst open, turning m into b.'),
        ko('ㅅ', '시옷', 's', '사과', 'sagwa', 'apple', 'The shape of a tooth — s is made by air hissing past the teeth.'),
        ko('ㅇ', '이응', 'silent / ng', '우유', 'uyu', 'milk', 'A circle for the open throat. Silent at the start of a syllable, “ng” at the end (방 bang).'),
        ko('ㅈ', '지읒', 'j', '자동차', 'jadongcha', 'car', 'ㅅ with a stroke on top: the teeth sound s gains a stop, becoming j.'),
        ko('ㅊ', '치읓', 'ch', '친구', 'chingu', 'friend', 'ㅈ with one more stroke: the extra stroke means an extra puff of air (aspiration).'),
        ko('ㅋ', '키읔', 'k', '코', 'ko', 'nose', 'ㄱ plus a stroke = ㄱ with a strong puff of air.'),
        ko('ㅌ', '티읕', 't', '토끼', 'tokki', 'rabbit', 'ㄷ plus a stroke = ㄷ with a strong puff of air.'),
        ko('ㅍ', '피읖', 'p', '포도', 'podo', 'grapes', 'An aspirated ㅂ: the lips burst with a strong puff of air.'),
        ko('ㅎ', '히읗', 'h', '하늘', 'haneul', 'sky', 'ㅇ (throat) with strokes on top: breath passing through the throat.')
      ] },
      { title: 'Double (tense) consonants', items: [
        ko('ㄲ', '쌍기역', 'kk', '꽃', 'kkot', 'flower', 'A doubled ㄱ. Doubling means a tense sound: tighten your throat and say k with no puff of air.'),
        ko('ㄸ', '쌍디귿', 'tt', '딸기', 'ttalgi', 'strawberry', 'A doubled ㄷ, said tensely with no puff of air.'),
        ko('ㅃ', '쌍비읍', 'pp', '빵', 'ppang', 'bread', 'A doubled ㅂ, said tensely with no puff of air.'),
        ko('ㅆ', '쌍시옷', 'ss', '쌀', 'ssal', 'uncooked rice', 'A doubled ㅅ: a sharper, tenser s.'),
        ko('ㅉ', '쌍지읒', 'jj', '짜다', 'jjada', 'salty', 'A doubled ㅈ, said tensely.')
      ] },
      { title: 'Vowels', items: [
        ['ㅏ', 'a', '아이', 'ai', 'child', 'A person line ㅣ with the heaven dot on the east (sunny) side: a bright “a” as in “father”.'],
        ['ㅑ', 'ya', '야구', 'yagu', 'baseball', 'Two dots instead of one add a y sound in front: a → ya.'],
        ['ㅓ', 'eo', '어머니', 'eomeoni', 'mother', 'The dot on the west side: a dark “uh” as in “sun”, with the jaw open.'],
        ['ㅕ', 'yeo', '여자', 'yeoja', 'woman', 'Doubled stroke = y + eo.'],
        ['ㅗ', 'o', '오이', 'oi', 'cucumber', 'The earth line with the dot above (towards heaven): a rounded “o”.'],
        ['ㅛ', 'yo', '요리', 'yori', 'cooking', 'Doubled stroke = y + o.'],
        ['ㅜ', 'u', '우산', 'usan', 'umbrella', 'The dot below the earth line: “oo” as in “moon”.'],
        ['ㅠ', 'yu', '유리', 'yuri', 'glass', 'Doubled stroke = y + u.'],
        ['ㅡ', 'eu', '그림', 'geurim', 'picture', 'The flat earth line alone: say “oo” with your lips spread flat.'],
        ['ㅣ', 'i', '이', 'i', 'tooth; two', 'The standing person alone: “ee” as in “see”.'],
        ['ㅐ', 'ae', '개', 'gae', 'dog', 'ㅏ + ㅣ combined: like “e” in “bed” (in modern speech almost the same as ㅔ).'],
        ['ㅔ', 'e', '게', 'ge', 'crab', 'ㅓ + ㅣ combined: like “e” in “bed”.']
      ].map(([g, r, w, wr, m, y]) => ({ g, r, w, wr, m, y, n: r, say: String.fromCharCode(0xAC00 + 11 * 588 + ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'].indexOf(g) * 28) })) }
    ]
  });

  // ------------------------------------------------------------ Greek
  const gr = (g, n, r, w, wr, m, y) => ({ g, n, r, w, wr, m, y, say: n });
  S.push({
    id: 'greek', name: 'Greek', native: 'Ελληνικό αλφάβητο', lang: 'el-GR', type: 'Alphabet (letters for both consonants and vowels)', font: "'Noto Sans'",
    region: 'Europe',
    intro: 'Greek adapted the Phoenician letters around 800 BCE and was the first alphabet to write vowels as full letters. It has 24 letters, each with a capital and a small form, and it is the ancestor of both the Latin and Cyrillic alphabets. Modern Greek pronunciation differs from Ancient Greek: several letters and letter pairs now all sound like “ee”.',
    writing: ['Write left to right.', 'Small letters are rounder than capitals; several dip below the line (β γ ζ η μ ξ ρ φ χ ψ).', 'σ becomes ς at the end of a word.', 'Modern Greek puts an accent mark (΄) on the stressed vowel of words with more than one syllable.'],
    why(it) { return 'The letter ' + it.n + ' sounds like “' + it.r + '” in modern Greek. ' + (it.y || ''); },
    sections: [{ title: 'Letters (24)', items: [
      gr('Α α', 'άλφα', 'a', 'αγάπη', 'agápi', 'love', 'From Phoenician ʾalp (“ox”). It gave us Latin A and Cyrillic А.'),
      gr('Β β', 'βήτα', 'v', 'βιβλίο', 'vivlío', 'book', 'In Ancient Greek it was b, but it softened to v over the centuries. Modern Greek writes b as μπ.'),
      gr('Γ γ', 'γάμμα', 'gh / y', 'γάτα', 'gáta', 'cat', 'A soft, breathy g (like a gargled g) before a, o, u, and like y before e and i.'),
      gr('Δ δ', 'δέλτα', 'th (as in “this”)', 'δέντρο', 'déntro', 'tree', 'Ancient d softened to the voiced th of “this”. The capital Δ is the triangle that gave the river delta its name.'),
      gr('Ε ε', 'έψιλον', 'e', 'ελιά', 'eliá', 'olive', 'Its name means “plain e”, to tell it apart from the letter pair αι, which is pronounced the same.'),
      gr('Ζ ζ', 'ζήτα', 'z', 'ζωή', 'zoí', 'life'),
      gr('Η η', 'ήτα', 'i (ee)', 'ήλιος', 'ílios', 'sun', 'Ancient long e, now pronounced “ee” — one of several ways to spell that sound.'),
      gr('Θ θ', 'θήτα', 'th (as in “think”)', 'θάλασσα', 'thálassa', 'sea', 'Tongue between the teeth, no voice.'),
      gr('Ι ι', 'γιώτα', 'i (ee)', 'ιστορία', 'istoría', 'history', 'The smallest letter — the origin of the phrase “not one iota”.'),
      gr('Κ κ', 'κάππα', 'k', 'καφές', 'kafés', 'coffee'),
      gr('Λ λ', 'λάμδα', 'l', 'λεμόνι', 'lemóni', 'lemon'),
      gr('Μ μ', 'μι', 'm', 'μήλο', 'mílo', 'apple', 'From Phoenician mem (“water”) — the wavy shape was water.'),
      gr('Ν ν', 'νι', 'n', 'νερό', 'neró', 'water', 'Small ν looks like a Latin v but is an n.'),
      gr('Ξ ξ', 'ξι', 'ks', 'ξύλο', 'xýlo', 'wood', 'One letter for two sounds, ks — like x in “taxi”. It gives us xylophone (“wood sound”).'),
      gr('Ο ο', 'όμικρον', 'o', 'όνομα', 'ónoma', 'name', 'Its name means “small o”, as opposed to omega, “big o”.'),
      gr('Π π', 'πι', 'p', 'πατέρας', 'patéras', 'father', 'The letter used for the number π in maths.'),
      gr('Ρ ρ', 'ρο', 'r', 'ρόδι', 'ródi', 'pomegranate', 'Looks like a Latin P but is a tapped r. Latin changed the shape to R to avoid the confusion.'),
      gr('Σ σ ς', 'σίγμα', 's', 'σπίτι', 'spíti', 'house', 'Written σ inside a word and ς at the end: σπίτι but άνθρωπος.'),
      gr('Τ τ', 'ταυ', 't', 'τραπέζι', 'trapézi', 'table'),
      gr('Υ υ', 'ύψιλον', 'i (ee)', 'ύπνος', 'ýpnos', 'sleep', 'Once a French-style ü, now “ee”. It became Latin Y, which is why English words from Greek use y (hypnosis).'),
      gr('Φ φ', 'φι', 'f', 'φως', 'fos', 'light', 'Written ph in English words from Greek: photo = φως + γράφω (light + write).'),
      gr('Χ χ', 'χι', 'kh / ch', 'χέρι', 'chéri', 'hand', 'Like ch in Scottish “loch” (softer, like German “ich”, before e and i). Not an x!'),
      gr('Ψ ψ', 'ψι', 'ps', 'ψάρι', 'psári', 'fish', 'One letter for ps — the p is always pronounced.'),
      gr('Ω ω', 'ωμέγα', 'o', 'ώρα', 'óra', 'hour', 'Its name means “big o”. Once longer than omicron, now the same sound. It is the last letter — “the alpha and the omega”.')
    ] }]
  });

  // ------------------------------------------------------------ Russian Cyrillic
  const ru = (g, n, r, w, wr, m, y) => ({ g, n, r, w, wr, m, y, say: n });
  S.push({
    id: 'cyrillic', name: 'Russian Cyrillic', native: 'Русский алфавит', lang: 'ru-RU', type: 'Alphabet', font: "'Noto Sans'",
    region: 'Europe & Asia',
    intro: 'Cyrillic was created in the 9th–10th century in the First Bulgarian Empire, based mostly on Greek capital letters, with new letters for Slavic sounds. The Russian version has 33 letters and is also used, with changes, for Ukrainian, Bulgarian, Serbian, Kazakh, Mongolian and many more. Watch out for “false friends” — letters that look Latin but sound different: В = v, Н = n, Р = r, С = s, У = u, Х = kh.',
    writing: ['Write left to right.', 'Handwritten (cursive) Russian looks quite different from print: т is written like a Latin m, and д and г change shape.', 'Most letters join in handwriting; л, м and я start with a small hook.'],
    why(it) { return 'The letter ' + it.g.split(' ')[0] + ' (“' + it.n + '”) sounds like “' + it.r + '”. ' + (it.y || ''); },
    sections: [{ title: 'Letters (33)', items: [
      ru('А а', 'а', 'a', 'арбуз', 'arbuz', 'watermelon', 'From Greek alpha. Unstressed o also sounds like this a.'),
      ru('Б б', 'бэ', 'b', 'банан', 'banan', 'banana', 'A new letter created to keep b separate from В, which had become v.'),
      ru('В в', 'вэ', 'v', 'вода', 'voda', 'water', 'From Greek beta, which was already pronounced v in medieval Greek.'),
      ru('Г г', 'гэ', 'g', 'гора', 'gora', 'mountain', 'From Greek gamma.'),
      ru('Д д', 'дэ', 'd', 'дом', 'dom', 'house', 'From Greek delta.'),
      ru('Е е', 'е', 'ye', 'ель', 'yel’', 'fir tree', 'It adds a y before the e and softens the consonant in front of it.'),
      ru('Ё ё', 'ё', 'yo', 'ёж', 'yozh', 'hedgehog', 'Always stressed. The two dots are often left out in everyday printing.'),
      ru('Ж ж', 'жэ', 'zh', 'жираф', 'zhiraf', 'giraffe', 'Like the s in “pleasure”. A Slavic sound Greek had no letter for.'),
      ru('З з', 'зэ', 'z', 'зебра', 'zebra', 'zebra', 'Looks like the number 3.'),
      ru('И и', 'и', 'i (ee)', 'игла', 'igla', 'needle', 'From Greek eta, which was pronounced “ee”. It looks like a backwards N.'),
      ru('Й й', 'и краткое', 'y', 'йогурт', 'yogurt', 'yoghurt', '“Short i”: an и with a small arc, used for the y in “boy”.'),
      ru('К к', 'ка', 'k', 'кот', 'kot', 'cat'),
      ru('Л л', 'эль', 'l', 'лампа', 'lampa', 'lamp', 'From Greek lambda. Before a, o, u it is a dark l, as in “full”.'),
      ru('М м', 'эм', 'm', 'мама', 'mama', 'mum'),
      ru('Н н', 'эн', 'n', 'нос', 'nos', 'nose', 'Looks like H but is n — it comes from Greek nu.'),
      ru('О о', 'о', 'o', 'окно', 'okno', 'window', 'Said “o” only when stressed; otherwise it weakens to “a” (молоко sounds like malakó).'),
      ru('П п', 'пэ', 'p', 'письмо', 'pis’mo', 'letter', 'From Greek pi.'),
      ru('Р р', 'эр', 'r (rolled)', 'рыба', 'ryba', 'fish', 'Looks like P but is a rolled r — from Greek rho.'),
      ru('С с', 'эс', 's', 'солнце', 'solntse', 'sun', 'From a rounded Greek sigma. In солнце the л is silent.'),
      ru('Т т', 'тэ', 't', 'торт', 'tort', 'cake'),
      ru('У у', 'у', 'u (oo)', 'утка', 'utka', 'duck', 'Looks like y but sounds like “oo”.'),
      ru('Ф ф', 'эф', 'f', 'флаг', 'flag', 'flag', 'From Greek phi.'),
      ru('Х х', 'ха', 'kh', 'хлеб', 'khleb', 'bread', 'Looks like X but is a rough h, like ch in “loch” — from Greek chi.'),
      ru('Ц ц', 'цэ', 'ts', 'цветок', 'tsvetok', 'flower', 'Like ts in “cats”.'),
      ru('Ч ч', 'че', 'ch', 'чай', 'chay', 'tea', 'Always soft, like ch in “cheese”.'),
      ru('Ш ш', 'ша', 'sh', 'шапка', 'shapka', 'hat', 'A hard sh with the tongue pulled back. Its shape is thought to come from the Hebrew letter ש (shin) via Glagolitic.'),
      ru('Щ щ', 'ща', 'shch', 'щука', 'shchuka', 'pike (fish)', 'A long, soft sh, like “fresh sheep” said quickly.'),
      ru('Ъ ъ', 'твёрдый знак', '(hard sign)', 'подъезд', 'pod’’yezd', 'building entrance', 'No sound of its own: it separates a consonant from the y sound of the next vowel.'),
      ru('Ы ы', 'ы', 'y (ɨ)', 'сыр', 'syr', 'cheese', 'Between “i” and “oo”: say “ee” while pulling your tongue back. English has no such sound.'),
      ru('Ь ь', 'мягкий знак', '(soft sign)', 'соль', 'sol’', 'salt', 'No sound of its own: it makes the consonant before it “soft”, with the tongue raised as if about to say y.'),
      ru('Э э', 'э', 'e', 'эхо', 'ekho', 'echo', 'A plain “e” without the y that Е has.'),
      ru('Ю ю', 'ю', 'yu', 'юбка', 'yubka', 'skirt', 'A y + u in one letter.'),
      ru('Я я', 'я', 'ya', 'яблоко', 'yabloko', 'apple', 'A y + a in one letter. On its own, я is the word “I”.')
    ] }]
  });

  // ------------------------------------------------------------ Hebrew
  const he = (g, n, r, w, wr, m, meaning, y) => ({ g, n, r, w, wr, m, nm: meaning, y, say: n });
  S.push({
    id: 'hebrew', name: 'Hebrew', native: 'אָלֶף־בֵּית עִבְרִי', lang: 'he-IL', dir: 'rtl', type: 'Abjad (consonants; vowels are optional dots and dashes)', font: "'Noto Sans Hebrew'",
    region: 'Middle East',
    intro: 'Hebrew has 22 letters, all consonants, written right to left. Vowels can be shown with small dots and dashes (niqqud), but everyday Hebrew leaves them out and readers fill them in. Five letters have a special form at the end of a word. Letter names are old words — alef, bet, gimel — and the Greek alpha, beta, gamma come from the same Phoenician source.',
    writing: ['Write right to left.', 'Printed letters are square; everyday handwriting uses a rounder cursive script.', 'Five letters (כ מ נ פ צ) change to a final form at the end of a word: ך ם ן ף ץ.', 'A dot inside ב כ פ (dagesh) changes the sound: בּ b / ב v, כּ k / כ kh, פּ p / פ f.'],
    why(it) { return it.g + ' (' + it.n + ') sounds like “' + it.r + '”.' + (it.nm ? ' Its name is traditionally linked to the word for “' + it.nm + '”.' : '') + ' ' + (it.y || ''); },
    sections: [
      { title: 'Letters (22)', items: [
        he('א', 'אלף', 'silent / glottal stop', 'אבא', 'aba', 'dad', 'ox', 'A silent letter that holds a vowel, like Arabic alif.'),
        he('ב', 'בית', 'b / v', 'בית', 'bayit', 'house', 'house', 'With a dot (בּ) it is b; without it, v.'),
        he('ג', 'גימל', 'g', 'גמל', 'gamal', 'camel', 'camel'),
        he('ד', 'דלת', 'd', 'דג', 'dag', 'fish', 'door'),
        he('ה', 'הא', 'h', 'הר', 'har', 'mountain', '', 'Often silent at the end of a word, where it marks an a or e vowel.'),
        he('ו', 'וו', 'v / o / u', 'ורד', 'vered', 'rose', 'hook', 'A consonant v, or a vowel o (וֹ) or u (וּ).'),
        he('ז', 'זין', 'z', 'זהב', 'zahav', 'gold', 'weapon'),
        he('ח', 'חית', 'ḥ (kh)', 'חלב', 'ḥalav', 'milk', 'fence', 'A rough sound from the back of the throat, like ch in “loch”.'),
        he('ט', 'טית', 't', 'טלפון', 'telefon', 'telephone', ''),
        he('י', 'יוד', 'y / i', 'ילד', 'yeled', 'boy, child', 'hand', 'The smallest letter. It also marks the vowel i.'),
        he('כ', 'כף', 'k / kh', 'כלב', 'kelev', 'dog', 'palm of the hand', 'With a dot (כּ) k; without it, kh as in “loch”.'),
        he('ל', 'למד', 'l', 'לחם', 'leḥem', 'bread', 'ox-goad', 'The only letter that rises above the line.'),
        he('מ', 'מם', 'm', 'מים', 'mayim', 'water', 'water'),
        he('נ', 'נון', 'n', 'נר', 'ner', 'candle', 'fish'),
        he('ס', 'סמך', 's', 'ספר', 'sefer', 'book', 'support'),
        he('ע', 'עין', 'silent / glottal', 'עץ', 'ets', 'tree', 'eye', 'In old Hebrew a throat sound like Arabic ع; in modern Israeli Hebrew it is mostly silent.'),
        he('פ', 'פא', 'p / f', 'פרח', 'peraḥ', 'flower', 'mouth', 'With a dot (פּ) p; without it, f.'),
        he('צ', 'צדי', 'ts', 'ציפור', 'tsipor', 'bird', '', 'Like ts in “cats”.'),
        he('ק', 'קוף', 'k', 'קוף', 'kof', 'monkey', '', 'Once a deeper k (like Arabic ق), now the same as כּ.'),
        he('ר', 'ריש', 'r', 'רגל', 'regel', 'leg', 'head', 'In modern Hebrew a gargled r at the back of the throat, like French r.'),
        he('ש', 'שין', 'sh / s', 'שמש', 'shemesh', 'sun', 'tooth', 'A dot on the right (שׁ) = sh; on the left (שׂ) = s.'),
        he('ת', 'תו', 't', 'תפוח', 'tapuaḥ', 'apple', 'mark', 'The last letter. Its name means “mark” or “sign”.')
      ] },
      { title: 'Final forms', items: [
        he('ך', 'כף סופית', 'kh', 'מלך', 'melekh', 'king', '', 'Final kaf: a kaf whose tail drops below the line at the end of a word.'),
        he('ם', 'מם סופית', 'm', 'שלום', 'shalom', 'peace; hello', '', 'Final mem: a closed square.'),
        he('ן', 'נון סופית', 'n', 'גן', 'gan', 'garden', '', 'Final nun: a straight line that drops below the baseline.'),
        he('ף', 'פא סופית', 'f', 'כסף', 'kesef', 'money; silver', '', 'Final pe: always f at the end of a Hebrew word.'),
        he('ץ', 'צדי סופית', 'ts', 'עץ', 'ets', 'tree', '', 'Final tsadi.')
      ] }
    ]
  });

  // ------------------------------------------------------------ Hindi Devanagari
  const PLACE = { velar: 'made at the back of the mouth, with the tongue against the soft palate', palatal: 'made with the middle of the tongue against the hard palate', retroflex: 'made with the tongue tip curled back to the roof of the mouth — a sound English does not have', dental: 'made with the tongue tip touching the back of the upper teeth (softer than English t and d)', labial: 'made with the lips' };
  const hi = (g, r, place, w, wr, m, y) => ({ g, r, place, w, wr, m, y, say: g, n: r });
  const hiv = (g, r, w, wr, m, y) => ({ g, r, w, wr, m, y, say: g, n: r, kind: 'vowel' });
  S.push({
    id: 'devanagari', name: 'Hindi (Devanagari)', native: 'देवनागरी', lang: 'hi-IN', type: 'Abugida (each consonant carries a built-in “a”)', font: "'Noto Sans Devanagari'",
    region: 'South Asia',
    intro: 'Devanagari is used for Hindi, Marathi, Nepali and Sanskrit. Each consonant already includes a short “a” sound: क is “ka”, not “k”. Other vowels are added with marks around the consonant (कि ki, कु ku, के ke). The consonants are arranged scientifically in rows by where in the mouth the sound is made, from the throat to the lips.',
    writing: ['Write left to right.', 'Write the body of the letter first, then draw the horizontal headline (शिरोरेखा) that joins the letters of a word.', 'A vowel sign can sit before (ि), after (ा ी), above (े ै) or below (ु ू) the consonant.', 'Two consonants without a vowel between them join into a conjunct: क + ष = क्ष.'],
    why(it) {
      if (it.kind === 'vowel') return it.g + ' is the vowel “' + it.r + '”. ' + (it.y || '');
      const asp = /^[kgcjṭḍtdpb]h/.test(it.r) ? ' The “h” means it is aspirated: say it with a strong puff of air — hold a piece of paper in front of your mouth and it should move.' : '';
      return it.g + ' is “' + it.r + '”, ' + (PLACE[it.place] || '') + '.' + asp + ' Like every Devanagari consonant, it includes a short “a” unless another vowel sign is added.' + (it.y ? ' ' + it.y : '');
    },
    sections: [
      { title: 'Vowels (स्वर)', items: [
        hiv('अ', 'a', 'अनार', 'anār', 'pomegranate', 'A short, relaxed “uh” as in “about”. This is the vowel hidden inside every consonant.'),
        hiv('आ', 'ā', 'आम', 'ām', 'mango', 'Long “aa” as in “father”. Its sign after a consonant is ा (का kā).'),
        hiv('इ', 'i', 'इमली', 'imlī', 'tamarind', 'Short “i” as in “sit”. Its sign ि is written before the consonant but said after it.'),
        hiv('ई', 'ī', 'ईख', 'īkh', 'sugarcane', 'Long “ee”. Sign: ी.'),
        hiv('उ', 'u', 'उल्लू', 'ullū', 'owl', 'Short “u” as in “put”. Sign: ु under the letter.'),
        hiv('ऊ', 'ū', 'ऊन', 'ūn', 'wool', 'Long “oo”. Sign: ू.'),
        hiv('ऋ', 'ṛ', 'ऋषि', 'ṛṣi', 'sage', 'Originally a vowel r; in Hindi said “ri”. Found mostly in Sanskrit words.'),
        hiv('ए', 'e', 'एड़ी', 'eṛī', 'heel', 'Long “e” as in “they”. Sign: े above.'),
        hiv('ऐ', 'ai', 'ऐनक', 'ainak', 'spectacles', 'In Hindi an open “ae” as in “bat”. Sign: ै.'),
        hiv('ओ', 'o', 'ओखली', 'okhlī', 'mortar', 'Long “o”. Sign: ो.'),
        hiv('औ', 'au', 'औरत', 'aurat', 'woman', 'An open “aw” as in “law”. Sign: ौ.'),
        hiv('अं', 'aṃ', 'अंगूर', 'aṅgūr', 'grapes', 'The dot (anusvara) adds a nasal sound matching the next consonant.'),
        hiv('अः', 'aḥ', 'प्रातः', 'prātaḥ', 'morning', 'The two dots (visarga) add a breathy h echo. Used mainly in Sanskrit words.')
      ] },
      { title: 'Consonants (व्यंजन)', items: [
        hi('क', 'ka', 'velar', 'कमल', 'kamal', 'lotus'), hi('ख', 'kha', 'velar', 'खरगोश', 'khargosh', 'rabbit'), hi('ग', 'ga', 'velar', 'गमला', 'gamlā', 'flowerpot'), hi('घ', 'gha', 'velar', 'घर', 'ghar', 'house', 'A voiced g followed by a breathy puff — say “log-house” quickly.'), hi('ङ', 'ṅa', 'velar', 'रंग', 'raṅg', 'colour', 'The “ng” of “sing”. It almost never starts a word and is usually written as a dot (anusvara).'),
        hi('च', 'ca', 'palatal', 'चम्मच', 'cammac', 'spoon', 'Written c in transliteration but said “ch”, without a puff of air.'), hi('छ', 'cha', 'palatal', 'छतरी', 'chatrī', 'umbrella'), hi('ज', 'ja', 'palatal', 'जहाज़', 'jahāz', 'ship'), hi('झ', 'jha', 'palatal', 'झंडा', 'jhaṇḍā', 'flag'), hi('ञ', 'ña', 'palatal', 'पंजा', 'pañjā', 'paw', 'Like ñ in Spanish “señor”; usually written with a dot in modern Hindi.'),
        hi('ट', 'ṭa', 'retroflex', 'टमाटर', 'ṭamāṭar', 'tomato'), hi('ठ', 'ṭha', 'retroflex', 'ठेला', 'ṭhelā', 'handcart'), hi('ड', 'ḍa', 'retroflex', 'डमरू', 'ḍamrū', 'small drum'), hi('ढ', 'ḍha', 'retroflex', 'ढोल', 'ḍhol', 'drum'), hi('ण', 'ṇa', 'retroflex', 'बाण', 'bāṇ', 'arrow', 'A retroflex n; it does not start Hindi words.'),
        hi('त', 'ta', 'dental', 'तरबूज़', 'tarbūz', 'watermelon'), hi('थ', 'tha', 'dental', 'थैला', 'thailā', 'bag', 'Not the th of “think” — it is a t with a puff of air.'), hi('द', 'da', 'dental', 'दवात', 'davāt', 'inkpot'), hi('ध', 'dha', 'dental', 'धनुष', 'dhanuṣ', 'bow'), hi('न', 'na', 'dental', 'नल', 'nal', 'tap'),
        hi('प', 'pa', 'labial', 'पतंग', 'patang', 'kite'), hi('फ', 'pha', 'labial', 'फल', 'phal', 'fruit', 'Traditionally an aspirated p; many speakers say f, especially in English loanwords.'), hi('ब', 'ba', 'labial', 'बतख', 'batakh', 'duck'), hi('भ', 'bha', 'labial', 'भालू', 'bhālū', 'bear'), hi('म', 'ma', 'labial', 'मछली', 'machlī', 'fish'),
        hi('य', 'ya', 'palatal', 'यात्रा', 'yātrā', 'journey'), hi('र', 'ra', '', 'रथ', 'rath', 'chariot', 'A tapped r. Combined with other letters it takes special shapes (प्र pra, र्क rka).'), hi('ल', 'la', 'dental', 'लड्डू', 'laḍḍū', 'laddu (sweet)'), hi('व', 'va', 'labial', 'वन', 'van', 'forest', 'Between v and w.'),
        hi('श', 'śa', 'palatal', 'शलगम', 'śalgam', 'turnip', 'Like sh in “ship”.'), hi('ष', 'ṣa', 'retroflex', 'षट्कोण', 'ṣaṭkoṇ', 'hexagon', 'In Sanskrit a retroflex sh; in modern Hindi said like श.'), hi('स', 'sa', 'dental', 'सपेरा', 'saperā', 'snake charmer'), hi('ह', 'ha', '', 'हाथी', 'hāthī', 'elephant', 'A breathy, voiced h made in the throat.')
      ] }
    ]
  });

  // ------------------------------------------------------------ Georgian
  const EJECT = new Set(['კ', 'პ', 'ტ', 'წ', 'ჭ', 'ყ']);
  const ka = (g, n, r, w, wr, m, y) => ({ g, n, r, w, wr, m, y, say: n });
  S.push({
    id: 'georgian', name: 'Georgian', native: 'ქართული ანბანი', lang: 'ka-GE', type: 'Alphabet (one letter per sound)', font: "'Noto Sans Georgian'",
    region: 'Europe & Asia',
    intro: 'Modern Georgian is written in Mkhedruli, one of three historical Georgian scripts, with 33 letters. It is perfectly phonetic — each letter always has the same sound — and it has no capital letters. Georgian is famous for “ejective” consonants, popped out with a closed throat, and for long consonant clusters such as გვფრცქვნი (gvprtskvni, “you peel us”).',
    writing: ['Write left to right.', 'There are no capitals: all letters share a middle band, and some rise above or drop below it, which gives Georgian its rounded, wave-like look.', 'Most letters are made of curves and loops; keep them the same height in the middle band.'],
    why(it) { return it.g + ' (' + it.n + ') is always pronounced “' + it.r + '”. ' + (EJECT.has(it.g) ? 'It is an ejective: close your throat, build up pressure in your mouth and release it with a sharp pop — no breath comes from the lungs. ' : '') + (it.y || ''); },
    sections: [{ title: 'Letters (33)', items: [
      ka('ა', 'ანი', 'a', 'ათი', 'ati', 'ten'), ka('ბ', 'ბანი', 'b', 'ბავშვი', 'bavshvi', 'child'), ka('გ', 'განი', 'g', 'გული', 'guli', 'heart'), ka('დ', 'დონი', 'd', 'დედა', 'deda', 'mother', 'Georgian “mother” is deda and “father” is mama.'),
      ka('ე', 'ენი', 'e', 'ენა', 'ena', 'language; tongue'), ka('ვ', 'ვინი', 'v', 'ვაშლი', 'vashli', 'apple'), ka('ზ', 'ზენი', 'z', 'ზღვა', 'zghva', 'sea'), ka('თ', 'თანი', 't (aspirated)', 'თვალი', 'tvali', 'eye', 'A t with a puff of air, like English t in “top”.'),
      ka('ი', 'ინი', 'i', 'ია', 'ia', 'violet (flower)'), ka('კ', 'კანი', 'k’', 'კატა', 'k’at’a', 'cat'), ka('ლ', 'ლასი', 'l', 'ლომი', 'lomi', 'lion'), ka('მ', 'მანი', 'm', 'მამა', 'mama', 'father'),
      ka('ნ', 'ნარი', 'n', 'ნავი', 'navi', 'boat'), ka('ო', 'ონი', 'o', 'ოთახი', 'otakhi', 'room'), ka('პ', 'პარი', 'p’', 'პური', 'p’uri', 'bread'), ka('ჟ', 'ჟანი', 'zh', 'ჟირაფი', 'zhirapi', 'giraffe', 'Like the s in “pleasure”.'),
      ka('რ', 'რაე', 'r (rolled)', 'რძე', 'rdze', 'milk'), ka('ს', 'სანი', 's', 'სახლი', 'sakhli', 'house'), ka('ტ', 'ტარი', 't’', 'ტყე', 't’q’e', 'forest'), ka('უ', 'უნი', 'u', 'უბანი', 'ubani', 'neighbourhood'),
      ka('ფ', 'ფარი', 'p (aspirated)', 'ფეხი', 'pekhi', 'foot; leg', 'A p with a puff of air — not an f.'), ka('ქ', 'ქანი', 'k (aspirated)', 'ქალაქი', 'kalaki', 'city'), ka('ღ', 'ღანი', 'gh', 'ღვინო', 'ghvino', 'wine', 'A gargled sound like French r. Georgia is one of the oldest wine-making regions in the world.'), ka('ყ', 'ყარი', 'q’', 'ყველი', 'q’veli', 'cheese', 'A k made far back at the uvula, as an ejective.'),
      ka('შ', 'შინი', 'sh', 'შავი', 'shavi', 'black'), ka('ჩ', 'ჩინი', 'ch (aspirated)', 'ჩაი', 'chai', 'tea'), ka('ც', 'ცანი', 'ts (aspirated)', 'ცა', 'tsa', 'sky'), ka('ძ', 'ძილი', 'dz', 'ძაღლი', 'dzaghli', 'dog'),
      ka('წ', 'წილი', 'ts’', 'წყალი', 'ts’q’ali', 'water'), ka('ჭ', 'ჭარი', 'ch’', 'ჭიქა', 'ch’ika', 'glass, cup'), ka('ხ', 'ხანი', 'kh', 'ხე', 'khe', 'tree', 'Like ch in Scottish “loch”.'), ka('ჯ', 'ჯანი', 'j', 'ჯიბე', 'jibe', 'pocket'), ka('ჰ', 'ჰაე', 'h', 'ჰაერი', 'haeri', 'air')
    ] }]
  });

  window.ALPHABETS = S;
  window.ALPHABET_PRESETS = ['Armenian', 'Bengali', 'Tamil', 'Amharic (Ge’ez)', 'Khmer', 'Lao', 'Burmese', 'Tibetan', 'Gujarati', 'Punjabi (Gurmukhi)', 'Sinhala', 'Mongolian Cyrillic', 'Ukrainian', 'Persian', 'Urdu', 'Cherokee', 'Inuktitut syllabics', 'Tifinagh (Berber)', 'Spanish', 'Swahili', 'Vietnamese', 'Polish', 'Turkish', 'German'];
})(window);
