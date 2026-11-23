import Navigation from './components/Navigation.jsx';
import Hero from './components/Hero.jsx';
import { useEffect } from 'react';
import Projects from './components/Projects.jsx';
import Research from './components/Research.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) {
          target.classList.add('in-view');
          observer.unobserve(target);
        }
      }
    }, { rootMargin: '0px 0px 36px 0px' });
    document.querySelectorAll('.section-heading, .timeline-item, .skill-group, .notes-intro, .about-grid').forEach(item => {
      item.classList.add('scroll-reveal');
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <div id="ui-layer">

        <Navigation />

        <main id="main">
          <Hero />
          <Projects />
          <Research />

          <section className="section" id="about">
            <div className="section-heading"><h2 className="section-title">About me</h2></div>
            <div className="about-grid">
              <div className="about-text">
                <p className="lead">I'm a computer science undergraduate at SRM specialising in AI and machine learning, building production software alongside my degree.</p>
                <p>Most of my work sits at the seam where a model meets a real interface — recommendation pipelines behind a travel app, at-risk-student detection behind an advising platform, a React Native app that a few hundred students open every week. I love the API contracts, the data models, and the deployment pipelines that have to hold once the demo is over.</p>
                <p>I also teach. As a volunteer mentor with Agoura Math Circle I run global sessions on React Native full-stack development.</p>
                <p>I'm interested in quantum computing and machine learning, and enjoy exploring new ideas in both fields.</p>
              </div>
              <div className="about-stats">
                <div className="stat-item"><span>Based</span><strong>Chennai, India</strong></div>
                <div className="stat-item"><span>Focus</span><strong>Full-stack + Applied ML</strong></div>
                <div className="stat-item"><span>Graduating</span><strong>May 2028</strong></div>
                <div className="stat-item"><span>Motto</span><strong>NOTHING IS IMPOSSIBLE</strong></div>
              </div>
            </div>
          </section>

          <section className="section" id="work">
            <div className="section-heading"><h2 className="section-title">Where I work</h2></div>
            <div className="timeline">

              <div className="timeline-item">
                <div className="timeline-meta">
                  <span className="date">Jan 2025 — Present</span>
                  <span className="tag">Startup</span>
                </div>
                <div className="timeline-content">
                  <h3>Software Developer <span className="company">@ Romaly</span></h3>
                  <p>Building scalable full-stack features for a travel-guidance AI product, improving performance and real-time usability.</p>
                  <ul>
                    <li>Developed modular UI components and REST APIs for ML recommendations.</li>
                    <li>Worked with the ML team to integrate inference pipelines.</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-meta">
                  <span className="date">Dec 2024 — Present</span>
                  <span className="tag">Nonprofit</span>
                </div>
                <div className="timeline-content">
                  <h3>Software Engineer <span className="company">@ Agoura Math Circle</span></h3>
                  <p>Architected and shipped the cross-platform mobile and web stack for a free STEM initiative.</p>
                  <ul>
                    <li>Deployed a React Native app with .NET Core Web API and SQL Server.</li>
                    <li>Implemented secure auth, enrollment and academic tracking end to end.</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-meta">
                  <span className="date">Aug 2024 — Present</span>
                  <span className="tag">Education</span>
                </div>
                <div className="timeline-content">
                  <h3>Instructor / Mentor <span className="company">@ Agoura Math Circle</span></h3>
                  <p>Teaching technical courses to students as part of a global STEM initiative.</p>
                  <ul>
                    <li><strong>Introduction to AI:</strong> Lead instructor for the Fall 2026 semester.</li>
                    <li><strong>Mobile App Development:</strong> Taught React Native development for two semesters (Fall 2024 and Spring 2025).</li>
                  </ul>
                </div>
              </div>

            </div>
          </section>

          <section className="section" id="skills">
            <div className="section-heading"><h2 className="section-title">Tools I use</h2></div>
            <div className="skills-grid">
              <div className="skill-group">
                <h4>Core</h4>
                <p>Python, React.js, React Native, .NET Core, SQL Server</p>
              </div>
              <div className="skill-group">
                <h4>Backend</h4>
                <p>REST API, Authentication, Data modelling, Server-side logic</p>
              </div>
              <div className="skill-group">
                <h4>Machine Learning</h4>
                <p>Artificial Intelligence, Neural Networks, Model deployment, Inference pipelines, RL</p>
              </div>
              <div className="skill-group">
                <h4>Tools & Practice</h4>
                <p>Docker, GitHub, Figma, System Design</p>
              </div>
            </div>
          </section>

          <Contact />

        </main>

        <footer>
          <div className="shell footer-row"><span className="footer-brand">Srihari K.</span><span>Chennai, India</span><a href="#home">Back to top</a></div>
        </footer>

      </div>
    </>
  );
}
