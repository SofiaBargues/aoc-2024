export type Machine = number[][];
export const parseLines = (lines: string[]) => {
  const machines: Machine[] = [];
  let currentMachine: number[][] = [];

  for (const line of lines) {
    // Match Button A, Button B, and Prize lines using regex
    const buttonMatch = line.match(/Button [AB]: X\+([0-9]+), Y\+([0-9]+)/);
    const prizeMatch = line.match(/Prize: X=([0-9]+), Y=([0-9]+)/);

    if (buttonMatch) {
      // Extract X and Y values and add them to the current machine
      const x = parseInt(buttonMatch[1], 10);
      const y = parseInt(buttonMatch[2], 10);
      currentMachine.push([x, y]);
    } else if (prizeMatch) {
      // Extract X and Y values and add them to the current machine
      const x = parseInt(prizeMatch[1], 10);
      const y = parseInt(prizeMatch[2], 10);
      currentMachine.push([x, y]);

      // Push the completed machine to the machines array
      machines.push(currentMachine);
      currentMachine = []; // Reset for the next machine
    }
  }

  return machines;
};
