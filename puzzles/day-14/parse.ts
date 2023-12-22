export type Conditions = string[];

export type Cell = 'O' | '#' | '.';

export type Grid = Cell[][];

export const parseLines = (lines: string[]): Grid => {
  return lines.map((line) => lineToCells(line));
};
function lineToCells(line: string): Cell[] {
  return line.split('') as Cell[];
}
