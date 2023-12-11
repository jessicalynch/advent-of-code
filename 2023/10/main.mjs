import { log } from "console";
import { fileToLines, printLines, withTimer } from "../utils.mjs";

const getStartLoc = (lines) => {
  let startLoc;
  for (let y = 0; y < lines.length; y++) {
    let x = lines[y].indexOf("S");
    if (x !== -1) {
      startLoc = [x, y];
      break;
    }
  }
  return startLoc;
};

const getEdges = (startLoc, lines) => {
  let [x, y] = startLoc;
  let top = lines?.[y - 1]?.[x];
  let right = lines?.[y]?.[x + 1];
  let bottom = lines?.[y + 1]?.[x];
  let left = lines?.[y]?.[x - 1];
  return [top, right, bottom, left];
};

const getPipe = (edges) => {
  const [top, right, bottom, left] = edges;

  if (
    (right === "-" || right === "7") &&
    (bottom === "|" || bottom == "J" || bottom === "L")
  ) {
    return "F";
  }
  if ((left === "-" || left === "F") && (bottom === "|" || bottom === "L")) {
    return "7";
  }
  if ((top === "|" || top === "7") && (left === "-" || left === "L")) {
    return "J";
  }
  if ((top === "|" && right === "-") || (left === "F" && right === "F")) {
    return "L";
  }

  if (left == "|" && right == "|") {
    return "|";
  }

  return "-";
};

const getNextLoc = (loc, lines) => {
  if (!loc) {
    throw new Error("Invalid loc");
  }
  const [x, y, prevDir] = loc;
  const currChar = lines[y][x];

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

  return undefined;
};

const inBounds = (x, y, grid) =>
  x >= 0 && x < grid?.[y]?.length && y >= 0 && y < grid?.length;

const replaceX = (str, x, char) =>
  str.substring(0, x) + char + str.substring(x + 1);

const floodFill = (startX, startY, grid) => {
  let g = grid.map((row) => [...row]);
  let queue = [[startX, startY]];

  while (queue.length > 0) {
    let [x, y] = queue.shift();
    if (
      !inBounds(x, y, g) ||
      g[y][x] === "|" ||
      g[y][x] === "-" ||
      g[y][x] === "O"
    ) {
      continue;
    }

    g[y][x] = "O";
    queue.push([x + 1, y]);
    queue.push([x - 1, y]);
    queue.push([x, y + 1]);
    queue.push([x, y - 1]);
  }
  return g;
};

const magnify = (grid) => {
  /*
    F       7       L       J
    . . .   . . .   . | .   . | .
    . - -   - - .   . - -   - - .
    . | .   . | .   . . .   . . .


    |       -
    . | .   . . .
    . | .   - - -
    . | .   . . .
  */
  const numRows = grid.length;
  const numCols = grid[0].length;

  const g = Array(numRows * 3)
    .fill(null)
    .map(() => Array(numCols * 3).fill(" "));

  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const cell = grid[y][x];
      let magnifiedY = y * 3;
      let magnifiedX = x * 3;
      if (cell === "|") {
        g[magnifiedY][magnifiedX + 1] = "|";
        g[magnifiedY + 1][magnifiedX + 1] = "|";
        g[magnifiedY + 2][magnifiedX + 1] = "|";
        continue;
      }
      if (cell === "-") {
        g[magnifiedY + 1][magnifiedX] = "-";
        g[magnifiedY + 1][magnifiedX + 1] = "-";
        g[magnifiedY + 1][magnifiedX + 2] = "-";
        continue;
      }
      if (cell === "F") {
        g[magnifiedY + 1][magnifiedX + 1] = "-";
        g[magnifiedY + 1][magnifiedX + 2] = "-";
        g[magnifiedY + 2][magnifiedX + 1] = "|";
        continue;
      }
      if (cell === "7") {
        g[magnifiedY + 1][magnifiedX] = "-";
        g[magnifiedY + 1][magnifiedX + 1] = "-";
        g[magnifiedY + 2][magnifiedX + 1] = "|";
        continue;
      }
      if (cell === "J") {
        g[magnifiedY][magnifiedX + 1] = "|";
        g[magnifiedY + 1][magnifiedX] = "-";
        g[magnifiedY + 1][magnifiedX + 1] = "-";
        continue;
      }
      if (cell === "L") {
        g[magnifiedY][magnifiedX + 1] = "|";
        g[magnifiedY + 1][magnifiedX + 1] = "-";
        g[magnifiedY + 1][magnifiedX + 2] = "-";
      }
    }
  }
  return g;
};

function solvePart1(lines) {
  const startLoc = getStartLoc(lines);
  const edges = getEdges(startLoc, lines);
  const startChar = getPipe(edges);

  const [_, startY] = startLoc;
  const tmpLines = [...lines];

  tmpLines[startY] = lines[startY].replace("S", startChar);

  let loc = getNextLoc(startLoc, tmpLines);
  let numTurns = 0;

  // loc becomes undefined when `S` is reached
  while (loc) {
    numTurns++;
    loc = getNextLoc(loc, lines);
  }

  return numTurns / 2;
}

function solvePart2(lines) {
  const startLoc = getStartLoc(lines);
  const edges = getEdges(startLoc, lines);
  const startChar = getPipe(edges);

  const [_, startY] = startLoc;
  const tmpLines = [...lines];
  tmpLines[startY] = lines[startY].replace("S", startChar);

  let loc = getNextLoc(startLoc, tmpLines);
  let loop = new Set();

  while (loc) {
    let [nextX, nextY] = loc;
    loop.add(`${nextX},${nextY}`);
    loc = getNextLoc(loc, lines);
    if (loc !== undefined) {
      [nextX, nextY] = loc;
    }
  }

  lines[startY] = tmpLines[startY];

  // Remove junk pipes
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (!loop.has(`${x},${y}`)) {
        lines[y] = replaceX(lines[y], x, ".");
      }
    }
  }

  // Magnify grid for spaces between pipes
  let grid = magnify(lines);

  // Fill outside tiles with `O`
  grid = floodFill(0, 0, grid);

  let numTiles = 0;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      let magnifiedY = y * 3 + 1;
      let magnifiedX = x * 3 + 1;

      if (grid[magnifiedY][magnifiedX] == " ") {
        numTiles++;
      }
    }
  }

  printLines(grid);
  return numTiles;
}

export function main() {
  let filename = "example1.txt";
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
