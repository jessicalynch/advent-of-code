import * as fs from "fs";

export const fileToLines = (file) => {
  const data = fs.readFileSync(file, "utf-8");
  return data?.split("\n");
};
