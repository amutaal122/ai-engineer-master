const fs = require('fs'), path = require('path');
const d = __dirname;
const tpl = fs.readFileSync(path.join(d, 'assistant.template.html'), 'utf8');
let kb = fs.readFileSync(path.join(d, 'kb.json'), 'utf8');
kb = kb.split('</').join('<\\/');
kb = kb.split(String.fromCharCode(0x2028)).join('\\u2028');
kb = kb.split(String.fromCharCode(0x2029)).join('\\u2029');
if (!tpl.includes('/*__KB__*/null')) throw new Error('placeholder missing');
const page = tpl.replace('/*__KB__*/null', () => kb);
fs.writeFileSync(path.join(d, 'master-assistant.html'), page, 'utf8');
const head = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
const standalone = head + page + '</head><body></body></html>';
fs.writeFileSync(path.join(d, 'master-assistant-standalone.html'), standalone, 'utf8');
const js = page.match(/<script>([\s\S]*)<\/script>/)[1];
fs.writeFileSync(path.join(d, '_chk.js'), js, 'utf8');
// Publish straight to docs/ so the shipped page can't drift from the KB.
fs.writeFileSync(path.join(d, '..', '..', 'docs', 'engineer-master-assistant.html'), standalone, 'utf8');
console.log('page KB', Math.round(page.length / 1024), '-> docs/engineer-master-assistant.html');
