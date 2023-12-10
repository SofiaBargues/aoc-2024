export type Node = {
  L: string;
  R: string;
};

type DesertMap = Record<string, Node>;

export const parseLines = (input: string[]): DesertMap => {
  input = input.filter((line) => !!line);
  const desertMap: DesertMap = {};
  input.forEach((line, i) => {
    const name = line.split(' = ')[0];
    const [left, right] = line
      .split(' = ')[1]
      .replace('(', '')
      .replace(')', '')
      .split(', ');
    desertMap[name] = {
      L: left,
      R: right,
    };
  });
  return desertMap;
};
