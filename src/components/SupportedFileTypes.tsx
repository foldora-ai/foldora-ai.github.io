import { product } from "@/config/product";

const fileTypes = Object.entries(product.supportedFileTypes);

const SupportedFileTypes = () => {
  return (
    <section className="section-padding">
      <div className="container">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Supported File Types
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">

          {fileTypes.map(([title, types]) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <h3 className="font-semibold text-lg mb-3">
                {title}
              </h3>

                <div className="flex flex-wrap justify-center gap-2">
                {types.map((t) => (
                    <span
                    key={t}
                    className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground"
                    >
                    {t}
                    </span>
                ))}
                </div>

              {/* <p className="text-muted-foreground text-sm">
                {type.types.join(", ")}
              </p> */}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default SupportedFileTypes;
