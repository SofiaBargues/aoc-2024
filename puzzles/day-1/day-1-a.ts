import { readData } from '../../shared.ts';
import chalk from 'chalk';

// TODO use @alexaegis/fs
export const NEWLINE = /\r?\n/;
export const WHITESPACE = /\s+/;
export const DOUBLE_NEWLINE = /\r?\n\r?\n/;

function isNumeric(str: string) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export async function day1a(dataPath?: string) {
  const lines = await readData(dataPath);
	
  const lineNumbers = [];
	for (const line of lines) {
    let leftChar = '';
		let rightChar = '';
		for (let i = 0; i < line.length; i++) {
			const char = line[i] as string;
      if (isNumeric(char)) {
				leftChar = char;
				break;
			}
		}

		for (let j = line.length - 1; j >= 0; j--) {
			const char = line[j] as string;
      if (isNumeric(char)) {
				rightChar = char;
				break;
			}
		}
		const number = parseInt(leftChar + rightChar);
		lineNumbers.push(number);
  }
	return lineNumbers.reduce((accumulator, currentValue) => {
		return accumulator + currentValue;
	}, 0);
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
