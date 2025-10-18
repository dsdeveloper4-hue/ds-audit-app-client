"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-[50000]"
    >
      <Button
        onClick={toggleTheme}
        variant="ghost"
        size="icon"
        className={`
          h-14 w-14
          rounded-full
          bg-background/80
          backdrop-blur-lg
          border border-border
          shadow-lg
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 hover:shadow-xl
          active:scale-95
        `}
      >
        {theme === "dark" ? (
          <Sun className="h-8 w-8 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)] transition-transform duration-300" />
        ) : (
          <Moon className="h-8 w-8 text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.6)] transition-transform duration-300" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}
