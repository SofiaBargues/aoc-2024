import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function runProgram(A: bigint, B: bigint, C: bigint, program: number[]) {
  const literal = (op: number) => BigInt(op);

  const comboOps = {
    0: (op: number) => BigInt(op),
    1: (op: number) => BigInt(op),
    2: (op: number) => BigInt(op),
    3: (op: number) => BigInt(op),
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

  const instructions = {
    0: (op: number) => {
      A = A >> BigInt(combo(op));
      programIdx += 2;
    },
    1: (op: number) => {
      B = B ^ literal(op);
      programIdx += 2;
    },
    2: (op: number) => {
      B = combo(op) % 8n;
      programIdx += 2;
    },
    3: (op: number) => {
      if (A === 0n) {
        programIdx += 2;
        return;
      }
      programIdx = Number(literal(op));
    },
    4: (op: number) => {
      B = B ^ C;
      programIdx += 2;
    },
    5: (op: number) => {
      output.push(Number(combo(op) % 8n));
      programIdx += 2;
    },
    6: (op: number) => {
      B = A >> BigInt(combo(op));
      programIdx += 2;
    },
    7: (op: number) => {
      C = A >> BigInt(combo(op));
      programIdx += 2;
    },
  };

  const runInstruction = (instruction: number, op: number) => {
    instructions[instruction as keyof typeof instructions](op);
  };

  while (programIdx < program.length) {
    runInstruction(program[programIdx], program[programIdx + 1]);
  }

  return output;
}

export async function day17b(dataPath?: string) {
  const data = await readLines(dataPath);
  const { B, C, program } = parseLines(data);

  function dfs(pos: number, currentBits: bigint): bigint | null {
    // Base case: we've found all digits
    if (pos === 16) {
      return currentBits;
    }

    // Try all 8 possibilities for the current position
    for (let bits = 0n; bits < 8n; bits++) {
      const testValue = bits | currentBits;
      const output = runProgram(testValue, 0n, 0n, program);

      // Get the target sequence from right to left
      const targetSeq = program.slice(program.length - 1 - pos, program.length);
      const outputSeq = output.slice(output.length - 1 - pos, output.length);

      console.log(
        `\nLevel ${pos}, Testing ${testValue.toString(2).padStart(30, '0')}`
      );
      console.log(`Current bits: ${bits.toString(2).padStart(3, '0')}`);
      console.log(`Output seq: ${outputSeq.join(',')}`);
      console.log(`Target seq: ${targetSeq.join(',')}`);

      if (
        outputSeq.length === targetSeq.length &&
        outputSeq.every((v, i) => v === targetSeq[i])
      ) {
        console.log(`Found match for position ${pos}!`);
        console.log(`----------------------------------`);

        // Try next level with these bits
        const nextResult = dfs(pos + 1, testValue << 3n);
        if (nextResult !== null) {
          return nextResult; // Found a complete solution
        }

        console.log(`Backtracking from level ${pos}, trying next possibility`);
      }
    }

    return null; // No solution found at this level
  }

  const result = dfs(0, 0n);
  if (result === null) {
    console.log('No solution found');
    return -1;
  }

  console.log('Testing result');
  console.log(runProgram(result >> 3n, 0n, 0n, program));
  return Number(result >> 3n);
}

// Main execution
const answer = await day17b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
