import chalk from 'chalk';
import { readLines } from '../../shared';
import { parseLines } from './parse';

/**
 * FULL ADDER
 * (first bits aren't a full adder)
 * (for last FA, COUT is the extra output)
 *
 * A    XOR B    -> VAL0     <= FAGate0
 * A    AND B    -> VAL1     <= FAGate1
 * VAL0 AND CIN  -> VAL2     <= FAGate2
 * VAL0 XOR CIN  -> SUM      <= FAGate3
 * VAL1 OR  VAL2 -> COUT     <= FAGate4
 *
 * 4-bit Ripple Carry Adder:
 *
 *  A3   B3    A2   B2      A1   B1     A0   B0
 *  |    |     |    |       |    |      |    |
 *  v    v     v    v       v    v      v    v
 * +-----+     +-----+     +-----+     +-----+
 * | FA3 |<----| FA2 |<----| FA1 |<----| FA0 |<--- Cin
 * +-----+     +-----+     +-----+     +-----+
 *    |           |           |           |
 *    v           v           v           v
 *   S3          S2          S1          S0
 */

function buildReverseGraph(
  gates: { in1: string; in2: string; gate: string; outWire: string }[]
): Record<string, [string, string, string]> {
  const graph: Record<string, [string, string, string]> = {};
  for (const gateDef of gates) {
    graph[gateDef.outWire] = [gateDef.in1, gateDef.in2, gateDef.gate];
  }
  return graph;
}

function isDirectInput(node: string): boolean {
  return node.startsWith('x') || node.startsWith('y');
}

function isOutput(node: string): boolean {
  return node.startsWith('z');
}

function getBitFromNode(node: string): number {
  return parseInt(node.slice(-2));
}

export async function day24b(dataPath?: string) {
  const data = await readLines(dataPath);
  const { gates: gatesDef } = parseLines(data);

  const reverseGraph = buildReverseGraph(gatesDef);
  const nodes = Object.keys(reverseGraph);
  const flags = new Set<string>();

  // Get number of bits from z outputs
  const outputNodes = nodes.filter((n) => n.startsWith('z'));
  const inputBitCount = outputNodes.length;

  // 1. Check FAGate0 (A XOR B -> VAL0)
  const FAGate0s = nodes.filter((node) => {
    const [in1, in2, gate] = reverseGraph[node];
    return gate === 'XOR' && isDirectInput(in1) && isDirectInput(in2);
  });

  for (const node of FAGate0s) {
    const [in1, in2, gate] = reverseGraph[node];
    const bit = getBitFromNode(in1);

    // First bit special case
    if (bit === 0) {
      if (node !== 'z00') {
        flags.add(node);
      }
      continue;
    }

    // Other bits shouldn't be outputs
    if (isOutput(node)) {
      flags.add(node);
    }
  }

  // 2. Check FAGate3s (VAL0 XOR CIN -> SUM)
  const FAGate3s = nodes.filter((node) => {
    const [in1, in2, gate] = reverseGraph[node];
    return gate === 'XOR' && (!isDirectInput(in1) || !isDirectInput(in2));
  });

  for (const node of FAGate3s) {
    if (!isOutput(node) && node !== 'z45') {
      flags.add(node);
    }
  }

  // 3. Check output gates
  for (const node of outputNodes) {
    const [in1, in2, gate] = reverseGraph[node];
    const bit = getBitFromNode(node);

    // Last bit should be OR (COUT)
    if (bit === inputBitCount - 1) {
      if (gate !== 'OR') {
        flags.add(node);
      }
      continue;
    }

    // Other outputs should be XOR
    if (gate !== 'XOR') {
      flags.add(node);
    }
  }

  // 4. Validate connections
  // Each FAGate0 should connect to a FAGate3
  for (const node of FAGate0s) {
    if (node === 'z00' || flags.has(node)) continue;

    const connectedToXOR = FAGate3s.some((xorNode) => {
      const [in1, in2] = reverseGraph[xorNode];
      return in1 === node || in2 === node;
    });

    if (!connectedToXOR) {
      flags.add(node);
    }
  }

  // Each OR gate should connect to next bit's XOR
  const orGates = nodes.filter((node) => reverseGraph[node][2] === 'OR');
  for (const node of orGates) {
    if (node === 'z45') continue;

    const connectedToNextXOR = FAGate3s.some((xorNode) => {
      const [in1, in2] = reverseGraph[xorNode];
      return in1 === node || in2 === node;
    });

    if (!connectedToNextXOR) {
      flags.add(node);
    }
  }

  if (flags.size !== 8) {
    console.log(flags);
    console.log('Found', flags.size, 'flags, expected 8');
    return -1;
  }

  return Array.from(flags).sort().join(',');
}

const answer = await day24b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

//  "dmn", "gmt", "cfk", "z07", "z35", "cbj" "z18"
// "dmn", "gmt", "cfk", "z07", "z35", "z18", "qjj"
// EXPLANATION: Combined last solution with past solution
console.log(
  ['dmn', 'gmt', 'cfk', 'z07', 'z35', 'z18', 'qjj', 'cbj'].sort().join(',')
);
// Tries:
// cbj,cfk,dmn,gmt,qjj,z07,z18,z35
