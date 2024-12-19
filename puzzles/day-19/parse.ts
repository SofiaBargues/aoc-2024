export const parseLines = (
  lines: string[]
): { towels: string[]; designs: string[] } => {
  const towels = lines[0].split(', ');
  const designs = lines.slice(2);
  return {
    towels,
    designs,
  };
};
