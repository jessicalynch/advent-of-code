import { log } from "console";
import { fileToLines, withTimer } from "../utils.mjs";

const parseSteps = (line) =>
  line.replace(/R/g, 1).replace(/L/g, 0).split("").map(Number);

const parseNodes = (lines) => {
  const nodes = new Map();

  for (let line of lines) {
    const parts = line.match(/[0-9A-Z]{3}/g);
    nodes.set(parts[0], parts.slice(1));
  }
  return nodes;
};

function solvePart1(lines) {
  const steps = parseSteps(lines[0]);
  const nodes = parseNodes(lines.slice(1));

  let loc = "AAA";
  let i = 0;
  while (loc !== "ZZZ") {
    for (const step of steps) {
      i++;
      const nextNode = nodes.get(loc);
      loc = nextNode[step];
      if (loc === "ZZZ") {
        break;
      }
    }
  }
  return i;
}

const gcd = (a, b) => {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
};

const lcm = (a, b) => (a * b) / gcd(a, b);

function solvePart2(lines) {
  const steps = parseSteps(lines[0]);
  const nodes = parseNodes(lines.slice(1));

  const locs = [...nodes.keys()].filter((key) => key.endsWith("A"));
  const zCounts = [];
  for (const loc of locs) {
    let i = 0;
    let newLoc = loc;
    let endsWithZ = false;
    while (!endsWithZ) {
      for (const step of steps) {
        i++;
        const nextNode = nodes.get(newLoc);
        newLoc = nextNode[step];
        if (newLoc.endsWith("Z")) {
          endsWithZ = true;
          break;
        }
      }
    }
    zCounts.push(i);
  }

  return zCounts.reduce((acc, val) => lcm(acc, val));
}

export function main() {
  let filename = "example3.txt";
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
