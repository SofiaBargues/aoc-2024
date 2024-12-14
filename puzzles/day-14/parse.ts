function stringToRobot(line: string): { pos: number[]; vel: number[] } {
  let [p, v] = line.split(' '); // p="p=1,65",v="v=-5,-84"
  p = p.slice(2); //"1,65"
  let pArr = p.split(','); //"1","65"
  let pos = pArr.map((x) => Number(x)); // [1,65]

  v = v.slice(2);
  let vArr = v.split(',');
  let vel = vArr.map((x) => Number(x));

  let robot = { pos: pos, vel: vel };

  return robot;
}

export const parseLines = (lines: string[]) => {
  return lines.map((line) => stringToRobot(line));
};
