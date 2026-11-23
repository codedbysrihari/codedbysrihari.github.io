// The arena and the offline benchmark share the environment, network and search.
export const SIZE = 10;
export const LIMIT = 180;
export const DIRECTIONS = ['Up', 'Right', 'Down', 'Left'];
export const MODES = { adaptive: 'Adaptive student + search', puct: 'PPO + tree search', student: 'Distilled policy', raw: 'Original PPO', masked: 'Masked PPO', uniform: 'Search without PPO' };
export const SEARCH_THRESHOLD = 0.80;
export const LAYOUTS = { open: 'Open board', gates: 'Staggered gates', islands: 'Islands' };
const offsets = [-SIZE, 1, SIZE, -1];
const adjacency = Array.from({ length: 100 }, (_, cell) => offsets.map((d, a) => {
  const next = cell + d;
  if (next < 0 || next >= 100 || (a === 1 && cell % SIZE === 9) || (a === 3 && cell % SIZE === 0)) return -1;
  return next;
}));

function unpack(buffer, shapes) {
  const values = new Float32Array(buffer);
  let pos = 0;
  function take(n) {
    const view = values.subarray(pos, pos+n);
    pos += n;
    if (view.length !== n) throw new Error('Incomplete policy checkpoint');
    return view;
  }
  const branches = shapes.map(([inputs, outputs]) => ({
    input: take(inputs*64), b1: take(64), hidden: take(64*64), b2: take(64), head: take(64*outputs), b3: take(outputs)
  }));
  if (pos !== values.length) throw new Error('Unexpected policy checkpoint shape');
  return branches;
}

export function loadPolicy(buffer, studentBuffer) {
  const [actor, critic] = unpack(buffer, [[300,4],[300,1]]);
  const student = studentBuffer ? unpack(studentBuffer, [[400,4]])[0] : null;
  return { actor, critic, student };
}

function forward(network, active) {
  const first = Float64Array.from(network.b1);
  for (const feature of active) {
    const start = feature * 64;
    for (let j = 0; j < 64; j++) first[j] += network.input[start+j];
  }
  const second = Float64Array.from(network.b2);
  for (let i = 0; i < 64; i++) {
    const value = Math.tanh(first[i]);
    for (let j = 0; j < 64; j++) second[j] += value * network.hidden[i*64+j];
  }
  const output = Array.from(network.b3);
  for (let i = 0; i < 64; i++) {
    const value = Math.tanh(second[i]);
    for (let j = 0; j < output.length; j++) output[j] += value * network.head[i*output.length+j];
  }
  return output;
}

export function infer(model, state, withValue = true, student = false) {
  const active = state.body.map((cell,i) => cell*3 + Number(i === 0));
  if (state.food >= 0) active.push(state.food*3+2);
  if (student) {
    for (let i = 0; i < 100; i++) if (state.walls[i]) active.push(300+i);
    return { logits: forward(model.student, active), value: 0 };
  }
  return { logits: forward(model.actor, active), value: withValue ? forward(model.critic, active)[0] : 0 };
}

function spawnFood(state) {
  const busy = state.walls.slice();
  for (const cell of state.body) busy[cell] = 1;
  const free = [];
  for (let i = 0; i < busy.length; i++) if (!busy[i]) free.push(i);
  if (!free.length) return { ...state, food: -1, end: 'Board filled' };
  const rng = (Math.imul(1664525, state.rng) + 1013904223) >>> 0;
  return { ...state, rng, food: free[Math.floor(rng / 4294967296 * free.length)] };
}

export function initialState(seed, layout = 'open') {
  const walls = new Uint8Array(100);
  const obstacles = { open: [], gates: [13,23,33,43,66,76,86,96], islands: [22,23,32,68,77,78,71,81] };
  for (const cell of obstacles[layout]) walls[cell] = 1;
  return spawnFood({ body: [55,54,53], direction: 1, food: -1, score: 0, turns: 0, walls, rng: seed >>> 0, end: '' });
}

function collision(state, dest) {
  if (dest < 0) return 'Edge collision';
  if (state.walls[dest]) return 'Obstacle collision';
  const index = state.body.indexOf(dest);
  if (index >= 0 && (index < state.body.length-1 || dest === state.food)) return 'Body collision';
  return '';
}

export function legalActions(state) {
  if (state.end) return [];
  return [0,1,2,3].filter(a => a !== (state.direction+2)%4 && !collision(state, adjacency[state.body[0]][a]));
}

// Search stops at food. Only a committed real action samples the next food.
function simulate(state, action) {
  const direction = action === (state.direction+2)%4 ? state.direction : action;
  const dest = adjacency[state.body[0]][direction], end = collision(state, dest);
  const turns = state.turns + 1;
  if (end) return { ...state, turns, end };
  const ate = dest === state.food;
  const body = [dest, ...state.body];
  if (!ate) body.pop();
  return { ...state, direction, body, turns, score: state.score + Number(ate),
    food: ate ? -1 : state.food, end: turns >= LIMIT ? 'Move limit' : '' };
}

