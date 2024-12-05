export const parseLines = (
  input: string[]
): { relations: number[][]; manuals: number[][] } => {
  let separator = false;
  const relations = [];
  const manuals = [];
  for (const line of input) {
    if (!line) {
      separator = true;
      continue;
    }
    if (!separator) {
      relations.push(line.split('|').map(Number));
    } else {
      manuals.push(line.split(',').map(Number));
    }
  }

  return { relations, manuals };
};
