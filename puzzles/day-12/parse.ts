

export const parseLines = (lines: string[]): string[][] => {
  lines = lines.filter((line) => !!line);

return lines.map((line)=>line.split("")) 
}