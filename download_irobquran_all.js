const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const OUT_DIR = path.join(BASE_DIR, 'data', 'irobquran');
const SURAHS_FILE = path.join(BASE_DIR, 'data', 'irobquran_surahs.json');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function extractSurahJson(rscText) {
  const marker = '{"surah":{"id":';
  const startIdx = rscText.indexOf(marker);
  if (startIdx === -1) {
    throw new Error('Marker {"surah":{"id": not found in response');
  }

  const surahStart = startIdx + '{"surah":'.length;
  let depth = 0;
  let inString = false;
  let isEscaped = false;
  let endIdx = -1;

  for (let i = surahStart; i < rscText.length; i++) {
    const ch = rscText[i];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (ch === '\\') {
      isEscaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (ch === '{') {
        depth++;
      } else if (ch === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
  }

  if (endIdx === -1) {
    throw new Error('Could not find closing brace for surah object');
  }

  const jsonStr = rscText.slice(surahStart, endIdx);
  return JSON.parse(jsonStr);
}

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'RSC': '1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return await res.text();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

async function getSurahList() {
  if (fs.existsSync(SURAHS_FILE)) {
    return JSON.parse(fs.readFileSync(SURAHS_FILE, 'utf8'));
  }
  console.log('Fetching surahs list from API...');
  const res = await fetch('https://irob.apix.my.id/api/v1/surahs', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const data = await res.json();
  fs.writeFileSync(SURAHS_FILE, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

async function main() {
  const surahs = await getSurahList();
  console.log(`Starting download of ${surahs.length} surahs from irobquran.com into ${OUT_DIR}...`);
  const concurrency = 4;
  let downloaded = 0;
  let skipped = 0;
  let errors = [];

  for (let i = 0; i < surahs.length; i += concurrency) {
    const batch = surahs.slice(i, i + concurrency);
    await Promise.all(batch.map(async (surah) => {
      const targetFile = path.join(OUT_DIR, `surah_${surah.id}.json`);
      if (fs.existsSync(targetFile)) {
        try {
          const existing = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
          if (existing.id === surah.id && existing.ayats && existing.ayats.length > 0) {
            skipped++;
            return;
          }
        } catch (e) {
          // Re-download if invalid JSON
        }
      }

      const url = `https://irobquran.com/${surah.slug}`;
      try {
        const text = await fetchWithRetry(url);
        const data = extractSurahJson(text);
        fs.writeFileSync(targetFile, JSON.stringify(data, null, 2), 'utf8');
        downloaded++;
      } catch (err) {
        console.error(`Error downloading Surah ${surah.id} (${surah.slug}):`, err.message);
        errors.push({ id: surah.id, slug: surah.slug, error: err.message });
      }
    }));

    const progress = Math.min(i + concurrency, surahs.length);
    if (progress % 10 === 0 || progress === surahs.length) {
      console.log(`[Progress ${progress}/${surahs.length}] Downloaded: ${downloaded}, Skipped: ${skipped}, Errors: ${errors.length}`);
    }
  }

  console.log(`\nDownload finished! Total downloaded: ${downloaded}, Skipped: ${skipped}, Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Failed surahs:', errors);
  }
}

main().catch(console.error);
