import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { buildRules, getMiddleNumber, isManualValid } from './day-5-a.ts';
import { parseLines } from './parse.ts';

export async function day5b(dataPath?: string) {
  const data = await readLines(dataPath);
  const { relations, manuals } = parseLines(data);

  const toTheRightOf = buildRules(relations);

  const incorrect = manuals.filter(
    (manual) => !isManualValid(manual, toTheRightOf)
  );
  const sortedManuals = incorrect.map((manual) => {
    manual.sort((a, b) =>
      toTheRightOf[a] && toTheRightOf[a].includes(b) ? -1 : 0
    );
    return manual;
  });
  const mids = sortedManuals.map((manual) => getMiddleNumber(manual));
  return mids.reduce((acc, el) => acc + el, 0);
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
