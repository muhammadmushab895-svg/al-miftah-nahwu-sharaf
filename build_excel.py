import json
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_XLSX = BASE_DIR / "Database_Materi_Nahwu_Tathbiqi_Jami_Durus.xlsx"


def col_letter(idx: int) -> str:
    """Convert 1-based column index to Excel column letter (A, B, ..., Z, AA...)."""
    result = ""
    while idx > 0:
        idx, rem = divmod(idx - 1, 26)
        result = chr(65 + rem) + result
    return result


def build_sheet_xml(headers: list[tuple[str, str, int]], rows: list[dict]) -> str:
    """Build OpenXML worksheet with column widths, frozen header row, and wrapped cells."""
    num_cols = len(headers)
    num_rows = len(rows) + 1
    last_col = col_letter(num_cols)
    dimension = f"A1:{last_col}{num_rows}"

    cols_xml = ["<cols>"]
    for i, (_, _, width) in enumerate(headers, start=1):
        cols_xml.append(
            f'<col min="{i}" max="{i}" width="{width}" customWidth="1"/>'
        )
    cols_xml.append("</cols>")

    sheet_data = ["<sheetData>"]

    # Header row (style s="1")
    header_cells = []
    for c_idx, (_, title, _) in enumerate(headers, start=1):
        ref = f"{col_letter(c_idx)}1"
        header_cells.append(
            f'<c r="{ref}" t="inlineStr" s="1"><is><t>{escape(str(title))}</t></is></c>'
        )
    sheet_data.append(
        f'<row r="1" ht="30" customHeight="1">{"".join(header_cells)}</row>'
    )

    # Data rows (alternating style s="2" and s="3", or s="4" for Arabic columns)
    for r_idx, row_dict in enumerate(rows, start=2):
        cells = []
        is_even = (r_idx % 2 == 0)
        for c_idx, (key, _, _) in enumerate(headers, start=1):
            ref = f"{col_letter(c_idx)}{r_idx}"
            val = row_dict.get(key, "")
            if isinstance(val, (int, float)) and not isinstance(val, bool):
                style_id = "2" if is_even else "3"
                cells.append(f'<c r="{ref}" s="{style_id}"><v>{val}</v></c>')
            else:
                is_arabic_col = any(
                    k in key
                    for k in ("arab", "kalimat_arab", "kata_kunci", "istilah_arab")
                )
                if is_arabic_col:
                    style_id = "4" if is_even else "5"
                else:
                    style_id = "2" if is_even else "3"
                text_escaped = escape(str(val))
                cells.append(
                    f'<c r="{ref}" t="inlineStr" s="{style_id}"><is><t>{text_escaped}</t></is></c>'
                )
        sheet_data.append(f'<row r="{r_idx}">{"".join(cells)}</row>')

    sheet_data.append("</sheetData>")

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
           xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="{dimension}"/>
  <sheetViews>
    <sheetView tabSelected="0" workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="24"/>
  {"".join(cols_xml)}
  {"".join(sheet_data)}
  <autoFilter ref="{dimension}"/>
</worksheet>"""


def build_styles_xml() -> str:
    """Create styles.xml with emerald header, striped rows, borders, and Arabic font styling."""
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font>
      <sz val="11"/>
      <color rgb="FF1F2937"/>
      <name val="Segoe UI"/>
    </font>
    <font>
      <b/>
      <sz val="11"/>
      <color rgb="FFFFFFFF"/>
      <name val="Segoe UI"/>
    </font>
    <font>
      <b/>
      <sz val="13"/>
      <color rgb="FF064E3B"/>
      <name val="Traditional Arabic"/>
    </font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill>
      <patternFill patternType="solid">
        <fgColor rgb="FF1B5E20"/>
        <bgColor indexed="64"/>
      </patternFill>
    </fill>
    <fill>
      <patternFill patternType="solid">
        <fgColor rgb="FFF1F8E9"/>
        <bgColor indexed="64"/>
      </patternFill>
    </fill>
  </fills>
  <borders count="2">
    <border>
      <left/><right/><top/><bottom/><diagonal/>
    </border>
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
</styleSheet>"""


def main() -> None:
    kurikulum = json.loads((DATA_DIR / "01_kurikulum_bab.json").read_text(encoding="utf-8"))
    materi = json.loads((DATA_DIR / "02_materi_kaidah.json").read_text(encoding="utf-8"))
    irab = json.loads((DATA_DIR / "03_contoh_dan_irab.json").read_text(encoding="utf-8"))
    soal = json.loads((DATA_DIR / "04_bank_soal.json").read_text(encoding="utf-8"))
    istilah = json.loads((DATA_DIR / "05_kamus_istilah.json").read_text(encoding="utf-8"))

    sheets = [
        (
            "1_Kurikulum_Bab",
            [
                ("id_bab", "ID Bab", 12),
                ("urutan", "Urutan", 9),
                ("kategori", "Kategori Ilmu", 26),
                ("level", "Level / Tingkatan", 20),
                ("judul_arab", "Judul Bab (Arab)", 42),
                ("judul_indo", "Judul Bab (Indonesia)", 45),
                ("ref_nahwu_tathbiqi", "Referensi An-Nahwu At-Tathbiqi", 40),
                ("ref_jami_durus", "Referensi Jami'ud Durus Al-Arabiyyah", 42),
                ("ringkasan_cakupan", "Ringkasan Cakupan Materi", 55),
                ("estimasi_jam_belajar", "Estimasi Jam", 14),
            ],
            kurikulum,
        ),
        (
            "2_Materi_dan_Kaidah",
            [
                ("id_materi", "ID Materi", 12),
                ("id_bab", "ID Bab", 12),
                ("sub_topik_arab", "Sub-Topik (Arab)", 38),
                ("sub_topik_indo", "Sub-Topik (Indonesia)", 38),
                ("kaidah_arab", "Teks & Rumus Kaidah (Bahasa Arab)", 58),
                ("penjelasan_indo", "Penjelasan Lengkap (Bahasa Indonesia)", 62),
                ("rumus_ringkas", "Rumus Cepat / Kunci Hafalan", 45),
                ("tanbihat_catatan", "Tanbihat & Catatan Penting (Nahwu Tathbiqi & Jami'ud Durus)", 58),
            ],
            materi,
        ),
        (
            "3_Contoh_dan_Irab",
            [
                ("id_contoh", "ID Contoh", 12),
                ("id_bab", "ID Bab", 12),
                ("sumber_dalil", "Sumber / Referensi", 32),
                ("kalimat_arab", "Contoh Kalimat / Ayat (Arab)", 45),
                ("terjemahan_indo", "Terjemahan Indonesia", 42),
                ("kata_kunci", "Kata Kunci (Mahal Syahid)", 28),
                ("irab_arab", "Tathbiq I'rab (Bahasa Arab)", 58),
                ("penjelasan_irab_indo", "Analisis & Penjelasan I'rab (Indonesia)", 58),
            ],
            irab,
        ),
        (
            "4_Bank_Soal",
            [
                ("id_soal", "ID Soal", 12),
                ("id_bab", "ID Bab", 12),
                ("tingkat_kesulitan", "Tingkat Kesulitan", 18),
                ("pertanyaan", "Pertanyaan Kuis / Evaluasi", 55),
                ("opsi_a", "Opsi A", 35),
                ("opsi_b", "Opsi B", 35),
                ("opsi_c", "Opsi C", 35),
                ("opsi_d", "Opsi D", 35),
                ("jawaban_benar", "Kunci Jawaban", 15),
                ("pembahasan", "Pembahasan & Alasan Kaidah", 58),
            ],
            soal,
        ),
        (
            "5_Kamus_Istilah",
            [
                ("id_istilah", "ID Istilah", 12),
                ("istilah_arab", "Istilah (Arab & Transliterasi)", 34),
                ("bidang", "Bidang", 16),
                ("definisi_arab", "Ta'rif / Definisi (Bahasa Arab)", 52),
                ("definisi_indo", "Definisi & Penjelasan (Bahasa Indonesia)", 55),
                ("contoh", "Contoh Penerapan", 45),
            ],
            istilah,
        ),
    ]

    with zipfile.ZipFile(OUTPUT_XLSX, "w", zipfile.ZIP_DEFLATED) as zf:
        # [Content_Types].xml
        sheet_overrides = "\n".join(
            f'  <Override PartName="/xl/worksheets/sheet{i}.xml" '
            f'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            for i in range(1, len(sheets) + 1)
        )
        content_types = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
{sheet_overrides}
</Types>"""
        zf.writestr("[Content_Types].xml", content_types)

        # _rels/.rels
        root_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>"""
        zf.writestr("_rels/.rels", root_rels)

        # xl/workbook.xml
        sheet_entries = "\n".join(
            f'    <sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>'
            for i, (name, _, _) in enumerate(sheets, start=1)
        )
        workbook_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
{sheet_entries}
  </sheets>
</workbook>"""
        zf.writestr("xl/workbook.xml", workbook_xml)

        # xl/_rels/workbook.xml.rels
        wb_rels_entries = "\n".join(
            f'  <Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>'
            for i in range(1, len(sheets) + 1)
        )
        styles_rid = len(sheets) + 1
        wb_rels = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{wb_rels_entries}
  <Relationship Id="rId{styles_rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""
        zf.writestr("xl/_rels/workbook.xml.rels", wb_rels)

        # xl/styles.xml
        zf.writestr("xl/styles.xml", build_styles_xml())

        # xl/worksheets/sheet{i}.xml
        for i, (_, headers, rows) in enumerate(sheets, start=1):
            zf.writestr(f"xl/worksheets/sheet{i}.xml", build_sheet_xml(headers, rows))

    print(f"SUCCESS: Generated {OUTPUT_XLSX}")
    print(f"Total Sheets: {len(sheets)}")
    for name, _, rows in sheets:
        print(f"  - {name}: {len(rows)} baris")


if __name__ == "__main__":
    main()
