import * as fs from "fs";

export const readFile = (file) => fs.readFileSync(file, "utf-8");

export const fileToLines = (file) =>
  readFile(file)
    ?.split("\n")
    .filter((line) => line.trim().length);

export const withTimer =
  (fn) =>
  (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`Time to run ${fn.name}: ${end - start} ms`);
    return result;
  };
