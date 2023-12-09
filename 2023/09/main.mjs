import { log } from "console";
import { fileToLines, withTimer } from "../utils.mjs";

function arrToDiffs(arr) {
  let diffs = [];
  for (let i = 0; i < arr.length - 1; i++) {
    diffs.push(arr[i + 1] - arr[i]);
  }
  return diffs;
}

function solvePart1(lines) {
  let sum = 0;
  for (const line of lines) {
    const startingNums = line.split(" ").map(Number);
    const diffArrays = [startingNums];
    let nums = startingNums;
    while (true) {
      const lineDiffs = arrToDiffs(nums);
      if (lineDiffs.every((x) => x === 0)) {
        break;
      }
      diffArrays.push(lineDiffs);
      nums = lineDiffs;
    }

    for (let i = diffArrays.length - 2; i >= 0; i--) {
      let currArr = diffArrays[i];
      let prevArr = diffArrays[i + 1];
      let diff = prevArr[prevArr.length - 1];
      let currArrLastInd = currArr[currArr.length - 1];
      let newLastInd = currArrLastInd + diff;
      currArr.push(newLastInd);
    }
    let nextVal = diffArrays[0][diffArrays[0].length - 1];
    sum += nextVal;
  }
  return sum;
}

function solvePart2(lines) {
  let sum = 0;
  for (let line of lines) {
    const startingNums = line.split(" ").map(Number);
    const diffArrays = [startingNums];
    let nums = startingNums;

    while (true) {
      const lineDiffs = arrToDiffs(nums);
      diffArrays.push(lineDiffs);
      if (lineDiffs.every((x) => x === 0)) {
        break;
      }
      nums = lineDiffs;
    }

    for (let i = diffArrays.length - 2; i >= 0; i--) {
      let currArr = diffArrays[i];
      let prevArr = diffArrays[i + 1];
      let diff = prevArr[0];
      let currArrFirstInd = currArr[0];
      let newFirstInd = currArrFirstInd - diff;
      currArr.unshift(newFirstInd);
    }
    let nextVal = diffArrays[0][0];
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
