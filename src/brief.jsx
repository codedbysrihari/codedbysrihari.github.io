import { createRoot } from 'react-dom/client';
import briefs from './briefs.json';
import '../assets/style.css';

function ConceptBrief({ brief }) {
  return (
    <main className="concept-brief">
      <a className="text-link" href="../index.html#project-archive">Back to projects</a>
      <article>
        <header>
          <p className="concept-stage">{brief.stage}</p>
          <h1>{brief.title}</h1>
          <p>{brief.summary}</p>
        </header>
        {brief.sections.map(({ heading, text }) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{text}</p>
          </section>
        ))}
      </article>
    </main>
  );
}

const root = document.getElementById('root');
createRoot(root).render(<ConceptBrief brief={briefs[root.dataset.brief]} />);
