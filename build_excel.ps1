$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DataDir = Join-Path $BaseDir "data"
$PartsDir = Join-Path $DataDir "parts"
$OutputXlsx = Join-Path $BaseDir "Database_Materi_Nahwu_Tathbiqi_Jami_Durus.xlsx"

# Jika ada file di data/parts/part_*.json, gabungkan secara berurutan ke file master JSON
if (Test-Path $PartsDir) {
    $partFiles = Get-ChildItem -Path $PartsDir -Filter "part_*.json" | Sort-Object Name
    if ($partFiles.Count -gt 0) {
        $allBab = New-Object System.Collections.Generic.List[object]
        $allMateri = New-Object System.Collections.Generic.List[object]
        $allIrab = New-Object System.Collections.Generic.List[object]
        $allSoal = New-Object System.Collections.Generic.List[object]
        $allIstilah = New-Object System.Collections.Generic.List[object]

        foreach ($pf in $partFiles) {
            Write-Host "Membaca part: $($pf.Name)..."
            $pObj = Get-Content $pf.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
            if ($pObj.bab) { foreach ($item in $pObj.bab) { $allBab.Add($item) } }
            if ($pObj.materi) { foreach ($item in $pObj.materi) { $allMateri.Add($item) } }
            if ($pObj.irab) { foreach ($item in $pObj.irab) { $allIrab.Add($item) } }
            if ($pObj.soal) { foreach ($item in $pObj.soal) { $allSoal.Add($item) } }
            if ($pObj.istilah) { foreach ($item in $pObj.istilah) { $allIstilah.Add($item) } }
        }

        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText((Join-Path $DataDir "01_kurikulum_bab.json"), ($allBab | ConvertTo-Json -Depth 10), $utf8NoBom)
        [System.IO.File]::WriteAllText((Join-Path $DataDir "02_materi_kaidah.json"), ($allMateri | ConvertTo-Json -Depth 10), $utf8NoBom)
        [System.IO.File]::WriteAllText((Join-Path $DataDir "03_contoh_dan_irab.json"), ($allIrab | ConvertTo-Json -Depth 10), $utf8NoBom)
        [System.IO.File]::WriteAllText((Join-Path $DataDir "04_bank_soal.json"), ($allSoal | ConvertTo-Json -Depth 10), $utf8NoBom)
        [System.IO.File]::WriteAllText((Join-Path $DataDir "05_kamus_istilah.json"), ($allIstilah | ConvertTo-Json -Depth 10), $utf8NoBom)
    }
}

function Get-ColLetter([int]$idx) {
    $res = ""
    while ($idx -gt 0) {
        $rem = ($idx - 1) % 26
        $res = [char](65 + $rem) + $res
        $idx = [math]::Floor(($idx - 1) / 26)
    }
    return $res
}

function Escape-Xml([string]$text) {
    if ($null -eq $text) { return "" }
    return [System.Security.SecurityElement]::Escape($text)
}

