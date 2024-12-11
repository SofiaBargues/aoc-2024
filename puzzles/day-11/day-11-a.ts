import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';
//Funcion transformadora de piedras
function changeStone(stone: numero): numero[] {
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

export async function day11a(dataPath?: string) {
  const grid = await readLines(dataPath);
  let line = parseLines(grid);
  let newLine = [];

  for (let i = 0; i <= 25 - 1; i++) {
    for (const stone of line) {
      let newStones = changeStone(stone);
      newLine.push(...newStones);
    }
    line = newLine;
    newLine = [];
  }
  return line.length;
}

const answer = await day11a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
