import { useMemo, useState } from 'react';
import { indexPages, makeRecords, queryMemory } from './recall.js';
import { percent } from './math.js';

const keyLabel = id => 'K' + String(id).padStart(2, '0');
const strategies = [['adaptive', 'Adaptive pages'], ['1', 'One page'], ['2', 'Two pages'], ['dense', 'Dense reader']];

export default function RecallLab({ model }) {
  const [length, setLength] = useState(32);
  const [budget, setBudget] = useState('adaptive');
  const [seed, setSeed] = useState(173);
  const [index, setIndex] = useState(3);
  const records = useMemo(() => makeRecords(seed, length, model.keys), [seed, length, model]);
  const pages = useMemo(() => indexPages(model, records), [model, records]);
  const query = records[index];
  const result = useMemo(() => queryMemory(model, pages, query.key, budget), [model, pages, query, budget]);
  const benchmark = model.benchmark.find(row => row.length === length);
  const count = result.selected.length * model.pageSize;
  const pageHit = result.selected.includes(Math.floor(index / model.pageSize));
  return <>
    <section className="experiment" aria-labelledby="demo-heading">
      <h2 id="demo-heading">Query the memory</h2>
      <p>Each key has a randomly assigned digit. Choose a key, then see which pages the router lets the transformer read.</p>
      <div className="lab-controls">
        <label>Memory length<select value={length} onChange={event => { setLength(Number(event.target.value)); setIndex(3); }}>
          {[16,32,64].map(n => <option key={n} value={n}>{n} records</option>)}</select></label>
        <label>Query key<select value={index} onChange={event => setIndex(Number(event.target.value))}>
          {records.map((r,i) => <option key={r.key} value={i}>{keyLabel(r.key)}</option>)}</select></label>
        <label>Read budget<select value={budget} onChange={e => setBudget(e.target.value)}>
          {strategies.slice(0,3).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <button type="button" className="lab-button" onClick={() => setSeed(s => s+1)}>Shuffle memory</button>
      </div>
      <div className="memory-sheet">
        <div className="sheet-caption"><strong>Memory pages</strong><span className="selection-key">Opened by router</span></div>
        <div className="memory-map">{pages.map((page, i) =>
          <div className={'memory-page' + (result.selected.includes(i) ? ' chosen' : '')} key={i}>
            <div><strong>Page {i+1}</strong><small title="Router probability">{percent(result.routeProbabilities[i])}</small></div>
            <ul>{page.items.map(r => <li key={r.key} className={r.key === query.key ? 'queried' : ''}>
              <span>{keyLabel(r.key)}</span><b>{r.value}</b></li>)}</ul>
          </div>)}</div>
      </div>
      <div className="live-results" aria-live="polite" aria-atomic="true">
        <div><small>Requested digit</small><strong>{query.value}</strong></div>
        <div><small>Routed prediction</small><strong>{result.sparse.prediction}</strong></div>
        <div><small>Dense prediction</small><strong>{result.dense.prediction}</strong></div>
        <div><small>Routed scores / dense</small><strong>{pages.length + count} / {length}</strong></div>
      </div>
      <p className="result-note">{pageHit ? 'The router included the requested record.' : 'The router skipped the page containing the requested record.'} This query scored {pages.length} page signatures and {count} records. Page signatures can be reused for subsequent queries.</p>
    </section>

    <section className="lab-section"><h2>Held-out recall</h2>
      <p>Each row uses the same {benchmark.examples.toLocaleString()} unseen random memories of {length} records. Change the memory length above to inspect a different test. Training examples contained 32 records.</p>
      <div className="table-scroll"><table><thead><tr><th>Reader</th><th>Correct digit</th><th>Target page read</th><th>Mean scores / query</th></tr></thead>
        <tbody>{strategies.map(([k,label]) => {
          const row = benchmark.modes[k];
          return <tr key={k} className={k===budget ? 'selected-result' : ''}><th scope="row">{label}</th><td>{percent(row.correct/benchmark.examples)}</td>
            <td>{percent(row.included/benchmark.examples)}</td><td>{(row.scores/benchmark.examples).toFixed(1)}</td></tr>;
        })}</tbody></table></div>
      <p className="fine-print">Several keys can hold the same digit, so a missed page can still produce a correct guess. Score counts cover query-time dot products. Index construction, sorting, and elapsed time are separate costs.</p>
    </section>
    <section className="lab-section method"><h2>Inside the architecture</h2>
      <ol><li><strong>Index the memory.</strong> Group four key–value records per page. Sum their learned, unit-length address embeddings into one 12-dimensional signature.</li>
        <li><strong>Allocate the read budget.</strong> Rank signatures by their dot product with the query. The adaptive reader opens pages in order until their cumulative probability crosses a calibrated threshold.</li>
        <li><strong>Decode a digit.</strong> Run scaled dot-product cross-attention over the selected records, then apply residual connections, layer normalization, a feed-forward layer, and a ten-class readout. The dense comparison uses exactly the same reader weights.</li></ol>
      <p>The {model.parameters.toLocaleString()}-parameter model trained on synthetic associative recall with digit, address, and page supervision. Its key and digit vocabularies stay fixed across the splits. This experiment measures retrieval of new assignments within that vocabulary.</p>
      <p>For each supported length, 512 separate calibration memories set a 95% marginal page-inclusion target using a split-conformal quantile. The table reports the coverage actually observed on the test set.</p>
      <p className="reading">Background reading covers content-based sparse attention and adaptive prediction sets. <a href="https://aclanthology.org/2021.tacl-1.4/">Roy et al.</a> · <a href="https://arxiv.org/abs/2006.02544">Romano et al.</a></p>
    </section>
  </>;
}
