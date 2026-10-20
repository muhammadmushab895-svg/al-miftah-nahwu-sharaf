// Bank Data Penjelasan Ramah Pemula & Orang Awam
// Dirancang dengan analogi logika bahasa Indonesia sehari-hari, rumus cepat 3 detik, dan checklist praktis
// Selaras 100% dengan struktur 42 Bab Kurikulum An-Nahwu At-Tathbiqi & Jami'ud Durus

export const penjelasanAwamPerBab = {
  // =========================================================================
  // PILAR 1: FONDASI KALAM & MORFOLOGI SHARAF (BAB 1 - 14)
  // =========================================================================

  'BAB-01': {
    judul_santai: 'Pondasi Bahasa Arab: Apa itu Kalimat dan Jenis-Jenis Kata?',
    analogi: 'Bayangkan Anda sedang menyusun lego atau gerbong kereta api. Kalau Anda cuma meletakkan satu roda, atau cuma bilang "Budi yang tinggi itu...", orang yang mendengar pasti bengong menunggu: "Terus kenapa Budi?". Nah, di bahasa Arab, ungkapan baru sah disebut "Kalam" kalau sudah tuntas dan orang tidak lagi bertanya-tanya, seperti "Budi sudah sarapan".',
    rumus_tiga_detik: 'Kalam = Minimal 2 kata + Mengandung info tuntas (Subjek + Predikat) + Bahasa Arab.',
    checklist_pemula: [
      { tanya: 'Apakah bersuara huruf Arab?', ya: 'Ya, bukan isyarat tangan atau tulisan mati.' },
      { tanya: 'Apakah tersusun dari minimal 2 kata?', ya: 'Bisa tampak dua kata (Al-Ilmu Nurun), atau perintah satu kata tapi ada kata "kamu" tersembunyi (Qum = Berdirilah kamu!).' },
      { tanya: 'Apakah orang yang mendengar sudah paham dan tidak menunggu kelanjutannya?', ya: 'Jika masih menggantung seperti "Jika kamu rajin...", itu belum Kalam.' }
    ],
    tips_anti_bingung: 'Jangan tertukar antara Kalimah dan Kalam! Di bahasa Indonesia, "Kalimat" adalah susunan panjang. Tapi di bahasa Arab terbalik: "Kalimah" justru artinya SATU KATA, sedangkan rangkaian kalimat lengkap disebut "KALAM".',
    contoh_analogi_kalimat: [
      { arab: 'العِلْمُ نُورٌ', indo: 'Ilmu itu cahaya', status: 'Kalam Sah (Lengkap Subjek + Info)', tipe: 'kalam' },
      { arab: 'إِنْ جَاءَ عَلِيٌّ...', indo: 'Jika Ali datang...', status: 'Belum Kalam (Menggantung, nunggu kelanjutan)', tipe: 'bukan_kalam' },
      { arab: 'قُمْ', indo: 'Berdirilah!', status: 'Kalam Sah (Tersusun dari kata kerja + kamu)', tipe: 'kalam' }
    ]
  },

  'BAB-02': {
    judul_santai: 'Al-Mizan Ash-Sharfi: Cetakan Kue dan 7 Bentuk Kata Kerja',
    analogi: 'Kalau Nahwu adalah polisi lalu lintas yang mengatur harakat buntut kata di jalan raya kalimat, maka Sharaf adalah koki pembuat kue! Koki punya cetakan timbangan standar: Fa\' - \'Ain - Lam (فـ - عـ - لـ). Dari 1 cetakan dasar (misal: K-T-B = Tulis), koki bisa mencetak kue "Kataba" (telah nulis), "Yaktubu" (sedang nulis), "Kaatib" (penulis), "Maktabah" (perpustakaan), dan "Maktuub" (surat)!',
    rumus_tiga_detik: 'Mizan Sharfi = Timbangan baku kata (Fa\'ala). Huruf asli diukur dengan F-A-L, huruf tambahan disalin apa adanya.',
    checklist_pemula: [
      { tanya: 'Berapa huruf akar kata asli bahasa Arab?', ya: '95% kata bahasa Arab berakar dari 3 huruf konsonan asli (Fa\', \'Ain, Lam).' },
      { tanya: 'Apa itu 7 Pembagian Bina\'?', ya: 'Klasifikasi kata kerja berdasarkan ada tidaknya huruf lemah (Wawu/Ya\'/Alif), tasydid, atau hamzah.' }
    ],
    tips_anti_bingung: 'Nahwu hanya mengurus bunyi SATU HURUF TERAKHIR. Sharaf mengurus bentuk dan harakat SELURUH BADAN KATA dari huruf pertama sampai sebelum terakhir.',
    contoh_analogi_kalimat: [
      { arab: 'فَعَلَ ← كَتَبَ', indo: 'Pola Fa\'ala -> Kataba (Menimbang huruf asli 3 huruf)', tipe: 'mizan' },
      { arab: 'فَاعِلٌ ← كَاتِبٌ', indo: 'Pola Faa\'il -> Kaatib (Tambahan huruf Alif disalin persis)', tipe: 'mizan' }
    ]
  },

  'BAB-03': {
    judul_santai: 'Fi\'il Mujarrad & Mazid: Kata Kerja Polos vs Modifikasi Variasi',
    analogi: 'Bayangkan kaos polos standar tanpa motif (ini Fi\'il Mujarrad / kata kerja murni 3 huruf). Ketika kaos itu diberi saku, kerah, kancing, dan bordir (ini Fi\'il Mazid / ditambah 1, 2, atau 3 huruf), fungsinya langsung naik kelas! Contoh: \'Alima (Tahu) -> ditambah tasydid jadi \'Allama (Mengajari orang lain) -> ditambah Alif-Sin-Ta\' jadi Ista\'lama (Mencari tahu / investigasi).',
    rumus_tiga_detik: 'Mujarrad = Polos 3 huruf asli. Mazid = Ditambah 1-3 huruf ekstra untuk melahirkan variasi makna baru.',
    checklist_pemula: [
      { tanya: 'Berapa wazan dasar Mujarrad 3 huruf?', ya: 'Ada 6 bab utama (Fa\'ala-Yaf\'ulu, Fa\'ala-Yaf\'ilu, Fa\'ala-Yaf\'alu, dst).' },
      { tanya: 'Apa faedah menambah huruf?', ya: 'Bisa mengubah makna menjadi: membuat orang lain melakukan (Ta\'diyah), saling berbuat (Musyarakah), atau memohon (Thalab).' }
    ],
    tips_anti_bingung: 'Kaidah emas ulama Arab: "Ziyadatul Mabna Tadullu \'ala Ziyadatil Ma\'na" (Setiap ada penambahan huruf pada struktur kata, pasti ada pertambahan bobot makna!).',
    contoh_analogi_kalimat: [
      { arab: 'غَفَرَ ← اسْتَغْفَرَ', indo: 'Mengampuni -> Memohon ampunan (Tambahan Ista- bermakna memohon)', tipe: 'mazid' },
      { arab: 'قَتَلَ ← قَاتَلَ', indo: 'Membunuh -> Berperang saling bunuh (Tambahan Alif bermakna saling)', tipe: 'mazid' }
    ]
  },

  'BAB-04': {
    judul_santai: 'Fi\'il Jamid vs Mutasharrif & Lazim vs Muta\'addi: Fleksibilitas & Objek',
    analogi: 'Kata kerja ada dua tipe kelenturan: Ada yang selincah pesenam akrobatik bisa berubah ke masa lampau, sekarang, dan perintah (Mutasharrif), tapi ada yang kaku seperti patung batu selamanya cuma punya 1 bentuk (Jamid, seperti Laisa & \'Asa). Lalu dari segi sasaran: ada perbuatan yang cuma butuh pelaku sendiri seperti "Duduk" (Lazim), tapi ada aksi yang wajib punya korban sasaran seperti "Memukul" (Muta\'addi).',
    rumus_tiga_detik: 'Mutasharrif = Bisa ganti waktu. Jamid = Patung kaku. Lazim = Tanpa korban. Muta\'addi = Wajib butuh korban (Maf\'ul Bih).',
    checklist_pemula: [
      { tanya: 'Apakah kata kerja ini bisa dibuat fi\'il amr (perintah)?', ya: 'Jika bisa -> Mutasharrif. Jika tidak pernah ada bentuk perintahnya -> Jamid.' },
      { tanya: 'Apakah kalimat langsung tuntas tanpa menyebut objek?', ya: '"Zaid tersenyum" -> Lazim. "Zaid memakan..." (pasti butuh apa yang dimakan) -> Muta\'addi.' }
    ],
    tips_anti_bingung: 'Kata kerja Lazim (tanpa objek) bisa disulap jadi Muta\'addi (butuh objek) dengan menambahkan Hamzah di awal (Kharaja = keluar -> Akhraja = mengeluarkan) atau mentasydidkan huruf tengah.',
    contoh_analogi_kalimat: [
      { arab: 'قَامَ زَيْدٌ', indo: 'Zaid berdiri (Lazim, kalimat tuntas tanpa butuh korban)', tipe: 'lazim' },
      { arab: 'أَكَلَ زَيْدٌ التُّفَّاحَةَ', indo: 'Zaid memakan apel (Muta\'addi, butuh korban objek apel berharakat fathah)', tipe: 'mutaaddi' }
    ]
  },

  'BAB-05': {
    judul_santai: 'Isnad Fi\'il Shahih ke Dhamir: Menghubungkan Kata Kerja dengan Pelaku',
    analogi: 'Bayangkan kata kerja sehat tanpa cacat (Shahih) sedang menggandeng para penumpang kereta kata ganti (Dhamir: Saya, Kamu, Kami, Mereka). Kalau kata kerjanya punya huruf kembar bertasydid seperti Madda (membentangkan), saat ketemu penumpang bersuara (Ta\' Fa\'il: Tu, Ta, Ti), tasydidnya harus dibongkar menjadi dua huruf terpisah: Madadtu (Saya telah membentangkan)!',
    rumus_tiga_detik: 'Mudha\'af (huruf kembar) + Dhamir bersuara (Tu/Na/Niswah) = Tasydid WAJIB DIBONGKAR (Fakkul Idgham).',
    checklist_pemula: [
      { tanya: 'Apa itu fi\'il shahih?', ya: 'Kata kerja yang bebas dari huruf penyakit (Alif, Wawu, Ya\'). Terbagi jadi Salim, Mahmuz (ada hamzah), dan Mudha\'af (ada tasydid).' },
      { tanya: 'Kapan tasydid dipertahankan?', ya: 'Saat bersambung dengan dhamir mati seperti Wawu Jama\'ah: Madduu (Mereka membentangkan).' }
    ],
    tips_anti_bingung: 'Jangan bingung saat membaca "Radadtu" di Al-Qur\'an, asalnya adalah "Radda" yang tasydidnya dibongkar karena bersambung dengan "Tu" (Saya).',
    contoh_analogi_kalimat: [
      { arab: 'مَدَّ ← مَدَدْتُ', indo: 'Madda (Dia membentangkan) -> Madadtu (Saya membentangkan, tasydid dibongkar)', tipe: 'isnad' },
      { arab: 'كَتَبَ ← كَتَبُوا', indo: 'Kataba -> Katabuu (Bersambung dengan Wawu Jama\'ah)', tipe: 'isnad' }
    ]
  },

  'BAB-06': {
    judul_santai: 'Isnad Fi\'il Mu\'tal ke Dhamir: Kata Kerja Huruf Lemah yang Sensitif',
    analogi: 'Huruf Alif, Wawu, dan Ya\' itu seperti orang yang sedang sakit flu berat: gampang lemas dan mudah mengalah! Saat kata kerja yang punya huruf lemah di tengah seperti Qaala (Berkata) atau di ujung seperti Da\'aa (Berdoa) disambung dengan kata ganti, huruf lemah itu sering kali lenyap atau berubah kembali ke wujud aslinya: Qaala -> Qultu (Alif-nya mengalah dibuang!), Da\'aa -> Da\'awtu (Alif kembali jadi Wawu).',
    rumus_tiga_detik: 'Fi\'il Ajwaf (lemah di tengah) + Ta\' Fa\'il = Huruf tengah DIBUANG (Qultu, Shumlu, Bitu).',
    checklist_pemula: [
      { tanya: 'Di mana posisi huruf lemah?', ya: 'Di depan (Mitsal: Wa\'ada), di tengah (Ajwaf: Qaala), di ujung (Naqish: Ramaa), atau ganda (Lafif).' },
      { tanya: 'Mengapa huruf tengahnya hilang?', ya: 'Karena terjadi pertemuan dua sukun (Iltiqa\'us Sakinain) yang terlarang dalam fonologi bahasa Arab.' }
    ],
    tips_anti_bingung: 'Harakat huruf depan pada Ajwaf ditentukan oleh wazan mudhari\'-nya: Jika mudhari\'-nya dhommah (YaqUulu) -> maka QUltu. Jika kasrah (YabI\'u) -> maka BItu.',
    contoh_analogi_kalimat: [
      { arab: 'قَالَ ← قُلْتُ', indo: 'Dia berkata -> Aku berkata (Huruf alif tengah dibuang jadi Qultu)', tipe: 'ajwaf' },
      { arab: 'دَعَا ← دَعَوْتُ', indo: 'Dia berdoa -> Aku berdoa (Alif kembali ke asalnya yaitu Wawu: Da\'awtu)', tipe: 'naqish' }
    ]
  },

  'BAB-07': {
    judul_santai: 'Nun Taukid: Memberi Stempel Garansi 100% pada Kata Kerja',
    analogi: 'Bayangkan Anda berjanji: "Saya akan datang". Orang mungkin masih ragu 50%. Tapi kalau Anda menambahkan Nun Taukid bertasydid (نَّ), itu sama seperti Anda bersumpah di atas materai sepuluh ribu: "Demi Allah, sungguh-sungguh 1000% saya PASTI akan datang!". Fi\'il perintah boleh bebas diberi Nun ini, tapi fi\'il lampau HARAM dimasuki karena peristiwanya sudah lewat.',
    rumus_tiga_detik: 'Nun Taukid (نَّ berat / نْ ringan) = Penegas mutlak "PASTI/SUNGGUH". Mengunci harakat akhir fi\'il mudhari\' jadi Fathah.',
    checklist_pemula: [
      { tanya: 'Kapan fi\'il mudhari\' wajib diberi Nun Taukid?', ya: 'Saat berada dalam kalimat sumpah (Demi Allah), bersambung dengan huruf Lam, dan bermakna masa depan.' },
      { tanya: 'Apa efeknya pada fi\'il mudhari\'?', ya: 'Fi\'il mudhari\' yang tadinya mu\'rab (fleksibel) langsung MABNI (kebal) berharakat Fathah.' }
    ],
    tips_anti_bingung: 'Ayat Al-Qur\'an "Kalla layunbadzanna fil huthamah": kata Yunbadza berharakat fathah karena digembok oleh Nun Taukid Tsaqilah (نَّ)!',
    contoh_analogi_kalimat: [
      { arab: 'وَتَاللهِ لَأَكِيدَنَّ أَصْنَامَكُم', indo: 'Demi Allah, sungguh-sungguh pasti akan kulakukan tipu daya terhadap berhalamu (Wajib Taukid)', tipe: 'taukid_fiil' },
      { arab: 'اِكْتُبَنَّ الدَّرْسَ', indo: 'Tulislah pelajaran ini benar-benar! (Fi\'il Amr boleh diberi Nun Taukid)', tipe: 'amr_taukid' }
    ]
  },

  'BAB-08': {
    judul_santai: 'Mashdar: Induk Seluruh Kata Benda Verbal dan Kedahsyatan Kerjanya',
    analogi: 'Menurut ulama Bashrah, Mashdar adalah "Ibu Kandung" yang melahirkan seluruh kata dalam bahasa Arab! Kata kerja (telah makan, sedang makan) punya ikatan waktu, tapi Mashdar (aktivitas makan) murni nama perbuatannya tanpa terikat jam dan tanggal. Yang menakjubkan, meski dia kata benda, dia masih punya DNA kata kerja sehingga bisa punya objek (Maf\'ul Bih) sendiri!',
    rumus_tiga_detik: 'Mashdar = Nama perbuatan murni (Tindakan). Bisa beramal seperti kata kerja asalnya (bisa punya objek).',
    checklist_pemula: [
      { tanya: 'Bagaimana cara menemukan mashdar?', ya: 'Sebutkan tasyrif ketiga: Kataba - Yaktubu - KITABATAN (Kitabah adalah mashdarnya).' },
      { tanya: 'Apakah mashdar bisa bertanwin atau ber-Al?', ya: 'Bisa, karena mashdar adalah 100% isim (kata benda).' }
    ],
    tips_anti_bingung: 'Jangan tertukar antara Mashdar dan Isim Mashdar! Mashdar hurufnya lengkap sesuai fi\'ilnya (Kallama -> Takliiman). Isim Mashdar hurufnya ada yang hilang (Kallama -> Kalaaman).',
    contoh_analogi_kalimat: [
      { arab: 'إِطْعَامٌ فِي يَوْمٍ ذِي مَسْغَبَةٍ يَتِيمًا', indo: 'Memberi makan (Mashdar) pada hari kelaparan kepada anak yatim (Yatiiman = Objek dari mashdar It\'am)', tipe: 'amal_mashdar' },
      { arab: 'ضَرْبُ زَيْدٍ عَمْرًا', indo: 'Pemukulan Zaid (Pelaku) terhadap Amr (Korban berharakat Fathah)', tipe: 'amal_mashdar' }
    ]
  },

  'BAB-09': {
    judul_santai: 'Isim Fa\'il, Shighah Mubalaghah & Isim Maf\'ul: Kartu Tanda Pelaku & Korban',
    analogi: 'Di dunia kata turunan ada 3 kartu peran: 1) Isim Fa\'il = Kartu Pelaku (Kaatib = Penulis), 2) Shighah Mubalaghah = Pelaku Super Spesialis yang berkali-kali lipat luar biasa (Ghaffaar = Maha Pengampun berulang kali), 3) Isim Maf\'ul = Kartu Korban Penderita yang dikenai aksi (Maktuub = Yang Tertulis / Ditulis). Semuanya bisa beramal seperti kata kerjanya!',
    rumus_tiga_detik: 'Pelaku 3 huruf = Wazan Faa\'il (ـَـاـِـ). Korban 3 huruf = Wazan Maf\'uul (مَـْـُـوـ). Super Hebat = Fa\'\'aal / Fa\'uul.',
    checklist_pemula: [
      { tanya: 'Bagaimana bentuk pelaku untuk kata >3 huruf?', ya: 'Ganti huruf mudhari\' jadi Mim dhommah (Mu-) dan kasrahkan huruf sebelum akhir: Mukh-li-sh (Orang ikhlas).' },
      { tanya: 'Bagaimana bentuk korban untuk kata >3 huruf?', ya: 'Ganti huruf mudhari\' jadi Mim dhommah (Mu-) dan fathahkan huruf sebelum akhir: Mukh-la-sh (Orang yang diselamatkan/diikhlaskan).' }
    ],
    tips_anti_bingung: 'Isim Maf\'ul bekerja seperti Fi\'il Pasif! Jadi kata setelah Isim Maf\'ul statusnya BUKAN Fa\'il, melainkan NA\'IBUL FA\'IL (berharakat Dhommah).',
    contoh_analogi_kalimat: [
      { arab: 'رَبَّنَا أَخْرِجْنَا مِنْ هَٰذِهِ الْقَرْيَةِ الظَّالِمِ أَهْلُهَا', indo: '...desa yang zhalim (Isim Fa\'il) penduduknya (Ahluha = Pelaku dari sifat zhalim)', tipe: 'amal_isim_fail' },
      { arab: 'مَحْمُودٌ سِيرَتُهُ', indo: 'Terpuji (Isim Maf\'ul) riwayat hidupnya (Siiratuhu = Na\'ibul Fa\'il)', tipe: 'amal_isim_maful' }
    ]
  },

  'BAB-10': {
    judul_santai: 'Shifat Musyabbahah, Isim Tafdhil, Zaman/Makan & Isim Alat: Aneka Cetakan Khusus',
    analogi: 'Bayangkan 4 perkakas bahasa: 1) Shifat Musyabbahah = Karakter permanen bawaan lahir (Ganteng, Penakut, Haus, Hitam), 2) Isim Tafdhil = Cetakan juara "Paling / Lebih" (Akbar = Lebih Besar), 3) Isim Zaman/Makan = Cetakan penunjuk waktu & tempat (Masjid = Tempat sujud), 4) Isim Alat = Cetakan perkakas alat kerja (Miftaah = Kunci, Miqashsh = Gunting).',
    rumus_tiga_detik: 'Tafdhil = Wazan Af\'alu (Lebih/Paling). Tempat = Wazan Maf\'al/Maf\'il. Alat = Wazan Mif\'al/Mif\'aal.',
    checklist_pemula: [
      { tanya: 'Apa beda Isim Fa\'il dengan Shifat Musyabbahah?', ya: 'Isim Fa\'il sifatnya temporer/sementara (Qo-im = sedang berdiri). Shifat Musyabbahah melekat permanen (Hasan = berwajah tampan).' },
      { tanya: 'Berapa syarat membentuk Isim Tafdhil?', ya: 'Ada 7 syarat ketat (harus 3 huruf, positif, bisa diperbandingkan, bukan warna/cacat).' }
    ],
    tips_anti_bingung: 'Kalau mau bilang "lebih hitam" atau "lebih tampan dari fi\'il >3 huruf", tidak boleh langsung bilang Af\'alu, tapi pakai kata bantu: Asyaddu Sawadan (Lebih pekat hitamnya)!',
    contoh_analogi_kalimat: [
      { arab: 'اللهُ أَكْبَرُ', indo: 'Allah Maha Besar (Akbaru = Isim Tafdhil)', tipe: 'tafdhil' },
      { arab: 'مَكْتَبٌ وَ مِفْتَاحٌ', indo: 'Meja tulis (Tempat) dan Kunci (Alat pembuka)', tipe: 'zaman_alat' }
    ]
  },

  'BAB-11': {
    judul_santai: 'Isim Maqshur, Manqush, dan Mamdud: Trio Kata Benda Berujung Huruf Khusus',
    analogi: 'Ada 3 bersaudara kata benda dengan ujung unik: 1) Maqshur = Ujungnya Alif bengkok (Musa, Al-Huda). Dia kaku 100%, semua harakatnya sembunyi ghaib (Muqaddarah)! 2) Manqush = Ujungnya Ya\' bebek (Al-Qadhi). Kalau tanpa Alif Lam, huruf Ya\'-nya copot dan diganti tanwin (Qadh-in)! 3) Mamdud = Ujungnya Alif panjang + Hamzah (Shahra\' = Padang pasir).',
    rumus_tiga_detik: 'Maqshur (Alif) = Semua harakat sembunyi. Manqush (Ya\') = Dhommah/Kasrah sembunyi, Fathah tampak nyata. Mamdud (ـَاء).',
    checklist_pemula: [
      { tanya: 'Bagaimana mengi\'rab kata "Musa"?', ya: 'Selalu diakhiri dengan Dhommah/Fathah/Kasrah Muqaddarah (dikira-kirakan karena mustahil berbunyi/Ta\'adzdur).' },
      { tanya: 'Kapan huruf Ya\' pada Manqush hilang?', ya: 'Saat berstatus Rafa\' atau Jar dan tidak ada Al- (Ja\'a Qadhin, Marartu bi Qadhin).' }
    ],
    tips_anti_bingung: 'Hanya harakat FATHAH yang sanggup muncul terang-terangan di ujung Isim Manqush (seperti: Ra-aitu Al-Qadhiya), karena fathah adalah harakat paling ringan bagi lidah manusia.',
    contoh_analogi_kalimat: [
      { arab: 'قَالَ مُوسَىٰ', indo: 'Musa berkata (Fa\'il Marfu\' dengan Dhommah Muqaddarah pada alif)', tipe: 'maqshur' },
      { arab: 'حَكَمَ القَاضِي عَلَى الجَانِي', indo: 'Hakim menghukum pelaku kejahatan (Manqush)', tipe: 'manqush' }
    ]
  },

  'BAB-12': {
    judul_santai: 'Mudzakkar-Muannats & Jama\' Taksir: Gender dan Kereta Rombongan Pecah Pola',
    analogi: 'Bahasa Arab membagi segala kata menjadi Maskulin (Mudzakkar) atau Feminin (Muannats). Untuk jamak orang banyak yang pecah pola (Jamak Taksir), ada dua kasta: 1) Jumu\'ul Qillah = Bus mini kapasitas hemat khusus 3 sampai 10 orang (hanya punya 4 wazan sakti), 2) Jumu\'ul Katsrah = Kereta raksasa kapasitas 11 sampai tak terhingga!',
    rumus_tiga_detik: '4 Wazan Mini (3-10): Af\'ul, Af\'aal, Af\'ilah, Fi\'lah. Selain itu = Jamak Katsrah (banyak tak terhingga).',
    checklist_pemula: [
      { tanya: 'Apa tanda muannats paling umum?', ya: 'Ta\' Marbuthah (ة), Alif Maqshurah (ى), dan Alif Mamdudah (اء).' },
      { tanya: 'Apakah benda mati bisa muannats?', ya: 'Bisa! Disebut Muannats Majazi, seperti Matahari (Syams), Bumi (Ardh), dan Api (Nar).' }
    ],
    tips_anti_bingung: 'Kaidah emas Arab: "Kullu Jam\'in Mu\'annats" (Semua jamak benda mati yang tidak berakal diperlakukan seperti perempuan tunggal / Muannats Mufradah)! Misal: Al-Kutubu Jamilatun (Buku-buku itu cantik).',
    contoh_analogi_kalimat: [
      { arab: 'ثَلَاثَةُ أَنْهُرٍ', indo: 'Tiga sungai (Wazan Af\'ul menunjukkan hitungan hemat 3-10)', tipe: 'jamak_qillah' },
      { arab: 'هَٰذِهِ دِيَارُهُمْ', indo: 'Ini adalah kampung halaman mereka (Diyar jamak benda mati, kata tunjuknya Hadzihi muannats)', tipe: 'kullu_jam_muannats' }
    ]
  },

  'BAB-13': {
    judul_santai: 'At-Tashghir & An-Nasab: Panggilan Mungil Sayang dan Stempel Asal Usul',
    analogi: 'Tashghir itu seperti filter imut kamera! Kata benda standar dikecilkan wazannya menjadi Fu\'ail untuk menunjukkan rasa sayang manja ("Anakku tersayang" / Bunayya), ukuran mungil ("Gunung kecil" / Jubail), atau waktu yang amat dekat ("Tepat sesaat sebelum maghrib"). Sedangkan Nasab adalah stempel bendera kebangsaan atau marga dengan menambahkan Ya\' bertasydid di ujung (Indonesia -> Indonesiyy)!',
    rumus_tiga_detik: 'Tashghir = Wazan Fu\'ail (Imut/Kecil/Sayang). Nasab = Tambah Ya\' Bertasydid di ujung (-iyy penunjuk asal).',
    checklist_pemula: [
      { tanya: 'Berapa wazan Tashghir?', ya: 'Ada 3 wazan qiyasi: Fu\'ail (3 huruf), Fu\'ai\'il (4 huruf), dan Fu\'ai\'iil (5 huruf).' },
      { tanya: 'Apa yang terjadi pada ta\' marbuthah saat dinasabkan?', ya: 'Wajib dibuang! Makkah -> Makkiyy (bukan Makkatiyy).' }
    ],
    tips_anti_bingung: 'Kata "Qurasyiyy" artinya dinisbatkan kepada suku Quraisy. Huruf Ya\' di ujungnya bukan Ya\' kata ganti "milikku", melainkan Ya\'un Nasab yang berharakat dan bertasydid.',
    contoh_analogi_kalimat: [
      { arab: 'يَا بُنَيَّ لَا تُشْرِكْ بِاللَّهِ', indo: 'Wahai anak mungilku tercinta (Tashghir dari Ibnun -> Bunayya)', tipe: 'tashghir' },
      { arab: 'عَالِمٌ مَكِّيٌّ مِصْرِيٌّ', indo: 'Ulama berkebangsaan Makkah dan berdarah Mesir (Nasab)', tipe: 'nasab' }
    ]
  },

  'BAB-14': {
    judul_santai: 'I\'lal, Ibdal, Idgham & Waqaf: Operasi Bedah Keindahan Suara Bahasa Arab',
    analogi: 'Lidah orang Arab sangat anti keseleo atau mengucapkan bunyi yang berat! Makanya ada 4 operasi bedah fonetik: 1) I\'lal = Menukar huruf lemah yang bikin pegal lidah jadi Alif (Qawala -> Qaala), 2) Ibdal = Menukar huruf Ta\' timbangan jadi Tha\' agar seirama dengan huruf tebal (Idh-taraba), 3) Idgham = Melebur dua huruf kembar jadi bertasydid (Madd-da), 4) Waqaf = Teknik pengereman suara saat berhenti membaca.',
    rumus_tiga_detik: 'I\'lal = Ganti/buang huruf sakit (Wawu/Ya\'). Ibdal = Ganti huruf sehat agar selaras. Idgham = Peleburan tasydid.',
    checklist_pemula: [
      { tanya: 'Mengapa kata "Qaala" aslinya "Qawala"?', ya: 'Karena huruf Wawu berharakat dan huruf sebelumnya berharakat Fathah, lidah Arab otomatis mengubahnya menjadi Alif.' },
      { tanya: 'Apa hukum utama saat berhenti (Waqaf)?', ya: 'Bahasa Arab tidak pernah memulai dengan sukun dan tidak pernah berhenti pada huruf berharakat (harus disukunkan!).' }
    ],
    tips_anti_bingung: 'Jangan panik dengan rumus rumit I\'lal. Kuncinya sederhana: semua kaidah ini diciptakan murni untuk membuat ucapan lisan menjadi RINGAN dan MERDU saat dilantunkan!',
    contoh_analogi_kalimat: [
      { arab: 'قَالَ (أَصْلُهُ: قَوَلَ)', indo: 'Qawala di-i\'lal menjadi Qaala agar ringan diucapkan', tipe: 'ilal' },
      { arab: 'اضْطَرَبَ (أَصْلُهُ: اضْتَرَبَ)', indo: 'Idhtaraba di-ibdal Ta\'-nya menjadi Tha\' agar selaras dengan huruf Dhad', tipe: 'ibdal' }
    ]
  },

  // =========================================================================
  // PILAR 2: GERBANG I'RAB & BINA' (BAB 15 - 21)
  // =========================================================================

  'BAB-15': {
    judul_santai: 'I\'rab vs Bina\': Mengapa Huruf Terakhir Kata Arab Harakatnya Berubah-ubah?',
    analogi: 'Bayangkan seseorang bernama Ahmad. Saat dia di rumah sebagai Ayah, dia pakai kaos santai. Saat dia ke kantor polisi sebagai Polisi, dia pakai seragam dinas polisi. Saat dia main bola, dia pakai jersey. Orangnya tetap Ahmad, tapi "baju seragamnya" berganti sesuai perannya! Di bahasa Arab, kata yang harakat buntutnya bisa berganti baju seragam disebut "Mu\'rab", sedangkan kata yang kaku seperti patung batu tidak pernah ganti baju disebut "Mabni".',
    rumus_tiga_detik: 'Mu\'rab = Huruf buntut bisa dhommah/fathah/kasrah tergantung jabatan. Mabni = Kebal, harakat buntutnya terkunci mati selamanya.',
    checklist_pemula: [
      { tanya: 'Apakah kata ini bisa berganti harakat akhir?', ya: 'Hampir semua kata benda (Isim) dan kata kerja sedang/akan (Fi\'il Mudhari\') adalah Mu\'rab.' },
      { tanya: 'Apa saja kata yang kebal/terkunci (Mabni)?', ya: 'Kata ganti (Dia, Kamu, Saya), kata tunjuk (Ini, Itu), kata sambung (Di, Ke, Dari), dan kata kerja lampau/perintah.' }
    ],
    tips_anti_bingung: 'Harakat yang berubah di ilmu Nahwu HANYA huruf paling terakhir! Huruf depan dan tengah kata itu urusan ilmu Sharaf (timbangan kata), bukan urusan Nahwu.',
    contoh_analogi_kalimat: [
      { arab: 'جَاءَ زَيْدٌ', indo: 'Zaid datang (Zaid = Pelaku, seragamnya Dhommah)', tipe: 'marfu' },
      { arab: 'رَأَيْتُ زَيْدًا', indo: 'Saya melihat Zaid (Zaid = Korban/Objek, seragamnya Fathah)', tipe: 'manshub' },
      { arab: 'مَرَرْتُ بِزَيْدٍ', indo: 'Saya berpapasan dengan Zaid (Kena kata sambung Bi, seragamnya Kasrah)', tipe: 'majrur' }
    ]
  },

  'BAB-16': {
    judul_santai: 'Tanda I\'rab Far\'iyyah: Sistem Voucher Huruf Pengganti Harakat',
    analogi: 'Kalau harakat asli (Dhommah, Fathah, Kasrah) adalah uang tunai koin receh standar, maka tanda Far\'iyyah adalah voucher belanja bernilai khusus! Ketika bendanya ada 2 (Mutsanna), jamak rombongan cowok (Una/Ina), rombongan cewek (Aat), atau nama 5 bangsawan (Asmaul Khamsah: Abu, Akhu), kasir bahasa Arab tidak memakai koin biasa, melainkan huruf Alif, Wawu, atau Ya\' sebagai pengganti resminya!',
    rumus_tiga_detik: 'Mutsanna = Alif/Ya\'. Jamak Cowok = Wawu/Ya\'. Asmaul Khamsah = Wawu/Alif/Ya\'. Jamak Cewek = Kasrah saat Nashab.',
    checklist_pemula: [
      { tanya: 'Apakah ada 2 orang/benda?', ya: 'Tanda Rafa\'nya huruf Alif (ـَانِ), Nashab & Jarr-nya huruf Ya\' (ـَيْنِ).' },
      { tanya: 'Apakah jamak laki-laki berakal?', ya: 'Tanda Rafa\'nya huruf Wawu (ـُونَ), Nashab & Jarr-nya huruf Ya\' (ـِينَ).' },
      { tanya: 'Apakah kata Abu, Akhu, Hamu, Fu, Dzu?', ya: 'Wajib bersambung ke kata lain agar berlaku rumus Wawu/Alif/Ya\' (Abuka, Abaka, Abika).' }
    ],
    tips_anti_bingung: 'Ingat! Nun di ujung Mutsanna (ـَانِ) selalu berharakat kasrah, sedangkan Nun di ujung Jamak Mudzakkar (ـُونَ) selalu berharakat fathah. Jangan sampai tertukar!',
    contoh_analogi_kalimat: [
      { arab: 'جَاءَ أَبُوكَ', indo: 'Ayahmu datang (Rafa\' tanda huruf Wawu)', tipe: 'asma_khamsah' },
      { arab: 'رَأَيْتُ أَبَاكَ', indo: 'Saya melihat ayahmu (Nashab tanda huruf Alif)', tipe: 'asma_khamsah' },
      { arab: 'مَرَرْتُ بِأَبِيكَ', indo: 'Saya berpapasan dengan ayahmu (Jar tanda huruf Ya\')', tipe: 'asma_khamsah' }
    ]
  },

  'BAB-17': {
    judul_santai: 'Nakirah & Ma\'rifah: Mengenal Orang Asing Anonim vs Tokoh VVIP Jelas',
    analogi: 'Nakirah itu seperti seseorang anonim yang memakai topeng: "Seorang pria misterius datang" (kita tidak tahu pria yang mana!). Sedangkan Ma\'rifah adalah tokoh VVIP yang identitas KTP dan wajahnya sudah 100% jelas: ada kata ganti (Dhamir: Saya, Kamu, Dia), nama orang/tempat (\'Alam: Muhammad, Makkah), atau kata biasa yang sudah diberi kartu tanda pengenal Alif Lam (Al-Kitab)!',
    rumus_tiga_detik: 'Nakirah = Umum bertanwin (Rojulun = seorang pria). Ma\'rifah = Jelas/Khusus (Dhamir, Nama, Ada Al-).',
    checklist_pemula: [
      { tanya: 'Apa tingkatan Ma\'rifah paling kuat?', ya: 'Dhamir (Kata Ganti) adalah raja makrifat nomor 1 paling spesifik, disusul Nama Diri (\'Alam).' },
      { tanya: 'Bagaimana mengubah nakirah jadi makrifat?', ya: 'Cukup tempelkan AL di depannya (Qalamun -> Al-Qalamu) atau sambungkan ke pemilik (Qalamu Zaidin).' }
    ],
    tips_anti_bingung: 'Kata benda yang sudah dipasangi Alif Lam (الـ) HARAM HUKUMNYA berbunyi Tanwin! Pilih salah satu: "Al-Kitabu" atau "Kitabun", tidak boleh "Al-Kitabun".',
    contoh_analogi_kalimat: [
      { arab: 'جَاءَ رَجُلٌ', indo: 'Seorang pria datang (Nakirah, siapa saja pria itu belum jelas)', tipe: 'nakirah' },
      { arab: 'جَاءَ الرَّجُلُ', indo: 'Pria tersebut datang (Ma\'rifah, orang yang sudah kita kenal bersama)', tipe: 'marifah' }
    ]
  },

  'BAB-18': {
    judul_santai: 'Isim Isyarah, Maushul & Mu\'arraf bi Al: Penunjuk Laser dan Jembatan Penghubung',
    analogi: 'Tiga pilar penjelas kata: 1) Isim Isyarah = Laser penunjuk jarak ("Ini dekat / Hadza", "Itu jauh / Dzalika"), 2) Isim Maushul = Kabel jembatan penyambung kata "Yang..." (Alladzi, Allati). Dia tidak bisa berdiri sendiri, wajib punya kalimat penjelas di belakangnya (Shilah Maushul)! 3) Mu\'arraf bi Al = Kata yang resmi menjadi jelas karena stempel Alif Lam.',
    rumus_tiga_detik: 'Isyarah = Tunjuk (Ini/Itu). Maushul = Yang (Alladzi). Shilah = Kalimat pelengkap setelah Maushul.',
    checklist_pemula: [
      { tanya: 'Apakah Isim Isyarah dan Maushul itu Mabni (kebal)?', ya: 'Ya, semuanya mabni kecuali bentuk mutsanna dua orang (Hadzaani/Hadzaini) yang mu\'rab.' },
      { tanya: 'Apa itu \'Aid dalam Shilah Maushul?', ya: 'Kata ganti penghubung di dalam anak kalimat yang merujuk kembali kepada isim maushul.' }
    ],
    tips_anti_bingung: 'Kata benda ber-Al yang terletak SETELAH Isim Isyarah (misal: "Hadza al-kitabu") berstatus BADAL (pengganti), bukan khabar! Jadi artinya "Buku ini...", belum tuntas kalimatnya.',
    contoh_analogi_kalimat: [
      { arab: 'هَٰذَا الكِتَابُ مُفِيدٌ', indo: 'Buku ini (Hadza + Al-Kitab) bermanfaat (Mufid = Khabarnya)', tipe: 'isyarah' },
      { arab: 'جَاءَ الَّذِي نَجَحَ', indo: 'Telah datang orang YANG telah lulus (Alladzi = Maushul, Najaha = Shilah)', tipe: 'maushul' }
    ]
  },

  'BAB-19': {
    judul_santai: 'Bina\' Fi\'il & Af\'alul Khamsah: Bentuk Kebal Kata Kerja & 5 Pendekar Sakti',
    analogi: 'Di dunia kata kerja, Fi\'il Madhi (lampau) dan Fi\'il Amr (perintah) adalah patung baja kebal (Mabni 100%) tidak pernah goyah harakatnya! Sebaliknya, Fi\'il Mudhari\' itu fleksibel (Mu\'rab). Namun ada "5 Pendekar Sakti" Fi\'il Mudhari\' (Af\'alul Khamsah: Yaktubani, Taktubani, Yaktubuna, Taktubuna, Taktubina) yang punya tanda rafa\' unik berupa huruf NUN!',
    rumus_tiga_detik: 'Madhi & Amr = Mabni mati. Mudhari\' biasa = Dhommah. Af\'al Khamsah = Ada Nun (Rafa\') / Hapus Nun (Nashab & Jazm).',
    checklist_pemula: [
      { tanya: 'Kapan Fi\'il Mudhari\' menjadi mabni (kebal)?', ya: 'Hanya di 2 kondisi: ketemu rombongan wanita (Nun Niswah) atau ketemu Nun Taukid penegas.' },
      { tanya: 'Apa itu Af\'alul Khamsah?', ya: 'Fi\'il mudhari\' yang di ujungnya menempel Alif Itsnain (berdua), Wawu Jama\'ah (mereka/kalian), atau Ya\' Mukhathabah (kamu wanita).' }
    ],
    tips_anti_bingung: 'Kalau Af\'alul Khamsah kemasukan huruf penashab atau penjazm (seperti Lam atau Lan), huruf NUN di ujungnya LANGSUNG DIBUANG (Hadzfun Nun)! Contoh: Lam yaktubuu (aslinya yaktubuuna).',
    contoh_analogi_kalimat: [
      { arab: 'المُسْلِمُونَ يَصُومُونَ', indo: 'Kaum muslimin berpuasa (Yashuumuuna = Rafa\' dengan tetapnya huruf Nun)', tipe: 'afal_khamsah' },
      { arab: 'لَنْ تَنَالُوا البِرَّ', indo: 'Kalian sekali-kali tidak akan meraih kebajikan (Tanaaluu = Nun-nya dibuang karena Lan)', tipe: 'hadzf_nun' }
    ]
  },

  'BAB-20': {
    judul_santai: 'Nawashibul Mudhari\': Pasukan Penashab yang Memfathahkan Kata Kerja',
    analogi: 'Fi\'il Mudhari\' normalnya santai berharakat Dhommah (Yaktubu = dia sedang nulis). Tapi begitu dihadang oleh "Pasukan Ranjau Fathah" (An, Lan, Kai, Idzan), kata kerja ini langsung tunduk patuh berharakat FATHAH (An Yaktuba)! Pasukan ini juga punya agen rahasia (An Mudhmarah) yang sembunyi di balik huruf Hatta (hingga) atau Lam Ta\'lil (supaya).',
    rumus_tiga_detik: 'An / Lan / Kai / Idzan / Hatta + Fi\'il Mudhari\' = WAJIB FATHAH ujungnya (Manshub)!',
    checklist_pemula: [
      { tanya: 'Apa arti Lan (لَنْ)?', ya: 'Tidak akan pernah (peniadaan masa depan secara tegas).' },
      { tanya: 'Di mana agen "An" sembunyi wajib?', ya: 'Setelah Lam Juhud (lam penyangkalan), Hatta, Fa\' Sababiyyah, dan Wawu Ma\'iyyah.' }
    ],
    tips_anti_bingung: 'Jangan tertukar antara Lam Ta\'lil (supaya, membuat mudhari\' fathah) dengan Lam Amr (perintah, membuat mudhari\' sukun jazm)!',
    contoh_analogi_kalimat: [
      { arab: 'لَنْ نَبْرَحَ عَلَيْهِ عَاكِفِينَ', indo: 'Kami tidak akan pernah beranjak... (Nabrah-a berharakat Fathah karena Lan)', tipe: 'nawashib' },
      { arab: 'فَرَجَعْنَاكَ إِلَىٰ أُمِّكَ كَيْ تَقَرَّ عَيْنُهَا', indo: '...supaya tenang hatinya (Taqarr-a berharakat Fathah karena Kai)', tipe: 'nawashib' }
    ]
  },

  'BAB-21': {
    judul_santai: 'Jawazimul Mudhari\' & Uslub Syarat: Rem Tangan Sukun dan Logika Sebab-Akibat',
    analogi: 'Ada amil rem tangan darurat yang bikin kata kerja langsung SUKUN mati (Jazm): kata peniadaan masa lalu "Lam" (Belum/Tidak) dan larangan "Laa" (Jangan!). Selain itu ada rumus "Sebab-Akibat" (Uslub Syarat): "Jika kamu berbuat A, maka kamu akan menuai B" (In tajtahid, tanjah). Alat syarat ini begitu sakti sampai menjazmkan DUA kata kerja sekaligus!',
    rumus_tiga_detik: 'Lam / Laa Nahiyah = Sukun 1 kata kerja. In / Man / Mahma (Syarat) = Sukunkan 2 kata kerja sekaligus!',
    checklist_pemula: [
      { tanya: 'Apa bedanya Lam (لَمْ) dan Lamma (لَمَّا)?', ya: 'Lam = tidak/belum. Lamma = belum sampai saat ini tapi diharapkan segera terjadi.' },
      { tanya: 'Bagaimana jazmnya kata kerja yang punya huruf lemah di ujung?', ya: 'Huruf lemahnya dipotong dibuang! Misal: Yad\'uu -> Lam Yad\'u (tanpa Wawu!).' }
    ],
    tips_anti_bingung: 'Bedakan Laa Nahiyah (Jangan! -> Menjazmkan kata kerja jadi sukun) dengan Laa Nafiyah (Tidak -> Cuma info biasa, kata kerja tetap dhommah). Misal: Laa ta-kul! (Jangan makan!) vs Laa ya-kulu (Dia tidak makan).',
    contoh_analogi_kalimat: [
      { arab: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', indo: 'Dia tidak beranak dan tidak diperanakkan (Yalid & Yuulad disukun oleh Lam)', tipe: 'jawazim' },
      { arab: 'إِنْ تَنْصُرُوا اللهَ يَنْصُرْكُمْ', indo: 'Jika kalian menolong agama Allah, niscaya Dia menolong kalian (Dua fi\'il disukunkan)', tipe: 'syarat_jazim' }
    ]
  },

  // =========================================================================
  // PILAR 3: AL-MARFU'AT & AN-NAWASIKH (BAB 22 - 28)
  // =========================================================================

  'BAB-22': {
    judul_santai: 'Mubtada\' dan Khabar: Pasangan Sejoli Pokok & Info Kalimat',
    analogi: 'Mubtada\' itu seperti "Judul Berita" atau "Topik Utama", sedangkan Khabar itu seperti "Isi Berita" atau penjelasnya. Mubtada\' adalah pembuka, dan Khabar adalah pahlawan yang datang menyempurnakan makna sehingga kalimat menjadi tuntas. Dua-duanya kompak bermahkota mulia Marfu\' (Dhommah)!',
    rumus_tiga_detik: 'Mubtada\' = Kata benda pokok di awal kalimat. Khabar = Jawaban dari pertanyaan "Ada apa dengan si Mubtada\'?".',
    checklist_pemula: [
      { tanya: 'Apakah kalimat diawali kata benda?', ya: 'Jika ya, itu namanya Jumlah Ismiyyah. Kata pertamanya adalah Mubtada\'.' },
      { tanya: 'Bagian mana yang melengkapi informasinya?', ya: 'Kata yang memberi kabar/kondisi si Mubtada\' itulah Khabar.' }
    ],
    tips_anti_bingung: 'Mubtada\' biasanya kata khusus/makrifat (ada Al-nya seperti "Al-Bustanu"), sedangkan Khabar biasanya umum/nakirah (ada tanwinnya seperti "Jamilun").',
    contoh_analogi_kalimat: [
      { arab: 'المَسْجِدُ قَرِيبٌ', indo: 'Masjid itu (Mubtada\') dekat (Khabar)', tipe: 'mubtada_khabar' }
    ]
  },

  'BAB-23': {
    judul_santai: 'Dinamika Mubtada\' & Khabar: Kapan Boleh Tukar Posisi atau Dihapus?',
    analogi: 'Mubtada\' dan Khabar biasanya tertib: Subjek dulu, baru Info. Tapi dalam kondisi darurat, Khabar boleh menyalip ke depan (Taqdimul Khabar), misalnya kalau infonya berupa keterangan tempat dan subjeknya nakirah ("Di dalam rumah ada seorang tamu" / Fid-dari dhaifun). Bahkan jika sudah sama-sama tahu, salah satunya boleh dirahasiakan (Hadzf)!',
    rumus_tiga_detik: 'Khabar keterangan tempat + Subjek umum (Nakirah) = KHABAR WAJIB DI DEPAN (Taqdim).',
    checklist_pemula: [
      { tanya: 'Kapan Khabar wajib di depan?', ya: 'Saat Khabar berupa kata tanya (Aina Zaidun?) atau Zharaf/Jar-Majrur dan Mubtada\'-nya nakirah.' },
      { tanya: 'Kapan Mubtada\' boleh dibuang?', ya: 'Dalam menjawab pertanyaan. Misal ditanya: "Siapa namamu?", cukup jawab: "Ali" (Mubtada\' \'Ismi\' dibuang).' }
    ],
    tips_anti_bingung: 'Ayat "Fashabrun jamiil" asalnya adalah "Shabri shabrun jamiil" (Kesabaranku adalah kesabaran yang indah). Subjek Mubtada\'-nya sengaja dibuang secara elegan!',
    contoh_analogi_kalimat: [
      { arab: 'فِي الدَّارِ رَجُلٌ', indo: 'Di dalam rumah (Khabar di depan) ada seorang pria (Mubtada\' di belakang)', tipe: 'taqdim_khabar' },
      { arab: 'فَصَبْرٌ جَمِيلٌ', indo: 'Maka kesabaran yang indah itulah sikapku (Mubtada\' mahdzuf)', tipe: 'hadzf_mubtada' }
    ]
  },

  'BAB-24': {
    judul_santai: 'Kaana & Saudaranya: Si Pengubah Keadaan (Was / Menjadi)',
    analogi: 'Mubtada\' dan Khabar asalnya hidup bahagia sama-sama Dhommah. Tiba-tiba datang "Geng Kaana" (Kaana, Ashbaha, Amatsa, Shara, Laisa). Kaana berkata: "Mubtada\', kamu tetap Dhommah dan sekarang jadi anak buahku (Isim Kaana). Tapi Khabar, kamu saya paksa ganti baju seragam jadi Fathah (Khabar Kaana)!".',
    rumus_tiga_detik: 'Kaana = Isimnya Marfu\' (Dhommah) + Khabarnya Manshub (Fathah). Artinya: Dahulu / Adalah / Menjadi.',
    checklist_pemula: [
      { tanya: 'Kapan Kaana masuk?', ya: 'Hanya masuk ke Jumlah Ismiyyah (Mubtada\' + Khabar) untuk mengubah konteks waktu menjadi lampau/proses.' },
      { tanya: 'Apa yang berubah?', ya: 'Khabarnya berubah harakat dari dhommah menjadi FATHAH.' }
    ],
    tips_anti_bingung: 'Kata Laisa (bukan/tidak) termasuk saudara kandung Kaana! Jadi rumusnya persis sama: isimnya marfu\', khabarnya wajib fathah (manshub).',
    contoh_analogi_kalimat: [
      { arab: 'كَانَ اللهُ غَفُورًا رَحِيمًا', indo: 'Allah (Isim Kaana, Dhommah) adalah Maha Pengampun (Khabar Kaana, Fathah)', tipe: 'kaana' },
      { arab: 'لَيْسَ النَّجَاحُ سَهْلًا', indo: 'Kesuksesan itu bukanlah perkara mudah (Sahlan = Khabar Laisa Manshub)', tipe: 'laisa' }
    ]
  },

  'BAB-25': {
    judul_santai: 'Kada & Saudaranya: Kata Kerja Harapan, Mulai, dan Nyaris Terjadi',
    analogi: 'Geng Kada itu sepupu dekat Kaana! Bedanya, geng Kada punya spesialisasi emosional: 1) Hampir saja celaka/nyaris (Muqarabah: Kada, Ausyaka), 2) Harapan doa semoga (Raja\': \'Asa, Hara), 3) Mulai beraksi (Syuru\': Syara\'a, Akhadza, Ja\'ala). Syarat mutlaknya: Khabar beritanya WAJIB berupa kata kerja sedang (Fi\'il Mudhari\')!',
    rumus_tiga_detik: 'Kada = Nyaris. \'Asa = Semoga. Syara\'a = Mulai. Khabarnya WAJIB Fi\'il Mudhari\'.',
    checklist_pemula: [
      { tanya: 'Kapan Khabar Kada wajib dimasuki "An"?', ya: 'Pada fi\'il Raja\' (Hara & Ikhlawlaqa wajib An; \'Asa & Ausyaka sering pakai An).' },
      { tanya: 'Kapan HARAM pakai "An"?', ya: 'Seluruh fi\'il Syuru\' (mulai beraksi) HARAM dimasuki kata An.' }
    ],
    tips_anti_bingung: 'Kata "Akhadza" kalau artinya mengambil benda (Akhadza al-kitaba) itu fi\'il biasa. Tapi kalau setelahnya fi\'il mudhari\' (Akhadza yaktubu), artinya adalah "MULAI menulis"!',
    contoh_analogi_kalimat: [
      { arab: 'يَكَادُ البَرْقُ يَخْطَفُ أَبْصَارَهُمْ', indo: 'Hampir-hampir kilat itu menyambar penglihatan mereka (Kada + Mudhari\')', tipe: 'kada' },
      { arab: 'عَسَى اللهُ أَنْ يَأْتِيَ بِالفَتْحِ', indo: 'Mudah-mudahan Allah akan mendatangkan kemenangan (\'Asa + An + Mudhari\')', tipe: 'asa' }
    ]
  },

  'BAB-26': {
    judul_santai: 'Inna & Saudaranya: Rival Abadi Kaana yang Menegaskan Kalimat',
    analogi: 'Inna adalah rival abadi dari Kaana! Kalau Kaana memfathahkan Khabar, maka "Geng Inna" (Inna, Anna, Kaanna, Lakinna, Laita, La\'alla) melakukan hal sebaliknya: Inna justru memfathahkan Isimnya (Isim Inna = Manshub/Fathah) dan membiarkan Khabarnya tetap Dhommah (Khabar Inna = Marfu\'). Di dalamnya juga ada Laa Nafiyah lil Jinsi!',
    rumus_tiga_detik: 'Inna = Isimnya Fathah + Khabarnya Dhommah. Kebalikan murni dari Kaana!',
    checklist_pemula: [
      { tanya: 'Fungsi Inna untuk apa?', ya: 'Memberi penegasan taukid 100% agar pendengar yang ragu langsung mantap.' },
      { tanya: 'Bagaimana mengingat perbedaannya dengan Kaana?', ya: 'Hafalkan rumus: "Inna menashabkan yang pertama, Kaana menashabkan yang kedua".' }
    ],
    tips_anti_bingung: 'Di Al-Qur\'an, setelah kata "Inna" atau "Anna", lafazh Allah PASTI berbunyi "InnaLLAAHA" (fathah), bukan "InnaLLAAHU".',
    contoh_analogi_kalimat: [
      { arab: 'إِنَّ اللهَ مَعَ الصَّابِرِينَ', indo: 'Sesungguhnya Allah (Isim Inna Fathah) bersama orang-orang sabar', tipe: 'inna' },
      { arab: 'لَا إِلَٰهَ إِلَّا اللهُ', indo: 'Tidak ada sesembahan yang hak (Ilaha = Isim Laa Nafiyah lil Jinsi)', tipe: 'la_nafiyah_jinsi' }
    ]
  },

  'BAB-27': {
    judul_santai: 'Zhanna & Saudaranya: Memborong Dua Objek Sekaligus Menjadi Fathah',
    analogi: 'Kalau kata kerja biasa cuma menashabkan 1 objek, maka "Geng Zhanna" (Zhanna, Hasiba, Ra\'a, \'Alima, Wajada, Ja\'ala) adalah bos serakah yang langsung memborong Subjek DAN Info sekaligus menjadi dua korban objek penderita (Maf\'ul Bih 1 dan Maf\'ul Bih 2), keduanya wajib FATHAH!',
    rumus_tiga_detik: 'Zhanna + Pelaku + Objek 1 (Fathah) + Objek 2 (Fathah). Menyatakan dugaan, keyakinan, atau perubahan bentuk.',
    checklist_pemula: [
      { tanya: 'Apa saja pembagian fi\'il Zhanna?', ya: 'Af\'alur Rujhan (dugaan kuat), Af\'alul Yaqin (keyakinan pasti), dan Af\'alut Tahwil (mengubah wujud).' },
      { tanya: 'Bisa tidak menashabkan 3 objek?', ya: 'Bisa! Fi\'il A\'lama dan Ara (memberitahukan) sanggup memborong 3 objek fathah sekaligus.' }
    ],
    tips_anti_bingung: 'Kata "Ra\'a" kalau melihat pakai mata kepala cuma butuh 1 objek (Ra-aitu al-hilala). Tapi kalau "melihat pakai mata batin / yakin", dia butuh 2 objek (Ra-aitu ash-shidqa munhiyan)!',
    contoh_analogi_kalimat: [
      { arab: 'ظَنَنْتُ عَلِيًّا مُسَافِرًا', indo: 'Saya mengira Ali (Objek 1 Fathah) bepergian (Objek 2 Fathah)', tipe: 'zhanna' },
      { arab: 'وَاتَّخَذَ اللَّهُ إِبْرَاهِيمَ خَلِيلًا', indo: 'Dan Allah menjadikan Ibrahim (Objek 1) sebagai kekasih (Objek 2)', tipe: 'tahwil' }
    ]
  },

  'BAB-28': {
    judul_santai: 'Fa\'il & Na\'ibul Fa\'il: Aktor Pelaku & Wakil Pelaku Pasif',
    analogi: 'Setiap ada tindakan, pasti ada aktor pelakunya! Kalau ada kata "Menciptakan", pasti ada "Sang Pencipta" (Fa\'il, berharakat Dhommah). Namun, bila si Pelaku dirahasiakan atau kalimatnya diubah menjadi pasif "Diciptakan...", maka si Korban Objek (Maf\'ul Bih) langsung naik tahta menggantikan posisi raja pelaku bergelar NA\'IBUL FA\'IL dan harakatnya naik pangkat dari Fathah menjadi Dhommah!',
    rumus_tiga_detik: 'Aktif: Fi\'il + Pelaku (Dhommah) + Korban (Fathah). Pasif: Fi\'il Pasif + Wakil Pelaku (Dhommah).',
    checklist_pemula: [
      { tanya: 'Di mana posisi Fa\'il / Na\'ibul Fa\'il?', ya: 'Selalu berada SETELAH kata kerja (Fi\'il), tidak boleh mendahului fi\'il.' },
      { tanya: 'Bagaimana mengenali fi\'il pasif (mabni lil majhul)?', ya: 'Fi\'il madhi huruf awalnya dhommah dan sebelum akhir kasrah (Khuliqa / Dhuriba).' }
    ],
    tips_anti_bingung: 'Kalau pelaku ditaruh di paling depan kalimat (misal: Zaidun qama), secara ilmu Nahwu ia bukan Fa\'il, tapi berstatus MUBTADA\', dan fa\'il aslinya tersembunyi di dalam kata qama.',
    contoh_analogi_kalimat: [
      { arab: 'خَلَقَ اللهُ الإِنسَانَ', indo: 'Allah (Fa\'il, Dhommah) menciptakan manusia (Maf\'ul, Fathah)', tipe: 'fail' },
      { arab: 'خُلِقَ الإِنسَانُ ضَعِيفًا', indo: 'Manusia (Na\'ibul Fa\'il, Dhommah) diciptakan dalam keadaan lemah', tipe: 'naibul_fail' }
    ]
  },

  // =========================================================================
  // PILAR 4: AL-MANSHUBAT (BAB 29 - 35)
  // =========================================================================

  'BAB-29': {
    judul_santai: 'Maf\'ul Bih, Isytighal & Tanazu\': Korban Sasaran & Perebutan Objek',
    analogi: 'Kalau ada anak menendang bola lalu kena jendela, maka Menendang = Fi\'il, si Anak = Fa\'il, dan Jendela yang pecah adalah Korban Penderita (Maf\'ul Bih, wajib Fathah!). Kadang ada dua kata kerja yang berebut satu objek yang sama di belakangnya (ini disebut Tanazu\' / sengketa amal perebutan objek).',
    rumus_tiga_detik: 'Maf\'ul Bih = Korban/Sasaran perbuatan. Wajib Fathah. Menjawab pertanyaan "APA / SIAPA yang dikenai?".',
    checklist_pemula: [
      { tanya: 'Apakah Maf\'ul Bih harus manusia?', ya: 'Tidak, bisa benda mati, hewan, kata ganti, maupun satu anak kalimat utuh.' },
      { tanya: 'Apa itu Isytighal?', ya: 'Ketika objek ditaruh di depan, lalu kata kerja di belakang sibuk mengikat kata gantinya (Zaidan dharabtuhu).' }
    ],
    tips_anti_bingung: 'Maf\'ul Bih bisa menyalip mendahului pelakunya! Contoh: "Wa idzibtalaa Ibraahiima Rabbuhu" (Ibrahim berharakat FATHAH karena dia yang diuji, sedangkan Rabbuhu berharakat DHOMMAH karena Dia yang menguji).',
    contoh_analogi_kalimat: [
      { arab: 'قَرَأَ التِّلْمِيذُ القُرْآنَ', indo: 'Murid membaca Al-Qur\'an (Al-Qur\'ana = Maf\'ul Bih Manshub Fathah)', tipe: 'maful_bih' },
      { arab: 'وَإِذِ ابْتَلَىٰ إِبْرَاهِيمَ رَبُّهُ', indo: 'Ibrahim (Korban yang diuji, Fathah) diuji oleh Tuhannya (Pelaku, Dhommah)', tipe: 'taqdim_maful' }
    ]
  },

  'BAB-30': {
    judul_santai: 'Maf\'ul Muthlaq & Li-Ajlih: Penguat Perbuatan & Motif Niat dari Hati',
    analogi: 'Dua saudara Maf\'ul yang luar biasa: Maf\'ul Muthlaq adalah kata kerja yang diulang menjadi kata benda untuk memberi efek "Sungguh-sungguh / Benar-benar!" (misal: "Saya belajar SEBELAJAR-BELAJARNYA"). Sedangkan Maf\'ul Li-Ajlih adalah motif niat di dalam hati untuk menjawab pertanyaan "Demi apa atau Karena apa tindakan itu dilakukan?" (misal: "Saya belajar KARENA MENGHARAP ridha Allah"). Keduanya wajib Fathah!',
    rumus_tiga_detik: 'Muthlaq = Mashdar penegas/pengukur aksi. Li-Ajlih = Motif niat alasan hati (Karena/Demi).',
    checklist_pemula: [
      { tanya: 'Apakah katanya berasal dari akar kata kerja yang sama?', ya: 'Kallamallahu Musa Takliima -> Takliima adalah Maf\'ul Muthlaq.' },
      { tanya: 'Apakah menjelaskan alasan batin?', ya: 'Thalaban lil \'ilmi, khaufan, hazhara al-maut -> Maf\'ul Li-Ajlih.' }
    ],
    tips_anti_bingung: 'Maf\'ul Li-Ajlih harus berupa pekerjaan hati/batin (cinta, takut, mengharap, mengagungkan), bukan tindakan fisik anggota badan.',
    contoh_analogi_kalimat: [
      { arab: 'وَكَلَّمَ اللهُ مُوسَى تَكْلِيمًا', indo: 'Dan Allah berfirman kepada Musa secara langsung/sungguh-sungguh (Maf\'ul Muthlaq)', tipe: 'maful_muthlaq' },
      { arab: 'يَجْعَلُونَ أَصَابِعَهُمْ فِي آذَانِهِم مِّنَ الصَّوَاعِقِ حَذَرَ الْمَوْتِ', indo: '...karena takut mati (Hadzara = Maf\'ul Li-Ajlih)', tipe: 'maful_liajlih' }
    ]
  },

  'BAB-31': {
    judul_santai: 'Maf\'ul Fih (Zharaf) & Maf\'ul Ma\'ah: Jam Tangan, GPS, dan Pengiring Setia',
    analogi: 'Maf\'ul Fih (Zharaf) itu seperti jam tangan dan GPS! Dia bertugas memberi tahu: Kapan perbuatan terjadi (Pagi, Malam, Hari Jumat) atau Di mana posisi terjadinya (Di depan, Di belakang, Di atas, Di bawah). Sedangkan Maf\'ul Ma\'ah adalah kawan yang membersamai perjalanan setelah huruf Wawu (misal: "Saya berjalan bersamaan dengan terbitnya fajar"). Keduanya wajib Manshub (Fathah)!',
    rumus_tiga_detik: 'Zharaf = Keterangan Waktu (Zaman) & Tempat (Makan). Maf\'ul Ma\'ah = Mengiringi setelah Wawu Ma\'iyyah.',
    checklist_pemula: [
      { tanya: 'Apakah kata ini bisa dimasuki arti "Di dalam / Pada saat (Fi)"?', ya: 'Lailan (pada malam hari), Yauma (pada hari itu) -> Zharaf.' },
      { tanya: 'Apakah huruf Wawu bermakna "bersama", bukan menggabungkan subjek?', ya: 'Sir-tu wa thulu\'a asy-syamsi -> Maf\'ul Ma\'ah.' }
    ],
    tips_anti_bingung: 'Kata tempat yang bisa jadi Zharaf manshub hanyalah tempat yang abstrak/tanpa batas dinding fisik (Amama, Wara\'a, Fauqa). Tempat spesifik yang ada dinding batasnya (seperti Masjid, Rumah) wajib dimasuki huruf Jar "Fii" (Fii al-Masjidi)!',
    contoh_analogi_kalimat: [
      { arab: 'صُمْتُ يَوْمَ الخَمِيسِ أَمَامَ المَسْجِدِ', indo: 'Saya berpuasa pada hari Kamis (Waktu) di depan masjid (Tempat)', tipe: 'zharaf' },
      { arab: 'سِرْتُ وَطُلُوعَ الشَّمْسِ', indo: 'Saya berjalan bersamaan dengan terbitnya matahari (Maf\'ul Ma\'ah)', tipe: 'maful_maah' }
    ]
  },

  'BAB-32': {
    judul_santai: 'Al-Hal: Menjelaskan Gaya, Sikap & Kondisi Saat Beraksi',
    analogi: 'Bayangkan Anda melihat seorang tamu masuk ke rumah: Apakah dia masuk sambil tertawa ceria? Sambil menangis sedih? Sambil terengah-engah berlari? Nah, gaya atau sikap sementara si aktor saat beraksi itulah yang disebut HAL. Dia wajib berupa kata sifat yang umum (Nakirah) dan berharakat FATHAH!',
    rumus_tiga_detik: 'Hal = Sikap/Gaya sementara + Jawaban dari pertanyaan "SAMBIL BAGAIMANA kondisinya saat berbuat?".',
    checklist_pemula: [
      { tanya: 'Apakah keadaannya bisa berubah (bukan watak permanen)?', ya: 'Tertawa, berkendara, berdiri, tersenyum -> Sah jadi Hal.' },
      { tanya: 'Apakah orang yang disifati (Shahibul Hal) kata khusus/makrifat?', ya: 'Ja\'a Zaidun (makrifat) dhahikan (nakirah).' }
    ],
    tips_anti_bingung: 'Bedakan Hal dengan Sifat (Na\'at)! Kalau Na\'at, harakatnya 100% menjiplak kata di depannya. Tapi kalau Hal, dia SELALU FATHAH meskipun orang yang disifati berharakat dhommah!',
    contoh_analogi_kalimat: [
      { arab: 'جَاءَ زَيْدٌ رَاكِبًا', indo: 'Zaid datang berkendara (Rakiban = Hal, gaya Zaid saat datang)', tipe: 'hal' },
      { arab: 'فَخَرَجَ مِنْهَا خَائِفًا يَتَرَقَّبُ', indo: 'Maka keluarlah dia dengan rasa takut sambil waspada (Hal)', tipe: 'hal' }
    ]
  },

  'BAB-33': {
    judul_santai: 'At-Tamyiz & Al-Istitsna\': Pemecah Teka-Teki Takaran & Rumus Pengecualian',
    analogi: 'Tamyiz itu pahlawan pemecah teka-teki! Kalau seseorang bilang: "Saya membeli 20...", pikiran Anda pasti bingung: "20 apa? 20 permen? 20 ekor unta?". Begitu dia mengucapkan: "KITAABAN (20 buku)", teka-teki takaran angka itu langsung terang benderang! Sedangkan Istitsna\' adalah operasi pengurangan memakai kata "Kecuali" (Illa).',
    rumus_tiga_detik: 'Tamyiz = Penjelas benda misterius (angka/timbangan). Istitsna\' = Pengecualian (Kecuali / Illa).',
    checklist_pemula: [
      { tanya: 'Apakah terletak setelah angka hitungan (11-99)?', ya: 'Kata bendanya wajib tunggal berharakat Fathah (Ahada \'asyara kaukaban).' },
      { tanya: 'Apakah terletak setelah perbandingan "Lebih..."?', ya: 'Ana aktsaru minka maalan (Hartanya) -> Tamyiz Nisbah.' }
    ],
    tips_anti_bingung: 'Hal menerangkan KONDISI/SIKAP orang yang bergerak. Tamyiz menerangkan NAMA ZAT/JENIS dari ukuran atau perbandingan yang samar.',
    contoh_analogi_kalimat: [
      { arab: 'إِنِّي رَأَيْتُ أَحَدَ عَشَرَ كَوْكَبًا', indo: 'Aku melihat 11 bintang (Kaukaban = Tamyiz angka 11)', tipe: 'tamyiz' },
      { arab: 'فَسَجَدَ الْمَلَائِكَةُ كُلُّهُمْ أَجْمَعُونَ إِلَّا إِبْلِيسَ', indo: 'Maka seluruh malaikat bersujud kecuali Iblis (Iblisa = Mustatsna Manshub)', tipe: 'istitsna' }
    ]
  },

  'BAB-34': {
    judul_santai: 'Al-Munada, Istighatsah, Nudbah & Tarkhim: Seni Memanggil & Meratap',
    analogi: 'Bahasa Arab punya protokol memanggil yang sangat kaya: 1) Munada = Panggilan umum ("Wahai Abdullah!" / Ya \'Abdallahi), 2) Istighatsah = Panggilan darurat minta tolong kepada Allah ("Wahai Allah, tolonglah kami!" / Ya lallaah), 3) Nudbah = Ratapan duka cita mendalam ("Duhai malangnya punggungku..." / Waa Zhahraah), 4) Tarkhim = Panggilan manja dengan memenggal huruf terakhir nama (Ya Fathimah -> Ya Fathi!).',
    rumus_tiga_detik: 'Munada Mudhaf = Wajib Manshub Fathah (Ya Abdallahi). Munada Nama Tunggal = Mabni Dhommah (Ya Zaidu).',
    checklist_pemula: [
      { tanya: 'Apa saja huruf panggil?', ya: 'Ya (paling umum), A & Ai (jarak dekat), Aya & Haya (jarak jauh), Waa (khusus ratapan Nudbah).' },
      { tanya: 'Bagaimana memanggil kata yang ada Al-?', ya: 'Wajib disisipkan "Ayyuha" untuk pria atau "Ayyatuha" untuk wanita (Ya ayyuhan-naas).' }
    ],
    tips_anti_bingung: 'Kata "Allahumma" asalnya adalah "Ya Allahu"! Huruf panggil "Ya" di depan dibuang lalu digantikan dengan huruf Mim bertasydid di ujung belakang.',
    contoh_analogi_kalimat: [
      { arab: 'يَا عَبْدَ اللهِ', indo: 'Wahai hamba Allah (Munada Mudhaf wajib Fathah: \'Abda)', tipe: 'munada' },
      { arab: 'يَا نُوحُ اهْبِطْ بِسَلَامٍ', indo: 'Wahai Nuh, turunlah dengan selamat (Nama tunggal mabni Dhommah: Nuhu)', tipe: 'munada' }
    ]
  },

  'BAB-35': {
    judul_santai: 'Tahdzir, Ighra\' & Ikhtishash: Alarm Bahaya, Dorongan Semangat & Penegasan Diri',
    analogi: 'Tiga gaya kalimat manshub yang fi\'ilnya sengaja dibuang: 1) Tahdzir = Alarm bahaya ("Awas singa!" / As-Saba\'a! -> asalnya: Waspadalah terhadap singa!), 2) Ighra\' = Suntikan motivasi positif ("Ayo jujur!" / Ash-Shidqa! -> asalnya: Lazimkanlah kejujuran!), 3) Ikhtishash = Penegasan posisi kelompok ("Kami para Nabi..." / Nahnu al-anbiyaa\'a). Seluruh objeknya berharakat FATHAH!',
    rumus_tiga_detik: 'Tahdzir = Peringatan awas (Iyyaka / Fathah). Ighra\' = Anjuran semangat. Ikhtishash = Penegasan profesi.',
    checklist_pemula: [
      { tanya: 'Mengapa kata bendanya berharakat Fathah?', ya: 'Karena dianggap sebagai Maf\'ul Bih dari kata kerja yang dibuang (Uhaddziru / Ilzam / Akhushshu).' },
      { tanya: 'Bagaimana rumus Tahdzir dengan Iyyaka?', ya: 'Iyyaka wal-kadziba (Waspadalah kamu dan jauhilah dusta!).' }
    ],
    tips_anti_bingung: 'Ikhtishash mirip dengan Munada (panggilan), bedanya: Ikhtishash TIDAK PERNAH pakai huruf panggilan dan posisinya SELALU setelah kata ganti orang pertama (Nahnu / Saya / Kami).',
    contoh_analogi_kalimat: [
      { arab: 'إِيَّاكَ وَالكَذِبَ', indo: 'Jauhilah olehmu dusta itu! (Tahdzir)', tipe: 'tahdzir' },
      { arab: 'نَحْنُ مَعَاشِرَ الأَنْبِيَاءِ لَا نُورَثُ', indo: 'Kami para nabi (Ikhtishash Fathah) tidak mewariskan harta', tipe: 'ikhtishash' }
    ]
  },

  // =========================================================================
  // PILAR 5: AL-MAJRURAT & AT-TAWABI' (BAB 36 - 41)
  // =========================================================================

  'BAB-36': {
    judul_santai: 'Huruf Jar & Idhafah: Kasrah Terseret Magnet Kata Depan & Kepemilikan',
    analogi: 'Huruf Jar (Di, Ke, Dari, Atas, Dengan, Untuk) itu seperti magnet bumi: kata benda apa pun yang kena tempel huruf ini langsung "tertarik ke bawah" berharakat KASRAH! Begitu juga Idhafah (kepemilikan 2 kata benda seperti: "Rumah Allah / Baitullah"), kata kedua otomatis wajib berharakat kasrah (Majrur bil-Idhafah).',
    rumus_tiga_detik: 'Huruf Jar + Kata Benda = Kasrah. Kata 1 (Bebas Al/Tanwin) + Kata 2 (Pemilik) = Wajib Kasrah.',
    checklist_pemula: [
      { tanya: 'Apa saja huruf jar populer?', ya: 'Min (dari), Ila (ke), \'An (tentang), \'Ala (di atas), Fi (di dalam), Bi (dengan), Li (untuk).' },
      { tanya: 'Apakah kata pertama pada Idhafah boleh tanwin atau ada Al-?', ya: 'HARAM! Kata pertama (Mudhaf) tidak boleh ada Al- dan tidak boleh ditanwin.' }
    ],
    tips_anti_bingung: 'Huruf Jar TIDAK PERNAH masuk ke kata kerja! Jika Anda melihat kata diawali huruf jar atau berharakat kasrah di ujung, 1000% itu kata benda (Isim).',
    contoh_analogi_kalimat: [
      { arab: 'فِي بُيُوتٍ أَذِنَ اللَّهُ أَن تُرْفَعَ', indo: 'Di dalam rumah-rumah (Kena Fi, harakatnya kasrah Buyutin)', tipe: 'jar_huruf' },
      { arab: 'كِتَابُ اللهِ', indo: 'Kitab Allah (Lafzhul Jalalah kasrah karena berstatus Mudhaf Ilaih)', tipe: 'idhafah' }
    ]
  },

  'BAB-37': {
    judul_santai: 'Mamnu\' minash Sharf: Kata Benda VIP Anti-Tanwin & Jar bil-Fathah',
    analogi: 'Di dunia kata Arab, ada kasta "Kata VIP Eksklusif" bernama Mamnu\' minash Sharf. Karena punya kemiripan sifat dengan kata kerja, kata-kata ini PUNYA DUA ATURAN ANTI-MAINSTREAM: 1) Haram bertanwin selamanya, dan 2) Saat berstatus Jar (kena huruf jar atau jadi mudhaf ilaih), mereka MENOLAK KASRAH dan menggantinya dengan FATHAH!',
    rumus_tiga_detik: 'Mamnu\' minash Sharf = Bebas Tanwin + Majrur pakai Fathah (Bukan Kasrah!).',
    checklist_pemula: [
      { tanya: 'Apa saja yang termasuk kata VIP ini?', ya: 'Nama asing (Ibrahim, Fir\'aun), nama wanita (Maryam), nama akhiran Alif-Nun (Ramadhan), jamak Mafaa\'il (Masaajid), dan kata sifat Af\'al (Ahsan).' },
      { tanya: 'Kapan status VIP ini dicabut sehingga kembali normal berkasrah?', ya: 'Saat kata tersebut dimasuki AL (fil-Masaajidi) atau dijadikan Mudhaf (fii ahsani taqwiim)!' }
    ],
    tips_anti_bingung: 'Jangan pernah mengatakan tanda jar Ramadhan dalam "Syahru Ramadhaana" adalah Kasrah! Itu salah besar. Tanda jar-nya adalah FATHAH Far\'iyyah karena tergolong Mamnu\' minash Sharf.',
    contoh_analogi_kalimat: [
      { arab: 'شَهْرُ رَمَضَانَ', indo: 'Bulan Ramadhan (Ramadhana = Majrur berharakat Fathah)', tipe: 'mamnu' },
      { arab: 'صَلَّيْتُ فِي مَسَاجِدَ كَثِيرَةٍ', indo: 'Saya shalat di banyak masjid (Masaajida = Majrur berharakat Fathah)', tipe: 'mamnu' }
    ]
  },

  'BAB-38': {
    judul_santai: 'At-Tawabi\' (1): Na\'at (Sifat) dan Taukid (Penguat Kalimat)',
    analogi: 'Na\'at (kata sifat) itu seperti bayangan cermin yang paling setia! Ke mana pun tuannya (Man\'ut) pergi, si bayangan sifat ini meniru persis dalam 4 hal: Harakat, Gender (Pria/Wanita), Jumlah (Tunggal/Dua/Jamak), dan Kejelasan (Ada Al/Tanwin). Sedangkan Taukid adalah stempel penegas ("Presiden SENDIRI / Nafsuhu yang datang") agar orang tidak mengira cuma utusan.',
    rumus_tiga_detik: 'Na\'at = Sifat peniru 4 perkara. Taukid = Kata penegas (Nafsu, \'Ainu, Kullu, Jami\'u + Dhamir). Harakatnya mengekor.',
    checklist_pemula: [
      { tanya: 'Apakah kata pertama ada Al-?', ya: 'Maka kata sifat kedua WAJIB ada Al- juga (Al-Kitabul Mufidu).' },
      { tanya: 'Bagaimana rumus Taukid Ma\'nawi?', ya: 'Kata penegas wajib bersambung dengan kata ganti yang merujuk kata yang ditegaskan (Jaa-al qaumu kulluhum).' }
    ],
    tips_anti_bingung: 'Kalau kata pertama ada Al- tapi kata kedua bertanwin (Al-Kitabu Jamilun), itu BUKAN sifat melainkan kalimat sempurna Mubtada\' + Khabar (Buku itu indah)!',
    contoh_analogi_kalimat: [
      { arab: 'قَرَأْتُ كِتَابًا مُفِيدًا', indo: 'Saya membaca buku yang bermanfaat (Mufidan meniru fathah Kitaban)', tipe: 'naat' },
      { arab: 'فَسَجَدَ الْمَلَائِكَةُ كُلُّهُمْ أَجْمَعُونَ', indo: 'Maka bersujudlah para malaikat KULLUHUM (seluruh mereka, Taukid)', tipe: 'taukid' }
    ]
  },

  'BAB-39': {
    judul_santai: 'At-Tawabi\' (2): \'Athaf (Kata Sambung) dan Badal (Pemeran Pengganti)',
    analogi: '\'Athaf (Dan, Lalu, Kemudian, Atau) itu seperti jembatan timbangan adil: apa pun harakat kata di sebelah kiri jembatan, kata setelah jembatan berhak atas harakat yang sama persis! Sedangkan Badal adalah pemeran pengganti resmi: misalnya "Presiden kita, Joko Widodo...". Sebutan nama kedua bisa menggantikan sepenuhnya kata pertama, dan harakatnya menjiplak penuh!',
    rumus_tiga_detik: '\'Athaf = Kata sambung penyama harakat (Wawu, Fa\', Tsumma). Badal = Nama/kata pengganti inti.',
    checklist_pemula: [
      { tanya: 'Apa perbedaan Wawu, Fa\', dan Tsumma?', ya: 'Wawu = bersamaan; Fa\' = berurutan langsung tanpa jeda; Tsumma = berurutan dengan jeda waktu santai.' },
      { tanya: 'Apakah ada isim ber-Al setelah kata tunjuk (Hadza)?', ya: 'Hadza al-kitabu -> Al-Kitabu adalah 100% Badal.' }
    ],
    tips_anti_bingung: 'Badal ada 4 macam: Badal Kull min Kull (identik sama), Ba\'dh min Kull (sebagian), Isytimal (karakter yang dikandung), dan Ghalath (ralat salah ucap).',
    contoh_analogi_kalimat: [
      { arab: 'جَاءَ زَيْدٌ وَعَلِيٌّ', indo: 'Zaid dan Ali datang (\'Aliyun ikut berharakat dhommah seperti Zaid)', tipe: 'athaf' },
      { arab: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ...', indo: 'Tunjukilah kami jalan yang lurus, (yaitu) jalannya orang-orang... (Shiraatha kedua = Badal)', tipe: 'badal' }
    ]
  },

  'BAB-40': {
    judul_santai: 'Kaidah Bilangan (\'Adad & Ma\'dud): Drama Perang Gender dalam Hitungan Angka',
    analogi: 'Menghitung benda dalam bahasa Arab itu seperti drama percintaan yang penuh kejutan! Angka 1 dan 2 sangat setia dan cocok jenis kelaminnya dengan bendanya. Tapi angka 3 sampai 10 adalah PEMBANGKANG: jenis kelamin angka wajib BERLAWANAN 180 DERAJAT dengan benda yang dihitung! Kalau bendanya laki-laki, angkanya wajib pakai Ta\' Marbuthah perempuan (Tsalatsatu Rijaal)!',
    rumus_tiga_detik: '1-2 = Sepadan gender. 3-10 = GENDER BERLAWANAN (Benda cowok -> Angka cewek bertanda ة). 11-99 = Benda tunggal Fathah.',
    checklist_pemula: [
      { tanya: 'Bagaimana menentukan jenis kelamin benda yang dihitung?', ya: 'Kembalikan kata bendanya ke bentuk TUNGGAL (Mufrad), jangan lihat bentuk jamaknya!' },
      { tanya: 'Apa harakat benda setelah angka 3-10?', ya: 'Wajib jamak berharakat KASRAH (Majrur sebagai Mudhaf Ilaih).' }
    ],
    tips_anti_bingung: 'Perhatikan surat Al-Haqqah: "Sab\'a layaalin wa tsamaaniyata ayyaam". Lailah (malam, muannats) dihitung pakai Sab\'a (tanpa ة). Yaum (siang, mudzakkar) dihitung pakai Tsamaaniyata (pakai ة)!',
    contoh_analogi_kalimat: [
      { arab: 'ثَلَاثَةُ رِجَالٍ', indo: 'Tiga pria (Pria = Mudzakkar, maka angka tiga wajib muannats: Tsalatsatu)', tipe: 'adad' },
      { arab: 'إِنِّي رَأَيْتُ أَحَدَ عَشَرَ كَوْكَبًا', indo: 'Aku melihat 11 bintang (Angka 11-99 bendanya wajib tunggal manshub: Kaukaban)', tipe: 'adad_quran' }
    ]
  },

  'BAB-41': {
    judul_santai: 'Uslub Ta\'ajjub, Madah/Dzamm & Asma\'ul Af\'al: Kagum, Pujian, dan Kata Seru Sakti',
    analogi: 'Tiga uslub ekspresi rasa: 1) Ta\'ajjub = Formula terpesona kagum ("Alangkah indahnya pemandangan ini!" / Maa Ahsana...), 2) Madah & Dzamm = Memberi bintang 5 pujian (Ni\'ma = Sebaik-baik) vs celaan buruk bintang 1 (Bi\'sa = Seburuk-buruk), 3) Asma\'ul Af\'al = Kata benda berwajah isim tapi bertaji kata kerja sakti (Aamiin = Kabulkanlah, Sah = Diamlah, Hayya = Kemarilah)!',
    rumus_tiga_detik: 'Kagum = Maa Af\'ala (Fathah) / Af\'il bihi. Pujian = Ni\'ma. Celaan = Bi\'sa. Asma\' Af\'al = Kata seru bertaji fi\'il.',
    checklist_pemula: [
      { tanya: 'Apa harakat objek setelah "Maa Af\'ala"?', ya: 'Wajib berharakat FATHAH (Maa ajmala as-samaa-a!).' },
      { tanya: 'Apakah Asma\'ul Af\'al bisa menerima tanda fi\'il?', ya: 'Tidak bisa, dia mabni mati dengan makna kata kerja asalnya.' }
    ],
    tips_anti_bingung: 'Kata "Hayya \'alash-shalah" bukan kata kerja fi\'il amr, melainkan Ism Fi\'il Amr yang bermakna "Aqbil" (Kemarilah menyambut shalat)!',
    contoh_analogi_kalimat: [
      { arab: 'فَمَا أَصْبَرَهُمْ عَلَى النَّارِ', indo: 'Alangkah tabahnya mereka menghadapi api neraka! (Ta\'ajjub)', tipe: 'taajjub' },
      { arab: 'نِعْمَ المَوْلَىٰ وَنِعْمَ النَّصِيرُ', indo: 'Dia adalah sebaik-baik pelindung dan sebaik-baik penolong (Madah Pujian)', tipe: 'madah' },
      { arab: 'هَيْهَاتَ هَيْهَاتَ لِمَا تُوعَدُونَ', indo: 'Jauh, sungguh amat jauh apa yang diancamkan kepadamu (Ism Fi\'il Madhi)', tipe: 'asma_afal' }
    ]
  },

  // =========================================================================
  // PILAR 6: SINTAKSIS TINGKAT TINGGI (BAB 42)
  // =========================================================================

  'BAB-42': {
    judul_santai: 'I\'rabul Jumal & Ta\'alluq: Menimbang Kedudukan Kalimat Utuh dan Keterikatan Kata',
    analogi: 'Ibarat main catur tingkat grandmaster: bukan cuma pion bidak tunggal yang dinilai, tapi satu formasi kompi utuh! Di bab puncak ini, kita mengi\'rab satu anak kalimat panjang sekaligus: 1) Ada 7 Formasi Kalimat yang punya kursi jabatan i\'rab (misal: satu kalimat jadi predikat khabar atau jadi keterangan hal), 2) Ada 7 Formasi Kalimat yang cuma numpang lewat tanpa jabatan (seperti kalimat pembuka atau shilah maushul), dan 3) Ta\'alluq = rantai jangkar keterikatan Jar-Majrur ke kata kerjanya.',
    rumus_tiga_detik: 'Jumlah Laha Mahall = Duduki jabatan isim (7 jenis). La Mahalla Laha = Numpang lewat tanpa jabatan (7 jenis).',
    checklist_pemula: [
      { tanya: 'Sebutkan contoh kalimat yang punya jabatan i\'rab?', ya: 'Kalimat Khabar (Zaidun [abuuhu qoo-imun]), kalimat Hal, kalimat ucapan Maf\'ul (Qoola: [Inni abdullah]).' },
      { tanya: 'Apa itu Ta\'alluq?', ya: 'Setiap huruf Jar dan Zharaf wajib punya kaitan makna (jangkar pelabuhan) dengan kata kerja atau kata sifat di dekatnya.' }
    ],
    tips_anti_bingung: 'Kaidah emas penentu Hal vs Sifat: "Al-Jumalu ba\'dan Nakiraati Shifaat, wa ba\'dal Ma\'aarifi Ahwaal" (Anak kalimat setelah kata umum/nakirah statusnya Sifat, sedangkan setelah kata khusus/makrifat statusnya HAL)!',
    contoh_analogi_kalimat: [
      { arab: 'قَالَ إِنِّي عَبْدُ اللَّهِ', indo: 'Dia berkata: "Sesungguhnya aku hamba Allah" (Satu kalimat utuh di dalam tanda kutip berposisi nashab Maf\'ul Bih)', tipe: 'jumlah_mahall' },
      { arab: 'الحَمْدُ لِلَّهِ', indo: 'Segala puji bagi Allah (Huruf Jar Li bertaut/muta\'alliq dengan khabar yang dihapus)', tipe: 'taalluq' }
    ]
  }
};

// Helper function to get friendly explanation for any Bab
export function getPenjelasanAwam(babId, babData) {
  if (penjelasanAwamPerBab[babId]) {
    return penjelasanAwamPerBab[babId];
  }

  // Fallback intelligent generator if any future Bab is added
  return {
    judul_santai: `Panduan Praktis: ${babData?.judul_indo || 'Kaidah Gramatika'}`,
    analogi: `Bab ini membahas ${babData?.judul_indo || 'kaidah tata bahasa'} yang sangat krusial dalam memahami Al-Qur'an dan teks Arab. ${babData?.ringkasan_cakupan || ''} Tujuannya agar kita dapat mengenali pola kalimat tanpa ragu saat membaca mushaf.`,
    rumus_tiga_detik: `Kaidah ${babData?.judul_indo || ''}: Perhatikan harakat akhir kata dan hubungannya dengan kata sebelum/sesudahnya dalam susunan kalimat.`,
    checklist_pemula: [
      { tanya: 'Apa tujuan utama bab ini?', ya: `Memahami aturan tata bahasa pada ${babData?.judul_indo || 'pembahasan ini'}.` },
      { tanya: 'Di mana sering kita temukan?', ya: 'Sering dijumpai pada bacaan ayat suci Al-Qur\'an dan hadits Nabi.' }
    ],
    tips_anti_bingung: 'Fokuslah pada pola umum dan contoh penggunaannya terlebih dahulu sebelum menghafal detail pengecualian yang mendalam.',
    contoh_analogi_kalimat: []
  };
}
