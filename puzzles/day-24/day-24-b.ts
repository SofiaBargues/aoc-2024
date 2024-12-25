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

  for (let descendant of nodesDescendants['z00'].filter(
    (node) => !leaveNodes.has(node)
  )) {
    const testGraph = Object.entries(reverseGraph).map(([key, value]) => ({
      key,
      value: value.slice(0, 2),
    }));

    // for x00 = 0 and y00 = 0, z00 = 1
    // for x00 = 1 and y00 = 1, z00 = 0
    // for x00 = 0 and y00 = 1, z00 = 1
    // for x00 = 1 and y00 = 0, z00 = 0
    const valid1 = isCircuitValid(reverseGraph, leaveNodes, 0, 0, 1);
    const valid2 = isCircuitValid(reverseGraph, leaveNodes, 0, 1, 1);
    const valid3 = isCircuitValid(reverseGraph, leaveNodes, 1, 0, 1);
    const valid4 = isCircuitValid(reverseGraph, leaveNodes, 1, 1, 1);

    if (!valid1 || !valid2 || !valid3 || !valid4) {
      console.log('Invalid', valid1, valid2, valid3, valid4);
    } else {
      console.log('Valid');
    }
  }
  console.log(reverseGraph);
  console.log(nodesDescendants['z00']);

  console.log(nodesDescendants['z00'].filter((node) => !leaveNodes.has(node)));

  return 0;
}

const answer = await day24b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