function Build-SheetXml($headers, $rows) {
    $numCols = $headers.Count
    $numRows = $rows.Count + 1
    $lastCol = Get-ColLetter $numCols
    $dimension = "A1:$lastCol$numRows"

    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')
    [void]$sb.AppendLine('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">')
    [void]$sb.AppendLine("  <dimension ref=`"$dimension`"/>")
    [void]$sb.AppendLine('  <sheetViews><sheetView tabSelected="0" workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>')
    [void]$sb.AppendLine('  <sheetFormatPr defaultRowHeight="26"/>')
    [void]$sb.AppendLine('  <cols>')
    for ($i = 0; $i -lt $numCols; $i++) {
        $colNum = $i + 1
        $w = $headers[$i].Width
        [void]$sb.AppendLine("    <col min=`"$colNum`" max=`"$colNum`" width=`"$w`" customWidth=`"1`"/>")
    }
    [void]$sb.AppendLine('  </cols>')
    [void]$sb.AppendLine('  <sheetData>')

    # Row 1: Header
    [void]$sb.Append('    <row r="1" ht="32" customHeight="1">')
    for ($c = 0; $c -lt $numCols; $c++) {
        $ref = (Get-ColLetter ($c + 1)) + "1"
        $title = Escape-Xml $headers[$c].Title
        [void]$sb.Append("<c r=`"$ref`" t=`"inlineStr`" s=`"1`"><is><t>$title</t></is></c>")
    }
    [void]$sb.AppendLine('</row>')

    # Data rows
    for ($r = 0; $r -lt $rows.Count; $r++) {
        $rowNum = $r + 2
        $isEven = ($rowNum % 2 -eq 0)
        $rowObj = $rows[$r]
        [void]$sb.Append("    <row r=`"$rowNum`">")
        for ($c = 0; $c -lt $numCols; $c++) {
            $key = $headers[$c].Key
            $ref = (Get-ColLetter ($c + 1)) + "$rowNum"
            $val = $rowObj.$key
            if ($null -eq $val) { $val = "" }
            if ($val -is [int] -or $val -is [long] -or $val -is [double]) {
                $s = if ($isEven) { "2" } else { "3" }
                [void]$sb.Append("<c r=`"$ref`" s=`"$s`"><v>$val</v></c>")
            } else {
                $isArabic = ($key -match "arab|kalimat_arab|kata_kunci|istilah_arab")
                if ($isArabic) {
                    $s = if ($isEven) { "4" } else { "5" }
                } else {
                    $s = if ($isEven) { "2" } else { "3" }
                }
                $escaped = Escape-Xml ([string]$val)
                [void]$sb.Append("<c r=`"$ref`" t=`"inlineStr`" s=`"$s`"><is><t>$escaped</t></is></c>")
            }
        }
        [void]$sb.AppendLine('</row>')
    }

    [void]$sb.AppendLine('  </sheetData>')
    [void]$sb.AppendLine("  <autoFilter ref=`"$dimension`"/>")
    [void]$sb.AppendLine('</worksheet>')
    return $sb.ToString()
}

$stylesXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><sz val="11"/><color rgb="FF1F2937"/><name val="Segoe UI"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Segoe UI"/></font>
    <font><b/><sz val="13"/><color rgb="FF064E3B"/><name val="Traditional Arabic"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1B5E20"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF1F8E9"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="6">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="top" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="top" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="right" vertical="top" wrapText="1" readingOrder="2"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="right" vertical="top" wrapText="1" readingOrder="2"/>
    </xf>
  </cellXfs>
</styleSheet>
'@

$kurikulum = Get-Content (Join-Path $DataDir "01_kurikulum_bab.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$materi    = Get-Content (Join-Path $DataDir "02_materi_kaidah.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$irab      = Get-Content (Join-Path $DataDir "03_contoh_dan_irab.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$soal      = Get-Content (Join-Path $DataDir "04_bank_soal.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$istilah   = Get-Content (Join-Path $DataDir "05_kamus_istilah.json") -Raw -Encoding UTF8 | ConvertFrom-Json

$seluruhQuranRaw = if (Test-Path (Join-Path $DataDir "06_seluruh_ayat_quran_6236.json")) {
    Write-Host "Memuat seluruh 6,236 ayat Al-Qur'an (114 Surah)..."
    Get-Content (Join-Path $DataDir "06_seluruh_ayat_quran_6236.json") -Raw -Encoding UTF8 | ConvertFrom-Json
} else { @() }

$latihanQuranRaw = if (Test-Path (Join-Path $DataDir "06_latihan_quran.json")) {
    Get-Content (Join-Path $DataDir "06_latihan_quran.json") -Raw -Encoding UTF8 | ConvertFrom-Json
} else { @() }

$latihanQuranFlat = @()
foreach ($lq in $latihanQuranRaw) {
    $bedahNahwu = ($lq.kata_per_kata | ForEach-Object {
        "[$($_.kata_arab)] Status: $($_.status_hukum) | I'rab: $($_.kedudukan_irab) | Tanda: $($_.tanda_irab)"
    }) -join "`n"

    $bedahSharaf = ($lq.kata_per_kata | ForEach-Object {
        "[$($_.kata_arab)] Jenis: $($_.jenis_kata_sharaf) | Wazan: $($_.wazan_sharaf) | Akar: $($_.akar_kata) ($($_.jenis_bina)) | Morfologi: $($_.keterangan_sharaf)"
    }) -join "`n"

    $latihanQuranFlat += [PSCustomObject]@{
        id_latihan = $lq.id_latihan
        surah_ayat = "$($lq.surah): $($lq.ayat) (Juz $($lq.juz))"
        teks_ayat_arab = $lq.teks_ayat_arab
        terjemahan_indo = $lq.terjemahan_indo
        kategori_binyah = $lq.kategori_binyah
        fokus_bab_nahwu = $lq.fokus_bab_nahwu
        kata_kunci_syahid = $lq.kata_kunci_syahid
        rincian_irab_tathbiqi = $lq.rincian_irab_tathbiqi
        bedah_nahwu_kata = $bedahNahwu
        bedah_sharaf_kata = $bedahSharaf
        pertanyaan = $lq.pertanyaan_latihan.pertanyaan
        opsi_a = $lq.pertanyaan_latihan.opsi_a
        opsi_b = $lq.pertanyaan_latihan.opsi_b
        opsi_c = $lq.pertanyaan_latihan.opsi_c
        opsi_d = $lq.pertanyaan_latihan.opsi_d
        jawaban_benar = $lq.pertanyaan_latihan.jawaban_benar
        pembahasan = $lq.pertanyaan_latihan.pembahasan
    }
}

