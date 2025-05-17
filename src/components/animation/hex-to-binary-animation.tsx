"use client";

import type { HexToBinaryStep } from "@/types/animation";
import { motion, AnimatePresence } from "framer-motion";

interface HexToBinaryAnimationProps {
  step: HexToBinaryStep | null;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 100 },
  }),
};

const highlightDigitVariant = {
  initial: { scale: 1},
  highlight: { scale: 1.1, transition: { duration: 0.3 } },
};

export function HexToBinaryAnimation({ step }: HexToBinaryAnimationProps) {
  if (!step) return <div className="p-4 text-muted-foreground">Animation will appear here.</div>;

  const renderStep = () => {
    switch (step.type) {
      case "INITIAL_HEX_TO_BIN":
        return (
          <div className="space-y-3">
            <p>Converting: <span className="font-bold text-primary text-xl font-mono">{step.hexInput}</span> (Hexadecimal) to Binary</p>
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        );
      case "PROCESS_HEX_DIGIT":
        return (
          <div className="space-y-3">
            <p>Processing hex digit {step.digitIndex + 1} of {step.allHexDigits.length}:</p>
            <div className="font-mono text-2xl flex space-x-1 bg-muted p-3 rounded-md justify-center items-center flex-wrap">
              {step.allHexDigits.map((digit, index) => (
                 <motion.span 
                    key={index} 
                    className={`p-1.5 rounded min-w-[2ch] text-center ${index === step.digitIndex ? 'bg-primary/20' : 'bg-background'}`}
                    variants={highlightDigitVariant}
                    animate={index === step.digitIndex ? "highlight" : "initial"}
                  >
                    {digit}
                 </motion.span>
              ))}
            </div>
            <div className="text-center mt-3 p-3 bg-muted/50 rounded-md">
              <p className="text-lg">
                Digit <span className="font-mono font-bold text-primary">{step.hexDigit}</span> converts to 
                <span className="font-mono font-bold text-2xl text-green-400 ml-2 p-1 bg-green-400/10 rounded">{step.binaryEquivalent}</span> (Binary)
              </p>
            </div>
            {step.currentBinaryResult && 
              <p>Binary string so far: <span className="font-mono font-bold break-all">{step.currentBinaryResult}</span></p>
            }
            <p className="text-sm text-muted-foreground mt-1">{step.explanation}</p>
          </div>
        );
      case "FINAL_RESULT_HEX_TO_BIN":
        return (
          <div className="space-y-3">
            <p>Original Hex: <span className="font-bold text-primary font-mono">{step.originalHex}</span></p>
            <p className="text-lg">Final Binary Result:</p>
            <motion.div
              className="font-mono text-2xl font-bold text-green-400 p-2 bg-foreground/10 rounded-md inline-block max-w-full overflow-x-auto break-all"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {step.binaryResult.split("").map((char, i) => (
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
        return <p>Unknown step type.</p>;
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