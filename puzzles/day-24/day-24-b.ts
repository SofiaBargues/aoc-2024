import chalk from 'chalk';
import { readLines } from '../../shared';
import { parseLines } from './parse';

function solveGate(in1Val: number, in2Val: number, gate: string): number {
  if (gate === 'OR') {
    return in1Val || in2Val;
  } else if (gate === 'AND') {
    return in1Val && in2Val;
  } else if (gate === 'XOR') {
    return in1Val !== in2Val ? 1 : 0;
  }
  throw Error('Invalid op');
}

function testSummationCircuit(
  testGraph: { [x: string]: string[] },
  leaveNodes: Set<string>,
  bits: number
) {
  // Get some values for x and y to to validate different sums that are representable by the number of bits in the output
  const testValuePairs = [];
  const max = 2 ** bits;
  for (let i = 0; i < max; i++) {
    for (let j = 0; j < max; j++) {
      testValuePairs.push([i, j]);
    }
  }

  // TODO: This needs to be done with a max num of random samples after some bits

  for (const [x, y] of testValuePairs) {
    const isValid = isCircuitValid(testGraph, leaveNodes, x, y, bits);
    if (!isValid) {
      return false;
    }
  }

  return true;
}

function isCircuitValid(
  graph: Record<string, string[]>,
  leaveNodes: Set<string>,
  xVal: number,
  yVal: number,
  digits: number
): boolean {
  const memo = new Map<string, number>();
  // build x wires
  const wires: Record<string, number> = {};
  const xBinary = xVal.toString(2).padStart(digits, '0');
  // x00 is the least significant bit. always 2 diigts come after x
  for (let i = 0; i < digits; i++) {
    const key = `x${i > 9 ? i : '0' + i}`;
    wires[key] = parseInt(xBinary[xBinary.length - 1 - i]);
  }

  const yBinary = yVal.toString(2).padStart(digits, '0');
  for (let i = 0; i < digits; i++) {
    const key = `y${i > 9 ? i : '0' + i}`;
    wires[key] = parseInt(yBinary[yBinary.length - 1 - i]);
  }

  const expectedZVal = xVal + yVal;
  const expectedBinary = expectedZVal.toString(2).padStart(digits, '0');
  // Build all z nodes by solving them
  for (let i = 0; i < digits; i++) {
    const key = `z${i > 9 ? i : '0' + i}`;
    const zDigitVal = solveNodeInternal(graph, leaveNodes, wires, memo, key);
    if (zDigitVal !== parseInt(expectedBinary[expectedBinary.length - 1 - i])) {
      return false;
    }
  }

  return true;
}

function solveNodeInternal(
  graph: Record<string, string[]>,
  leaveNodes: Set<string>,
  wires: Record<string, number>,
  memo: Map<string, number>,
  wire: string
): number {
  if (leaveNodes.has(wire)) {
    return wires[wire];
  }

  if (memo.has(wire)) {
    return memo.get(wire)!;
  }

  const [in1, in2, gate] = graph[wire];
  const in1Val = solveNodeInternal(graph, leaveNodes, wires, memo, in1);
  const in2Val = solveNodeInternal(graph, leaveNodes, wires, memo, in2);
  const result = solveGate(in1Val, in2Val, gate);
  memo.set(wire, result);
  return result;
}

// For the graph, outs are ins and ins are outs (reverse graph)
function buildReverseGraph(
  gates: { in1: string; in2: string; gate: string; outWire: string }[]
): Record<string, string[]> {
  const graph: Record<string, string[]> = {};
  for (const gateDef of gates) {
    graph[gateDef.outWire] = [gateDef.in1, gateDef.in2, gateDef.gate];
  }
  return graph;
}

function hasCycles(
  graph: Record<string, string[]>,
  leaveNodes: Set<string>,
  node: string
) {
  const visited = new Set<string>();
  const stack = [node];
  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    if (visited.has(currentNode)) {
      return true;
    }
    if (leaveNodes.has(currentNode)) {
      continue;
    }
    visited.add(currentNode);
    const [in1, in2, gate] = graph[currentNode];
    stack.push(in1);
    stack.push(in2);
  }
  return false;
}

function getDescendants(graph: Record<string, string[]>, node: string) {
  const descendants = new Set<string>();

  function traverse(currentNode: string) {
    if (!graph[currentNode] || graph[currentNode].length === 0) {
      return;
    }

    const [in1, in2, gate] = graph[currentNode];
    descendants.add(in1);
    descendants.add(in2);
    traverse(in1);
    traverse(in2);
  }

  traverse(node);
  return Array.from(descendants);
}

export async function day24b(dataPath?: string) {
  const data = await readLines(dataPath);
  const { gates: gatesDef, wires: wiresInitialVals } = parseLines(data);

  const reverseGraph = buildReverseGraph(gatesDef);

  const nodes = Object.keys(reverseGraph);
  const rootNodes = new Set(nodes.filter((node) => 'z' === node[0]));
  const leaveNodes = new Set(
    Array.from(rootNodes)
      .map((node) => ['x' + node.slice(1), 'y' + node.slice(1)])
      .flat()
  );

  const n = rootNodes.size;

  const nodesDescendants = Object.fromEntries(
    nodes.map((node) => [node, getDescendants(reverseGraph, node)])
  );
  // start fixing for n 0

  // Build graph (non-reverse)
  // To verify we need to traverse and solve

  const valid1 = isCircuitValid(reverseGraph, leaveNodes, 0, 0, 1);
  const valid2 = isCircuitValid(reverseGraph, leaveNodes, 0, 1, 1);
  const valid3 = isCircuitValid(reverseGraph, leaveNodes, 1, 0, 1);
  const valid4 = isCircuitValid(reverseGraph, leaveNodes, 1, 1, 1);
  if (valid1 && valid2 && valid3 && valid4) {
    // Should continue down this path if valid right away
    console.log('Valid swap', 0, 0);
  } else {
    console.log('Invalid swap', 0, 0);
  }

  // Explore paths after swap if backtracking was needed
  const validSwaps = [];
  for (let descendant of nodesDescendants['z00']
    .filter((node) => !leaveNodes.has(node))
    .concat(['z00'])) {
    const candidates = Object.entries(nodesDescendants)
      .filter(([node, descendants]) =>
        descendants.some(
          (descendant) => descendant === 'x00' || descendant === 'y00'
        )
      )
      .map(([node, _]) => node)
      .filter((node) => !leaveNodes.has(node));

    for (const candidate of candidates) {
      // Create a copy of the graph for testing
      const testGraph = { ...reverseGraph };

      // Swap the nodes
      const tempValue = testGraph[descendant];
      testGraph[descendant] = testGraph[candidate];
      testGraph[candidate] = tempValue;

      if (candidate === descendant) {
        continue;
      }

      // Verify that no cycle is created for swapped nodes
      if (
        hasCycles(testGraph, leaveNodes, descendant) ||
        hasCycles(testGraph, leaveNodes, candidate)
      ) {
        continue;
      }
      // Test all input combinations
      const bits = 1;
      const isValid = testSummationCircuit(testGraph, leaveNodes, bits);
      if (isValid) {
        validSwaps.push({ descendant, candidate });
      } else {
        console.log('Invalid swap', descendant, candidate);
      }
    }
  }
  console.log('Valid swaps:', validSwaps);

  return 0;
}

const answer = await day24b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
