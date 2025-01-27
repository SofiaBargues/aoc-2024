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

function debugPoses(poses, grid) {
  const newGrid = grid.map((line) => line.slice());
  for (const pose of poses) {
    const [pos, dir] = pose;
    newGrid[pos[0]][pos[1]] = dir;
  }

  console.log(newGrid);
}

function getPathPoses(pos: number[], dir: string, grid: string[][]) {
  const poses = [];
  while (isInMap(pos, grid)) {
    poses.push([pos, dir]);
    // Save
    if (shouldTurn(pos, dir, grid)) {
      // Update
      dir = nextDir[dir];
    } else {
      // Update
      pos = getNextPos(pos, dir);
    }
  }
  // debugPoses(poses, grid);

  return poses;
}

function isLoop(pos: number[], dir: string, grid: string[][]) {
  const seen = new Set();

  while (isInMap(pos, grid)) {
    const plain = JSON.stringify([pos, dir]);
    if (seen.has(plain)) {
      return true;
    }
    seen.add(plain);
    // Save
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

export async function day6b(dataPath?: string) {
  const lines = await readLines(dataPath);
  const grid = lines.map((line) => line.split(''));

  let pos = getInitialPosition(grid);
  const initPos = [...pos];
  let initDir = getValue(pos, grid);

  const seen = new Set(
    getPathPoses(pos, initDir, grid).map((pose) => JSON.stringify(pose[0]))
  );
  const originalTray = [...seen].map((val) => JSON.parse(val));
  // debugPoses(
  //   originalTray.map((val) => [val, '*']),
  //   grid
  // );
  let placed = 0;
  for (const pos of originalTray) {
    if (arePosEqual(pos, initPos)) {
      continue;
    }
    grid[pos[0]][pos[1]] = '#';

    if (isLoop(initPos, initDir, grid)) {
      placed++;
    }
    grid[pos[0]][pos[1]] = '.';
  }
  return placed;
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
