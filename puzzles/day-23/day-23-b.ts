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

export async function day23b(dataPath?: string) {
  const data = await readLines(dataPath);
  const edgesInput = parseLines(data);
  let edgesMap: Record<string, Set<string>> = buildEdgesMap(edgesInput);

  // find all trios
  const trios = [];
  for (const [node, neighbors] of Object.entries(edgesMap)) {
    for (const nei of neighbors.keys()) {
      // console.log('node', node, 'nei', nei);
      neighbors.delete(nei);

      const otherNeighbors = edgesMap[nei];
      otherNeighbors.delete(node);

      const matches = neighbors.intersection(otherNeighbors);
      // console.log('matches', matches);
      for (const match of matches.keys()) {
        trios.push([node, nei, match]);

        const matchNei = edgesMap[match];
        // matchNei.delete(node);
        // matchNei.delete(nei);
      }
    }
  }

  // rebuild edgesmap for part 2
  edgesMap = buildEdgesMap(edgesInput);
  const tuples = trios.map((trio) => new Set(trio));
  let hasChanged = true;
  while (hasChanged) {
    hasChanged = false;
    for (const [node, neighbors] of Object.entries(edgesMap)) {
      for (const tuple of tuples) {
        if (neighbors.isSupersetOf(tuple)) {
          tuple.add(node);
          hasChanged = true;
        }
      }
    }
  }
  const maxGroup = tuples.reduce((max, tuple) =>
    tuple.size > max.size ? tuple : max
  );
  return new Array(...maxGroup.keys()).sort().join(',');
}

const answer = await day23b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

// af, ey, kf, ku, lt, lu, ml, nj, pb, qj, ru, ud, xp;
// ac, cr, ei, fd, fm, gx, hi, nz, px, qk, sl, tg, un;
// ag,bt,cq,da,hp,hs,mi,pa,qd,qe,qi,ri,uq
