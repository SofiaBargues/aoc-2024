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
