import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.tsx";
import "./index.css";

const redirect = sessionStorage.redirect;

if (redirect) {
  sessionStorage.removeItem("redirect");
  window.history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
