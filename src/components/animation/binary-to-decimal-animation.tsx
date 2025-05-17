"use client";

import type { BinaryToDecimalStep } from "@/types/animation";
import { motion, AnimatePresence } from "framer-motion";

interface BinaryToDecimalAnimationProps {
  step: BinaryToDecimalStep | null;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 100 },
  }),
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const highlightVariants = {
  initial: { scale: 1 },
  highlight: { scale: 1.1, transition: { duration: 0.3 } },
  dim: { opacity: 0.5, transition: { duration: 0.3 } }
};

export function BinaryToDecimalAnimation({ step }: BinaryToDecimalAnimationProps) {
  if (!step) return <div className="p-4 text-muted-foreground">Animation will appear here.</div>;

  const renderStep = () => {
    switch (step.type) {
      case "INITIAL":
        return (
          <div className="space-y-3">
            <p>Converting: <span className="font-bold text-primary text-xl font-mono">{step.binary}</span> (Binary)</p>
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        );
      case "CALCULATE_BIT_VALUE":
        // Placeholder for CALCULATE_BIT_VALUE step animation
        const binaryChars = step.binary.split('');
        const n = binaryChars.length;
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1 text-center">Binary String & Powers of 2:</p>
              <div className="font-mono text-lg flex flex-col items-center bg-muted p-2 rounded-md">
                <div className="flex space-x-1">
                  {binaryChars.map((char, index) => (
                    <motion.span
                      key={`bit-${index}`}
                      className={`p-1 rounded-md w-6 text-center ${index === step.currentIndex ? 'bg-primary text-primary-foreground font-bold scale-110 ring-2 ring-primary ring-offset-2 ring-offset-muted' : 'bg-background'}`}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <div className="flex space-x-1 text-xs text-muted-foreground mt-1">
                  {binaryChars.map((_, index) => (
                    <span
                      key={`power-${index}`}
                      className={`p-1 w-6 text-center ${index === step.currentIndex ? 'font-bold text-primary scale-105' : ''}`}
                    >
                      2<sup>{n - 1 - index}</sup>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Processing:</p>
              <p>Bit at index {step.currentIndex} (value <span className="font-bold text-primary">{step.bit}</span>), position {step.power} (from right, 0-indexed).</p>
              <p>Calculation: <span className="font-bold">{step.bit}</span> × 2<sup>{step.power}</sup> = <motion.span custom={0} initial="initial" animate="highlight" variants={highlightVariants} className="font-bold p-1 rounded-md bg-primary/10 text-primary">{step.value}</motion.span></p>
            </div>
            
            <p>Current Sum: <span className="font-bold">{step.currentSum}</span></p>
            <p className="text-xs text-muted-foreground italic">{step.explanation}</p>
          </div>
        );
      case "ADD_TO_SUM":
        // Placeholder for ADD_TO_SUM step animation
        return (
          <div className="space-y-3">
            <p>Adding to sum...</p>
            <p>Adding value: <motion.span custom={0} initial="initial" animate="highlight" variants={highlightVariants} className="font-bold p-1 rounded-md">{step.bitValue}</motion.span></p>
            <p>Current Sum: {step.currentSum} + {step.bitValue} = <span className="font-bold text-xl text-green-400">{step.newSum}</span></p>
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        );
      case "FINAL_RESULT":
        // Placeholder for FINAL_RESULT step animation
        return (
          <div className="space-y-3">
            <p>Original Binary: <span className="font-bold text-primary font-mono">{step.originalBinary}</span></p>
            <p className="text-lg">Final Decimal Result:</p>
            <motion.div
              className="text-3xl font-bold text-green-400 p-2 bg-foreground/10 rounded-md inline-block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {step.decimalResult.toString().split("").map((char, i) => (
                <motion.span key={i} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                  {char}
                </motion.span>
              ))}
            </motion.div>
            <p className="text-sm text-muted-foreground mt-2">{step.explanation}</p>
          </div>
        );
      default:
        // Ensure exhaustive check if all step types are handled
        const _exhaustiveCheck: never = step;
        return <p>Unknown step type: {(_exhaustiveCheck as any).type}</p>;
    }
  };

  return (
    <div className="p-4 min-h-[200px] bg-card rounded-lg border">
      <AnimatePresence mode="wait">
        <motion.div
          key={step.explanation} // Unique key for transition
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