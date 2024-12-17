export const parseLines = (
  lines: string[]
): {
  A: number;
  B: number;
  C: number;
  program: number[];
} => {
  /* E.g.
  Register A: 729
  Register B: 0
  Register C: 0

  Program: 0,1,5,4,3,0
  */
  const A = Number(lines[0].match(/\d+/)?.[0]);
  const B = Number(lines[1].match(/\d+/)?.[0]);
  const C = Number(lines[2].match(/\d+/)?.[0]);
  const program = lines[4].split(': ')[1].split(',').map(Number);
  return { A, B, C, program };
};
