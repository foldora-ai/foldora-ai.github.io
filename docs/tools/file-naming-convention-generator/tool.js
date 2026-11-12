const COMPONENTS = ["date", "category", "project", "description", "sequence"];
const LABELS = { date: "Date", category: "Category", project: "Project or client", description: "Description", sequence: "Sequence number" };
const SEPARATORS = { hyphen: "-", underscore: "_", space: " " };
const DATE_FORMATS = { iso: "YYYY-MM-DD", compact: "YYYYMMDD", month: "YYYY-MM" };

export const PRESETS = {
  invoices: {
    order: ["date", "project", "category", "description", "sequence"],
    selected: ["date", "project", "category", "description", "sequence"],
    extension: "pdf",
    samples: [
      { date: "2026-04-18", category: "Invoice", project: "Acme", description: "April services", sequence: 1 },
      { date: "2026-05-03", category: "Invoice", project: "Northstar", description: "Design retainer", sequence: 2 },
      { date: "2026-05-14", category: "Receipt", project: "Acme", description: "Office supplies", sequence: 3 },
    ],
  },
  business: {
    order: ["date", "project", "category", "description", "sequence"],
    selected: ["date", "project", "description"],
    extension: "pdf",
    samples: [
      { date: "2026-04-18", category: "Meeting", project: "Q2 Operations", description: "Board minutes", sequence: 1 },
      { date: "2026-05-03", category: "Report", project: "Q2 Operations", description: "Budget review", sequence: 2 },
      { date: "2026-05-14", category: "Contract", project: "Client Acme", description: "Signed agreement", sequence: 3 },
    ],
  },
  personal: {
    order: ["date", "category", "project", "description", "sequence"],
    selected: ["date", "category", "description"],
    extension: "pdf",
    samples: [
      { date: "2026-04-18", category: "Home", project: "Apartment", description: "Insurance policy", sequence: 1 },
      { date: "2026-05-03", category: "Health", project: "Family", description: "Appointment notes", sequence: 2 },
      { date: "2026-05-14", category: "Travel", project: "Summer trip", description: "Flight confirmation", sequence: 3 },
    ],
  },
  projects: {
    order: ["project", "date", "category", "description", "sequence"],
    selected: ["project", "date", "category", "description", "sequence"],
    extension: "docx",
    samples: [
      { date: "2026-04-18", category: "Draft", project: "Website Redesign", description: "Homepage copy", sequence: 1 },
      { date: "2026-05-03", category: "Review", project: "Website Redesign", description: "Navigation notes", sequence: 2 },
      { date: "2026-05-14", category: "Final", project: "Website Redesign", description: "Launch checklist", sequence: 3 },
    ],
  },
};

