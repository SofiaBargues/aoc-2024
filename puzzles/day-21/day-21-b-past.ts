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

const directionsKeypadGrid = [
  [null, '^', 'A'],
  [, '<', 'v', '>'],
];
const numericKeypadGrid = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  [null, '0', 'A'],
];

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

  const vStart = numericKeypadGrid[pStart[0]][pStart[1]];
  const vEnd = numericKeypadGrid[pEnd[0]][pEnd[1]];

  if (vStart === vEnd) {
    return ['A'];
  }

  const res = instructions[`${vStart}${vEnd}`];
  if (!res) {
    console.log(vStart, vEnd);
    throw Error('No move sequence found');
  }
  return res.split('');
}

const dirMoveSeqMemo: Record<string, string[]> = {};

/**
 * A map of the best possible moves from any button to any other button on an arrow pad.
 * This map uses only action sequences that require only one change in direction at most
 * since that is always most efficient.
 */

// LEt's buid these movements:

const instructions = {
  A0: '<A',
  A1: '^<<A',
  A2: '<^A',
  A3: '^A',
  A4: '^^<<A',
  A5: '<^^A',
  A6: '^^A',
  A7: '^^^<<A',
  A8: '<^^^A',
  A9: '^^^A',
  '0A': '>A',
  '01': '^<A',
  '02': '^A',
  '03': '^>A',
  '04': '^^<A',
  '05': '^^A',
  '06': '^^>A',
  '07': '^^^<A',
  '08': '^^^A',
  '09': '^^^>A',
  '1A': '>>vA',
  '10': '>vA',
  '12': '>A',
  '13': '>>A',
  '14': '^A',
  '15': '^>A',
  '16': '^>>A',
  '17': '^^A',
  '18': '^^>A',
  '19': '^^>>A',
  '2A': 'v>A',
  '20': 'vA',
  '21': '<A',
  '23': '>A',
  '24': '<^A',
  '25': '^A',
  '26': '^>A',
  '27': '<^^A',
  '28': '^^A',
  '29': '^^>A',
  '3A': 'vA',
  '30': '<vA',
  '31': '<<A',
  '32': '<A',
  '34': '<<^A',
  '35': '<^A',
  '36': '^A',
  '37': '<<^^A',
  '38': '<^^A',
  '39': '^^A',
  '4A': '>>vvA',
  '40': '>vvA',
  '41': 'vA',
  '42': 'v>A',
  '43': 'v>>A',
  '45': '>A',
  '46': '>>A',
  '47': '^A',
  '48': '^>A',
  '49': '^>>A',
  '5A': 'vv>A',
  '50': 'vvA',
  '51': '<vA',
  '52': 'vA',
  '53': 'v>A',
  '54': '<A',
  '56': '>A',
  '57': '<^A',
  '58': '^A',
  '59': '^>A',
  '6A': 'vvA',
  '60': '<vvA',
  '61': '<<vA',
  '62': '<vA',
  '63': 'vA',
  '64': '<<A',
  '65': '<A',
  '67': '<<^A',
  '68': '<^A',
  '69': '^A',
  '7A': '>>vvvA',
  '70': '>vvvA',
  '71': 'vvA',
  '72': 'vv>A',
  '73': 'vv>>A',
  '74': 'vA',
  '75': 'v>A',
  '76': 'v>>A',
  '78': '>A',
  '79': '>>A',
  '8A': '>vvvA',
  '80': 'vvvA',
  '81': '<vvA',
  '82': 'vvA',
  '83': 'vv>A',
  '84': '<vA',
  '85': 'vA',
  '86': 'v>A',
  '87': '<A',
  '89': '>A',
  '9A': 'vvvA',
  '90': '<vvvA',
  '91': '<<vvA',
  '92': '<vvA',
  '93': 'vvA',
  '94': '<<vA',
  '95': '<vA',
  '96': 'vA',
  '97': '<<A',
  '98': '<A',
  'A^': '<A',
  'A<': 'v<<A',
  Av: '<vA',
  'A>': 'vA',
  '^A': '>A',
  '^<': 'v<A',
  '^v': 'vA',
  '^>': 'v>A',
  '<A': '>>^A',
  '<^': '>^A',
  '<v': '>A',
  '<>': '>>A',
  vA: '^>A',
  'v^': '^A',
  'v<': '<A',
  'v>': '>A',
  '>A': '^A',
  '>^': '<^A',
  '><': '<<A',
  '>v': '<A',
};

