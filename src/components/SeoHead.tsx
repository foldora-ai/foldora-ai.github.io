import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  robots?: string;
  schema?: object;
}

const SeoHead = ({
  title,
  description,
  canonical,
  image = "/favicon.ico",
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  schema,
}: SeoHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="Foldora AI" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {canonical && <link rel="canonical" href={canonical} />}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema).replaceAll("<", "\\u003c")}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
