import { ArrowUpRight } from "lucide-react";
import { relatedProducts } from "@/config/relatedProducts";

const RelatedProducts = () => (
  <section
    id="other-products"
    aria-labelledby="other-products-title"
    data-related-products
    className="mx-auto mb-8 max-w-5xl border-b border-border pb-8"
  >
    <h2 id="other-products-title" className="text-lg font-semibold text-foreground">
      Other products by Computora
    </h2>
    <div className="mt-5 grid gap-6 md:grid-cols-2">
      {relatedProducts.map((item) => (
        <article key={item.id} className="flex min-w-0 items-start gap-3">
          <img src={item.icon} alt="" width="32" height="32" loading="lazy" className="h-8 w-8 shrink-0 object-contain" />
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            <a
              href={item.url}
              className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground underline decoration-primary/60 underline-offset-4 hover:decoration-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Learn more<span className="sr-only"> about {item.name}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default RelatedProducts;
