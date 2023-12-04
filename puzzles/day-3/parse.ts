export const parseLines = (
  input: string[]
): { blue: number; green: number; red: number }[][] => {
  return input.filter((line) => !!line);
};
