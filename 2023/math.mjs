export const getTotalPairs = (n) => (n * (n - 1)) / 2;

export const getXIntercepts = (a, b, c) => {
  var x1 = (-1 * b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
  var x2 = (-1 * b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
  return [x1, x2];
};

export const WFI = (coords) => {
  let n = coords.length;
  let dists = Array.from({ length: n }, () => Array(n).fill(Infinity));

  for (let i = 0; i < n; i++) {
    dists[i][i] = 0;
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i == j) {
        continue;
      }
      let [xi, yi] = coords[i].split(",").map(Number);
      let [xj, yj] = coords[j].split(",").map(Number);
      dists[i][j] = Math.abs(xi - xj) + Math.abs(yi - yj);
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dists[i][k] + dists[k][j] < dists[i][j]) {
          dists[i][j] = dists[i][k] + dists[k][j];
        }
      }
    }
  }

  return dists;
};
