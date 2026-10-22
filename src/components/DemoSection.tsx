import { useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";

import demoVideo from "../assets/foldora-demo.mp4";
import demoImg from "../assets/foldora-demo.png";
import { checkoutTrackingAttributes, checkoutUrl } from "@/config/product";

const DemoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [playRequested, setPlayRequested] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const checkout = checkoutUrl("homepage", "demo-section");

  const playVideo = async () => {
    if (!videoRef.current) return;

    setPlayRequested(true);
    try {
      await videoRef.current.play();
    } catch {
      // Safari can reject a scripted play request while native controls remain usable.
      videoRef.current.controls = true;
    }
  };

  return (
    <section id="demo" className="border-y border-border/60 py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Watch Foldora Organize Messy Files in Seconds
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            See how Foldora transforms cluttered folders into an organized structure using local AI. Preview every change before applying it.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-5xl md:mt-10">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-primary/20 bg-black shadow-2xl">
            {videoFailed ? (
              <div className="relative h-full w-full">
                <img
                  src={demoImg}
                  alt="Foldora showing the current file structure beside its proposed organized structure"
                  width="1902"
                  height="918"
                  className="h-full w-full object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/85 px-4 py-3 text-center text-sm text-white">
                  The video could not load. This real Foldora preview shows the current and proposed folder structures before changes are applied.
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  poster={demoImg}
                  width="1280"
                  height="720"
                  aria-label="Foldora AI organizing messy files and previewing the proposed structure"
                  aria-describedby="foldora-demo-description"
                  onPlay={() => setHasStarted(true)}
                  onEnded={() => setHasStarted(false)}
                  onError={(event) => {
                    if (event.currentTarget.error) setVideoFailed(true);
                  }}
                  className="h-full w-full object-contain"
                >
                  <source src={demoVideo} type="video/mp4" />
                  <track
                    kind="captions"
                    src="/foldora-demo-captions.vtt"
                    srcLang="en"
                    label="English visual description"
                  />
                  Your browser cannot play this video. The Foldora product screenshot remains available as a preview.
                </video>

                {!hasStarted && !playRequested && (
                  <button
                    type="button"
                    onClick={playVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors hover:bg-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                    aria-label="Play Foldora demonstration"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/80 text-white shadow-xl md:h-20 md:w-20">
                      <Play className="ml-1 h-7 w-7 fill-current md:h-9 md:w-9" aria-hidden="true" />
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <p
          id="foldora-demo-description"
          className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-muted-foreground"
        >
          Select a folder, let Foldora prepare an organization plan, then review the proposed folders and filenames before applying anything.
        </p>

        <div className="mt-6 flex justify-center">
          <a
            href={checkout}
            target="_blank"
            rel="noopener noreferrer"
            {...checkoutTrackingAttributes("gumroad", "demo-section")}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            Get Foldora — $14.99
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
