import {mountPrizeArtwork} from './artwork.js';
import {guidanceAt} from './guidance.js';

const sides=['left','right','top'];
const positions={left:[76,67.3],right:[90,67.3],top:[83,61.6]};
const smooth=value=>{const x=Math.max(0,Math.min(1,value));return x*x*(3-2*x);};
const duration=650, impact=220, fallDuration=270, stagger=65;

// Authored support relationships replace physics. A lower can carries the top
// with it, but never the other lower can. Only accepted aims spend a bag;
// the support state changes atomically when the throw settles.
export class PrizeGame {
  constructor() {
    this.unlockedAt=null;
    this.down=new Set();
    this.bags=2;
    this.throwing=null;
    this.serial=0;
    this.storyAt=null;
    this.storySerial=0;
    this.completed=false;
    this.completedStories=0;
    this.settledStory=0;
    this.tokenAwarded=false;
    this.feedbackAt=null;
    this.recentThrows=[];
    this.hintSince=null;
    this.bestDown=0;
    this.failedAttempts=0;
    this.returnAt=null;
  }

  unlock(time) {if(this.unlockedAt===null) {this.unlockedAt=time;this.hintSince=time;} }

  advance(time) {
    if(this.throwing&&time>=this.throwing.at+duration) {
      for(const side of this.throwing.falls)this.down.add(side);
      const finishedAt=this.throwing.at+duration;
      this.throwing=null;
      if(this.down.size>this.bestDown) {this.bestDown=this.down.size;this.hintSince=finishedAt;}
      if(this.down.size===3) {
        this.storyAt=finishedAt;
        this.storySerial++;
      } else if(this.bags===0) {
        this.failedAttempts++;this.returnAt=finishedAt;
      }
    }
    if(this.storyAt!==null&&time>=this.storyAt+8000&&this.settledStory!==this.storySerial) {
      this.settledStory=this.storySerial;
      this.completedStories++;
      this.completed=true;
      this.tokenAwarded=true;
      this.returnAt=this.storyAt+8000;
    }
  }

  throwAt(side,time) {
    const state=this.snapshot(time);
    if(this.unlockedAt===null||state.busy||this.bags===0||this.down.has(side)||!sides.includes(side))return false;
    const falls=[side];
    if(side!=='top'&&!this.down.has('top'))falls.push('top');
    this.bags--;
    this.throwing={at:time,side,falls,id:++this.serial};
    this.recentThrows.push(this.throwing);
    this.feedbackAt=time;
    return true;
  }

  retry(time) {
    const state=this.snapshot(time);
    if(this.unlockedAt===null||state.busy||(!state.failed&&!(state.completed&&this.bags===0)))return false;
    return this.restart(time);
  }

  restart(time) {
    this.advance(time);
    if(this.unlockedAt===null)return false;
    this.down.clear();this.bags=2;this.throwing=null;this.storyAt=null;this.feedbackAt=time;
    this.recentThrows=[];this.serial++;
    this.returnAt=null;
    return true;
  }

