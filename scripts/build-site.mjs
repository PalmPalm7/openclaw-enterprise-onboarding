// Render only the two public onboarding guides. No private project inputs or remote assets.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Marked } from 'marked';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, '_site');
const guides = [
  { file: 'GETTING_STARTED.md', pane: 'human' },
  { file: 'GETTING_STARTED_AGENTS.md', pane: 'agent' },
];
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const plain = value => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const slug = value => plain(value).toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-');

function validateLink(value, file) {
  if (/^(?:https?:|mailto:)/i.test(value)) {
    if (/(?:app\.slack\.com|docs\.google\.com|openshiftapps\.com)/i.test(value)) {
      throw new Error(`${file}: private source or cluster link is not public onboarding material`);
    }
    return;
  }
  if (value.startsWith('#')) return;
  const [target] = value.split('#');
  if (!guides.some(guide => target === guide.file || target === `./${guide.file}`)) {
    throw new Error(`${file}: unsupported relative or unsafe link ${value}`);
  }
}

async function render({ file, pane }) {
  const markdown = await readFile(join(root, 'docs', file), 'utf8');
  if (/\/Users\/|file:\/\/|\.local\/access|MEETING_CONTEXT|app\.slack\.com|docs\.google\.com/.test(markdown)) {
    throw new Error(`${file}: contains a private path or internal context reference`);
  }
  const parser = new Marked({
    gfm: true,
    renderer: { html: token => escape(token.text) },
    walkTokens(token) {
      if (token.type === 'link' || token.type === 'image') validateLink(token.href, file);
    },
  });
  const headings = [];
  const seen = new Map();
  let html = parser.parse(markdown);
  html = html.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (_, level, label) => {
    const stem = slug(label);
    const count = seen.get(stem) || 0;
    seen.set(stem, count + 1);
    const id = `${pane}-${stem}${count ? `-${count}` : ''}`;
    if (level === '2') headings.push({ id, label: plain(label) });
    return `<h${level} id="${id}">${label}</h${level}>`;
  });
  html = html.replace(/href="([^"]+)"/g, (_, href) => {
    if (href.startsWith('#')) return `href="#${pane}-${href.slice(1)}"`;
    const match = href.match(/^(?:\.\/)?(GETTING_STARTED(?:_AGENTS)?\.md)(?:#([^"\s]+))?$/);
    if (!match) return `href="${href}"`;
    const targetPane = guides.find(guide => guide.file === match[1]).pane;
    return `href="#${targetPane}${match[2] ? `-${match[2]}` : ''}" data-pane="${targetPane}"`;
  });
  return { markdown, html, headings };
}

