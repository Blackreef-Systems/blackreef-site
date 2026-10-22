import fs from 'node:fs';
import path from 'node:path';
const pages = ['index.html','notes/index.html','sample-report/index.html'];
let errors = 0;
for (const file of pages) {
  const html = fs.readFileSync(file,'utf8');
  const fail = message => { console.error(`ERROR [${file}] ${message}`); errors++; };
  if (!/<html\\s+lang="en"/i.test(html)) fail('missing document language');
  if (!/<meta\\s+name="viewport"/i.test(html)) fail('missing responsive viewport');
  if (!/<title>[^<]+<\\/title>/i.test(html)) fail('missing page title');
  if (!/<main\\b/i.test(html)) fail('missing main landmark');
  if (!/<nav\\b/i.test(html)) fail('missing navigation landmark');
  if (!/<h1\\b/i.test(html)) fail('missing h1');
  if (!/<meta\\s+name="description"/i.test(html)) fail('missing meta description');
  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(x=>x[1]);
  for (const url of links) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    const clean = url.split(/[?#]/)[0];
    if (!clean) continue;
    const resolved = clean.startsWith('/') ? clean.slice(1) : path.join(path.dirname(file),clean);
    const candidate = resolved.endsWith('/') || !path.extname(resolved) ? path.join(resolved,'index.html') : resolved;
    if (!fs.existsSync(candidate)) fail(`broken local reference: ${url}`);
  }
  console.log(`Checked ${file} (${links.length} references)`);
}
if (errors) { console.error(`${errors} site checks failed`); process.exit(1); }
console.log('All static site checks passed.');
