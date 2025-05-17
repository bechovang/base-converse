export type Base = 2 | 8 | 10 | 16;

export const BASE_OPTIONS: { label: string; value: Base }[] = [
  { label: "Nhị phân (2)", value: 2 },
  { label: "Bát phân (8)", value: 8 },
  { label: "Thập phân (10)", value: 10 },
  { label: "Thập lục phân (16)", value: 16 },
];

export const getBaseLabel = (value: Base): string => {
  const option = BASE_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : `Cơ số ${value}`;
};

export const isValidNumberForBase = (numberStr: string, base: Base): boolean => {
  if (!numberStr) return true; // Allow empty input

  let regex: RegExp;
  switch (base) {
    case 2:
      regex = /^[01]+$/;
      break;
    case 8:
      regex = /^[0-7]+$/;
      break;
    case 10:
      regex = /^[0-9]+$/;
      break;
    case 16:
      regex = /^[0-9a-fA-F]+$/;
      break;
    default:
      return false;
  }
  return regex.test(numberStr);
};
