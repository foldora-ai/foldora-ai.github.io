import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  robots?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  schema?: object;
}

const SeoHead = ({
  title,
  description,
  canonical,
  image = "https://foldoraai.com/foldora-social-preview.png",
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  type = "website",
  publishedTime,
  modifiedTime,
  schema,
}: SeoHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="author" content="Foldora AI" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${title} — Foldora AI`} />
      <meta property="og:image:width" content="1902" />
      <meta property="og:image:height" content="918" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_US" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="Foldora AI" />
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {canonical && <meta name="twitter:url" content={canonical} />}

      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="en" href={canonical} />}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema).replace(/</g, "\\u003c")}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
