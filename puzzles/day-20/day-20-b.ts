import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

const dirs = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

function findCharPos(
  grid: (string | number)[][],
  char: string
): [number, number] {
  let n = grid.length;
  let m = grid[0].length;
  for (let x = 0; x <= n - 1; x++) {
    for (let y = 0; y <= m - 1; y++) {
      let val = grid[x][y];
      if (val === char) {
        return [x, y];
      }
    }
  }
  throw Error('No initial position');
}

function shortestPath(
  grid: (string | number)[][],
  start: number[],
  goal: number[]
) {
  let queue: number[][] = [[start[0], start[1], 0]]; //x,y,distancia
  let n = grid.length;
  let m = grid[0].length;
  let seen = new Set();
  seen.add(JSON.stringify(start));
  while (queue.length > 0) {
    let [x, y, dist] = queue.shift()!;

    // Crurent
    //     a. Write all cell times in grid
    grid[x][y] = dist;

    if (x === goal[0] && y === goal[1]) {
      return dist;
    }
    // RECURSION
    for (const [dx, dy] of dirs) {
      let [nx, ny] = [x + dx, y + dy];
      // si - esta en el grid
      if (nx >= 0 && nx < n && ny >= 0 && ny < m) {
        if (grid[nx][ny] === '.' && !seen.has(JSON.stringify([nx, ny]))) {
          //                     lo agrego a seens
          seen.add(JSON.stringify([nx, ny]));
          //lo agrego a la queue con +1 en dist
          queue.push([nx, ny, dist + 1]);
        }
      }
    }
  }
  return -1;
}

function foundCheatSavings(grid: ('#' | number)[][]) {
  let n = grid.length;
  let m = grid[0].length;
  let cheatSavings: Record<string, number> = {};
  for (let x = 1; x <= n - 2; x++) {
    for (let y = 1; y <= m - 2; y++) {
      if (grid[x][y] === '#') {
        continue;
      }
      // Go through 40x40 square around it
      for (let i = -20; i <= 20; i++) {
        for (let j = -20; j <= 20; j++) {
          const steps = Math.abs(i) + Math.abs(j);
          if (steps > 20) {
            continue;
          }
          const [nx, ny] = [x + i, y + j];
          if (nx < 0 || nx >= n || ny < 0 || ny >= m) {
            continue;
          }
          const start = grid[x][y];
          const end = grid[nx][ny];
          if (start === '#' || end === '#') {
            continue;
          }

          const savings = end - start - steps;
          if (savings > 0) {
            cheatSavings[JSON.stringify([start, end])] = savings;
          }
        }
      }
    }
  }
  return cheatSavings;
}
export async function day20b(dataPath?: string) {
  const data = await readLines(dataPath);
  const grid = parseLines(data);

  // 1. encontrar start
  const sPos = findCharPos(grid, 'S');
  const ePos = findCharPos(grid, 'E');
  grid[ePos[0]][ePos[1]] = '.';
  // 2. dfs/bfs encontrar tiempoBase
  const baseTime = shortestPath(grid, sPos, ePos);
  console.log(baseTime);
  console.log(
    grid
      .map((line) =>
        line.map((x) => (String(x).length == 1 ? ' ' + x : x)).join('')
      )
      .join('\n')
  );
  //     b. Replace S by 0 and E by baseTime
  // 3. encontrar todos los tiempos de cheats
  const cheatsTimes = foundCheatSavings(grid);
  // 4. cuantos cheats te ahorran al menos 100 picoseg
  const times = Object.values(cheatsTimes).filter((x) => x >= 50);

  const grouped = {};
  for (const time of times) {
    if (time in grouped) {
      grouped[time]++;
    } else {
      grouped[time] = 1;
    }
  }
  // console.log(grouped);

  return Object.values(cheatsTimes).filter((x) => x >= 100).length;
}

const answer = await day20b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

console.log(
  [32, 31, 29, 39, 25, 23, 20, 19, 12, 14, 12, 22, 4, 3].reduce(
    (a, b) => a + b,
    0
  )
);
