import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { parseLines } from './parse.ts';

let LIMITS = {
  red: 12,
  green: 13,
  blue: 14,
};

// {
//   red: 2,
//   green: 30,
//   blue: 4,
// };

function compareColors(
  limit: { blue: number; green: number; red: number },
  input: { blue: number; green: number; red: number }
) {
  if (
    input.blue <= limit.blue &&
    input.green <= limit.green &&
    input.red <= limit.red
  ) {
    return true;
  }
  return false;
}

function getValue(
  largest: { blue: number; green: number; red: number },
  index: number
) {
  if (compareColors(LIMITS, largest)) {
    return index + 1;
  }
  return 0;
}

export async function day2a(dataPath?: string) {
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
  console.log(largests);
  let result = largests.map(getValue);

  return result.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
