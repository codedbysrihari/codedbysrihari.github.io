// Run with Node 20+ beside planner.mjs and ppo.bin.
import { readFile, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { advance, decide, initialState, loadPolicy, LAYOUTS, LIMIT, MODES } from './planner.mjs';

async function binary(name) {
  const bytes = await readFile(new URL(name, import.meta.url));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}
const model = loadPolicy(await binary('ppo.bin'), await binary('student.bin'));
const trials = Number(process.argv[2] ?? 32), firstSeed = Number(process.argv[3] ?? 87041);
if (!Number.isInteger(trials) || trials < 1 || !Number.isInteger(firstSeed)) throw Error('Expected an episode count and integer starting seed');
const simulations = 32, results = [];
for (const layout of Object.keys(LAYOUTS)) {
  for (const mode of Object.keys(MODES)) {
    const episodes = [], start = performance.now();
    for (let i = 0; i < trials; i++) {
      // Spread consecutive episode numbers through the generator's initial states.
      const seed = Math.imul(firstSeed+i, 2654435761) >>> 0;
      let state = initialState(seed, layout);
      let simulationCount = 0;
      while (!state.end) {
        const decision = decide(model, state, mode, simulations);
        simulationCount += decision.simulations;
        state = advance(state, decision.action);
      }
      episodes.push({ seed, apples: state.score, decisions: state.turns, simulations: simulationCount, end: state.end });
    }
    const mean = episodes.reduce((a,e) => a + e.apples, 0) / trials;
    results.push({ layout, mode, episodes, mean });
    console.log(layout, mode, mean.toFixed(2), 'apples in', ((performance.now()-start)/1000).toFixed(1), 'seconds');
  }
}
const report = { trials, firstSeed, simulations, moveLimit: LIMIT, results };
await writeFile(new URL('benchmark.json', import.meta.url), JSON.stringify(report));
