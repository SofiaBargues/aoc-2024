import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { Calibration, parseLines } from './parse.ts';

const OPERATIONS = ['+', '*', '||'];

function operate(operation: string, left: number, right: number) {
  if (operation === '+') {
    return left + right;
  } else if (operation === '*') {
    return left * right;
  } else if (operation === '||') {
    return Number(String(left) + String(right));
  }
  throw new Error(`Invalid operation: ${operation}`);
}

function isValid(calibration: Calibration) {
  const { numbers: allNumbers, target } = calibration;
  const [first, ...numbers] = allNumbers;

  function dfs(index: number, current: number) {
    if (index === numbers.length) {
      return current === target;
    }
    const num = numbers[index];
    for (const operation of OPERATIONS) {
      if (dfs(index + 1, operate(operation, current, num))) {
        return true;
      }
    }
    return false;
  }

  return dfs(0, first);
}

export async function day7b(dataPath?: string) {
  const data = await readLines(dataPath);
  const calibrations = parseLines(data);
  let validTotal = 0;
  for (const calibration of calibrations) {
    if (isValid(calibration)) {
      validTotal += calibration.target;
    }
  }
  return validTotal;
}

const answer = await day7b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
