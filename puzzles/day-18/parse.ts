export const parseLines = (lines: string[]): number[][] => {
  return lines.map((line) => line.split(',').map((x)=>Number(x)));
};
