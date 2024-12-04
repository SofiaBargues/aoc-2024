import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

const diag1 = [
  [1, 1],
  [-1, -1],
];
const diag2 = [
  [-1, 1],
  [1, -1],
];
function isDiagValid(initPos, diag, grid) {
  for (const dir of diag) {
    let posM = [dir[0] + initPos[0], dir[1] + initPos[1]];
    let posS = [dir[0] * -1 + initPos[0], dir[1] * -1 + initPos[1]];

    if (isValidPos(posM, 'M', grid)) {
      if (isValidPos(posS, 'S', grid)) {
        return true;
      }
    }
  }
  return false;
}

function wordSearch(initPos, grid) {
  return isDiagValid(initPos, diag1, grid) && isDiagValid(initPos, diag2, grid)
    ? 1
    : 0;
}

function isValidPos(pos, targetLetter, grid) {
  const [x, y] = pos;
  if (x >= 0 && x <= grid.length - 1 && y >= 0 && y <= grid[0].length - 1) {
    if (grid[x][y] === targetLetter) {
      return true;
    }
  }
  return false;
}
export async function day4b(dataPath?: string) {
  const data = await readLines(dataPath);
  const grid = parseLines(data);

  let acc = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] === 'A') {
        acc += wordSearch([x, y], grid);
      }
    }
  }

  return acc;
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
