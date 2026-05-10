import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
}

const SeoHead = ({
  title,
  description,
  canonical,
  image = "/og-image.png",
}: SeoHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

export default SeoHead;