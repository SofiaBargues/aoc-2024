export const parseLines = (input: string[]) => {
  return input.map((line) => line.split(' ').map(Number));
};
