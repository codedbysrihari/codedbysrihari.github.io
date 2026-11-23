import { useEffect, useMemo, useRef, useState } from 'react';
import './planning.css';

const upstream = 'https://github.com/codedbysrihari/rl-snake-agent/tree/5a89df0c37955c11fef679d40676e7c01be78dde';

function SnakeBoard({ state, path, showPath }) {
  const xy = cell => [cell % 10, Math.floor(cell / 10)];
  const [hx,hy] = xy(state.body[0]);
  const eyes = [[[.27,.21],[.66,.21]], [[.64,.26],[.64,.64]], [[.27,.66],[.66,.66]], [[.20,.26],[.20,.64]]];
  const route = [state.body[0], ...(showPath ? path : [])].map(cell => xy(cell).map(v=>v+.5).join(',')).join(' ');
  return <svg className="agent-board" viewBox="0 0 10 10" role="img"
    aria-label={'Snake board. Head at row '+(hy+1)+', column '+(hx+1)+'. Length '+state.body.length+', score '+state.score+'.'}>
    <defs><pattern id="agent-grid" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0H0V1" fill="none" stroke="#35423b" strokeWidth=".025"/></pattern></defs>
    <rect width="10" height="10" fill="#202b26"/><rect width="10" height="10" fill="url(#agent-grid)"/>
    {Array.from(state.walls,(wall,i) => wall ? <g key={i}><rect x={i%10+.07} y={Math.floor(i/10)+.07} width=".86" height=".86" rx=".08" fill="#64655f"/><path d={'M'+(i%10+.22)+' '+(Math.floor(i/10)+.72)+'l.50-.50'} stroke="#93958b" strokeWidth=".055"/></g> : null)}
    {state.body.map((cell,i) => <rect key={cell} x={cell%10+.07} y={Math.floor(cell/10)+.07} width=".86" height=".86" rx=".12"
      fill={i===0 ? '#dce8b5' : '#a6bd94'} opacity={i===0 ? 1 : .95-.32*i/state.body.length}/>)}
    {eyes[state.direction].map(([x,y])=><rect key={x+','+y} x={hx+x} y={hy+y} width=".13" height=".13" fill="#27362b"/>)}
    {state.food>=0 && <g transform={'translate('+(state.food%10)+','+Math.floor(state.food/10)+')'}>
      <path d="M.24 .34h.53v.42h-.1v.09h-.33V.76h-.1z" fill="#f0a388"/><path d="M.5 .35V.19h.16" fill="none" stroke="#bbd5a7" strokeWidth=".09"/></g>}
    {showPath && path.length>0 && <polyline points={route} fill="none" stroke="#efe0a1" strokeWidth=".09" strokeDasharray=".14 .14" strokeLinecap="round"/>}
  </svg>;
}

