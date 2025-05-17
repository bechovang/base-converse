export type DecimalToBinaryStep =
  | {
      type: "INITIAL";
      decimal: number;
      powers: number[];
      workingDecimal: number;
      currentBinary: string;
      explanation: string;
    }
  | {
      type: "COMPARE";
      power: number;
      powerValue: number;
      workingDecimal: number;
      canSubtract: boolean;
      currentBinary: string;
      explanation: string;
    }
  | {
      type: "RESULT_BIT";
      bit: "0" | "1";
      power: number;
      powerValue: number;
      workingDecimalAfterSubtract: number;
      currentBinary: string;
      explanation: string;
    }
  | {
      type: "FINAL_RESULT";
      binaryResult: string;
      originalDecimal: number;
      explanation: string;
    };

export type BinaryToDecimalStep =
  | {
      type: "INITIAL";
      binary: string;
      explanation: string;
    }
  | {
      type: "CALCULATE_BIT_VALUE";
      bit: string;
      power: number;
      value: number;
      currentIndex: number;
      currentSum: number;
      explanation: string;
    }
  | {
      type: "ADD_TO_SUM";
      bitValue: number;
      currentSum: number;
      newSum: number;
      currentIndex: number;
      explanation: string;
    }
  | {
      type: "FINAL_RESULT";
      decimalResult: number;
      originalBinary: string;
      explanation: string;
    };
    
// Add other step types as needed e.g. BinaryToHexStep, HexToBinaryStep etc.

export type AnimationStep = DecimalToBinaryStep | BinaryToDecimalStep; // Union of all step types
