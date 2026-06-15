import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DocsPage from "./pages/DocsPage";
import CategoryPage from "./pages/CategoryPage";
import FeaturePage from "./pages/FeaturePage";
import SeoContentPage from "./pages/SeoContentPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/organize-files-automatically" element={<SeoContentPage />} />
          <Route path="/rename-files-automatically" element={<SeoContentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
