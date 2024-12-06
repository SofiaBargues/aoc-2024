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
    if (getValue(nextPos, grid) === '#') {
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

export async function day6a(dataPath?: string) {
  const lines = await readLines(dataPath);
  const grid = lines.map((line) => line.split(''));

  let pos = getInitialPosition(grid);
  let dir = getValue(pos, grid);

  while (isInMap(pos, grid)) {
    if (shouldTurn(pos, dir, grid)) {
      dir = nextDir[dir];
    }
    grid[pos[0]][pos[1]] = 'x';
    pos = getNextPos(pos, dir);
  }

  let acc = 0;
  for (const row of grid) {
    for (const char of row) {
      if (char === 'x') {
        acc++;
      }
    }
  }

  return acc;
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
