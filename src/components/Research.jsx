export default function Research() {
  return (
    <section className="section research-section" id="research" aria-labelledby="research-title">
      <div className="section-heading research-heading">
        <div>
          <p className="eyebrow">RESEARCH DIRECTIONS</p>
          <h2 className="section-title" id="research-title">Questions worth<br />building for.</h2>
        </div>
        <p className="research-intro">Original project concepts in machine learning, reinforcement learning, and quantum computing, developed on paper with written experiment plans. Prototype work is planned.</p>
      </div>

      <div className="research-list">
        <article className="research-entry research-entry--trust">
          <div className="research-diagram decision-diagram" aria-hidden="true">
            <div className="decision-input">Travel request</div>
            <div className="decision-stem"></div>
            <div className="decision-model">Model + calibration</div>
            <div className="decision-branches"></div>
            <div className="decision-outcomes"><span>Predict</span><span>Ask for help</span></div>
          </div>
          <div className="research-copy">
            <div className="research-meta"><span>TRUSTWORTHY ML</span><span className="research-status">Paper-stage concept</span></div>
            <h3>When should a model ask for help?</h3>
            <p>A travel assistant can sound certain about an ambiguous request. This study would investigate when calibrated confidence can support a prediction and when the system should ask for clarification.</p>
            <ul className="research-methods" aria-label="Proposed methods"><li>Selective prediction</li><li>Calibration</li><li>Distribution shift</li></ul>
            <details className="research-experiment">
              <summary>Inside the proposed experiment</summary>
              <p>Compare prediction and abstention policies on held-out travel intents, then test changes in wording and intent coverage. Track error among accepted predictions alongside how often the model asks for help.</p>
            </details>
            <a className="research-brief-link" href="research/selective-prediction.html">Read the research brief<span className="sr-only"> for selective prediction</span></a>
          </div>
        </article>

        <article className="research-entry research-entry--quantum">
          <div className="research-diagram benchmark-diagram" aria-hidden="true">
            <div className="benchmark-input">Classical model</div>
            <div className="benchmark-stem"></div>
            <div className="benchmark-gate">Confidence gate</div>
            <div className="benchmark-branches"></div>
            <div className="benchmark-models"><div><span className="benchmark-symbol">|ψ⟩</span><span>Quantum</span></div><div><span className="benchmark-symbol">f(x)</span><span>MLP</span></div></div>
            <div className="benchmark-caption">Compare second opinions</div>
          </div>
          <div className="research-copy">
            <div className="research-meta"><span>QUANTUM MACHINE LEARNING</span><span className="research-status">Paper-stage concept</span></div>
            <h3>When should AI ask a quantum model for a second opinion?</h3>
            <p>A quantum model would act as a second opinion for uncertain predictions. This concept explores whether spending a limited quantum-query budget on difficult cases improves a classical classifier.</p>
            <ul className="research-methods" aria-label="Proposed methods"><li>Uncertainty routing</li><li>Variational circuits</li><li>Query budgets</li></ul>
            <details className="research-experiment">
              <summary>Inside the proposed experiment</summary>
              <p>Route the most uncertain 5%, 10%, 25%, or 50% of predictions to a small variational quantum classifier. Compare an MLP second stage under the same routing and query budgets to assess the quantum model’s contribution.</p>
            </details>
            <a className="research-brief-link" href="research/quantum-benchmark.html">Read the research brief<span className="sr-only"> for A Quantum Second Opinion</span></a>
          </div>
        </article>

        <article className="research-entry research-entry--policy">
          <div className="research-diagram transfer-diagram" aria-hidden="true">
            <div className="transfer-boards"><div><span>Training</span><div className="transfer-board"><i className="board-agent"></i><i className="board-target"></i></div></div><div><span>Unseen layout</span><div className="transfer-board transfer-board--shift"><i className="board-agent"></i><i className="board-target"></i><i className="board-wall"></i></div></div></div>
            <div className="transfer-caption">One policy. Changing environments.</div>
          </div>
          <div className="research-copy">
            <div className="research-meta"><span>REINFORCEMENT LEARNING</span><span className="research-status">Paper-stage concept</span></div>
            <h3>Does an agent learn the game or the map?</h3>
            <p>Building on the PPO Snake project, this study would test how a trained policy handles unfamiliar boards and obstacles. It asks which training choices help an agent transfer what it has learned.</p>
            <ul className="research-methods" aria-label="Proposed methods"><li>PPO</li><li>Environment variation</li><li>Generalization</li></ul>
            <details className="research-experiment">
              <summary>Inside the proposed experiment</summary>
              <p>Compare fixed-environment and varied-environment training with matched interaction budgets. Reserve unseen layouts for final evaluation and measure score, survival, and failure patterns across repeated runs.</p>
            </details>
            <a className="research-brief-link" href="research/policy-generalization.html">Read the research brief<span className="sr-only"> for policy generalization</span></a>
          </div>
        </article>
      </div>
    </section>
  );
}
