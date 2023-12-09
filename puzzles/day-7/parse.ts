export type Player = {
  hand: string[];
  bid: number;
};

export const parseLines = (input: string[]): Player[] => {
  input = input.filter((line) => !!line);
  return input.map<Player>((line) => {
    let bid = line.trim().split(' ')[1];
    let hand = line.trim().split(' ')[0];

    return { hand: hand.split(''), bid: parseInt(bid, 10) };
  });

  // const times = input[0]
  //   .split(':')[1]
  //   .trim()
  //   .split(/\s+/)
  //   .map((time) => parseInt(time, 10));
  // const distances = input[1]
  //   .split(':')[1]
  //   .trim()
  //   .split(/\s+/)
  //   .map((time) => parseInt(time, 10));
  // return times.map<Race>((time, i) => {
  //   return {
  //     time,
  //     distance: distances[i],
  //   };
  // });
  // .filter((c) => /^(\+|-)?[0-9]+$/.test(c))
  // .map((a) => parseInt(a, 10));
};
