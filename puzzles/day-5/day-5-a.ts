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

export async function day5a(dataPath?: string) {
  const data = await readData(dataPath);
  const maps = convertInputToObject(data);
  const seeds = parseSeeds(data[0]);
  const seed2soil = maps['seed-to-soil'];
  const soil2fertilizer = maps['soil-to-fertilizer'];
  const fertilizer2water = maps['fertilizer-to-water'];
  const water2light = maps['water-to-light'];
  const light2temperature = maps['light-to-temperature'];
  const temperature2humidity = maps['temperature-to-humidity'];
  const humidity2location = maps['humidity-to-location'];

  const results = [...seeds];

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

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
