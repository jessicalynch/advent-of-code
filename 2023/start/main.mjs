import { log } from "console";
import { fileToLines, withTime } from "../utils.mjs";

function solvePart1(lines) {
  return undefined;
}

function solvePart2(lines) {
  return undefined;
}

export function main() {
  let filename = "example.txt";

  const file = new URL(filename, import.meta.url);
  const lines = fileToLines(file);

  const part1 = withTime(solvePart1)(lines);
  const part2 = withTime(solvePart2)(lines);

  log("part1:", part1);
  log("part2:", part2);
}

main();
