import { log } from "console";
import { readFile, withTimer } from "../utils.mjs";
import { getMaps, seedToLocation } from "./helpers.mjs";

function solvePart1(input) {
  const blocks = input?.split("\n\n");
  const seeds = blocks[0].match(/\d+/g).map(Number);
  const maps = getMaps(blocks);

  let locations = [];
  for (let seed of seeds) {
    const location = seedToLocation(seed, maps);
    locations.push(location);
  }

  return Math.min(...locations);
}

// TODO
function solvePart2(input) {
  return undefined;

  const blocks = input?.split("\n\n");
  const seeds = blocks[0].match(/\d+/g).map(Number);
  const maps = getMaps(blocks);
  let locations = [];

  for (let i = 0; i < seeds.length - 1; i += 2) {
    for (let j = seeds[i]; j < seeds[i] + seeds[i + 1]; j++) {
      let seed = j;
      const location = seedToLocation(seed, maps);
      locations.push(location);
    }
  }

  return Math.min(...locations);
}

export async function main() {
  let filename = "input.txt";
  filename = "example.txt";

  const file = new URL(filename, import.meta.url);
  const input = readFile(file);

  const part1 = withTimer(solvePart1)(input);
  const part2 = withTimer(solvePart2)(input);

  log("part1:", part1);
  log("part2:", part2);
}

main();
