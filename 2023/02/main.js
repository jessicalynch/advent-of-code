const path = require("path");
const { fileToLines } = require("../utils");

const RED_CUBES = 12;
const GREEN_CUBES = 13;
const BLUE_CUBES = 14;

function getColorMatches(color, line) {
  const regex = new RegExp(`(\\d+) ${color}`, "g");
  return Array.from(line.matchAll(regex), (m) => parseInt(m[1], 10));
}

function getMaxColorValue(color, line) {
  const matches = getColorMatches(color, line);
  return matches.length ? Math.max(...matches) : 0;
}

function someValidGames(lines) {
  const maxCubes = [RED_CUBES, GREEN_CUBES, BLUE_CUBES];
  const colors = ["red", "green", "blue"];

  return lines.reduce((sum, line, i) => {
    const maxValues = colors.map((color) => getMaxColorValue(color, line));
    const gameValid = maxValues.every((val, i) => val <= maxCubes[i]);
    console.debug(`Game ${i} valid:`, gameValid);

    return gameValid ? sum + i + 1 : sum;
  }, 0);
}

function sumGamePowers(lines) {
  const colors = ["red", "green", "blue"];

  return lines.reduce((sum, line, i) => {
    const maxValues = colors.map((color) => getMaxColorValue(color, line));
    const power = maxValues.reduce((product, val) => product * val, 1);

    console.debug(`Game ${i + 1} power:`, power);
    return sum + power;
  }, 0);
}

async function main() {
  let filename = "example.txt";
  filename = "input.txt";

  const lines = await fileToLines(path.resolve(__dirname, filename));

  const part1 = someValidGames(lines);
  const part2 = sumGamePowers(lines);

  console.log("part1:", part1);
  console.log("part2:", part2);
}

main();
