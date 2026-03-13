const steps = [
  {
    title: "Select a folder",
    desc: "Choose any messy folder like Downloads or Documents."
  },
  {
    title: "AI analyzes files",
    desc: "Foldora detects file types and context automatically."
  },
  {
    title: "Preview changes",
    desc: "See the organized structure before applying."
  },
  {
    title: "Clean folders",
    desc: "Files are sorted and renamed into meaningful names."
  }
];

const HowItWorksSteps = () => {
  return (
    <section className="section-padding">
      <div className="container max-w-5xl">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How Foldora Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8 text-center">

          {steps.map((step, i) => (
            <div key={i}>

              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {i + 1}
              </div>

              <h3 className="font-semibold mb-2">
                {step.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {step.desc}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default HowItWorksSteps;