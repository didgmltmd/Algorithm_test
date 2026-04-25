from pathlib import Path

from pypdf import PdfReader

out = Path("tmp_pdf_text")
out.mkdir(exist_ok=True)

for pdf in Path("data").glob("*.pdf"):
    reader = PdfReader(str(pdf))
    pages = []
    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        pages.append(f"--- PAGE {index} ---\n{text}")
    (out / f"{pdf.stem}.txt").write_text("\n\n".join(pages), encoding="utf-8")
    print(f"{pdf.name}: {len(reader.pages)} pages")
