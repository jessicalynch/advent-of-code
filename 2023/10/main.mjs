import { log } from "console";
import { fileToLines, withTimer } from "../utils.mjs";

const getSLoc = (lines) => {
  let sLoc;
  for (let y = 0; y < lines.length; y++) {
    let x = lines[y].indexOf("S");
    if (x !== -1) {
      sLoc = [x, y];
      break;
    }
  }
  return sLoc;
};

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
    return undefined;
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
  const numRows = grid.length;
  const numCols = grid[0].length;

  const g = Array(numRows * 3)
    .fill(null)
    .map(() => Array(numCols * 3).fill(" "));

  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const cell = grid[y][x];
      if (cell === "|") {
        g[y * 3 + 1][x * 3 + 1] = "|";
        g[y * 3][x * 3 + 1] = "|";
        g[y * 3 + 2][x * 3 + 1] = "|";
        continue;
      }
      if (cell === "-") {
        g[y * 3 + 1][x * 3] = "-";
        g[y * 3 + 1][x * 3 + 1] = "-";
        g[y * 3 + 1][x * 3 + 2] = "-";
        continue;
      }
      if (cell === "7") {
        g[y * 3 + 1][x * 3] = "-";
        g[y * 3 + 1][x * 3 + 1] = "-";
        g[y * 3 + 2][x * 3 + 1] = "|";
        continue;
      }
      if (cell === "F") {
        g[y * 3 + 1][x * 3 + 1] = "-";
        g[y * 3 + 1][x * 3 + 2] = "-";
        g[y * 3 + 2][x * 3 + 1] = "|";
        continue;
      }
      if (cell === "J") {
        g[y * 3][x * 3 + 1] = "|";
        g[y * 3 + 1][x * 3] = "-";
        g[y * 3 + 1][x * 3 + 1] = "-";
        continue;
      }
      if (cell === "L") {
        g[y * 3][x * 3 + 1] = "|";
        g[y * 3 + 1][x * 3 + 1] = "-";
        g[y * 3 + 1][x * 3 + 2] = "-";
      }
    }
  }
  return g;
};

const printGrid = (grid) => {
  for (let row of grid) {
    log(row.join());
  }
};

function solvePart1(lines) {
  const sLoc = getSLoc(lines);
  const edges = getEdges(sLoc, lines);
  const sChar = getPipe(edges);
  const [x, y] = sLoc;
  const sLines = [...lines];
  sLines[y] = sLines[y].replace("S", sChar);
  let nextLoc = getNextLoc(sLoc, sLines);
  let loc = nextLoc;
  let numTurns = 0;
  while (loc !== sLoc && loc !== undefined) {
    numTurns++;
    loc = getNextLoc(loc, lines);
  }

  return numTurns / 2;
}

function solvePart2(lines) {
  const sLoc = getSLoc(lines);
  const edges = getEdges(sLoc, lines);
  const sChar = getPipe(edges);
  const [x, y] = sLoc;
  const sLines = [...lines];
  sLines[y] = sLines[y].replace("S", sChar);
  let nextLoc = getNextLoc(sLoc, sLines);

  let loc = nextLoc;
  let loop = new Set();
  loop.add(`${x},${y}`);

  while (loc !== sLoc && loc !== undefined) {
    let [currX, currY] = loc;
    loop.add(`${currX},${currY}`);
    loc = getNextLoc(loc, lines);
  }

  lines[y] = replaceX(lines[y], x, sChar);

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (!loop.has(`${x},${y}`)) {
        lines[y] = replaceX(lines[y], x, ".");
      }
    }
  }

  let grid = magnify(lines);
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
  printGrid(grid);
  return numTiles;
}

export function main() {
  let filename = "example2.txt";
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
