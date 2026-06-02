import fs from "fs";
import path from "path";

import { blogPosts } from "../src/content/blog";
import { docs } from "../src/content/docs";
import { features } from "../src/content/features";
import { categories } from "../src/content/categories";
import { useCases } from "../src/content/useCases";
import { comparisons } from "../src/content/comparison";

function createPage(
  route: string,
  title: string,
  description: string,
  sections: any[] = []
) {
  const folder = path.join("public", route);

  fs.mkdirSync(folder, { recursive: true });

  const sectionsHtml = sections
    .map(
      (section) => `
      <div class="section">
        <h2>${section.title}</h2>
        <p>${String(section.content || "").replace(/\n/g, "<br>")}</p>
      </div>
    `
    )
    .join("");

  const html = `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${title} | Foldora</title>
<meta name="description" content="${description}">
<link rel="canonical" href="https://foldoraai.com/${route}/">

<style>
body{
  margin:0;
  font-family:-apple-system,BlinkMacSystemFont,sans-serif;
  background:#020817;
  color:#e2e8f0;
}

.container{
  max-width:900px;
  margin:auto;
  padding:0 20px;
}

.hero{
  padding:120px 0 80px;
  border-bottom:1px solid #1e293b;
}

.badge{
  display:inline-block;
  padding:8px 14px;
  border-radius:999px;
  border:1px solid #334155;
  color:#94a3b8;
  font-size:14px;
}

h1{
  font-size:56px;
  line-height:1.1;
  color:white;
  margin-top:24px;
}

.subtitle{
  font-size:22px;
  color:#94a3b8;
  line-height:1.7;
  margin-top:24px;
}

.updated{
  margin-top:24px;
  color:#64748b;
  font-size:14px;
}

.article{
  padding:80px 0;
}

.section{
  margin-bottom:70px;
}

.section h2{
  color:white;
  font-size:32px;
  margin-bottom:24px;
}

.section p{
  color:#cbd5e1;
  line-height:1.9;
  font-size:18px;
}

.card{
  border:1px solid #1e293b;
  background:#0f172a;
  border-radius:24px;
  padding:40px;
  margin-top:80px;
}

.card-grid{
  display:grid;
  gap:20px;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  margin-top:30px;
}

.card-item{
  border:1px solid #334155;
  border-radius:16px;
  padding:20px;
  text-decoration:none;
  color:white;
}

.card-item:hover{
  background:#1e293b;
}

.cta{
  text-align:center;
}

.button{
  display:inline-block;
  margin-top:30px;
  padding:16px 28px;
  border-radius:999px;
  background:#22c55e;
  color:#052e16;
  text-decoration:none;
  font-weight:bold;
}

.features{
  margin-top:20px;
  color:#94a3b8;
  font-size:14px;
}

.footer-space{
  height:80px;
}
</style>
</head>

<body>

<div class="container">

  <div class="hero">

    <div class="badge">
      AI File Organization
    </div>

    <h1>${title}</h1>

    <p class="subtitle">
      ${description}
    </p>

  </div>

  <div class="article">

    ${sectionsHtml}

    <div class="card">

      <h2>Related Resources</h2>

      <div class="card-grid">

        <a class="card-item" href="/features/offline-processing/">
          <h3>Offline AI File Organization</h3>
          <p>Learn how Foldora processes files locally.</p>
        </a>

        <a class="card-item" href="/features/downloads-cleanup/">
          <h3>Automatic Downloads Cleanup</h3>
          <p>Clean and structure messy downloads folders.</p>
        </a>

        <a class="card-item" href="/alternatives/hazel/">
          <h3>Foldora vs Hazel</h3>
          <p>Compare Foldora with Hazel.</p>
        </a>

        <a class="card-item" href="/category/downloads/">
          <h3>Downloads Folder Guides</h3>
          <p>Explore organization workflows.</p>
        </a>

      </div>

    </div>

    <div class="card cta">

      <h2>Organize your files automatically</h2>

      <p>
        Foldora uses local AI to clean messy folders in seconds.
      </p>

      <a
        class="button"
        href="https://foldora.gumroad.com/l/foldora"
      >
        Download Foldora
      </a>

      <div class="features">
        ✓ 100% offline • ✓ No subscription • ✓ Local AI processing
      </div>

    </div>

    <div class="card">

      <h2>Related Articles</h2>

      <div class="card-grid">

        <a class="card-item" href="/blog/clean-desktop-clutter/">
          Clean Desktop Clutter
        </a>

        <a class="card-item" href="/blog/ai-file-organizer-for-windows/">
          AI File Organizer For Windows
        </a>

        <a class="card-item" href="/blog/organize-pdfs-automatically/">
          Organize PDFs Automatically
        </a>

        <a class="card-item" href="/blog/offline-ai-file-organizer/">
          Offline AI File Organizer
        </a>

      </div>

    </div>

  </div>

</div>

<div class="footer-space"></div>

</body>
</html>
`;


  fs.writeFileSync(
    path.join(folder, "index.html"),
    html
  );
}

/* BLOG - ONLY PAGES IN SITEMAP */

const sitemapPages = new Set([
  "organize-downloads-folder-automatically",
  "organize-pdfs-automatically",
  "clean-desktop-clutter",
  "organize-screenshots-automatically",
  "rename-files-automatically",
  "ai-file-organizer-for-windows",
  "offline-ai-file-organizer",
  "organize-work-files",
  "organize-research-documents",
  "organize-invoices-automatically",
  "desktop-file-management",
  "digital-file-minimalism",
]);

let generated = 0;

for (const [slug, post] of Object.entries(blogPosts)) {
  if (!sitemapPages.has(slug)) {
    continue;
  }

  createPage(
    `blog/${slug}`,
    post.title,
    post.description,
    post.sections
  );

  generated++;
}

console.log("Generated blog pages:", generated);

/* DOCS */

for (const [slug, doc] of Object.entries(docs)) {
  createPage(
    `docs/${slug}`,
    doc.title,
    doc.description,
    doc.sections
  );
}

/* FEATURES */

for (const [slug, feature] of Object.entries(features)) {
  createPage(
    `features/${slug}`,
    feature.title,
    feature.description,
    feature.sections
  );
}

/* USE CASES */

for (const [slug, useCase] of Object.entries(useCases)) {
  createPage(
    `use-cases/${slug}`,
    useCase.title,
    useCase.description,
    useCase.sections
  );
}

/* COMPARISONS */

for (const [slug, comparison] of Object.entries(comparisons)) {
  createPage(
    `alternatives/${slug}`,
    comparison.title,
    comparison.description,
    comparison.sections
  );
}

/* CATEGORIES */

for (const [slug, category] of Object.entries(categories)) {
  createPage(
    `category/${slug}`,
    category.title,
    category.description
  );
}

console.log("All static SEO pages generated.");