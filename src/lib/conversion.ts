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

  const powersExponents = powers; // powers array already stores exponents [6, 5, ...]
  const powerValues = powersExponents.map(p => Math.pow(2,p)); // [64, 32, ...]

  steps.push({
    type: "INITIAL",
    decimal: num,
    powers: powerValues, // Pass actual values for display
    workingDecimal: num,
    currentBinary: "",
    explanation: `Starting conversion of ${num} (decimal) to binary. We'll use powers of 2: ${powers.map(pVal => Math.pow(2,pVal)).join(', ')}.`,
  });

  let binaryResult = "";
  let workingDecimalCopy = num; // Use a copy for step generation logic

  for (const power of powers) {
    const powerValue = Math.pow(2, power);
    const currentWorkingDecimal = workingDecimalCopy;
    const canSubtract = currentWorkingDecimal >= powerValue;
    let bit: "0" | "1";
    let explanationText = "";

    if (canSubtract) {
      bit = "1";
      workingDecimalCopy -= powerValue;
      binaryResult += "1";
      explanationText = `Comparing ${currentWorkingDecimal} with 2^${power} (${powerValue}). ${currentWorkingDecimal} >= ${powerValue}. Write '1'. Subtract ${powerValue}. Remaining: ${workingDecimalCopy}. Binary: ${binaryResult}.`;
    } else {
      bit = "0";
      binaryResult += "0";
      explanationText = `Comparing ${currentWorkingDecimal} with 2^${power} (${powerValue}). ${currentWorkingDecimal} < ${powerValue}. Write '0'. Remaining: ${workingDecimalCopy}. Binary: ${binaryResult}.`;
    }

    steps.push({
      type: "PROCESS_DECIMAL_POWER_STEP",
      allPowers: powerValues, // Added: Pass the full list of power values
      power: power, // power is the exponent
      powerValue: powerValue,
      workingDecimalBefore: currentWorkingDecimal,
      canSubtract: canSubtract,
      bit: bit,
      workingDecimalAfter: workingDecimalCopy,
      currentBinary: binaryResult,
      explanation: explanationText,
    });
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
      binary: binaryInput,
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

export async function generateBinaryToOctalSteps(binaryInput: string): Promise<{ steps: BinaryToOctalStep[], result: string }> {
  const steps: BinaryToOctalStep[] = [];
  if (!/^[01]+$/.test(binaryInput) || binaryInput.length === 0) {
    throw new Error("Input must be a non-empty binary string.");
  }

  steps.push({
    type: "INITIAL",
    binary: binaryInput,
    explanation: `Starting conversion of ${binaryInput} (binary) to octal (base 8).`
  });

  let paddedBinary = binaryInput;
  const remainder = binaryInput.length % 3;
  if (remainder !== 0) {
    paddedBinary = '0'.repeat(3 - remainder) + binaryInput;
  }

  const groups: string[] = [];
  for (let i = 0; i < paddedBinary.length; i += 3) {
    groups.push(paddedBinary.substring(i, i + 3));
  }
  
  const binaryWithPaddingForDisplay = groups.join(' ');

  steps.push({
    type: "SHOW_GROUPS",
    binaryWithPadding: binaryWithPaddingForDisplay,
    groups: groups,
    explanation: `Binary string is padded with leading zeros to be divisible by 3, then split into groups: ${binaryWithPaddingForDisplay}.`
  });

  let octalResult = "";
  const groupToOctalMap: { [key: string]: string } = {
    "000": "0", "001": "1", "010": "2", "011": "3",
    "100": "4", "101": "5", "110": "6", "111": "7"
  };

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const octalDigit = groupToOctalMap[group];
    steps.push({
      type: "PROCESS_GROUP",
      group: group,
      groupIndex: i,
      octalDigit: octalDigit,
      currentOctalResult: octalResult,
      binaryWithPadding: binaryWithPaddingForDisplay,
      allGroups: groups,
      explanation: `Group ${i + 1} (${group}) converts to octal digit ${octalDigit}. Current octal: ${octalResult}${octalDigit}`
    });
    octalResult += octalDigit;
  }

  steps.push({
    type: "FINAL_RESULT",
    octalResult: octalResult,
    originalBinary: binaryInput,
    explanation: `Conversion complete. ${binaryInput} (binary) is ${octalResult} (octal).`
  });

  return { steps, result: octalResult };
}

