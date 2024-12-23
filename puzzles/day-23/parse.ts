export const parseLines = (lines: string[]): [string, string][] => {
  return lines.map((line) => line.split('-') as [string, string]);
};
