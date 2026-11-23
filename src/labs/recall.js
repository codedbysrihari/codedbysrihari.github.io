import { dot, linear, seeded, softmax } from './math.js';

export function makeRecords(seed, length, vocabulary) {
  const random = seeded(seed);
  const keys = Array.from({ length: vocabulary }, (_, i) => i);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys.slice(0, length).map(key => ({ key, value: Math.floor(random() * 10) }));
}

function unit(x) {
  const scale = Math.hypot(...x);
  return x.map(v => v / scale);
}

function layerNorm(x) {
  const mean = x.reduce((sum, v) => sum + v, 0) / x.length;
  const variance = x.reduce((sum, v) => sum + (v - mean) ** 2, 0) / x.length;
  return x.map(v => (v - mean) / Math.sqrt(variance + 1e-5));
}

export function indexPages(model, records) {
  const pages = [];
  for (let p = 0; p < records.length; p += model.pageSize) {
    const items = records.slice(p, p + model.pageSize);
    const vectors = items.map(r => unit(model.weights['route_key.weight'][r.key]));
    const signature = vectors[0].map((_, d) => vectors.reduce((sum, vector) => sum + vector[d], 0));
    pages.push({ items, signature });
  }
  return pages;
}

function read(weights, query, records) {
  const q = weights['query.weight'][query];
  const attention = softmax(records.map(r => dot(q, weights['key.weight'][r.key]) / Math.sqrt(q.length)));
  const h = layerNorm(q.map((v, d) => v + records.reduce((sum, r, i) =>
    sum + attention[i] * weights['value.weight'][r.value][d], 0)));
  const hidden = linear(h, weights['expand.weight'], weights['expand.bias']).map(Math.tanh);
  const residual = linear(hidden, weights['contract.weight'], weights['contract.bias']);
  const output = layerNorm(h.map((v, d) => v + residual[d]));
  const probabilities = softmax(linear(output, weights['classify.weight'], weights['classify.bias']));
  const prediction = probabilities.indexOf(Math.max(...probabilities));
  return { prediction, probabilities, attention };
}

export function queryMemory(model, pages, key, budget) {
  const address = unit(model.weights['route_query.weight'][key]);
  const scores = pages.map(p => 6 * dot(address, p.signature));
  const ranked = scores.map((score, index) => ({ score, index })).sort((a, b) => b.score - a.score);
  const probabilities = softmax(scores);
  const threshold = model.thresholds[pages.length * model.pageSize];
  let precedingMass = 0;
  const selected = [];
  for (const page of ranked) {
    if (budget === 'adaptive' ? precedingMass > threshold : selected.length >= budget) break;
    selected.push(page.index);
    precedingMass += probabilities[page.index];
  }
  return {
    selected,
    routeProbabilities: probabilities,
    sparse: read(model.weights, key, selected.flatMap(i => pages[i].items)),
    dense: read(model.weights, key, pages.flatMap(p => p.items))
  };
}
