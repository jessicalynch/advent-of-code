import { log } from "console";
import { fileToLines } from "../utils.mjs";

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

function sumValidGames(lines) {
  const maxCubes = [RED_CUBES, GREEN_CUBES, BLUE_CUBES];
  const colors = ["red", "green", "blue"];

  return lines.reduce((sum, line, i) => {
    const maxValues = colors.map((color) => getMaxColorValue(color, line));
    const gameValid = maxValues.every((val, i) => val <= maxCubes[i]);
    log(`Game ${i} valid:`, gameValid);

    return gameValid ? sum + i + 1 : sum;
  }, 0);
}

function sumGamePowers(lines) {
  const colors = ["red", "green", "blue"];

  return lines.reduce((sum, line, i) => {
    const maxValues = colors.map((color) => getMaxColorValue(color, line));
    const power = maxValues.reduce((product, val) => product * val, 1);

    log(`Game ${i + 1} power:`, power);
    return sum + power;
  }, 0);
}

function main() {
  let filename = "input.txt";

  const file = new URL(filename, import.meta.url);
  const lines = fileToLines(file);

  const part1 = sumValidGames(lines);
  const part2 = sumGamePowers(lines);

  log("part1:", part1);
  log("part2:", part2);
}

main();