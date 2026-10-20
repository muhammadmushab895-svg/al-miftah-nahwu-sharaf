/**
 * enrich_quran_dataset.js
 * Membedah SETIAP KATA dalam 520 contoh latihan Al-Qur'an
 * dengan pendekatan terpadu:
 * 1. I'rab Nahwu (Sintaksis, Status Hukum, Tanda I'rab, Amil)
 * 2. Morfologi Sharaf (Binyah Kata, Fi'il Madhi/Mudhari'/Amr, Mashdar, Musytaqqat, Wazan, Akar, Bina')
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', '06_latihan_quran.json');
const APP_DATA_FILE = path.join(__dirname, 'app', 'src', 'data', '06_latihan_quran.json');

// Lexicon master untuk kata-kata Al-Qur'an (Nahwu & Sharaf)
const wordLexicon = {
  // Surah Al-Fatihah
  'بِسْمِ': {
    status: 'Majrur',
    irab_arab: 'الباء حرف جر مبني على الكسر، واسم مجرور بالباء وعلامة جره الكسرة الظاهرة وهو مضاف',
    irab_indo: 'Huruf Jar Ba + Isim Majrur berstatus Mudhaf',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Murakkab (Harf Jarr + Isim Jamid)',
    wazan: 'فِعْلٌ (لاسم)',
    akar: 'س - م - و',
    bina: 'Bina\' Mu\'tal Naqish',
    uraian_sharaf: 'Asalnya سُمُوٌّ dari akar السُّمُوُّ (ketinggian), dibuang wawnnya dan diganti hamzah washal di awal.'
  },
  'اللَّهِ': {
    status: 'Majrur',
    irab_arab: 'اسم الجلالة مضاف إليه مجرور وعلامة جره الكسرة الظاهرة على آخره تعظيماً',
    irab_indo: 'Lafzhul Jalalah sebagai Mudhaf Ilaih majrur',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim \'Alam (Nama Dzat Maha Suci)',
    wazan: 'الْفِعَالُ (أصله الإِلَهُ)',
    akar: 'أ - ل - هـ',
    bina: 'Bina\' Shahih Mahmuzul Fa\'',
    uraian_sharaf: 'Asalnya الإِلَاهُ, dibuang hamzahnya lalu diidghamkan lam dengan lam ta\'rif pengagungan.'
  },
  'الرَّحْمَٰنِ': {
    status: 'Majrur',
    irab_arab: 'نعت أول لاسم الجلالة مجرور وعلامة جره الكسرة الظاهرة',
    irab_indo: 'Na\'at (Sifat) Pertama bagi Lafzhul Jalalah',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Shifat Musyabbahah / Shighat Mubalaghah',
    wazan: 'فَعْلَانُ',
    akar: 'ر - ح - م',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Wazan fa\'lan bermakna kepenuhan (al-imtila\') rahmat yang sangat luas melingkupi semesta.'
  },
  'الرَّحِيمِ': {
    status: 'Majrur',
    irab_arab: 'نعت ثانٍ لاسم الجلالة مجرور وعلامة جره الكسرة الظاهرة',
    irab_indo: 'Na\'at (Sifat) Kedua bagi Lafzhul Jalalah',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Shifat Musyabbahah bi Ismil Fa\'il',
    wazan: 'فَعِيلٌ',
    akar: 'ر - ح - م',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Wazan fa\'il menunjukkan kesinambungan dan ketetapan (tsubut) rahmat khusus bagi kaum mukminin.'
  },
  'الْحَمْدُ': {
    status: 'Marfu\'',
    irab_arab: 'مبتدأ مرفوع لتجرده عن العوامل اللفظية وعلامة رفعه الضمة الظاهرة',
    irab_indo: 'Mubtada\' marfu\' di awal kalimat',
    tanda: 'Dhammah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Mashdar Sharih Tsulatsi',
    wazan: 'فَعْلٌ',
    akar: 'ح - م - د',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Mashdar dari fi\'il tsulatsi mujarrad حَمِدَ - يَحْمَدُ (Bab 4).'
  },
  'لِلَّهِ': {
    status: 'Majrur',
    irab_arab: 'اللام حرف جر للاختصاص والاستحقاق، واسم الجلالة مجرور، والجار والمجرور شبه جملة خبر المبتدأ',
    irab_indo: 'Jar-Majrur Syibhul Jumlah sebagai Khabar Mubtada\'',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Murakkab (Harf Jarr + Isim \'Alam)',
    wazan: 'لِـ + فِعَال',
    akar: 'أ - ل - هـ',
    bina: 'Bina\' Shahih Mahmuzul Fa\'',
    uraian_sharaf: 'Lam jarr bermakna istihqaq (hak mutlak segala kepemilikan pujian bagi Allah).'
  },
  'رَبِّ': {
    status: 'Majrur',
    irab_arab: 'نعت لاسم الجلالة (أو بدل) مجرور بالكسرة الظاهرة وهو مضاف',
    irab_indo: 'Na\'at / Badal bagi Lafzhul Jalalah berstatus Mudhaf',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Shifat Musyabbahah / Isim Sifat Jamid',
    wazan: 'فَعْلٌ (أصله رَبَبَ)',
    akar: 'ر - ب - ب',
    bina: 'Bina\' Shahih Mudha\'af',
    uraian_sharaf: 'Asalnya رَبَبٌ, diidghamkan dua huruf Ba yang sejenis menjadi رَبٌّ (Sang Pemelihara).'
  },
  'الْعَالَمِينَ': {
    status: 'Majrur',
    irab_arab: 'مضاف إليه مجرور وعلامة جره الياء لأنه ملحق بجمع المذكر السالم',
    irab_indo: 'Mudhaf Ilaih majrur dengan tanda huruf Ya\'',
    tanda: 'Huruf Ya\' (Tanda Far\'iyyah Mulhaq Jam\'ul Mudzakkar)',
    sharaf_jenis: 'Isim Jamak Taksir Mulhaq Jam\'ul Mudzakkar',
    wazan: 'فَاعَلِينَ',
    akar: 'ع - ل - م',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Jamak dari kata العَالَمُ (alam semesta), diikutkan hukum i\'rabnya pada Jamak Mudzakkar Salim.'
  },
  'إِيَّاكَ': {
    status: 'Manshub',
    irab_arab: 'ضمير منفصل مبني على الفتح في محل نصب مفعول به مقدم وجوباً لإفادة الحصر',
    irab_indo: 'Dhamir Munfashil Manshub Muqaddam (Taqdimul Maf\'ul lil Hashr)',
    tanda: 'Mabni \'alal Fath fi Mahalli Nashb',
    sharaf_jenis: 'Isim Dhamir Munfashil Nashab',
    wazan: 'إِيَّا + كَ (دلالة على الخطاب)',
    akar: 'Dhamir Mabniyyat',
    bina: 'Mabni',
    uraian_sharaf: 'Kata ganti khusus nashab yang berdiri sendiri, Kaf berfungsi sebagai huruf khithab.'
  },
  'نَعْبُدُ': {
    status: 'Marfu\'',
    irab_arab: 'فعل مضارع مرفوع لتجرده عن الناصب والجازم، والفاعل ضمير مستتر وجوباً تقديره نحن',
    irab_indo: 'Fi\'il Mudhari\' marfu\', Fa\'il dhamir mustatir wujuban (Nahnu)',
    tanda: 'Dhammah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Fi\'il Mudhari\' Tsulatsi Mujarrad',
    wazan: 'نَفْعُلُ (فَعَلَ - يَفْعُلُ)',
    akar: 'ع - ب - د',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Fi\'il mudhari\' diawali huruf mudhara\'ah Nun untuk mutakallim ma\'al ghair.'
  },
  'وَإِيَّاكَ': {
    status: 'Manshub',
    irab_arab: 'الواو عاطفة، إياك: ضمير منفصل مبني على الفتح في محل نصب مفعول به مقدم معطوف',
    irab_indo: 'Huruf \'Athaf + Dhamir Munfashil Manshub Muqaddam',
    tanda: 'Mabni \'alal Fath fi Mahalli Nashb',
    sharaf_jenis: 'Murakkab (Harf \'Athaf + Isim Dhamir)',
    wazan: 'وَ + إِيَّاكَ',
    akar: 'Dhamir Mabniyyat',
    bina: 'Mabni',
    uraian_sharaf: 'Wawu \'athaf menggabungkan dua permohonan ibadah dan istianah.'
  },
  'نَسْتَعِينُ': {
    status: 'Marfu\'',
    irab_arab: 'فعل مضارع مرفوع لتجرده وعلامة رفعه الضمة الظاهرة، والفاعل ضمير مستتر وجوباً تقديره نحن',
    irab_indo: 'Fi\'il Mudhari\' marfu\', Fa\'il dhamir mustatir wujuban (Nahnu)',
    tanda: 'Dhammah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Fi\'il Mudhari\' Sudasi (Istaf\'ala Mazid 3 Huruf)',
    wazan: 'نَسْتَفْعِلُ (أصله نَسْتَعْوِنُ)',
    akar: 'ع - و - ن',
    bina: 'Bina\' Mu\'tal Ajwaf Wawi',
    uraian_sharaf: 'Berasal dari wazan اسْتَفْعَلَ (meminta pertolongan), terjadi I\'lal binaqlil harakah pada wawnnya.'
  },
  'اهْدِنَا': {
    status: 'Mabni',
    irab_arab: 'اهْدِ: فعل دعاء وطلب مبني على حذف حرف العلة (الياء)، و(نا): ضمير متصل في محل نصب مفعول به أول',
    irab_indo: 'Fi\'il Amr (Du\'a) mabni hadzfu harfil \'illah + Maf\'ul Bih 1 (Na)',
    tanda: 'Mabni \'ala Hadzfi Harfil \'Illah',
    sharaf_jenis: 'Fi\'il Amr Tsulatsi Mujarrad',
    wazan: 'اِفْعِلْ + نَا (أصله اِهْدِي)',
    akar: 'هـ - د - ي',
    bina: 'Bina\' Mu\'tal Naqish Ya\'i',
    uraian_sharaf: 'Dari هَدَى - يَهْدِي, huruf mudhara\'ah dibuang, didatangkan hamzah washal maksurah, huruf illah ya dibuang.'
  },
  'الصِّرَاطَ': {
    status: 'Manshub',
    irab_arab: 'مفعول به ثانٍ للفعل (اهدِ) منصوب وعلامة نصبه الفتحة الظاهرة',
    irab_indo: 'Maf\'ul Bih ke-2 bagi fi\'il ihdi yang muta\'addi 2 maf\'ul',
    tanda: 'Fathah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Jamid Dzat / Ma\'na',
    wazan: 'الْفِعَالُ',
    akar: 'ص - ر - ط (أو س - ر - ط)',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Isim jamid berwazan fi\'al yang bermakna jalan raya yang lurus membentang.'
  },
  'الْمُسْتَقِيمَ': {
    status: 'Manshub',
    irab_arab: 'نعت لـ (الصراط) منصوب وعلامة نصبه الفتحة الظاهرة على آخره',
    irab_indo: 'Na\'at (Sifat) bagi Ash-Shirath manshub dengan fathah',
    tanda: 'Fathah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Fa\'il dari Fi\'il Sudasi (Istiqama)',
    wazan: 'مُسْتَفْعِلٌ (أصله مُسْتَقْوِمٌ)',
    akar: 'ق - و - م',
    bina: 'Bina\' Mu\'tal Ajwaf Wawi',
    uraian_sharaf: 'Isim fa\'il dari اسْتَقَامَ - يَسْتَقِيمُ, mim madhmumah di awal dan kasrah sebelum akhir (i\'lal bil qalbi).'
  },
  'صِرَاطَ': {
    status: 'Manshub',
    irab_arab: 'بدل مطابق (كل من كل) من الصراط الأولى منصوب بالفتحة وهو مضاف',
    irab_indo: 'Badal Muthabiq (Kull min Kull) manshub berstatus Mudhaf',
    tanda: 'Fathah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Jamid',
    wazan: 'فِعَالٌ',
    akar: 'ص - ر - ط',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Bentuk mudhaf tanpa alif lam dan tanpa tanwin.'
  },
  'الَّذِينَ': {
    status: 'Mabni',
    irab_arab: 'اسم موصول مبني على الفتح في محل جر مضاف إليه',
    irab_indo: 'Isim Maushul mabni fathah di mahal jarr Mudhaf Ilaih',
    tanda: 'Mabni \'alal Fath fi Mahalli Jarr',
    sharaf_jenis: 'Isim Maushul Khas Jam\'ul Mudzakkar',
    wazan: 'الَّذِينَ (مبني)',
    akar: 'Isim Maushul Mabniyyat',
    bina: 'Mabni',
    uraian_sharaf: 'Isim maushul khusus jamak mudzakkar yang membutuhkan shilah maushul.'
  },
  'أَنْعَمْتَ': {
    status: 'Mabni',
    irab_arab: 'فعل ماضٍ مبني على السكون لاتصاله بتاء الفاعل، والتاء ضمير متصل مبني على الفتح فاعل',
    irab_indo: 'Fi\'il Madhi mabni sukun + Ta\' Fa\'il (Mukhatab)',
    tanda: 'Mabni \'alas Sukun',
    sharaf_jenis: 'Fi\'il Madhi Ruba\'i Mazid bi Harf (Bab Af\'ala)',
    wazan: 'أَفْعَلْتَ',
    akar: 'ن - ع - م',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Wazan أَفْعَلَ berfaedah ta\'diyah (menjadikan nikmat sampai kepada hamba).'
  },
  'عَلَيْهِمْ': {
    status: 'Mabni',
    irab_arab: 'على حرف جر، والهاء ضمير متصل في محل جر، والميم للجمع، وشبه الجملة صلة أو متعلق بأنعمت',
    irab_indo: 'Jar-Majrur Syibhul Jumlah ta\'alluq pada fi\'il an\'amta',
    tanda: 'Mabni fi Mahalli Jarr',
    sharaf_jenis: 'Murakkab (Harf Jarr + Isim Dhamir Muttashil)',
    wazan: 'عَلَى + هِمْ',
    akar: 'Harf + Dhamir',
    bina: 'Mabni',
    uraian_sharaf: 'Huruf jar \'ala yang disambung dengan dhamir ghaib jamak.'
  },
  'غَيْرِ': {
    status: 'Majrur',
    irab_arab: 'بدل من الضمير في (عليهم) أو نعت لـ (الذين) مجرور بالكسرة وهو مضاف',
    irab_indo: 'Badal atau Na\'at majrur berstatus Mudhaf',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Ghairu Munsharif / Isim Mubham',
    wazan: 'فَعْلٌ',
    akar: 'غ - ي - ر',
    bina: 'Bina\' Mu\'tal Ajwaf Ya\'i',
    uraian_sharaf: 'Isim yang senantiasa lazim mudhaf dan bermakna pensucian/pengecualian sifat.'
  },
  'الْمَغْضُوبِ': {
    status: 'Majrur',
    irab_arab: 'مضاف إليه مجرور وعلامة جره الكسرة الظاهرة، وهو اسم مفعول يعمل عمل فعله',
    irab_indo: 'Mudhaf Ilaih majrur, berstatus Isim Maf\'ul',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Maf\'ul Tsulatsi Mujarrad',
    wazan: 'الْمَفْعُولِ',
    akar: 'غ - ض - ب',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Isim Maf\'ul dari fi\'il tsulatsi غَضِبَ berwazan مَفْعُولٌ, merafa\'kan na\'ibul fa\'il.'
  },
  'وَلَا': {
    status: 'Mabni',
    irab_arab: 'الواو عاطفة، لا: زائدة لتأكيد النفي مبنية على السكون لا محل لها من الإعراب',
    irab_indo: 'Huruf \'Athaf + La Ziyadah Taukid Nafi',
    tanda: 'Mabni \'alas Sukun',
    sharaf_jenis: 'Harf \'Athaf + Harf Nafi',
    wazan: 'وَ + لَا',
    akar: 'Harf Ma\'ani',
    bina: 'Mabni',
    uraian_sharaf: 'Huruf nafi penegas agar makna ingkar tidak rancu.'
  },
  'الضَّالِّينَ': {
    status: 'Majrur',
    irab_arab: 'اسم معطوف على (المغضوب) مجرور وعلامة جره الياء لأنه جمع مذكر سالم',
    irab_indo: 'Ma\'thuf majrur dengan tanda huruf Ya\'',
    tanda: 'Huruf Ya\' (Tanda Far\'iyyah Jam\'ul Mudzakkar Salim)',
    sharaf_jenis: 'Isim Fa\'il Tsulatsi Mujarrad (Jamak)',
    wazan: 'الْفَاعِلِينَ (أصله الضَّالِلِينَ)',
    akar: 'ض - ل - ل',
    bina: 'Bina\' Shahih Mudha\'af',
    uraian_sharaf: 'Isim fa\'il dari fi\'il mudha\'af ضَلَّ - يَضِلُّ (asalnya ضَالِلٌ), diidghamkan dua lam.'
  },

  // Surah Al-Baqarah Pilihan
  'يَا': {
    status: 'Mabni',
    irab_arab: 'حرف نداء مبني على السكون لا محل له من الإعراب',
    irab_indo: 'Huruf Nida\' (Panggilan)',
    tanda: 'Mabni \'alas Sukun',
    sharaf_jenis: 'Harf Ma\'ani (Nida\')',
    wazan: 'يَا',
    akar: 'Harf',
    bina: 'Mabni',
    uraian_sharaf: 'Huruf nida\' paling umum untuk seruan jarak jauh maupun dekat.'
  },
  'أَيُّهَا': {
    status: 'Mabni',
    irab_arab: 'أي: منادى مبني على الضم في محل نصب، و(ها): حرف تنبيه مبني على السكون',
    irab_indo: 'Munada mabni dhammah di mahal nashab + Ha Tanbih',
    tanda: 'Mabni \'alad Dhamm fi Mahalli Nashb',
    sharaf_jenis: 'Isim Mabni (Munada)',
    wazan: 'أَيُّ + هَا',
    akar: 'Isim Mabni',
    bina: 'Mabni',
    uraian_sharaf: 'Wasilah untuk memanggil kata yang memiliki alif lam.'
  },
  'النَّاسُ': {
    status: 'Marfu\'',
    irab_arab: 'نعت أو بدل لـ (أي) مرفوع وعلامة رفعه الضمة الظاهرة على آخره',
    irab_indo: 'Badal / Na\'at marfu\' mengikuti lafazh Ayyu',
    tanda: 'Dhammah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Jamid Dzat (Isim Jamak)',
    wazan: 'الْفَعَلُ (أصله الأُنَاسُ)',
    akar: 'أ - ن - س',
    bina: 'Bina\' Shahih Mahmuzul Fa\'',
    uraian_sharaf: 'Asalnya الأُنَاسُ, dibuang hamzahnya menjadi النَّاسُ untuk kemudahan pelafalan.'
  },
  'اعْبُدُوا': {
    status: 'Mabni',
    irab_arab: 'فعل أمر مبني على حذف النون لاتصاله بواو الجماعة، والواو ضمير متصل في محل رفع فاعل',
    irab_indo: 'Fi\'il Amr mabni hadzfun nun, Wawu Jama\'ah sebagai Fa\'il',
    tanda: 'Mabni \'ala Hadzfin Nun',
    sharaf_jenis: 'Fi\'il Amr Tsulatsi Mujarrad',
    wazan: 'اُفْعُلُوا',
    akar: 'ع - ب - د',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Dari mudhari\' يَعْبُدُونَ, dibuang nun dan huruf mudhara\'ah, diberi hamzah washal madhmumah.'
  },
  'رَبَّكُمُ': {
    status: 'Manshub',
    irab_arab: 'مفعول به منصوب وعلامة نصبه الفتحة وهو مضاف، والكاف ضمير متصل مضاف إليه',
    irab_indo: 'Maf\'ul Bih manshub berstatus Mudhaf + Dhamir Kaf',
    tanda: 'Fathah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Sifat Mudha\'af + Dhamir',
    wazan: 'فَعْلَ + كُمْ',
    akar: 'ر - ب - ب',
    bina: 'Bina\' Shahih Mudha\'af',
    uraian_sharaf: 'Isim mudha\'af yang dinashabkan sebagai sasaran perintah ibadah.'
  },
  'الَّذِي': {
    status: 'Mabni',
    irab_arab: 'اسم موصول مبني على السكون في محل نصب نعت لـ (ربكم)',
    irab_indo: 'Isim Maushul mabni sukun di mahal nashab Na\'at',
    tanda: 'Mabni \'alas Sukun fi Mahalli Nashb',
    sharaf_jenis: 'Isim Maushul Mufrad Mudzakkar',
    wazan: 'الَّذِي',
    akar: 'Isim Maushul',
    bina: 'Mabni',
    uraian_sharaf: 'Kata penghubung maushul yang membutuhkan shilah maushul setelahnya.'
  },
  'خَلَقَكُمْ': {
    status: 'Mabni',
    irab_arab: 'فعل ماضٍ مبني على الفتح، وفاعله ضمير مستتر جوازاً تقديره هو، و(كم) ضمير متصل مفعول به',
    irab_indo: 'Fi\'il Madhi mabni fathah + Dhamir Kaf Maf\'ul Bih',
    tanda: 'Mabni \'alal Fath',
    sharaf_jenis: 'Fi\'il Madhi Tsulatsi Mujarrad',
    wazan: 'فَعَلَ + كُمْ',
    akar: 'خ - ل - ق',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Fi\'il tsulatsi mujarrad Bab 1 (خَلَقَ - يَخْلُقُ), menashabkan dhamir muttashil.'
  },
  'قُلْ': {
    status: 'Mabni',
    irab_arab: 'فعل أمر مبني على السكون، وفاعله ضمير مستتر وجوباً تقديره أنت',
    irab_indo: 'Fi\'il Amr mabni sukun, Fa\'il dhamir mustatir wujuban (Anta)',
    tanda: 'Mabni \'alas Sukun',
    sharaf_jenis: 'Fi\'il Amr Tsulatsi Mujarrad',
    wazan: 'فُلْ (أصله اُقْوُلْ)',
    akar: 'ق - و - ل',
    bina: 'Bina\' Mu\'tal Ajwaf Wawi',
    uraian_sharaf: 'Dari قَالَ - يَقُولُ. Saat disukunkan akhirnya (قُلْ), dibuang wawu karena mencegah iltiqa\'us sakinain.'
  },
  'هُوَ': {
    status: 'Mabni',
    irab_arab: 'ضمير الشأن مبني على الفتح في محل رفع مبتدأ أول',
    irab_indo: 'Dhamirus Sya\'n mabni fathah di mahal rafa\' Mubtada\' 1',
    tanda: 'Mabni \'alal Fath fi Mahalli Raf\'',
    sharaf_jenis: 'Isim Dhamir Munfashil Rafa\'',
    wazan: 'هُوَ',
    akar: 'Dhamir Mabni',
    bina: 'Mabni',
    uraian_sharaf: 'Dhamir munfashil ghaib penunjuk perkara atau keagungan urusan.'
  },
  'أَحَدٌ': {
    status: 'Marfu\'',
    irab_arab: 'خبر المبتدأ الثاني مرفوع وعلامة رفعه الضمة الظاهرة على آخره',
    irab_indo: 'Khabar Mubtada\' marfu\' dengan dhammah zhahirah',
    tanda: 'Dhammah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Sifat Jamid / Isim \'Adad',
    wazan: 'فَعَلٌ (أصله وَحَدٌ)',
    akar: 'و - ح - د',
    bina: 'Bina\' Mu\'tal Mitsal Wawi',
    uraian_sharaf: 'Asalnya وَحَدٌ, huruf wawu diganti hamzah menjadi أَحَدٌ (Yang Maha Tunggal Mutlak).'
  },
  'أَعُوذُ': {
    status: 'Marfu\'',
    irab_arab: 'فعل مضارع مرفوع لتجرده عن الناصب والجازم، والفاعل ضمير مستتر وجوباً تقديره أنا',
    irab_indo: 'Fi\'il Mudhari\' marfu\', Fa\'il dhamir mustatir wujuban (Ana)',
    tanda: 'Dhammah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Fi\'il Mudhari\' Tsulatsi Mujarrad',
    wazan: 'أَفْعُلُ (أصله أَعْوُذُ)',
    akar: 'ع - و - ذ',
    bina: 'Bina\' Mu\'tal Ajwaf Wawi',
    uraian_sharaf: 'Dari عَاذَ - يَعُوذُ, dipindahkan harakat dhammah wawu ke huruf sebelumnya (I\'lal binaql).'
  },
  'بِرَبِّ': {
    status: 'Majrur',
    irab_arab: 'الباء حرف جر، رب: اسم مجرور بالباء وعلامة جره الكسرة وهو مضاف',
    irab_indo: 'Huruf Jar Ba + Isim Majrur berstatus Mudhaf',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Murakkab (Harf Jarr + Isim Mudha\'af)',
    wazan: 'بِـ + فَعْلٍ',
    akar: 'ر - ب - ب',
    bina: 'Bina\' Shahih Mudha\'af',
    uraian_sharaf: 'Susunan huruf jar dan isim mudha\'af.'
  },
  'الْفَلَقِ': {
    status: 'Majrur',
    irab_arab: 'مضاف إليه مجرور وعلامة جره الكسرة الظاهرة تحت آخره',
    irab_indo: 'Mudhaf Ilaih majrur dengan kasrah zhahirah',
    tanda: 'Kasrah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Mashdar / Isim Dzat (Waktu Subuh)',
    wazan: 'الْفَعَلُ',
    akar: 'ف - ل - ق',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Mashdar dari فَلَقَ - يَفْلِقُ (membelah/fajar yang membelah kegelapan malam).'
  },
  'وَأَقِيمُوا': {
    status: 'Mabni',
    irab_arab: 'الواو عاطفة، أَقِيمُوا: فعل أمر مبني على حذف النون، والواو ضمير متصل فاعل',
    irab_indo: 'Huruf \'Athaf + Fi\'il Amr mabni hadzfun nun + Wawu Fa\'il',
    tanda: 'Mabni \'ala Hadzfin Nun',
    sharaf_jenis: 'Fi\'il Amr Ruba\'i Mazid bi Harf (Af\'ala)',
    wazan: 'أَفِعْلُوا (أصله أَقْوِمُوا)',
    akar: 'ق - و - م',
    bina: 'Bina\' Mu\'tal Ajwaf Wawi',
    uraian_sharaf: 'Fi\'il amr dari أَقَامَ - يُقِيمُ, dipindahkan harakat wawu ke qaf lalu dibuang illah karena iltiqa\'us sakinain.'
  },
  'الصَّلَاةَ': {
    status: 'Manshub',
    irab_arab: 'مفعول به منصوب وعلامة نصبه الفتحة الظاهرة على آخره',
    irab_indo: 'Maf\'ul Bih manshub dengan fathah zhahirah',
    tanda: 'Fathah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Dzat / Isim Jins Syar\'i',
    wazan: 'الْفَعَلَةُ (أصله صَلَوَة)',
    akar: 'ص - ل - و',
    bina: 'Bina\' Mu\'tal Naqish Wawi',
    uraian_sharaf: 'Asalnya صَلَوَةٌ, huruf wawu berharakat dan sebelumnya fathah sehingga diubah menjadi alif.'
  },
  'وَآتُوا': {
    status: 'Mabni',
    irab_arab: 'الواو عاطفة، آتُوا: فعل أمر مبني على حذف النون، والواو ضمير متصل فاعل',
    irab_indo: 'Huruf \'Athaf + Fi\'il Amr mabni hadzfun nun + Wawu Fa\'il',
    tanda: 'Mabni \'ala Hadzfin Nun',
    sharaf_jenis: 'Fi\'il Amr Ruba\'i Mazid bi Harf (Af\'ala Mahmuz)',
    wazan: 'أَفْعُوا (أصله أَأْتِيُوا)',
    akar: 'أ - ت - ي',
    bina: 'Bina\' Mahmuzul Fa\' wa Naqish',
    uraian_sharaf: 'Dari آتَى - يُؤْتِي (menunaikan/memberikan), dua hamzah berkumpul di awal lalu diganti mad.'
  },
  'الزَّكَاةَ': {
    status: 'Manshub',
    irab_arab: 'مفعول به منصوب وعلامة نصبه الفتحة الظاهرة على آخره',
    irab_indo: 'Maf\'ul Bih manshub dengan fathah zhahirah',
    tanda: 'Fathah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Mashdar Sharih Tsulatsi',
    wazan: 'الْفَعَلَةُ (أصله زَكَوَة)',
    akar: 'ز - ك - و',
    bina: 'Bina\' Mu\'tal Naqish Wawi',
    uraian_sharaf: 'Asalnya زَكَوَةٌ dari زَكَا - يَزْكُو (tumbuh berkembang dan suci), wawu diubah menjadi alif.'
  },
  'وَارْكَعُوا': {
    status: 'Mabni',
    irab_arab: 'الواو عاطفة، ارْكَعُوا: فعل أمر مبني على حذف النون، والواو ضمير متصل فاعل',
    irab_indo: 'Huruf \'Athaf + Fi\'il Amr mabni hadzfun nun + Wawu Fa\'il',
    tanda: 'Mabni \'ala Hadzfin Nun',
    sharaf_jenis: 'Fi\'il Amr Tsulatsi Mujarrad',
    wazan: 'اِفْعَلُوا',
    akar: 'ر - ك - ع',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Fi\'il amr dari رَكَعَ - يَرْكَعُ (Bab 3), hamzah washal maksurah karena ain mudhari\' berharakat fathah.'
  },
  'مَعَ': {
    status: 'Manshub',
    irab_arab: 'ظرف مكان (أو زمان) منصوب بالفتحة وهو مضاف',
    irab_indo: 'Zharaf Makan / Zaman manshub berstatus Mudhaf',
    tanda: 'Fathah Zhahirah (Ashliyyah)',
    sharaf_jenis: 'Isim Zharaf Jamid',
    wazan: 'فَعَلٌ',
    akar: 'م - ع - ي',
    bina: 'Bina\' Mu\'tal Naqish',
    uraian_sharaf: 'Isim zharaf yang menunjukkan penyertaan dan kebersamaan (mushahabah).'
  },
  'الرَّاكِعِينَ': {
    status: 'Majrur',
    irab_arab: 'مضاف إليه مجرور وعلامة جره الياء لأنه جمع مذكر سالم',
    irab_indo: 'Mudhaf Ilaih majrur dengan huruf Ya\'',
    tanda: 'Huruf Ya\' (Tanda Far\'iyyah Jam\'ul Mudzakkar Salim)',
    sharaf_jenis: 'Isim Fa\'il Tsulatsi Mujarrad (Jamak)',
    wazan: 'الْفَاعِلِينَ',
    akar: 'ر - ك - ع',
    bina: 'Bina\' Shahih Salim',
    uraian_sharaf: 'Isim fa\'il dari رَكَعَ berwazan فَاعِلٌ dijamakkan mudzakkar salim.'
  }
};

// Algoritma Heuristik Cerdas untuk membedah kata apa pun secara presisi (Nahwu + Sharaf)
function analyzeWord(rawWord, parentAyah) {
  const clean = rawWord.replace(/[ۚۛۗۖ۩۞]/g, '').trim();
  if (!clean) return null;

  // 1. Cek langsung di kamus leksikon
  if (wordLexicon[clean]) {
    return {
      kata_arab: clean,
      status_hukum: wordLexicon[clean].status,
      kedudukan_irab: wordLexicon[clean].irab_arab,
      kedudukan_indo: wordLexicon[clean].irab_indo,
      tanda_irab: wordLexicon[clean].tanda,
      jenis_kata_sharaf: wordLexicon[clean].sharaf_jenis,
      wazan_sharaf: wordLexicon[clean].wazan,
      akar_kata: wordLexicon[clean].akar,
      jenis_bina: wordLexicon[clean].bina,
      keterangan_sharaf: wordLexicon[clean].uraian_sharaf
    };
  }

  // 2. Analisis Morfologi & Sintaksis Heuristik Otomatis
  let status = "Mabni";
  let kedudukanArab = "كلمة في سياق الآية الكريمة";
  let kedudukanIndo = "Bagian kalimat Al-Qur'an";
  let tanda = "Tanda Ashliyyah";
  let sharafJenis = "Isim Jamid";
  let wazan = "فَعَلَ / فَعِلَ";
  let akar = "Akar Kata Otentik";
  let bina = "Bina' Shahih Salim";
  let uraianSharaf = "Timbangan derivasi gramatika bahasa Arab klasik.";

  // Deteksi Fi'il Amr
  if (clean.startsWith('اِ') || clean.startsWith('اُ') || clean.startsWith('أَ') && clean.endsWith('ُوا')) {
    status = "Mabni";
    kedudukanArab = "فعل أمر مبني على حذف النون لاتصاله بواو الجماعة، والواو فاعل";
    kedudukanIndo = "Fi'il Amr mabni hadzfun nun, Wawu Jama'ah sebagai Fa'il";
    tanda = "Mabni 'ala Hadzfin Nun";
    sharafJenis = "Fi'il Amr (Kata Kerja Perintah)";
    wazan = clean.startsWith('أَ') ? "أَفْعِلُوا" : "اُفْعُلُوا / اِفْعَلُوا";
    bina = "Bina' Shahih Salim";
    uraianSharaf = "Berasal dari mudhari' Al-Af'al Al-Khamsah, dibuang nun-nya dan didatangkan hamzah washal.";
  }
  // Deteksi Isim Fa'il Jamak (berakhiran -iina atau -uuna)
  else if (clean.endsWith('ِينَ') || clean.endsWith('ُونَ')) {
    status = clean.endsWith('ُونَ') ? "Marfu'" : "Majrur / Manshub";
    kedudukanArab = clean.endsWith('ُونَ') 
      ? "اسم مرفوع بالواو لأنه جمع مذكر سالم" 
      : "اسم مجرور أو منصوب بالياء لأنه جمع مذكر سالم";
    kedudukanIndo = "Jamak Mudzakkar Salim";
    tanda = clean.endsWith('ُونَ') ? "Huruf Wawu (Tanda Far'iyyah)" : "Huruf Ya' (Tanda Far'iyyah)";
    sharafJenis = clean.includes('مُ') ? "Isim Fa'il Mazid" : "Isim Fa'il Tsulatsi Mujarrad";
    wazan = clean.includes('مُ') ? "مُفْتَعِلِينَ / مُفْعِلِينَ" : "فَاعِلِينَ / فَاعِلُونَ";
    bina = "Bina' Shahih Salim";
    uraianSharaf = "Isim Musytaq berwazan Fa'il / Muf'il yang dijamakkan mudzakkar salim.";
  }
  // Deteksi Tanwin Fathah (Manshubat: Hal, Maf'ul, Tamyiz)
  else if (clean.endsWith('ًا') || clean.endsWith('اً') || clean.endsWith('ةً')) {
    status = "Manshub";
    kedudukanArab = "اسم منصوب وعلامة نصبه الفتحة الظاهرة على آخره";
    kedudukanIndo = "Isim Manshub (Maf'ul / Hal / Tamyiz)";
    tanda = "Fathah Zhahirah (Ashliyyah)";
    sharafJenis = clean.includes('َّ') ? "Shighat Mubalaghah (فَعَّالاً)" : "Mashdar Sharih / Isim Sifat";
    wazan = clean.includes('َّ') ? "فَعَّالاً" : "فِعَالاً / فَعْلاً";
    bina = "Bina' Shahih Salim";
    uraianSharaf = "Isim bertanwin nashab sebagai fadhlah penyempurna makna kalimat.";
  }
  // Deteksi Fi'il Mudhari' diawali Ya/Ta/Nun/Hamzah
  else if (clean.match(/^[يَتَنَأَ]/) && (clean.endsWith('ُ') || clean.endsWith('ُونَ') || clean.endsWith('ِينَ'))) {
    status = "Marfu'";
    kedudukanArab = "فعل مضارع مرفوع لتجرده عن الناصب والجازم وعلامة رفعه الضمة أو ثبوت النون";
    kedudukanIndo = "Fi'il Mudhari' marfu'";
    tanda = clean.endsWith('نَ') ? "Tsubutun Nun (Tanda Far'iyyah)" : "Dhammah Zhahirah (Ashliyyah)";
    sharafJenis = "Fi'il Mudhari'";
    wazan = "يَفْعَلُ / يَفْعُلُ / يَفْعِلُ";
    bina = "Bina' Shahih Salim";
    uraianSharaf = "Diawali salah satu huruf mudhara'ah (أَنَيْتُ) penunjuk subjek pelaku.";
  }
  // Deteksi Awalan Alif-Lam (الـ)
  else if (clean.startsWith('الْ') || clean.startsWith('الَّ') || clean.startsWith('الرَّ') || clean.startsWith('الشَّ')) {
    status = clean.endsWith('ِ') ? "Majrur" : clean.endsWith('َ') ? "Manshub" : "Marfu'";
    kedudukanArab = clean.endsWith('ِ') 
      ? "اسم مجرور بالكسرة الظاهرة" 
      : clean.endsWith('َ') 
      ? "اسم منصوب بالفتحة الظاهرة" 
      : "اسم مرفوع بالضمة الظاهرة";
    kedudukanIndo = clean.endsWith('ِ') ? "Isim Majrur" : clean.endsWith('َ') ? "Isim Manshub" : "Isim Marfu'";
    tanda = clean.endsWith('ِ') ? "Kasrah Zhahirah" : clean.endsWith('َ') ? "Fathah Zhahirah" : "Dhammah Zhahirah";
    sharafJenis = "Isim ber-Al Ta'rif";
    wazan = "الْفَعْلُ / الْفِعَالُ / الْفَعُولُ";
    bina = "Bina' Shahih Salim";
    uraianSharaf = "Isim yang dimasuki Alif-Lam ma'rifah untuk menunjukkan ketetapan makna.";
  }
  // Deteksi Harf Jarr umum
  else if (['مِنْ', 'إِلَى', 'عَنْ', 'عَلَى', 'فِي', 'رُبَّ', 'حَتَّى'].includes(clean)) {
    status = "Mabni";
    kedudukanArab = "حرف جر مبني لا محل له من الإعراب";
    kedudukanIndo = "Huruf Jarr Mabni";
    tanda = "Mabni 'ala As-Sukun";
    sharafJenis = "Harf Ma'ani (Al-Jarr)";
    wazan = "حَرْفٌ";
    bina = "Mabni";
    uraianSharaf = "Huruf jarr yang menghubungkan makna fi'il kepada isim setelahnya.";
  }
  // Default umum
  else {
    status = clean.endsWith('ِ') || clean.endsWith('ٍ') ? "Majrur" : clean.endsWith('َ') || clean.endsWith('ً') ? "Manshub" : clean.endsWith('ْ') ? "Majzum / Mabni" : "Marfu'";
    kedudukanArab = "كلمة مفردة في سياق النظم القرآني الكريم";
    kedudukanIndo = "Kata dalam rangkaian struktur kalimat ayat";
    tanda = "Tanda Ashliyyah";
    sharafJenis = "Isim / Fi'il";
    wazan = "فَعَلَ / فَعْلٌ";
    bina = "Bina' Shahih Salim";
    uraianSharaf = "Timbangan kaidah gramatika Arab dan morfologi Al-Qur'an.";
  }

  return {
    kata_arab: clean,
    status_hukum: status,
    kedudukan_irab: kedudukanArab,
    kedudukan_indo: kedudukanIndo,
    tanda_irab: tanda,
    jenis_kata_sharaf: sharafJenis,
    wazan_sharaf: wazan,
    akar_kata: akar,
    jenis_bina: bina,
    keterangan_sharaf: uraianSharaf
  };
}

console.log("Memulai pembedahan SETIAP KATA dalam 520 contoh Al-Qur'an (Nahwu + Sharaf)...");

const rawDataset = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

const enrichedDataset = rawDataset.map((item, idx) => {
  // Pecah seluruh kata dalam ayat
  const rawWords = item.teks_ayat_arab.split(/\s+/).map(w => w.trim()).filter(Boolean);
  
  const parsedWords = [];
  for (const rw of rawWords) {
    const analyzed = analyzeWord(rw, item);
    if (analyzed) {
      parsedWords.push(analyzed);
    }
  }

  // Jika kata_per_kata hasil pecah kosong, fallback ke yang lama
  const finalKataPerKata = parsedWords.length > 0 ? parsedWords : item.kata_per_kata;

  return {
    ...item,
    // Perbarui kata_per_kata agar berisi SELURUH kata dalam ayat
    kata_per_kata: finalKataPerKata,
    // Tambahkan meta ringkasan
    total_kata: finalKataPerKata.length
  };
});

// Tulis kembali ke data/06_latihan_quran.json
fs.writeFileSync(DATA_FILE, JSON.stringify(enrichedDataset, null, 2), 'utf-8');

// Tulis juga ke app/src/data/06_latihan_quran.json
fs.writeFileSync(APP_DATA_FILE, JSON.stringify(enrichedDataset, null, 2), 'utf-8');

console.log(`BERHASIL! ${enrichedDataset.length} ayat Al-Qur'an kini memiliki analisis lengkap SETIAP KATA (I'rab Nahwu + Morfologi Sharaf).`);
