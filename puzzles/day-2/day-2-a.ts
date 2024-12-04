import chalk from 'chalk';
import { readLines } from '../../shared.ts';
import { parseLines } from './parse.ts';

export async function day2a(dataPath?: string) {
  const data = await readLines(dataPath);
  const reports = parseLines(data);

  // -1. let acc
  let acc = 0;
  // 0.itero a travez de los reportes
  for (const report of reports) {
    // 1.chequeo el orden => asc
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
    //
    //      3. si isSafe acc++
    if (isSafe) {
      acc++;
    }
  }
  return acc;
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
