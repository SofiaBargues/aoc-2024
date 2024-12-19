import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day19a(dataPath?: string) {
  const data = await readLines(dataPath);
  const { towels: towelsInput, designs } = parseLines(data);

  // Inputs:
  //towelsInput: string[];
  // designs: string[];

  const towels = new Set(towelsInput);

  const largestTowelSize = Math.max(...towelsInput.map((x) => x.length));

  function dfs(target: string) {
    if (target.length == 0) {
      return true;
    }
        // recursion
    let maxWordLen = Math.min(largestTowelSize, target.length);
    for (let l = 1; l <= maxWordLen; l++) {
      let subStr = target.slice(0, l);
      if (towels.has(subStr)) {
        if (dfs(target.slice(l))) {
          return true;
        }
      }
    }
    return false;
  }
  console.log(towels);

  return designs.filter((design) => dfs(design)).length;
}

const answer = await day19a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
