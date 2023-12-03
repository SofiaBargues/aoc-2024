export const parseLines = (
  input: string[]
): { blue: number; green: number; red: number }[][] => {
  return input
    .filter((line) => !!line)
    .map(
      (game) =>
        game
          .split(':')[1]
          .trim()
          .split(';')
          .map((handfull) =>
            handfull
              .split(',')
              .map((cube) => cube.trim().split(' '))
              .reduce(
                (hand, numColor) => {
                  hand[numColor[1]] = Number(numColor[0]);
                  return hand;
                },
                { blue: 0, green: 0, red: 0 }
              )
          )
      // .split(',')
      // .filter((c) => /^(\+|-)?[0-9]+$/.test(c))
      // .map((a) => parseInt(a, 10))
    );
};
