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
      binary: string;
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

export type BinaryToOctalStep =
  | {
      type: "INITIAL";
      binary: string;
      explanation: string;
    }
  | {
      type: "SHOW_GROUPS";
      binaryWithPadding: string; // e.g., "011 000 001"
      groups: string[]; // e.g., ["011", "000", "001"]
      explanation: string;
    }
  | {
      type: "PROCESS_GROUP";
      group: string; // e.g., "011"
      groupIndex: number;
      octalDigit: string; // e.g., "3"
      currentOctalResult: string;
      binaryWithPadding: string; // Added: full string like "011 000 001"
      allGroups: string[]; // Added: array like ["011", "000", "001"]
      explanation: string;
    }
  | {
      type: "FINAL_RESULT";
      octalResult: string;
      originalBinary: string;
      explanation: string;
    };

export type BinaryToHexStep =
  | {
      type: "INITIAL";
      binary: string;
      explanation: string;
    }
  | {
      type: "SHOW_GROUPS_HEX"; // Renamed to avoid conflict if types become too similar
      binaryWithPadding: string;
      groups: string[]; // Groups of 4 bits
      explanation: string;
    }
  | {
      type: "PROCESS_GROUP_HEX";
      group: string; // 4-bit group
      groupIndex: number;
      hexDigit: string; // 0-9, A-F
      currentHexResult: string;
      binaryWithPadding: string;
      allGroups: string[];
      explanation: string;
    }
  | {
      type: "FINAL_RESULT_HEX";
      hexResult: string;
      originalBinary: string;
      explanation: string;
    };

export type HexToBinaryStep =
  | {
      type: "INITIAL_HEX_TO_BIN"; // To distinguish from other INITIAL types
      hexInput: string;
      explanation: string;
    }
  | {
      type: "PROCESS_HEX_DIGIT";
      hexDigit: string;
      digitIndex: number;
      binaryEquivalent: string; // 4-bit binary string
      currentBinaryResult: string;
      allHexDigits: string[]; // For display context
      explanation: string;
    }
  | {
      type: "FINAL_RESULT_HEX_TO_BIN";
      binaryResult: string;
      originalHex: string;
      explanation: string;
    };

export type OctalToBinaryStep =
  | {
      type: "INITIAL_OCT_TO_BIN";
      octalInput: string;
      explanation: string;
    }
  | {
      type: "PROCESS_OCT_DIGIT";
      octalDigit: string;
      digitIndex: number;
      binaryEquivalent: string; // 3-bit binary string
      currentBinaryResult: string;
      allOctalDigits: string[];
      explanation: string;
    }
  | {
      type: "FINAL_RESULT_OCT_TO_BIN";
      binaryResult: string;
      originalOctal: string;
      explanation: string;
    };

// Add other step types as needed e.g. BinaryToHexStep, HexToBinaryStep etc.

export type AnimationStep = 
  DecimalToBinaryStep | 
  BinaryToDecimalStep | 
  BinaryToOctalStep | 
  BinaryToHexStep | 
  HexToBinaryStep | 
  OctalToBinaryStep; // Union of all step types
