import { linear, seeded } from './math.js';

export function initialWave(seed, size, stress = false) {
  const random = seeded(seed);
  const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
  const wave = Array(size).fill(0);
  const modes = stress ? [9, 12, 14] : [1, 2, 3, 4, 5];
  for (const k of modes) {
    const a = gaussian() / k, b = gaussian() / k;
    for (let i = 0; i < size; i++) {
      const angle = 2 * Math.PI * k * (i + .5) / size;
      wave[i] += a * Math.cos(angle) + b * Math.sin(angle);
    }
  }
  const scale = (.7 + random()) / Math.max(...wave.map(Math.abs));
  return wave.map(v => v * scale);
}

export function coarseAverage(fine) {
  return Array.from({ length: fine.length / 2 }, (_, i) => (fine[2*i] + fine[2*i+1]) / 2);
}

export function finiteVolume(input, viscosity, interval, substeps) {
  const n = input.length, dx = 2 * Math.PI / n, dt = interval / substeps;
  function rhs(u) {
    const flux = u.map((a, i) => {
      const b = u[(i + 1) % n];
      return (a*a + b*b) / 4 - .5 * Math.max(Math.abs(a), Math.abs(b)) * (b-a);
    });
    return u.map((a, i) => {
      const prev = (i + n - 1) % n, next = (i + 1) % n;
      return (flux[prev] - flux[i]) / dx + viscosity * (u[next] - 2*a + u[prev]) / (dx*dx);
    });
  }
  let u = input;
  for (let step = 0; step < substeps; step++) {
    const first = rhs(u);
    const second = rhs(u.map((v, i) => v + dt * first[i]));
    u = u.map((v, i) => v + .5 * dt * (first[i] + second[i]));
  }
  return u;
}

function fourierBasis(size, modes) {
  return Array.from({ length: modes }, (_, k) => {
    const phases = Array.from({ length: size }, (_, x) => 2 * Math.PI * k * x / size);
    return { cos: phases.map(Math.cos), sin: phases.map(Math.sin) };
  });
}

function spectralLayer(h, basis, weights, layer) {
  const prefix = 'layers.' + layer;
  const real = weights[prefix + '.real'], imag = weights[prefix + '.imag'];
  const output = h.map(x => linear(x, weights[prefix + '.local.weight'], weights[prefix + '.local.bias']));
  const size = h.length, channels = h[0].length;
  for (let k = 0; k < basis.length; k++) {
    const { cos, sin } = basis[k];
    const re = Array(channels).fill(0), im = Array(channels).fill(0);
    for (let x = 0; x < size; x++) {
      for (let c = 0; c < channels; c++) {
        re[c] += h[x][c] * cos[x];
        im[c] -= h[x][c] * sin[x];
      }
    }
    for (let out = 0; out < channels; out++) {
      let mixedReal = 0, mixedImag = 0;
      for (let c = 0; c < channels; c++) {
        mixedReal += re[c] * real[k][c][out] - im[c] * imag[k][c][out];
        mixedImag += re[c] * imag[k][c][out] + im[c] * real[k][c][out];
      }
      const factor = (k === 0 ? 1 : 2) / size;
      for (let x = 0; x < size; x++) output[x][out] += factor * (mixedReal * cos[x] - mixedImag * sin[x]);
    }
  }
  return output.map(x => x.map(Math.tanh));
}

export function forecast(input, model, basis) {
  const w = model.weights;
  let h = input.map(v => linear([v], w['lift.weight'], w['lift.bias']));
  for (let layer = 0; layer < 2; layer++) h = spectralLayer(h, basis, w, layer);
  const increment = h.map(x => linear(x, w['project.weight'], w['project.bias'])[0]);
  const mean = increment.reduce((a,b) => a+b, 0) / increment.length;
  return input.map((v, i) => v + model.dt * (increment[i] - mean));
}

export function rollout(model, initial) {
  const basis = fourierBasis(model.grid, model.modes);
  let fine = initial;
  let prediction = coarseAverage(fine), coarse = prediction;
  const frames = [{ reference: prediction, prediction, coarse }];
  for (let i = 0; i < model.benchmark.length; i++) {
    prediction = forecast(prediction, model, basis);
    fine = finiteVolume(fine, model.nu, model.dt, 25);
    coarse = finiteVolume(coarse, model.nu, model.dt, 5);
    frames.push({ prediction, coarse, reference: coarseAverage(fine) });
  }
  return frames;
}

export function relativeError(field, truth) {
  return Math.hypot(...field.map((v, i) => v - truth[i])) / Math.hypot(...truth);
}
