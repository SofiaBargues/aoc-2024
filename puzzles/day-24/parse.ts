export const parseLines = (lines: string[]) => {
  const idx = lines.findIndex((line) => line.trim() === '');
  const wires = lines.slice(0, idx).reduce((obj, line) => {
    const [wire, val] = line.split(': ');
    obj[wire] = Number(val);
    return obj;
  }, {} as Record<string, number>);
  const gates = lines.slice(idx + 1).map((line) => {
    const [gateDef, out] = line.split(' -> ');
    const [in1, gate, in2] = gateDef.split(' ');

    return {
      gate,
      in1,
      in2,
      outWire: out,
    };
  });
  return { gates, wires };
};
