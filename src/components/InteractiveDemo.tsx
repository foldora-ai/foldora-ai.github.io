import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileImage,
  FileText,
  FileSpreadsheet,
  FolderOpen,
  Wand2,
  FolderPlus,
  Presentation
} from "lucide-react";

const originalFiles = [
  { name: "IMG_20230515_14.990322.jpg", path: "/DCIM/Camera/IMG_20230515_14.990322.jpg", icon: FileImage, color: "text-blue-400" },
  { name: "DOC_20231121.pdf", path: "/Downloads/DOC_20231121.pdf", icon: FileText, color: "text-red-400" },
  { name: "scan0001.pdf", path: "/Documents/scan0001.pdf", icon: FileText, color: "text-red-400" },
  { name: "financials.xlsx", path: "/Downloads/financials.xlsx", icon: FileSpreadsheet, color: "text-green-400" },
  { name: "notes.txt", path: "/Desktop/notes.txt", icon: FileText, color: "text-purple-400" },
  { name: "presentation.pptx", path: "/Work/presentation.pptx", icon: Presentation, color: "text-orange-400" },
  { name: "IMG_4829.png", path: "/Downloads/IMG_4829.png", icon: FileImage, color: "text-blue-400" },
  { name: "report_final_v3.docx", path: "/Documents/report_final_v3.docx", icon: FileText, color: "text-blue-400" },
];

const organizedStructure = [
  {
    folder: "Vacation Photos",
    files: [
      { name: "Beach_Day_2023.jpg", path: "/Photos/Vacations/Beach_Day_2023.jpg", icon: FileImage, color: "text-blue-400" },
      { name: "Mountain_Hike.jpg", path: "/Photos/Vacations/Mountain_Hike.jpg", icon: FileImage, color: "text-blue-400" },
    ],
  },
  {
    folder: "Work Documents",
    files: [
      { name: "Q3_Financial_Report.xlsx", path: "/Work/Finance/Q3_Report.xlsx", icon: FileSpreadsheet, color: "text-green-400" },
      { name: "Client_Meeting.pptx", path: "/Work/Presentations/Client_Meeting.pptx", icon: Presentation, color: "text-orange-400" },
      { name: "Project_Plan.docx", path: "/Work/Documents/Project_Plan.docx", icon: FileText, color: "text-blue-400" },
    ],
  },
  {
    folder: "Personal",
    files: [
      { name: "Contract_Agreement.pdf", path: "/Personal/Documents/Contract_Agreement.pdf", icon: FileText, color: "text-red-400" },
      { name: "Utility_Bill_Nov_2023.pdf", path: "/Personal/Scans/Utility_Bill.pdf", icon: FileText, color: "text-red-400" },
    ],
  },
  {
    folder: "Meeting Notes",
    files: [
      { name: "Project_Brainstorm_Notes.txt", path: "/Work/Meetings/Project_Brainstorm_Notes.txt", icon: FileText, color: "text-purple-400" },
    ],
  },
];

const InteractiveDemo = () => {
  const [organized, setOrganized] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Scanning files...");

  const handleOrganize = () => {
    if (animating) return;

    setAnimating(true);
    setProgress(0);
    setStatus("Scanning files...");

    const duration = 900;
    const intervalTime = 50;
    const steps = duration / intervalTime;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      const newProgress = (currentStep / steps) * 100;
      setProgress(newProgress);

      if (newProgress < 20) setStatus("Scanning files...");
      else if (newProgress < 40) setStatus("Analyzing file types...");
      else if (newProgress < 60) setStatus("Reading metadata...");
      else if (newProgress < 80) setStatus("Generating folder structure...");
      else setStatus("Organizing files...");

      if (currentStep >= steps) {
        clearInterval(interval);

        setTimeout(() => {
          setOrganized((prev) => !prev);
          setAnimating(false);
        }, 200);
      }
    }, intervalTime);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={handleOrganize}
        disabled={animating}
        className="mx-auto mb-6 flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-shadow disabled:opacity-60"
      >
        <Wand2 className={`h-4 w-4 ${animating ? "animate-spin" : ""}`} />
        {animating
          ? "Organizing..."
          : organized
          ? "Reset Files"
          : "Start AI Organization"}
      </button>

      {animating && (
        <div className="mb-8">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-2 bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            {status} {Math.floor(progress)}%
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div
          className={`rounded-2xl border-2 border-dashed p-5 transition-colors duration-500 ${
            organized ? "border-muted/30 bg-card/30" : "border-border bg-card"
          }`}
        >
          <div className="mb-4 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              Original Files
            </span>
          </div>

          <div className="space-y-2">
            {originalFiles.map((file, i) => {
              const Icon = file.icon;

              return (
                <motion.div
                  key={file.name}
                  animate={{
                    opacity: organized ? 0.3 : 1,
                    x: organized ? -8 : 0
                  }}
                  transition={{
                    duration: 0.4,
                    delay: organized
                      ? i * 0.05
                      : (originalFiles.length - i) * 0.05
                  }}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/50 px-3 py-2.5"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${file.color}`} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {file.path}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div
          className={`rounded-2xl border-2 p-5 transition-colors duration-500 ${
            organized
              ? "border-primary/30 bg-primary/5"
              : "border-dashed border-border bg-card/30"
          }`}
        >
          <div className="mb-4 flex items-center gap-2">
            <FolderPlus
              className={`h-5 w-5 transition-colors ${
                organized ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span className="text-sm font-semibold text-foreground">
              Organized Structure
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!organized ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-48 items-center justify-center"
              >
                <p className="text-sm text-muted-foreground">
                  Click "Start AI Organization" to see the magic ✨
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="organized"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {organizedStructure.map((group, gi) => (
                  <motion.div
                    key={group.folder}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: gi * 0.12 }}
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-base">📁</span>
                      <span className="text-sm font-semibold text-foreground">
                        {group.folder}
                      </span>
                    </div>

                    <div className="ml-4 space-y-1.5">
                      {group.files.map((file, fi) => {
                        const Icon = file.icon;

                        return (
                          <motion.div
                            key={file.name}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: gi * 0.12 + fi * 0.08 + 0.15
                            }}
                            className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2"
                          >
                            <Icon
                              className={`h-4 w-4 shrink-0 ${file.color}`}
                            />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {file.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {file.path}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;