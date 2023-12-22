// export enum CellType {
//   '.' = 0, // ASH
//   '#' = 1, // ROCK
// }

export type Conditions = string[];

export type Cell =
  | 0 // ASH
  | 1; //ROCK

export type Grid = Cell[][];

export const parseLines = (lines: string[]): Grid[] => {
  const rawGrids: Grid[] = [[]];

  let gridIdx: number = 0;
  lines.forEach((line) => {
    if (line != '') {
      rawGrids[gridIdx].push(lineToEnumVals(line));
    } else {
      rawGrids.push([]);
      gridIdx++;
    }
  });

  return rawGrids;
};
function lineToEnumVals(line: string): Cell[] {
  return line.split('').map((char) => {
    if (char == '#') {
      return 1;
    } else if (char == '.') {
      return 0;
    } else {
      throw Error('Unexpected value');
    }
  });
}
