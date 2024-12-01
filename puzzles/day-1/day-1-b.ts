import chalk from 'chalk';
import { readData } from '../../shared.ts';

export async function day1b(dataPath?: string) {
  const lines = await readData(dataPath);

  const list1: number[] = [];
  const list2: number[] = [];
  lines
    .map((line) => line.split('   '))
    .forEach(([a, b]) => {
      list1.push(Number(a));
      list2.push(Number(b));
    });
  // Solution

  const obj: Record<number, number> = {};
  let acc = 0;

  for (const num of list2) {
    if (num in obj) {
      obj[num]++;
    } else {
      obj[num] = 1;
    }
  }
  for (const num of list1) {
    if (!(num in obj)) {
      continue;
    }
    const val = num * obj[num];
    acc = val + acc;
  }
  console.log(obj);
  // console.log(list1);
  // console.log(list2);
  return acc;
}

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
