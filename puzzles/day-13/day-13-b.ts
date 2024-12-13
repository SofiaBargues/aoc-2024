import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { Machine, parseLines } from './parse.ts';
function correctPrecision(value) {
  const epsilon = 1e-3; // Define the acceptable margin of error

  // Check if the value is very close to an integer
  if (Math.abs(value - Math.round(value)) < epsilon) {
    return Math.round(value); // Adjust to the nearest integer
  }

  // Otherwise, return the original value
  return value;
}

function solveEquations(machine: Machine) {
  let [ax, ay] = machine[0];
  let [bx, by] = machine[1];
  let [px, py] = machine[2];
  [px, py] = [px + 10000000000000, py + 10000000000000];

  let Bt = (py - (px * ay) / ax) / ((-bx * ay) / ax + by);
  let At = (px - Bt * bx) / ax;
  [At, Bt] = [correctPrecision(At), correctPrecision(Bt)];

  if (At < 0 || Bt < 0) {
    console.log('negative', At, Bt);
    return 0;
  }
  // if (At > 100 || Bt > 100) {
  //   console.log('morethan100times', At, Bt);
  //   return 0;
  // }
  if (!Number.isInteger(At) || !Number.isInteger(Bt)) {
    console.log('not Integer', At, Bt);
    return 0;
  }

  let tokenPrice = At * 3 + Bt;
  console.log(At, Bt);
  console.log(tokenPrice);

  return tokenPrice;
}

export async function day13b(dataPath?: string) {
  const data = await readLines(dataPath);
  // 1. maquinas
  const machines = parseLines(data);
  let result = 0;
  // 2. por cada maquina encuento min tokens to prize, si exite

  for (const machine of machines) {
    console.log('machine');

    result += solveEquations(machine);
  }
  // 3. suma de todos los tokens
  return result;
}

const answer = await day13b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
