import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function isInGrid(pos, n, m) {
  let [x, y] = pos;
  return x >= 0 && x < n && y >= 0 && y < m;
}

function getAntinodes(a, b) {
  const [ax, ay] = a;
  const [bx, by] = b;

  const distx = ax - bx;
  const an1x = bx - distx;
  const an2x = ax + distx;

  const disty = ay - by;
  const an1y = by - disty;
  const an2y = ay + disty;

  const an1 = [an1x, an1y];
  const an2 = [an2x, an2y];

  return [an1, an2];
}
export async function day8a(dataPath?: string) {
  const data = await readLines(dataPath);
  const grid = parseLines(data);
  const anSet = new Set();
  //   0. grid
  const n = grid.length;
  const m = grid[0].length;
  const groups = {};
  // 1. for i in 0...n-1
  for (let x = 0; x < n; x++) {
    //    for j in 0...m-1
    for (let y = 0; y < m; y++) {
      const val = grid[x][y];
      if (val !== '.') {
        if (val in groups) groups[val].push([x, y]);
        else groups[val] = [[x, y]];
      }
    }
  }
  // 2. for group in Object(groups).values()
  for (const group of Object.values(groups)) {
    const g = group.length;
    //    for i in 0...g-1
    for (let i = 0; i < g; i++) {
      //            for j in i+1...g-1
      for (let j = i + 1; j < g; j++) {
        const b = group[j];
        const a = group[i];
        //               let[an1, an2] =getAntinodes(a,b)
        const [an1, an2] = getAntinodes(a, b);
        if (isInGrid(an1, n, m)) {
          anSet.add(JSON.stringify(an1));
        }
        if (isInGrid(an2, n, m)) {
          anSet.add(JSON.stringify(an2));
        }
      }
    }
  }

  // 4. anSet.size
  return anSet.size;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
