import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day8a(dataPath?: string) {
  const data = await readLines(dataPath);
  const directions = data[0];
  const desertMap = parseLines(data.slice(2));
  console.log({ desertMap, directions });
  let step = 0;
  let currentCord = 'AAA';
  while (currentCord != 'ZZZ') {
    const direction = directions[step % directions.length];
    currentCord = desertMap[currentCord][direction];
    step++;
    console.log({ currentCord, step });
  }

  return step;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
