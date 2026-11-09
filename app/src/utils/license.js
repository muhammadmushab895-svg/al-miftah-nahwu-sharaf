/**
 * Utilitas Lisensi Al-Miftah PRO (Sekali Bayar Seumur Hidup)
 * Menggunakan verifikasi offline kriptografis deterministik.
 */

const STORAGE_KEY = 'almiftah_license_pro_v1';
const SECRET_SALT = 'ALMIFTAH_PRO_LIFETIME_SECRET_KEY_2026';

// Kunci Master Pengembang & Ustadz (Bypass Demo)
const VIP_KEYS = new Set([
  'MFT-VIP-USTADZ-2026',
  'MFT-PRO-LIFETIME-DEV',
  'MFT-DEMO-TEST-9999'
]);

function hashString(str) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c64e6d;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const combined = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
  return combined.padStart(4, '0').slice(-4);
}

export function calculateChecksum(p1, p2) {
  return hashString(`MFT:${p1}:${p2}:${SECRET_SALT}`);
}

export function verifyLicenseKey(rawKey) {
  if (!rawKey) return false;
  const key = rawKey.trim().toUpperCase();

  if (VIP_KEYS.has(key)) return true;

  const parts = key.split('-');
  if (parts.length !== 4) return false;

  const [prefix, p1, p2, checksum] = parts;
  if (prefix !== 'MFT') return false;
  if (p1.length !== 4 || p2.length !== 4 || checksum.length !== 4) return false;

  return checksum === calculateChecksum(p1, p2);
}

export function getLicenseStatus() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isPro: false, key: null };
    const data = JSON.parse(raw);
    if (!data.key || !verifyLicenseKey(data.key)) {
      localStorage.removeItem(STORAGE_KEY);
      return { isPro: false, key: null };
    }
    return { isPro: true, key: data.key, activatedAt: data.activatedAt };
  } catch {
    return { isPro: false, key: null };
  }
}

export function activateLicense(rawKey) {
  const key = (rawKey || '').trim().toUpperCase();
  if (!verifyLicenseKey(key)) {
    return {
      success: false,
      message: 'Kode lisensi tidak valid. Periksa format MFT-XXXX-YYYY-ZZZZ.'
    };
  }

  try {
    const payload = {
      key,
      activatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return {
      success: true,
      message: 'Alhamdulillah! Akses Al-Miftah PRO seumur hidup berhasil aktif.'
    };
  } catch {
    return {
      success: false,
      message: 'Terjadi kendala saat menyimpan aktivasi di peramban.'
    };
  }
}

/**
 * Aturan Akses Gratis Materi (Cukup 3 Bab Saja):
 * Bab 1, Bab 2, Bab 3 (index 0, 1, 2) = GRATIS
 * Bab 4 s/d 42 = BERBAYAR
 */
export function isBabFree(babIndex) {
  return babIndex < 3;
}

/**
 * Aturan Akses Gratis I'rab Al-Qur'an:
 * - 1/2 dari Juz 1:
 *     - Surah 1 (Al-Fatihah, ayat 1-7): GRATIS
 *     - Surah 2 (Al-Baqarah, ayat 1 s/d 74): GRATIS
 * - 1/2 dari Juz 30:
 *     - Surah 94 (Asy-Syarh) s/d 114 (An-Nas) [21 surah pendek paruh akhir Juz 30]: GRATIS
 * - Sisanya berbayar (Khusus Al-Miftah PRO).
 */
export function isAyahFree(surahId, ayahId) {
  const sId = parseInt(surahId, 10);
  const aId = parseInt(ayahId, 10);

  // Paruh pertama Juz 1
  if (sId === 1) return true; // Al-Fatihah
  if (sId === 2 && aId <= 74) return true; // Al-Baqarah 1-74

  // Paruh akhir Juz 30 (Surah pendek Juz Amma 94-114)
  if (sId >= 94 && sId <= 114) return true;

  return false;
}

export function isSurahFree(surahId) {
  const sId = parseInt(surahId, 10);
  if (sId === 1) return true;
  if (sId === 2) return true; // Sebagian gratis
  if (sId >= 94 && sId <= 114) return true;
  return false;
}
