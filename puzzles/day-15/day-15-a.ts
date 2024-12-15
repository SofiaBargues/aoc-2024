import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function getRobotInitialPos(grid: string[][]): number[] {
  let n = grid.length;
  let m = grid[0].length;
  for (let x = 0; x <= n - 1; x++) {
    for (let y = 0; y <= m - 1; y++) {
      let val = grid[x][y];
      if (val === '@') {
        return [x, y];
      }
    }
  }
}

// ion getNextDotDistance(grid, pos, dir)
function getNextDotDistance(
  grid: string[][],
  pos: number[],
  dir: number[]
): number {
  let [xd, yd] = dir;
  let [xp, yp] = pos;
  let next = [xd + xp, yp + yd];
  let acc = 1;
  while (grid[next[0]][next[1]] === 'O') {
    let [xn, yn] = next;
    next = [xn + xd, yn + yd];
    acc++;
  }
  if (grid[next[0]][next[1]] === '#') {
    return -1;
  }
  if (grid[next[0]][next[1]] === '.') {
    return acc;
  }
  return -1;
}

let dirsOfMove = {
  '<': [0, -1],
  '>': [0, 1],
  '^': [-1, 0],
  v: [1, 0],
};
function tryMove(
  grid: string[][],
  robot: number[],
  move: '<' | '>' | '^' | 'v'
) {
  let dir = dirsOfMove[move];
  let dotDist = getNextDotDistance(grid, robot, dir);
  if (dotDist === -1) {
    return robot;
  }

  return doMove(grid, robot, dir, dotDist);
}

function doMove(
  grid: string[][],
  robotPos: number[],
  dir: number[],
  dotDistance: number
) {
  let [xr, yr] = robotPos;
  let [xd, yd] = dir;
  // let dotPos = robotPos + dotDistance * dir;
  let dotPos = [xr + dotDistance * xd, yr + dotDistance * yd];

  let robotNextPos = [xr + xd, yr + yd];
  swap(dotPos, robotNextPos, grid);
  swap(robotPos, robotNextPos, grid);
  return robotNextPos;
}

function swap(pos1: number[], pos2: number[], grid: string[][]) {
  let [x1, y1] = pos1;
  let [x2, y2] = pos2;
  let guardar = grid[x1][y1];
  grid[x1][y1] = grid[x2][y2];
  grid[x2][y2] = guardar;
}

function getGpsResult(grid: string[][]) {
  let acc = 0;
  let n = grid.length;
  let m = grid[0].length;
  // for x in 0...n-1
  for (let x = 0; x <= n - 1; x++) {
    // for y in 0...m-1
    for (let y = 0; y <= m - 1; y++) {
      //     val = grid[x][y]
      let val = grid[x][y];
      //     if val === 'O'
      if (val === 'O') {
        acc += 100 * x + y;
      }
    }
  }
  return acc;
}
export async function day15a(dataPath?: string) {
  const data = await readLines(dataPath);
  const { grid, moves } = parseLines(data);

  let robot = getRobotInitialPos(grid);
  for (const move of moves) {
    robot = tryMove(grid, robot, move);
  }

  return getGpsResult(grid);
}

const answer = await day15a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
