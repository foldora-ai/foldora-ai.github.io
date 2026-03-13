const testimonials = [
  {
    quote:
      "As a project manager, I was drowning in files and documents. Foldora saved me hours each week. It's a game-changer for anyone who needs to stay on top of their work.",
    author: "Daniel R.",
    role: "Project Manager"
  },
  {
    quote:
      "I used to waste so much time searching for files. Now everything is organized and easy to find. The fact that it works offline makes it even better for my privacy concerns.",
    author: "Laura M.",
    role: "Consultant"
  },
  {
    quote:
      "It's honestly one of the best productivity tools I've come across. I no longer have to deal with the stress of misplaced files. Everything is categorized and organized for me.",
    author: "Michael T.",
    role: "Entrepreneur"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding">
      <div className="container">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What People Say About Foldora
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6"
            >
              <p className="text-muted-foreground italic">
                "{t.quote}"
              </p>

              <div className="mt-4">
                <p className="font-semibold">{t.author}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;