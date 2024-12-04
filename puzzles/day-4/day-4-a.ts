import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

let dirs = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [1, 0],
  [-1, 1],
  [-1, -1],
  [-1, 0],
];
function wordSearch(initPos, grid) {
  let acc = 0;
  for (const dir of dirs) {
    let posM = [dir[0] + initPos[0], dir[1] + initPos[1]];

    let posA = [dir[0] * 2 + initPos[0], dir[1] * 2 + initPos[1]];

    let posS = [dir[0] * 3 + initPos[0], dir[1] * 3 + initPos[1]];

    if (isValidPos(posM, 'M', grid)) {
      if (isValidPos(posA, 'A', grid)) {
        if (isValidPos(posS, 'S', grid)) {
          acc++;
        }
      }
    }
  }
  return acc;
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
export async function day4a(dataPath?: string) {
  const data = await readLines(dataPath);
  const grid = parseLines(data);

  let acc = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] === 'X') {
        acc += wordSearch([x, y], grid);
      }
    }
  }

  return acc;
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
