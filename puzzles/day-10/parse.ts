export enum PipeType {
  Vertical = '|',
  Horizontal = '-',
  F = 'F',
  _7 = '7',
  L = 'L',
  J = 'J',
  Ground = '.',
  Start = 'S',
}

export type Position = {
  x: number;
  y: number;
};

export type Grid = PipeType[][];

export const parseLines = (lines: string[]): Grid => {
  lines = lines.filter((line) => !!line);

  return lines.map((line) =>
    line.split('').map((pipeLetter) => {
      const pipeTypeValue = Object.values(PipeType).find(
        (value) => value === pipeLetter
      ) as PipeType | undefined;

      if (pipeTypeValue) {
        return pipeTypeValue;
      } else {
        throw Error('Wrong input letter');
      }
    })
  );
};

export function findStartPosition(grid: Grid): Position {
  const y = grid.findIndex((row) => row.includes(PipeType.Start));
  const x = grid[y].findIndex((cell) => cell == PipeType.Start);
  return {
    x,
    y,
  };
}