export function advance(state, action) {
  if (state.end) return state;
  const next = simulate(state, action);
  return next.food < 0 ? spawnFood(next) : next;
}

function softmax(values) {
  const max = Math.max(...values);
  const exps = values.map(v => Math.exp(v-max));
  const total = exps.reduce((a,b) => a+b, 0);
  return exps.map(v => v/total);
}

function spaceAndDistance(state) {
  const blocked = state.walls.slice();
  for (let i = 1; i < state.body.length-1; i++) blocked[state.body[i]] = 1;
  const queue = new Uint8Array(100), distance = new Uint8Array(100);
  const head = state.body[0];
  let tail = 1, foodDistance = 24;
  queue[0] = head;
  blocked[head] = 1;
  for (let at = 0; at < tail; at++) {
    const cell = queue[at];
    if (cell === state.food) foodDistance = distance[cell];
    for (const next of adjacency[cell]) {
      if (next < 0 || blocked[next]) continue;
      queue[tail++] = next;
      distance[next] = distance[cell]+1;
      blocked[next] = 1;
    }
  }
  return { space: tail, distance: foodDistance };
}

function expand(model, state, learned, prediction) {
  const actions = legalActions(state);
  const node = { state, visits: 0, value: -1.8, edges: [] };
  const { space, distance } = spaceAndDistance(state);
  const confinement = Math.max(0, 1 - space/(state.body.length+3));
  if (state.food < 0) {
    node.value = 1.4 - 1.8*confinement - (actions.length || state.end ? 0 : 1.7);
    return node;
  }
  if (!actions.length) {
    if (state.end === 'Move limit') node.value = 0;
    return node;
  }
  const policy = learned ? (prediction || infer(model, state)) : null;
  const priors = learned ? softmax(actions.map(a => policy.logits[a]/1.6)) : actions.map(() => 1/actions.length);
  node.value = .78 / (1 + .24*distance) - 1.5*confinement + (learned ? .12*Math.tanh(policy.value/50) : 0);
  node.edges = actions.map((action,i) => ({ action, prior: .8*priors[i]+.2/actions.length, visits: 0, sum: 0, child: null }));
  return node;
}

function mostVisited(edges) {
  return edges.reduce((best, e) => !best || e.visits > best.visits ||
    (e.visits === best.visits && e.sum > best.sum) ? e : best, null);
}

export function decide(model, state, mode = 'puct', simulations = 32) {
  const legal = legalActions(state);
  const student = mode === 'student' || mode === 'adaptive';
  const policy = infer(model, state, mode === 'puct', student);
  const probabilities = student && legal.length
    ? softmax(policy.logits.map((logit, i) => legal.includes(i) ? logit : -Infinity))
    : softmax(policy.logits);
  const allowed = mode === 'raw' || !legal.length ? [0,1,2,3] : legal;
  const preferred = allowed.reduce((a,b) => policy.logits[a] >= policy.logits[b] ? a : b);
  const result = { action: preferred, probabilities, legal, visits: [0,0,0,0], path: [], simulations: 0 };
  // When the distilled policy splits its probability across legal moves,
  // query its uniform-prior search teacher on this position.
  const consultTeacher = mode === 'adaptive' && probabilities[preferred] < SEARCH_THRESHOLD;
  if ((!consultTeacher && mode !== 'puct' && mode !== 'uniform') || !legal.length) return result;
  const learned = mode === 'puct';
  const root = expand(model, state, learned, policy);
  for (let trial = 0; trial < simulations; trial++) {
    let node = root;
    const path = [];
    while (node.edges.length && path.length < 10) {
      let edge = null, best = -Infinity;
      for (const e of node.edges) {
        const mean = e.visits ? e.sum/e.visits : node.value;
        const score = mean + .9*e.prior*Math.sqrt(1+node.visits)/(1+e.visits);
        if (score > best) { best = score; edge = e; }
      }
      path.push([node,edge]);
      if (!edge.child) {
        node = edge.child = expand(model, simulate(node.state, edge.action), learned);
        break;
      }
      node = edge.child;
    }
    let value = node.value;
    for (let i = path.length-1; i >= 0; i--) {
      const [parent,e] = path[i];
      value = -.014 + .985*value;
      parent.visits++;
      e.visits++;
      e.sum += value;
    }
  }
  result.simulations = simulations;
  for (const edge of root.edges) result.visits[edge.action] = edge.visits;
  let edge = mostVisited(root.edges);
  result.action = edge.action;
  while (edge?.child && edge.visits) {
    result.path.push(edge.child.state.body[0]);
    edge = mostVisited(edge.child.edges);
  }
  return result;
}
