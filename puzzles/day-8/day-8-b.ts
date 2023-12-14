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
  const firstZEncounter = Array(currentCords.length).fill(null);
  while (!firstZEncounter.every((cord) => cord != null)) {
    const direction = directions[step % directions.length];
    currentCords = currentCords.map((cord) => desertMap[cord][direction]);
    step++;
    currentCords.forEach((cord, i) => {
      if (cord.endsWith('Z') && firstZEncounter[i] == null) {
        firstZEncounter[i] = step;
      }
    });
  }

  return firstZEncounter;
}

const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
