export type Calibration = {
  numbers: number[];
  target: number;
};

export const parseLines = (input: string[]): Calibration[] => {
  input = input.filter((line) => !!line);
  return input.map((line) => {
    const [target, numbers] = line.split(':');
    return {
      target: parseInt(target, 10),
      numbers: numbers
        .trim()
        .split(/\s+/)
        .map((n) => parseInt(n, 10)),
    };
  });
};
