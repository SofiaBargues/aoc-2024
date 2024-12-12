import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';
//Funcion transformadora de piedras

function changeStone(stone: number): number[] {
  if (stone == 0) {
    return [1];
  }
  if (String(stone).length % 2 === 0) {
    let half = String(stone).length / 2;
    let digits = String(stone).split('');
    let pebble1 = Number(digits.slice(0, half).join(''));
    let pebble2 = Number(digits.slice(half).join(''));
    return [pebble1, pebble2];
  } else {
    return [stone * 2024];
  }
}

export async function day11b(dataPath?: string) {
  const grid = await readLines(dataPath);
  let line = parseLines(grid);
  let total = 0;

  // Cache for memoization using string key "stone-depth"
  const memo = new Map<string, number>();

  function processStack(stone: number, depth: number): number {
    const key = `${stone}-${depth}`;
    if (memo.has(key)) return memo.get(key)!;

    if (depth === 75) return 1;

    const paths = changeStone(stone).reduce(
      (sum, newStone) => sum + processStack(newStone, depth + 1),
      0
    );

    memo.set(key, paths);
    return paths;
  }

  total = line.reduce((sum, stone) => sum + processStack(stone, 0), 0);

  return total;
}

const start = performance.now();
const answer = await day11b();
const end = performance.now();
const executionTime = (end - start) / 1000; // Convert to seconds

console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
console.log(
  chalk.bgBlue('Execution Time:'),
  chalk.blue(`${executionTime.toFixed(2)}s`)
);
