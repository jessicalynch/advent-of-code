import { log } from "console";
import { fileToLines, withTime } from "../utils.mjs";

const isSymbol = (char) => char && !char?.match(/\d|\./);

const isGear = (char) => char === "*";

const xyToGearId = (xy) => `${xy[0]},${xy[1]}`;

const matchPartNums = (line) => line.matchAll(/\d+/g);

const isValidPartNum = (lines, lineInd, matchInd, matchLen) => {
  const line = lines[lineInd];
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
};

const sumGearRatios = (gearPartsMap) => {
  let sum = 0;
  for (const gearId in gearPartsMap) {
    if (
      gearPartsMap.hasOwnProperty(gearId) &&
      gearPartsMap[gearId].length === 2
    ) {
      const [num1, num2] = gearPartsMap[gearId].map(Number);
      sum += num1 * num2;
    }
  }
  return sum;
};

const getAdjacentGearIds = (lines, lineInd, matchInd, matchLen) => {
  const line = lines[lineInd];
  const prevLine = lines[lineInd - 1];
  const nextLine = lines[lineInd + 1];

  const gearXYCoords = [];

  if (isGear(line?.[matchInd - 1])) {
    gearXYCoords.push([matchInd - 1, lineInd]);
  }

  if (isGear(line?.[matchInd + matchLen])) {
    gearXYCoords.push([matchInd + matchLen, lineInd]);
  }

  for (let j = matchInd - 1; j < matchInd + matchLen + 1; j++) {
    if (isGear(prevLine?.[j])) {
      gearXYCoords.push([j, lineInd - 1]);
    }
    if (isGear(nextLine?.[j])) {
      gearXYCoords.push([j, lineInd + 1]);
    }
  }

  return gearXYCoords.map((xy) => xyToGearId(xy));
};

function solvePart1(lines) {
  const validParts = [];
  for (let i = 0; i < lines.length; i++) {
    const matches = matchPartNums(lines[i]);
    for (const match of matches) {
      const matchStr = match[0];
      if (isValidPartNum(lines, i, match.index, matchStr.length)) {
        validParts.push(matchStr);
      }
    }
  }

  return validParts.reduce((sum, val) => {
    return sum + Number(val);
  }, 0);
}

function solvePart2(lines) {
  const gearPartsMap = {};

  for (let i = 0; i < lines.length; i++) {
    const matches = matchPartNums(lines[i]);
    for (const match of matches) {
      const matchStr = match[0];
      const gearIds = getAdjacentGearIds(
        lines,
        i,
        match.index,
        matchStr.length
      );
      for (let gearId of gearIds) {
        if (!gearPartsMap[gearId]) {
          gearPartsMap[gearId] = [];
        }
        gearPartsMap[gearId].push(matchStr);
      }
    }
  }

  return sumGearRatios(gearPartsMap);
}

export function main() {
  const filename = "input.txt";

  const file = new URL(filename, import.meta.url);
  const lines = fileToLines(file);

  const part1 = withTime(solvePart1)(lines);
  const part2 = withTime(solvePart2)(lines);

  log("part1:", part1);
  log("part2:", part2);
}

main();
