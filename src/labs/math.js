export function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

export function linear(x, weights, bias) {
  return weights.map((row, i) => dot(x, row) + bias[i]);
}

export function softmax(x) {
  const peak = Math.max(...x);
  const exponentials = x.map(v => Math.exp(v - peak));
  const total = exponentials.reduce((sum, v) => sum + v, 0);
  return exponentials.map(v => v / total);
}

export function percent(fraction) {
  return (100 * fraction).toFixed(1) + '%';
}
