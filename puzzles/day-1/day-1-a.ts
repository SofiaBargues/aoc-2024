import chalk from 'chalk';
import { readData } from '../../shared.ts';

export async function day1a(dataPath?: string) {
  const lines = await readData(dataPath);

	const list1: number[] = [];
	const list2: number[] = [];
	lines
		.map((line) => line.split('   '))
		.forEach(([a, b]) => {
			list1.push(Number(a));
			list2.push(Number(b));
		});

	// Solution
	list1.sort((a, b) => a - b);
	list2.sort((a, b) => a - b);

	let acc = 0;

	for (let i = 0; i < list1.length; i++) {
		acc = acc + Math.abs(list1[i] - list2[i]);
	}

	return acc;
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
