import { log } from "console";
import { readFile, withTimer } from "../utils.mjs";

const parseNums = (x) => x.match(/\d+/g).map(Number);

const mapToRanges = (m) => {
  const ranges = [];
  for (let i = 0; i < m.length; i += 3) {
    const destVal = m[i];
    const sourceVal = m[i + 1];
    const mapRange = m[i + 2];
    ranges.push([
      [sourceVal, sourceVal + mapRange],
      [destVal, destVal + mapRange],
    ]);
  }
  return ranges;
};

function solvePart1(input) {
  const blocks = input?.split("\n\n");
  const seeds = parseNums(blocks[0]);
  const maps = blocks.slice(1).map((block) => parseNums(block));

  const locations = [];
  for (const seed of seeds) {
    let val = seed;

    for (const m of maps) {
      const ranges = mapToRanges(m);

      for (const r of ranges) {
        const sourceStart = r[0][0];
        const sourceEnd = r[0][1];
        const destStart = r[1][0];

        if (val >= sourceStart && val < sourceEnd) {
          val = destStart + val - sourceStart;
          break;
        }
      }
    }
    locations.push(val);
  }
  return Math.min(...locations);
}

// TODO
function solvePart2(input) {
  return undefined;
}

export async function main() {
  let filename = "input.txt";
  // filename = "example.txt";

  const file = new URL(filename, import.meta.url);
  const input = readFile(file);

  const part1 = withTimer(solvePart1)(input);
  const part2 = withTimer(solvePart2)(input);

  log("part1:", part1);
  log("part2:", part2);
}

main();
