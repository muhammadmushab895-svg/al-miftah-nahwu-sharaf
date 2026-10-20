const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const IROB_DIR = path.join(BASE_DIR, 'data', 'irobquran');
const APP_QURAN_DIR = path.join(BASE_DIR, 'app', 'public', 'data', 'quran');
const DATA_QURAN_DIR = path.join(BASE_DIR, 'data', 'quran');
const MASTER_FULL_FILE = path.join(BASE_DIR, 'data', '06_seluruh_ayat_quran_6236.json');
const LATIHAN_DATA_FILE = path.join(BASE_DIR, 'data', '06_latihan_quran.json');
const LATIHAN_APP_FILE = path.join(BASE_DIR, 'app', 'src', 'data', '06_latihan_quran.json');

function cleanIrabHtml(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/\s+/g, ' ')
    .trim();
}

function parseIrobGrammar(irabText, kataArab, existingWord) {
  const t = cleanIrabHtml(irabText);

  let statusHukum = "Mabni";
  let tandaIndo = "Mabni";
  let kedudukanIndo = "";

  // 1. Tanda I'rab & Status Hukum from authentic text
  if (t.includes('ممنوع من الصرف') || t.includes('ممنوعا من الصرف') || t.includes('الفتحة نيابة عن الكسرة')) {
    if (t.includes('مجرور') || t.includes('في محل جر') || t.includes('مضاف إليه') || t.includes('جار ومجرور')) {
      statusHukum = "Majrur";
      tandaIndo = "Kasrah bil-Fathah (Mamnu' minash Sharf)";
    } else if (t.includes('منصوب') || t.includes('في محل نصب')) {
      statusHukum = "Manshub";
      tandaIndo = "Fathah Zhahirah (Ashliyyah)";
    } else if (t.includes('مرفوع') || t.includes('في محل رفع')) {
      statusHukum = "Marfu'";
      tandaIndo = "Dhammah Zhahirah (Ashliyyah)";
    } else {
      statusHukum = "Majrur";
      tandaIndo = "Kasrah bil-Fathah (Mamnu' minash Sharf)";
    }
  } else if (t.includes('جمع مؤنث سالم') && (t.includes('بالكسرة نيابة عن الفتحة') || t.includes('منصوب وعلامة نصبه الكسرة'))) {
    statusHukum = "Manshub";
    tandaIndo = "Fathah bil-Kasrah (Jam' Mu'annats Salim)";
  } else if (t.includes('الأسماء الخمسة') || t.includes('الأسماء الستة')) {
    if (t.includes('الواو') || t.includes('مرفوع')) { statusHukum = "Marfu'"; tandaIndo = "Wawu (Asma'ul Khamsah)"; }
    else if (t.includes('الألف') || t.includes('منصوب')) { statusHukum = "Manshub"; tandaIndo = "Alif (Asma'ul Khamsah)"; }
    else if (t.includes('الياء') || t.includes('مجرور')) { statusHukum = "Majrur"; tandaIndo = "Ya' (Asma'ul Khamsah)"; }
  } else if (t.includes('الأفعال الخمسة')) {
    if (t.includes('ثبوت النون')) { statusHukum = "Marfu'"; tandaIndo = "Tsubutun Nun (Af'alul Khamsah)"; }
    else if (t.includes('حذف النون')) {
      if (t.includes('منصوب')) { statusHukum = "Manshub"; tandaIndo = "Hadzfun Nun (Af'alul Khamsah)"; }
      else if (t.includes('مجزوم')) { statusHukum = "Majzum"; tandaIndo = "Hadzfun Nun (Af'alul Khamsah)"; }
      else { statusHukum = "Mabni"; tandaIndo = "Mabni 'ala Hadzfin Nun"; }
    }
  } else if (t.includes('جمع مذكر سالم') || t.includes('ملحق بجمع المذكر السالم') || t.includes('ملحقا بجمع المذكر')) {
    if (t.includes('الواو') || t.includes('مرفوع')) { statusHukum = "Marfu'"; tandaIndo = "Huruf Wawu (Tanda Far'iyyah Jam'ul Mudzakkar)"; }
    else if (t.includes('منصوب')) { statusHukum = "Manshub"; tandaIndo = "Huruf Ya' (Tanda Far'iyyah Jam'ul Mudzakkar)"; }
    else if (t.includes('مجرور')) { statusHukum = "Majrur"; tandaIndo = "Huruf Ya' (Tanda Far'iyyah Jam'ul Mudzakkar)"; }
  } else if (t.includes('مثنى') || t.includes('ملحق بالمثنى') || t.includes('ملحقا بالمثنى')) {
    if (t.includes('الألف') || t.includes('مرفوع')) { statusHukum = "Marfu'"; tandaIndo = "Huruf Alif (Tanda Far'iyyah Mutsanna)"; }
    else if (t.includes('منصوب')) { statusHukum = "Manshub"; tandaIndo = "Huruf Ya' (Tanda Far'iyyah Mutsanna)"; }
    else if (t.includes('مجرور')) { statusHukum = "Majrur"; tandaIndo = "Huruf Ya' (Tanda Far'iyyah Mutsanna)"; }
  } else if (t.includes('حذف حرف العلة')) {
    if (t.includes('مجزوم')) { statusHukum = "Majzum"; tandaIndo = "Hadzfu Harfil 'Illah (Mu'tal Akhir)"; }
    else { statusHukum = "Mabni"; tandaIndo = "Mabni 'ala Hadzfi Harfil 'Illah"; }
  } else if (t.includes('حذف النون')) {
    if (t.includes('مجزوم')) { statusHukum = "Majzum"; tandaIndo = "Hadzfun Nun (Af'alul Khamsah)"; }
    else if (t.includes('منصوب')) { statusHukum = "Manshub"; tandaIndo = "Hadzfun Nun (Af'alul Khamsah)"; }
    else { statusHukum = "Mabni"; tandaIndo = "Mabni 'ala Hadzfin Nun"; }
  } else if (t.includes('المقدرة') || t.includes('مقدر') || t.includes('مقدرا')) {
    const illahType = t.includes('التعذر') ? " (Ta'adzdzur)" : t.includes('الثقل') ? " (Tsiqal)" : t.includes('اشتغال المحل') ? " (Isytighal)" : "";
    if (t.includes('الضمة') || t.includes('مرفوع')) { statusHukum = "Marfu'"; tandaIndo = "Dhammah Muqaddarah" + illahType; }
    else if (t.includes('الفتحة') || t.includes('منصوب')) { statusHukum = "Manshub"; tandaIndo = "Fathah Muqaddarah" + illahType; }
    else if (t.includes('الكسرة') || t.includes('مجرور')) { statusHukum = "Majrur"; tandaIndo = "Kasrah Muqaddarah" + illahType; }
    else if (t.includes('مبني على الفتح')) { statusHukum = "Mabni"; tandaIndo = "Mabni 'alal Fath Muqaddar" + illahType; }
    else if (t.includes('مبني على الضم')) { statusHukum = "Mabni"; tandaIndo = "Mabni 'alad Dhamm Muqaddar" + illahType; }
    else { statusHukum = "Mabni"; tandaIndo = "Muqaddarah" + illahType; }
  } else if (t.includes('الضمة الظاهرة') || (t.includes('مرفوع') && t.includes('الضمة'))) {
    statusHukum = "Marfu'";
    tandaIndo = "Dhammah Zhahirah (Ashliyyah)";
  } else if (t.includes('الفتحة الظاهرة') || (t.includes('منصوب') && t.includes('الفتحة'))) {
    statusHukum = "Manshub";
    tandaIndo = "Fathah Zhahirah (Ashliyyah)";
  } else if (t.includes('الكسرة الظاهرة') || (t.includes('مجرور') && t.includes('الكسرة'))) {
    statusHukum = "Majrur";
    tandaIndo = "Kasrah Zhahirah (Ashliyyah)";
  } else if (t.includes('السكون') && t.includes('مجزوم')) {
    statusHukum = "Majzum";
    tandaIndo = "Sukun (Ashliyyah)";
  } else if (t.includes('مبني على السكون')) {
    statusHukum = "Mabni";
    tandaIndo = "Mabni 'alas Sukun";
  } else if (t.includes('مبني على الفتح')) {
    statusHukum = "Mabni";
    tandaIndo = "Mabni 'alal Fath";
  } else if (t.includes('مبني على الضم')) {
    statusHukum = "Mabni";
    tandaIndo = "Mabni 'alad Dhamm";
  } else if (t.includes('مبني على الكسر')) {
    statusHukum = "Mabni";
    tandaIndo = "Mabni 'alal Kasr";
  } else if (t.includes('مرفوع')) {
    statusHukum = "Marfu'";
    tandaIndo = "Dhammah Zhahirah (Ashliyyah)";
  } else if (t.includes('منصوب')) {
    statusHukum = "Manshub";
    tandaIndo = "Fathah Zhahirah (Ashliyyah)";
  } else if (t.includes('مجرور')) {
    statusHukum = "Majrur";
    tandaIndo = "Kasrah Zhahirah (Ashliyyah)";
  } else if (t.includes('مجزوم')) {
    statusHukum = "Majzum";
    tandaIndo = "Sukun (Ashliyyah)";
  } else {
    statusHukum = existingWord ? existingWord.status_hukum : "Mabni";
    tandaIndo = existingWord ? existingWord.tanda_irab : "Mabni";
  }

  // 2. Kedudukan Bahasa Indonesia
  if (t.includes('حروف مقطعة') || t.includes('حرف مقطع')) kedudukanIndo = "Huruf Muqaththa'ah (Fawatih As-Suwar) mabni";
  else if (t.includes('مبتدأ')) kedudukanIndo = `Mubtada' ${statusHukum === "Mabni" ? "mabni fi mahalli raf'in" : "marfu'"}`;
  else if (t.includes('خبر لمبتدأ') || t.includes('خبر المبتدأ') || t.includes('خبر مرفوع') || (t.includes('خبر') && !t.includes('كان') && !t.includes('إن'))) kedudukanIndo = `Khabar Mubtada' ${statusHukum === "Mabni" ? "mabni fi mahalli raf'in" : "marfu'"}`;
  else if (t.includes('اسم (إن)') || t.includes('اسم إن') || t.includes('اسم (أن)') || t.includes('اسم أن') || t.includes('اسم (كأن)') || t.includes('اسم (لكن)') || t.includes('اسم (ليت)') || t.includes('اسم (لعل)')) kedudukanIndo = `Isim Inna / Akhawat Inna ${statusHukum === "Mabni" ? "mabni fi mahalli nashbin" : "manshub"}`;
  else if (t.includes('خبر (إن)') || t.includes('خبر إن') || t.includes('خبر (أن)')) kedudukanIndo = "Khabar Inna wa Akhwatuha marfu'";
  else if (t.includes('اسم (كان)') || t.includes('اسم كان')) kedudukanIndo = "Isim Kana wa Akhwatuha marfu'";
  else if (t.includes('خبر (كان)') || t.includes('خبر كان')) kedudukanIndo = "Khabar Kana wa Akhwatuha manshub";
  else if (t.includes('نائب فاعل')) kedudukanIndo = `Na'ibul Fa'il ${statusHukum === "Mabni" ? "mabni fi mahalli raf'in" : "marfu'"}`;
  else if (t.includes('فاعل') && !t.includes('مفعول')) kedudukanIndo = `Fa'il ${statusHukum === "Mabni" ? "mabni fi mahalli raf'in" : "marfu'"}`;
  else if (t.includes('مفعول به ثان')) kedudukanIndo = `Maf'ul Bih Tsani (Objek Kedua) ${statusHukum === "Mabni" ? "mabni fi mahalli nashbin" : "manshub"}`;
  else if (t.includes('مفعول به')) kedudukanIndo = `Maf'ul Bih (Objek Penderita) ${statusHukum === "Mabni" ? "mabni fi mahalli nashbin" : "manshub"}`;
  else if (t.includes('مفعول مطلق')) kedudukanIndo = "Maf'ul Muthlaq (Penguat Perbuatan) manshub";
  else if (t.includes('مفعول لأجله') || t.includes('مفعول له')) kedudukanIndo = "Maf'ul Li Ajlih (Keterangan Alasan) manshub";
  else if (t.includes('مفعول فيه') || t.includes('ظرف زمان') || t.includes('ظرف مكان')) kedudukanIndo = "Zharaf Zaman / Makan (Keterangan Waktu / Tempat) manshub";
  else if (t.includes('حال منصوب') || t.includes('حال')) kedudukanIndo = "Hal (Keterangan Keadaan) manshub";
  else if (t.includes('تمييز')) kedudukanIndo = "Tamyiz (Penjelas Kerancuan) manshub";
  else if (t.includes('مستثنى')) kedudukanIndo = "Mustatsna (Pengecualian) manshub";
  else if (t.includes('منادى')) kedudukanIndo = "Munada (Panggilan) manshub / mabni 'alad dhamm";
  else if (t.includes('مضاف إليه')) {
    if (tandaIndo.includes("Mamnu'")) kedudukanIndo = "Mudhaf Ilaih majrur bil-fathah (Mamnu' minash Sharf)";
    else kedudukanIndo = `Mudhaf Ilaih ${statusHukum === "Mabni" ? "mabni fi mahalli jarrin" : "majrur"}`;
  }
  else if (t.includes('اسم مجرور') || t.includes('جار ومجرور')) {
    if (tandaIndo.includes("Mamnu'")) kedudukanIndo = "Jar-Majrur Syibhul Jumlah (huruf jar + isim majrur bil-fathah Mamnu' minash Sharf)";
    else kedudukanIndo = "Jar-Majrur Syibhul Jumlah (huruf jar + isim majrur)";
  }
  else if (t.includes('نعت') || t.includes('صفة')) {
    if (tandaIndo.includes("Mamnu'")) kedudukanIndo = "Na'at (Sifat) majrur bil-fathah (Mamnu' minash Sharf)";
    else kedudukanIndo = `Na'at (Sifat) ${statusHukum === "Marfu'" ? "marfu'" : statusHukum === "Manshub" ? "manshub" : "majrur"}`;
  }
  else if (t.includes('توكيد')) kedudukanIndo = "Taukid (Kata Penguat) tabi' lil mu'akkad";
  else if (t.includes('بدل')) {
    if (tandaIndo.includes("Mamnu'")) kedudukanIndo = "Badal (Kata Pengganti) majrur bil-fathah (Mamnu' minash Sharf)";
    else kedudukanIndo = `Badal (Kata Pengganti) ${statusHukum === "Marfu'" ? "marfu'" : statusHukum === "Manshub" ? "manshub" : "majrur"}`;
  }
  else if (t.includes('معطوف')) {
    if (tandaIndo.includes("Mamnu'")) kedudukanIndo = "Ma'thuf (Kata Sambung) majrur bil-fathah (Mamnu' minash Sharf)";
    else kedudukanIndo = `Ma'thuf (Kata Sambung) ${statusHukum === "Marfu'" ? "marfu'" : statusHukum === "Manshub" ? "manshub" : "majrur"}`;
  }
  else if (t.includes('فعل أمر')) kedudukanIndo = "Fi'il Amr mabni";
  else if (t.includes('فعل ماض')) kedudukanIndo = "Fi'il Madhi mabni";
  else if (t.includes('فعل مضارع')) kedudukanIndo = `Fi'il Mudhari' ${statusHukum === "Marfu'" ? "marfu'" : statusHukum === "Manshub" ? "manshub" : "majzum"}`;
  else if (t.includes('حرف جر')) kedudukanIndo = "Huruf Jar mabni, la mahalla lahu minal i'rab";
  else if (t.includes('حرف عطف')) kedudukanIndo = "Huruf 'Athaf (Kata Hubung) mabni";
  else if (t.includes('حرف نفي')) kedudukanIndo = "Huruf Nafyi (Penyangkal) mabni";
  else if (t.includes('حرف نهي') || t.includes('جازم')) kedudukanIndo = "Huruf Jazm mabni";
  else if (t.includes('حرف توكيد') || t.includes('حرف ناسخ')) kedudukanIndo = "Huruf Taukid / Nasikh mabni";
  else if (t.includes('حرف')) kedudukanIndo = "Huruf Ma'ani mabni, la mahalla lahu minal i'rab";
  else if (t.includes('اسم إشارة')) kedudukanIndo = "Isim Isyarah (Kata Tunjuk) mabni";
  else if (t.includes('اسم موصول')) kedudukanIndo = "Isim Maushul (Kata Sambung) mabni";
  else if (t.includes('ضمير')) kedudukanIndo = "Isim Dhamir (Kata Ganti) mabni";
  else {
    kedudukanIndo = existingWord ? existingWord.kedudukan_indo : "Lafadz Al-Qur'an";
  }

  return {
    kedudukan_irab: t,
    status_hukum: statusHukum,
    tanda_irab: tandaIndo,
    kedudukan_indo: kedudukanIndo
  };
}

