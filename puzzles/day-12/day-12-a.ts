import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';
let dirs = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
];
function isInGrid(grid: string[][], pos: number[]) {
  let n = grid.length;
  let m = grid[0].length;
  let [x, y] = pos;
  return x >= 0 && x <= n - 1 && y >= 0 && y <= m - 1;
}

function walk(
  region: Set<string>,
  initVal: string,
  grid: string[][],
  pos: number[]
) {
  // Base condition
  if (region.has(JSON.stringify(pos))) {
    return;
  }
  if (!isInGrid(grid, pos)) {
    return;
  }
  let val = grid[pos[0]][pos[1]];
  if (val !== initVal) {
    return;
  }
  region.add(JSON.stringify(pos));
  // Recursion
  for (const [dx, dy] of dirs) {
    let [x, y] = pos;
    let newPos = [x + dx, y + dy];
    walk(region, initVal, grid, newPos);
  }
}

function findRegion(initPos: number[], grid: string[][]): number[][] {
  let region: Set<string> = new Set();
  let initVal = grid[initPos[0]][initPos[1]];
  walk(region, initVal, grid, initPos);
  return [...region].map((x) => JSON.parse(x));
}

function findRegions(grid: string[][]): number[][][] {
  let regions: number[][][] = [];
  let seen = new Set();
  let n = grid.length;
  let m = grid[0].length;
  for (let x = 0; x <= n - 1; x++) {
    for (let y = 0; y <= m - 1; y++) {
      if (seen.has(JSON.stringify([x, y]))) {
        continue;
      }
      let region = findRegion([x, y], grid);
      region.forEach((x: number[]) => seen.add(JSON.stringify(x)));
      regions.push(region);
      // console.log(grid[x][y]);
    }
  }
  return regions;
}

export async function day12a(dataPath?: string) {
  const data = await readLines(dataPath);
  let garden = parseLines(data);
  // 1. encontrar las regiones
  let regions = findRegions(garden);
  // 2. area y perimetro de cada region
  //     area= cantida de pots
  let area = regions.map((r)=>r.length);
  //     perimetro= vecesque encuentrto un vecino chequeado desde cada pot
  // 3. para cada region total += area * perimetro
  console.log(area);
  return 0;
}

const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
