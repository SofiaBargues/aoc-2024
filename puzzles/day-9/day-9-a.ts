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

function compact(disk: string[]): string[] {
  let r = disk.length - 1;
  let l = 0;

  while (r >= l) {
    if (disk[l] === '.' && disk[r] != '.') {
      //SWAP -> Índices de los elementos a intercambiar
      let indice1 = r;
      let indice2 = l;

      // Intercambio de elementos
      let temp = disk[indice1];
      disk[indice1] = disk[indice2];
      disk[indice2] = temp;

      //avanzo los dos
      l++;
      r--;
    }

    if (disk[l] != '.') {
      l++;
    }
    if (disk[r] === '.') {
      r--;
    }
  }
  return disk;
}

function checkSum(disk: string[]) {
  let acc = 0;
  for (let i = 0; i <= disk.length - 1; i++) {
    const char = disk[i];
    if (char === '.') {
      break;
    } else {
      acc += Number(char) * i;
    }
  }
  return acc;
}

export async function day9a(dataPath?: string) {
  const data = await readLines(dataPath);
  let disk = parseLines(data)[0];

  disk = expand(disk);
  disk = compact(disk);
  return checkSum(disk);
}

const answer = await day9a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
