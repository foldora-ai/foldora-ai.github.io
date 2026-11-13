const root = document.querySelector("#cleanup-checklist");

if (root) {
  const checks = [...root.querySelectorAll('input[type="checkbox"][data-check]')];
  const progress = root.querySelector("#checklist-progress");
  const status = root.querySelector("#progress-text");
  const reset = root.querySelector("#reset-checklist");
  const storageKey = "foldora-downloads-cleanup-checklist-v1";

  function readSaved() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function save(ids) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids));
    } catch {
      // The checklist still works when browser storage is unavailable.
    }
  }

  function update() {
    const completed = checks.filter((check) => check.checked);
    progress.max = checks.length;
    progress.value = completed.length;
    status.textContent = `${completed.length} of ${checks.length} checks complete`;
    save(completed.map((check) => check.dataset.check));
  }

  const saved = new Set(readSaved());
  checks.forEach((check) => {
    check.checked = saved.has(check.dataset.check);
    check.addEventListener("change", update);
  });
  update();

  reset.addEventListener("click", () => {
    checks.forEach((check) => {
      check.checked = false;
    });
    update();
    checks[0]?.focus();
  });
}
