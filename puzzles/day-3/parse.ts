export const parseLines = (input: string[]) => {
  const mulRegex = /mul\(\d+,\d+\)/g;
  const numbersRegex = /\d+/g;

  let mulMatches = input.map((line) => line.match(mulRegex)).flat();

  let numArr = [];
  for (let i = 0; i < mulMatches.length; i++) {
    numArr.push(mulMatches[i].match(numbersRegex));
  }
  return numArr;
};
