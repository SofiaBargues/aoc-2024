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

function buildGrid(n: number, m: number) {
  let grid = new Array(m).fill(0).map((_) => new Array(n).fill('.'));

  return grid;
}

export async function day18b(dataPath?: string) {
  let goal = [70, 70];
  // let goal = [6, 6];
  const data = await readLines(dataPath);
  const obstacles = parseLines(data);
  let start = [0, 0];
  let n = goal[0] + 1;
  let m = goal[1] + 1;

  let grid = buildGrid(n, m);
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    const [x, y] = obstacle;
    grid[y][x] = '#';

    let dist = shortestPath(grid, start, goal);
    if (dist === -1) {
      return obstacle.join(',');
    }
  }

  return -1;
}

const answer = await day18b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
