import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day8b(dataPath?: string) {
  const data = await readData(dataPath);
  const directions = data[0];
  const desertMap = parseLines(data.slice(2));
  // console.log({ desertMap, directions });
  let step = 0;
  let currentCords = Object.keys(desertMap).filter((cord) =>
    cord.endsWith('A')
  );
  const startCoords = [...currentCords];
  while (!currentCords.every((cord) => cord.endsWith('Z'))) {
    const direction = directions[step % directions.length];
    currentCords = currentCords.map((cord) => desertMap[cord][direction]);
    currentCords.forEach((cord, i) => {
      cord == startCoords[i] && console.log(cord);
    });
    step++;

    if (step % 1000000 == 0) {
      console.log({ currentCords, step });
    }
  }
  return step;
}

const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
