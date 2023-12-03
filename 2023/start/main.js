const path = require("path");
const { fileToLines } = require("../utils");

function solvePart1(lines) {
  return undefined;
}

function solvePart2(lines) {
  return undefined;
}

async function main() {
  let filename = "example.txt";
  filename = "input.txt";

  const lines = await fileToLines(path.resolve(__dirname, filename));

  const part1 = solvePart1(lines);
  const part2 = solvePart2(lines);

  console.log("part1:", part1);
  console.log("part2:", part2);
}

main();
