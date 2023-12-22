import chalk from 'chalk';
import { readData } from '../../shared.ts';

function hash(string: string): number {
  return string.split('').reduce((acc, char) => {
    const ascii = char[0].charCodeAt(0);
    const multiplied = (acc + ascii) * 17;
    const rem = multiplied % 256;
    return rem;
  }, 0);
}

export async function day15a(dataPath?: string) {
  const data = await readData(dataPath);
  const codes = data[0].split(',');
  const codeValues = codes.map((code) => hash(code));
  return codeValues.reduce((acc, val) => acc + val, 0);
}

const answer = await day15a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
