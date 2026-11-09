/**
 * Utilitas Lisensi Al-Miftah PRO (Sekali Bayar Seumur Hidup - 1 Device 1 Code)
 * Terinspirasi dari sistem Al-Fashih: Kriptografi deterministik offline + Single Device Lock.
 */

const STORAGE_KEY = 'almiftah_license_pro_v1';
const DEVICE_KEY = 'almiftah_device_id';
const SECRET_SALT = 'ALMIFTAH_PRO_LIFETIME_DEVICE_SALT_2026';

// Kunci Master Khusus Pemilik & Pengembang (Akses Super Admin di Semua Perangkat)
export const ADMIN_MASTER_KEYS = [
  'MFT-VIP-USTADZ-2026',
  'MFT-OWNER-2026',
  'ADMIN-ALMIFTAH-2026',
  'ALMIFTAH-ADMIN-VIP',
  'MFT-PRO-LIFETIME-DEV'
];

/**
 * Hash fnv1a untuk checksum deterministik
 */
function fnv1aHex(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(-4);
}

/**
 * Hitung checksum untuk kode perangkat
 */
export function computeChecksum(part) {
  const clean = (part + SECRET_SALT).toUpperCase();
  return fnv1aHex(clean);
}

/**
 * Dapatkan atau buat ID Perangkat unik (Format: DEV-XXXXXX)
 */
export function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (id && /^DEV-[A-Z0-9]{6}$/.test(id)) {
      return id;
    }
    return ensureDeviceId();
  } catch {
    return 'DEV-MFT892';
  }
}

export function ensureDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (id && /^DEV-[A-Z0-9]{6}$/.test(id)) {
      return id;
    }

    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const navStr = typeof navigator !== 'undefined' 
      ? (navigator.userAgent + navigator.language + (navigator.hardwareConcurrency || '')) 
      : '';
    const scrStr = typeof screen !== 'undefined' 
      ? (screen.width + 'x' + screen.height + screen.colorDepth) 
      : '';
    const raw = navStr + scrStr + Date.now() + Math.random();

    let hash = 0x811c9dc5;
    for (let i = 0; i < raw.length; i++) {
      hash ^= raw.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }

    let code = '';
    let hVal = Math.abs(hash);
    for (let i = 0; i < 6; i++) {
      code += chars.charAt((hVal + i * 7 + Math.floor(Math.random() * 5)) % chars.length);
      hVal = Math.floor(hVal / chars.length) || (hVal + 19);
    }

    id = `DEV-${code}`;
    localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return 'DEV-MFT892';
  }
}

/**
 * Generator Lisensi Terkunci 1 Perangkat untuk Pembeli (Admin Generator)
 */
export function generateDeviceBoundKey(targetDeviceInput) {
  if (!targetDeviceInput) return null;
  const clean = targetDeviceInput.trim().toUpperCase().replace('DEV-', '').replace(/[^A-Z0-9]/g, '');
  if (clean.length !== 6) return null;
  const chk = computeChecksum(clean);
  return `MFT-PRO-${clean}-${chk}`;
}

/**
 * Generator Lisensi Bebas / Universal (Dapat dipakai di semua perangkat)
 */
export function generateUniversalKey() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let part = '';
  for (let i = 0; i < 6; i++) {
    part += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const chk = computeChecksum(`UNI-${part}`);
  return `MFT-UNI-${part}-${chk}`;
}

/**
 * Verifikasi Kode Lisensi
 */
export function verifyLicenseKey(rawKey) {
  if (!rawKey) return { valid: false, reason: 'Silakan masukkan kode lisensi.' };
  const key = rawKey.trim().toUpperCase();

  // 1. Kunci Master Super Admin
  if (ADMIN_MASTER_KEYS.includes(key)) {
    return {
      valid: true,
      role: 'admin',
      plan: 'SUPER_ADMIN',
      message: '👑 Kunci Master Super Admin Diterima! Akses Penuh Aktif.'
    };
  }

  // 2. Kode Terkunci Perangkat: MFT-PRO-[DEVID6]-[CHKSUM4] atau MFT-50K-[DEVID6]-[CHKSUM4]
  const boundMatch = key.match(/^MFT-(?:PRO|50K)-([A-Z0-9]{6})-([A-Z0-9]{4})$/i);
  if (boundMatch) {
    const targetDevCode = boundMatch[1];
    const chk = boundMatch[2];

    if (computeChecksum(targetDevCode) !== chk) {
      return {
        valid: false,
        reason: 'Kode lisensi tidak valid. Periksa kembali huruf dan angka kode Anda.'
      };
    }

    const currentDevId = getDeviceId();
    const currentDevCode = currentDevId.replace('DEV-', '');

    if (targetDevCode !== currentDevCode) {
      return {
        valid: false,
        reason: `❌ Kode lisensi ini dikunci khusus untuk perangkat DEV-${targetDevCode}. ID Perangkat Anda saat ini adalah ${currentDevId}. Satu kode hanya untuk 1 perangkat.`
      };
    }

    return {
      valid: true,
      role: 'student',
      plan: 'LIFETIME',
      message: `✅ Lisensi Al-Miftah PRO Terverifikasi Khusus untuk Perangkat Anda (${currentDevId})!`
    };
  }

  // 3. Kode Universal: MFT-UNI-[CODE6]-[CHKSUM4]
  const uniMatch = key.match(/^MFT-UNI-([A-Z0-9]{6})-([A-Z0-9]{4})$/i);
  if (uniMatch) {
    const code = uniMatch[1];
    const chk = uniMatch[2];
    if (computeChecksum(`UNI-${code}`) === chk) {
      return {
        valid: true,
        role: 'student',
        plan: 'LIFETIME_UNIVERSAL',
        message: '✅ Lisensi Al-Miftah PRO Universal Berhasil Aktif!'
      };
    }
  }

  // 4. Fallback format 4 bagian lama: MFT-XXXX-YYYY-ZZZZ
  const legacyParts = key.split('-');
  if (legacyParts.length === 4 && legacyParts[0] === 'MFT') {
    const [, p1, p2, checksum] = legacyParts;
    const expected = fnv1aHex(`MFT:${p1}:${p2}:${SECRET_SALT}`);
    if (checksum === expected) {
      return {
        valid: true,
        role: 'student',
        plan: 'LIFETIME',
        message: '✅ Lisensi Al-Miftah PRO Seumur Hidup Berhasil Aktif!'
      };
    }
  }

  return {
    valid: false,
    reason: 'Format kode lisensi salah atau tidak terdaftar. Hubungi Admin jika Anda sudah transfer.'
  };
}

