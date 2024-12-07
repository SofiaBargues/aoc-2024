import chalk from 'chalk';
import { readLines } from '../../shared.ts';

function isInMap(pos, grid: string[][]) {
  let [x, y] = pos;
  let n = grid.length;
  let m = grid[0].length;
  return x >= 0 && x <= n - 1 && y >= 0 && y <= m - 1;
}

function getValue(pos: number[], grid: string[][]) {
  let [x, y] = pos;
  return grid[x][y];
}

function shouldTurn(pos, dir, grid) {
  const nextPos = getNextPos(pos, dir);
  if (isInMap(nextPos, grid)) {
    if (['#', 'O'].includes(getValue(nextPos, grid))) {
      return true;
    }
  }
  return false;
}

function getNextPos(pos, dir) {
  let [x, y] = pos;
  if (dir === '^') {
    x = x - 1;
  } else if (dir === '>') {
    y = y + 1;
  } else if (dir === 'v') {
    x = x + 1;
  } else if (dir === '<') {
    y = y - 1;
  }
  return [x, y];
}

function getInitialPosition(grid) {
  let n = grid.length;
  let m = grid[0].length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (!(grid[i][j] === '.' || grid[i][j] === '#')) {
        return [i, j];
      }
    }
  }
}

let nextDir = {
  '^': '>',
  '>': 'v',
  v: '<',
  '<': '^',
};

function arePosEqual(pos1, pos2) {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}

function canPlaceObstacle(
  pos: number[],
  dir: string,
  originalGrid: string[][],
  obstaclePos: number[]
) {
  const grid = originalGrid.map((line) => line.slice());
  grid[obstaclePos[0]][obstaclePos[1]] = 'O';
  // Place obstacle
  // if (arePosEqual(pos, [6, 3])) {
  //   console.log(grid);
  // }

  while (isInMap(pos, grid)) {
    // Is loop
    if (getValue(pos, grid).includes(dir)) {
      // console.log(grid);
      return true;
    }
    // Save
    writeDir(pos, dir, grid);
    if (shouldTurn(pos, dir, grid)) {
      // Update
      dir = nextDir[dir];
    } else {
      // Update
      pos = getNextPos(pos, dir);
    }
  }
  return false;
}

function writeDir(pos, dir, grid: string[][]) {
  const curr = getValue(pos, grid);
  if (['.', '#'].includes(curr)) {
    grid[pos[0]][pos[1]] = dir;
  } else if (curr === dir) {
    console.log('Error, loop found');
  } else {
    grid[pos[0]][pos[1]] = curr + dir;
  }
}

export async function day6b(dataPath?: string) {
  const lines = await readLines(dataPath);
  const grid = lines.map((line) => line.split(''));

  let pos = getInitialPosition(grid);
  const initPos = [...pos];
  let dir = getValue(pos, grid);
  grid[initPos[0]][initPos[1]] = '.';

  const placed = new Set();

  while (isInMap(pos, grid)) {
    // Check potential loops
    const addedObstaclePos = getNextPos(pos, dir);
    if (
      !arePosEqual(addedObstaclePos, initPos) &&
      !placed.has(JSON.stringify(addedObstaclePos))
    ) {
      if (
        isInMap(addedObstaclePos, grid) &&
        getValue(addedObstaclePos, grid) !== '#'
      ) {
        if (canPlaceObstacle([...pos], dir, grid, addedObstaclePos)) {
          placed.add(JSON.stringify(addedObstaclePos));
        }
      }
    }
    // Traverse
    writeDir(pos, dir, grid);
    if (shouldTurn(pos, dir, grid)) {
      // Update
      dir = nextDir[dir];
    } else {
      // Update
      pos = getNextPos(pos, dir);
    }
  }
  // console.log(placed);

  return placed.size;
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
