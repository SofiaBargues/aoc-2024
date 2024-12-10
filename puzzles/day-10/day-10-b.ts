import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function findTrailHeads(grid: number[][]): number[][] {
  let heads = [];
  let n = grid.length;
  let m = grid[0].length;
  //   for i 0...n-1
  for (let i = 0; i <= n - 1; i++) {
    for (let j = 0; j <= m - 1; j++) {
      if (grid[i][j] === 0) heads.push([i, j]);
    }
  }
  return heads;
}

function isInGrid(pos: number[], grid: number[][]) {
  let n = grid.length;
  let m = grid[0].length;

  let [x, y] = pos;
  return x >= 0 && x < n && y >= 0 && y < m;
}

function getGoodTrailCount(grid, initPos): number {
  let dirs = [
    [0, +1],
    [+1, 0],
    [-1, 0],
    [0, -1],
  ];
  let founds = 0;
  function walkTrails(pos, prev: number) {
    //     // base condition
    if (!isInGrid(pos, grid)) {
      return;
    }

    let val = grid[pos[0]][pos[1]];
    if (val != prev + 1) {
      return;
    }

    if (val === 9) {
      founds++;
      return;
    }
    //     // recurse
    for (const dir of dirs) {
      const newPos = [pos[0] + dir[0], pos[1] + dir[1]];
      walkTrails(newPos, val);
    }
  }
  walkTrails(initPos, -1);
  return founds;
}

export async function day10b(dataPath?: string) {
  const data = await readLines(dataPath);
  const grid = parseLines(data);

  // encuentro los trailhead
  let headLocations = findTrailHeads(grid);
  // para cada trailHead
  let acc = 0;
  for (const headLocation of headLocations) {
    //     cuantos 9 distintos alcanza
    //     acc los 9 alcanzados
    acc += getGoodTrailCount(grid, headLocation);
  }
  // retorno el total

  return acc;
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
