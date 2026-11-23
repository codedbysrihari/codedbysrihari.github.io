import { useEffect, useRef, useState } from 'react';
import { contactEndpoint, inbox } from '../contact-config.js';
import './contact.css';

const errors = {
  invalid: 'Check your name, email address, and message, then try again.',
  limited: 'Several notes have come through recently. Please try again later or email me directly.',
  busy: 'The mailer is busy. Your note is still here. Please try again.',
  unavailable: 'I couldn’t confirm the send. Your note is still here. Try again or email me directly.',
};

function SendingNote() {
  return <div className="contact-dispatch" role="status">
    <div className="dispatch-envelope" aria-hidden="true">
      <div className="dispatch-letter"><i/><i/><i/></div>
      <div className="dispatch-pocket"/>
      <div className="dispatch-flap"/>
    </div>
    <span>Sending your note…</span>
  </div>;
}

function Receipt({ note, confirmed, onRetry, onReset, sending, error }) {
  const heading = useRef(null);
  useEffect(() => { heading.current.focus({preventScroll: true}); }, []);
  return <div className="contact-receipt">
    <div className="receipt-meta"><span>Personal correspondence</span><span>{note.reference}</span></div>
    <h3 ref={heading} tabIndex={-1}>Got your note, {note.name.split(/\s+/)[0]}.</h3>
    <p>I’ll read what you sent and get back to you soon.</p>
    <p className="receipt-address" role="status">{confirmed ? <>I sent a confirmation to <strong>{note.email}</strong>.</> :
      <>Your message reached me. The confirmation email to <strong>{note.email}</strong> hasn’t gone through yet.</>}</p>
    <div className="receipt-signature">Srihari K.</div>
    <div className="receipt-footer"><span>Nothing is impossible</span>
      {confirmed ? <button type="button" onClick={onReset}>Write another note</button> :
        <button type="button" disabled={sending} onClick={onRetry}>{sending ? 'Trying again…' : 'Retry confirmation'}</button>}
    </div>
    {error && <p role="alert">{error}</p>}
  </div>;
}

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const attempt = useRef(null);
  const inFlight = useRef(false);
  const nameInput = useRef(null);
  const restoringForm = useRef(false);

  useEffect(() => {
    if (!receipt && restoringForm.current) {
      nameInput.current?.focus();
      restoringForm.current = false;
    }
  }, [receipt]);

  async function send(note) {
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    setError('');
    const started = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST', credentials: 'omit', body: new URLSearchParams(note), signal: controller.signal,
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (['complete', 'owner'].includes(result.status) && result.reference === 'SK-' + note.id.slice(0, 8).toUpperCase()) {
        if (!receipt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const remaining = 1200 - (performance.now() - started);
          if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
        }
        setReceipt({ ...note, reference: result.reference, confirmed: result.status === 'complete' });
      } else {
        setError(errors[result.status] || errors.unavailable);
      }
    } catch {
      setError(errors.unavailable);
    } finally {
      clearTimeout(timer);
      inFlight.current = false;
      setSending(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const payload = JSON.stringify(values);
    if (attempt.current?.payload !== payload) attempt.current = { payload, id: crypto.randomUUID() };
    attempt.current.note = {...values, name: values.name.trim(), email: values.email.trim(), id: attempt.current.id};
    send(attempt.current.note);
  }

  return <section className="section" id="contact">
    <div className="contact-box">
      <div className="contact-intro"><h2 className="contact-title">Get in touch</h2>
        <p className="contact-sub">Open to new-grad roles and conversations about applied AI and full-stack engineering.</p>
        <div className="contact-links">
          <a href={'mailto:' + inbox}>{inbox}</a>
          <a href="https://www.linkedin.com/in/srihari-k-8275852a2/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/codedbysrihari" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
      {receipt ? <Receipt note={receipt} confirmed={receipt.confirmed} sending={sending} error={error}
        onRetry={() => send(attempt.current.note)} onReset={() => {
          restoringForm.current = true; attempt.current = null; setError(''); setReceipt(null);
        }}/> :
        <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
          <div className="contact-trap" aria-hidden="true">
            <label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
          </div>
          <div id="formInputs" inert={sending} className={sending ? 'dispatch-underlay' : undefined}>
            <div className="form-group"><label htmlFor="contact-name">Your name</label>
              <input ref={nameInput} id="contact-name" autoComplete="name" name="name" placeholder="Your name" maxLength={100} readOnly={sending} required/></div>
            <div className="form-group"><label htmlFor="contact-email">Email address</label>
              <input id="contact-email" autoComplete="email" type="email" name="email" placeholder="you@example.com" maxLength={254} readOnly={sending} required/></div>
            <div className="form-group"><label htmlFor="contact-message">What are you working on?</label>
              <textarea id="contact-message" name="message" placeholder="Tell me a little about it…" rows="5" maxLength={4000} readOnly={sending} required/></div>
            <button type="submit" className="btn btn-primary btn-submit" disabled={sending}>{sending ? 'Sending your note…' : 'Send message'}</button>
          </div>
          {sending && <SendingNote/>}
          {error && <p className="form-result" role="alert">{error}</p>}
        </form>}
    </div>
  </section>;
}
