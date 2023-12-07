import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day6a(dataPath?: string) {
  const data = await readData(dataPath);
  const races = parseLines(data);
  let totalWinWays = 1;
  for (const race of races) {
    const { time: totalTime, distance: recordDistance } = race;
    let winWays = 0;
    for (let accTime = 0; accTime <= totalTime; accTime++) {
      const speed = accTime;
      const travelTime = totalTime - accTime;
      const distance = speed * travelTime;
      if (distance > recordDistance) {
        winWays++;
      }
    }
    totalWinWays *= winWays;
  }
  return totalWinWays;
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
