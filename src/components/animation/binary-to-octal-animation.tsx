"use client";

import type { BinaryToOctalStep } from "@/types/animation";
import { motion, AnimatePresence } from "framer-motion";

interface BinaryToOctalAnimationProps {
  step: BinaryToOctalStep | null;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 100 },
  }),
};

const highlightGroupVariant = {
  initial: { scale: 1},
  highlight: { scale: 1.05, transition: { duration: 0.3 } },
};

export function BinaryToOctalAnimation({ step }: BinaryToOctalAnimationProps) {
  if (!step) return <div className="p-4 text-muted-foreground">Animation will appear here.</div>;

  const renderStep = () => {
    switch (step.type) {
      case "INITIAL":
        return (
          <div className="space-y-3">
            <p>Converting: <span className="font-bold text-primary text-xl font-mono">{step.binary}</span> (Binary) to Octal</p>
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        );
      case "SHOW_GROUPS":
        return (
          <div className="space-y-3">
            <p>Padded and Grouped Binary: </p>
            <div className="font-mono text-xl flex space-x-2 bg-muted p-2 rounded-md justify-center">
              {step.groups.map((group, index) => (
                <motion.span 
                  key={index} 
                  custom={index} 
                  variants={itemVariants} 
                  initial="hidden" 
                  animate="visible"
                  className="p-1 bg-background rounded"
                >
                  {group}
                </motion.span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        );
      case "PROCESS_GROUP":
        return (
          <div className="space-y-3">
            <p>Processing group {step.groupIndex + 1} of {step.allGroups.length}:</p>
            <div className="font-mono text-xl flex space-x-2 bg-muted p-2 rounded-md justify-center">
              {step.allGroups.map((g, index) => (
                 <motion.span 
                    key={index} 
                    className={`p-1 rounded ${index === step.groupIndex ? 'bg-primary/20' : 'bg-background'}`}
                    variants={highlightGroupVariant}
                    animate={index === step.groupIndex ? "highlight" : "initial"}
                  >
                    {g}
                 </motion.span>
              ))}
            </div>
            <p className="text-center mt-2">
              Group <span className="font-mono font-bold text-primary">{step.group}</span> = <span className="font-bold text-2xl text-green-400">{step.octalDigit}</span> (Octal)
            </p>
            {step.currentOctalResult && <p>Octal so far: <span className="font-mono font-bold">{step.currentOctalResult}</span></p>}
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        );
      case "FINAL_RESULT":
        return (
          <div className="space-y-3">
            <p>Original Binary: <span className="font-bold text-primary font-mono">{step.originalBinary}</span></p>
            <p className="text-lg">Final Octal Result:</p>
            <motion.div
              className="font-mono text-3xl font-bold text-green-400 p-2 bg-foreground/10 rounded-md inline-block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {step.octalResult.split("").map((char, i) => (
                <motion.span key={i} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                  {char}
                </motion.span>
              ))}
            </motion.div>
            <p className="text-sm text-muted-foreground mt-2">{step.explanation}</p>
          </div>
        );
      default:
        const _exhaustiveCheck: never = step;
        return <p>Unknown step type: {(_exhaustiveCheck as any).type}</p>;
    }
  };

  return (
    <div className="p-4 min-h-[200px] bg-card rounded-lg border">
      <AnimatePresence mode="wait">
        <motion.div
          key={step.type + step.explanation} // Unique key for transition
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 