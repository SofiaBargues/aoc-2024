import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day4a(dataPath?: string) {
  const data = await readData(dataPath);
  const cards = parseLines(data);
  let totalResult = 0;

  for (const card of cards) {
    const [winning_numbers, your_numbers] = card;
    let winningMatchs = 0;
    for (const winning_number of winning_numbers) {
      if (your_numbers.includes(winning_number)) {
        winningMatchs++;
      }
    }
    const cardResult = winningMatchs ? Math.pow(2, winningMatchs - 1) : 0;
    totalResult += cardResult;
  }
  return totalResult;
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
