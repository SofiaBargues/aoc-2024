import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function getHeights(grid: string[][]) {
  let heights: number[] = [];
  let xLength = 6;
  let yLength = 4;
  // por cada y
  for (let y = 0; y <= yLength; y++) {
    let accHash = 0;
    //     por cada x
    for (let x = 0; x <= xLength; x++) {
      if (grid[x][y] === '#') {
        accHash++;
      }
    }
    heights.push(accHash);
  }
  return heights;
}

function areOverlaped(key: number[], lock: number[]) {
  for (let i = 0; i <= lock.length - 1; i++) {
    if (key[i] + lock[i] > 7) {
      return true;
    }
  }
  return false;
}

export async function day25a(dataPath?: string) {
  const data = await readLines(dataPath);
  const grids = parseLines(data);
  let keys = [];
  let locks = [];

  //   1.transformo llaves y candados en un arr de nums
  for (const grid of grids) {
    let isKey = grid[0][0] === '.';
    if (isKey) {
      keys.push(getHeights(grid));
    } else {
      locks.push(getHeights(grid));
    }
  }
  let acc = 0;

  console.log(locks);
  console.log(keys);
  // 2.por cada llave
  for (const key of keys) {
    //     por cada candado
    for (const lock of locks) {
      if (!areOverlaped(key, lock)) {
        //         si hay fit acc++
        acc++;
      }
    }
  }

  return acc;
}

const answer = await day25a();

console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
