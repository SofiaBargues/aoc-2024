export const parseLines = (lines: string[]): string[][][] => {
  let gridsArr = [];
  let n = lines.length;

  for (let i = 0; i <= n - 1; i += 8) {
    let end = i + 7;
    gridsArr.push(lines.slice(i, end).map((line) => line.split('')));
  }
  return gridsArr;
};
