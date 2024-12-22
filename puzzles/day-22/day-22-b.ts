import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function mix(secret: number, num: number) {
  return ((secret >>> 0) ^ (num >>> 0)) >>> 0;
}

function prune(secret: number) {
  return secret % 16777216;
}

// Pseudo random sequence
function applySequence(secret: number) {
  secret = prune(mix(secret, secret << 6));
  secret = prune(mix(secret, secret >> 5));
  secret = prune(mix(secret, secret << 11));
  return secret;
}

function getLastDigit(secret: number) {
  return secret % 10;
}

export async function day22b(dataPath?: string) {
  const data = await readLines(dataPath);
  const sellers = parseLines(data);
  const profits: { [key: string]: number } = {};
  // 2. Keep secret numbers in an arr
  // 3. keep differences in another arr
  // 4. create a key with the last 4 digits in differences arr (if less than 4 digits, skip)
  // 5. Add to the seller profits hashmap the curr bananas in that key (if already exits, skip1)
  // 6. at the end of a single seller, dump its profits to the global profits hashmap (by adding if key exists, else set)

  // Secret evolving simulation
  for (const secret of sellers) {
    // 1. go through each secret number, get the last digit (bananas)
    let newSecret = secret;

    let differences = [];
    let lastBanana = getLastDigit(newSecret);
    const sellerProfits: { [key: string]: number } = {};

    for (let i = 0; i < 2000; i++) {
      newSecret = applySequence(newSecret);
      const currBanana = getLastDigit(newSecret);
      differences.push(currBanana - lastBanana);

      if (differences.length >= 4) {
        const key = differences.slice(-4).join(',');
        if (!(key in sellerProfits)) {
          sellerProfits[key] = currBanana;
        }
      }

      lastBanana = currBanana;
    }

    for (const [key, value] of Object.entries(sellerProfits)) {
      if (profits[key]) {
        profits[key] += value;
      } else {
        profits[key] = value;
      }
    }
  }

  // 7. Get the key of maximum number of bannaas
  const maxKey = Object.keys(profits).reduce((maxKey, key) => {
    return profits[maxKey] > profits[key] ? maxKey : key;
  }, '');
  // 8. Return max nums bananas
  return profits[maxKey];
}

const answer = await day22b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
