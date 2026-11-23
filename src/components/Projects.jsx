import { useState } from 'react';
import briefs from '../briefs.json';

const builds = [
  { title: 'Adaptive Memory Transformer', kind: 'Transformer architecture', art: 'memory', href: 'labs/adaptive-memory.html', link: 'Run experiment',
    description: 'A trained attention router decides which memory pages to open. Query it, change its budget, and compare the digits it recalls with a dense reader.' },
  { title: 'Burgers Wave Operator', kind: 'Scientific machine learning', art: 'waves', href: 'labs/wave-operator.html', link: 'Run forecast',
    description: 'A Fourier neural operator forecasts how waves steepen and spread. Test its predictions against a numerical solver on familiar and unfamiliar frequencies.' },
  { title: 'PPO Snake Agent', kind: 'Reinforcement learning', art: 'cartridge', href: 'labs/ppo-snake.html', link: 'Inspect the agent',
    description: 'A Snake agent learns from tree search and calls its planner on uncertain moves. Step through its decisions and compare six controllers on the same boards.' },
  { title: 'Romaly Travel AI', kind: 'Product engineering', art: 'ticket', href: '#work', link: 'My role',
    description: 'The UI components and REST APIs that bring travel recommendations from the model to the traveller.' },
  { title: 'Agoura Math Circle', kind: 'Mobile & web', art: 'notebook', href: 'https://agouramathcircle.org/', link: 'Visit platform',
    description: 'A React Native app and web platform for students to register for classes, check schedules, and track attendance.' },
  { title: 'Academic Recommendation System', kind: 'Applied machine learning', art: 'folder',
    description: 'An advising tool that flags students who may need support and suggests what to work on next.' }
];
const concepts = Object.entries(briefs).map(([slug, brief]) => ({
  title: brief.title, description: brief.summary, kind: brief.stage.split(' · ').slice(1).join(' / '),
  art: 'paper', href: 'research/' + slug + '.html', link: 'Read concept'
}));

function ProjectObject({ art }) {
  return <div className={'object-frame ' + art} aria-hidden="true">
    {art === 'memory' && <div className="address-cards"><i/><i/><i/></div>}
    {art === 'waves' && <div className="wave-slip"><svg viewBox="0 0 70 38" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 25c8 0 8-7 13-7s4 10 10 10 11-23 16-23 3 23 7 23 10-10 22-10"/><path opacity=".45" d="M1 25c14 0 14-7 18-7s4 9 8 9 10-18 14-18 2 19 6 19 10-8 22-8"/></svg></div>}
    {art === 'cartridge' && <div className="cart"><div className="cart-label"><span>SNAKE</span><i/></div><div className="cart-grip"/></div>}
    {art === 'ticket' && <div className="ticket-stock"><i>TRAVEL</i><b>Romaly</b><span/></div>}
    {art === 'notebook' && <div className="book"><i/><b>∑</b></div>}
    {art === 'folder' && <div className="file-object"><i/><b/></div>}
    {art === 'paper' && <div className="paper-object"><i/><i/><i/></div>}
  </div>;
}

export default function Projects() {
  const [showConcepts, setShowConcepts] = useState(() => location.hash === '#project-archive');
  const items = showConcepts ? concepts : builds;
  return <section className="section shelf" id="projects" aria-labelledby="projects-title">
    <span id="project-archive" className="anchor-target"/>
    <div className="shelf-heading">
      <h2 className="section-title" id="projects-title">Project shelf</h2>
      <div className="shelf-switch" role="group" aria-label="Choose projects to display">
        <button type="button" aria-pressed={!showConcepts} aria-controls="project-list" onClick={() => setShowConcepts(false)}>Builds <small>{builds.length}</small></button>
        <button type="button" aria-pressed={showConcepts} aria-controls="project-list" onClick={() => setShowConcepts(true)}>Paper concepts <small>{concepts.length}</small></button>
      </div>
    </div>
    <ul className="shelf-list" key={showConcepts} id="project-list" aria-label={showConcepts ? 'Paper-stage concepts' : 'Built projects'}>
      {items.map(project => {
        const Item = project.href ? 'a' : 'div';
        const external = project.href?.startsWith('https:');
        return <li key={project.title}><Item className="shelf-row" href={project.href}
          target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
          <ProjectObject art={project.art}/>
          <div className="shelf-copy"><p className="shelf-kind">{project.kind}</p><h3>{project.title}</h3><p>{project.description}</p></div>
          {project.link && <span className="row-link">{project.link}</span>}
        </Item></li>;
      })}
    </ul>
  </section>;
}
