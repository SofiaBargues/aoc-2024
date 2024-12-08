export const parseLines = (input: string[]): string[][] => {
  input = input.filter((line) => !!line);
  return input.map((line) => line.split(''));
};