function getDirectionalMoveSequence(
  pCurr: [number, number],
  pNew: [number, number]
) {
  const vCurr = directionsKeypadGrid[pCurr[0]][pCurr[1]];
  const vNew = directionsKeypadGrid[pNew[0]][pNew[1]];

  if (dirMoveSeqMemo[`${vCurr}-${vNew}`]) {
    return dirMoveSeqMemo[`${vCurr}-${vNew}`];
  }
  const movement = [pNew[0] - pCurr[0], pNew[1] - pCurr[1]];
  const [x, y] = movement;
  let seq: string[] = [];

  // If we're moving left and down, we need to go down first to avoid [0,0]
  if (y < 0 && x > 0 && pNew[1] === 0) {
    seq = seq.concat(new Array(x).fill('v'));
    seq = seq.concat(new Array(-y).fill('<'));
  }
  // If we're moving right and up, we need to go right first to avoid [0,0]
  else if (y > 0 && x < 0 && pCurr[1] === 0) {
    seq = seq.concat(new Array(y).fill('>'));
    seq = seq.concat(new Array(-x).fill('^'));
  }
  // For other cases, keep original priority order
  else {
    if (y < 0) {
      seq = seq.concat(new Array(-y).fill('<'));
    }
    if (x > 0) {
      seq = seq.concat(new Array(x).fill('v'));
    }
    if (x < 0) {
      seq = seq.concat(new Array(-x).fill('^'));
    }
    if (y > 0) {
      seq = seq.concat(new Array(y).fill('>'));
    }
  }
  dirMoveSeqMemo[`${vCurr}-${vNew}`] = [...seq];

  return seq;
}

function dirMovement(curr: string, next: string) {
  if (curr === next) {
    return ['A'];
  }

  const res = instructions[`${curr}${next}`];
  if (!res) {
    console.log(curr, next);
    throw Error('Mseq not found');
  }
  return res.split('');
  // const pCurr = directionsKeypad[curr];
  // const pNext = directionsKeypad[next];
  // const mSeq = getDirectionalMoveSequence(pCurr, pNext);
  // mSeq.push('A');
  // return mSeq;
}

const dfsMemo: Record<string, bigint> = {};

function dfsDirMovement(curr: string, next: string, depth: number): bigint {
  if (depth === 0) {
    return 1n;
  }

  if (dfsMemo[`${curr}-${next}-${depth}`]) {
    return dfsMemo[`${curr}-${next}-${depth}`];
  }

  const mSeq = dirMovement(curr, next);

  let total = 0n;
  let prev = 'A';
  for (let i = 0; i < mSeq.length; i++) {
    total += dfsDirMovement(prev, mSeq[i], depth - 1);
    prev = mSeq[i];
  }

  dfsMemo[`${curr}-${next}-${depth}`] = total;
  return total;
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
    // newSequence.push('A');
    curr = char;
  }

  return newSequence;
}

export async function day21b(dataPath?: string) {
  const codes = await readLines(dataPath);
  const sequencesLength: Record<string, bigint> = {};
  for (const code of codes) {
    let seq1 = numericCodeToSequence(code.split(''), numericKeypad);
    let count = 0n;
    let curr = 'A';
    for (let i = 0; i < seq1.length; i++) {
      count += dfsDirMovement(curr, seq1[i], 2);
      curr = seq1[i];
    }
    sequencesLength[code] = count;
  }

  let total = 0n;
  for (const [code, length] of Object.entries(sequencesLength)) {
    const numCode = BigInt(code.slice(0, code.length - 1));
    total += numCode * length;
  }

  return total;
}

const answer = await day21b();
console.log(
  chalk.bgGreen('Your Answer:'),
  chalk.green(answer.toLocaleString('fullwide', { useGrouping: false }))
);

// 14514101553408566412863078400
