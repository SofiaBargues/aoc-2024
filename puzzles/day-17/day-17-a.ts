import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day17a(dataPath?: string) {
  const data = await readLines(dataPath);
  let { A, B, C, program } = parseLines(data);
  console.log(A, B, C, program);

  const literal = (op: number) => op;

  // 0-3: x->x
  // 4: _ -> register A
  // 5: _ -> register B
  // 6: _ -> register C
  // 7: invalid
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

  // Instructions:
  //   0: (adv) -> truncate(reg A / 2^combo(operand)). Stores in A
  //   1: (bxl) ->  reg B bitwise xor literal(operand). Stores in B
  //   2: (bst) -> combo(operand)%8. Stores in B
  //   3: (jnz) -> if A===0: Nothing, else jumps(literal(operand)) (skip increase of 2)
  //   4: (bxc) -> reg B bitwise xor reg C. Stores in B
  //   5: (out) -> combo(operand)%8. outputs the value (outputs are separated by `,`)
  //   6: (bdv) -> truncate(reg A / 2^combo(operand)). Stores in B
  //   7: (bdv) -> truncate(reg A / 2^combo(operand)). Stores in C

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
    // console.log(
    //   'idx',
    //   programIdx,
    //   'instruction',
    //   program[programIdx],
    //   'operand',
    //   program[programIdx + 1]
    // );
    runInstruction(program[programIdx], program[programIdx + 1]);
    // console.log('A', A, 'B', B, 'C', C, 'output', output);
  }

  return output.join(',');
}

const answer = await day17a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
