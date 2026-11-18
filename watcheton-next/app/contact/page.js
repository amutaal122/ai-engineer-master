import Image from 'next/image';
import { WA_NUMBER } from '@/lib/watches';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact — Watcheton Timepieces',
  description: 'Order a watch, ask a question, or get a recommendation from Watcheton.',
};

const PHONE = `+${WA_NUMBER.slice(0, 2)} ${WA_NUMBER.slice(2, 5)} ${WA_NUMBER.slice(5)}`;

const FAQ = [
  {
    q: 'How do I order?',
    a: 'Choose a watch and press “Order this watch”, or use the form on this page. We confirm the model, price and your address, then dispatch.',
  },
  {
    q: 'How do I pay?',
    a: 'Cash on delivery. You pay when the watch is in your hands.',
  },
  {
    q: 'How long does delivery take?',
    a: 'We dispatch within 24 hours of confirming your order. Delivery inside Pakistan usually takes 1–3 working days.',
  },
  {
    q: 'What is the return policy?',
    a: 'Return any unworn watch in its original packaging within 30 days for a full refund.',
  },
  {
    q: 'What does the warranty cover?',
    a: 'One year on the movement and manufacturing defects. It does not cover accidental damage or water damage beyond the stated rating.',
  },
];

export default function ContactPage() {
  return (
    <div className="page">
      <div className="about-hero">
        <div className="about-hero__bg">
          <Image
            src="/images/watches/showcase.webp"
            alt="Watcheton Meridian Classic"
            priority
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div className="about-hero__overlay" />
        </div>
        <div className="container about-hero__content">
          <span className="hero__eyebrow">Contact</span>
          <h1 className="hero__title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
            Talk to Us.
          </h1>
          <p className="hero__sub" style={{ maxWidth: 440 }}>
            Questions about size, movement or a gift — ask before you buy.
          </p>
        </div>
      </div>

      <section className="section section--dark">
        <div className="container">
          <div className="contact-enquiry">
            <div className="contact-enquiry__copy reveal reveal--left">
              <span className="hero__eyebrow">Send a Message</span>
              <h2 className="section-title">Tell us what you’re looking for</h2>
              <p className="contact-enquiry__lead">
                The form writes your message for you and opens a chat with us.
              </p>
              <div className="contact-line">
                <span>Phone</span>
                <a href={`tel:+${WA_NUMBER}`}>{PHONE}</a>
              </div>
              <div className="contact-line">
                <span>Hours</span>
                <p>Monday – Saturday, 10 AM – 8 PM PKT</p>
              </div>
            </div>
            <div className="reveal reveal--right reveal--d2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section container" id="faq">
        <div className="section__head reveal" style={{ textAlign: 'center' }}>
          <span className="hero__eyebrow">Before You Order</span>
          <h2 className="section-title">Questions</h2>
        </div>
        <div className="faq-list">
          {FAQ.map((item) => (
            <details key={item.q} className="faq-item">
              <summary className="faq-item__q">{item.q}</summary>
              <p className="faq-item__a">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
