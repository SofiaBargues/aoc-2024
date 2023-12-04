import chalk from 'chalk';
import { readData } from '../../shared.ts';

interface Match {
  number: number;
  startIndex: number;
  endIndex: number;
}

function extractInfo(inputString: string): Match[] {
  const regex = /\d+/g;
  let match;
  let result: Match[] = [];

  while ((match = regex.exec(inputString)) !== null) {
    result.push({
      number: parseInt(match[0]),
      startIndex: match.index!,
      endIndex: regex.lastIndex,
    });
  }

  return result;
}

function isValid(
  lines: string[],
  matchStart: number,
  matchEnd: number,
  lineNum: number
): boolean {
  const minX = Math.max(matchStart - 1, 0);
  const maxX = Math.min(matchEnd + 1, lines[lineNum].length);
  const minY = Math.max(lineNum - 1, 0);
  const maxY = Math.min(lineNum + 1, lines.length - 1);

  // TODO: Find a non number and non . character and return true
  const regex = /[^0-9.]/g;

  let specialCharFound = false;
  for (let i = minY; i <= maxY; i++) {
    const sub = lines[i].substring(minX, maxX);
    const match = sub.match(regex);
    if (match) {
      specialCharFound = true;
    }
  }

  return specialCharFound;
}

export async function day3a(dataPath?: string) {
  const lines = await readData(dataPath);
  const validNumbers = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches: Match[] = extractInfo(line);
    for (const match of matches) {
      if (isValid(lines, match.startIndex, match.endIndex, i)) {
        validNumbers.push(match.number);
      }
    }
  }

  return validNumbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
