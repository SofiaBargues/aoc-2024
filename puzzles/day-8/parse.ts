export type Race = {
  time: number;
  distance: number;
};

export const parseLines = (input: string[]): Race[] => {
  input = input.filter((line) => !!line);
  const times = input[0]
    .split(':')[1]
    .trim()
    .split(/\s+/)
    .map((time) => parseInt(time, 10));
  const distances = input[1]
    .split(':')[1]
    .trim()
    .split(/\s+/)
    .map((time) => parseInt(time, 10));
  return times.map<Race>((time, i) => {
    return {
      time,
      distance: distances[i],
    };
  });
  // .filter((c) => /^(\+|-)?[0-9]+$/.test(c))
  // .map((a) => parseInt(a, 10));
};
