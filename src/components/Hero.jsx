import Icon from './Icon.jsx';
import SnakeHandheld from './SnakeHandheld.jsx';

export default function Hero() {
  return <section className="hero shell" id="home" aria-labelledby="intro-title">
    <div className="intro-copy">
      <p className="greeting">Hey, I’m</p>
      <h1 id="intro-title">Srihari K<span>.</span></h1>
      <p className="role-line">A software engineer in Chennai, India.</p>
      <p className="intro-text">I build student apps at Agoura Math Circle and travel tools at Romaly. My side projects include a Snake agent that learns by playing.</p>
      <div className="hero-actions">
        <a className="ink-button" href="#projects">Browse my projects</a>
        <a className="resume-link" href="Srihari_Resume.pdf" target="_blank" rel="noopener noreferrer"><Icon name="download" size={16}/>Résumé</a>
      </div>
    </div>
    <SnakeHandheld/>
  </section>;
}
