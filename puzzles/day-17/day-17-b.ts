import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function runProgram(A: number, B: number, C: number, program: number[]) {
  const literal = (op: number) => op;

  const comboOps = {
    0: (op: number) => op,
    1: (op: number) => op,
    2: (op: number) => op,
    3: (op: number) => op,
    4: (op: number) => A,
    5: (op: number) => B,
    6: (op: number) => C,
    7: (op: number) => {
      throw new Error('Invalid operand');
    },
  };

  const combo = (op: number) => comboOps[op as keyof typeof comboOps](op);

  let programIdx = 0;
  const output: number[] = [];
  let earlyExit = false;

  const instructions = {
    0: (op: number) => {
      A = Math.floor(A / 2 ** combo(op));
      programIdx += 2;
    },
    1: (op: number) => {
      B = B ^ literal(op);
      programIdx += 2;
    },
    2: (op: number) => {
      B = combo(op) % 8;
      programIdx += 2;
    },
    3: (op: number) => {
      if (A === 0) {
        programIdx += 2;
        return;
      }
      programIdx = literal(op);
    },
    4: (op: number) => {
      B = B ^ C;
      programIdx += 2;
    },
    5: (op: number) => {
      output.push(combo(op) % 8);
      if (program[output.length - 1] !== output[output.length - 1]) {
        earlyExit = true;
      }
      programIdx += 2;
    },
    6: (op: number) => {
      B = Math.floor(A / 2 ** combo(op));
      programIdx += 2;
    },
    7: (op: number) => {
      C = Math.floor(A / 2 ** combo(op));
      programIdx += 2;
    },
  };

  const runInstruction = (instruction: number, op: number) => {
    instructions[instruction as keyof typeof instructions](op);
  };

  while (programIdx < program.length) {
    runInstruction(program[programIdx], program[programIdx + 1]);
    if (earlyExit) {
      return [];
    }
  }

  return output;
}

function processRange(
  start: number,
  end: number,
  B: number,
  C: number,
  program: string
) {
  const programArray = program.split(',').map(Number);
  console.log('processing range', start, end);
  const range = end - start;
  const rangePercent = Math.floor(range / 100);
  for (let A = start; A < end; A++) {
    if (A % rangePercent === 0 && A !== start) {
      console.log(`${A} is ${Math.floor((A - start) / rangePercent)}% done`);
    }
    const output = runProgram(A, B, C, programArray);
    if (output.join(',') === program) {
      return A;
    }
  }
  return -1;
}

export async function day17b(dataPath?: string) {
  const data = await readLines(dataPath);
  const { B, C, program } = parseLines(data);
  const programStr = program.join(',');
  const A_RANGE = 10000000000;

  console.log('Processing range 0 to', A_RANGE);
  const result = processRange(0, A_RANGE, B, C, programStr);
  return result;
}

// Main execution
const answer = await day17b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
