(function () {
  "use strict";

  if (window.FoldoraPrivacy) return;

  var STORAGE_KEY = "foldora.optional-consent.v1";
  var CAMPAIGN_STORAGE_KEY = "foldora.campaign";
  var state = "unknown";
  var banner;
  var preferenceCheckbox;
  var currentChoice;
  var settingsOpen = false;
  var settingsTrigger;

  function hasBrowserPrivacySignal() {
    return (
      navigator.globalPrivacyControl === true ||
      navigator.doNotTrack === "1" ||
      window.doNotTrack === "1"
    );
  }

  function readStoredChoice() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === "granted" || saved === "denied" ? saved : "unknown";
    } catch (_error) {
      return "unknown";
    }
  }

  function writeStoredChoice(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (_error) {
      // Consent remains valid for this page if storage is unavailable.
    }
  }

  function optionalServicesAllowed() {
    return state === "granted" && !hasBrowserPrivacySignal();
  }

  function queueGoogleConsent(value) {
    window.dataLayer = window.dataLayer || [];
    (function () {
      window.dataLayer.push(arguments);
    })("consent", value === "default" ? "default" : "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: value === "granted" ? "granted" : "denied",
      functionality_storage: value === "granted" ? "granted" : "denied",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: value === "default" ? 500 : undefined,
    });
  }

  function clearOptionalStorage() {
    try {
      window.sessionStorage.removeItem(CAMPAIGN_STORAGE_KEY);
    } catch (_error) {
      // Optional storage may be unavailable.
    }

    try {
      document.cookie.split(";").forEach(function (cookie) {
        var name = cookie.split("=")[0].trim();
        if (name === "_ga" || name === "_gid" || name.startsWith("_ga_")) {
          document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
          document.cookie =
            name + "=; Max-Age=0; path=/; domain=.foldoraai.com; SameSite=Lax";
        }
      });
    } catch (_error) {
      // Cookie cleanup is best-effort and must not block the page.
    }
  }

  function renderChoice() {
    if (!banner) return;

    if (preferenceCheckbox) {
      preferenceCheckbox.checked = optionalServicesAllowed();
      preferenceCheckbox.disabled = hasBrowserPrivacySignal();
    }

    if (currentChoice) {
      currentChoice.textContent =
        state === "unknown"
          ? "No preference saved yet."
          : optionalServicesAllowed()
            ? "Current preference: optional analytics and support chat allowed."
            : "Current preference: optional analytics and support chat disabled.";
    }

    banner.hidden = state !== "unknown" && !settingsOpen;
  }

  function setOptionalConsent(granted) {
    var wasAllowed = optionalServicesAllowed();
    state = granted && !hasBrowserPrivacySignal() ? "granted" : "denied";
    writeStoredChoice(state);
    queueGoogleConsent(state);
    if (state === "denied") clearOptionalStorage();
    settingsOpen = false;
    renderChoice();

    var trigger = settingsTrigger;
    settingsTrigger = undefined;
    if (trigger && trigger.isConnected) trigger.focus();

    document.dispatchEvent(
      new CustomEvent("foldora:consent-change", {
        detail: { optionalServices: optionalServicesAllowed() },
      }),
    );

    // Third-party scripts cannot be reliably unloaded. Reload after consent
    // withdrawal so they are no longer present or able to send more requests.
    if (wasAllowed && state === "denied") {
      window.setTimeout(function () {
        window.location.reload();
      }, 50);
    }
  }

  function showSettings(trigger) {
    if (!banner) return;
    settingsOpen = true;
    settingsTrigger = trigger || document.activeElement;
    renderChoice();
    if (preferenceCheckbox) preferenceCheckbox.focus();
  }

  function mountControls() {
    if (document.getElementById("foldora-privacy-banner")) return;

    var style = document.createElement("style");
    style.textContent =
      ".foldora-privacy{box-sizing:border-box;position:fixed;z-index:10000;right:1rem;bottom:1rem;width:32rem;max-width:calc(100vw - 2rem);border:1px solid #334155;border-radius:.75rem;background:#0f172a;color:#f8fafc;padding:1rem;box-shadow:0 12px 36px rgba(0,0,0,.35);font:14px/1.5 system-ui,sans-serif}" +
      ".foldora-privacy[hidden]{display:none}" +
      ".foldora-privacy p{margin:0 0 .75rem}" +
      ".foldora-privacy-option{display:flex;gap:.55rem;align-items:flex-start;margin:0 0 .35rem;padding:.65rem;border:1px solid #334155;border-radius:.5rem;background:#020817}" +
      ".foldora-privacy-option input{margin-top:.2rem}" +
      ".foldora-privacy-current{margin:0 0 .75rem;color:#94a3b8;font-size:.82rem}" +
      ".foldora-privacy-actions{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}" +
      ".foldora-privacy button,.foldora-privacy a{max-width:100%;border-radius:.5rem;padding:.55rem .8rem;font:inherit;white-space:normal}" +
      ".foldora-privacy button{cursor:pointer;border:1px solid #64748b;background:#1e293b;color:#f8fafc}" +
      ".foldora-privacy button[data-accept]{border-color:#10b981;background:#059669}" +
      ".foldora-privacy a{color:#a7f3d0}";
    document.head.appendChild(style);

    banner = document.createElement("section");
    banner.id = "foldora-privacy-banner";
    banner.className = "foldora-privacy";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Privacy choices");
    banner.innerHTML =
      "<p><strong>Optional analytics and support chat</strong><br>Allow usage analytics and the support chat to load. Checkout links still work if you reject.</p>" +
      "<label class=\"foldora-privacy-option\"><input type=\"checkbox\" data-optional-choice> <span>Allow optional analytics and support chat</span></label>" +
      "<div class=\"foldora-privacy-current\" data-current-choice aria-live=\"polite\"></div>" +
      "<div class=\"foldora-privacy-actions\">" +
      "<button type=\"button\" data-reject>Reject optional</button>" +
      "<button type=\"button\" data-accept>Accept optional</button>" +
      "<button type=\"button\" data-save>Save preferences</button>" +
      "<a href=\"/docs/privacy/\">Privacy details</a>" +
      "</div>";
    document.body.appendChild(banner);

    preferenceCheckbox = banner.querySelector("[data-optional-choice]");
    currentChoice = banner.querySelector("[data-current-choice]");

    banner.querySelector("[data-reject]").addEventListener("click", function () {
      preferenceCheckbox.checked = false;
      setOptionalConsent(false);
    });
    banner.querySelector("[data-accept]").addEventListener("click", function () {
      preferenceCheckbox.checked = true;
      setOptionalConsent(true);
    });
    banner.querySelector("[data-save]").addEventListener("click", function () {
      setOptionalConsent(preferenceCheckbox.checked);
    });

    document.addEventListener("click", function (event) {
      var target = event.target instanceof Element ? event.target : null;
      var trigger = target && target.closest("[data-foldora-privacy-open]");
      if (!trigger) return;
      event.preventDefault();
      showSettings(trigger);
    });

    if (hasBrowserPrivacySignal()) {
      var message = banner.querySelector("p");
      message.innerHTML =
        "<strong>Browser privacy signal respected</strong><br>Optional analytics and support chat are disabled.";
      banner.querySelector("[data-accept]").hidden = true;
    }

    renderChoice();
  }

  state = hasBrowserPrivacySignal() ? "denied" : readStoredChoice();
  queueGoogleConsent("default");
  if (state === "granted") queueGoogleConsent("granted");
  if (state === "denied") clearOptionalStorage();

  window.FoldoraPrivacy = {
    getState: function () {
      return state;
    },
    optionalServicesAllowed: optionalServicesAllowed,
    setOptionalConsent: setOptionalConsent,
    showSettings: showSettings,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountControls, { once: true });
  } else {
    mountControls();
  }
})();
