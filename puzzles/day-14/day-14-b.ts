import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

// let xLen = 101;
// let yLen = 103;
let xLen = 11;
let yLen = 7;

function move(t: number, p: number[], v: number[]): number[] {
  let [Px, Py] = p;
  let [Vx, Vy] = v;
  let Pfx = t * Vx + Px;
  let Pfy = t * Vy + Py;
  Pfx = Pfx % xLen;
  Pfy = Pfy % yLen;
  if (Pfx < 0) {
    Pfx += xLen;
  }
  if (Pfy < 0) {
    Pfy += yLen;
  }
  return [Pfx, Pfy];
}

function removeFromGrid(grid: number[][], pos: number[]) {
  const [x, y] = pos;
  grid[y][x] = grid[y][x] - 1;
}

function addToGrid(grid: number[][], pos: number[]) {
  const [x, y] = pos;
  grid[y][x] = grid[y][x] + 1;
}

export async function day14b(dataPath?: string) {
  const data = await readLines(dataPath);
  const robots = parseLines(data);

  // Input: Robots P,V
  const iterations: { num: number; grid: number[][] } = [];
  const grid: number[][] = new Array(yLen)
    .fill(0)
    .map((_) => new Array(xLen).fill(0));

  for (const robot of robots) {
    addToGrid(grid, robot.pos);
  }
  iterations.push({
    num: 0,
    grid: grid.map((line) => line.slice()),
  });

  for (let i = 1; i < 200; i++) {
    for (const robot of robots) {
      let newPos = move(1, robot.pos, robot.vel);
      removeFromGrid(grid, robot.pos);
      addToGrid(grid, newPos);
      robot.pos = newPos;
    }
    iterations.push({
      num: i,
      grid: grid.map((line) => line.slice()),
    });
  }

  Bun.write('puzzles/day-14/day-14-b.json', JSON.stringify(iterations));
  // Output: securityFactor
  return 0;
}

const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
