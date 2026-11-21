export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="section-heading projects-heading"><div><p className="eyebrow">SELECTED PROJECTS</p><h2 className="section-title">Projects &amp; concepts.</h2></div><a className="text-link" href="https://github.com/codedbysrihari" target="_blank" rel="noopener noreferrer">View GitHub</a></div>
      <div className="projects-grid">
        <a href="research/umbra-letterpress.html" className="project-card concept-project umbra-letterpress">
          <div className="project-visual concept-art" aria-hidden="true"><div className="umbra-print"><span className="umbra-sun"></span><span className="umbra-fold"></span><span className="umbra-shadow"></span></div></div>
          <div className="project-content">
            <span className="concept-stage">Paper-stage concept · Computer vision · Inverse design</span>
            <h3>Umbra Letterpress</h3>
            <p>Could a folded postcard cast the shadow of a house key? A vision model would work backwards from a silhouette and the angle of sunlight to suggest a paper cutout and fold.</p>
            <span className="concept-read">Read the concept and experiment plan</span>
          </div>
        </a>

        <a href="research/misprint-orchard.html" className="project-card concept-project misprint-orchard">
          <div className="project-visual concept-art" aria-hidden="true"><div className="orchard-proof"><strong>3² = 6?</strong><span>Try 3³</span><div><b>6</b><b>9</b></div></div></div>
          <div className="project-content">
            <span className="concept-stage">Paper-stage concept · Probabilistic ML · Active learning</span>
            <h3>Misprint Orchard</h3>
            <p>When two mistakes produce the same answer, what should a tutor ask next? A probabilistic model would choose a one-symbol edit that helps distinguish the learner’s possible reasoning.</p>
            <span className="concept-read">Read the concept and experiment plan</span>
          </div>
        </a>

        <a href="research/evidence-expiry.html" className="project-card concept-project evidence-concept">
          <div className="project-visual concept-art" aria-hidden="true"><div className="evidence-map"><div className="evidence-fact"><span>Source fact</span><strong className="evidence-changed">Changed</strong></div><div className="evidence-connector"></div><div className="evidence-decisions"><span>Keep</span><span className="needs-repair">Repair</span><span>Keep</span></div></div></div>
          <div className="project-content"><span className="concept-stage">Paper-stage concept · Prototype planned</span><h3>Evidence Expiry</h3><p>A proposed travel planner that tracks the evidence behind each recommendation and repairs affected decisions when a source fact changes. The research question is how to preserve a useful plan with the least disruption.</p><span className="concept-read">Read the concept and experiment plan</span></div>
        </a>

        <a href="research/sync-witness.html" className="project-card concept-project sync-concept">
          <div className="project-visual concept-art" aria-hidden="true"><div className="sync-edits"><div className="sync-device"><span>Offline edit A</span><i></i><i></i><b></b></div><div className="sync-device"><span>Offline edit B</span><i></i><b></b><i></i></div></div><div className="sync-join"></div><div className="sync-witness">Conflict witness</div></div>
          <div className="project-content"><span className="concept-stage">Paper-stage concept · Prototype planned</span><h3>Sync Witness</h3><p>A proposed offline-sync system that turns conflicting edits into a replayable explanation. It would identify the decisions a user needs to make while preserving compatible edits across devices.</p><span className="concept-read">Read the concept and experiment plan</span></div>
        </a>


        <a href="https://github.com/codedbysrihari/rl-snake-agent" target="_blank" rel="noopener noreferrer" className="project-card">
          <div className="project-visual snake-visual" aria-hidden="true"><div className="visual-label">REINFORCEMENT LEARNING</div><div className="snake-board"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div><span className="visual-caption">Observe · Learn · Adapt</span></div>
          <div className="project-content">
            <h3>PPO Snake Agent</h3>
            <p>A reinforcement learning agent that teaches itself Snake through curriculum learning, streamed live into an interactive React dashboard.</p>
            <div className="tech-stack"><span>PPO</span><span>WebSockets</span><span>React</span></div>
          </div>
        </a>

        <div className="project-card">
          <div className="project-visual academic-visual" aria-hidden="true"><div className="visual-label">ACADEMIC INTELLIGENCE</div><div className="recommendation"><span className="mini-symbol">✳</span><div><strong>A clearer path forward</strong><span>Personalised learning recommendations</span></div></div><div className="signal-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
          <div className="project-content">
            <h3>AI Academic Recommendation System</h3>
            <p>An advising platform that flags at-risk students early and returns personalised recommendations from machine learning models.</p>
            <div className="tech-stack"><span>Python</span><span>ML pipelines</span><span>DevOps</span></div>
          </div>
        </div>

        <div className="project-card">
          <div className="project-visual travel-visual" aria-hidden="true"><div className="visual-label">ROMALY / TRAVEL AI</div><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="orbit orbit-three"></div><span className="destination destination-one">Discover</span><span className="destination destination-two">Explore</span><span className="travel-word">Go somewhere<br />unexpected.</span></div>
          <div className="project-content">
            <h3>Romaly — Travel Guidance AI</h3>
            <p>Full-stack product work on an AI travel companion: modular UI, REST APIs, model deployment and inference pipelines.</p>
            <div className="tech-stack"><span>React</span><span>Inference</span></div>
          </div>
        </div>

        <a href="https://agouramathcircle.org/" target="_blank" rel="noopener noreferrer" className="project-card">
          <div className="project-visual platform-visual" aria-hidden="true"><div className="visual-label">AGOURA MATH CIRCLE</div><div className="platform-window"><div className="window-top">Your learning space <span>✳</span></div><div className="window-body"><span>Learn together.<br /><strong>Grow together.</strong></span><div className="window-tiles"><i>∑</i><i>π</i><i>∞</i></div></div></div></div>
          <div className="project-content">
            <h3>Agoura Math Circle Platform</h3>
            <p>iOS and Android app plus a companion React web platform for registration, attendance and scheduling, sharing one .NET Core backend.</p>
            <div className="tech-stack"><span>React Native</span><span>.NET Core</span><span>SQL</span></div>
          </div>
        </a>

      </div>
    </section>
  );
}
