const storageKey = "foldora.campaign";
const campaignKeys = ["utm_source", "utm_medium", "utm_campaign"] as const;

// Preserve explicit campaign tags across internal navigation without storing
// complete landing URLs, referrers, or unrelated query parameters.
export function campaignAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const query = new URLSearchParams(window.location.search);
    const current: Record<string, string> = {};
    for (const key of campaignKeys) {
      const value = query.get(key);
      if (value) current[key] = value.slice(0, 100);
    }
    if (current.utm_source) {
      try { window.sessionStorage.setItem(storageKey, JSON.stringify(current)); } catch { /* Optional storage. */ }
      return current;
    }
    const saved = JSON.parse(window.sessionStorage.getItem(storageKey) || "{}");
    const campaign: Record<string, string> = {};
    for (const key of campaignKeys) {
      if (typeof saved?.[key] === "string") campaign[key] = saved[key].slice(0, 100);
    }
    return campaign;
  } catch {
    return {};
  }
}
