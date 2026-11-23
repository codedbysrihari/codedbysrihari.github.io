import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import RecallLab from './RecallLab.jsx';
import WaveLab from './WaveLab.jsx';
import '../../assets/style.css';
import './lab.css';

const projects = {
  recall: { title: 'Adaptive Memory Transformer', field: 'Transformer architecture', file: 'recall', Component: RecallLab,
    intro: 'A transformer reader with a learned page index. Give it a key and it decides how much memory to open before predicting the stored value.' },
  waves: { title: 'Burgers Wave Operator', field: 'Scientific machine learning', file: 'waves', Component: WaveLab,
    intro: 'A neural network learns how a wave changes shape. Run its forecast beside a numerical solver, then try frequencies it never saw during training.' }
};

function ProjectLab({ project }) {
  const [model,setModel] = useState(null);
  const [error,setError] = useState(false);
  const [attempt,setAttempt] = useState(0);
  const { title, field, file, Component } = project;
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    fetch('./' + file + '.json', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Checkpoint unavailable');
        return response.json();
      })
      .then(data => { if (!controller.signal.aborted) setModel(data); })
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [file, attempt]);

  return <div className={'lab lab-' + file}>
    <a className="skip-link" href="#experiment">Skip to experiment</a>
    <header className="lab-nav"><a href="../index.html" className="monogram" aria-label="Srihari K, home">sk.</a>
      <a href="../index.html#projects">Project shelf</a><a href={'./train_'+file+'.py'} download>Training source</a></header>
    <main className="lab-main">
      <header className="lab-heading"><p className="lab-field">{field}</p><h1>{title}</h1><p>{project.intro}</p></header>
      <div id="experiment">{model ? <Component model={model}/> : error ?
        <div role="alert"><p>The model weights could not be loaded.</p><button className="lab-button" onClick={()=>setAttempt(n=>n+1)}>Retry loading</button></div> :
        <p role="status">Loading trained weights…</p>}</div>
      {model && <section className="lab-section reproduce"><h2>Reproduce the run</h2>
        <p>Download the trainer into a directory and run these commands with Python 3.9. It generates the dataset, trains the model on CPU, evaluates the held-out split, and writes <code>{file}.json</code> beside the script.</p>
        <pre><code>{'python -m pip install numpy==1.26.4 torch==2.2.2\npython train_'+file+'.py'}</code></pre>
        <p className="run-details">{model.steps} optimization steps · Batch size {model.batch} · Training seed {model.trainSeed} · Test seed {model.testSeed}</p>
        <div className="lab-links"><a href={'./train_'+file+'.py'} download>Download trainer</a><a href={'./'+file+'.json'} download>Weights and benchmark data</a></div>
      </section>}
    </main>
    <footer className="lab-footer"><a href="../index.html#projects">Back to the project shelf</a><a href={file==='recall' ? 'wave-operator.html' : 'adaptive-memory.html'}>{file==='recall' ? projects.waves.title : projects.recall.title}</a></footer>
  </div>;
}
const root = document.getElementById('root');
createRoot(root).render(<ProjectLab project={projects[root.dataset.project]}/>);
