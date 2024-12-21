import chalk from 'chalk';
import { readLines } from '../../shared.ts';

const numericKeypad: Record<string, [number, number]> = {
  '7': [0, 0],
  '8': [0, 1],
  '9': [0, 2],
  '4': [1, 0],
  '5': [1, 1],
  '6': [1, 2],
  '1': [2, 0],
  '2': [2, 1],
  '3': [2, 2],
  '0': [3, 1],
  A: [3, 2],
};

const directionsKeypad: Record<string, [number, number]> = {
  '^': [0, 1],
  A: [0, 2],
  '<': [1, 0],
  v: [1, 1],
  '>': [1, 2],
};

function movementToSequence(x: number, y: number) {
  let seq: string[] = [];
  if (y < 0) {
    seq = seq.concat(new Array(-y).fill('<'));
  }
  if (x > 0) {
    seq = seq.concat(new Array(x).fill('v'));
  }
  if (y > 0) {
    seq = seq.concat(new Array(y).fill('>'));
  }
  if (x < 0) {
    seq = seq.concat(new Array(-x).fill('^'));
  }
  return seq;
}

function codeToSequence(
  sequence: string[],
  posOfKey: Record<string, [number, number]>
): string[] {
  let curr = 'A';
  let newSequence: string[] = [];
  for (const char of sequence) {
    const pCurr = posOfKey[curr];
    const pNew = posOfKey[char];
    const movement = [pNew[0] - pCurr[0], pNew[1] - pCurr[1]];
    const mSeq = movementToSequence(movement[0], movement[1]);
    // console.log(char, movement, mSeq);
    newSequence = newSequence.concat(mSeq);
    newSequence.push('A');
    curr = char;
  }

  return newSequence;
}

export async function day21a(dataPath?: string) {
  const codes = await readLines(dataPath);
  const sequences: Record<string, string> = {};
  for (const code of codes) {
    // console.log(code);
    const seq1 = codeToSequence(code.split(''), numericKeypad);
    // console.log(seq1.join(''));
    const seq2 = codeToSequence(seq1, directionsKeypad);
    // console.log(seq2.join(''));
    const seq3 = codeToSequence(seq2, directionsKeypad);
    // console.log(seq3.join(''));
    sequences[code] = seq3.join('');
  }

  console.log(sequences);

  let total = 0;
  for (const [code, seq] of Object.entries(sequences)) {
    const numCode = Number(code.slice(0, code.length - 1));

    total += numCode * seq.length;
  }

  return total;
}

const answer = await day21a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
