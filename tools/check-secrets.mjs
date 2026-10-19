import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// Report locations, never matched credentials. This is a focused pre-commit
// check, not a guarantee that every possible secret format will be detected.
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:ghp_|github_pat_)[A-Za-z0-9_]{30,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk-[A-Za-z0-9_-]{32,}/,
  /\b(?:api[_-]?key|password|secret|access[_-]?token)\s*[:=]\s*["'][^"'\s]{16,}["']/i
];
const findings = [];
async function inspect(directory) {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const file = path.join(directory,entry.name);
    if (['.git','node_modules','submissions','results'].includes(entry.name)) continue;
    if (entry.isDirectory()) { await inspect(file); continue; }
    if (/\.(?:png|wav|ogg|zip|pdf)$/i.test(file)) continue;
    const body = await readFile(file,'utf8');
    if (patterns.some(pattern=>pattern.test(body))) findings.push(file);
  }
}
await inspect('.');
if(findings.length) { console.error('Potential secrets; review these files before committing:',findings);process.exitCode=1; }
else console.log('Focused secret scan passed: no matching credentials/private keys.');
