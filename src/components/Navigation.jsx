import { useEffect, useRef, useState } from 'react';

const sections = ['About', 'Work', 'Projects', 'Research', 'Contact'];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const menuButton = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current.focus();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      }
    }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main section').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="nav" id="nav">
      <a className="nav__mark" href="#home" aria-label="Srihari K, home">
        <img className="brand-icon" src="favicon.svg" alt="" width="36" height="36" /> srihari<span className="brand-dot">.</span>
      </a>
      <button ref={menuButton} type="button" className="menu-toggle" aria-controls="navigation"
        aria-expanded={open} onClick={() => setOpen(value => !value)}>Menu</button>
      <nav className={open ? 'nav__links is-open' : 'nav__links'} id="navigation" aria-label="Main navigation">
        {sections.map(label => {
          const id = label.toLowerCase();
          return (
            <a key={id} href={`#${id}`} aria-current={current === id ? 'location' : undefined}
              onClick={() => setOpen(false)}>{label}</a>
          );
        })}
      </nav>
      <a className="nav__cta" href="Srihari_Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</a>
    </header>
  );
}
