import {execFileSync} from 'node:child_process';
import {writeFile} from 'node:fs/promises';

const options={encoding:'utf8'};
const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],options);
const revision=git('rev-parse','HEAD').trim();
const log=git('log','--date=iso-strict','--pretty=fuller','--stat');
await writeFile('GIT-LOG.txt',`Midnight Midway — exported Git history\nRevision: ${revision}\nExported: ${new Date().toISOString()}\n\n${log}`);
console.log(`Exported GIT-LOG.txt through ${revision}. This generated file is excluded from Git to avoid a self-referential commit.`);
