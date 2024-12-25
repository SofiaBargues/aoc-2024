import { readLines } from '../../shared';
import { parseLines } from './parse';

function swapNodes(
  testGraph: { [x: string]: string[] },
  descendant: string,
  candidate: string
) {
  const tempValue = testGraph[descendant];
  testGraph[descendant] = testGraph[candidate];
  testGraph[candidate] = tempValue;
}

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
  const testValuePairs = [];
  const max = 2 ** (bits - 1);

  // Use full set for small bit counts
  if (bits <= 3) {
    for (let i = 0; i < max; i++) {
      for (let j = 0; j < max; j++) {
        testValuePairs.push([i, j]);
      }
    }
  } else {
    // Random sampling for larger bit counts
    const sampleSize = 100;
    for (let i = 0; i < sampleSize; i++) {
      const x = Math.floor(Math.random() * max);
      const y = Math.floor(Math.random() * max);
      testValuePairs.push([x, y]);
    }
  }

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

function findValidSwapsRecursive(
  graph: Record<string, string[]>,
  leaveNodes: Set<string>,
  currentBit: number,
  maxBits: number,
  swappedNodes: Set<string> = new Set(),
  okNodes: Set<string> = new Set()
): string[] | null {
  // Base case: if we've used more than 8 nodes in swaps, this path is invalid
  if (swappedNodes.size > 8) {
    return null;
  }

  console.log('Bit:', currentBit, 'Swapped:', swappedNodes.size);
  // Base case: if we've reached maxBits, we've found a valid solution
  if (currentBit === maxBits) {
    return swappedNodes.size === 8 ? Array.from(swappedNodes) : null;
  }

  // Test current graph for this bit
  if (testSummationCircuit(graph, leaveNodes, currentBit + 1)) {
    const currentZ = `z${currentBit
      .toString()
      .padStart(2, String(currentBit))}`;
    const descendants = getDescendants(graph, currentZ);
    const oldOkNodes = new Set(okNodes);
    for (const descendant of descendants) {
      okNodes.add(descendant);
    }

    const result = findValidSwapsRecursive(
      graph,
      leaveNodes,
      currentBit + 1,
      maxBits,
      swappedNodes,
      okNodes
    );

    okNodes = oldOkNodes;

    if (result) return result;
  }

  // Current graph invalid, try swaps
  const currentZ = `z${currentBit.toString().padStart(2, String(currentBit))}`;
  const currBitTreeNodes = getDescendants(graph, currentZ)
    .concat([currentZ])
    .filter((node) => !leaveNodes.has(node) && !swappedNodes.has(node));

  const candidates = Object.keys(graph).filter((node) => {
    if (leaveNodes.has(node) || swappedNodes.has(node)) return false;
    if (okNodes.has(node)) return false;

    const descendants = getDescendants(graph, node);
    return descendants.some(
      (d) =>
        d === `x${currentBit.toString().padStart(2, String(currentBit))}` ||
        d === `y${currentBit.toString().padStart(2, String(currentBit))}` ||
        d === `y${currentBit.toString().padStart(2, String(currentBit - 1))}` ||
        d === `y${currentBit.toString().padStart(2, String(currentBit - 1))}`
    );
  });

  for (const descendant of currBitTreeNodes) {
    if (swappedNodes.has(descendant)) continue;
    for (const candidate of candidates) {
      if (candidate === descendant || swappedNodes.has(candidate)) continue;

      // Create a copy of the graph for testing
      const testGraph = structuredClone(graph);
      swapNodes(testGraph, descendant, candidate);

      // Check for cycles
      if (
        hasCycles(testGraph, leaveNodes, descendant) ||
        hasCycles(testGraph, leaveNodes, candidate)
      ) {
        continue;
      }

      // Test if valid for current bit
      if (!testSummationCircuit(testGraph, leaveNodes, currentBit + 1)) {
        continue;
      }
      console.log('Swapping', descendant, candidate);

      // Track swapped nodes
      swappedNodes.add(descendant);
      swappedNodes.add(candidate);

      // Try recursing with this swap
      const descendants = getDescendants(graph, currentZ);
      const oldOkNodes = new Set(okNodes);
      for (const descendant of descendants) {
        okNodes.add(descendant);
      }

      const result = findValidSwapsRecursive(
        testGraph,
        leaveNodes,
        currentBit + 1,
        maxBits,
        swappedNodes
      );

      okNodes = oldOkNodes;

      // Restore the swap
      swappedNodes.delete(descendant);
      swappedNodes.delete(candidate);

      if (result) return result;
    }
  }

  return null;
}

export async function day24b(dataPath?: string) {
  const data = await readLines(dataPath);
  const { gates: gatesDef } = parseLines(data);

  const reverseGraph = buildReverseGraph(gatesDef);
  const nodes = Object.keys(reverseGraph);
  const rootNodes = new Set(nodes.filter((node) => 'z' === node[0]));
  const leaveNodes = new Set(
    Array.from(rootNodes)
      .map((node) => ['x' + node.slice(1), 'y' + node.slice(1)])
      .flat()
  );

  const maxBits = rootNodes.size;
  const validSwaps = findValidSwapsRecursive(
    reverseGraph,
    leaveNodes,
    0,
    maxBits
  );

  if (validSwaps) {
    console.log('Found valid solution with swaps:', validSwaps);
    return validSwaps.length;
  }

  console.log('No valid solution found');
  return 0;
}

const answer = await day24b();
