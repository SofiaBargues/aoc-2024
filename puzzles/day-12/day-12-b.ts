import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';
let dirs = [
  [-1, 0, 'U'],
  [1, 0, 'D'],
  [0, 1, 'R'],
  [0, -1, 'L'],
] as const;
function isInGrid(grid: string[][], pos: number[]) {
  let n = grid.length;
  let m = grid[0].length;
  let [x, y] = pos;
  return x >= 0 && x <= n - 1 && y >= 0 && y <= m - 1;
}

type Orientation = 'U' | 'R' | 'D' | 'L';
type Pose = {
  pos: number[];
  ori: Orientation;
};

function walk(
  region: Set<string>,
  initVal: string,
  grid: string[][],
  pos: number[],
  ori: Orientation
): Pose[] {
  // Base condition
  if (region.has(JSON.stringify(pos))) {
    return [];
  }
  if (!isInGrid(grid, pos)) {
    return [
      {
        pos,
        ori,
      },
    ];
  }
  let val = grid[pos[0]][pos[1]];
  if (val !== initVal) {
    return [
      {
        pos,
        ori,
      },
    ];
  }
  region.add(JSON.stringify(pos));
  // Recursion
  let acc: Pose[] = [];
  for (const [dx, dy, ori] of dirs) {
    let [x, y] = pos;
    let newPos = [x + dx, y + dy];
    acc = acc.concat(walk(region, initVal, grid, newPos, ori));
  }
  return acc;
}

type Region = {
  fences: number;
  positions: number[][];
};

function findRegion(initPos: number[], grid: string[][]): Region {
  let region: Set<string> = new Set();
  let initVal = grid[initPos[0]][initPos[1]];
  let fences = walk(region, initVal, grid, initPos, 'U');
  // Sort and reduce
  // by same x
  fences.sort((a, b) => {
    const [ax, ay] = a.pos;
    const [bx, by] = b.pos;
    if (a.ori !== b.ori) {
      return a.ori < b.ori ? -1 : 1;
    }
    if (ax !== bx) {
      return ax < bx ? -1 : 1;
    }
    if (ay !== by) {
      return ay < by ? -1 : 1;
    }
    return 0;
  });
  fences = fences.filter((val, i) => {
    const prev = fences[i - 1];
    if (!prev || prev.ori !== val.ori) {
      return true;
    }
    // Alignment
    if (prev.pos[0] !== val.pos[0]) {
      return true;
    }
    return Math.abs(prev.pos[1] - val.pos[1]) !== 1;
  });

  fences.sort((a, b) => {
    const [ax, ay] = a.pos;
    const [bx, by] = b.pos;
    if (a.ori !== b.ori) {
      return a.ori < b.ori ? -1 : 1;
    }
    if (ay !== by) {
      return ay < by ? -1 : 1;
    }
    if (ax !== bx) {
      return ax < bx ? -1 : 1;
    }
    return 0;
  });
  fences = fences.filter((val, i) => {
    const prev = fences[i - 1];
    if (!prev || prev.ori !== val.ori) {
      return true;
    }
    // Alignment
    if (prev.pos[1] !== val.pos[1]) {
      return true;
    }
    return Math.abs(prev.pos[0] - val.pos[0]) !== 1;
  });

  const billableFences = fences.length;
  const positions = [...region].map((x) => JSON.parse(x));
  return { fences: billableFences, positions };
}

function findRegions(grid: string[][]): Region[] {
  let regions: Region[] = [];
  let seen = new Set();
  let n = grid.length;
  let m = grid[0].length;
  for (let x = 0; x <= n - 1; x++) {
    for (let y = 0; y <= m - 1; y++) {
      if (seen.has(JSON.stringify([x, y]))) {
        continue;
      }
      let region = findRegion([x, y], grid);

      region.positions.forEach((x: number[]) => seen.add(JSON.stringify(x)));
      regions.push(region);
    }
  }
  return regions;
}

export async function day12b(dataPath?: string) {
  const data = await readLines(dataPath);
  let garden = parseLines(data);
  let regions = findRegions(garden);
  let acc = 0;
  for (const region of regions) {
    acc += region.positions.length * region.fences;
  }
  return acc;
}

const answer = await day12b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