export function sanitizeSegment(raw) {
  const original = String(raw ?? "");
  let value = original.replace(/[<>:"/\\|?*\u0000-\u001f.]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40).trim();
  if (/^(CON|PRN|AUX|NUL|COM[1-9¹²³]|LPT[1-9¹²³])$/i.test(value)) value += "-file";
  return { value, changed: value !== original.trim() };
}

export function formatDate(raw, format = "iso") {
  if (!Object.hasOwn(DATE_FORMATS, format)) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(raw ?? ""));
  if (!match) return null;
  const [, year, month, day] = match;
  const actual = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (actual.getUTCFullYear() !== Number(year) || actual.getUTCMonth() + 1 !== Number(month) || actual.getUTCDate() !== Number(day)) return null;
  if (format === "compact") return `${year}${month}${day}`;
  if (format === "month") return `${year}-${month}`;
  return `${year}-${month}-${day}`;
}

export function generateNamingData({ workflow = "invoices", order, selected, separator = "hyphen", dateFormat = "iso", fields, extension }) {
  const preset = PRESETS[workflow];
  const errors = [];
  const warnings = [];
  if (!preset) return { pattern: "", examples: [], errors: ["Choose a workflow."], warnings };
  const ordered = Array.isArray(order) ? order.filter((key) => COMPONENTS.includes(key)) : preset.order;
  const active = ordered.filter((key) => selected.includes(key));
  if (!active.length) errors.push("Select at least one filename component.");
  if (!Object.hasOwn(SEPARATORS, separator)) errors.push("Choose a separator.");
  if (!Object.hasOwn(DATE_FORMATS, dateFormat)) errors.push("Choose a date format.");
  const safeExtension = String(extension ?? "").trim().replace(/^\./, "").toLowerCase();
  if (!/^[a-z0-9]{1,10}$/.test(safeExtension)) errors.push("Use a file extension with 1–10 letters or digits, without a dot.");
  const primary = { ...preset.samples[0], ...fields };
  const sequence = Number(primary.sequence);
  if (active.includes("sequence") && (!Number.isInteger(sequence) || sequence < 1 || sequence > 9999)) errors.push("Sequence must be a whole number from 1 to 9999.");
  for (const key of active) {
    if (key === "date") {
      if (!formatDate(primary.date, dateFormat)) errors.push("Enter a valid date.");
    } else if (key !== "sequence") {
      const safe = sanitizeSegment(primary[key]);
      if (!safe.value) errors.push(`Enter ${LABELS[key].toLowerCase()}.`);
      else if (safe.changed) warnings.push(`${LABELS[key]} was shortened or cleaned for Windows filenames.`);
    }
  }
  if (errors.length) return { pattern: "", examples: [], errors, warnings };
  const joiner = SEPARATORS[separator];
  const pattern = `${active.map((key) => `{${key}}`).join(joiner)}.{extension}`;
  const examples = preset.samples.map((sample, index) => {
    const values = index === 0 ? primary : { ...sample, sequence: sequence + index };
    const stem = active.map((key) => {
      if (key === "date") return formatDate(values.date, dateFormat);
      if (key === "sequence") return String(values.sequence).padStart(3, "0");
      return sanitizeSegment(values[key]).value;
    }).join(joiner);
    return `${stem}.${safeExtension}`;
  });
  if (new Set(examples.map((item) => item.toLowerCase())).size < examples.length) warnings.push("Some examples repeat. Add a unique field, such as description or sequence.");
  return { pattern, examples, errors, warnings };
}

export function initNamingTool(root = document.getElementById("naming-tool")) {
  if (!root) return;
  const get = (id) => root.querySelector(`#${id}`);
  const workflowInput = get("workflow");
  const componentList = get("component-list");
  const patternOutput = get("pattern-output");
  const exampleOutput = get("example-output");
  const feedback = get("tool-feedback");
  const copyPattern = get("copy-pattern");
  const copyExamples = get("copy-examples");
  let order = [...PRESETS.invoices.order];
  let selected = [...PRESETS.invoices.selected];
  let current = { pattern: "", examples: [] };

  function renderComponents() {
    componentList.replaceChildren();
    order.forEach((key, index) => {
      const item = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = selected.includes(key);
      checkbox.addEventListener("change", () => {
        selected = checkbox.checked ? [...selected, key] : selected.filter((value) => value !== key);
        update();
      });
      label.append(checkbox, document.createTextNode(` ${LABELS[key]}`));
      item.append(label);
      for (const [direction, delta] of [["up", -1], ["down", 1]]) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = direction === "up" ? "↑" : "↓";
        button.setAttribute("aria-label", `Move ${LABELS[key]} ${direction}`);
        button.disabled = index + delta < 0 || index + delta >= order.length;
        button.addEventListener("click", () => {
          [order[index], order[index + delta]] = [order[index + delta], order[index]];
          renderComponents();
          update();
          componentList.querySelector(`[aria-label="Move ${LABELS[key]} ${direction}"]`)?.focus();
        });
        item.append(button);
      }
      componentList.append(item);
    });
  }

  function update() {
    const fields = Object.fromEntries(["date", "category", "project", "description", "sequence"].map((key) => [key, get(key).value]));
    current = generateNamingData({ workflow: workflowInput.value, order, selected, separator: get("separator").value, dateFormat: get("date-format").value, fields, extension: get("extension").value });
    patternOutput.textContent = current.pattern || "Complete the selected fields to see a pattern.";
    exampleOutput.replaceChildren();
    for (const example of current.examples) {
      const item = document.createElement("li");
      item.textContent = example;
      exampleOutput.append(item);
    }
    copyPattern.disabled = current.errors.length > 0;
    copyExamples.disabled = current.errors.length > 0;
    feedback.textContent = [...current.errors, ...current.warnings].join(" ") || "Examples are illustrative suggestions, not Foldora AI output.";
  }

  function applyPreset() {
    const preset = PRESETS[workflowInput.value];
    order = [...preset.order];
    selected = [...preset.selected];
    for (const key of ["date", "category", "project", "description", "sequence"]) get(key).value = preset.samples[0][key];
    get("extension").value = preset.extension;
    renderComponents();
    update();
  }

  async function copy(value, label) {
    try {
      await navigator.clipboard.writeText(value);
      feedback.textContent = `${label} copied. Examples are illustrative suggestions, not Foldora AI output.`;
    } catch {
      feedback.textContent = "Clipboard access was unavailable. Select the displayed text to copy it manually.";
    }
  }

  workflowInput.addEventListener("change", applyPreset);
  for (const id of ["separator", "date-format", "date", "category", "project", "description", "sequence", "extension"]) get(id).addEventListener("input", update);
  copyPattern.addEventListener("click", () => copy(current.pattern, "Pattern"));
  copyExamples.addEventListener("click", () => copy(current.examples.join("\n"), "Examples"));
  applyPreset();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => initNamingTool(), { once: true });
  else initNamingTool();
}
