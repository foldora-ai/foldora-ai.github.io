import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    trackEvent("not_found_viewed", {
      path: location.pathname,
    });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="max-w-md px-6 text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          This Foldora page does not exist. Start from the product page or the installation guide.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <a href="/" className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">
          Return to Home
        </a>
        <a href="/docs/install/" className="rounded-lg border border-border px-4 py-2 font-semibold text-foreground">
          Install Guide
        </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
