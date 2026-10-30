(function () {
  "use strict";

  if (window.__foldoraCheckoutTrackingLoaded) return;
  window.__foldoraCheckoutTrackingLoaded = true;

  var STORAGE_KEY = "foldora.campaign";
  var CAMPAIGN_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_id",
    "utm_term",
    "utm_content",
  ];
  var CHECKOUT_SELECTOR = "a[data-foldora-checkout]";
  var lastClickAt = new WeakMap();

  function safeCampaignValue(value) {
    if (typeof value !== "string") return "";
    var normalized = value.trim().slice(0, 100);
    // Campaign values should be labels, never contact details.
    if (!normalized || normalized.includes("@")) return "";
    return normalized;
  }

  function cleanCampaign(value) {
    var campaign = {};
    if (!value || typeof value !== "object") return campaign;
    CAMPAIGN_KEYS.forEach(function (key) {
      var cleaned = safeCampaignValue(value[key]);
      if (cleaned) campaign[key] = cleaned;
    });
    return campaign.utm_source ? campaign : {};
  }

  function campaignFromSearch() {
    var params = new URLSearchParams(window.location.search);
    var campaign = {};
    CAMPAIGN_KEYS.forEach(function (key) {
      var cleaned = safeCampaignValue(params.get(key));
      if (cleaned) campaign[key] = cleaned;
    });
    return campaign.utm_source ? campaign : {};
  }

  function optionalServicesAllowed() {
    return Boolean(
      window.FoldoraPrivacy &&
        typeof window.FoldoraPrivacy.optionalServicesAllowed === "function" &&
        window.FoldoraPrivacy.optionalServicesAllowed(),
    );
  }

  function isPrivacyStorageDisabled() {
    return !optionalServicesAllowed() ||
      navigator.globalPrivacyControl === true ||
      navigator.doNotTrack === "1" ||
      window.doNotTrack === "1";
  }

  function savedCampaign() {
    if (isPrivacyStorageDisabled()) return {};
    try {
      return cleanCampaign(JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}"));
    } catch (_error) {
      return {};
    }
  }

  function referralCampaign() {
    if (!document.referrer) return {};
    try {
      var referrer = new URL(document.referrer);
      var hostname = referrer.hostname.toLowerCase().replace(/^www\./, "");
      var currentHost = window.location.hostname.toLowerCase().replace(/^www\./, "");
      if (!hostname || hostname === currentHost) return {};

      if (hostname === "google.com" || hostname.startsWith("google.")) {
        return {
          utm_source: "google",
          utm_medium: "organic",
          utm_campaign: "organic-search",
        };
      }

      if (
        hostname === "chatgpt.com" ||
        hostname.endsWith(".chatgpt.com") ||
        hostname === "chat.openai.com"
      ) {
        return {
          utm_source: "chatgpt.com",
          utm_medium: "referral",
          utm_campaign: "ai-assistant-referral",
        };
      }

      return {
        utm_source: safeCampaignValue(hostname),
        utm_medium: "referral",
        utm_campaign: "website-referral",
      };
    } catch (_error) {
      return {};
    }
  }

  function originalCampaign() {
    // First valid touch wins for this tab. Direct/internal navigation cannot
    // overwrite it, and only allow-listed campaign labels are retained.
    var campaign = savedCampaign();
    if (!campaign.utm_source) campaign = campaignFromSearch();
    if (!campaign.utm_source) campaign = referralCampaign();

    if (campaign.utm_source && !isPrivacyStorageDisabled()) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
      } catch (_error) {
        // Attribution storage is optional; checkout must still work.
      }
    }
    return campaign;
  }

  var attribution = originalCampaign();

  document.addEventListener("foldora:consent-change", function () {
    if (!attribution.utm_source || isPrivacyStorageDisabled()) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    } catch (_error) {
      // Attribution storage is optional; checkout must still work.
    }
  });

  function updateCheckoutLink(link) {
    try {
      var destination = new URL(link.href, window.location.href);
      CAMPAIGN_KEYS.forEach(function (key) {
        if (attribution[key]) destination.searchParams.set(key, attribution[key]);
      });
      link.href = destination.toString();
    } catch (_error) {
      // Preserve the original checkout URL if it cannot be parsed.
    }
  }

  function updateCheckoutLinks(root) {
    if (root instanceof Element && root.matches(CHECKOUT_SELECTOR)) {
      updateCheckoutLink(root);
    }
    if (root.querySelectorAll) {
      root.querySelectorAll(CHECKOUT_SELECTOR).forEach(updateCheckoutLink);
    }
  }

  function queueEvent(eventName, payload) {
    if (!optionalServicesAllowed()) return;
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
      return;
    }
    window.dataLayer = window.dataLayer || [];
    (function () {
      window.dataLayer.push(arguments);
    })("event", eventName, payload);
  }

  function checkoutPayload(link) {
    var destination = new URL(link.href, window.location.href);
    var price = Number.parseFloat(link.dataset.productPrice || "0");
    var currency = link.dataset.productCurrency || "USD";
    var productId = link.dataset.productId || "foldora";
    var productName = link.dataset.productName || "Foldora";
    var payload = {
      event_category: "website_funnel",
      currency: currency,
      value: Number.isFinite(price) ? price : 0,
      checkout_provider: link.dataset.checkoutProvider || destination.hostname,
      checkout_location: link.dataset.checkoutLocation || "unknown",
      destination_url: destination.toString(),
      campaign_id: destination.searchParams.get("utm_id") || undefined,
      campaign_name: destination.searchParams.get("utm_campaign") || undefined,
      campaign_source: destination.searchParams.get("utm_source") || undefined,
      campaign_medium: destination.searchParams.get("utm_medium") || undefined,
      campaign_term: destination.searchParams.get("utm_term") || undefined,
      campaign_content: destination.searchParams.get("utm_content") || undefined,
      items: [
        {
          item_id: productId,
          item_name: productName,
          item_brand: "Computora AI",
          item_category: "Desktop Software",
          item_variant: link.dataset.productVariant || "windows_macos",
          price: Number.isFinite(price) ? price : 0,
          quantity: 1,
        },
      ],
    };

    if (new URLSearchParams(window.location.search).get("debug_mode") === "true") {
      payload.debug_mode = true;
    }
    return payload;
  }

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target instanceof Element ? event.target : null;
      var link = target && target.closest(CHECKOUT_SELECTOR);
      if (!link) return;

      updateCheckoutLink(link);
      var now = Date.now();
      if (now - (lastClickAt.get(link) || 0) < 1200) return;
      lastClickAt.set(link, now);

      try {
        queueEvent("begin_checkout", checkoutPayload(link));
      } catch (_error) {
        // Analytics must never interrupt checkout navigation.
      }
    },
    true,
  );

  updateCheckoutLinks(document);
  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE) updateCheckoutLinks(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