function alignWords(appWords, irobWords) {
  if (appWords.length === irobWords.length) {
    return appWords.map((w, idx) => ({ appWord: w, irobWord: irobWords[idx] }));
  }

  // Handle special compound token differences
  if (appWords.length === irobWords.length - 1) {
    const pairList = [];
    let iIdx = 0;
    for (let aIdx = 0; aIdx < appWords.length; aIdx++) {
      const aWord = appWords[aIdx];
      const normA = aWord.kata_arab.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
      if (normA.includes('بعدما') || (normA.includes('ال') && normA.includes('ياسين'))) {
        const combinedIrob = {
          lafadz: `${irobWords[iIdx].lafadz} ${irobWords[iIdx+1].lafadz}`,
          irab: `${irobWords[iIdx].irab} وَ${irobWords[iIdx+1].irab}`
        };
        pairList.push({ appWord: aWord, irobWord: combinedIrob });
        iIdx += 2;
      } else {
        pairList.push({ appWord: aWord, irobWord: irobWords[iIdx] || irobWords[irobWords.length - 1] });
        iIdx++;
      }
    }
    return pairList;
  }

  if (appWords.length === irobWords.length + 1) {
    const pairList = [];
    let aIdx = 0;
    for (let iIdx = 0; iIdx < irobWords.length; iIdx++) {
      const iWord = irobWords[iIdx];
      const normI = iWord.lafadz.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
      if (normI.includes('لوما')) {
        pairList.push({ appWord: appWords[aIdx], irobWord: iWord });
        pairList.push({ appWord: appWords[aIdx+1], irobWord: iWord });
        aIdx += 2;
      } else {
        pairList.push({ appWord: appWords[aIdx], irobWord: iWord });
        aIdx++;
      }
    }
    return pairList;
  }

  return appWords.map((w, idx) => ({
    appWord: w,
    irobWord: irobWords[idx] || irobWords[irobWords.length - 1]
  }));
}

