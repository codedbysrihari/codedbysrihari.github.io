import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

const links = [['Projects', 'projects'], ['Research notes', 'research'], ['About', 'about']];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const menu = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
    }, { rootMargin: '-12% 0px -60% 0px' });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    function keyboard(event) {
      if (event.key === 'Escape') { setOpen(false); menu.current.focus(); }
    }
    function outside(event) { if (!event.target.closest('.site-header')) setOpen(false); }
    document.addEventListener('keydown', keyboard);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', keyboard); document.removeEventListener('pointerdown', outside); };
  }, [open]);

  return <header className="site-header">
    <div className="nav-inner shell">
      <a href="#home" className="wordmark" aria-label="Srihari K, home" onClick={() => setOpen(false)}><span className="monogram">sk.</span><span className="home-label">Personal portfolio</span></a>
      <nav id="navigation" className={'site-nav' + (open ? ' open' : '')} aria-label="Main navigation">
        {links.map(([label, id]) => <a key={id} href={'#'+id} onClick={() => setOpen(false)} aria-current={(current===id || (id==='about' && ['work','skills'].includes(current))) ? 'location' : undefined}>{label}</a>)}
      <a className="nav-contact" href="#contact" onClick={() => setOpen(false)}>Contact</a>
      </nav>
      <div className="nav-actions">
      <button ref={menu} className="menu-toggle" aria-expanded={open} aria-controls="navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} size={21}/></button></div>
    </div>
  </header>;
}
