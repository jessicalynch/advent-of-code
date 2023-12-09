import { log } from "console";
import { fileToLines, withTimer } from "../utils.mjs";

const CARD_ORDER_1 = "AKQJT987654321".split("");
const CARD_ORDER_2 = "AKQT987654321J".split("");

const getCharCounts = (str) =>
  str.split("").reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

const getMaxKey = (counts) => {
  let { J, ...countsWithoutJ } = counts;

  return Object.keys(countsWithoutJ).reduce(
    (a, b) => (counts[a] > counts[b] ? a : b),
    {}
  );
};

const sortHands = (hands, sortOrder) => {
  return hands.sort((a, b) => {
    if (b.countStr < a.countStr) {
      return 1;
    }

    if (b.countStr > a.countStr) {
      return -1;
    }

    for (let i = 0; i < 5; i++) {
      let aChar = a.str[i];
      let bChar = b.str[i];
      if (aChar !== bChar) {
        let aCharInd = sortOrder.indexOf(aChar);
        let bCharInd = sortOrder.indexOf(bChar);
        return bCharInd - aCharInd;
      }
    }

    return 0;
  });
};

function solvePart1(lines) {
  let hands = lines.map((line) => {
    const [str, bid] = line.split(" ");
    const counts = getCharCounts(str);
    return {
      str,
      bid: Number(bid),
      counts,
      countStr: Object.values(counts)
        .sort((a, b) => b - a)
        .join(""),
    };
  });

  hands = sortHands(hands, CARD_ORDER_1);

  return hands.reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0);
}

function solvePart2(lines) {
  let hands = lines.map((line) => {
    const [str, bid] = line.split(" ");
    const counts = getCharCounts(str);
    const maxKey = getMaxKey(counts);
    const { J: jokers = 0, ...countsWithoutJ } = counts;

    countsWithoutJ[maxKey] = (countsWithoutJ[maxKey] || 0) + jokers;

    return {
      str,
      bid: Number(bid),
      counts: countsWithoutJ,
      countStr: Object.values(countsWithoutJ)
        .sort((a, b) => b - a)
        .join(""),
    };
  });

  hands = sortHands(hands, CARD_ORDER_2);

  return hands.reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0);
}

export function main() {
  let filename = "example.txt";
  filename = "input.txt";

  const file = new URL(filename, import.meta.url);
  const lines = fileToLines(file);

  try {
    const part1 = withTimer(solvePart1)(lines);
    const part2 = withTimer(solvePart2)(lines);
    log("part1:", part1);
    log("part2:", part2);
  } catch (err) {
    log(err);
  }
}

main();
