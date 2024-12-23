import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

function buildEdgesMap(edges: [string, string][]) {
  const edgesMap: Record<string, Set<string>> = {};
  //            wq,  tb
  for (const [node1, node2] of edges) {
    // Initialize sets if needed
    if (!(node1 in edgesMap)) {
      edgesMap[node1] = new Set();
    }
    if (!(node2 in edgesMap)) {
      edgesMap[node2] = new Set();
    }
    /*
    {
      wq: set{}
      tb: set{}
    }
    */
    edgesMap[node1].add(node2);
    edgesMap[node2].add(node1);
    /*
    {
      wq: set{tb}
      tb: set{wq}
    }
    */
  }
  return edgesMap;
}

export async function day23a(dataPath?: string) {
  const data = await readLines(dataPath);
  const edgesInput = parseLines(data);
  const edgesMap: Record<string, Set<string>> = buildEdgesMap(edgesInput);

  // find all trios
  const trios = [];
  for (const [node, neighbors] of Object.entries(edgesMap)) {
    console.log(node, neighbors);
    for (const nei of neighbors.keys()) {
      console.log('node', node, 'nei', nei);
      neighbors.delete(nei);

      const otherNeighbors = edgesMap[nei];
      otherNeighbors.delete(node);

      const matches = neighbors.intersection(otherNeighbors);
      console.log('matches', matches);
      for (const match of matches.keys()) {
        trios.push([node, nei, match]);

        const matchNei = edgesMap[match];
        matchNei.delete(node);
        matchNei.delete(nei);
      }
    }
  }
  console.log(trios);

  return trios.length;
}

const answer = await day23a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
