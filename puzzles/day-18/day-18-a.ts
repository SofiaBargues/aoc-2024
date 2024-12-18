import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

let dirs = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

function shortestPath(grid: string[][], start: number[], goal: number[]) {
  let queue: number[][] = [[start[0], start[1], 0]]; //x,y,distancia
  let n = grid.length;
  let m = grid[0].length;
  let seen = new Set();
  seen.add(JSON.stringify(start));
  while (queue.length > 0) {
    let [x, y, dist] = queue.shift()!;
    if (x === goal[0] && y === goal[1]) {
      return dist;
    }
    //         //RECURSION
    for (const [dx, dy] of dirs) {
      let [nx, ny] = [x + dx, y + dy];
      //             si - esta en el grid
      if (nx >= 0 && nx < n && ny >= 0 && ny < m) {
        if (grid[nx][ny] === '.' && !seen.has(JSON.stringify([nx, ny]))) {
          //                     lo agrego a seens
          seen.add(JSON.stringify([nx, ny]));
          //                     lo agrego a la queue con +1 en dist
          queue.push([nx, ny, dist + 1]);
        }
      }
    }
  }
  return -1;
}

function buildGrid(n: number, m: number, obstacles: number[][], bytes: number) {
  let grid = new Array(m).fill(0).map((_) => new Array(n).fill('.'));
  let pladedObst = obstacles.slice(0, bytes);
  for (const [x, y] of pladedObst) {
    grid[y][x] = '#';
  }
  console.log(grid.map((x) => x.join('')).join('\n'));
  return grid;
}

export async function day18a(dataPath?: string) {
  let bytes = 1024;
  let goal = [70, 70];
  const data = await readLines(dataPath);
  const obstacles = parseLines(data);
  console.log(obstacles);
  let start = [0, 0];
  let n = goal[0] + 1;
  let m = goal[1] + 1;
  let grid = buildGrid(n, m, obstacles, bytes);
  let dist = shortestPath(grid, start, goal);

  return dist;
}

const answer = await day18a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
