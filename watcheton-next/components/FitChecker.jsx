'use client';
import { useState } from 'react';

const RANGES = [
  { max: 15, lo: 34, hi: 38 },
  { max: 16.5, lo: 36, hi: 40 },
  { max: 18, lo: 38, hi: 42 },
  { max: 19.5, lo: 40, hi: 44 },
  { max: Infinity, lo: 42, hi: 46 },
];

export default function FitChecker({ caseSize }) {
  const [wrist, setWrist] = useState('');
  const size = parseInt(caseSize, 10);
  const cm = parseFloat(wrist);
  const valid = cm >= 12 && cm <= 25;
  const range = valid && RANGES.find((r) => cm <= r.max);
  const verdict = !range ? null
    : size < range.lo ? { tone: 'small', text: `Wears small and refined on your wrist. Most people your size go for ${range.lo}–${range.hi}mm.` }
    : size > range.hi ? { tone: 'big', text: `Wears bold and large on your wrist. A ${range.lo}–${range.hi}mm case sits more classically.` }
    : { tone: 'good', text: `A balanced fit. ${size}mm is in the ideal ${range.lo}–${range.hi}mm range for your wrist.` };

  return (
    <div className="fit">
      <div className="fit__head">
        <h4 className="pd-specs__title">Will it fit?</h4>
        <span className="fit__case">Case {caseSize}</span>
      </div>
      <label className="fit__label">
        Wrist size in cm
        <input type="number" inputMode="decimal" min="12" max="25" step="0.5" value={wrist} onChange={(e) => setWrist(e.target.value)} placeholder="e.g. 17" />
      </label>
      <p className="fit__tip">Wrap a strip of paper around your wrist bone, mark it, and measure against a ruler.</p>
      {verdict && <p className={`fit__verdict fit__verdict--${verdict.tone}`}>{verdict.text}</p>}
      {wrist && !valid && <p className="fit__verdict">Enter a wrist size between 12 and 25 cm.</p>}
    </div>
  );
}
