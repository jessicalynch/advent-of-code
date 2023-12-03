import { log } from "console";
import { fileToLines, withTimer } from "../utils.mjs";

const NUM_WORDS = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function sumValues(lines) {
  return lines.reduce((sum, line) => {
    const nums = line.match(/\d/g) || [];
    if (nums.length > 0) {
      const firstNum = nums[0];
      const lastNum = nums.length > 1 ? nums[nums.length - 1] : firstNum;
      return sum + Number(firstNum + lastNum);
    }
    return sum;
  }, 0);
}

function wordsToNums(str) {
  let newStr = "";
  let i = 0;
  while (i < str.length) {
    let matched = false;
    for (const word in NUM_WORDS) {
      if (str.startsWith(word, i)) {
        newStr += NUM_WORDS[word];
        i += word.length - 1;
        matched = true;
        break;
      }
    }
    if (!matched) {
      newStr += str[i];
      i++;
    }
  }
  return newStr;
}

function solvePart1(lines) {
  return sumValues(lines);
}

function solvePart2(lines) {
  const replacedLines = lines.map((line) => wordsToNums(line));
  return sumValues(replacedLines);
}

export function main() {
  const filename = "input.txt";

  const file = new URL(filename, import.meta.url);
  const lines = fileToLines(file);

  const part1 = withTimer(solvePart1)(lines);
  const part2 = withTimer(solvePart2)(lines);

  log("part1:", part1);
  log("part2:", part2);
}

main();
