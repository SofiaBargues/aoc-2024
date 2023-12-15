import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { Position, parseLines } from './parse.ts';

function expandGalaxyX(galaxies: Position[], gaps: number[]) {
  gaps.reverse().forEach((xGap) => {
    galaxies = galaxies.map((galaxy) => {
      return { x: galaxy.x > xGap ? galaxy.x + 1 : galaxy.x, y: galaxy.y };
    });
  });
  return galaxies;
}

function expandGalaxyY(galaxies: Position[], gaps: number[]) {
  gaps.reverse().forEach((yGap) => {
    galaxies = galaxies.map((galaxy) => {
      return { x: galaxy.x, y: galaxy.y > yGap ? galaxy.y + 1 : galaxy.y };
    });
  });
  return galaxies;
}

function expandUniverse(galaxies: Position[], grid: string[]) {
  const xWithGalaxies = new Set(galaxies.map((position) => position.x));
  const yWithGalaxies = new Set(galaxies.map((position) => position.y));
  const XLength = grid[0].length;
  const YLength = grid.length;

  const xGaps = [...Array(XLength).keys()].filter((x) => !xWithGalaxies.has(x));
  const yGaps = [...Array(YLength).keys()].filter((y) => !yWithGalaxies.has(y));

  galaxies = expandGalaxyX(galaxies, xGaps);
  galaxies = expandGalaxyY(galaxies, yGaps);
  return galaxies;
}

function distance2Galaxies(galaxy1: Position, galaxy2: Position) {
  return Math.abs(galaxy2.x - galaxy1.x) + Math.abs(galaxy2.y - galaxy1.y);
}

export async function day11a(dataPath?: string) {
  const grid = await readData(dataPath);
  let galaxies = parseLines(grid);
  galaxies = expandUniverse(galaxies, grid);

  let totalDistance = calculateDistanceAllPairs(galaxies);

  return totalDistance;
}

const answer = await day11a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
function calculateDistanceAllPairs(galaxies: Position[]) {
  let totalDistance = 0;
  galaxies.slice(0, -1).forEach((galaxyStart, i) => {
    const otherGalaxies = galaxies.slice(i + 1);
    otherGalaxies.forEach((galaxyEnd) => {
      totalDistance += distance2Galaxies(galaxyStart, galaxyEnd);
    });
  });
  return totalDistance;
}
