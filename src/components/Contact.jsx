import { useState } from 'react';

const recipient = 'harikarthikselvam@gmail.com';
const messages = {
  sending: 'Sending your message…',
  success: 'Thanks for reaching out. Your message has been sent.',
  error: 'Your message could not be sent. Please try again or email sk6704@srmist.edu.in. Your draft is saved in this form.',
};

export default function Contact() {
  const [status, setStatus] = useState('idle');
  const sending = status === 'sending';

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setStatus('sending');
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok || String(data.success) !== 'true') throw new Error('Submission failed');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <section className="section" id="contact">
      <div className="contact-box">
        <p className="eyebrow">HAVE SOMETHING IN MIND?</p><h2 className="contact-title">Great things start<br />with a <span className="accent-text">hello.</span></h2>
        <p className="contact-sub">Open for new-grad roles and interesting opportunities.</p>

        <form className="contact-form" id="contactForm" onSubmit={handleSubmit} action={`https://formsubmit.co/${recipient}`} method="POST">
          <input type="hidden" name="_autoresponse" value="Thank you for reaching out! We will reply within 24 hours." />
          <input type="hidden" name="_subject" value="New message from portfolio!" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />

          <div id="formInputs">
            <div className="form-group">
              <label htmlFor="contact-name">Your name</label>
              <input id="contact-name" autoComplete="name" type="text" name="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email address</label>
              <input id="contact-email" autoComplete="email" type="email" name="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">What are you working on?</label>
              <textarea id="contact-message" name="message" placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-submit" disabled={sending}>{sending ? 'Sending…' : 'Send Message'}</button>
          </div>

          <p id="formResult" role="status" aria-live="polite" hidden={status === 'idle'}
            className={`form-result text-${status}`}>{messages[status]}</p>
        </form>

        <div className="contact-links" style={{ marginTop: '2rem' }}>
          <a href="mailto:sk6704@srmist.edu.in">sk6704@srmist.edu.in</a>
          <a href="https://www.linkedin.com/in/srihari-k-8275852a2/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/codedbysrihari" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </section>
  );
}
