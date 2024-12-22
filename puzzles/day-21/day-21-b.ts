import chalk from 'chalk';
import { readLines } from '../../shared.ts';

// Grid mappings
const numsKeypadPosToKey: Record<string, string> = {
  '0,0': '7',
  '0,1': '8',
  '0,2': '9',
  '1,0': '4',
  '1,1': '5',
  '1,2': '6',
  '2,0': '1',
  '2,1': '2',
  '2,2': '3',
  '3,1': '0',
  '3,2': 'A',
};

const numsKeypadKeyToPos: Record<string, [number, number]> = {};
for (const [key, value] of Object.entries(numsKeypadPosToKey)) {
  const [x, y] = key.split(',').map(Number);
  numsKeypadKeyToPos[value] = [x, y];
}

const dirsKeypadPosToKey: Record<string, string> = {
  '0,1': '^',
  '0,2': 'A',
  '1,0': '<',
  '1,1': 'v',
  '1,2': '>',
};

const dirsKeypadKeyToPos: Record<string, [number, number]> = {};
for (const [key, value] of Object.entries(dirsKeypadPosToKey)) {
  const [x, y] = key.split(',').map(Number);
  dirsKeypadKeyToPos[value] = [x, y];
}

function sign(n: number): number {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}

function getPaths(
  sx: number,
  sy: number,
  ex: number,
  ey: number,
  padType: 'nums' | 'dirs'
): string[] {
  const dx = sign(ex - sx);
  const dy = sign(ey - sy);
  const xcount = dx !== 0 ? Math.round((ex - sx) / dx) : 0;
  const ycount = dy !== 0 ? Math.round((ey - sy) / dy) : 0;
  const xvar = dx === 1 ? 'v' : '^';
  const yvar = dy === 1 ? '>' : '<';

  if (padType === 'nums') {
    const bad1 = ['0,0', '1,0', '2,0'];
    const bad2 = ['3,1', '3,2'];
    const skey = `${sx},${sy}`;
    const ekey = `${ex},${ey}`;

    if (bad1.includes(skey) && bad2.includes(ekey)) {
      return [yvar.repeat(ycount) + xvar.repeat(xcount)];
    } else if (bad2.includes(skey) && bad1.includes(ekey)) {
      return [xvar.repeat(xcount) + yvar.repeat(ycount)];
    }
    return [
      yvar.repeat(ycount) + xvar.repeat(xcount),
      xvar.repeat(xcount) + yvar.repeat(ycount),
    ];
  } else {
    const bad1 = ['1,0'];
    const bad2 = ['0,1', '0,2'];
    const skey = `${sx},${sy}`;
    const ekey = `${ex},${ey}`;

    if (bad1.includes(skey) && bad2.includes(ekey)) {
      return [yvar.repeat(ycount) + xvar.repeat(xcount)];
    } else if (bad2.includes(skey) && bad1.includes(ekey)) {
      return [xvar.repeat(xcount) + yvar.repeat(ycount)];
    }
    return [
      yvar.repeat(ycount) + xvar.repeat(xcount),
      xvar.repeat(xcount) + yvar.repeat(ycount),
    ];
  }
}

const cache = new Map<string, number>();

function solve(seq: string, n: number, maxn: number): number {
  if (n === 0) return seq.length;

  const key = `${seq},${n},${maxn}`;
  if (cache.has(key)) return cache.get(key)!;

  let cur = 'A';
  const keyToPos = n === maxn ? numsKeypadKeyToPos : dirsKeypadKeyToPos;
  const padType = n === maxn ? 'nums' : 'dirs';

  let count = 0;
  for (const des of seq + (n !== maxn ? 'A' : '')) {
    let bestway: number | null = null;
    for (const way of getPaths(...keyToPos[cur], ...keyToPos[des], padType)) {
      const result = solve(way, n - 1, maxn);
      if (bestway === null || result < bestway) {
        bestway = result;
      }
    }
    count += bestway!;
    if (n === 1) count += 1;
    cur = des;
  }

  cache.set(key, count);
  return count;
}

export async function day21b(dataPath?: string) {
  const codes = await readLines(dataPath);
  let total = 0;

  for (const code of codes) {
    cache.clear();
    const sval = solve(code, 26, 26);
    total += parseInt(code.slice(0, -1)) * sval;
  }

  return total;
}

const answer = await day21b();
console.log(
  chalk.bgGreen('Your Answer:'),
  chalk.green(answer.toLocaleString('fullwide', { useGrouping: false }))
);
