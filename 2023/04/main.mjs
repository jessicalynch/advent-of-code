import { log } from "console";
import { fileToLines, withTimer } from "../utils.mjs";

function getMatchingNumbers(line) {
  const pattern = /(\d+(?:\s+\d+)*)\s*\|\s*(\d+(?:\s+\d+)*)/;
  const matches = line.match(pattern);

  const winningNums = matches?.[1].split(/\s+/).map(Number) || [];
  const nums = matches?.[2].split(/\s+/).map(Number) || [];

  const winningSet = new Set(winningNums);
  return nums.filter((num) => winningSet.has(num));
}

function solvePart1(lines) {
  return lines.reduce((sum, line) => {
    const numWins = getMatchingNumbers(line).length;
    const points = numWins ? Math.pow(2, numWins - 1) : 0;

    return sum + points;
  }, 0);
}

function solvePart2(lines) {
  let multipliers = new Map();

  for (let i = 0; i < lines.length; i++) {
    multipliers.set(i, 1);
  }

  for (let i = 0; i < lines.length; i++) {
    let multiplier = multipliers.get(i);

    const numWins = getMatchingNumbers(lines[i]).length;

    const lastInd = Math.min(i + 1 + numWins, lines.length);
    for (let j = i + 1; j < lastInd; j++) {
      multipliers.set(j, multipliers.get(j) + multiplier);
    }
  }
  return [...multipliers.values()].reduce((sum, val) => sum + val, 0);
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
