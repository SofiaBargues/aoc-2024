import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { Position, parseLines } from './parse.ts';

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

function expandGalaxyX(galaxies: Position[], gaps: number[], expandBy: number) {
  gaps.reverse().forEach((xGap) => {
    galaxies = galaxies.map((galaxy) => {
      return {
        x: galaxy.x > xGap ? galaxy.x + expandBy : galaxy.x,
        y: galaxy.y,
      };
    });
  });
  return galaxies;
}

function expandGalaxyY(galaxies: Position[], gaps: number[], expandBy: number) {
  gaps.reverse().forEach((yGap) => {
    galaxies = galaxies.map((galaxy) => {
      return {
        x: galaxy.x,
        y: galaxy.y > yGap ? galaxy.y + expandBy : galaxy.y,
      };
    });
  });
  return galaxies;
}

function expandUniverse(
  galaxies: Position[],
  grid: string[],
  expandBy: number
) {
  const xWithGalaxies = new Set(galaxies.map((position) => position.x));
  const yWithGalaxies = new Set(galaxies.map((position) => position.y));
  const XLength = grid[0].length;
  const YLength = grid.length;

  const xGaps = [...Array(XLength).keys()].filter((x) => !xWithGalaxies.has(x));
  const yGaps = [...Array(YLength).keys()].filter((y) => !yWithGalaxies.has(y));

  galaxies = expandGalaxyX(galaxies, xGaps, expandBy);
  galaxies = expandGalaxyY(galaxies, yGaps, expandBy);
  return galaxies;
}

function distance2Galaxies(galaxy1: Position, galaxy2: Position) {
  return Math.abs(galaxy2.x - galaxy1.x) + Math.abs(galaxy2.y - galaxy1.y);
}

export async function day11b(dataPath?: string) {
  const grid = await readData(dataPath);
  let galaxies = parseLines(grid);
  galaxies = expandUniverse(galaxies, grid, 999999);

  let totalDistance = calculateDistanceAllPairs(galaxies);

  return totalDistance;
}

const answer = await day11b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
