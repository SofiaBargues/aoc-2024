import chalk from 'chalk';
import { readLines } from '../../shared.ts';

import { Grid, parseLines } from './parse.ts';

function transpose(grid: Grid): Grid {
  return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));
}

function getMirrorValue(grid: Grid): number {
  const rowsEncoded = getRowsEncoded(grid);
  const transposedGrid = transpose(grid);
  const colsEncoded = getRowsEncoded(transposedGrid);
  console.log('ROWS');
  console.table(rowsEncoded);
  console.log('COLS');
  console.table(colsEncoded);

  const mirrorRowIdx = rowsEncoded.findIndex(isMirror);
  const mirrorColIdx = colsEncoded.findIndex(isMirror);

  console.log({ mirrorRowIdx, mirrorColIdx });
  if (mirrorColIdx != -1 && mirrorRowIdx != -1) {
    throw Error('Both found');
  }

  if (mirrorColIdx != -1) {
    return mirrorColIdx;
  } else if (mirrorRowIdx != -1) {
    return mirrorRowIdx * 100;
  } else {
    throw Error('Row or Col not found');
  }
}

function isMirror(value: string, rowIdx: number, arr: string[]): boolean {
  if (rowIdx == 0) return false;
  // if (rowIdx == arr.length - 1) return false;

  let halfLength = Math.min(rowIdx, arr.length - rowIdx);
  let smudgeFound = false;
  for (let i = 0; i < halfLength; i++) {
    const valLeft = arr[rowIdx - 1 - i];
    const valRight = arr[rowIdx + i];
    if (valLeft == undefined || valRight == undefined) {
      throw Error('Undefined value err');
    }
    if (valLeft != valRight) {
      if (smudgeFound) {
        return false;
      } else {
        if (onlyOneBitDiff(valRight, valLeft)) {
          smudgeFound = true;
        } else {
          return false;
        }
      }
    }
  }
  return smudgeFound;
}

// 28717 too low

function onlyOneBitDiff(valLeft: string, valRight: string) {
  const arr1 = valLeft.split('').reverse();
  const arr2 = valRight.split('').reverse();
  console.log({ valLeft, valRight, arr1, arr2 });
  const [longest, shortest] =
    arr1.length > arr2.length ? [arr1, arr2] : [arr2, arr1];

  return longest.filter((val, i) => val != shortest[i]).length == 1;
}

function getRowsEncoded(grid: Grid): string[] {
  return grid.map((row) => row.reduce((acc, cell) => acc + String(cell), ''));
}

export async function day13b(dataPath?: string) {
  const data = await readLines(dataPath);
  const grids = parseLines(data);
  const gridResults = grids.map((grid) => getMirrorValue(grid));

  return gridResults.reduce((acc, val) => acc + val, 0);
}

const answer = await day13b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
