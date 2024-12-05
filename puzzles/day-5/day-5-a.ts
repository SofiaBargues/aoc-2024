import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export function getMiddleNumber(manual) {
  return manual[Math.floor(manual.length / 2)];
}
export function isManualValid(manual, toTheRightOf) {
  let seen = [];
  for (const page of manual) {
    if (toTheRightOf[page]) {
      for (const rule of toTheRightOf[page]) {
        if (seen.includes(rule)) {
          return false;
        }
      }
    }
    seen.push(page);
  }
  return true;
}

export function buildRules(relations) {
  let obj = {};
  for (const relation of relations) {
    const [left, right] = relation;
    if (left in obj) {
      obj[left].push(right);
    } else {
      obj[left] = [right];
    }
  }
  return obj;
}

export async function day5a(dataPath?: string) {
  const data = await readLines(dataPath);
  const { relations, manuals } = parseLines(data);

  let acc = 0;

  const toTheRightOf = buildRules(relations);

  for (const manual of manuals) {
    if (isManualValid(manual, toTheRightOf)) {
      acc = acc + getMiddleNumber(manual);
    }
  }

  return acc;
}

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
