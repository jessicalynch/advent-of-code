import { log } from "console";
import { fileToLines, withTimer } from "../utils.mjs";

const getEdges = (sLoc, lines) => {
  let [x, y] = sLoc;
  let top = lines?.[y - 1]?.[x];
  let right = lines?.[y]?.[x + 1];
  let bottom = lines?.[y + 1]?.[x];
  let left = lines?.[y]?.[x - 1];
  return [top, right, bottom, left];
};

const getPipe = (edges) => {
  const [top, right, bottom, left] = edges;

  if (right === "-" && bottom === "|") {
    return "F";
  }
  if (left === "-" && bottom === "|") {
    return "7";
  }
  if (top === "|" && left === "-") {
    return "J";
  }
  if (top === "|" && right === "-") {
    return "L";
  }

  if (left == "|" && right == "|") {
    return "|";
  }

  return "-";
};
const getNextLoc = (loc, lines) => {
  if (!loc) {
    return undefined;
  }
  const [x, y, prevDir] = loc;

  const currChar = lines[y][x];
  log("currLoc", loc);
  log("lines", lines[y][x]);

  if (currChar === "F") {
    if (prevDir === "left") {
      return [x, y + 1, "down"];
    }
    return [x + 1, y, "right"];
  }
  if (currChar === "7") {
    if (prevDir === "right") {
      return [x, y + 1, "down"];
    }
    return [x - 1, y, "left"];
  }

  if (currChar === "J") {
    if (prevDir === "down") {
      return [x - 1, y, "left"];
    }
    return [x, y - 1, "up"];
  }

  if (currChar === "L") {
    if (prevDir === "down") {
      return [x + 1, y, "right"];
    }
    return [x, y - 1, "up"];
  }
  if (currChar === "-") {
    if (prevDir === "left") {
      return [x - 1, y, "left"];
    }
    return [x + 1, y, "right"];
  }
  if (currChar === "|") {
    if (prevDir === "up") {
      return [x, y - 1, "up"];
    }
    return [x, y + 1, "down"];
  }
};
function solvePart1(lines) {
  let sLoc;
  for (let y = 0; y < lines.length; y++) {
    let x = lines[y].indexOf("S");
    if (x !== -1) {
      sLoc = [x, y];
      break;
    }
  }
  log("S", sLoc);
  let edges = getEdges(sLoc, lines);
  let sChar = getPipe(edges);
  let [x, y] = sLoc;
  log(edges);
  log(sChar);
  let sLines = [...lines];
  sLines[y] = sLines[y].replace("S", sChar);
  let nextLoc = getNextLoc(sLoc, sLines);
  let loc = nextLoc;
  let numTurns = 0;
  while (loc !== sLoc && loc !== undefined) {
    numTurns++;
    loc = getNextLoc(loc, lines);

    log("new loc", loc);
  }

  log(numTurns);
  log(lines);

  return numTurns / 2;
}

// TODO
function solvePart2(lines) {
  let sLoc;
  for (let y = 0; y < lines.length; y++) {
    let x = lines[y].indexOf("S");
    if (x !== -1) {
      sLoc = [x, y];
      break;
    }
  }
  log("S", sLoc);
  let edges = getEdges(sLoc, lines);
  let sChar = getPipe(edges);
  let [x, y] = sLoc;
  log(edges);
  log(sChar);
  let sLines = [...lines];
  sLines[y] = sLines[y].replace("S", sChar);
  let nextLoc = getNextLoc(sLoc, sLines);
  let loc = nextLoc;
  let numTurns = 0;
  while (loc !== sLoc && loc !== undefined) {
    let [currX, currY] = loc;
    numTurns++;
    loc = getNextLoc(loc, lines);
    lines[currY] =
      lines[currY].substring(0, currX) +
      "X" +
      lines[currY].substring(currX + 1);
  }

  log(lines);
  let enclosedTiles = 0;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let charEdges = getEdges([x, y], lines);
      if (charEdges.every((edgeChar) => edgeChar === "X")) {
        enclosedTiles++;
      }
    }
  }
  return enclosedTiles;
}

export function main() {
  let filename = "example.txt";
  filename = "input.txt";

  const file = new URL(filename, import.meta.url);
  const lines = fileToLines(file);

  try {
    // const part1 = withTimer(solvePart1)(lines);
    const part2 = withTimer(solvePart2)(lines);
    // log("part1:", part1);
    log("part2:", part2);
  } catch (err) {
    log(err);
  }
}

main();
