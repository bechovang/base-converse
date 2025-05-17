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
  initial: { scale: 1 }, 
  highlight: { scale: 1.1, transition: { duration: 0.3 } },
  dim: { opacity: 0.5, transition: {duration: 0.3} }
};

export function DecimalToBinaryAnimation({ step }: DecimalToBinaryAnimationProps) {
  if (!step) return <div className="p-4 text-muted-foreground">Animation will appear here.</div>;

  const renderStep = () => {
    switch (step.type) {
      case "INITIAL":
        return (
          <div className="space-y-3">
            <p>Converting: <span className="font-bold text-primary text-xl">{step.decimal}</span> (Decimal)</p>
            {step.powers.length > 0 && 
              <p>Powers of 2 to check: 
                <span className="font-mono ml-1">
                  {step.powers.join(", ")}
                </span>
              </p>}
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
        );
      case "PROCESS_DECIMAL_POWER_STEP":
        const bitIndex = step.currentBinary.length -1;
        return (
          <div className="space-y-4 p-1">
            {/* Table Display */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full border-collapse text-center table-fixed">
                <thead>
                  <tr className="bg-muted">
                    {step.allPowers.map((pValue, index) => (
                      <th key={`header-${index}`} className={`border p-2 font-mono text-sm md:text-base ${index === bitIndex ? 'text-primary font-bold ring-1 ring-primary' : ''}`}>
                        {pValue}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {step.allPowers.map((_, index) => (
                      <td key={`bit-cell-${index}`} className={`border p-2 font-mono text-xl md:text-2xl ${index === bitIndex ? 'text-accent font-bold ring-1 ring-primary scale-110' : 'text-muted-foreground'}`}>
                        {index < step.currentBinary.length ? step.currentBinary[index] : "-"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Detailed explanation for current power */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border p-3 rounded-md bg-muted/50 mt-4">
              <p>Remaining Decimal:</p>
              <p className="font-bold text-lg justify-self-end">{step.workingDecimalBefore}</p>
              
              <p>Current Power (2<sup>{step.power}</sup>):</p>
              <motion.p 
                custom={0} initial="initial" animate="highlight" variants={highlightVariants}
                className="font-bold text-lg text-primary justify-self-end p-0.5 rounded-sm"
              >
                {step.powerValue}
              </motion.p>

              <p>{step.workingDecimalBefore} ≥ {step.powerValue} ?</p>
              <p className={`font-bold text-lg justify-self-end ${step.canSubtract ? "text-green-500" : "text-red-500"}`}>
                {step.canSubtract ? "Yes" : "No"}
              </p>

              <p>Binary Bit Written:</p>
              <motion.p 
                key={step.currentBinary} custom={1} initial="hidden" animate="visible" variants={itemVariants}
                className={`font-bold text-2xl justify-self-end ${step.bit === "1" ? "text-accent" : "text-muted-foreground"}`}
              >
                {step.bit}
              </motion.p>
            </div>
            
            <p className="mt-3">New Remaining Decimal: <span className="font-bold text-lg">{step.workingDecimalAfter}</span></p>
            <p>Binary Result So Far: <span className="font-mono font-bold text-lg tracking-wider">{step.currentBinary}</span></p>
            <p className="text-xs text-muted-foreground italic mt-2">{step.explanation}</p>
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