/**
 * Dapatkan status lisensi saat ini
 */
export function getLicenseStatus() {
  try {
    ensureDeviceId();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isPro: false, isAdmin: false, key: null, deviceId: getDeviceId() };
    const data = JSON.parse(raw);
    const verify = verifyLicenseKey(data.key);
    if (!data.key || !verify.valid) {
      localStorage.removeItem(STORAGE_KEY);
      return { isPro: false, isAdmin: false, key: null, deviceId: getDeviceId() };
    }
    return {
      isPro: true,
      isAdmin: verify.role === 'admin' || data.isAdmin === true,
      role: verify.role || data.role || 'student',
      plan: verify.plan || data.plan || 'LIFETIME',
      key: data.key,
      deviceId: getDeviceId(),
      activatedAt: data.activatedAt
    };
  } catch {
    return { isPro: false, isAdmin: false, key: null, deviceId: getDeviceId() };
  }
}

/**
 * Aktivasi lisensi dari input pengguna
 */
export function activateLicense(rawKey) {
  const key = (rawKey || '').trim().toUpperCase();
  const verify = verifyLicenseKey(key);

  if (!verify.valid) {
    return {
      success: false,
      message: verify.reason || 'Kode lisensi tidak valid.'
    };
  }

  try {
    const payload = {
      key,
      isAdmin: verify.role === 'admin',
      role: verify.role,
      plan: verify.plan,
      deviceId: getDeviceId(),
      activatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return {
      success: true,
      isAdmin: verify.role === 'admin',
      message: verify.message || 'Alhamdulillah! Akses Al-Miftah PRO seumur hidup berhasil aktif.'
    };
  } catch {
    return {
      success: false,
      message: 'Terjadi kendala saat menyimpan aktivasi di peramban.'
    };
  }
}

/**
 * Aktivasi instan mode Admin / Pemilik
 */
export function activateAdminDirect() {
  try {
    const payload = {
      key: 'MFT-OWNER-2026',
      isAdmin: true,
      role: 'admin',
      plan: 'SUPER_ADMIN',
      deviceId: getDeviceId(),
      activatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return { success: true, message: 'Status Super Admin Berhasil Aktif!' };
  } catch {
    return { success: false, message: 'Gagal mengaktifkan mode admin.' };
  }
}

/**
 * Reset lisensi ke status gratis (untuk pengujian)
 */
export function resetLicense() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Template Chat WhatsApp untuk Admin membalas Pembeli
 */
export function buildWhatsAppReplyTemplate(key, targetDevice) {
  const dev = targetDevice || getDeviceId();
  return `Alhamdulillah, pembayaran Rp 49.000 telah kami terima.

Berikut Kode Aktivasi Al-Miftah PRO Lifetime Anda:
🔑 *${key}*
📱 *Terkunci Khusus Perangkat Anda:* ${dev}

Cara Mengaktifkan:
1. Buka aplikasi Al-Miftah di browser HP / Laptop Anda (${dev}).
2. Klik tombol "👑 Beli PRO / Masukkan Lisensi".
3. Pilih tab "🔑 Masukkan Kode Lisensi".
4. Masukkan kode di atas, lalu klik "Aktifkan Akses PRO Sekarang".

(Catatan: Kode ini dikunci secara kriptografis untuk 1 perangkat Anda agar aman seumur hidup).
Selamat belajar Nahwu & Sharaf dan mendalami 6.236 ayat Al-Qur'an! 🌟`;
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
