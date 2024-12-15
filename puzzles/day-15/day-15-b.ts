import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLinesB } from './parse.ts';

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

function moveDfs(
  grid: string[][],
  boxes: number[][],
  pos: number[],
  dir: number[],
  canBranchToSide: boolean,
  log?: boolean
): boolean {
  const val = grid[pos[0]][pos[1]];
  if (log) {
    console.log('checking', pos, val);
  }
  if (boxes.some((box) => box[0] === pos[0] && box[1] === pos[1])) {
    return true;
  }
  if (val === '.') {
    return true;
  }
  if (val === '#') {
    return false;
  }

  boxes.push([...pos]);

  let otherHalf = true;
  if (val === '[' && canBranchToSide && dir[1] == 0) {
    if (log) {
      console.log('branched right');
    }
    otherHalf = moveDfs(grid, boxes, [pos[0], pos[1] + 1], dir, false, log);
  }
  if (val === ']' && canBranchToSide && dir[1] == 0) {
    if (log) {
      console.log('branched left');
    }
    otherHalf = moveDfs(grid, boxes, [pos[0], pos[1] - 1], dir, false, log);
  }
  if (!otherHalf) {
    return false;
  }
  if (log) {
    console.log('forward');
  }
  return moveDfs(
    grid,
    boxes,
    [pos[0] + dir[0], pos[1] + dir[1]],
    dir,
    true,
    log
  );
}

function tryMove(
  grid: string[][],
  robot: number[],
  move: '<' | '>' | '^' | 'v',
  log?: boolean
) {
  let dir = dirsOfMove[move];
  const boxes: number[][] = [];
  if (log) {
    console.log('checking can move');
  }
  let canMove = moveDfs(grid, boxes, robot, dir, true, log);
  if (!canMove) {
    return robot;
  }
  const cellsToMove = boxes;

  doMove(grid, cellsToMove, dir);
  return [robot[0] + dir[0], robot[1] + dir[1]];
}

function doMove(grid: string[][], cellsToMove: number[][], dir: number[]) {
  while (cellsToMove.length) {
    const curr = cellsToMove.pop()!;
    const next = [curr[0] + dir[0], curr[1] + dir[1]];
    swap(next, curr, grid);
  }
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
      if (val === '[') {
        acc += 100 * x + y;
      }
    }
  }
  return acc;
}

function printGrid(grid: string[][]) {
  console.log(grid.map((line) => line.join('')).join('\n'));
}

function boxesBroken(grid: string[][]) {
  let n = grid.length;
  let m = grid[0].length;
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < m; y++) {
      if (grid[x][y] == '[') {
        if (grid[x][y + 1] !== ']') {
          return true;
        }
      }
      if (grid[x][y] == ']') {
        if (grid[x][y - 1] !== '[') {
          return true;
        }
      }
    }
  }
  return false;
}

export async function day15b(dataPath?: string) {
  const data = await readLines(dataPath);
  let { grid, moves } = parseLinesB(data);
  // printGrid(grid);

  let robot = getRobotInitialPos(grid);
  let count = 0;
  let hasLogged = false;
  for (const move of moves) {
    const logCondition = count >= 420 && count < 430; // boxesBroken(grid) && !hasLogged;
    robot = tryMove(grid, robot, move, logCondition);
    count++;
    if (logCondition) {
      hasLogged = true;
      console.log(count);
      console.log(move);
      console.log(robot);
      printGrid(grid);
    }
  }
  // console.log('final');
  // printGrid(grid);

  return getGpsResult(grid);
}

const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