const [human, agent] = await Promise.all(guides.map(render));
const toc = records => records.map(heading => `<a href="#${heading.id}">${escape(heading.label)}</a>`).join('');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="OpenClaw Enterprise local onboarding: a short human quickstart and a detailed agent runbook, maintained by redhat-et.">
<title>OpenClaw Enterprise · Getting Started</title>
<style>
:root{color-scheme:light;--ink:#162a3b;--muted:#5a6876;--line:#dce3e8;--accent:#a32b27;--bg:#f5f7f8}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 system-ui,-apple-system,sans-serif}header{background:#fff;border-top:4px solid var(--accent);border-bottom:1px solid var(--line);padding:22px 5vw}.brand{font-size:12px;letter-spacing:.13em;font-weight:750;color:var(--muted);text-transform:uppercase}header h1{font-size:29px;margin:5px 0 4px;line-height:1.25}header p{margin:0;color:var(--muted);font-size:14px}.badge{display:inline-block;margin-left:12px;border:1px solid #e8c9c3;background:#fff3ef;color:#85342b;border-radius:6px;padding:2px 8px;font-size:12px;vertical-align:middle}.layout{display:grid;grid-template-columns:250px minmax(0,850px);gap:34px;max-width:1180px;margin:30px auto;padding:0 22px}aside{align-self:start;position:sticky;top:20px}nav[role=tablist]{display:grid;gap:8px}button.tab{font:inherit;text-align:left;border:1px solid var(--line);border-radius:8px;background:#fff;padding:12px 14px;cursor:pointer;font-weight:650}button.tab[aria-selected=true]{border-color:var(--accent);background:#fff4f0;color:#86312b}.hint,.downloads{font-size:13px;color:var(--muted);margin:18px 0}.downloads a{display:block;margin:5px 0}.toc{display:grid;gap:7px;margin-top:22px;font-size:13px;max-height:55vh;overflow:auto}.toc a{color:var(--muted);text-decoration:none;padding-left:10px;border-left:2px solid #dce3e8}.toc a:hover{color:var(--accent);border-color:var(--accent)}article{background:#fff;border:1px solid var(--line);border-radius:12px;padding:32px 40px;min-width:0}article>h1:first-child{font-size:29px;margin:0 0 18px;line-height:1.25}h2{font-size:22px;margin-top:34px;border-top:1px solid var(--line);padding-top:22px;line-height:1.35}h3{font-size:18px;margin-top:25px}p{margin:12px 0}a{color:#8b302b;text-underline-offset:3px}code{font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;background:#f0f3f5;border-radius:4px;padding:2px 5px;overflow-wrap:anywhere}pre{background:#122b3a;color:#eff6fa;border-radius:8px;padding:34px 20px 17px;overflow:auto;line-height:1.55;white-space:pre;position:relative}pre code{background:none;padding:0;color:inherit;font-size:12px;overflow-wrap:normal}table{display:block;overflow-x:auto;border-collapse:collapse;width:100%;font-size:14px;margin:20px 0}td,th{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid var(--line);min-width:130px}th{background:#f3f5f6}ul,ol{padding-left:24px}li{margin:7px 0}blockquote{border-left:3px solid #d89b89;margin:18px 0;padding:1px 17px;background:#fff7f1}footer{font-size:12px;color:var(--muted);max-width:1180px;margin:25px auto 40px;padding:0 22px}.copy{position:absolute;right:7px;top:7px;border:1px solid #657985;border-radius:4px;color:#dcebf3;background:#233f50;padding:3px 7px;cursor:pointer;font-size:11px}.copy:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid #db987c;outline-offset:2px}[hidden]{display:none!important}h1,h2,h3{scroll-margin-top:20px}@media(max-width:850px){.layout{display:block;margin-top:18px}aside{position:static;margin-bottom:20px}.toc{display:none}nav[role=tablist]{grid-template-columns:1fr 1fr}.hint{margin:9px 0}article{padding:22px}header h1{font-size:25px}}@media print{aside,.copy{display:none}.layout{display:block;max-width:none}article{border:0;padding:0}header{padding:12px 0}pre{white-space:pre-wrap}a{color:inherit}}
</style></head><body>
<header><div class="brand">redhat-et · development onboarding</div><h1>OpenClaw Enterprise <span class="badge">Local development</span></h1><p>A short quickstart for humans. A detailed runbook for agents.</p></header>
<main class="layout"><aside><nav role="tablist" aria-label="Guide versions"><button class="tab" id="human-tab" role="tab" aria-selected="true" aria-controls="human" tabindex="0" data-select="human">For humans<br><small>Five steps · quickstart</small></button><button class="tab" id="agent-tab" role="tab" aria-selected="false" aria-controls="agent" tabindex="-1" data-select="agent">For agents<br><small>Detailed runbook · verification</small></button></nav><p class="hint">Apple Silicon + Colima + k3d.<br>Read the guide's validation scope before deploying.</p><div class="downloads"><a href="./GETTING_STARTED.md" download>Download human guide</a><a href="./GETTING_STARTED_AGENTS.md" download>Download agent runbook</a><a href="https://github.com/redhat-et/openclaw-enterprise-onboarding">Contribute on GitHub</a><a href="https://github.com/openclaw/openclaw-enterprise">OpenClaw Enterprise source</a></div><div class="toc" id="human-toc">${toc(human.headings)}</div><div class="toc" id="agent-toc" hidden>${toc(agent.headings)}</div></aside>
<article id="human" role="tabpanel" aria-labelledby="human-tab">${human.html}</article>
<article id="agent" role="tabpanel" aria-labelledby="agent-tab" hidden>${agent.html}</article></main>
<footer>Public onboarding maintained by redhat-et. This guide documents a local development setup; it does not qualify a production installation. <a href="https://github.com/redhat-et/openclaw-enterprise-onboarding/issues">Report a docs issue</a>.</footer>
<script>
function selectPane(name){if(!['human','agent'].includes(name))return;for(const item of ['human','agent']){document.getElementById(item).hidden=item!==name;document.getElementById(item+'-toc').hidden=item!==name;const tab=document.getElementById(item+'-tab');tab.setAttribute('aria-selected',String(item===name));tab.tabIndex=item===name?0:-1}}
document.querySelectorAll('[data-select]').forEach(button=>{button.addEventListener('click',()=>{selectPane(button.dataset.select);location.hash=button.dataset.select;window.scrollTo({top:0,behavior:'smooth'})});button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();const name=event.key==='Home'?'human':event.key==='End'?'agent':button.dataset.select==='human'?'agent':'human';document.getElementById(name+'-tab').click();document.getElementById(name+'-tab').focus()})});
document.querySelectorAll('[data-pane]').forEach(link=>link.addEventListener('click',()=>selectPane(link.dataset.pane)));
function syncHash(){if(location.hash==='#agent'||location.hash.startsWith('#agent-'))selectPane('agent');else if(location.hash==='#human'||location.hash.startsWith('#human-'))selectPane('human');const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)requestAnimationFrame(()=>target.scrollIntoView())}
addEventListener('hashchange',syncHash);syncHash();
document.querySelectorAll('pre').forEach(pre=>{const code=pre.querySelector('code');if(!code?.className.includes('language-bash')&&!code?.className.includes('language-sh'))return;const button=document.createElement('button');button.className='copy';button.textContent='Copy';button.setAttribute('aria-label','Copy command block');button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code.textContent);button.textContent='Copied';setTimeout(()=>button.textContent='Copy',1400)}catch{button.textContent='Select text';setTimeout(()=>button.textContent='Copy',1400)}});pre.append(button)});
</script></body></html>`;

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
for (const [, href] of html.matchAll(/href="(#[^"]+)"/g)) {
  if (!ids.has(decodeURIComponent(href.slice(1)))) throw new Error(`Broken site anchor: ${href}`);
}
await mkdir(output, { recursive: true });
await writeFile(join(output, 'index.html'), html);
await Promise.all(guides.map((guide, index) => writeFile(join(output, guide.file), [human, agent][index].markdown)));
await writeFile(join(output, '.nojekyll'), '');
console.log(JSON.stringify({ output: '_site/index.html', humanSections: human.headings.length, agentSections: agent.headings.length, bytes: Buffer.byteLength(html) }));
