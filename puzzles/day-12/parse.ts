export type Conditions = string[];

export type Groups = number[];

export type SpringRecord = {
  conditions: Conditions;
  brokenGroups: Groups;
};

export const parseLines = (lines: string[]): SpringRecord[] => {
  lines = lines.filter((line) => !!line);

  return lines.map((line) => {
    const [firstPart, secondPart] = line.split(' ');
    return {
      conditions: firstPart.split(''),
      brokenGroups: secondPart
        .split(',')
        .map((element) => parseInt(element, 10)),
    };
  });
};
