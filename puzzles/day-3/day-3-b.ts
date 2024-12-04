import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day3b(dataPath?: string) {
  const data = await readData(dataPath);
  let regexReplace = /don't\(\).*?do\(\)/gs;

  let sanitized = data.replace(regexReplace, '').replace(/don't\(\).*/s, '');

  const pairs = parseLines(sanitized.split('\n'));
  let numTotal = 0;
  for (const pair of pairs) {
    numTotal = Number(pair[0]) * Number(pair[1]) + numTotal;
  }

  return numTotal;
}

const answer = await day3b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
