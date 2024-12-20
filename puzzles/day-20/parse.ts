export const parseLines = (lines: string[]): (string | number)[][] => {
  return lines.map((line) => line.split(''));
};
