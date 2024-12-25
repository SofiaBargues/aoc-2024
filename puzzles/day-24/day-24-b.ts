import chalk from 'chalk';
import { readLines } from '../../shared';
import { parseLines } from './parse';

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

// For the graph, outs are ins and ins are outs (reverse graph)
function buildReverseGraph(
  gates: { in1: string; in2: string; gate: string; outWire: string }[]
): Record<string, string[]> {
  const graph: Record<string, string[]> = {};
  for (const gateDef of gates) {
    graph[gateDef.outWire] = [gateDef.in1, gateDef.in2];
  }
  return graph;
}

function getDescendants(graph: Record<string, string[]>, node: string) {
  const leaves = new Set<string>();

  function traverse(currentNode: string) {
    if (!graph[currentNode] || graph[currentNode].length === 0) {
      leaves.add(currentNode);
      return;
    }

    for (const child of graph[currentNode]) {
      traverse(child);
    }
  }

  traverse(node);
  return Array.from(leaves);
}

export async function day24b(dataPath?: string) {
  const data = await readLines(dataPath);
  const { gates: gatesDef, wires: wiresInitialVals } = parseLines(data);

  // Build a graph with the gatesdef

  const graph = buildReverseGraph(gatesDef);
  console.log(
    Object.entries(graph).filter(
      ([node, ins]) =>
        ['x', 'y'].includes(ins[0][0]) || ['x', 'y'].includes(ins[1][0])
    )
  );
  const leaves = getDescendants(graph, 'z00');
  console.log(leaves);

  return 0;
}

const answer = await day24b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
