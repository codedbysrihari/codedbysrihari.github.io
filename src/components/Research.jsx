const notes = [
  { field: 'Trustworthy ML', title: 'When should a model ask for help?', slug: 'selective-prediction',
    question: 'A travel assistant can sound certain about an ambiguous request. I want to see when calibrated confidence can tell it to ask a follow-up question.',
    experiment: 'Compare prediction and abstention policies on held-out travel intents, then vary the wording and intent coverage. Track accepted errors alongside how often the model asks for help.' },
  { field: 'Quantum computing', title: 'When is a quantum second opinion worth the cost?', slug: 'quantum-benchmark',
    question: 'A classical classifier could spend a limited quantum-query budget on its most uncertain predictions. Would those cases actually benefit?',
    experiment: 'Route the most uncertain 5%, 10%, 25%, or 50% of predictions to a small variational quantum classifier. Compare an MLP second stage under the same routing and query budgets.' },
  { field: 'Reinforcement learning', title: 'Did my Snake agent learn the game or the map?', slug: 'policy-generalization',
    question: 'After building the PPO Snake agent, I wanted to know what happens when the board changes. Which training choices help a policy transfer?',
    experiment: 'Compare fixed and varied environments with the same training budget. Reserve unseen layouts for the final evaluation and record scores, survival times, and failure patterns.' }
];

export default function Research() {
  return <section className="section notes-section" id="research" aria-labelledby="research-title">
    <div className="notes-intro"><h2 className="section-title" id="research-title">Research notes</h2>
      <p>Three questions I’m working through on paper. Each brief includes the experiment I’d run.</p>
    </div>
    <div className="notes-list">
      {notes.map(note => <details className="note" key={note.slug}>
        <summary><span><small>{note.field}</small><strong>{note.title}</strong></span><i aria-hidden="true"/></summary>
        <div className="note-body"><p>{note.question}</p><h3>Proposed experiment</h3><p>{note.experiment}</p>
          <a className="text-link" href={'research/' + note.slug + '.html'}>Read the full brief</a></div>
      </details>)}
    </div>
  </section>;
}