export async function generateBinaryToHexSteps(binaryInput: string): Promise<{ steps: BinaryToHexStep[], result: string }> {
  const steps: BinaryToHexStep[] = [];
  if (!/^[01]+$/.test(binaryInput) || binaryInput.length === 0) {
    throw new Error("Input must be a non-empty binary string.");
  }

  steps.push({
    type: "INITIAL",
    binary: binaryInput,
    explanation: `Starting conversion of ${binaryInput} (binary) to hexadecimal (base 16).`
  });

  let paddedBinary = binaryInput;
  const remainder = binaryInput.length % 4;
  if (remainder !== 0) {
    paddedBinary = '0'.repeat(4 - remainder) + binaryInput;
  }

  const groups: string[] = [];
  for (let i = 0; i < paddedBinary.length; i += 4) {
    groups.push(paddedBinary.substring(i, i + 4));
  }
  
  const binaryWithPaddingForDisplay = groups.join(' ');

  steps.push({
    type: "SHOW_GROUPS_HEX",
    binaryWithPadding: binaryWithPaddingForDisplay,
    groups: groups,
    explanation: `Binary string is padded with leading zeros to be divisible by 4, then split into groups: ${binaryWithPaddingForDisplay}.`
  });

  let hexResult = "";
  const groupToHexMap: { [key: string]: string } = {
    "0000": "0", "0001": "1", "0010": "2", "0011": "3",
    "0100": "4", "0101": "5", "0110": "6", "0111": "7",
    "1000": "8", "1001": "9", "1010": "A", "1011": "B",
    "1100": "C", "1101": "D", "1110": "E", "1111": "F"
  };

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const hexDigit = groupToHexMap[group];
    steps.push({
      type: "PROCESS_GROUP_HEX",
      group: group,
      groupIndex: i,
      hexDigit: hexDigit,
      currentHexResult: hexResult,
      binaryWithPadding: binaryWithPaddingForDisplay,
      allGroups: groups,
      explanation: `Group ${i + 1} (${group}) converts to hex digit ${hexDigit}. Current hex: ${hexResult}${hexDigit}`
    });
    hexResult += hexDigit;
  }

  steps.push({
    type: "FINAL_RESULT_HEX",
    hexResult: hexResult,
    originalBinary: binaryInput,
    explanation: `Conversion complete. ${binaryInput} (binary) is ${hexResult} (hexadecimal).`
  });

  return { steps, result: hexResult };
}

export async function generateHexToBinarySteps(hexInput: string): Promise<{ steps: HexToBinaryStep[], result: string }> {
  const steps: HexToBinaryStep[] = [];
  const upperHexInput = hexInput.toUpperCase();
  if (!/^[0-9A-F]+$/.test(upperHexInput) || upperHexInput.length === 0) {
    throw new Error("Input must be a non-empty hexadecimal string.");
  }

  steps.push({
    type: "INITIAL_HEX_TO_BIN",
    hexInput: upperHexInput,
    explanation: `Starting conversion of ${upperHexInput} (hexadecimal) to binary.`
  });

  let binaryResult = "";
  const hexDigits = upperHexInput.split('');

  const hexTo4BitBinaryMap: { [key: string]: string } = {
    "0": "0000", "1": "0001", "2": "0010", "3": "0011",
    "4": "0100", "5": "0101", "6": "0110", "7": "0111",
    "8": "1000", "9": "1001", "A": "1010", "B": "1011",
    "C": "1100", "D": "1101", "E": "1110", "F": "1111"
  };

  for (let i = 0; i < hexDigits.length; i++) {
    const digit = hexDigits[i];
    const binaryEquivalent = hexTo4BitBinaryMap[digit];
    steps.push({
      type: "PROCESS_HEX_DIGIT",
      hexDigit: digit,
      digitIndex: i,
      binaryEquivalent: binaryEquivalent,
      currentBinaryResult: binaryResult,
      allHexDigits: hexDigits, 
      explanation: `Hex digit '${digit}' (at index ${i}) converts to 4-bit binary '${binaryEquivalent}'. Binary so far: ${binaryResult}${binaryEquivalent}`
    });
    binaryResult += binaryEquivalent;
  }
  
  // Remove leading zeros unless the result is just "0"
  let finalBinaryResult = binaryResult;
  if (binaryResult.length > 1 && binaryResult.startsWith('0')) {
    finalBinaryResult = binaryResult.replace(/^0+/, '');
    if (finalBinaryResult === '') finalBinaryResult = '0'; // case where hex is "0"
  }
  if (upperHexInput === "0") finalBinaryResult = "0"; // ensure hex "0" results in binary "0"


  steps.push({
    type: "FINAL_RESULT_HEX_TO_BIN",
    binaryResult: finalBinaryResult,
    originalHex: upperHexInput,
    explanation: `Conversion complete. ${upperHexInput} (hexadecimal) is ${finalBinaryResult} (binary).`
  });

  return { steps, result: finalBinaryResult };
}

