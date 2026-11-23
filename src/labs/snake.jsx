import { createRoot } from 'react-dom/client';
import '../../assets/style.css';
import './lab.css';
import PlanningArena from './PlanningArena.jsx';

function SnakeLab() {
  return <div className="lab lab-snake">
    <a className="skip-link" href="#experiment">Skip to experiment</a>
    <header className="lab-nav">
      <a href="../index.html" className="monogram" aria-label="Srihari K, home">sk.</a>
      <a href="../index.html#projects">Project shelf</a>
    </header>
    <main className="lab-main">
      <header className="lab-heading">
        <p className="lab-field">Reinforcement learning</p>
        <h1>PPO Snake Agent</h1>
        <p>When is a move worth thinking through? Watch a trained Snake policy choose between acting immediately and searching possible futures on three boards.</p>
      </header>
      <div id="experiment"><PlanningArena/></div>
    </main>
    <footer className="lab-footer"><a href="../index.html#projects">Back to the project shelf</a></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<SnakeLab/>);
