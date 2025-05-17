"use server";
import type { DecimalToBinaryStep, BinaryToDecimalStep, AnimationStep } from "@/types/animation";
import type { Base } from "./constants";
import { getBaseLabel, isValidNumberForBase } from "./constants";

const MAX_DECIMAL_FOR_ANIMATION = 1023; // 2^10 - 1, for reasonable number of powers

export async function generateDecimalToBinarySteps(decimalInput: number): Promise<{ steps: DecimalToBinaryStep[], result: string }> {
  const steps: DecimalToBinaryStep[] = [];
  let num = Math.floor(decimalInput); // Ensure integer

  if (isNaN(num) || num < 0) {
    throw new Error("Input must be a non-negative integer.");
  }
  
  if (num > MAX_DECIMAL_FOR_ANIMATION) {
     steps.push({
      type: "INITIAL",
      decimal: num,
      powers: [],
      workingDecimal: num,
      currentBinary: "",
      explanation: `Input ${num} is too large for detailed step-by-step animation (max ${MAX_DECIMAL_FOR_ANIMATION}). Direct conversion will be shown.`,
    });
    const binaryResult = num.toString(2);
    steps.push({
      type: "FINAL_RESULT",
      binaryResult: binaryResult,
      originalDecimal: num,
      explanation: `The binary representation of ${num} is ${binaryResult}.`
    });
    return { steps, result: binaryResult };
  }


  if (num === 0) {
    steps.push({
      type: "INITIAL",
      decimal: 0,
      powers: [1],
      workingDecimal: 0,
      currentBinary: "",
      explanation: "Converting 0 to binary."
    });
    steps.push({
      type: "FINAL_RESULT",
      binaryResult: "0",
      originalDecimal: 0,
      explanation: "0 in decimal is 0 in binary."
    });
    return { steps, result: "0" };
  }

  const powers: number[] = [];
  let p = 0;
  while (Math.pow(2, p) <= num) {
    powers.push(p);
    p++;
  }
  if (powers.length === 0 && num > 0) { // e.g. num = 0.5, though we take floor. This handles num = 1.
      powers.push(0);
  }
  powers.sort((a, b) => b - a); // Ensure descending order [..., 4, 2, 1, 0] for powers of 2.

  steps.push({
    type: "INITIAL",
    decimal: num,
    powers: powers.map(power => Math.pow(2,power)),
    workingDecimal: num,
    currentBinary: "",
    explanation: `Starting conversion of ${num} (decimal) to binary. We'll use powers of 2: ${powers.map(pVal => Math.pow(2,pVal)).join(', ')}.`,
  });

  let binaryResult = "";
  let workingDecimal = num;

  for (const power of powers) {
    const powerValue = Math.pow(2, power);
    const canSubtract = workingDecimal >= powerValue;

    steps.push({
      type: "COMPARE",
      power: power,
      powerValue: powerValue,
      workingDecimal: workingDecimal,
      canSubtract: canSubtract,
      currentBinary: binaryResult,
      explanation: `Comparing remaining value ${workingDecimal} with 2^${power} (${powerValue}). ${workingDecimal} is ${canSubtract ? 'greater than or equal to' : 'less than'} ${powerValue}.`,
    });

    if (canSubtract) {
      binaryResult += "1";
      workingDecimal -= powerValue;
      steps.push({
        type: "RESULT_BIT",
        bit: "1",
        power: power,
        powerValue: powerValue,
        workingDecimalAfterSubtract: workingDecimal,
        currentBinary: binaryResult,
        explanation: `Write '1'. Subtract ${powerValue}. New remaining value: ${workingDecimal}. Binary so far: ${binaryResult}.`
      });
    } else {
      binaryResult += "0";
      steps.push({
        type: "RESULT_BIT",
        bit: "0",
        power: power,
        powerValue: powerValue,
        workingDecimalAfterSubtract: workingDecimal, // No change
        currentBinary: binaryResult,
        explanation: `Write '0'. Remaining value: ${workingDecimal}. Binary so far: ${binaryResult}.`
      });
    }
  }
  
  // Ensure the result isn't empty if all bits were zero (e.g. for num=0, handled, but good practice)
  const finalBinary = binaryResult || "0";

  steps.push({
    type: "FINAL_RESULT",
    binaryResult: finalBinary,
    originalDecimal: num,
    explanation: `Conversion complete. ${num} (decimal) is ${finalBinary} (binary).`
  });

  return { steps, result: finalBinary };
}