$sheets = @(
    @{
        Name = "1_Kurikulum_Bab"
        Rows = $kurikulum
        Headers = @(
            @{Key="id_bab"; Title="ID Bab"; Width=12},
            @{Key="urutan"; Title="Urutan"; Width=9},
            @{Key="kategori"; Title="Kategori Ilmu"; Width=28},
            @{Key="level"; Title="Level / Tingkatan"; Width=20},
            @{Key="judul_arab"; Title="Judul Bab (Arab)"; Width=44},
            @{Key="judul_indo"; Title="Judul Bab (Indonesia)"; Width=48},
            @{Key="ref_nahwu_tathbiqi"; Title="Referensi An-Nahwu At-Tathbiqi"; Width=42},
            @{Key="ref_jami_durus"; Title="Referensi Jami'ud Durus Al-Arabiyyah"; Width=44},
            @{Key="ringkasan_cakupan"; Title="Ringkasan Cakupan Materi Mendalam"; Width=60},
            @{Key="estimasi_jam_belajar"; Title="Estimasi Jam"; Width=14}
        )
    },
    @{
        Name = "2_Materi_dan_Kaidah"
        Rows = $materi
        Headers = @(
            @{Key="id_materi"; Title="ID Materi"; Width=14},
            @{Key="id_bab"; Title="ID Bab"; Width=12},
            @{Key="sub_topik_arab"; Title="Sub-Topik (Arab)"; Width=40},
            @{Key="sub_topik_indo"; Title="Sub-Topik (Indonesia)"; Width=42},
            @{Key="kaidah_arab"; Title="Teks & Rumus Kaidah (Bahasa Arab)"; Width=60},
            @{Key="penjelasan_indo"; Title="Penjelasan Mendalam (Bahasa Indonesia)"; Width=65},
            @{Key="rincian_hukum_dan_syarat"; Title="Rincian Hukum, Syarat & Klasifikasi"; Width=62},
            @{Key="rumus_ringkas"; Title="Rumus Cepat / Kunci Hafalan"; Width=48},
            @{Key="tanbihat_dan_khilaf"; Title="Tanbihat Nahwu Tathbiqi & Khilaf Ulama (Jami'ud Durus)"; Width=62}
        )
    },
    @{
        Name = "3_Contoh_dan_Irab"
        Rows = $irab
        Headers = @(
            @{Key="id_contoh"; Title="ID Contoh"; Width=14},
            @{Key="id_bab"; Title="ID Bab"; Width=12},
            @{Key="id_materi"; Title="ID Materi"; Width=14},
            @{Key="jenis_dalil"; Title="Jenis Syahid / Contoh"; Width=22},
            @{Key="sumber_dalil"; Title="Sumber / Referensi Kitab"; Width=34},
            @{Key="kalimat_arab"; Title="Contoh Kalimat / Ayat / Syair (Arab)"; Width=48},
            @{Key="terjemahan_indo"; Title="Terjemahan Indonesia"; Width=45},
            @{Key="kata_kunci"; Title="Kata Kunci (Mahal Syahid)"; Width=30},
            @{Key="irab_arab"; Title="Tathbiq I'rab Lengkap (Bahasa Arab)"; Width=62},
            @{Key="penjelasan_irab_indo"; Title="Analisis & Penjelasan I'rab Mendalam (Indonesia)"; Width=62}
        )
    },
    @{
        Name = "4_Bank_Soal"
        Rows = $soal
        Headers = @(
            @{Key="id_soal"; Title="ID Soal"; Width=14},
            @{Key="id_bab"; Title="ID Bab"; Width=12},
            @{Key="tingkat_kesulitan"; Title="Tingkat Kesulitan"; Width=18},
            @{Key="pertanyaan"; Title="Pertanyaan Kuis / Evaluasi"; Width=58},
            @{Key="opsi_a"; Title="Opsi A"; Width=36},
            @{Key="opsi_b"; Title="Opsi B"; Width=36},
            @{Key="opsi_c"; Title="Opsi C"; Width=36},
            @{Key="opsi_d"; Title="Opsi D"; Width=36},
            @{Key="jawaban_benar"; Title="Kunci Jawaban"; Width=15},
            @{Key="pembahasan"; Title="Pembahasan & Alasan Kaidah Mendalam"; Width=62}
        )
    },
    @{
        Name = "5_Kamus_Istilah"
        Rows = $istilah
        Headers = @(
            @{Key="id_istilah"; Title="ID Istilah"; Width=14},
            @{Key="istilah_arab"; Title="Istilah (Arab & Transliterasi)"; Width=36},
            @{Key="bidang"; Title="Bidang"; Width=18},
            @{Key="definisi_arab"; Title="Ta'rif / Definisi (Bahasa Arab)"; Width=55},
            @{Key="definisi_indo"; Title="Definisi & Penjelasan (Bahasa Indonesia)"; Width=58},
            @{Key="contoh"; Title="Contoh Penerapan"; Width=48}
        )
    },
    @{
        Name = "6_Seluruh_Ayat_Quran_6236"
        Rows = $seluruhQuranRaw
        Headers = @(
            @{Key="id_ayat"; Title="ID Ayat"; Width=16},
            @{Key="surah_ayat"; Title="Surah & Ayat Al-Qur'an"; Width=36},
            @{Key="teks_ayat_arab"; Title="Teks Ayat Al-Qur'an (Arab)"; Width=55},
            @{Key="total_kata"; Title="Total Kata"; Width=12},
            @{Key="bedah_nahwu_setiap_kata"; Title="Bedah I'rab Nahwu Setiap Kata (Lengkap)"; Width=85},
            @{Key="bedah_sharaf_setiap_kata"; Title="Bedah Morfologi & Wazan Sharaf Setiap Kata (Lengkap)"; Width=90}
        )
    },
    @{
        Name = "7_Latihan_Tematik_520"
        Rows = $latihanQuranFlat
        Headers = @(
            @{Key="id_latihan"; Title="ID Latihan"; Width=14},
            @{Key="surah_ayat"; Title="Surah & Ayat"; Width=24},
            @{Key="teks_ayat_arab"; Title="Teks Ayat Al-Qur'an (Arab)"; Width=52},
            @{Key="terjemahan_indo"; Title="Terjemahan Ayat (Indonesia)"; Width=45},
            @{Key="kategori_binyah"; Title="Kategori Binyah Kalimat"; Width=32},
            @{Key="fokus_bab_nahwu"; Title="Fokus Bab Nahwu"; Width=24},
            @{Key="kata_kunci_syahid"; Title="Lafazh / Kalimat Syahid"; Width=28},
            @{Key="rincian_irab_tathbiqi"; Title="Tathbiq I'rab Kalimat (Nahwu Tathbiqi)"; Width=65},
            @{Key="bedah_nahwu_kata"; Title="Bedah I'rab Nahwu Setiap Kata (Lengkap)"; Width=75},
            @{Key="bedah_sharaf_kata"; Title="Bedah Morfologi & Wazan Sharaf Setiap Kata (Lengkap)"; Width=80},
            @{Key="pertanyaan"; Title="Pertanyaan Tantangan I'rab & Sharaf"; Width=55},
            @{Key="opsi_a"; Title="Opsi A"; Width=35},
            @{Key="opsi_b"; Title="Opsi B"; Width=35},
            @{Key="opsi_c"; Title="Opsi C"; Width=35},
            @{Key="opsi_d"; Title="Opsi D"; Width=35},
            @{Key="jawaban_benar"; Title="Kunci Jawaban"; Width=15},
            @{Key="pembahasan"; Title="Pembahasan Kaidah Al-Qur'an (Nahwu & Sharaf)"; Width=65}
        )
    }
)

