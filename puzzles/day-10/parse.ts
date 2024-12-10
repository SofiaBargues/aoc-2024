export const parseLines = (lines: string[]) => {
  lines = lines.filter((line) => !!line);

  return lines.map((line) => line.split('').map(Number));
};