function Episode({ engine, model, benchmark }) {
  const seeds = benchmark.results[0].episodes.map(e=>e.seed);
  const [layout,setLayout] = useState('open'), [seed,setSeed] = useState(seeds[0]);
  const [mode,setMode] = useState('adaptive'), [budget,setBudget] = useState(32);
  const [metric, setMetric] = useState('apples');
  const [state,setState] = useState(() => engine.initialState(seeds[0], 'open'));
  const [running,setRunning] = useState(false), [showPath,setShowPath] = useState(true);
  const viewer = useRef(null);
  const thought = useMemo(() => state.end ? null : engine.decide(model,state,mode,budget), [engine,model,state,mode,budget]);
  const searching = ['adaptive','puct','uniform'].includes(mode);
  const student = mode === 'adaptive' || mode === 'student';

  useEffect(() => {
    if (!running || !thought) return;
    const id = setTimeout(() => setState(s => engine.advance(s,thought.action)), 165);
    return () => clearTimeout(id);
  }, [running,thought,engine]);
  useEffect(() => { if (state.end) setRunning(false); }, [state.end]);
  useEffect(() => {
    const pause = () => setRunning(false);
    const hidden = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
    observer.observe(viewer.current);
    document.addEventListener('visibilitychange',hidden);
    window.addEventListener('blur',pause);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange',hidden); window.removeEventListener('blur',pause); };
  }, []);

  function restart(nextLayout = layout, nextSeed = seed) {
    setRunning(false); setLayout(nextLayout); setSeed(nextSeed); setState(engine.initialState(nextSeed,nextLayout));
  }
  function chooseMode(nextMode) { setRunning(false); setMode(nextMode); }
  return <>
    <section className="agent-block" aria-labelledby="arena-title">
      <h2 id="arena-title">Inspect a decision</h2>
      <p>Step through a game to see where the policy wants to go and which branches the search actually explores. Switch controllers to compare their next move on the same position.</p>
      <div className="agent-options">
        <label>Controller<select value={mode} onChange={e=>chooseMode(e.target.value)}>{Object.entries(engine.MODES).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
        <label>Board<select value={layout} onChange={e=>restart(e.target.value,seed)}>{Object.entries(engine.LAYOUTS).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
        <label>Search budget<select value={budget} disabled={!searching} onChange={e=>{setRunning(false);setBudget(Number(e.target.value));}}>{[16,32,64].map(n=><option key={n} value={n}>{n} simulations</option>)}</select></label>
        <label>Episode seed<select value={seed} onChange={e=>restart(layout,Number(e.target.value))}>{seeds.map(s=><option key={s}>{s}</option>)}</select></label>
      </div>
      <div className="agent-view" ref={viewer}>
        <div className="agent-field"><SnakeBoard state={state} path={thought?.path || []} showPath={showPath && searching}/>
          <div className="agent-counter"><span><b>{state.score}</b> apples</span><span>Move <b>{state.turns}</b> / {engine.LIMIT}</span></div>
        </div>
        <div className="agent-decision">
          <h3>{state.end || ('Next move · '+engine.DIRECTIONS[thought.action])}</h3>
          <table><thead><tr><th>Move</th><th>{student ? 'Student' : 'PPO'}</th><th>Visits</th></tr></thead>
          <tbody>{engine.DIRECTIONS.map((name,i)=><tr key={name} className={thought?.action===i ? 'agent-choice' : ''}>
            <th scope="row">{name}{thought && !thought.legal.includes(i) && <small>Blocked</small>}</th>
            <td>{thought ? Math.round(100*thought.probabilities[i])+'%' : '—'}</td><td>{searching && thought ? thought.visits[i] : '—'}</td>
          </tr>)}</tbody></table>
          <p className="agent-explain">{mode==='adaptive' ? (!thought ? 'The episode has ended.' : !thought.legal.length ? 'Every move leads to a collision.' :
            thought.simulations ? 'No legal move reached the confidence threshold. The search teacher used '+thought.simulations+' simulations to choose this move.' :
            'The student assigned at least '+Math.round(engine.SEARCH_THRESHOLD*100)+'% to one legal move and chose it in one forward pass.') :
            mode==='raw' ? 'The original actor picks its highest-probability action. The environment ignores reversals.' :
            mode==='masked' ? 'Immediate collisions and reversals are removed before the PPO actor picks its move.' :
            mode==='student' ? 'One forward pass imitates a search teacher. Its extra input channel marks obstacles, and a legality mask filters its actions.' :
            mode==='uniform' ? 'Search starts with equal legal-action priors. The PPO probabilities are shown for comparison.' :
            'The PPO actor guides exploration. Branch visits determine the move. The dotted line follows the most-visited continuation.'}</p>
          {thought?.simulations > 0 && <label className="agent-path"><input type="checkbox" checked={showPath} onChange={e=>setShowPath(e.target.checked)}/>Show explored continuation</label>}
        </div>
      </div>
      <div className="agent-buttons">
        <button type="button" className="agent-primary" onClick={()=>{ if (state.end) restart(); setRunning(!running); }}>{state.end ? 'Replay episode' : running ? 'Pause' : 'Run episode'}</button>
        <button type="button" disabled={running || !!state.end} onClick={()=>setState(s=>engine.advance(s,thought.action))}>Step once</button>
        <button type="button" onClick={()=>restart()}>Restart seed</button>
        <span role="status">{state.end || (running ? 'Running' : 'Paused')}</span>
      </div>
    </section>
    <section className="agent-block"><h2>Paired evaluation</h2>
      <p>Each controller plays the same {benchmark.trials} seeds per board with a {benchmark.moveLimit}-move cap. Every search call uses {benchmark.simulations} simulations. Compare score and search effort to see where extra planning pays off.</p>
      <div className="agent-options"><label>Benchmark metric<select value={metric} onChange={e => setMetric(e.target.value)}>
        <option value="apples">Mean apples per episode</option><option value="simulations">Mean search simulations per move</option>
      </select></label></div>
      <div className="agent-evaluation"><table><thead><tr><th>Controller</th>{Object.values(engine.LAYOUTS).map(label=><th key={label}>{label}</th>)}</tr></thead>
        <tbody>{Object.entries(engine.MODES).map(([key,label])=><tr key={key} className={key===mode?'agent-choice':''}><th scope="row">{label}</th>
          {Object.keys(engine.LAYOUTS).map(id => {
            const row = benchmark.results.find(r => r.mode === key && r.layout === id);
            const sum = field => row.episodes.reduce((total, episode) => total + episode[field], 0);
            const value = metric === 'apples' ? row.mean : sum('simulations') / sum('decisions');
            return <td key={id}>{value.toFixed(2)}</td>;
          })}</tr>)}</tbody></table></div>
      <p className="agent-explain">The original PPO checkpoint trained on an open 10×10 board. The student saw open boards and staggered gates during distillation. Islands are a held-out layout. Food is sampled from each controller’s free cells as its episode unfolds.</p>
    </section>
  </>;
}

async function resource(base, file, signal, binary = false) {
  const response = await fetch(new URL(file,base), { signal });
  if (!response.ok) throw new Error('Could not load '+file);
  return binary ? response.arrayBuffer() : response.json();
}

export default function PlanningArena({ assets = './planning/' }) {
  const base = new URL(assets,document.baseURI).href;
  const [loaded,setLoaded] = useState(null), [error,setError] = useState(false), [attempt,setAttempt] = useState(0);
  useEffect(() => {
    const abort = new AbortController(), src = new URL('planner.mjs',base).href;
    setError(false);
    Promise.all([import(/* @vite-ignore */ src), resource(base,'ppo.bin',abort.signal,true),
      resource(base,'student.bin',abort.signal,true),resource(base,'benchmark.json',abort.signal)])
      .then(([engine,bytes,student,benchmark])=>{ if (!abort.signal.aborted) setLoaded({engine,model:engine.loadPolicy(bytes,student),benchmark}); })
      .catch(()=>{ if (!abort.signal.aborted) setError(true); });
    return ()=>abort.abort();
  },[base,attempt]);
  return <div className="snake-agent-lab">
    {loaded ? <Episode {...loaded}/> : error ? <p role="alert">The arena could not load its model files. <button onClick={()=>setAttempt(v=>v+1)}>Retry</button></p> : <p role="status">Loading trained policies…</p>}
    <section className="agent-block"><h2>From policy to planner</h2>
      <ol className="agent-method">
        <li><strong>Keep the original actor and critic.</strong> Both networks use the published weights from the five-stage PPO curriculum. Their observations encode the snake’s body, head, and food. Obstacle geometry enters through the simulator.</li>
        <li><strong>Search possible futures.</strong> PUCT balances a branch’s mean return with its action prior and visit count. Each simulation follows legal moves up to ten plies. The leaf estimate combines the critic with reachable space and food distance. Search ends at the current apple, before another food location is drawn.</li>
        <li><strong>Distil search into a policy.</strong> A uniform-prior teacher supplied visit counts for 17,195 positions. Four board rotations also rotate the action targets. Starting from the PPO actor, the student learns those distributions in 1,400 updates. The student runs without tree expansion.</li>
        <li><strong>Choose when to search.</strong> The adaptive controller uses the student’s probabilities over legal moves. Below an 80% top probability it asks the teacher to search. The threshold applies to the student’s action distribution. Apple collection is measured separately in the benchmark.</li>
      </ol>
      <p>Background reading covers PPO, policy-guided tree search, and expert iteration. <a href="https://arxiv.org/abs/1707.06347">PPO</a> · <a href="https://arxiv.org/abs/1712.01815">AlphaZero</a> · <a href="https://arxiv.org/abs/1705.08439">Expert Iteration</a></p>
    </section>
    <section className="agent-block"><h2>Reproduce the experiment</h2>
      <p>Extract the experiment files into one directory. With Node 20 or newer, run the evaluation using the supplied weights. The optional distillation run uses Python 3.9, NumPy 1.26.4, and PyTorch 2.2.2.</p>
      <pre><code>{'node benchmark.mjs\n\n# Regenerate demonstrations and refit the student\nnode make_demonstrations.mjs demonstrations.jsonl\npython distill.py demonstrations.jsonl\nnode benchmark.mjs'}</code></pre>
      <div className="agent-links"><a href={base+'experiment.zip'} download>Download experiment</a><a href={base+'benchmark.json'} download>Per-episode results</a><a href={upstream}>Original PPO project</a></div>
    </section>
  </div>;
}