$TargetXlsx = $OutputXlsx
try {
    if (Test-Path $OutputXlsx) {
        $testStream = [System.IO.File]::Open($OutputXlsx, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
        $testStream.Close()
        Remove-Item $OutputXlsx -Force
    }
} catch {
    Write-Warning "File '$OutputXlsx' sedang dibuka di Microsoft Excel oleh pengguna. Menyimpan ke file baru: 'Database_Materi_Nahwu_Tathbiqi_Jami_Durus_Lengkap.xlsx'"
    $TargetXlsx = Join-Path $BaseDir "Database_Materi_Nahwu_Tathbiqi_Jami_Durus_Lengkap.xlsx"
    if (Test-Path $TargetXlsx) { Remove-Item $TargetXlsx -Force }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$fs = New-Object System.IO.FileStream($TargetXlsx, [System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)

function Add-ZipText($zipArchive, [string]$entryPath, [string]$content) {
    $entry = $zipArchive.CreateEntry($entryPath)
    $stream = $entry.Open()
    $bytes = $utf8NoBom.GetBytes($content)
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
}

$sheetOverrides = ($sheets | ForEach-Object {
    $idx = [array]::IndexOf($sheets, $_) + 1
    "  <Override PartName=`"/xl/worksheets/sheet$idx.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml`"/>"
}) -join "`n"

$contentTypes = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
$sheetOverrides
</Types>
"@
Add-ZipText $zip "[Content_Types].xml" $contentTypes

$rootRels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>
"@
Add-ZipText $zip "_rels/.rels" $rootRels

$sheetTags = ($sheets | ForEach-Object {
    $idx = [array]::IndexOf($sheets, $_) + 1
    "    <sheet name=`"$($_.Name)`" sheetId=`"$idx`" r:id=`"rId$idx`"/>"
}) -join "`n"

$workbookXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
$sheetTags
  </sheets>
</workbook>
"@
Add-ZipText $zip "xl/workbook.xml" $workbookXml

$wbRelEntries = ($sheets | ForEach-Object {
    $idx = [array]::IndexOf($sheets, $_) + 1
    "  <Relationship Id=`"rId$idx`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet`" Target=`"worksheets/sheet$idx.xml`"/>"
}) -join "`n"
$stylesIdx = $sheets.Count + 1

$wbRels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
$wbRelEntries
  <Relationship Id="rId$stylesIdx" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
"@
Add-ZipText $zip "xl/_rels/workbook.xml.rels" $wbRels

Add-ZipText $zip "xl/styles.xml" $stylesXml

for ($i = 0; $i -lt $sheets.Count; $i++) {
    $idx = $i + 1
    $xml = Build-SheetXml $sheets[$i].Headers $sheets[$i].Rows
    Add-ZipText $zip "xl/worksheets/sheet$idx.xml" $xml
}

$zip.Dispose()
$fs.Close()

Write-Host "SUCCESS: File Excel berhasil dibuat di: $TargetXlsx"
foreach ($s in $sheets) {
    Write-Host ("  - Sheet {0}: {1} baris data" -f $s.Name, $s.Rows.Count)
}
