import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function expand(disk: string[]): string[] {
  const expanded = [];
  for (let i = 0; i < disk.length; i += 2) {
    const nums = Number(disk[i]);
    const dots = Number(disk[i + 1]);
    const id = i / 2;
    for (let j = 0; j < nums; j++) {
      expanded.push(id.toString());
    }
    if (dots != undefined) {
      for (let j = 0; j < dots; j++) {
        expanded.push('.');
      }
    }
  }
  return expanded;
}

function swapMany(disk, aStart, bStart, num) {
  const temp = disk.slice(bStart, bStart + num);
  disk.splice(bStart, num, ...disk.slice(aStart, aStart + num));
  disk.splice(aStart, num, ...temp);
}

function findNPoints(disk, n) {
  let start = -1;
  for (let i = 0; i < disk.length; i++) {
    const val = disk[i];
    if (val === '.') {
      if (start === -1) {
        start = i;
      }
      if (i - start + 1 === n) {
        return start;
      }
    } else {
      start = -1;
    }
  }
  return -1;
}

function compact(disk: string[]): string[] {
  let fileSize = 0;
  let fileId = '.';

  for (let r = disk.length - 1; r >= 0; r--) {
    const val = disk[r];

    if (val === fileId && fileId !== '.') {
      fileSize++;
    } else {
      if (fileId !== '.') {
        const l = findNPoints(disk.slice(0, r + 1), fileSize);
        if (l !== -1) {
          swapMany(disk, l, r + 1, fileSize);
        }
      }
      fileId = disk[r];
      fileSize = 1;
    }
  }
  return disk;
}

function checkSum(disk: string[]) {
  let acc = 0;
  for (let i = 0; i <= disk.length - 1; i++) {
    const num = disk[i];
    if (num === '.') {
      continue;
    } else {
      acc += parseInt(num, 10) * i;
    }
  }
  return acc;
}

export async function day9b(dataPath?: string) {
  const data = await readLines(dataPath);
  let disk = parseLines(data)[0];

  disk = expand(disk);
  // const nonDotPrev = disk.filter((val) => val != '.').length;
  // console.log(disk.join());
  disk = compact(disk);
  // const nonDotAfter = disk.filter((val) => val != '.').length;
  // console.log(nonDotPrev, nonDotAfter);
  return checkSum(disk);
}

const answer = await day9b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
