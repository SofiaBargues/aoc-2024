import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import {
  Grid,
  PipeType,
  Position,
  findStartPosition,
  parseLines,
} from './parse.ts';

function getNeighbours(grid: Grid, pos: Position): Position[] {
  const { x, y } = pos;
  const pipe = getCellPipe(grid, pos);

  if (pipe == PipeType.Vertical) {
    return [
      { x, y: y + 1 },
      { x, y: y - 1 },
    ];
  } else if (pipe == PipeType.Horizontal) {
    return [
      { y, x: x + 1 },
      { y, x: x - 1 },
    ];
  } else if (pipe == PipeType.F) {
    return [
      { y: y + 1, x: x },
      { y, x: x + 1 },
    ];
  } else if (pipe == PipeType._7) {
    return [
      { x, y: y + 1 },
      { y, x: x - 1 },
    ];
  } else if (pipe == PipeType.L) {
    return [
      { y: y - 1, x },
      { y, x: x + 1 },
    ];
  } else if (pipe == PipeType.J) {
    return [
      { y, x: x - 1 },
      { y: y - 1, x },
    ];
  } else if (pipe == PipeType.Start) {
    return getStartNeighbours(grid, pos);
  }

  return [];
}

function getNextNeighbour(
  grid: Grid,
  pos: Position,
  previousPos: Position
): Position {
  const neighbours = getNeighbours(grid, pos);
  return arePosEqual(neighbours[0], previousPos)
    ? neighbours[1]
    : neighbours[0];
}

function arePosEqual(pos1: Position, pos2: Position) {
  return pos1.x == pos2.x && pos1.y == pos2.y;
}

export function getStartNeighbours(grid: Grid, startPos: Position): Position[] {
  const { x, y } = startPos;
  const allNeighbours = [
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x + 1, y },
    { x: x - 1, y },
  ];

  return allNeighbours.filter((neighbourPos) =>
    getNeighbours(grid, neighbourPos)
      .map((pos) => getCellPipe(grid, pos))
      .includes(PipeType.Start)
  );
}

export function getCellPipe(grid: Grid, pos: Position): PipeType | undefined {
  if (grid[pos.y]) {
    return grid[pos.y][pos.x];
  }
}

function getStartPipeType(grid: Grid, startPos: Position): PipeType {
  const neighbours = getStartNeighbours(grid, startPos);
  const up = neighbours.filter((pos) => pos.y == startPos.y - 1).length == 1;
  const down = neighbours.filter((pos) => pos.y == startPos.y + 1).length == 1;
  const left = neighbours.filter((pos) => pos.x == startPos.x - 1).length == 1;
  const right = neighbours.filter((pos) => pos.x == startPos.x + 1).length == 1;
  if (up && down) {
    return PipeType.Vertical;
  } else if (left && right) {
    return PipeType.Horizontal;
  } else if (left && up) {
    return PipeType.J;
  } else if (left && down) {
    return PipeType._7;
  } else if (right && up) {
    return PipeType.L;
  } else if (right && down) {
    return PipeType.F;
  } else {
    throw Error('Cant determine start value');
  }
}

export async function day10b(dataPath?: string) {
  const data = await readLines(dataPath);
  const grid = parseLines(data);
  const startPos = findStartPosition(grid);

  let prevPos = { ...startPos };
  let pos = getStartNeighbours(grid, startPos)[0];
  const loop = [pos];
  while (!arePosEqual(pos, startPos)) {
    const next = getNextNeighbour(grid, pos, prevPos);
    loop.push(next);
    prevPos = pos;
    pos = next;
  }

  // Replace Start pipe type
  grid[startPos.y][startPos.x] = getStartPipeType(grid, startPos);
  const rowInnerCellCounts = grid.map((row, y) => {
    return calculateRowInnerCells(row, loop, y);
  });
  console.log(rowInnerCellCounts);
  return rowInnerCellCounts.reduce(
    (acc, val) => acc + val.reduce((accRow, valRow) => accRow + valRow, 0),
    0
  );
}

function calculateRowInnerCells(
  row: PipeType[],
  loop: Position[],
  y: number
): number[] {
  let nestCellsCount = 0;
  let nestRow = [];
  let previousBend = null;
  let isInsideLoop = false;
  row.forEach((cell, x) => {
    const isLoopCell = isPosPartOfLoop(loop, { x, y });
    if (isLoopCell) {
      if (cell == PipeType.Vertical) {
        isInsideLoop = !isInsideLoop;
      }
      if ([PipeType.F, PipeType.L].includes(cell)) {
        previousBend = cell;
      }
      if (cell == PipeType._7) {
        if (previousBend == PipeType.L) {
          isInsideLoop = !isInsideLoop;
        }
        previousBend = null;
      }
      if (cell == PipeType.J) {
        if (previousBend == PipeType.F) {
          isInsideLoop = !isInsideLoop;
        }
        previousBend = null;
      }
      nestRow.push(0);
    } else if (isInsideLoop) {
      nestCellsCount++;
      nestRow.push(1);
    } else {
      nestRow.push(0);
    }
  });
  return nestRow;
}

function isPosPartOfLoop(loop: Position[], pos: Position) {
  return loop.filter((loopPos) => arePosEqual(loopPos, pos)).length == 1;
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
