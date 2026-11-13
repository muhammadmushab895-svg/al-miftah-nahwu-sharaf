/**
 * generate_quran_search_index.js
 * Membangun indeks pencarian ringan lintas 114 Surah / 6.236 Ayat Al-Qur'an
 * ke app/public/data/quran/quran_search_index.json
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = __dirname;
const QURAN_DIR = path.join(ROOT, 'app', 'public', 'data', 'quran');
const LATIHAN_FILE = path.join(ROOT, 'app', 'src', 'data', '06_latihan_quran.json');
const OUT_FILE = path.join(QURAN_DIR, 'quran_search_index.json');

const LOCAL_KEMENAG_FILE = path.join(ROOT, 'data', 'quran_id_kemenag.json');

async function loadIndonesianTranslations() {
  const map = new Map();
  try {
    let payload;
    if (fs.existsSync(LOCAL_KEMENAG_FILE)) {
      console.log('Membaca terjemahan Kemenag RI lokal dari data/quran_id_kemenag.json...');
      payload = JSON.parse(fs.readFileSync(LOCAL_KEMENAG_FILE, 'utf8'));
    } else {
      console.log('Mengunduh terjemahan Kemenag RI (6.236 ayat) dari api.alquran.cloud...');
      const res = await fetch('https://api.alquran.cloud/v1/quran/id.indonesian', {
        signal: AbortSignal.timeout(15000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      payload = await res.json();
    }
    const surahs = payload?.data?.surahs || [];
    for (const surah of surahs) {
      for (const ayah of surah.ayahs || []) {
        map.set(`${surah.number}:${ayah.numberInSurah}`, String(ayah.text || '').trim());
      }
    }
    console.log(`Berhasil memuat ${map.size} terjemahan ayat Indonesia.`);
  } catch (err) {
    console.warn('Peringatan: Gagal memuat terjemahan penuh, menggunakan fallback 06_latihan_quran.json:', err.message);
  }
  return map;
}

async function main() {
  const utilsUrl = pathToFileURL(path.join(ROOT, 'app', 'src', 'utils', 'quranSearch.js')).href;
  const { buildArabicSearchVariants, transliterateArabicPhonetic } = await import(utilsUrl);

  const surahList = JSON.parse(fs.readFileSync(path.join(QURAN_DIR, 'surah_list.json'), 'utf8'));
  const latihanList = JSON.parse(fs.readFileSync(LATIHAN_FILE, 'utf8'));

  // Peta terjemahan kurasi dari 06_latihan_quran.json (berdasarkan Surah ID + Nomor Ayat)
  const surahNameToId = new Map();
  for (const s of surahList) {
    surahNameToId.set(s.name_id.toLowerCase(), s.id);
  }
  const curatedIndoMap = new Map();
  for (const item of latihanList) {
    const sId = surahNameToId.get(String(item.surah || '').toLowerCase());
    if (sId && item.ayat && item.terjemahan_indo) {
      curatedIndoMap.set(`${sId}:${item.ayat}`, String(item.terjemahan_indo).trim());
    }
  }

  const kemenagMap = await loadIndonesianTranslations();

  const indexEntries = [];
  for (const meta of surahList) {
    const surahPath = path.join(QURAN_DIR, `surah_${meta.id}.json`);
    const surahData = JSON.parse(fs.readFileSync(surahPath, 'utf8'));
    for (const ayah of surahData.ayat || []) {
      const key = `${meta.id}:${ayah.ayat_id}`;
      const arabicRaw = String(ayah.teks_ayat_arab || '').trim();
      const qVariants = buildArabicSearchVariants(arabicRaw);
      const idText = kemenagMap.get(key) || curatedIndoMap.get(key) || '';
      const tr = transliterateArabicPhonetic(arabicRaw);

      indexEntries.push({
        s: meta.id,
        a: ayah.ayat_id,
        t: arabicRaw,
        q: qVariants,
        id: idText,
        tr
      });
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(indexEntries), 'utf8');
  const stats = fs.statSync(OUT_FILE);
  console.log(`Selesai! Total ${indexEntries.length} ayat diindeks ke ${OUT_FILE} (${(stats.size / (1024 * 1024)).toFixed(2)} MB).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
