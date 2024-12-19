import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day19b(dataPath?: string) {
  const data = await readLines(dataPath);
  const { towels: towelsInput, designs } = parseLines(data);

  // Inputs:
  //towelsInput: string[];
  // designs: string[];

  const towels = new Set(towelsInput);

  const largestTowelSize = Math.max(...towelsInput.map((x) => x.length));

  const memo: Record<string, number> = {};

  function dfs(target: string): number {
    if (target.length == 0) {
      return 1;
    }
    if (target in memo) {
      return memo[target];
    }

    // recursion
    let maxWordLen = Math.min(largestTowelSize, target.length);
    let count = 0;
    for (let l = 1; l <= maxWordLen; l++) {
      let subStr = target.slice(0, l);
      if (towels.has(subStr)) {
        count += dfs(target.slice(l));
      }
    }
    memo[target] = count;
    return count;
  }

  return designs
    .map((design, i) => {
      console.log('Design ' + i + ' of ' + designs.length);
      return dfs(design);
    })
    .reduce((acc, x) => acc + x, 0);
}

const answer = await day19b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