export async function generateBinaryToDecimalSteps(binaryInput: string): Promise<{ steps: BinaryToDecimalStep[], result: number }> {
  const steps: BinaryToDecimalStep[] = [];
  
  if (!/^[01]+$/.test(binaryInput)) {
    throw new Error("Input must be a valid binary string.");
  }

  steps.push({
    type: "INITIAL",
    binary: binaryInput,
    explanation: `Starting conversion of ${binaryInput} (binary) to decimal. We'll sum values of positions with '1'.`
  });

  let decimalResult = 0;
  const n = binaryInput.length;

  for (let i = 0; i < n; i++) {
    const bit = binaryInput[n - 1 - i]; // Iterate from right (LSB)
    const power = i;
    const value = parseInt(bit) * Math.pow(2, power);

    steps.push({
      type: "CALCULATE_BIT_VALUE",
      bit: bit,
      power: power,
      value: value,
      currentIndex: n - 1 - i,
      currentSum: decimalResult,
      explanation: `Bit at position ${power} (from right, 0-indexed) is ${bit}. Value = ${bit} * 2^${power} = ${value}.`
    });

    if (parseInt(bit) === 1) {
      const oldSum = decimalResult;
      decimalResult += value;
      steps.push({
        type: "ADD_TO_SUM",
        bitValue: value,
        currentSum: oldSum,
        newSum: decimalResult,
        currentIndex: n-1-i,
        explanation: `Adding ${value} to sum. Current sum: ${oldSum} + ${value} = ${decimalResult}.`
      });
    }
  }
  
  steps.push({
    type: "FINAL_RESULT",
    decimalResult: decimalResult,
    originalBinary: binaryInput,
    explanation: `Conversion complete. ${binaryInput} (binary) is ${decimalResult} (decimal).`
  });

  return {steps, result: decimalResult};
}


// Main conversion orchestrator
export async function convertNumber(
  value: string,
  fromBase: Base,
  toBase: Base
): Promise<{ result: string; steps: AnimationStep[]; explanation?: string }> {
  if (!value) {
    return { result: "", steps: [], explanation: "Please enter a number to convert." };
  }
  if (!isValidNumberForBase(value, fromBase)) {
     return { result: "", steps: [], explanation: `Invalid number '${value}' for ${getBaseLabel(fromBase)}.` };
  }

  // Direct conversions with specific step generation
  if (fromBase === 10 && toBase === 2) {
    const decimalValue = parseInt(value, 10);
    if (isNaN(decimalValue)) return { result: "", steps: [], explanation: "Invalid decimal number."};
    const { steps, result } = await generateDecimalToBinarySteps(decimalValue);
    return { result, steps: steps as AnimationStep[] };
  }
  if (fromBase === 2 && toBase === 10) {
    const { steps, result } = await generateBinaryToDecimalSteps(value);
    return { result: result.toString(), steps: steps as AnimationStep[] };
  }

  // Indirect conversions or those not yet animated
  // Fallback to standard toString/parseInt for non-animated paths
  let base10Representation: number;
  try {
    base10Representation = parseInt(value, fromBase);
    if (isNaN(base10Representation)) {
      throw new Error("Invalid number for source base during intermediate conversion.");
    }
  } catch (e) {
    return { result: "", steps: [], explanation: `Error converting '${value}' from ${getBaseLabel(fromBase)}.` };
  }
  
  let finalResult: string;
  try {
    finalResult = base10Representation.toString(toBase).toUpperCase();
  } catch (e) {
     return { result: "", steps: [], explanation: `Error converting to ${getBaseLabel(toBase)}.` };
  }

  // Placeholder steps for non-animated conversions
  const placeholderSteps: AnimationStep[] = [
    {
      type: "INITIAL",
      // @ts-ignore
      decimal: fromBase === 10 ? parseInt(value) : value, 
      explanation: `Converting ${value} from ${getBaseLabel(fromBase)} to ${getBaseLabel(toBase)}. (Animation for this path is not yet implemented).`
    },
    // @ts-ignore
    { type: "FINAL_RESULT", binaryResult: finalResult, originalDecimal: value, explanation: `Result: ${finalResult}` }
  ];

  return { result: finalResult, steps: placeholderSteps };
}
