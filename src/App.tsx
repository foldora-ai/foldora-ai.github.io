import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogPost from "./pages/BlogPost";
import ComparisonPage from "./pages/ComparisonPage";
import DocsPage from "./pages/DocsPage";
import UseCasePage from "./pages/UseCasePage";
import CategoryPage from "./pages/CategoryPage";
import FeaturePage from "./pages/FeaturePage";
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
          <Route path="*" element={<NotFound />} />
          
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/alternatives/:slug" element={<ComparisonPage />} />
          <Route path="/docs/:slug" element={<DocsPage />} />
          <Route path="/use-cases/:slug" element={<UseCasePage />} />
          <Route path="/features/:slug" element={<FeaturePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
