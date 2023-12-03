const path = require("path");
const { fileToLines } = require("../utils");
const { log } = require("console");

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
      return sum + parseInt(firstNum + lastNum, 10);
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

async function main() {
  let filename = "input.txt";

  const lines = await fileToLines(path.resolve(__dirname, filename));
  const part1 = sumValues(lines);
  log("part1:", part1);

  const replacedLines = lines.map((line) => wordsToNums(line));
  const part2 = sumValues(replacedLines);
  log("part2:", part2);
}

main();
