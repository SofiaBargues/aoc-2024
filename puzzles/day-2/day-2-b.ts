import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);
  const games = parseLines(data);
  const largests = games.map((game) =>
    game.reduce(
      (maxHand, hand) => {
        if (maxHand.blue < hand.blue) {
          maxHand.blue = hand.blue;
        }
        if (maxHand.green < hand.green) {
          maxHand.green = hand.green;
        }
        if (maxHand.red < hand.red) {
          maxHand.red = hand.red;
        }
        return maxHand;
      },
      { blue: 0, green: 0, red: 0 }
    )
  );
  let result = largests.map(
    (largest) => largest.blue * largest.green * largest.red
  );

  return result.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