export async function generateOctalToBinarySteps(octalInput: string): Promise<{ steps: OctalToBinaryStep[], result: string }> {
  const steps: OctalToBinaryStep[] = [];
  if (!/^[0-7]+$/.test(octalInput) || octalInput.length === 0) {
    throw new Error("Input must be a non-empty octal string.");
  }

  steps.push({
    type: "INITIAL_OCT_TO_BIN",
    octalInput: octalInput,
    explanation: `Starting conversion of ${octalInput} (octal) to binary.`
  });

  let binaryResult = "";
  const octalDigits = octalInput.split('');

  const octalTo3BitBinaryMap: { [key: string]: string } = {
    "0": "000", "1": "001", "2": "010", "3": "011",
    "4": "100", "5": "101", "6": "110", "7": "111"
  };

  for (let i = 0; i < octalDigits.length; i++) {
    const digit = octalDigits[i];
    const binaryEquivalent = octalTo3BitBinaryMap[digit];
    steps.push({
      type: "PROCESS_OCT_DIGIT",
      octalDigit: digit,
      digitIndex: i,
      binaryEquivalent: binaryEquivalent,
      currentBinaryResult: binaryResult,
      allOctalDigits: octalDigits,
      explanation: `Octal digit '${digit}' (at index ${i}) converts to 3-bit binary '${binaryEquivalent}'. Binary so far: ${binaryResult}${binaryEquivalent}`
    });
    binaryResult += binaryEquivalent;
  }

  // Remove leading zeros unless the result is just "0"
  let finalBinaryResult = binaryResult;
  if (binaryResult.length > 1 && binaryResult.startsWith('0')) {
    finalBinaryResult = binaryResult.replace(/^0+/, '');
    if (finalBinaryResult === '') finalBinaryResult = '0';
  }
  if (octalInput === "0") finalBinaryResult = "0";

  steps.push({
    type: "FINAL_RESULT_OCT_TO_BIN",
    binaryResult: finalBinaryResult,
    originalOctal: octalInput,
    explanation: `Conversion complete. ${octalInput} (octal) is ${finalBinaryResult} (binary).`
  });

  return { steps, result: finalBinaryResult };
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
  if (fromBase === 2 && toBase === 8) {
    const { steps, result } = await generateBinaryToOctalSteps(value);
    return { result, steps: steps as AnimationStep[] };
  }
  if (fromBase === 2 && toBase === 16) {
    const { steps, result } = await generateBinaryToHexSteps(value);
    return { result, steps: steps as AnimationStep[] };
  }
  if (fromBase === 16 && toBase === 2) {
    const { steps, result } = await generateHexToBinarySteps(value);
    return { result, steps: steps as AnimationStep[] };
  }
  if (fromBase === 8 && toBase === 2) {
    const { steps, result } = await generateOctalToBinarySteps(value);
    return { result, steps: steps as AnimationStep[] };
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
