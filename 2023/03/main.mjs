import { log } from "console";
import { fileToLines } from "../utils.mjs";

function isSymbol(char) {
  return char && char !== "." && !char?.match(/\d/);
}

function isValidNum(line, lines, lineInd, matchInd, matchLen) {
  const prevLine = lines[lineInd - 1];
  const nextLine = lines[lineInd + 1];

  if (isSymbol(line?.[matchInd - 1]) || isSymbol(line?.[matchInd + matchLen])) {
    return true;
  }

  for (let j = matchInd - 1; j < matchInd + matchLen + 1; j++) {
    if (isSymbol(prevLine?.[j]) || isSymbol(nextLine?.[j])) {
      return true;
    }
  }

  return false;
}

function solvePart1(lines) {
  const validMatches = [];
  const pattern = /\d+/g;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = [...line.matchAll(pattern)];
    for (const match of matches) {
      const matchStr = match[0];
      const matchLen = matchStr.length;
      const matchInd = match.index;
      if (isValidNum(line, lines, i, matchInd, matchLen)) {
        validMatches.push(parseInt(matchStr, 10));
      }
    }
  }

  return validMatches.reduce((sum, val) => {
    return sum + val;
  }, 0);
}

function solvePart2(lines) {
  return undefined;
}

async function main() {
  let filename = "example.txt";
  filename = "input.txt";

  const file = new URL(filename, import.meta.url);
  const lines = fileToLines(file);

  const part1 = solvePart1(lines);
  const part2 = solvePart2(lines);

  log("part1:", part1);
  log("part2:", part2);
}

main();
