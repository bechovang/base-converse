"use client";

import type { DecimalToBinaryStep } from "@/types/animation";
import { motion, AnimatePresence } from "framer-motion";

interface DecimalToBinaryAnimationProps {
  step: DecimalToBinaryStep | null;
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
  initial: { scale: 1,  backgroundColor: "transparent" },
  highlight: { scale: 1.1, backgroundColor: "hsl(var(--primary) / 0.3)", transition: { duration: 0.3 } },
  dim: { opacity: 0.5, transition: {duration: 0.3} }
};

export function DecimalToBinaryAnimation({ step }: DecimalToBinaryAnimationProps) {
  if (!step) return <div className="p-4 text-muted-foreground">Animation will appear here.</div>;

  const renderStep = () => {
    switch (step.type) {
      case "INITIAL":
        return (
          <div className="space-y-3">
            <p>Converting: <span className="font-bold text-primary text-xl">{step.decimal}</span></p>
            {step.powers.length > 0 && <p>Powers of 2 to check: {step.powers.join(", ")}</p>}
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        );
      case "COMPARE":
        return (
          <div className="space-y-3">
            <p>Remaining: <span className="font-bold text-xl">{step.workingDecimal}</span></p>
            <p>
              Comparing with <motion.span custom={0} initial="initial" animate="highlight" variants={highlightVariants} className="font-bold text-primary p-1 rounded-md">2<sup>{step.power}</sup> ({step.powerValue})</motion.span>
            </p>
            <p>{step.workingDecimal} {step.canSubtract ? ">=" : "<"} {step.powerValue} ? <span className={step.canSubtract ? "text-green-400" : "text-red-400"}>{step.canSubtract ? "Yes" : "No"}</span></p>
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
            {step.currentBinary && <p>Binary so far: <span className="font-mono">{step.currentBinary}</span></p>}
          </div>
        );
      case "RESULT_BIT":
        return (
          <div className="space-y-3">
            <p>Wrote bit: <motion.span custom={0} initial="hidden" animate="visible" className="font-bold text-2xl text-accent p-1 rounded-md">{step.bit}</motion.span></p>
            <p>Checked against: <span className="font-bold text-primary">2<sup>{step.power}</sup> ({step.powerValue})</span></p>
            <p>Remaining decimal: <span className="font-bold text-xl">{step.workingDecimalAfterSubtract}</span></p>
            <p>Binary so far: <span className="font-mono font-bold">{step.currentBinary}</span></p>
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        );
      case "FINAL_RESULT":
        return (
          <div className="space-y-3">
             <p>Original Decimal: <span className="font-bold text-primary">{step.originalDecimal}</span></p>
            <p className="text-lg">Final Binary Result:</p>
            <motion.div
              className="font-mono text-3xl font-bold text-green-400 p-2 bg-foreground/10 rounded-md inline-block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {step.binaryResult.split("").map((bit, i) => (
                <motion.span key={i} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                  {bit}
                </motion.span>
              ))}
            </motion.div>
            <p className="text-sm text-muted-foreground mt-2">{step.explanation}</p>
          </div>
        );
      default:
        return <p>Unknown step type.</p>;
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
