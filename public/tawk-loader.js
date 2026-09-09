(function () {
  "use strict";

  var WIDGET_URL =
    "https://embed.tawk.to/69e506179491581c33789ff2/1jmj9virs";
  var LOAD_DELAY_MS = 4000;
  var hasLoaded = false;

  function track(eventName) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, {
          event_category: "website_funnel",
          support_channel: "tawk",
        });
      }
    } catch (_error) {
      // Support chat must keep working even when analytics is unavailable.
    }
  }

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_API.onChatStarted = function () {
    track("support_chat_started");
  };
  window.Tawk_API.onPrechatSubmit = function () {
    track("support_prechat_submitted");
  };
  window.Tawk_API.onOfflineSubmit = function () {
    track("support_offline_message_submitted");
  };

  function loadWidget() {
    if (hasLoaded || document.querySelector('script[data-foldora-tawk="true"]')) {
      return;
    }

    hasLoaded = true;
    window.Tawk_LoadStart = new Date();

    var script = document.createElement("script");
    script.async = true;
    script.src = WIDGET_URL;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.setAttribute("data-foldora-tawk", "true");
    document.body.appendChild(script);
  }

  function scheduleWidget() {
    window.setTimeout(loadWidget, LOAD_DELAY_MS);
    window.addEventListener("pointerdown", loadWidget, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", loadWidget, { once: true });
  }

  if (document.readyState === "complete") {
    scheduleWidget();
  } else {
    window.addEventListener("load", scheduleWidget, { once: true });
  }
})();
