export type ReadingSequence = number[];

export const parseLines = (lines: string[]): ReadingSequence[] => {
  lines = lines.filter((line) => !!line);

  return lines.map((line) =>
    line.split(' ').map((numStr) => parseInt(numStr, 10))
  );
};
