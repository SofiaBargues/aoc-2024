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

function getNumericMoveSequence(
  pStart: [number, number],
  pEnd: [number, number]
) {
  /*
  ------ y ----->
| +---+---+---+
| | 7 | 8 | 9 |
| +---+---+---+
x | 4 | 5 | 6 |
| +---+---+---+
| | 1 | 2 | 3 |
| +---+---+---+
|     | 0 | A |
v      +---+---+
  */

  const movement = [pEnd[0] - pStart[0], pEnd[1] - pStart[1]];
  const [x, y] = movement;
  let seq: string[] = [];

  // avoid [3,0]: If we're moving left and up starting from x=3 ending on y=0, we need to go up first and them left
  if (y < 0 && x < 0 && pStart[0] === 3 && pEnd[1] === 0) {
    seq = seq.concat(new Array(-x).fill('^'));
    seq = seq.concat(new Array(-y).fill('<'));
  }
  // avoid [3,0]: If we're moving right and down starting from y=0 ending on x=3, we need to go right first and them down
  else if (y > 0 && x > 0 && pStart[1] === 0 && pEnd[0] === 3) {
    seq = seq.concat(new Array(y).fill('>'));
    seq = seq.concat(new Array(x).fill('v'));
  }
  // For other cases, keep original priority order
  else {
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
  }
  return seq;
}

const dirMoveSeqMemo: Record<string, string[]> = {};

function getDirectionalMoveSequence(
  pCurr: [number, number],
  pNew: [number, number]
) {
  if (dirMoveSeqMemo[`${pCurr[0]}-${pCurr[1]}-${pNew[0]}-${pNew[1]}`]) {
    return dirMoveSeqMemo[`${pCurr[0]}-${pCurr[1]}-${pNew[0]}-${pNew[1]}`];
  }

  const movement = [pNew[0] - pCurr[0], pNew[1] - pCurr[1]];
  const [x, y] = movement;
  let seq: string[] = [];

  // If we're moving left and down, we need to go down first to avoid [0,0]
  if (y < 0 && x > 0) {
    seq = seq.concat(new Array(x).fill('v'));
    seq = seq.concat(new Array(-y).fill('<'));
  }
  // For other cases, keep original priority order
  else {
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
  }
  dirMoveSeqMemo[`${pCurr[0]}-${pCurr[1]}-${pNew[0]}-${pNew[1]}`] = seq;
  return seq;
}

const seqMemo: Record<string, string[]> = {};

function dirCodeToSequence(
  sequence: string[],
  posOfKey: Record<string, [number, number]>
): string[] {
  // Try to find the entire sequence in memo first
  const seqKey = `${sequence.join('')}`;
  if (seqMemo[seqKey]) return seqMemo[seqKey];

  let curr = 'A';
  let newSequence: string[] = [];
  // Fall back to original logic if no matches found
  for (const char of sequence) {
    const pCurr = posOfKey[curr];
    const pNew = posOfKey[char];
    const mSeq = getDirectionalMoveSequence(pCurr, pNew);
    newSequence = newSequence.concat(mSeq);
    newSequence.push('A');
    curr = char;
  }

  seqMemo[seqKey] = newSequence;
  return newSequence;
}

function numericCodeToSequence(
  sequence: string[],
  posOfKey: Record<string, [number, number]>
): string[] {
  let curr = 'A';
  let newSequence: string[] = [];
  for (const char of sequence) {
    const pCurr = posOfKey[curr];
    const pNew = posOfKey[char];
    const mSeq = getNumericMoveSequence(pCurr, pNew);
    newSequence = newSequence.concat(mSeq);
    newSequence.push('A');
    curr = char;
  }

  return newSequence;
}

export async function day21b(dataPath?: string) {
  const codes = await readLines(dataPath);
  const sequences: Record<string, string> = {};
  for (const code of codes) {
    // console.log(code);
    let seq1 = numericCodeToSequence(code.split(''), numericKeypad);
    // console.log(seq1.join(''));
    for (let i = 0; i < 2; i++) {
      console.log('step', i);
      seq1 = dirCodeToSequence(seq1, directionsKeypad);
    }
    // console.log(seq2.join(''));
    // console.log(seq3.join(''));
    sequences[code] = seq1.join('');
  }

  console.log(sequences);

  let total = 0;
  for (const [code, seq] of Object.entries(sequences)) {
    const numCode = Number(code.slice(0, code.length - 1));

    total += numCode * seq.length;
  }

  return total;
}

const answer = await day21b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
