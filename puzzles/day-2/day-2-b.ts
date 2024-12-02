import chalk from 'chalk';
import { readData } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);
  const reports = parseLines(data);

  // -1. let acc
  let acc = 0;
  // 0.itero a travez de los reportes
  for (const report of reports) {
    // 1.chequeo el orden => asc
    console.log('Report', report);
    let isSafe = new Array(report.length)
      .fill(0)
      .map((_, i) => {
        const sub = report.slice();
        sub.splice(i, 1);
        return sub;
      })
      .some((subarr) => {
        const res = calculate(subarr);
        console.log(subarr, res);
        return res;
      });
    console.log('Result:', isSafe);
    //
    //      3. si isSafe acc++
    if (isSafe) {
      acc++;
    }
  }
  return acc;
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

function calculate(report: number[]) {
  let asc = report[0] < report[1];
  //     1.a let isSafe=true
  let isSafe = true;
  //     2.itero tomando 2 val consecutivos
  for (let i = 0; i < report.length - 1; i++) {
    // 1.a calcular la differencia:
    //              if ( asc )not la diferencia del segundo menos
    //             else not la diferencia del primerp menos
    let diff = asc ? report[i + 1] - report[i] : report[i] - report[i + 1];
    //          1.b checkear si no es valida
    //                 diff >=1 y  diff  <=3
    if (!(diff >= 1 && diff <= 3)) {
      //             2.a isSafe=false
      //             2.breack
      isSafe = false;
      break;
    }
  }
  return isSafe;
}
