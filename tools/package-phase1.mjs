import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile,copyFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const label=process.argv[2];
assert.ok(['candidate','final'].includes(label),'Choose candidate or final');
const root=process.cwd();
const git=(...args)=>execFileSync('git',['-c',`safe.directory=${root.replaceAll('\\','/')}`,...args],{encoding:'utf8'});
const revision=git('rev-parse','HEAD').trim();
if(label==='final') assert.equal(git('status','--porcelain').trim(),'','Final package requires committed source/docs and a clean working tree');
const timestamp=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(new Date()).replaceAll(/[- :]/g,'');
const name=`midnight-midway-phase1-${timestamp}-${label}`;
const output=path.join(root,'submissions');await mkdir(output,{recursive:true});
const stage=path.join(output,`${name}-staging`);
const extraction=path.join(output,`${name}-extracted`);
const projectName='midnight-midway-phase1';
const stageProject=path.join(stage,projectName);
const extractedProject=path.join(extraction,projectName);
const archive=path.join(output,`${name}.zip`);
await mkdir(stageProject,{recursive:true});
const files=git('ls-files','-z').split('\0').filter(Boolean);
files.push('GIT-LOG.txt');files.sort();
const inventory=[];
for(const file of files) {
  assert.ok(!file.startsWith('submissions/') && !file.startsWith('.git/') && !file.endsWith('.zip'),`Excluded generated/internal path tracked: ${file}`);
  assert.ok(!/(^|\/)(?:\.env(?:\..*)?|node_modules|debug\.log)$/.test(file),`Disallowed submission path: ${file}`);
  const bytes=await readFile(file);
  const destination=path.join(stageProject,file);await mkdir(path.dirname(destination),{recursive:true});await copyFile(file,destination);
  inventory.push({path:file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
for(const required of ['index.html','serve.mjs','brief.md','research.md','spec.md','plan.md','README.md','CREDITS.md','GIT-LOG.txt','.nojekyll','.gitignore','.gitattributes','docs/PHONE-VERIFICATION.md','docs/PHASE-1-AUDIT.md','docs/DEPLOYMENT.md']) assert.ok(files.includes(required),`Required file missing: ${required}`);
assert.match(await readFile('GIT-LOG.txt','utf8'),new RegExp(revision),'Refresh Git log for this commit before packaging');
const manifest={project:projectName,label,archiveFileName:`${name}.zip`,sourceCommit:revision,publicURL:'https://alr5342.github.io/midnight-midway/',createdAt:new Date().toISOString(),fileCount:inventory.length,files:inventory,exclusions:['.git internals','debug.log','credentials/caches','submissions and recursive archives'],transcripts:'brief.md does not require session transcripts for Phase 1; existing transcripts/ and historical evidence are included. No missing transcript text is fabricated.'};
await writeFile(path.join(stageProject,'SUBMISSION-MANIFEST.json'),JSON.stringify(manifest,null,2));
execFileSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',path.join(root,'tools/package-phase1.ps1'),'-SourcePath',stage,'-ArchivePath',archive,'-ExtractPath',extraction],{stdio:'pipe'});
async function list(directory,prefix='') {
  const result=[];
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const relative=prefix+entry.name;
    if(entry.isDirectory())result.push(...await list(path.join(directory,entry.name),relative+'/'));
    else result.push(relative);
  }
  return result.sort();
}
assert.deepEqual(await list(extractedProject),[...files,'SUBMISSION-MANIFEST.json'].sort(),'ZIP extraction inventory differs from submission source');
for(const entry of inventory) {
  const bytes=await readFile(path.join(extractedProject,entry.path));
  assert.equal(bytes.length,entry.bytes,entry.path);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,`Extracted hash differs: ${entry.path}`);
}
assert.deepEqual(JSON.parse(await readFile(path.join(extractedProject,'SUBMISSION-MANIFEST.json'),'utf8')),manifest);
const result={status:'inventory-passed-runtime-test-pending',archive,extractedProject,sourceCommit:revision,fileCount:inventory.length+1,archiveBytes:(await stat(archive)).size,sha256:createHash('sha256').update(await readFile(archive)).digest('hex'),allFilesAndHashesMatch:true,hiddenFilesIncluded:true,manifest:'SUBMISSION-MANIFEST.json',publicURL:manifest.publicURL};
const report=path.join(output,`${name}-verification.json`);await writeFile(report,JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,report},null,2));
