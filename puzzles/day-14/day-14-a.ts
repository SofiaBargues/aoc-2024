import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

let xLen = 101;
let yLen = 103;
// let xLen = 11;
// let yLen = 7;
let time = 100;

function move(t: number, p: number[], v: number[]): number[] {
  let [Px, Py] = p;
  let [Vx, Vy] = v;
  let Pfx = t * Vx + Px;
  let Pfy = t * Vy + Py;
  Pfx = Pfx % xLen;
  Pfy = Pfy % yLen;
  if (Pfx < 0) {
    Pfx += xLen;
  }
  if (Pfy < 0) {
    Pfy += yLen;
  }
  return [Pfx, Pfy];
}

function countQuarterRobots({
  positions,
  xS,
  yS,
  xE,
  yE,
}: {
  positions: number[][];
  xS: number;
  yS: number;
  xE: number;
  yE: number;
}): number {
  let acc = 0;
  for (const position of positions) {
    let [px, py] = position;
    if (px >= xS && px < xE && py < yE && py >= yS) {
      acc++;
    }
  }
  console.log('positions');
  console.log(positions);
  console.log('acc');
  console.log(acc);
  return acc;
}

export async function day14a(dataPath?: string) {
  const data = await readLines(dataPath);
  const robots = parseLines(data);

  let xS1 = 0;
  let yS1 = 0;
  let xE1 = Math.floor(xLen / 2);
  let yE1 = Math.floor(yLen / 2);

  let xS2 = Math.ceil(xLen / 2);
  let yS2 = 0;
  let xE2 = xLen;
  let yE2 = Math.floor(yLen / 2);

  let xS3 = 0;
  let yS3 = Math.ceil(yLen / 2);
  let xE3 = Math.floor(xLen / 2);
  let yE3 = yLen;

  let xS4 = Math.ceil(xLen / 2);
  let yS4 = Math.ceil(yLen / 2);
  let xE4 = xLen;
  let yE4 = yLen;

  // Input: Robots P,V
  let allNewPos: number[][] = [];
  for (const robot of robots) {
    let newPos = move(time, robot.pos, robot.vel);
    allNewPos.push(newPos);
  }
  let Q1 = countQuarterRobots({
    positions: allNewPos,
    xS: xS1,
    yS: yS1,
    xE: xE1,
    yE: yE1,
  });
  let Q2 = countQuarterRobots({
    positions: allNewPos,
    xS: xS2,
    yS: yS2,
    xE: xE2,
    yE: yE2,
  });
  let Q3 = countQuarterRobots({
    positions: allNewPos,
    xS: xS3,
    yS: yS3,
    xE: xE3,
    yE: yE3,
  });
  let Q4 = countQuarterRobots({
    positions: allNewPos,
    xS: xS4,
    yS: yS4,
    xE: xE4,
    yE: yE4,
  });

  console.log('cada Q');
  console.log(Q1, Q2, Q3, Q4);
  let securityFactor = Q1 * Q2 * Q3 * Q4;

  // Output: securityFactor
  return securityFactor;
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
