import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function getCostLayerEmpty(grid: string[][]) {
  let n = grid.length;
  let m = grid[0].length;
  return new Array(n).fill(0).map((_) => new Array(m).fill(null));
}
let dirOfOri = {
  '>': [0, 1],
  '<': [0, -1],
  '^': [-1, 0],
  v: [1, 0],
};

let rightTurn = {
  '>': 'v',
  v: '<',
  '<': '^',
  '^': '>',
} as const;

let leftTurn = {
  '>': '^',
  '^': '<',
  '<': 'v',
  v: '>',
} as const;

type Orientation = '>' | 'v' | '<' | '^';
export async function day16a(dataPath?: string) {
  const data = await readLines(dataPath);
  let grid = parseLines(data);
  const costs: Record<Orientation, number[][]> = {
    '>': getCostLayerEmpty(grid),
    v: getCostLayerEmpty(grid),
    '<': getCostLayerEmpty(grid),
    '^': getCostLayerEmpty(grid),
  };

  let n = grid.length;
  let m = grid[0].length;

  let startPose: [number, number, Orientation] = [n - 2, 1, '>'];

  function walk(pose: [number, number, Orientation], cost: number) {
    //base Condition(check validez)
    let [x, y, ori] = pose;
    if (grid[x][y] === '#') {
      return;
    }

    if (costs[ori][x][y] && cost >= costs[ori][x][y]) {
      return;
    }
    //current(do something)
    costs[ori][x][y] = cost;
    if (grid[x][y] === 'E') {
      return;
    }
    //    // recurcion(walk neighbors)
    //     // 1. forward, cost+1
    let [dx, dy] = dirOfOri[ori];
    walk([dx + x, y + dy, ori], cost + 1);
    //     //2. right and forward, cost + 1001
    let newOri = rightTurn[ori];
    [dx, dy] = dirOfOri[newOri];
    walk([dx + x, y + dy, newOri], cost + 1001);
    //   // 3. left and forward, cost + 1001
    newOri = leftTurn[ori];
    [dx, dy] = dirOfOri[newOri];
    walk([dx + x, y + dy, newOri], cost + 1001);
  }

  walk(startPose, 0);

  let pE = [1, m - 2];
  let minCost = Math.min(
    ...[
      costs['>'][pE[0]][pE[1]],
      costs['<'][pE[0]][pE[1]],
      costs['v'][pE[0]][pE[1]],
      costs['^'][pE[0]][pE[1]],
    ].filter((cost) => cost !== null)
  );

  return minCost;
}

const answer = await day16a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
