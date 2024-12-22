import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function mix(secret: number, num: number) {
  return ((secret >>> 0) ^ (num >>> 0)) >>> 0;
}

function prune(secret: number) {
  return secret % 16777216;
}

// Pseudo random sequence
function applySequence(secret: number) {
  secret = prune(mix(secret, secret << 6));
  secret = prune(mix(secret, secret >> 5));
  secret = prune(mix(secret, secret << 11));
  return secret;
}

export async function day22a(dataPath?: string) {
  const data = await readLines(dataPath);
  const secrets = parseLines(data);
  let acc = 0;
  for (const secret of secrets) {
    let newSecret = secret;
    for (let i = 0; i < 2000; i++) {
      newSecret = applySequence(newSecret);
    }
    acc += newSecret;
  }
  return acc;
}

const answer = await day22a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
