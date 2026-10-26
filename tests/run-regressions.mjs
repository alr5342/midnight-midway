import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createPreviewServer} from '../serve.mjs';

// Run independent browser regressions sequentially to keep audio/browser load
// predictable. Save complete output while keeping terminal results readable.
const output=process.argv[2] || 'tests/results/organization/regressions';
await mkdir(output,{recursive:true});
let ownedServer;
try {
  const response=await fetch('http://127.0.0.1:4173/src/js/app.js');
  if(!response.ok) throw Error('Port 4173 is occupied by a different project');
} catch(error) {
  if(error.message.includes('different project'))throw error;
  ownedServer=createPreviewServer();
  await new Promise((resolve,reject)=>{ownedServer.once('error',reject);ownedServer.listen(4173,'127.0.0.1',resolve);});
}
const allCases=['check-shell','check-audio','check-lighting','check-fog','check-bats','check-light-alignment','check-story-assets','check-ticket-story','check-carriage','visual-check'];
if(process.argv[3] && !allCases.includes(process.argv[3]))throw Error('Unknown resume checkpoint');
const cases=allCases.slice(allCases.indexOf(process.argv[3] || allCases[0]));
let results=[];
if(process.argv[3]) {
  try {results=JSON.parse(await readFile(`${output}/summary.json`,'utf8')).results.filter(result=>!cases.includes(result.name) && result.status==='passed');} catch {}
}
try {
  for(const name of cases) {
    console.log(`Running ${name}…`);
    const args=[`tests/browser/${name}.mjs`,...(name==='visual-check'?['']:[]),`${output}/${name}`];
    try {
      const log=execFileSync(process.execPath,args,{encoding:'utf8',timeout:180000,windowsHide:true});
      await writeFile(`${output}/${name}.txt`,log);
      results.push({name,status:'passed'});console.log(`${name}: passed`);
    } catch(error) {
      await writeFile(`${output}/${name}.txt`,`${error.stdout || ''}\n${error.stderr || ''}`);
      results.push({name,status:'failed'});console.error(`${name}: failed; see ${output}/${name}.txt`);
      process.exitCode=1;break;
    }
  }
} finally {
  await writeFile(`${output}/summary.json`,JSON.stringify({status:results.length===allCases.length&&results.every(r=>r.status==='passed')?'passed':'incomplete-or-failed',results},null,2)+'\n');
  if(ownedServer){ownedServer.closeAllConnections();await new Promise(resolve=>ownedServer.close(resolve));}
}