async function main() {
  console.log('Harmonizing Quranic I\'rab across all 114 Surahs with irobquran.com reference...');

  const allSurahsData = [];
  let totalWordsProcessed = 0;

  for (let sId = 1; sId <= 114; sId++) {
    const irobPath = path.join(IROB_DIR, `surah_${sId}.json`);
    const appPath = path.join(APP_QURAN_DIR, `surah_${sId}.json`);

    const irobData = JSON.parse(fs.readFileSync(irobPath, 'utf8'));
    const appData = JSON.parse(fs.readFileSync(appPath, 'utf8'));

    // Attach authentic Asbabun Nuzul & Surah Info if present
    if (irobData.info) {
      if (irobData.info.sabb_nzol && irobData.info.sabb_nzol.length > 5) {
        appData.asbabun_nuzul = irobData.info.sabb_nzol;
      }
      if (irobData.info.sabb_tasmia && irobData.info.sabb_tasmia.length > 5) {
        appData.sebab_penamaan = irobData.info.sabb_tasmia;
      }
    }

    // Process each ayah and its words
    for (let aIdx = 0; aIdx < appData.ayat.length; aIdx++) {
      const appAyah = appData.ayat[aIdx];
      const irobAyah = irobData.ayats[aIdx];

      const alignedPairs = alignWords(appAyah.kata_per_kata, irobAyah.lafadzs);

      alignedPairs.forEach(({ appWord, irobWord }) => {
        const parsed = parseIrobGrammar(irobWord.irab, appWord.kata_arab, appWord);
        
        // Update I'rab fields
        appWord.kedudukan_irab = parsed.kedudukan_irab;
        appWord.status_hukum = parsed.status_hukum;
        appWord.tanda_irab = parsed.tanda_irab;
        appWord.kedudukan_indo = parsed.kedudukan_indo;

        totalWordsProcessed++;
      });
    }

    // Save updated surah file to both app and data directories
    const jsonOutput = JSON.stringify(appData, null, 2);
    fs.writeFileSync(appPath, jsonOutput, 'utf8');
    fs.writeFileSync(path.join(DATA_QURAN_DIR, `surah_${sId}.json`), jsonOutput, 'utf8');

    allSurahsData.push(appData);

    if (sId % 10 === 0 || sId === 114) {
      console.log(`[Surah ${sId}/114] Harmonized! Total words processed: ${totalWordsProcessed}`);
    }
  }

  // Save consolidated 6,236 master file
  console.log(`Saving consolidated master dataset to ${MASTER_FULL_FILE}...`);
  fs.writeFileSync(MASTER_FULL_FILE, JSON.stringify(allSurahsData, null, 2), 'utf8');

  // Update 520 training ayat dataset (06_latihan_quran.json)
  console.log(`Updating 520 training ayat dataset...`);
  if (fs.existsSync(LATIHAN_DATA_FILE)) {
    const latihanData = JSON.parse(fs.readFileSync(LATIHAN_DATA_FILE, 'utf8'));
    let matchedAyats = 0;

    latihanData.forEach(lAyah => {
      const surahObj = allSurahsData.find(s => s.id === lAyah.surah_id);
      if (surahObj) {
        const targetAyah = surahObj.ayat.find(a => a.ayat_id === lAyah.ayat_id);
        if (targetAyah) {
          lAyah.kata_per_kata = JSON.parse(JSON.stringify(targetAyah.kata_per_kata));
          matchedAyats++;
        }
      }
    });

    const latihanOutput = JSON.stringify(latihanData, null, 2);
    fs.writeFileSync(LATIHAN_DATA_FILE, latihanOutput, 'utf8');
    fs.writeFileSync(LATIHAN_APP_FILE, latihanOutput, 'utf8');
    console.log(`Successfully updated ${matchedAyats}/520 training ayats in latihan files!`);
  }

  console.log(`\nALL DONE! Successfully harmonized all 114 Surahs and ${totalWordsProcessed} words with irobquran.com!`);
}

main().catch(console.error);
