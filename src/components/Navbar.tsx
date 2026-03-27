import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-lg font-bold text-foreground">

          <img
            src="/favicon.ico"
            alt="Foldora AI"
            className="h-8 w-8 object-contain"
          />


          Foldora AI
        </a>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
        </div>
        <a
          // href="#pricing"
          href="https://foldora.gumroad.com/l/foldora"
          target="_blank"
          rel="noopener noreferrer"          
          className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Download
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
