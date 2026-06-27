import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { loadAnalytics, trackPageView } from "./lib/analytics";
const queryClient = new QueryClient();

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const FeaturePage = lazy(() => import("./pages/FeaturePage"));
const SeoContentPage = lazy(() => import("./pages/SeoContentPage"));

const RouteAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteAnalytics />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/blog/:slug" element={<SeoContentPage />} />
            <Route path="/alternatives/:slug" element={<SeoContentPage />} />
            <Route path="/docs/:slug" element={<DocsPage />} />
            <Route path="/use-cases/:slug" element={<SeoContentPage />} />
            <Route path="/features/:slug" element={<FeaturePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/ai-file-organizer" element={<SeoContentPage />} />
            <Route path="/best-file-organizer-windows" element={<SeoContentPage />} />
            <Route path="/clean-downloads-folder" element={<SeoContentPage />} />
            <Route path="/organize-files-windows" element={<SeoContentPage />} />
            <Route path="/organize-files-mac" element={<SeoContentPage />} />
            <Route path="/organize-files-automatically" element={<SeoContentPage />} />
            <Route path="/rename-files-automatically" element={<SeoContentPage />} />
            <Route path="/blog/rename-files-automatically" element={<Navigate to="/rename-files-automatically/" replace />} />
            <Route path="/blog/ai-file-organizer-for-windows" element={<Navigate to="/best-file-organizer-windows/" replace />} />
            <Route path="/blog/organize-work-files" element={<Navigate to="/blog/desktop-file-management/" replace />} />
            <Route path="/alternatives/dropit" element={<Navigate to="/best-file-organizer-windows/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
