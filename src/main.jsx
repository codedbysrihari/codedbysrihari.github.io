import { createRoot } from 'react-dom/client';
import { useLayoutEffect } from 'react';
import App from './App.jsx';
import '../assets/style.css';

function Portfolio() {
  useLayoutEffect(() => {
    // The browser may resolve the incoming fragment before React mounts its target.
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
  }, []);
  return <App />;
}

createRoot(document.getElementById('root')).render(<Portfolio />);
