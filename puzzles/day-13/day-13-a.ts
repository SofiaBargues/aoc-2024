import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { Grid, parseLines } from './parse.ts';

function transpose(grid: Grid): Grid {
  return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));
}

function getMirrorValue(grid: Grid): number {
  const rowsEncoded = getRowsEncoded(grid);
  const transposedGrid = transpose(grid);
  const colsEncoded = getRowsEncoded(transposedGrid);

  const mirrorRowIdx = rowsEncoded.findIndex(isMirror);
  const mirrorColIdx = colsEncoded.findIndex(isMirror);

  console.log({ mirrorRowIdx, mirrorColIdx });
  if (mirrorColIdx != -1) {
    return mirrorColIdx;
  } else if (mirrorRowIdx != -1) {
    return mirrorRowIdx * 100;
  } else {
    throw Error('Row or Col not found');
  }
}

function isMirror(value: number, rowIdx: number, arr: number[]): boolean {
  if (rowIdx == 0) return false;

  let halfLength = Math.min(rowIdx, arr.length - rowIdx);
  const startIdx = rowIdx - halfLength;
  for (let i = 0; i < halfLength; i++) {
    // console.log({
    //   l: arr[rowIdx - 1 - i],
    //   lidx: rowIdx - 1 - i,
    //   r: arr[rowIdx + i],
    //   ridx: rowIdx + i,
    // });
    if (arr[rowIdx - 1 - i] != arr[rowIdx + i]) {
      return false;
    }
  }
  return true;
}

function getRowsEncoded(grid: Grid) {
  return grid.map((row) =>
    parseInt(
      row.reduce((acc, cell) => acc + String(cell), ''),
      10
    )
  );
}

export async function day13a(dataPath?: string) {
  const data = await readData(dataPath);
  const grids = parseLines(data);
  const gridResults = grids.map((grid) => getMirrorValue(grid));

  return gridResults.reduce((acc, val) => acc + val, 0);
}

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
