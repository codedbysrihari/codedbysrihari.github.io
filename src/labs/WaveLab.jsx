import { useMemo, useState } from 'react';
import { initialWave, relativeError, rollout } from './waves.js';
import { percent } from './math.js';

const series = [['reference','Reference'], ['prediction','Neural operator'], ['coarse','Coarse solver']];
function WavePlot({ frame, initial, steps }) {
  const W = 760, H = 235, left = 48, right = 18, top = 13, bottom = 30;
  const bound = Math.max(1, Math.ceil(2*Math.max(...[...initial,...frame.prediction,...frame.reference,...frame.coarse].map(Math.abs)))/2);
  const y = value => top + (H-top-bottom) * (.5-value/(2*bound));
  const path = field => field.map((v,i) => (i?'L':'M') + (left+(W-left-right)*i/(field.length-1)).toFixed(2) + ',' + y(v).toFixed(2)).join(' ');
  return <figure className="wave-figure">
    <figcaption className="sheet-caption"><strong>Velocity along the periodic domain</strong><span>t = {(steps*.1).toFixed(1)}</span></figcaption>
    <svg className="wave-plot" viewBox={'0 0 '+W+' '+H} role="img" aria-label={'Wave velocity after '+steps+' steps. Error values are below the plot.'}>
      {[-bound,0,bound].map(v => <g key={v}><line x1={left} x2={W-right} y1={y(v)} y2={y(v)}/><text x={left-9} y={y(v)+4} textAnchor="end">{v}</text></g>)}
      {['0','π','2π'].map((v,i) => <text key={v} x={left+i*(W-left-right)/2} y={H-7} textAnchor="middle">{v}</text>)}
      <path className="initial" d={path(initial)}/>
      {['coarse','prediction','reference'].map(k => <path className={k} key={k} d={path(frame[k])}/>)}
    </svg>
    <div className="plot-legend">{[['initial','Initial'],...series].map(([k,label]) => <span key={k}><i className={k}/>{label}</span>)}</div>
  </figure>;
}

export default function WaveLab({ model }) {
  const [seed, setSeed] = useState(72);
  const [stress, setStress] = useState(false);
  const [steps, setSteps] = useState(5);
  const frames = useMemo(() => rollout(model, initialWave(seed, model.fine, stress)), [model, seed, stress]);
  const frame = frames[steps], start = frames[0].reference;
  return <>
    <section className="experiment" aria-labelledby="demo-heading">
      <h2 id="demo-heading">Forecast a wave</h2>
      <p>Watch a periodic wave steepen and dissipate. Move the forecast horizon to see how small one-step errors accumulate.</p>
      <div className="lab-controls">
        <label>Initial frequencies<select value={stress ? 'high' : 'training'} onChange={e => setStress(e.target.value==='high')}>
          <option value="training">Training band · modes 1–5</option><option value="high">Stress test · modes 9, 12, 14</option></select></label>
        <label className="horizon-control">Forecast horizon <strong>{steps} {steps===1 ? 'step' : 'steps'}</strong>
          <input type="range" min="1" max="8" value={steps} onChange={e => setSteps(Number(e.target.value))}
            aria-label="Forecast steps" aria-valuetext={steps + ' steps, time ' + (steps*model.dt).toFixed(1)}/></label>
        <button type="button" className="lab-button" onClick={() => setSeed(s => s+1)}>New initial wave</button>
      </div>
      <WavePlot frame={frame} initial={start} steps={steps}/>
      <div className="live-results" aria-live="polite" aria-atomic="true">
        {[['Neural operator',frame.prediction],['Coarse solver',frame.coarse],['Unchanged input',start]].map(([label,field]) =>
          <div key={label}><small>{label} · relative L2 error</small><strong>{percent(relativeError(field,frame.reference))}</strong></div>)}
      </div>
      <p className="result-note">{stress ? 'These starting frequencies are outside the training distribution. The learned spectral branch keeps modes 0–9. Compare the resulting trajectory with the reference.' : 'The reference advances 128 cells and averages adjacent pairs onto the 64-cell prediction grid. All three forecasts start from the same coarse field.'}</p>
    </section>
    <section className="lab-section"><h2>Held-out forecasts</h2>
      <p>Mean relative L2 error across {model.testFields} unseen initial waves drawn from the training band. Each model rollout feeds its own previous prediction into the next step.</p>
      <div className="table-scroll"><table><thead><tr><th>Forecast horizon</th><th>Neural operator</th><th>Coarse solver</th><th>Unchanged input</th></tr></thead>
        <tbody>{model.benchmark.filter(r=>[1,4,8,steps].includes(r.steps)).map(r=><tr className={r.steps === steps ? 'selected-result' : ''} key={r.steps}>
          <th scope="row">{r.steps} {r.steps === 1 ? 'step' : 'steps'}</th><td>{percent(r.operator)}</td><td>{percent(r.coarse)}</td><td>{percent(r.persistence)}</td></tr>)}</tbody></table></div>
    </section>
    <section className="lab-section method"><h2>Inside the operator</h2>
      <p>A {model.parameters.toLocaleString()}-parameter Fourier neural operator learns one time step of the periodic viscous Burgers equation. A wave’s local speed depends on its height, so taller sections can catch up with the sections ahead.</p>
      <div className="equation" aria-label="Time derivative of u plus u times its spatial derivative equals viscosity times its second spatial derivative">∂u/∂t + u ∂u/∂x = ν ∂²u/∂x²</div>
      <ol><li><strong>Generate trajectories.</strong> A finite-volume solver with Rusanov flux, centered diffusion, and second-order Runge–Kutta stepping generates eight transitions for each of {model.trainFields} training waves. Viscosity is fixed at {model.nu} and each forecast step spans {model.dt} time units.</li>
        <li><strong>Learn the update.</strong> Lift velocity into 12 channels. Two layers combine pointwise mixing with learned complex weights on ten Fourier modes. A nonlinear projection pipeline predicts the increment, whose spatial mean is removed to conserve mean velocity.</li>
        <li><strong>Compare at equal output resolution.</strong> The 64-cell numerical baseline uses five solver substeps per forecast. The 128-cell reference uses 25. Errors measure agreement with that numerical reference.</li></ol>
      <p className="reading">The spectral layers follow the Fourier neural operator approach introduced by Li and colleagues. <a href="https://arxiv.org/abs/2010.08895">Fourier Neural Operator for Parametric Partial Differential Equations</a></p>
    </section>
  </>;
}
