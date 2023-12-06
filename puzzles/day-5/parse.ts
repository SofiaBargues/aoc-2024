export type MapRange = {
  sourceStart: number;
  destStart: number;
  length: number;
};

export type MapObject = {
  [key: string]: MapRange[];
};

export function parseSeeds(input: string): number[] {
  const seedsLine = input.trim().split(':')[1];
  if (!seedsLine) {
    return [];
  }

  const seedsArray = seedsLine.trim().split(' ').map(Number);
  return seedsArray;
}

export function convertInputToObject(lines: string[]): MapObject {
  // const lines = input.split('\n');
  const result: MapObject = {};

  let currentMap: string = '';

  lines.forEach((line) => {
    const parts = line.trim().split(' ');

    if (parts.length === 2) {
      // This line is a new map identifier
      currentMap = parts[0];
      result[currentMap] = [];
    } else if (parts.length === 3) {
      // This line is a map entry
      const entry: MapRange = {
        destStart: parseInt(parts[0]),
        sourceStart: parseInt(parts[1]),
        length: parseInt(parts[2]),
      };
      result[currentMap].push(entry);
    }
  });

  return result;
}

export const parseLines = (input: string[]): number[][][] => {
  return input
    .filter((line) => !!line)
    .map((line) =>
      line
        .split(': ')[1]
        .split(' | ')
        .map((part) =>
          part
            .trim()
            .split(/\s+/)
            .map((num) => parseInt(num.trim(), 10))
        )
    );

  // .filter((c) => /^(\+|-)?[0-9]+$/.test(c))
  // .map((a) => parseInt(a, 10));
};
