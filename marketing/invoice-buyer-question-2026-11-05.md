# Invoice filing: classification versus exact fields

Question: Can Foldora organize invoices by their contents, or does the buyer need exact vendor/date rules?

Existing destination: /blog/organize-invoices-automatically/. No new page. Reused opportunity 3 from CleanoraAI-Website/ACQUISITION-RESEARCH-2026-11-05.md. Recent Foldora commits b106445 and 179169a already cover general buyer fit and format limits; this change applies those facts to the unresolved invoice decision. The existing accountant page already links here.

## Gap and correction

The old examples showed exact date/vendor/invoice-number filenames without distinguishing a suggested convention from a generated result. Replaced them with an explicitly illustrative classification plan and an exact-rule decision example. Added supported reader boundaries, filename shortcuts, field-extraction limitations and manual-review steps. Linked supported-format, privacy and workflow documentation; retained the individual checkout destination and offer, with one priced CTA rather than a bundle prompt on this page.

## Application evidence (read-only inspection)

- backend-src/file_utils.py: MAX_CONTENT_FILE_SIZE = 8 * 1024 * 1024; MAX_PDF_TEXT_PAGES = 3; MAX_PDF_OCR_PAGES = 1; PDF_OCR_DPI = 150. read_pdf_file attempts pytesseract only when the first page has less than 50 extracted characters. Exceptions return no text. Runtime OCR availability was not tested in this website task.
- read_text_file: 3,000 characters. read_docx_file: up to 200 nonempty paragraph parts. read_spreadsheet_file/summarize_rows: bounded initial rows from CSV or first workbook sheet, then column header and first three data rows. Not full-workbook extraction.
- backend-src/_runtime.py process_file: filename shortcuts can precede content reading; 8 MiB guard; text truncated to 5,000 characters. prepare_ai_input selects a meaningful line capped at 200 characters for naming. Title prompts request short descriptive words, not validated invoice fields.
- backend-src/schemas/folder_schema_v2.py: Finance/Invoices schema and invoice/receipt signals. Internal classification signals are not a user-facing vendor/date rule editor.
- _runtime.py process_files_by_date: stat.st_mtime drives year/month grouping. No invoice issue-date extraction. Type mode groups by file types.
- No dedicated vendor, invoice-date or invoice-number extraction contract or configurable exact routing control was found in the application workflow. Do not equate a plausible generated name with validated fields.

No competitor-specific claims, new benchmarks, accuracy claims or executed invoice-processing demonstrations are published. Examples are illustrative. No analytics or purchase offer changes.

## Validation

Passed: production build and static audit (42 sitemap URLs); six existing checkout/attribution tests; initial HTML with all four visible FAQs matching JSON-LD; one correctly tagged individual checkout; local link targets and self-canonical; real Chrome at 1440px and 390px with no horizontal page overflow. Mobile table scrolls within its container. Screenshots and browser metrics are retained outside Git in TEMP/foldora-invoice-20261105. Live verification is recorded in the task response; technical publication does not establish indexing, citations or sales.
