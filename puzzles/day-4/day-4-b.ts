import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { parseLines } from './parse.ts';

function getCardValues(cards: number[][][]) {
  let cardValues = [];

  for (const card of cards) {
    const [winning_numbers, your_numbers] = card;
    let winningMatchs = 0;
    for (const winning_number of winning_numbers) {
      if (your_numbers.includes(winning_number)) {
        winningMatchs++;
      }
    }
    cardValues.push(winningMatchs);
  }
  return cardValues;
}

export async function day4b(dataPath?: string) {
  const data = await readData(dataPath);
  const originalCards = parseLines(data);
  const cardValues = getCardValues(originalCards);
  const cardCounts = Array(originalCards.length).fill(1);
  console.log({ cardValues });

  for (let i = 0; i < cardCounts.length; i++) {
    const matches = cardValues[i];
    for (let j = i + 1; j < i + 1 + matches; j++) {
      cardCounts[j] += cardCounts[i];
    }
  }

  return cardCounts.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
