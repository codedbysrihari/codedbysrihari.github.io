// Run with Node 20+. The training file is written to the supplied path.
import { readFile, open } from 'node:fs/promises';
import { advance, decide, initialState, loadPolicy } from './planner.mjs';

const bytes = await readFile(new URL('ppo.bin', import.meta.url));
const policy = loadPolicy(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const out = await open(process.argv[2] || 'demonstrations.jsonl', 'w');
let examples = 0;
try {
  for (const layout of ['open', 'gates']) {
    for (let trial = 0; trial < 96; trial++) {
      let state = initialState(Math.imul(6101 + trial, 2654435761) >>> 0, layout);
      while (!state.end) {
        const thought = decide(policy, state, 'uniform', 32);
        if (thought.simulations && state.turns % 2 === 0) {
          await out.write(JSON.stringify({ body: state.body, food: state.food, walls: Array.from(state.walls.keys()).filter(i => state.walls[i]),
            legal: thought.legal, visits: thought.visits })+'\n');
          examples++;
        }
        state = advance(state, thought.action);
      }
    }
  }
} finally { await out.close(); }
console.log('Generated', examples, 'search-labelled positions from 192 episodes.');
