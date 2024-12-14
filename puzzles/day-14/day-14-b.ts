import fs from 'fs';
import sharp from 'sharp';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

let xLen = 101;
let yLen = 103;
// let xLen = 11;
// let yLen = 7;

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
  const grid: number[][] = new Array(yLen)
    .fill(0)
    .map((_) => new Array(xLen).fill(0));

  for (const robot of robots) {
    addToGrid(grid, robot.pos);
  }

  let maxScore = -1;
  let bestGrid: number[][] = [];
  let bestGridNum = -1;
  for (let i = 1; i < 100000; i++) {
    for (const robot of robots) {
      let newPos = move(1, robot.pos, robot.vel);
      removeFromGrid(grid, robot.pos);
      addToGrid(grid, newPos);
      robot.pos = newPos;
    }

    const score = countEightDirConnectedPoints(grid);
    if (score > maxScore) {
      maxScore = score;
      bestGrid = grid.map((line) => line.slice());
      bestGridNum = i;
    }
  }

  // create the folder if doesn't exist
  if (!fs.existsSync('puzzles/day-14/frames')) {
    fs.mkdirSync('puzzles/day-14/frames');
  }

  // Push the grid as an image
  const imageBuffer = Buffer.from(
    bestGrid.flatMap((row) => row.map((cell) => (cell > 0 ? 255 : 0)))
  );

  await sharp(imageBuffer, {
    raw: {
      width: xLen,
      height: yLen,
      channels: 1,
    },
  })
    .png()
    .toFile(`puzzles/day-14/frames/frame-${bestGridNum}.png`);

  return 0;
}

function countEightDirConnectedPoints(grid: number[][]) {
  let count = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] > 0) {
        if (
          grid[y - 1]?.[x - 1] > 0 ||
          grid[y - 1]?.[x] > 0 ||
          grid[y - 1]?.[x + 1] > 0 ||
          grid[y]?.[x - 1] > 0 ||
          grid[y]?.[x + 1] > 0 ||
          grid[y + 1]?.[x - 1] > 0 ||
          grid[y + 1]?.[x] > 0 ||
          grid[y + 1]?.[x + 1] > 0
        ) {
          count++;
        }
      }
    }
  }

  return count;
}

const answer = await day14b();
