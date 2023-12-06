import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { MapRange, convertInputToObject, parseSeeds } from './parse.ts';

function findNextNumber(input: number, mapRanges: MapRange[]): number {
  for (const range of mapRanges) {
    const rangeEnd = range.sourceStart + range.length - 1;
    if (input >= range.sourceStart && input <= rangeEnd) {
      // Range to modified int
      const transform = range.destStart - range.sourceStart;

      return input + transform;
    }
  }

  return input;
}

function generateNumbersFromRanges(seedRanges: SeedRange[]): number[] {
  let result: number[] = [];

  seedRanges.forEach((range) => {
    const rangeEnd = range.start + range.length - 1;
    for (let i = range.start; i <= rangeEnd; i++) {
      result.push(i);
    }
  });

  return result;
}

type SeedRange = {
  start: number;
  length: number;
};

export async function day5b(dataPath?: string) {
  const data = await readData(dataPath);
  const maps = convertInputToObject(data);
  // seeds: 79 14     55 13
  const seedInput = parseSeeds(data[0]);

  const seedRanges: SeedRange[] = [];
  for (let i = 0; i < seedInput.length; i += 2) {
    seedRanges[i / 2] = {
      start: seedInput[i],
      length: seedInput[i + 1],
    };
  }

  const results = generateNumbersFromRanges(seedRanges);

  const transformations = [
    'seed-to-soil',
    'soil-to-fertilizer',
    'fertilizer-to-water',
    'water-to-light',
    'light-to-temperature',
    'temperature-to-humidity',
    'humidity-to-location',
  ];

  for (const mapName of transformations) {
    for (let i = 0; i < results.length; i++) {
      results[i] = findNextNumber(results[i], maps[mapName]);
    }
  }

  return Math.min(...results);
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
