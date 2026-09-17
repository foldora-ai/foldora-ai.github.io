import fs from "node:fs";
import path from "node:path";

const source = process.argv[2] ?? "marketing/ai-visibility-observations.tsv";
const filePath = source === "-" ? "stdin" : path.resolve(source);
const columns = [
  "date",
  "provider",
  "locale",
  "prompt_id",
  "mentioned",
  "cited",
  "accurate",
  "cited_url",
];
const promptIds = new Set([
  "offline_windows",
  "mac_preview",
  "hazel_mac",
  "private_documents",
  "cross_platform",
  "windows_bulk",
]);
const lines = fs.readFileSync(source === "-" ? 0 : filePath, "utf8")
  .replace(/[\r\n]+$/, "")
  .split(/\r?\n/);
const header = lines.shift()?.split("\t");

if (header?.join("\t") !== columns.join("\t")) {
  throw new Error(`Unexpected TSV header in ${filePath}`);
}

const observations = lines.filter(Boolean).map((line, index) => {
  const cells = line.split("\t");
  const row = Object.fromEntries(columns.map((column, i) => [column, cells[i]]));
  const rowNumber = index + 2;

  if (cells.length !== columns.length) {
    throw new Error(`Row ${rowNumber}: expected ${columns.length} tab-separated fields`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
    throw new Error(`Row ${rowNumber}: date must be YYYY-MM-DD`);
  }
  if (!row.provider || !row.locale || !promptIds.has(row.prompt_id)) {
    throw new Error(`Row ${rowNumber}: missing provider/locale or unknown prompt ID`);
  }
  if (![row.mentioned, row.cited].every((value) => value === "yes" || value === "no")) {
    throw new Error(`Row ${rowNumber}: mentioned and cited must be yes or no`);
  }
  if (!new Set(["yes", "no", "na"]).has(row.accurate)) {
    throw new Error(`Row ${rowNumber}: accurate must be yes, no, or na`);
  }
  if (row.mentioned === "no" && row.accurate !== "na") {
    throw new Error(`Row ${rowNumber}: accuracy must be na if Foldora was not mentioned`);
  }
  if (row.cited === "yes" && row.mentioned !== "yes") {
    throw new Error(`Row ${rowNumber}: cited=yes requires mentioned=yes`);
  }
  if (row.cited === "yes" && !/^https:\/\/foldoraai\.com\//.test(row.cited_url)) {
    throw new Error(`Row ${rowNumber}: cited=yes requires an official Foldora URL`);
  }
  if (row.cited === "no" && row.cited_url) {
    throw new Error(`Row ${rowNumber}: cited_url must be empty when cited=no`);
  }
  return row;
});

if (!observations.length) {
  console.log("No AI-answer observations recorded yet. See marketing/ai-visibility-monitoring.md.");
  process.exit(0);
}

function summary(rows) {
  const count = rows.length;
  const mentioned = rows.filter((row) => row.mentioned === "yes").length;
  const cited = rows.filter((row) => row.cited === "yes").length;
  const assessable = rows.filter((row) => row.accurate !== "na").length;
  const accurate = rows.filter((row) => row.accurate === "yes").length;
  const accuracy = assessable
    ? `${accurate}/${assessable} assessable mentions`
    : "n/a (no assessable mentions)";
  return `${count} answer${count === 1 ? "" : "s"} | mentioned ${mentioned}/${count} (${Math.round(100 * mentioned / count)}%) | cited ${cited}/${count} (${Math.round(100 * cited / count)}%) | accurate ${accuracy}`;
}

console.log(`AI visibility observations: ${observations.length}`);
console.log(`Overall: ${summary(observations)}`);

for (const dimension of ["date", "provider", "prompt_id"]) {
  console.log(`\nBy ${dimension}:`);
  for (const value of [...new Set(observations.map((row) => row[dimension]))].sort()) {
    console.log(`  ${value}: ${summary(observations.filter((row) => row[dimension] === value))}`);
  }
}
