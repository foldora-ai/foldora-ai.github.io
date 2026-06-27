import demoVideo from "../assets/foldora-demo.mp4";
import demoImg from "../assets/foldora-demo.png";

const DemoSection = () => {
  return (
    <section id="demo" className="section-padding">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            See the review workflow before you buy
          </h2>

          <p className="mt-4 text-muted-foreground md:text-lg">
            Foldora is not meant to hide file changes. Use the demo area to understand the analyze, preview, and apply flow.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-primary/20 bg-card shadow-2xl">
            <video
              controls
              muted
              playsInline
              preload="metadata"
              poster={demoImg}
              width="1200"
              height="700"
              className="aspect-[12/7] w-full bg-background"
            >
              <source src={demoVideo} type="video/mp4" />
            </video>
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground/90">
          The important step is the preview: review proposed folders and filenames before applying changes to important files.
        </p>
      </div>
    </section>
  );
};

export default DemoSection;