  snapshot(time,reducedMotion=false) {
    this.advance(time);
    const flight=this.throwing;
    const age=flight?time-flight.at:null;
    const storyAge=this.storyAt===null?null:(time-this.storyAt)/1000;
    const playing=storyAge!==null&&storyAge<8;
    const failed=!flight&&!playing&&this.bags===0&&this.down.size<3;
    const pickupAvailable=!flight&&!playing&&this.bags===0&&(failed||this.completed);
    const returnAge=this.returnAt===null?0:Math.max(0,time-this.returnAt);
    const returned=smooth(returnAge/450);
    const canPos=sides.map(side=>{
      const order=flight?.falls.indexOf(side)??-1;
      const travel=order<0?0:Math.max(0,Math.min(1,(age-impact-order*stagger)/fallDuration));
      const fall=travel*travel;
      return {side,opacity:this.down.has(side)?0:1-smooth((fall-.55)/.45),
        x:reducedMotion?0:fall*(side==='right'?8:-7),y:reducedMotion?0:fall*9,
        tilt:reducedMotion?0:fall*(side==='right'?100:-105)};
    });
    const progress=age===null?0:Math.min(1,age/impact);
    const [targetX,targetY]=flight?positions[flight.side]:[70,70];
    const flying={opacity:flight&&age<impact?1:0,
      x:reducedMotion?targetX:70+(targetX-70)*progress,
      y:reducedMotion?targetY:70+(targetY-70)*progress-6*Math.sin(progress*Math.PI),
      scale:reducedMotion?1:1-.4*progress,tilt:reducedMotion?0:100*progress};
    const haunted=playing?smooth((storyAge-1)/1)*(1-smooth((storyAge-4)/1.5)):0;
    // Keep earned progress during replays, but clear the waiting token from
    // the aiming space until that attempt/story ends.
    const tokenOpacity=this.tokenAwarded&&this.bags===0&&!flight&&!playing?1:playing?smooth((storyAge-4.5)/1.5):0;
    const cues=[];
    // Input unlock and ringing metal tails have different lifetimes.
    this.recentThrows=this.recentThrows.filter(item=>time<item.at+1400);
    for(const item of this.recentThrows) {
      cues.push({id:`throw-${item.id}`,name:'prize-throw',at:item.at,duration:.42});
      item.falls.forEach((side,i)=>cues.push({id:`tin-${item.id}-${side}`,name:'prize-tin',at:item.at+impact+i*stagger,duration:.85/(side==='top'?1.18:.9),rate:side==='top'?1.18:.9,gain:.8}));
    }
    const wakeAge=this.unlockedAt===null?null:(time-this.unlockedAt)/1000;
    const wakeEnvelope=wakeAge===null?0:smooth(wakeAge/.3)*(1-smooth((wakeAge-2.2)/1));
    const wakeLight=wakeEnvelope*(reducedMotion ? .32 : .36+.14*Math.sin(wakeAge*7)+.05*Math.sin(wakeAge*13));
    if(this.unlockedAt!==null)for(const [delay,rate] of [[300,.8],[750,.65]])cues.push({id:`stall-wake-${delay}`,name:'prize-tin',at:this.unlockedAt+delay,duration:.85/rate,rate,gain:.15});
    if(this.feedbackAt!==null&&!flight&&!playing&&this.bags===2)cues.push({id:`rack-${this.serial}-${this.feedbackAt}`,name:'prize-tin',at:this.feedbackAt,duration:.85,rate:.7,gain:.25});
    if(playing) {
      for(const [name,at,rate,gain] of [['prize-chime',0,.65,.7],['arrival',1.2,.8,.45],['departure',3.8,.8,.4],['prize-chime',4.5,1,.7]]) {
        const soundDuration=name==='prize-chime'?2.4:1.2;
        cues.push({id:`prize-story-${this.storySerial}-${at}`,name,at:this.storyAt+at*1000,duration:soundDuration/rate,rate,gain});
      }
    }
    const waiting=this.hintSince===null?0:time-this.hintSince;
    let hint=waiting>=28000?'The brightest scuffs are low on the old tins.':waiting>=14000?'At the prize stall, the sign still promises a game.':'Beyond the carousel, the prize stall is stirring. A game waits beneath its lights.';
    if(flight)hint='Something stirs behind the counter.';
    else if(failed)hint=returnAge>=12000?'The beanbags have found their boxes again. Perhaps another try.':'The bags return to their little boxes, as if the stall is still expecting you.';
    else if(this.bags===1)hint='One chance left; the shelf remembers every miss.';
    if(playing)hint=storyAge<1?'A winning note, from an empty stall.':storyAge<4.5?'Even the prizes remember the hands that held them.':'Some nights leave something behind.';
    else if(this.tokenAwarded&&this.bags===0&&!failed)hint='A small piece of a place the world forgot.';
    return {unlocked:this.unlockedAt!==null,bags:this.bags,down:[...this.down],throwing:Boolean(flight),busy:Boolean(flight)||playing,
      failed,playing,storyAge,completed:this.completed,completedStories:this.completedStories,tokenAwarded:this.tokenAwarded,
      pickupAvailable,bagReturn:pickupAvailable?{opacity:returned,y:reducedMotion||returned===1?0:-1.6*(1-returned)}:null,
      guidance:guidanceAt(time,this.hintSince,reducedMotion,this.failedAttempts),
      phase:playing?storyAge<1?'win':storyAge<4.5?'haunted':'token':failed?'retry':this.tokenAwarded&&this.bags===0?'reward':'aim',
      canPos,flying,haunted,wakeLight,prizeY:reducedMotion?0:-.65*haunted,tokenOpacity,
      tokenY:reducedMotion||!playing?0:1.8*(1-smooth((storyAge-4.5)/2)),
      sparks:playing?smooth((storyAge-4.5)/.4)*(1-smooth((storyAge-5.1)/.7)):0,
      cues:cues.filter(cue=>time>=cue.at&&time<cue.at+cue.duration*1000),hint};
  }
}

