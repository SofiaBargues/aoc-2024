import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { Race, parseLines } from './parse.ts';

export async function day6b(dataPath?: string) {
  const data = await readLines(dataPath);
  const races = parseLines(data);
  let totalWinWays = 1;

  for (const race of races) {
    totalWinWays = getWinningWays(race, totalWinWays);
  }
  return totalWinWays;
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

function getWinningWays(race: Race, totalWinWays: number) {
  const { time: totalTime, distance: recordDistance } = race;
  let winWays = 0;
  const calculationPercent = totalTime / 100;
  for (let accTime = 0; accTime <= totalTime; accTime++) {
    if (accTime % calculationPercent == 0) {
      console.log(accTime / calculationPercent + ' percent');
    }
    const speed = accTime;
    const travelTime = totalTime - accTime;
    const distance = speed * travelTime;
    if (distance > recordDistance) {
      winWays++;
    }
  }
  totalWinWays *= winWays;
  return totalWinWays;
}
