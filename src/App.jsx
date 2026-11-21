import Navigation from './components/Navigation.jsx';
import FeaturedProjects from './components/FeaturedProjects.jsx';
import Projects from './components/Projects.jsx';
import Research from './components/Research.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <div id="ui-layer">

        <Navigation />

        <main id="main">
          <section className="hero" id="home">
            <div className="hero__content">
              <p className="eyebrow"><span className="availability-dot"></span> Open to new-grad roles</p>
              <p className="hero-intro">Hi, I'm Srihari K.</p>
              <h1>Engineering<br />the <span className="accent-text">intelligent</span><br />everyday.</h1>
              <p className="desc">Full-stack engineer turning applied AI into products people use. From learning systems to thoughtful, human interfaces.</p>
              <div className="actions">
                <a href="#projects" className="btn btn-primary">Explore my work</a>
                <a href="#contact" className="btn btn-outline">Let's talk</a>
              </div>
              <div className="hero-location"><span>Based in Chennai, India</span><span>Building across the stack</span></div>
            </div>
            <FeaturedProjects />
          </section>
          <div className="stack-strip" aria-label="Primary technologies"><span>MY TOOLKIT</span><span>React / Native</span><span>.NET Core</span><span>Python</span><span>Machine Learning</span><span>SQL Server</span></div>

          <section className="section" id="about">
            <div className="section-heading"><p className="eyebrow">THE PERSON BEHIND THE CODE</p><h2 className="section-title">Curious by nature.<br />Engineer by practice.</h2></div>
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
              </div>
            </div>
          </section>

          <section className="section" id="work">
            <div className="section-heading"><p className="eyebrow">WHERE I BUILD</p><h2 className="section-title">Ideas into production.</h2></div>
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

          <Projects />

          <Research />

          <section className="section" id="skills">
            <div className="section-heading"><p className="eyebrow">FROM INTERFACE TO INFERENCE</p><h2 className="section-title">A connected skill set.</h2></div>
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
          <p>&copy; Srihari K <span>Built with curiosity. Chennai, India.</span></p>
        </footer>

      </div>
    </>
  );
}
