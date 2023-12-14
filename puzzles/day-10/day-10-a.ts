import chalk from 'chalk';
import { readData } from '../../shared.ts';
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
  } else if (pipe == PipeType.7) {
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

export async function day10a(dataPath?: string) {
  const data = await readData(dataPath);
  const grid = parseLines(data);
  const startPos = findStartPosition(grid);

  let prevPos = { ...startPos };
  let pos = getStartNeighbours(grid, startPos)[0];
  const trajectory = [pos];
  while (!arePosEqual(pos, startPos)) {
    const next = getNextNeighbour(grid, pos, prevPos);
    trajectory.push(next);
    prevPos = pos;
    pos = next;
  }

  return Math.floor(trajectory.length / 2);
}

const answer = await day10a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
