import {endingNarration} from './narration.js';

const smooth=value=>{const x=Math.max(0,Math.min(1,value));return x*x*(3-2*x);};
// Approved ending-stage coordinates and feathered masks. The empty land is
// always opaque; only copies of park pixels dissolve above it.
const masks={
  carousel:'M278 810 L455 700 L525 698 L727 820 L730 1155 L285 1165Z',
  stall:'M738 660 L941 530 L941 1250 L770 1190 L715 930Z',
  wheel:'M182 88 Q510 -15 722 150 Q835 290 786 490 L708 600 L620 728 L350 728 L290 650 L270 518 L160 478 Q105 285 182 88Z'
};
const tokenPoses=[[0,84,66,12],[2,59,54,24],[5,50,50,31],[8,50,46,34],[10,50,46,36]];
export const endingDuration=8;

export class Ending {
  constructor() {this.claimedAt=null;}
  get claimed() {return this.claimedAt!==null;}
  claim(time,allowed) {
    if(this.claimed||!allowed)return false;
    this.claimedAt=time;return true;
  }
  snapshot(time,reducedMotion=false) {
    const age=this.claimed?Math.max(0,(time-this.claimedAt)/1000):0;
    // Keep every approved pose/fade relationship, on a shorter timeline.
    const poseAge=age*10/endingDuration;
    let token=[84,66,12];
    for(let i=1;i<tokenPoses.length;i++) {
      const before=tokenPoses[i-1],after=tokenPoses[i];
      if(poseAge>=before[0])token=after.slice(1).map((end,j)=>before[j+1]+(end-before[j+1])*smooth((poseAge-before[0])/(after[0]-before[0])));
    }
    if(reducedMotion&&this.claimed)token=[50,46,36];
    return {claimed:this.claimed,age,gone:this.claimed&&age>=endingDuration,resting:this.claimed&&age>=endingDuration+2,
      site:1-smooth(poseAge/2.8),carousel:1-smooth((poseAge-2.5)/3),stall:1-smooth((poseAge-4)/2.5),wheel:1-smooth((poseAge-6.8)/3.2),
      fog:.20*smooth(poseAge/2)*(1-smooth((poseAge-6.5)/3.5)),token,
      tokenOpacity:reducedMotion&&this.claimed?smooth(age/.5):1,
      storyLevel:this.claimed?1-smooth(poseAge/9.5):1,windLevel:this.claimed?1-smooth(poseAge/10):1,
      hint:endingNarration(poseAge)};
  }
}

// Clone the current settled artwork, including actual horse positions and
// corrected gondola. Namespace SVG definitions so no duplicate IDs or live
// controller references can leak into the frozen memories.
function memoryOf(scene,prefix) {
  const copy=scene.cloneNode(true);
  copy.classList.add('ending-copy');copy.setAttribute('aria-hidden','true');
  for(const token of copy.querySelectorAll('.prize-token'))token.remove();
  const ids=new Map([...copy.querySelectorAll('[id]')].map(node=>[node.id,`${prefix}-${node.id}`]));
  for(const node of [copy,...copy.querySelectorAll('*')])for(const attribute of [...node.attributes]) {
    let value=attribute.value;
    if(attribute.name==='id')value=ids.get(value)||value;
    else for(const [oldId,newId] of ids) {
      value=value.replaceAll(`url(#${oldId})`,`url(#${newId})`);
      if(value===`#${oldId}`)value=`#${newId}`;
    }
    if(value!==attribute.value)node.setAttribute(attribute.name,value);
  }
  return copy;
}

export function connectEnding(scene,playback,ambient,audio,{access}) {
  const model=new Ending(),stage=document.querySelector('#stage');
  const claim=document.querySelector('#claim-token'),revisit=document.querySelector('#revisit');
  const status=document.querySelector('#ending-status');
  const layer=document.createElement('div');layer.className='ending-runtime';layer.hidden=true;layer.setAttribute('aria-hidden','true');
  const field=new Image();field.className='ending-land';field.alt='';
  field.src=new URL('../../assets/artwork/empty-field-v1.png',import.meta.url).href;
  const token=new Image();token.className='ending-token';token.alt='';
  token.src=new URL('../../assets/story/keepsake-token-v1.svg',import.meta.url).href;
  const fog=document.createElement('div');fog.className='ending-fog';
  const light=document.createElement('div');light.className='ending-last-light';
  layer.append(field,fog,light,token);stage.insertBefore(layer,document.querySelector('.app-ui'));
  let ready=false,assetFailure=false,full=null;
  const memories=new Map();
  Promise.all([field.decode(),token.decode()]).then(()=>{ready=true;playback.notify();}).catch(()=>{assetFailure=true;playback.notify();});
  const allowed=()=>playback.canInteract&&ready&&access().tokenAwarded&&access().tokenOffered&&!access().blocked;
  function mountMemories() {
    full=memoryOf(scene,'ending-full');layer.insertBefore(full,fog);
    for(const [name,path] of Object.entries(masks)) {
      const memory=document.createElement('div');memory.className=`ending-memory ending-${name}-memory`;
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 941 1672"><defs><filter id="edge" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter></defs><path d="${path}" fill="white" filter="url(#edge)"/></svg>`;
      memory.style.maskImage=`url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      memory.append(memoryOf(scene,`ending-${name}`));layer.insertBefore(memory,fog);memories.set(name,memory);
    }
    scene.style.visibility='hidden';layer.hidden=false;
  }
  function render(clock) {
    const state=model.snapshot(clock.elapsedMs,clock.reducedMotion),progress=access();
    const offered=clock.state!=='start'&&progress.tokenAwarded&&progress.tokenOffered&&!progress.blocked&&!state.claimed;
    claim.hidden=!offered;claim.setAttribute('aria-disabled',String(!allowed()||state.claimed));
    claim.style.setProperty('--claim-glow',String(clock.reducedMotion ? .4 : .4+.12*Math.sin(clock.elapsedMs/1100)));
    revisit.hidden=!state.resting;
    stage.dataset.ending=String(state.claimed);
    if(state.claimed) {
      if(!full)mountMemories();
      full.style.opacity=state.site;
      for(const [name,memory] of memories)memory.style.opacity=state[name];
      fog.style.opacity=state.fog;light.style.opacity=state.wheel*.3*smooth((state.age*10/endingDuration-6)/2);
      token.style.left=`${state.token[0]}%`;token.style.top=`${state.token[1]}%`;token.style.width=`${state.token[2]}%`;token.style.opacity=state.tokenOpacity;
      const summary=state.gone?'The midway has vanished. The brass keepsake and moonlit field remain.':state.hint;
      if(status.textContent!==summary)status.textContent=summary;
    }
    ambient.setLevel(state.windLevel);audio.setLevel(state.storyLevel);
    const cues=state.claimed&&state.age<3?[{id:'token-claimed',name:'prize-chime',at:model.claimedAt,duration:3,rate:.8,gain:.55}]:[];
    audio.sync(clock,cues,'ending');
  }
  playback.subscribe(render);
  claim.addEventListener('click',()=>{
    if(model.claim(playback.elapsedMs,allowed())) {
      playback.notify();document.querySelector('#playback').focus({preventScroll:true});
    }
  });
  revisit.addEventListener('click',()=>{
    if(model.snapshot(playback.elapsedMs).resting)location.reload();
  });
  return {snapshot:()=>({...model.snapshot(playback.elapsedMs,playback.reducedMotion),ready,assetFailure})};
}
