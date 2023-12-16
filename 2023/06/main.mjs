import { log } from "console";
import { getXIntercepts } from "../math.mjs";
import { fileToLines, withTimer } from "../utils.mjs";

function multiplyTotalWays(times, distances) {
  let acc = 1;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    const [x1, x2] = getXIntercepts(-1, time, -distance);

    const minX = Math.ceil(x1);
    const maxX = Math.floor(x2);

    let totalWays = 0;
    for (let x = minX; x <= maxX; x++) {
      if (x * (time - x) > distance) {
        totalWays++;
      }
    }

    acc *= totalWays;
  }
  return acc;
}

function solvePart1(lines) {
  const times = lines[0].match(/\d+/g).map(Number);
  const distances = lines[1].match(/\d+/g).map(Number);
  return multiplyTotalWays(times, distances);
}

function solvePart2(lines) {
  const times = lines[0].replace(/\s+/g, "").match(/\d+/g).map(Number);
  const distances = lines[1].replace(/\s+/g, "").match(/\d+/g).map(Number);
  return multiplyTotalWays(times, distances);
}

export function main() {
  const filename = "input.txt";

  const file = new URL(filename, import.meta.url);
  const lines = fileToLines(file);

  const part1 = withTimer(solvePart1)(lines);
  const part2 = withTimer(solvePart2)(lines);

  log("part1:", part1);
  log("part2:", part2);
}

main();
