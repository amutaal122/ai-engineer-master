'use client';
import { useState } from 'react';
import { watches, WA_NUMBER } from '@/lib/watches';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [watch, setWatch] = useState('');
  const [msg, setMsg] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const watchLabel = watch ? ` about the ${watch}` : '';
    const text = `Hi Watcheton! I'm ${name}${watchLabel}.\n\n${msg}\n\nPlease get back to me. Thank you!`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <form className="contact-form" onSubmit={submit} aria-label="Send enquiry via WhatsApp">
      <div className="contact-form__row">
        <label htmlFor="cf-name">Your Name</label>
        <input
          id="cf-name"
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </div>

      <div className="contact-form__row">
        <label htmlFor="cf-watch">Which watch interests you? <span>(optional)</span></label>
        <select id="cf-watch" value={watch} onChange={(e) => setWatch(e.target.value)}>
          <option value="">Just browsing / general enquiry</option>
          {watches.map((w) => (
            <option key={w.id} value={w.name}>{w.name}</option>
          ))}
        </select>
      </div>

      <div className="contact-form__row">
        <label htmlFor="cf-msg">Your Message</label>
        <textarea
          id="cf-msg"
          rows={4}
          placeholder="Ask about sizing, gifting, engraving, availability — anything."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn--gold btn--lg contact-form__submit">Send message</button>
      <p className="contact-form__note">Opens a chat with your message already written.</p>
    </form>
  );
}
