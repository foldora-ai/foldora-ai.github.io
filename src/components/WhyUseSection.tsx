const features = [
  {
    title: "Clean messy folders instantly",
    text: "Stop digging through hundreds of random files."
  },
  {
    title: "Save hours of manual sorting",
    text: "Automatically categorize files into logical folders."
  },
  {
    title: "Runs fully offline",
    text: "Your files stay private. Nothing is uploaded."
  },
  
  {
    title: "Preview before applying changes",
    text: "Review the new structure before anything moves."
  }
];

const WhyUseSection = () => {
  return (
    <section className="section-padding">
      <div className="container">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why People Use Foldora
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-muted-foreground mt-2">{f.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyUseSection;