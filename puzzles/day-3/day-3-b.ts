import chalk from 'chalk';
import { readData } from '../../shared.ts';

interface Match {
  startIndex: number;
  endIndex: number;
}

function extractInfo(inputString: string): Match[] {
  const regex = /\*/g;
  let match;
  let result: Match[] = [];

  while ((match = regex.exec(inputString)) !== null) {
    result.push({
      startIndex: match.index!,
      endIndex: regex.lastIndex,
    });
  }

  return result;
}

function doRangesOverlap(
  range1Start: number,
  range1End: number,
  range2Start: number,
  range2End: number
) {
  return range1Start <= range2End && range1End >= range2Start;
}

function getGearRatio(
  lines: string[],
  matchStart: number,
  matchEnd: number,
  lineNum: number
): number {
  const minX = Math.max(matchStart - 1, 0);
  const maxX = Math.min(matchEnd + 1, lines[lineNum].length);
  const minY = Math.max(lineNum - 1, 0);
  const maxY = Math.min(lineNum + 1, lines.length - 1);

  // TODO: Find a non number and non . character and return true
  const regex = /\d+/g;

  let numbersFound = [];
  for (let i = minY; i <= maxY; i++) {
    const line = lines[i];
    let match;
    while ((match = regex.exec(line)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;
      if (doRangesOverlap(minX, maxX - 1, start, end - 1)) {
        numbersFound.push(parseInt(match[0]));
      }
    }
  }
  if (numbersFound.length == 2) {
    return numbersFound[0] * numbersFound[1];
  } else if (numbersFound.length > 2) {
    throw Error('More than 2 numbers');
  }
  return 0;
}

export async function day3b(dataPath?: string) {
  const lines = await readData(dataPath);
  const validNumbers = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches: Match[] = extractInfo(line);
    for (const match of matches) {
      validNumbers.push(
        getGearRatio(lines, match.startIndex, match.endIndex, i)
      );
    }
  }

  return validNumbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
}

const answer = await day3b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
