import chalk from 'chalk';
import { readLines } from '../../shared.ts';

function hash_fn(string: string): number {
  return string.split('').reduce((acc, char) => {
    const ascii = char[0].charCodeAt(0);
    const multiplied = (acc + ascii) * 17;
    const rem = multiplied % 256;
    return rem;
  }, 0);
}

export async function day15b(dataPath?: string) {
  const data = await readLines(dataPath);
  const codes = data[0].split(',');
  const encoded = codes.map((code) => hash_fn(code));
  const map: Record<string, string[][]> = {};
  codes.forEach((code) => {
    if (code.endsWith('-')) {
      const label = code.slice(0, -1);
      const hash = hash_fn(label);
      if (map[hash]) {
        map[hash] = map[hash].filter((encoded) => encoded[0] != label);
      }
    } else {
      const [label, focalLength] = code.split('=');
      const hash = hash_fn(label);
      if (map[hash]) {
        // If a lens with same label, replace
        const idx = map[hash].findIndex((encoded) => encoded[0] == label);
        if (idx == -1) {
          map[hash].push([label, focalLength]);
        } else {
          map[hash][idx] = [label, focalLength];
        }
      } else {
        map[hash] = [[label, focalLength]];
      }
    }
  });

  return Object.entries(map)
    .map(([num, arr]) =>
      arr.reduce(
        (acc, val, i) => acc + (parseInt(num) + 1) * parseInt(val[1]) * (i + 1),
        0
      )
    )
    .reduce((a, b) => a + b, 0);
}
const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
