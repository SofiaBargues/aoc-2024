import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

let xLen = 101;
let yLen = 103;
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

export async function day14b(dataPath?: string) {
  const data = await readLines(dataPath);
  const robots = parseLines(data);
  // Input: Robots P,V
  let allNewPos: number[] = [];
  for (const robot of robots) {
    let newPos = move(time, robot.pos, robot.vel);
    allNewPos.push(...newPos);
  }

  console.log(allNewPos);
  // Q1=countQuarterRobots({xs: })
  // Q2=countQuarterRobots(..)
  // Q3=countQuarterRobots(..)``  
  // Q4=countQuarterRobots(..)

  // securityFactor= Q1*Q2*Q3*Q4

  // Output: securityFactor
  return 0;
}

const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
