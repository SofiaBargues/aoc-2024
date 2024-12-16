export const parseLines = (lines: string[]): string[][] => {
  return lines.map((line) => line.split(''));
};