export function connectPrize(scene,playback,audio,{access,onActivity=()=>{}}) {
  const model=new PrizeGame(),art=mountPrizeArtwork(scene);
  const controls=document.querySelector('#prize-controls');
  const targets=[...controls.querySelectorAll('[data-can]')];
  const retry=document.querySelector('#prize-retry');
  const status=document.querySelector('#prize-status');
  const pair=scene.querySelector('.prize-pair');
  const canImages=new Map(sides.map(side=>[side,art.querySelector(`.prize-can-${side}`)]));
  const bags=[0,1].map(i=>art.querySelector(`.prize-bag-${i}`));
  const flying=art.querySelector('.prize-flying-bag'),token=art.querySelector('.prize-token');
  const sparks=art.querySelector('.prize-sparks'),wake=art.querySelector('.prize-wake');
  let ready=false,assetFailure=false;
  // SVG image nodes are not HTMLImageElements: explicitly decode all three
  // source assets so partially missing props never become playable.
  Promise.all(['prize-can-v1.png','prize-counter-v1.png','keepsake-token-v1.svg'].map(name=>{
    const image=new Image();image.src=new URL(`../../assets/story/${name}`,import.meta.url).href;return image.decode();
  })).then(()=>{ready=true;playback.notify();}).catch(()=>{assetFailure=true;playback.notify();});

  const canUse=()=>playback.canInteract&&ready&&audio.status!=='loading'&&access().rideCompleted&&!access().blocked&&!model.snapshot(playback.elapsedMs).busy;
  function render(clock) {
    const availability=access();
    if(availability.rideCompleted)model.unlock(clock.elapsedMs);
    const state=model.snapshot(clock.elapsedMs,clock.reducedMotion);
    const visible=clock.state!=='start'&&state.unlocked;
    const enabled=visible&&canUse();
    const guidanceActive=visible&&!availability.blocked&&!state.busy;
    controls.hidden=!visible;
    controls.dataset.phase=state.phase;
    for(const button of targets) {
      button.hidden=state.down.includes(button.dataset.can);
      button.setAttribute('aria-disabled',String(!enabled||state.bags===0));
    }
    retry.hidden=!state.pickupAvailable;
    retry.setAttribute('aria-disabled',String(!enabled));
    retry.setAttribute('aria-label',state.failed?'Pick up a returned beanbag for another round':'Pick up a beanbag to replay the game');
    const summary=state.playing?'The prize story is playing.':state.tokenAwarded&&!state.busy&&state.down.length===3?'All cans down. Brass Ferris-wheel keepsake received.':`${state.bags} beanbag${state.bags===1?'':'s'} remaining. ${state.down.length} of 3 cans down.`;
    if(visible&&status.textContent!==summary)status.textContent=summary;
    const focused=document.activeElement;
    if(targets.includes(focused)&&focused.hidden) {
      const next=targets.find(button=>!button.hidden&&button.getAttribute('aria-disabled')==='false');
      (next||(!retry.hidden?retry:document.querySelector('#playback'))).focus({preventScroll:true});
    }
    for(const can of state.canPos) {
      const image=canImages.get(can.side);
      image.style.opacity=can.opacity;
      const guide=guidanceActive&&!state.failed&&!state.tokenAwarded?state.guidance.halo:0;
      image.style.filter=guide?`drop-shadow(0 0 ${guide*5}px #ffe1ad80)`:'';
      image.style.transform=`translate(-50%, -100%) translate(${can.x*scene.clientWidth/100}px, ${can.y*scene.clientHeight/100}px) rotate(${can.tilt+(can.side==='left'?-1:can.side==='right'?1.2:-2)}deg)`;
    }
    // Returned bags make the explicit retry/replay target visible. They do not
    // refill the attempt until picked up, and remain absent during the story.
    for(let i=0;i<2;i++) {
      bags[i].style.opacity=state.bagReturn?state.bagReturn.opacity:state.bags>i?1:0;
      bags[i].style.transform=`translateY(${(state.bagReturn?.y||0)*scene.clientHeight/100}px)`;
      bags[i].style.filter=state.pickupAvailable?`drop-shadow(0 0 ${2+state.guidance.halo*6}px #ffe0a080)`:'';
    }
    flying.style.opacity=state.flying.opacity;
    flying.style.left=`${state.flying.x}%`;flying.style.top=`${state.flying.y}%`;
    flying.style.transform=`translate(-50%,-50%) rotate(${state.flying.tilt}deg) scale(${state.flying.scale})`;
    pair.style.transform=`translateY(${state.prizeY*scene.clientHeight/100}px)`;
    pair.style.filter=state.haunted?`brightness(${1+.35*state.haunted}) drop-shadow(0 0 ${state.haunted*5}px #b9def3)` : '';
    token.style.opacity=state.tokenOpacity;
    token.style.transform=`translateY(${state.tokenY*scene.clientHeight/100}px)`;
    sparks.style.opacity=state.sparks;
    wake.style.opacity=Math.max(state.wakeLight,guidanceActive&&!state.tokenAwarded&&!state.failed?state.guidance.halo*.5:0);
    audio.sync(clock,state.cues,'prize');
  }
  playback.subscribe(render);
  for(const button of targets)button.addEventListener('click',event=>{
    let side=button.dataset.can;
    // A real pointer chooses the nearest standing can, independent of which
    // generous hit region won DOM overlap. Keyboard retains the named target.
    if(event.detail>0) {
      const bounds=scene.getBoundingClientRect(),down=model.snapshot(playback.elapsedMs).down;
      side=sides.filter(name=>!down.includes(name)).sort((a,b)=>{
        const distance=name=>Math.hypot(event.clientX-bounds.left-positions[name][0]*bounds.width/100,event.clientY-bounds.top-positions[name][1]*bounds.height/100);
        return distance(a)-distance(b);
      })[0];
    }
    if(canUse()&&model.throwAt(side,playback.elapsedMs)) {
      onActivity();
      playback.notify();
    }
  });
  retry.addEventListener('click',()=>{
    if(canUse()&&model.retry(playback.elapsedMs)) {
      onActivity();
      playback.notify();targets[0].focus({preventScroll:true});
    }
  });
  return {
    snapshot:()=>({...model.snapshot(playback.elapsedMs,playback.reducedMotion),ready,assetFailure}),
    hint:()=>assetFailure?'The game props could not load. Reload to try again.':model.snapshot(playback.elapsedMs).hint,
    restart:()=>model.restart(playback.elapsedMs)
  };
}
