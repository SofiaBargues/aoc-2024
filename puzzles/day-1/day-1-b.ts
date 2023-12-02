import chalk from 'chalk';
import { readData } from '../../shared.ts';

function isNumeric(str: string) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function endsWithNumber(str: string){
  if(str.endsWith('one')){
    return '1'
  }else if(str.endsWith('two')){
    return '2'
  }else if(str.endsWith('three')){
    return '3'
  }else if(str.endsWith('four')){
    return '4'
  }else if(str.endsWith('five')){
    return '5'
  }else if(str.endsWith('six')){
    return '6'
  }else if(str.endsWith('seven')){
    return '7'
  }else if(str.endsWith('eight')){
    return '8'
  }else if(str.endsWith('nine')){
    return '9'
  }else{
    return ''
  }
}

function startsWithNumber(str: string){
  if(str.startsWith('one')){
    return '1'
  }else if(str.startsWith('two')){
    return '2'
  }else if(str.startsWith('three')){
    return '3'
  }else if(str.startsWith('four')){
    return '4'
  }else if(str.startsWith('five')){
    return '5'
  }else if(str.startsWith('six')){
    return '6'
  }else if(str.startsWith('seven')){
    return '7'
  }else if(str.startsWith('eight')){
    return '8'
  }else if(str.startsWith('nine')){
    return '9'
  }else{
    return ''
  }
}

export async function day1b(dataPath?: string) {
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
      // Find number word
      const substring = line.slice(i)
      const maybeNumber = startsWithNumber(substring)
      if (maybeNumber && isNumeric(maybeNumber)) {
				leftChar = maybeNumber;
				break;
			}
		}

		for (let j = line.length - 1; j >= 0; j--) {
			const char = line[j] as string;
      if (isNumeric(char)) {
				rightChar = char;
				break;
			}

      // Find number word
      const substring = line.slice(0,j+1)
      const maybeNumber = endsWithNumber(substring)
      if (maybeNumber && isNumeric(maybeNumber)) {
        rightChar = maybeNumber;
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

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
