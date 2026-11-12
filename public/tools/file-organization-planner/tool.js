export const EXAMPLE_NAMES = `2026-04-18_acme_invoice.pdf
2026-04-20_receipt_coffee.jpg
project-brief.docx
family-photo.jpg
2026-05-03_budget.xlsx
scan001.pdf`;

export const EXAMPLE_RULES = [
  { keyword: "invoice", folder: "Finance/Invoices" },
  { keyword: "receipt", folder: "Finance/Receipts" },
  { keyword: "project", folder: "Work/Projects" },
  { keyword: "family", folder: "Personal" },
];

const TYPE_FOLDERS = {
  pdf: "Documents/PDF", doc: "Documents/Word", docx: "Documents/Word", txt: "Documents/Text",
  rtf: "Documents/Text", xls: "Documents/Spreadsheets", xlsx: "Documents/Spreadsheets",
  csv: "Documents/Spreadsheets", ppt: "Documents/Presentations", pptx: "Documents/Presentations",
  jpg: "Images", jpeg: "Images", png: "Images", gif: "Images", webp: "Images", svg: "Images",
  mp3: "Audio", wav: "Audio", m4a: "Audio", mp4: "Video", mov: "Video", avi: "Video",
  zip: "Archives", rar: "Archives", "7z": "Archives", exe: "Installers", msi: "Installers", dmg: "Installers",
};

