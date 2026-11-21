import { useState } from 'react';

const projects = [
  {
    title: "Evidence Expiry",
    label: "Evidence Expiry, paper-stage concept",
    theme: "concept-poster evidence-concept",
    category: "PAPER-STAGE CONCEPT",
    detail: "Prototype planned",
    tagline: "Repair the plan when its evidence changes.",
    href: "research/evidence-expiry.html",
    link: "Read concept",
    art: (
      <div className="poster-art concept-art" aria-hidden="true"><div className="evidence-map"><div className="evidence-fact"><span>Source fact</span><strong className="evidence-changed">Changed</strong></div><div className="evidence-connector"></div><div className="evidence-decisions"><span>Keep</span><span className="needs-repair">Repair</span><span>Keep</span></div></div><span className="poster-art-note">Concept diagram</span></div>
    ),
  },
  {
    title: "Sync Witness",
    label: "Sync Witness, paper-stage concept",
    theme: "concept-poster sync-concept",
    category: "PAPER-STAGE CONCEPT",
    detail: "Prototype planned",
    tagline: "Make conflicting edits explain themselves.",
    href: "research/sync-witness.html",
    link: "Read concept",
    art: (
      <div className="poster-art concept-art" aria-hidden="true"><div className="sync-edits"><div className="sync-device"><span>Offline edit A</span><i></i><i></i><b></b></div><div className="sync-device"><span>Offline edit B</span><i></i><b></b><i></i></div></div><div className="sync-join"></div><div className="sync-witness">Conflict witness</div><span className="poster-art-note">Concept diagram</span></div>
    ),
  },
  {
    title: "A Quantum Second Opinion",
    label: "A Quantum Second Opinion, paper-stage concept",
    theme: "concept-poster quantum-concept",
    category: "PAPER-STAGE CONCEPT",
    detail: "Prototype planned",
    tagline: "Spend computation where uncertainty lives.",
    href: "research/quantum-benchmark.html",
    link: "Read concept",
    art: (
      <div className="poster-art concept-art" aria-hidden="true"><div className="quantum-routing"><span className="routing-input">Uncertain prediction</span><div className="routing-wire"></div><div className="routing-models"><span>f(x)</span><span>|ψ⟩</span></div><span className="routing-caption">Compare second opinions</span></div><span className="poster-art-note">Concept diagram</span></div>
    ),
  },
  {
    title: "The Confidence Gap",
    label: "The Confidence Gap, paper-stage concept",
    theme: "concept-poster confidence-concept",
    category: "PAPER-STAGE CONCEPT",
    detail: "Prototype planned",
    tagline: "Give uncertain predictions a way to pause.",
    href: "research/selective-prediction.html",
    link: "Read concept",
    art: (
      <div className="poster-art concept-art" aria-hidden="true"><div className="confidence-illustration"><span className="confidence-question">?</span><div className="confidence-options"><span>Predict</span><span>Clarify</span></div></div><span className="poster-art-note">Concept diagram</span></div>
    ),
  },
  {
    title: "Beyond the Training Board",
    label: "Beyond the Training Board, paper-stage concept",
    theme: "concept-poster policy-concept",
    category: "PAPER-STAGE CONCEPT",
    detail: "Prototype planned",
    tagline: "Explore what survives a change of world.",
    href: "research/policy-generalization.html",
    link: "Read concept",
    art: (
      <div className="poster-art concept-art" aria-hidden="true"><div className="policy-illustration"><div className="policy-board"><i></i><b></b></div><div className="policy-board policy-board-unseen"><i></i><b></b><em></em></div></div><span className="policy-caption">Same policy · Unseen terrain</span><span className="poster-art-note">Concept diagram</span></div>
    ),
  },
  {
    title: "PPO Snake Agent",
    label: "PPO Snake Agent",
    theme: "",
    category: "REINFORCEMENT LEARNING",
    detail: "Python / React",
    tagline: "Learning, one move at a time.",
    href: "https://github.com/codedbysrihari/rl-snake-agent",
    link: "View project",
    art: (
      <div className="poster-art snake-poster" aria-hidden="true">
                      <div className="poster-grid"></div>
                      <div className="snake-pixels"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>
                      <span className="poster-art-note">Project illustration</span>
                    </div>
    ),
  },
  {
    title: "Agoura Math Circle",
    label: "Agoura Math Circle",
    theme: "education-poster",
    category: "MOBILE + WEB",
    detail: "React Native / .NET",
    tagline: "A shared space for STEM.",
    href: "https://agouramathcircle.org/",
    link: "View platform",
    art: (
      <div className="poster-art math-poster" aria-hidden="true">
                      <div className="math-tile tile-sum">∑</div><div className="math-tile tile-pi">π</div><div className="math-tile tile-infinity">∞</div>
                      <div className="math-orbit"></div><span className="poster-art-note">Project illustration</span>
                    </div>
    ),
  },
  {
    title: "Romaly Travel AI",
    label: "Romaly Travel AI",
    theme: "travel-poster",
    category: "AI PRODUCT ENGINEERING",
    detail: "React / Inference",
    tagline: "Intelligence for the journey.",
    href: "#work",
    link: "My contribution",
    art: (
      <div className="poster-art journey-poster" aria-hidden="true">
                      <div className="contour contour-one"></div><div className="contour contour-two"></div><div className="contour contour-three"></div>
                      <div className="journey-path"><i></i><i></i><i></i></div><span className="poster-art-note">Project illustration</span>
                    </div>
    ),
  }
];

export default function FeaturedProjects() {
  const [active, setActive] = useState(0);
  const total = projects.length;
  function move(step) {
    setActive(index => (index + step + total) % total);
  }
  return (
    <aside className="work-showcase" aria-label="Featured portfolio projects">
      <div className="showcase-heading"><span>SELECTED WORK</span><a href="#projects">All projects</a></div>
      <div className="project-deck" id="project-deck">
        {projects.map((project, index) => {
          const position = (index - active + total) % total;
          const layer = ['is-active', 'is-next', 'is-last'][position] ?? '';
          const external = project.href.startsWith('https://');
          return (
            <article key={project.title} className={`showcase-card ${project.theme} ${layer}`}
              aria-label={project.label} aria-hidden={position !== 0} inert={position !== 0} hidden={position >= 3}>
              <div className="poster-top"><span>{project.category}</span><span>{project.detail}</span></div>
              {project.art}
              <div className="poster-bottom">
                <div><p>{project.tagline}</p><h2>{project.title}</h2></div>
                <a href={project.href} target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}>{project.link}</a>
              </div>
            </article>
          );
        })}
      </div>
      <div className="showcase-controls" aria-label="Choose featured project">
        <button type="button" id="previous-project" aria-controls="project-deck" onClick={() => move(-1)}>Previous</button>
        <p id="project-position" aria-live="polite" aria-atomic="true">
          <span className="project-number">{String(active + 1).padStart(2, '0')}</span>
          <span className="project-total"> / {String(total).padStart(2, '0')}</span>
          <span className="sr-only"> · {projects[active].label}</span>
        </p>
        <button type="button" id="next-project" aria-controls="project-deck" onClick={() => move(1)}>Next project</button>
      </div>
    </aside>
  );
}
