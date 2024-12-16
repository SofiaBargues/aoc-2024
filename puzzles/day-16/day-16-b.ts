import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function getCostLayerEmpty(grid: string[][]) {
  let n = grid.length;
  let m = grid[0].length;
  return new Array(n).fill(0).map((_) => new Array(m).fill(null));
}

let oris = ['>', 'v', '<', '^'] as const;

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

const reverseOri = {
  '>': '<',
  '<': '>',
  '^': 'v',
  v: '^',
} as const;

type Orientation = '>' | 'v' | '<' | '^';
export async function day16b(dataPath?: string) {
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
    walk([x, y, newOri], cost + 1000);
    //   // 3. left and forward, cost + 1001
    newOri = leftTurn[ori];
    [dx, dy] = dirOfOri[newOri];
    walk([x, y, newOri], cost + 1000);
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

  console.log(chalk.bgGreen('minCost:'), chalk.green(minCost));

  // Now lets start from pE and find all the paths to pS. To do this, we can follow the costs array with the rules of the puzzle.
  // forward

  const positions = new Set<string>();

  function walkReverse(
    pose: [number, number, Orientation],
    expectedCost: number
  ) {
    //base Condition(check validez)
    let [x, y, ori] = pose;

    if (costs[ori][x][y] === null) {
      return;
    }
    if (costs[ori][x][y] !== expectedCost) {
      // console.log(chalk.red(`${x},${y} is not ${expectedCost}`));
      // console.log(`it's ${costs[ori][x][y]}`);
      // console.log(
      //   `cell values ${JSON.stringify({
      //     ori: oris.map((o) => `${o}: ${costs[o][x][y]}`).join(', '),
      //   })}`
      // );
      return;
    }
    //current(do something)
    positions.add(`${x},${y}`);
    if (grid[x][y] === 'S') {
      return;
    }
    //    // recurcion(walk neighbors)
    //     // 1. forward, cost+1
    let [dx, dy] = dirOfOri[ori];
    walkReverse([x - dx, y - dy, ori], expectedCost - 1);
    //     //2. right and forward, cost + 1001
    let newOri = rightTurn[ori];
    [dx, dy] = dirOfOri[newOri];
    walkReverse([x - dx, y - dy, newOri], expectedCost - 1001);
    //   // 3. left and forward, cost + 1001
    newOri = leftTurn[ori];
    [dx, dy] = dirOfOri[newOri];
    walkReverse([x - dx, y - dy, newOri], expectedCost - 1001);
  }
  for (let ori of ['>', '<', 'v', '^'] as const) {
    const endCost = costs[ori][pE[0]][pE[1]];
    if (endCost === minCost) {
      walkReverse([pE[0], pE[1], ori], endCost);
    }
  }

  printPath(
    grid,
    [...positions].map((p) => p.split(',').map(Number))
  );

  return positions.size;
}

function printPath(origGrid: string[][], path: number[][]) {
  const grid = origGrid.map((row) => row.slice());
  for (let [x, y] of path) {
    grid[x][y] = chalk.red('O');
  }
  console.log(grid.map((row) => row.join('')).join('\n'));
}

const answer = await day16b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
