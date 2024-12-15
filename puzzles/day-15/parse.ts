export const parseLines = (
  lines: string[]
): { grid: string[][]; moves: ('<' | '>' | '^' | 'v')[] } => {
  let indexLine = lines.findIndex((line) => line === '');
  //                                  #..O.O.# string->["#",".",".","O",".","O",".","#]
  let grid = lines.slice(0, indexLine).map((line) => line.split(''));

  let moves = lines
    .slice(indexLine + 1)
    .join('')
    .split('');

  return { grid, moves };
};

export const parseLinesB = (
  lines: string[]
): { grid: string[][]; moves: ('<' | '>' | '^' | 'v')[] } => {
  let indexLine = lines.findIndex((line) => line === '');
  //                                  #..O.O.# string->["#",".",".","O",".","O",".","#]
  let grid = lines.slice(0, indexLine).map((line) =>
    line
      .split('')
      .map((c) => {
        if (c === '.' || c === '#') {
          return [c, c];
        }
        if (c === '@') {
          return [c, '.'];
        }
        // O
        return ['[', ']'];
      })
      .flat()
  );

  let moves = lines
    .slice(indexLine + 1)
    .join('')
    .split('');

  return { grid, moves };
};
