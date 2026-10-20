# Al-Miftah (الْمِفْتَاح فِي النَّحْوِ وَالصَّرْفِ التَّطْبِيقِي)

**Al-Miftah** adalah aplikasi web progresif (PWA) interaktif untuk pembelajaran Gramatika Bahasa Arab tingkat lanjut yang memadukan kepraktisan metodologis kitab *An-Nahwu At-Tathbiqi* karya Dr. Khalid Abdul Aziz dan kedalaman ensiklopedis *Jami'ud Durus Al-'Arabiyyah* karya Syaikh Musthafa Al-Ghalayini.

![PWA Android Ready](https://img.shields.io/badge/PWA-Android%20Ready-064E3B?style=for-the-badge&logo=android)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

---

## ✨ Fitur Unggulan

1. **📖 42 Bab Kurikulum Nahwu & Sharaf Komprehensif**
   - Dilengkapi modul penjelasan ramah pemula (*Awam-Friendly*) dengan analogi bahasa Indonesia, tabel ringkasan, dan peringatan jebakan i'rab yang sering terjadi.
   - 149 sub-kaidah terstruktur rapi.

2. **🕌 Mushaf I'rab Al-Qur'an 30 Juz (114 Surah & 6.236 Ayat)**
   - Analisis kedudukan kata (*i'rab*), harakat, tanda i'rab (*'alamat*), dan alasan gramatika klasik (*sabab*).
   - Dilengkapi filter tanda i'rab (Dhommah, Fathah, Kasrah, Sukun, Hadzf, dll) serta pencarian ayat instan.

3. **⚡ Studio I'rab & Bedah Kalimat Interaktif**
   - Analisis mandiri struktur kalimat isimiyah dan fi'liyah dengan visualisasi kedudukan i'rab secara modular.

4. **✨ Asrar I'rab & Balaghah**
   - Membedah rahasia keindahan sastra Al-Qur'an dan hikmah di balik pilihan struktur gramatika tertentu.

5. **🏛️ Khazanah Dalil Syahid & Evaluasi HOTS**
   - 119 dalil syahid i'rab dari Al-Qur'an dan syair Arab klasik.
   - 80 soal kuis evaluasi bertingkat (*Higher Order Thinking Skills*).
   - 63 entri Mu'jam / Kamus istilah gramatika Arab.

6. **📱 Progressive Web App (PWA) & Optimasi Android**
   - **Standalone App**: Dapat diinstal di Android seperti aplikasi native (tanpa address bar browser).
   - **Offline-First**: Service Worker mandiri untuk caching aset inti, font kaligrafi, dan dataset Al-Qur'an.
   - **Thumb-Friendly Navigation**: Bottom navigation bar melayang dengan efek frosted glass yang nyaman dioperasikan satu jempol.
   - **Safe-Area Insets**: Kompatibel dengan *gesture bar* dan *camera notch* Android modern.

---

## 🚀 Panduan Menjalankan Lokal

```bash
# Clone repositori
git clone https://github.com/muhammadmushab895-svg/al-miftah-nahwu-sharaf.git
cd al-miftah-nahwu-sharaf

# Install dependensi frontend
cd app
npm install

# Jalankan server pengembangan lokal
npm run dev
```

Buka peramban di `http://localhost:5173`.

---

## ⚡ Deployment ke Vercel

Aplikasi ini sudah dilengkapi dengan file `vercel.json` siap pakai untuk deployment satu kali klik.

1. Hubungkan repositori ini ke akun Vercel Anda di [vercel.com](https://vercel.com).
2. Framework Preset akan otomatis terdeteksi sebagai **Vite**.
3. Klik **Deploy** — seluruh PWA manifest, service worker, rewrite SPA, dan aset akan aktif seketika.

---

## 📜 Lisensi & Hak Cipta
Dirancang dan didedikasikan untuk kaum muslimin, santri, asatidz, dan seluruh penuntut ilmu bahasa Arab Al-Qur'an.