function validName(name) {
  return name.length <= 255 && name !== "." && name !== ".." && !/[<>:"/\\|?*\u0000-\u001f]/.test(name)
    && !/[. ]$/.test(name) && !/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(name);
}

function validFolder(folder) {
  return folder.length <= 200 && folder.split("/").every((part) => part && part === part.trim() && validName(part));
}

function findDates(name) {
  const candidates = [...name.matchAll(/(?:^|[^0-9])(\d{4}-\d{2}-\d{2})(?=$|[^0-9])/g)].map((match) => match[1]);
  return candidates.filter((date) => {
    const [year, month, day] = date.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return parsed.getUTCFullYear() === year && parsed.getUTCMonth() + 1 === month && parsed.getUTCDate() === day;
  });
}

export function planFiles(text, mode = "type", rules = []) {
  const errors = [];
  const lines = String(text ?? "").split(/\r?\n/);
  if (lines.length > 1000) errors.push("Use at most 1,000 filename lines at a time.");
  if (!["type", "date", "keyword"].includes(mode)) errors.push("Choose a valid organization rule.");
  const normalizedRules = [];
  if (mode === "keyword") {
    if (!Array.isArray(rules) || rules.length === 0 || rules.length > 30) errors.push("Add 1 to 30 keyword rules.");
    else rules.forEach((rule, index) => {
      const keyword = String(rule.keyword ?? "").trim();
      const folder = String(rule.folder ?? "").trim();
      if (!keyword || keyword.length > 80 || /[\r\n]/.test(keyword)) errors.push(`Rule ${index + 1}: enter a keyword of up to 80 characters.`);
      if (!validFolder(folder)) errors.push(`Rule ${index + 1}: enter a safe relative folder, such as Finance/Invoices.`);
      normalizedRules.push({ keyword, folder });
    });
  }
  if (errors.length) return { rows: [], tree: "", errors, warnings: [] };

  const rows = [];
  const warnings = [];
  const seen = new Map();
  lines.forEach((raw, index) => {
    const name = raw.trim();
    if (!name) return;
    if (!validName(name)) {
      warnings.push(`Line ${index + 1}: invalid or unsafe filename; excluded from the plan.`);
      return;
    }
    const notes = [];
    const previous = seen.get(name.toLowerCase());
    if (previous) notes.push(`Duplicate filename; also on line ${previous}`);
    else seen.set(name.toLowerCase(), index + 1);
    let folder;
    if (mode === "type") {
      const extension = /\.([^.]+)$/.exec(name)?.[1].toLowerCase();
      folder = extension ? TYPE_FOLDERS[extension] || "Other formats" : "No extension";
      if (!extension) notes.push("No extension; review manually");
    } else if (mode === "date") {
      const dates = findDates(name);
      folder = dates.length === 1 ? `By date/${dates[0].slice(0, 4)}/${dates[0].slice(5, 7)}` : `Needs review/${dates.length ? "Multiple dates" : "No clear date"}`;
      if (dates.length !== 1) notes.push(dates.length ? "Multiple valid dates; review manually" : "No single valid YYYY-MM-DD date");
    } else {
      const matches = normalizedRules.filter((rule) => name.toLowerCase().includes(rule.keyword.toLowerCase()));
      folder = matches[0]?.folder || "Needs review/No keyword match";
      if (!matches.length) notes.push("No keyword match; review manually");
      if (matches.length > 1) notes.push(`Matches ${matches.length} rules; first rule wins`);
    }
    rows.push({ line: index + 1, name, folder, path: `${folder}/${name}`, note: notes.join("; ") });
  });
  if (!rows.length) errors.push("Enter at least one valid filename.");
  const paths = new Set();
  rows.forEach((row) => {
    if (paths.has(row.path.toLowerCase())) row.note += `${row.note ? "; " : ""}Proposed destination duplicates another row`;
    paths.add(row.path.toLowerCase());
  });
  const roots = new Map();
  for (const folder of new Set(rows.map((row) => row.folder))) {
    let level = roots;
    for (const part of folder.split("/")) {
      if (!level.has(part)) level.set(part, new Map());
      level = level.get(part);
    }
  }
  const linesOut = ["Proposed structure/"];
  function addBranches(level, depth) {
    for (const [part, children] of [...level.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      linesOut.push(`${"  ".repeat(depth)}${part}/`);
      addBranches(children, depth + 1);
    }
  }
  addBranches(roots, 1);
  const tree = linesOut.join("\n");
  return { rows, tree, errors, warnings };
}

function csvCell(value) {
  let text = String(value ?? "");
  // Prevent spreadsheet formula execution when a downloaded CSV is opened.
  if (/^\s*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function mappingCsv(rows) {
  return ["Line,Filename,Proposed folder,Proposed path,Review note", ...rows.map((row) => [row.line, row.name, row.folder, row.path, row.note].map(csvCell).join(","))].join("\r\n") + "\r\n";
}

export function initPlanner(root = document.querySelector("#organization-planner")) {
  if (!root) return;
  const names = root.querySelector("#filenames");
  const mode = root.querySelector("#mode");
  const ruleList = root.querySelector("#rule-list");
  const tree = root.querySelector("#plan-tree");
  const mapBody = root.querySelector("#mapping-body");
  const feedback = root.querySelector("#planner-feedback");
  const copy = root.querySelector("#copy-tree");
  const download = root.querySelector("#download-csv");
  let rules = EXAMPLE_RULES.map((rule) => ({ ...rule }));
  let result;

  function renderRules() {
    ruleList.replaceChildren();
    rules.forEach((rule, index) => {
      const row = document.createElement("li");
      const keyword = document.createElement("input");
      keyword.type = "text"; keyword.maxLength = 80; keyword.value = rule.keyword;
      keyword.setAttribute("aria-label", `Rule ${index + 1} keyword`);
      keyword.addEventListener("input", () => { rule.keyword = keyword.value; render(); });
      const folder = document.createElement("input");
      folder.type = "text"; folder.maxLength = 200; folder.value = rule.folder;
      folder.setAttribute("aria-label", `Rule ${index + 1} destination folder`);
      folder.addEventListener("input", () => { rule.folder = folder.value; render(); });
      const up = document.createElement("button");
      up.type = "button"; up.textContent = "↑"; up.title = `Move rule ${index + 1} up`; up.setAttribute("aria-label", up.title); up.disabled = index === 0;
      up.addEventListener("click", () => { [rules[index - 1], rules[index]] = [rules[index], rules[index - 1]]; renderRules(); render(); });
      const down = document.createElement("button");
      down.type = "button"; down.textContent = "↓"; down.title = `Move rule ${index + 1} down`; down.setAttribute("aria-label", down.title); down.disabled = index === rules.length - 1;
      down.addEventListener("click", () => { [rules[index + 1], rules[index]] = [rules[index], rules[index + 1]]; renderRules(); render(); });
      const remove = document.createElement("button");
      remove.type = "button"; remove.textContent = "Remove"; remove.setAttribute("aria-label", `Remove rule ${index + 1}`);
      remove.addEventListener("click", () => { rules.splice(index, 1); renderRules(); render(); });
      row.append(keyword, folder, up, down, remove);
      ruleList.append(row);
    });
  }

  function render() {
    root.querySelector("#keyword-controls").hidden = mode.value !== "keyword";
    result = planFiles(names.value, mode.value, rules);
    tree.textContent = result.tree || "No plan yet.";
    mapBody.replaceChildren();
    result.rows.forEach((row) => {
      const tr = document.createElement("tr");
      [row.line, row.name, row.folder, row.note || "—"].forEach((value) => {
        const td = document.createElement("td"); td.textContent = String(value); tr.append(td);
      });
      mapBody.append(tr);
    });
    feedback.textContent = [...result.errors, ...result.warnings, `${result.rows.length} proposed row${result.rows.length === 1 ? "" : "s"}. Review the real folder before moving anything.`].join(" ");
    copy.disabled = download.disabled = Boolean(result.errors.length || !result.rows.length);
  }

  names.addEventListener("input", render);
  mode.addEventListener("change", render);
  root.querySelector("#add-rule").addEventListener("click", () => {
    if (rules.length >= 30) { feedback.textContent = "Use at most 30 keyword rules."; return; }
    rules.push({ keyword: "", folder: "" }); renderRules(); render();
    ruleList.lastElementChild?.querySelector("input")?.focus();
  });
  root.querySelector("#reset-example").addEventListener("click", () => {
    names.value = EXAMPLE_NAMES; mode.value = "keyword"; rules = EXAMPLE_RULES.map((rule) => ({ ...rule })); renderRules(); render();
  });
  copy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(result.tree); feedback.textContent = "Proposed structure copied. Review it before making real changes."; }
    catch { feedback.textContent = "Clipboard unavailable. Select and copy the tree manually."; }
  });
  download.addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob(["\ufeff", mappingCsv(result.rows)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "file-organization-plan.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    feedback.textContent = "CSV mapping downloaded. It is a review checklist, not a file-moving script.";
  });
  renderRules(); render();
}

if (typeof document !== "undefined") initPlanner();
