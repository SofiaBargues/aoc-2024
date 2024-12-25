import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function solve(in1Val: number, in2Val: number, gate: string): number {
  if (gate === 'OR') {
    return in1Val || in2Val;
  } else if (gate === 'AND') {
    return in1Val && in2Val;
  } else if (gate === 'XOR') {
    return in1Val !== in2Val ? 1 : 0;
  }
  throw Error('Invalid op');
}

export async function day24b(dataPath?: string) {
  const data = await readLines(dataPath);
  const { gates: gatesDef, wires } = parseLines(data);

  let gates = gatesDef;
  const solved = wires;
  // solve circuit
  while (gates.length > 0) {
    const newGates = [];
    for (const gateDef of gates) {
      const { in1, in2, gate, outWire } = gateDef;
      if (in1 in solved && in2 in solved) {
        const outVal = solve(solved[in1], solved[in2], gate);
        solved[outWire] = outVal;
      } else {
        newGates.push(gateDef);
      }import chalk from 'chalk';
      import { readLines } from '../../shared.ts';
      import { parseLines } from './parse.ts';
      
      function solve(in1Val: number, in2Val: number, gate: string): number {
        if (gate === 'OR') {
          return in1Val || in2Val;
        } else if (gate === 'AND') {
          return in1Val && in2Val;
        } else if (gate === 'XOR') {
          return in1Val !== in2Val ? 1 : 0;
        }
        throw Error('Invalid op');
      }
      
      export async function day24a(dataPath?: string) {
        const data = await readLines(dataPath);
        const { gates: gatesDef, wires } = parseLines(data);
      
        let gates = gatesDef;
        const solved = wires;
        // solve circuit
        while (gates.length > 0) {
          const newGates = [];
          for (const gateDef of gates) {
            const { in1, in2, gate, outWire } = gateDef;
            if (in1 in solved && in2 in solved) {
              const outVal = solve(solved[in1], solved[in2], gate);
              solved[outWire] = outVal;
            } else {
              newGates.push(gateDef);
            }
          }
          gates = newGates;
        }
        // get number
        const zSolved = Object.entries(solved).filter((pair) => pair[0][0] === 'z');
        const binary = zSolved
          .sort()
          .map((pair) => String(pair[1]))
          .reverse()
          .join('');
        return parseInt(binary, 2);
      }
      
      const answer = await day24a();
      console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
      
    gates = newGates;
  }
  // get number
  const zSolved = Object.entries(solved).filter((pair) => pair[0][0] === 'z');
  const binary = zSolved
    .sort()
    .map((pair) => String(pair[1]))
    .reverse()
    .join('');
  return parseInt(binary, 2);
}

const answer = await day24b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
