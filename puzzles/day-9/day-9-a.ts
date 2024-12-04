import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { ReadingSequence, parseLines } from './parse.ts';

function getDiffArray(sequence: ReadingSequence): ReadingSequence {
  return sequence.reduce((diffSeq, el, i, array) => {
    if (i < array.length - 1) {
      diffSeq.push(array[i + 1] - el);
    }
    return diffSeq;
  }, []);
}

function extendDiffArrays(allArrays: ReadingSequence[]): ReadingSequence[] {
  const extendedAllArrays = allArrays
    .reverse()
    .map((sequence, i, array) => {
      sequence.push(
        array[i - 1]
          ? sequence[sequence.length - 1] +
              array[i - 1][array[i - 1].length - 1]
          : 0
      );
      return sequence;
    })
    .reverse();
  return extendedAllArrays;
}

function getNextValue(sequence: ReadingSequence): number {
  const allArrays = buildDiffArrays(sequence);
  console.log({ allArrays });
  const allArraysExtended = extendDiffArrays(allArrays);
  console.log(allArraysExtended);
  return allArraysExtended[0][allArraysExtended[0].length - 1];
}

function buildDiffArrays(sequence: ReadingSequence) {
  const allArrays = [[...sequence]];

  for (let i = 0; i < sequence.length; i++) {
    const diffArray = getDiffArray(allArrays[i]);
    allArrays.push(diffArray);
    if (diffArray.every((el) => el === 0)) {
      break;
    }
  }
  return allArrays;
}

export async function day9a(dataPath?: string) {
  const data = await readLines(dataPath);
  let readingSequences = parseLines(data);

  console.log(readingSequences);
  let predictedMeasurementsSum = 0;
  for (const readingSequence of readingSequences) {
    const nextValue = getNextValue(readingSequence);
    console.log(nextValue);
    predictedMeasurementsSum += nextValue;
  }

  return predictedMeasurementsSum;
}

const answer = await day9a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
