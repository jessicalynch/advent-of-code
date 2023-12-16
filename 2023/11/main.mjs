import { log } from "console";
import { WFI } from "../math.mjs";
import { fileToLines, withTimer } from "../utils.mjs";

const parseLines = (lines) => {
  const coords = [];
  const emptyRows = [];
  const emptyCols = new Set(Array(lines[0].length).keys());
  for (const [y, row] of lines.entries()) {
    const xVals = Array.from(row.matchAll(/#/g), (match) =>
      Number(match.index)
    );
    if (!xVals.length) {
      emptyRows.push(y);
      continue;
    }
    for (const x of xVals) {
      emptyCols.delete(x);
      const loc = `${x},${y}`;
      coords.push(loc);
    }
  }
  return [emptyRows, [...emptyCols], coords];
};

const modifyCoords = (coords, emptyRows, emptyCols, n) => {
  return coords.map((coord) => {
    let [x, y] = coord.split(",").map(Number);

    let modifiedX = emptyCols.reduce((acc, col) => acc + (col < x ? n : 0), 0);
    x += modifiedX;

    let modifiedY = emptyRows.reduce((acc, row) => acc + (row < y ? n : 0), 0);
    y += modifiedY;

    return `${x},${y}`;
  });
};

const sumShortestPaths = (lines, n) => {
  let [emptyRows, emptyCols, coords] = parseLines(lines);

  coords = modifyCoords(coords, emptyRows, emptyCols, n);

  const dists = WFI(coords);

  let sum = 0;
  for (let i = 0; i < dists.length; i++) {
    for (let j = i + 1; j < dists[i].length; j++) {
      sum += dists[i][j];
    }
  }
  return sum;
};

function solvePart1(lines) {
  return sumShortestPaths(lines, 1);
}

function solvePart2(lines) {
  return sumShortestPaths(lines, 999999);
}

export function main() {
  let filename = "input.txt";

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
