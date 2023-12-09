import { log } from "console";
import { fileToLines, withTimer } from "../utils.mjs";

const arrToDiffs = (arr) => {
  let diffs = [];
  for (let i = 0; i < arr.length - 1; i++) {
    diffs.push(arr[i + 1] - arr[i]);
  }
  return diffs;
};

const getDiffArrays = (arr) => {
  const diffArrays = [arr];
  let nums = arr;
  while (true) {
    const lineDiffs = arrToDiffs(nums);
    if (lineDiffs.every((x) => x === 0)) {
      break;
    }
    diffArrays.push(lineDiffs);
    nums = lineDiffs;
  }
  return diffArrays;
};

function solvePart1(lines) {
  let sum = 0;
  for (const line of lines) {
    const startingNums = line.split(" ").map(Number);
    const diffArrays = getDiffArrays(startingNums);

    for (let i = diffArrays.length - 2; i >= 0; i--) {
      const currArr = diffArrays[i];
      const prevArr = diffArrays[i + 1];
      const diff = prevArr[prevArr.length - 1];
      const currArrLastInd = currArr[currArr.length - 1];
      const newLastInd = currArrLastInd + diff;
      currArr.push(newLastInd);
    }
    const nextVal = diffArrays[0][diffArrays[0].length - 1];
    sum += nextVal;
  }
  return sum;
}

function solvePart2(lines) {
  let sum = 0;
  for (const line of lines) {
    const startingNums = line.split(" ").map(Number);
    const diffArrays = getDiffArrays(startingNums);

    for (let i = diffArrays.length - 2; i >= 0; i--) {
      const currArr = diffArrays[i];
      const prevArr = diffArrays[i + 1];
      const diff = prevArr[0];
      const currArrFirstInd = currArr[0];
      const newFirstInd = currArrFirstInd - diff;
      currArr.unshift(newFirstInd);
    }
    const nextVal = diffArrays[0][0];
    sum += nextVal;
  }
  return sum;
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
