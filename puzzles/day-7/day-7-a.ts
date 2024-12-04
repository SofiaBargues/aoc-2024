import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { Player, parseLines } from './parse.ts';

const CARD_VALUES = [
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];

const HAND_TYPES = [
  'Five',
  'Four',
  'Full',
  'Three',
  'TwoPair',
  'OnePair',
  'High',
];

function getHandType(player: Player) {
  // Return the type of a hand
  const cardCounter = {};
  for (const card of player.hand) {
    if (cardCounter[card] != undefined) {
      cardCounter[card] += 1;
    } else {
      cardCounter[card] = 1;
    }
  }

  const sortedHand = Object.values<number>(cardCounter).sort((a, b) => b - a);
  if (sortedHand[0] == 5) {
    return 'Five';
  }
  if (sortedHand[0] == 4) {
    return 'Four';
  }
  if (sortedHand[0] == 3 && sortedHand[1] == 2) {
    return 'Full';
  }
  if (sortedHand[0] == 3) {
    return 'Three';
  }
  if (sortedHand[0] == 2 && sortedHand[1] == 2) {
    return 'TwoPair';
  }
  if (sortedHand[0] == 2) {
    return 'OnePair';
  }
  return 'High';
}

function compareHands(player1: Player, player2: Player): number {
  let type1 = getHandType(player1);
  let type2 = getHandType(player2);

  if (HAND_TYPES.indexOf(type1) > HAND_TYPES.indexOf(type2)) {
    return -1;
  } else if (HAND_TYPES.indexOf(type1) < HAND_TYPES.indexOf(type2)) {
    return 1;
  }

  for (let i = 0; i < player1.hand.length; i++) {
    const card1 = player1.hand[i];
    const card2 = player2.hand[i];
    if (CARD_VALUES.indexOf(card1) > CARD_VALUES.indexOf(card2)) {
      return -1;
    } else if (CARD_VALUES.indexOf(card1) < CARD_VALUES.indexOf(card2)) {
      return 1;
    }
  }

  return 0;
}

export async function day7a(dataPath?: string) {
  const data = await readLines(dataPath);
  const players = parseLines(data);
  const winOrderPlayers = players.sort(compareHands);
  console.log(getHandType(players[3]));

  return winOrderPlayers.reduce((total, player, i) => {
    return total + player.bid * (i + 1);
  }, 0);
}

const answer = await day7a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
