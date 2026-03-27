const fileTypes = [
  {
    title: "Images",
    types: ["PNG", "JPG", "JPEG", "GIF", "WEBP"],
  },
  {
    title: "Documents",
    types: ["PDF", "DOCX", "TXT"],
  },
  {
    title: "Spreadsheets",
    types: ["XLSX", "CSV"],
  },
  {
    title: "Presentations",
    types: ["PPT", "PPTX"],
  },
];

const SupportedFileTypes = () => {
  return (
    <section className="section-padding">
      <div className="container">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Supported File Types
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">

          {fileTypes.map((type, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <h3 className="font-semibold text-lg mb-3">
                {type.title}
              </h3>

                <div className="flex flex-wrap justify-center gap-2">
                {type.types.map((t) => (
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