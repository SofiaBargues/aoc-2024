export const parseLines = (lines: string[]): number[] => {
  lines = lines.filter((line) => !!line);
  let stones = lines[0].split(' ').map((x) => Number(x));

  return stones;
};
