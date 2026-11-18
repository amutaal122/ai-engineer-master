const fs = require('fs'), path = require('path');
const ROOT = process.argv[2], OUT = process.argv[3];
const SK = path.join(ROOT, '.claude', 'skills'), AG = path.join(ROOT, '.claude', 'agents'), CM = path.join(ROOT, '.claude', 'commands');

function fm(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta = {}, lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const k = lines[i].match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (!k) continue;
    let v = k[2].trim();
    if (v === '>' || v === '|' || v === '>-' || v === '|-' || v === '') {
      const buf = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) buf.push(lines[++i].trim());
      v = buf.join(' ');
    }
    meta[k[1]] = v.replace(/^["']|["']$/g, '');
  }
  return { meta, body: m[2] };
}
function triggers(v) {
  if (!v) return [];
  return v.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
}
function rules(body) {
  const m = body.match(/\n#{1,3}\s*(?:§)?RULES?\b[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|$)/i);
  if (!m) return [];
  return m[1].split('\n').filter(l => /^\s*[-*]\s+/.test(l)).map(l => l.replace(/^\s*[-*]\s+/, '').replace(/\*\*/g, '').trim()).filter(l => l.length > 8 && l.length < 220).slice(0, 5);
}
function excerpt(body, n) {
  return body.replace(/\r/g, '').replace(/```[\s\S]*?```/g, '[code]').replace(/\n{3,}/g, '\n\n').trim().slice(0, n);
}

const DOMAIN = {};
const put = (d, arr) => arr.forEach(n => DOMAIN[n] = d);
put('LLM & AI', ['anthropic-sdk', 'openai-sdk', 'langchain', 'prompt-engineering', 'llm-evaluation', 'ai-engineer', 'claude-api', 'huggingface', 'freellmapi', 'gpt-oss']);
put('Data & ML', ['pandas', 'scikit-learn', 'postgres', 'mongodb', 'ab-testing', 'scrapling']);
put('Agents', ['ai-agent-development', 'ai-agents-architect', 'ai-agent-tool-routing', 'ai-agent-security', 'ai-agent-evaluation-benchmarking', 'agent-memory-discipline', 'agent-qa-authoring', 'ai-code-generation-guardrails', 'ai-coding-agent-guardrails', 'mcp-builder', 'openbot', 'agent-browser', 'skillspector', 'claude-code-templates', 'agent-desktop', 'ag-ui']);
put('Tools & Infra', ['chrome-devtools-mcp', 'free-claude-code']);
put('Backend', ['fastapi', 'sqlalchemy', 'redis', 'celery', 'graphql', 'nextjs', 'typescript']);
put('Infra & DevOps', ['docker', 'kubernetes', 'github-actions', 'git-advanced', 'git-workflow']);
put('Quality & Security', ['pytest', 'security-audit', 'webapp-testing', 'pyrit', 'codex-security']);
put('UI & Apps', ['ui-design', 'gpt-chat-ui']);
put('Meta', ['ai-engineer-master', 'easy-install', 'agent-skills']);

const skills = [], unmapped = [];
for (const d of fs.readdirSync(SK, { withFileTypes: true })) {
  if (!d.isDirectory() || d.name.startsWith('.')) continue;
  const f = path.join(SK, d.name, 'SKILL.md');
  if (!fs.existsSync(f)) continue;
  const { meta, body } = fm(fs.readFileSync(f, 'utf8'));
  let domain = d.name.startsWith('research-') ? 'Research' : DOMAIN[d.name];
  if (!domain) { unmapped.push(d.name); domain = 'Other'; }
  skills.push({ id: d.name, name: meta.name || d.name, domain, desc: (meta.description || '').slice(0, 320), triggers: triggers(meta.triggers).slice(0, 14), rules: rules(body), body: excerpt(body, 1100), core: true });
  if (d.name.startsWith('research-')) {
    for (const s of fs.readdirSync(path.join(SK, d.name), { withFileTypes: true })) {
      if (!s.isDirectory()) continue;
      const sf = path.join(SK, d.name, s.name, 'SKILL.md');
      if (!fs.existsSync(sf)) continue;
      const r = fm(fs.readFileSync(sf, 'utf8'));
      skills.push({ id: s.name, name: r.meta.name || s.name, domain: 'Research', parent: d.name, desc: (r.meta.description || '').slice(0, 260), triggers: triggers(r.meta.triggers).slice(0, 10), rules: rules(r.body), body: excerpt(r.body, 500), core: false });
    }
  }
}
// nested skills under research-21-extras are also children
const agents = [];
for (const f of fs.readdirSync(AG)) {
  if (!f.endsWith('.md')) continue;
  const { meta, body } = fm(fs.readFileSync(path.join(AG, f), 'utf8'));
  agents.push({ id: f.replace(/\.md$/, ''), name: meta.name || f.replace(/\.md$/, ''), desc: (meta.description || excerpt(body, 200)).slice(0, 300) });
}
const commands = [];
for (const f of fs.readdirSync(CM)) {
  if (!f.endsWith('.md')) continue;
  const { meta, body } = fm(fs.readFileSync(path.join(CM, f), 'utf8'));
  const first = excerpt(body, 400).split('\n').find(l => l.trim() && !l.startsWith('#')) || '';
  commands.push({ id: f.replace(/\.md$/, ''), desc: (meta.description || first).slice(0, 200) });
}
const wfDir = path.join(SK, 'ai-engineer-master', 'workflows'), workflows = [];
if (fs.existsSync(wfDir)) for (const f of fs.readdirSync(wfDir)) if (f.endsWith('.md')) {
  const { meta, body } = fm(fs.readFileSync(path.join(wfDir, f), 'utf8'));
  const h = body.match(/^#\s+(.+)$/m);
  workflows.push({ id: f.replace(/\.md$/, ''), desc: (meta.description || (h ? h[1] : '')).slice(0, 200) });
}
const kb = { generated: new Date().toISOString().slice(0, 10), skills, agents, commands, workflows };
fs.writeFileSync(OUT, JSON.stringify(kb));

// Public catalog: machine-readable index any tool can load.
const catalog = {
  generated: kb.generated,
  source: 'https://github.com/amutaal122/ai-engineer-master',
  counts: { skills: skills.filter(s => s.core).length, agents: agents.length, commands: commands.length, workflows: workflows.length },
  skills: skills.filter(s => s.core).map(s => ({
    id: s.id, name: s.name, domain: s.domain, description: s.desc, triggers: s.triggers,
    path: `.claude/skills/${s.id}/SKILL.md`,
  })),
  agents: agents.map(a => ({ id: a.id, name: a.name, description: a.desc, path: `.claude/agents/${a.id}.md` })),
  commands: commands.map(c => ({ id: c.id, description: c.desc, path: `.claude/commands/${c.id}.md` })),
};
fs.writeFileSync(path.join(ROOT, 'SKILLS.json'), JSON.stringify(catalog, null, 2));
console.log('SKILLS.json written:', catalog.skills.length, 'core skills');
console.log('skills', skills.length, '(core', skills.filter(s => s.core).length + ')', 'agents', agents.length, 'commands', commands.length, 'workflows', workflows.length);
console.log('unmapped:', unmapped.join(', ') || 'none');
console.log('size KB', Math.round(fs.statSync(OUT).size / 1024));
console.log('commands:', commands.map(c => c.id).join(', '));
console.log('workflows:', workflows.map(c => c.id).join(', '));
console.log('agents:', agents.map(c => c.id).join(', '));
