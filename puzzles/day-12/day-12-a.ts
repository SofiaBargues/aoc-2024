import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { Conditions, Groups, parseLines } from './parse.ts';

function getAllPlacements(conditions: Conditions, groupLength: number) {
  const placements: number[] = [];
  for (let i = 0; i <= conditions.length - groupLength; i++) {
    const isLeftValid = i - 1 < 0 || conditions[i - 1] != '#';
    const isRightValid =
      i + groupLength > conditions.length - 1 ||
      conditions[i + groupLength] != '#';
    const areGroupSpringsValid = conditions
      .slice(i, i + groupLength)
      .every((condition) => condition == '#' || condition == '?');

    const noBrokenBeforeIt = conditions
      .slice(0, i)
      .every((condition) => condition != '#');

    const isValid =
      isLeftValid && isRightValid && areGroupSpringsValid && noBrokenBeforeIt;
    if (isValid) {
      placements.push(i);
    }
  }
  return placements;
}

function getArrangementCounts(conditions: Conditions, groups: Groups): number {
  const firstBrokenGroupLength = groups[0];

  const firstGroupPlacements = getAllPlacements(
    conditions,
    firstBrokenGroupLength
  );
  // console.log({ conditions, firstBrokenGroupLength, firstGroupPlacements });

  const nextGroupCount = firstGroupPlacements
    .map((groupStart) => {
      const firstGroupEnd = groupStart + firstBrokenGroupLength;
      const nextGroups = groups.slice(1);
      const conditionsSubarray = conditions.slice(firstGroupEnd + 1);

      if (nextGroups.length == 0) {
        const noBrokenAfterIt =
          !conditionsSubarray ||
          conditions
            .slice(firstGroupEnd)
            .every((condition) => condition != '#');
        if (noBrokenAfterIt) {
          return 1;
        } else {
          return 0;
        }
      }

      const nextGroupsCount = getArrangementCounts(
        conditionsSubarray,
        nextGroups
      );

      return nextGroupsCount;
    })
    .reduce((acc, curr) => acc + curr, 0);
  return nextGroupCount;
}

export async function day12a(dataPath?: string) {
  const data = await readLines(dataPath);
  let springRecords = parseLines(data);
  // console.log(orderData);
  const springRecordsArrangements = springRecords
    .map((record) =>
      getArrangementCounts(record.conditions, record.brokenGroups)
    )
    .reduce((acc, curr) => acc + curr, 0);
  return springRecordsArrangements;
}

const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
