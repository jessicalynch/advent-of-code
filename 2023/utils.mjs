import * as fs from "fs";

export const fileToLines = (file) => {
  const data = fs.readFileSync(file, "utf-8");
  return data?.split("\n");
};

export const withTimer =
  (fn) =>
  (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`Time to run ${fn.name}: ${end - start} ms`);
    return result;
  };
