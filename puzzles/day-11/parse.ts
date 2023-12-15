export type Position = {
  x: number;
  y: number;
};

export const parseLines = (lines: string[]): Position[] => {
  lines = lines.filter((line) => !!line);

  const galaxies: Position[] = [];
  lines.forEach((line, y) =>
    line.split('').forEach((char, x) => {
      char == '#' && galaxies.push({ x, y });
    })
  );
  return galaxies;
};
