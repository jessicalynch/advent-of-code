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

const seedsToRanges = (seeds) => {
  const ranges = [];
  for (let i = 0; i < seeds.length; i += 2) {
    const seedStart = seeds[i];
    const range = seeds[i + 1];
    ranges.push([seedStart, seedStart + range]);
  }
  return ranges;
};

function solvePart1(input) {
  const blocks = input?.split("\n\n");
  const seeds = parseNums(blocks[0]);
  const maps = blocks.slice(1).map(parseNums).map(mapToRanges);

  const locations = [];
  for (const seed of seeds) {
    let val = seed;

    for (const map of maps) {
      for (const mapRange of map) {
        const [source, dest] = mapRange;
        const sourceStart = source[0];
        const sourceEnd = source[1];
        const destStart = dest[0];

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

function solvePart2(input) {
  const blocks = input?.split("\n\n");
  const seeds = parseNums(blocks[0]);
  const seedRanges = seedsToRanges(seeds);
  const maps = blocks.slice(1).map(parseNums).map(mapToRanges);

  const locations = [];

  for (let seedRange of seedRanges) {
    let currSeedRangeSlices = [seedRange];

    for (const map of maps) {
      let mappedSlices = [];
      let slicesToCheck = [...currSeedRangeSlices];

      for (const mapRange of map) {
        const [[sourceStart, sourceEnd], [destStart, destEnd]] = mapRange;

        let newSlicesToCheck = [];
        for (const slice of slicesToCheck) {
          const [seedStart, seedEnd] = slice;

          // Complete overlap - move to next map with entire mapped range
          if (seedStart >= sourceStart && seedEnd <= sourceEnd) {
            let mappedStart = destStart + (seedStart - sourceStart);
            let mappedEnd = destStart + (seedEnd - sourceStart);
            mappedSlices.push([mappedStart, mappedEnd]);
          } else {
            // Partial overlap - try unmapped portions with next range in current map
            if (seedStart < sourceEnd && seedEnd > sourceStart) {
              // Push mapped portion
              let overlapStart = Math.max(seedStart, sourceStart);
              let overlapEnd = Math.min(seedEnd, sourceEnd);
              let mappedStart = destStart + (overlapStart - sourceStart);
              let mappedEnd = mappedStart + (overlapEnd - overlapStart);
              mappedSlices.push([mappedStart, Math.min(mappedEnd, destEnd)]);

              // Check unmapped left slice with next range
              if (seedStart < sourceStart) {
                let leftSliceToCheck = [seedStart, sourceStart];
                newSlicesToCheck.push(leftSliceToCheck);
              }

              // Check unmapped right slice with next range
              if (seedEnd > sourceEnd) {
                let rightSliceToCheck = [sourceEnd, seedEnd];
                newSlicesToCheck.push(rightSliceToCheck);
              }
            } else {
              // Entire range unmapped - try next range
              newSlicesToCheck.push([seedStart, seedEnd]);
            }
          }
        }

        slicesToCheck = newSlicesToCheck;
      }

      // Move to next map with combined mapped and original slices
      currSeedRangeSlices =
        mappedSlices.length > 0
          ? mappedSlices.concat(slicesToCheck)
          : slicesToCheck;
    }

    if (currSeedRangeSlices.length) {
      const startVals = currSeedRangeSlices.map(([seedStart, _]) => seedStart);
      locations.push(...startVals);
    }
  }

  return Math.min(...locations);
}

export async function main() {
  const filename = "input.txt";

  const file = new URL(filename, import.meta.url);
  const input = readFile(file);

  const part1 = withTimer(solvePart1)(input);
  const part2 = withTimer(solvePart2)(input);

  log("part1:", part1);
  log("part2:", part2);
}

main();
