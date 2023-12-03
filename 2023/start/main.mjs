import { log } from "console";
import { fileToLines } from "../utils.mjs";

function solvePart1(lines) {
  return undefined;
}

function solvePart2(lines) {
  return undefined;
}

async function main() {
  let filename = "example.txt";

  const file = new URL(filename, import.meta.url);
  const lines = fileToLines(file);

  const part1 = solvePart1(lines);
  const part2 = solvePart2(lines);

  log("part1:", part1);
  log("part2:", part2);
}

main();
