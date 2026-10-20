const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);
const LATIHAN_DATA_FILE = path.join(BASE_DIR, 'data', '06_latihan_quran.json');
const LATIHAN_APP_FILE = path.join(BASE_DIR, 'app', 'src', 'data', '06_latihan_quran.json');
const MASTER_FILE = path.join(BASE_DIR, 'data', '06_seluruh_ayat_quran_6236.json');

const masterSurahs = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
const latihanData = JSON.parse(fs.readFileSync(LATIHAN_DATA_FILE, 'utf8'));

let updated = 0;
latihanData.forEach(lAyah => {
  if (!lAyah.kata_per_kata || lAyah.kata_per_kata.length === 0) return;
  const firstId = lAyah.kata_per_kata[0].id_kata;
  const parts = firstId.split(':');
  const sId = parseInt(parts[0], 10);
  const aId = parseInt(parts[1] || lAyah.ayat, 10);

  const surah = masterSurahs.find(s => s.id === sId);
  if (surah) {
    const ayah = surah.ayat.find(a => a.ayat_id === aId);
    if (ayah) {
      lAyah.kata_per_kata = JSON.parse(JSON.stringify(ayah.kata_per_kata));
      updated++;
    }
  }
});

console.log(`Updated ${updated}/${latihanData.length} training items in latihan datasets!`);
fs.writeFileSync(LATIHAN_DATA_FILE, JSON.stringify(latihanData, null, 2), 'utf8');
fs.writeFileSync(LATIHAN_APP_FILE, JSON.stringify(latihanData, null, 2), 'utf8');
console.log('Saved both latihan data files.');
