import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { Cell, Grid, parseLines } from './parse.ts';

function transpose(grid: Grid): Grid {
  return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));
}

function tiltRow(row: Cell[]): Cell[] {
  const newRow: Cell[] = new Array(row.length).fill('.');
  let lastRockIdx = -1;
  let roundRocksCount = 0;
  for (let i = 0; i < row.length; i++) {
    if (row[i] == 'O') {
      roundRocksCount++;
    }
    if (row[i] == '#') {
      newRow.fill('O', lastRockIdx + 1, lastRockIdx + 1 + roundRocksCount);
      newRow[i] = '#';
      lastRockIdx = i;
      roundRocksCount = 0;
    } else if (i == row.length - 1) {
      // last
      newRow.fill('O', lastRockIdx + 1, lastRockIdx + 1 + roundRocksCount);
      roundRocksCount = 0;
    }
  }

  return newRow;
}

function tiltGrid(grid: Grid): Grid {
  return grid.map((row) => tiltRow(row));
}

function calculateLoad(grid: Grid): number {
  return grid
    .map((row) =>
      row
        .map((cell, i, arr) => (cell == 'O' ? arr.length - i : 0))
        .reduce((acc, val) => acc + val, 0)
    )
    .reduce((acc, val) => acc + val, 0);
}

export async function day14a(dataPath?: string) {
  const data = await readLines(dataPath);
  const grid = parseLines(data);
  const gridT = transpose(grid);
  const tiltedGridT = tiltGrid(gridT);
  const load = calculateLoad(tiltedGridT);

  const tiltedGrid = transpose(tiltedGridT);
  console.log(tiltedGrid);

  return load;
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
