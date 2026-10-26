import {mountCarouselArtwork} from './artwork.js';
import {guidanceAt} from './guidance.js';
import {carouselNarration} from './narration.js';

const sequence = ['left', 'right', 'center', 'left'];
const rates = {left: 1, center: 2 ** (3 / 12), right: 2 ** (7 / 12)};
const smooth = value => {const x=Math.max(0,Math.min(1,value));return x*x*(3-2*x);};
const payoffMelody = [[.4,'left'],[1.3,'center'],[2.3,'right'],[3.4,'center'],[4.5,'right'],[5.7,'left']];
// Slow C-minor music-box phrase, an octave below the interactive notes.
const idleMelody = [0,7,3,0,5,3,-2,0].map(semitones=>.5*2**(semitones/12));

// Include the previous cycle's tail so notes decay naturally across the seam.
function musicAt(time, anchor) {
  if (anchor === null || time < anchor) return [];
  const cycle = Math.floor((time-anchor)/12000), cues=[];
  for(let turn=Math.max(0,cycle-1);turn<=cycle;turn++) {
    idleMelody.forEach((rate,index)=>{
      const at=anchor+turn*12000+index*1500, duration=.8/rate;
      if(time>=at&&time<at+duration*1000)cues.push({id:`midway-tune-${turn}-${index}`,name:'carousel-box',at,duration,rate,gain:.22});
    });
  }
  return cues;
}

// Attempts, the eight-second payoff and completed idle share active time.
export class CarouselPuzzle {
  constructor() {
    this.progress = 0;
    this.solved = false;
    this.unlockedAt = null;
    this.feedbackAt = null;
    this.note = null;
    this.mistake = false;
    this.serial = 0;
    this.inspectedAt = null;
    this.inspectionSerial = 0;
    this.payoffAt = null;
    this.payoffSerial = 0;
    this.completed = false;
    this.musicStartedAt = null;
    this.lastCompletedPayoffAt = null;
    this.completedAt = null;
    this.hintSince=null;
    this.bestProgress=0;
  }

  unlock(time) { if (this.unlockedAt === null) {this.unlockedAt=time;this.hintSince=time;} }

  play(note, time) {
    if (this.unlockedAt === null || !Object.hasOwn(rates,note) || this.snapshot(time).playing) return false;
    if (this.progress === sequence.length) this.progress = 0;
    this.mistake = note !== sequence[this.progress];
    this.progress = this.mistake ? 0 : this.progress + 1;
    if(this.progress>this.bestProgress) {this.bestProgress=this.progress;this.hintSince=time;}
    if (this.progress === sequence.length) {
      this.solved = true;
      this.payoffAt = time;
      this.payoffSerial++;
      if(this.musicStartedAt===null)this.musicStartedAt=time+8000;
    }
    this.feedbackAt = time;
    this.note = note;
    this.serial++;
    return true;
  }

  inspect(time) { if(this.inspectedAt===null)this.hintSince=time;this.inspectedAt = time; this.inspectionSerial++; }

  restart(time) {
    this.snapshot(time);
    this.progress=0;this.note=null;this.feedbackAt=null;this.mistake=false;this.inspectedAt=null;
    this.solved=this.completed;
    this.payoffAt=this.lastCompletedPayoffAt;
    if(!this.completed)this.musicStartedAt=null;
    if(this.unlockedAt!==null)this.unlockedAt=time;
  }

  snapshot(time, reducedMotion = false) {
    const age = this.payoffAt === null ? null : Math.max(0,(time-this.payoffAt)/1000);
    const playing = age !== null && age < 8;
    if (age !== null && age >= 8) {
      this.completed = true;this.lastCompletedPayoffAt=this.payoffAt;
      if (this.completedAt === null) this.completedAt = this.payoffAt + 8000;
    }
    const phase = age === null ? 'resting' : age < 1.2 ? 'lights' : age < 6 ? 'ride' : age < 8 ? 'settle' : 'idle';
    const envelope = age === null ? 0 : smooth((age-1.2)/1.3)*(1-.68*smooth((age-6)/2));
    // Small upward lifts avoid exposing cropped feet below the fixed railing.
    const horseY = [12,15,13.5].map((height,index)=>reducedMotion || age===null ? 0 : -height*envelope*(.5-.5*Math.cos(Math.max(0,age-1.2-index*.45)*Math.PI*2/3.8)));
    const light = age === null ? 0 : age < 1.2 ? .65*smooth(age/1.2) : age < 6 ? .65+(reducedMotion?0:.07*Math.sin(age*Math.PI/1.8)) : .65-.41*smooth((age-6)/2);
    const feedback = this.feedbackAt !== null && time - this.feedbackAt < 700;
    const cues = [];
    if (this.feedbackAt !== null && time - this.feedbackAt < 800 / rates[this.note]) {
      cues.push({id:`carousel-${this.serial}`,name:'carousel-box',at:this.feedbackAt,duration:.8 / rates[this.note],rate:rates[this.note]});
    }
    if (this.mistake && this.feedbackAt !== null && time - this.feedbackAt < 1600) cues.push({id:`carousel-wrong-${this.serial}`,name:'carousel-box',at:this.feedbackAt,duration:1.6,rate:.5});
    if (this.inspectedAt !== null && time - this.inspectedAt < 250) cues.push({id:`music-paper-${this.inspectionSerial}`,name:'arrival',at:this.inspectedAt,duration:.25});
    if (playing) {
      for(const [at,note] of payoffMelody) {
        const cueAt=this.payoffAt+at*1000,duration=.8/rates[note];
        if(time>=cueAt&&time<cueAt+duration*1000)cues.push({id:`ride-${this.payoffSerial}-${at}`,name:'carousel-box',at:cueAt,duration,rate:rates[note]});
      }
    }
    const waiting = this.hintSince === null ? 0 : time - this.hintSince;
    const hint = carouselNarration({playing, age, mistake: this.mistake,
      feedbackAge: this.feedbackAt === null ? null : time - this.feedbackAt, waiting});
    return {progress:this.progress,solved:this.solved,completed:this.completed,completedAt:this.completedAt,
      feedbackAt:this.feedbackAt,inspectedAt:this.inspectedAt,playing,phase,horseY,light,
      note:feedback?this.note:null,mistake:feedback&&this.mistake,hint,cues,musicCues:musicAt(time,this.musicStartedAt),guidance:guidanceAt(time,this.hintSince,reducedMotion)};
  }
}

export function connectCarousel(scene, playback, audio, {access, onSolved}) {
  const model = new CarouselPuzzle();
  const controls = document.querySelector('#carousel-controls');
  const paper = document.querySelector('#music-clue');
  const open = document.querySelector('#music-open');
  const close = document.querySelector('#music-close');
  const art = mountCarouselArtwork(scene,document.querySelector('#music-inspection-art'));
  const notes = [...controls.querySelectorAll('[data-horse-note]')];
  let clueOpen = false;
  let wasSolved = false;
  const canUse = () => playback.canInteract && access().admitted && !access().storyPlaying && !model.snapshot(playback.elapsedMs).playing;

  function render(snapshot) {
    const availability = access();
    if (availability.admitted) model.unlock(snapshot.elapsedMs);
    const state = model.snapshot(snapshot.elapsedMs,snapshot.reducedMotion);
    const visible = availability.admitted && !availability.storyPlaying && snapshot.state !== 'start';
    controls.hidden = !visible;
    paper.hidden = !visible || !clueOpen;
    const enabled = snapshot.canInteract && visible && !state.playing;
    for (const button of notes) {
      button.setAttribute('aria-disabled',String(!enabled || clueOpen || audio.status === 'loading'));
      button.dataset.active = String(state.note === button.dataset.horseNote);
    }
    open.setAttribute('aria-disabled',String(!enabled));
    open.tabIndex = availability.admitted ? 0 : -1;
    open.setAttribute('aria-expanded',String(clueOpen));
    close.setAttribute('aria-disabled',String(!enabled));
    controls.dataset.mistake = String(state.mistake);
    art.lights.style.opacity=String(state.light);
    const guide=visible&&!state.playing&&!state.completed?state.guidance.halo:0;
    art.ground.style.filter=guide?`drop-shadow(0 0 ${guide*7}px rgba(255,218,159,${guide*.6}))`:'';
    for (const [index,note] of Object.keys(rates).entries()) {
      const horse = scene.querySelector(`.horse-${note === 'center' ? 'center' : note}`);
      horse.style.filter = state.note === note ? 'brightness(1.2) drop-shadow(0 0 6px #ffe1ad)' : guide ? `brightness(${1+guide*.15}) drop-shadow(0 0 ${guide*5}px #ffe1ad70)` : state.light ? `brightness(${1+state.light*.16})` : '';
      horse.style.transform = `translateY(${state.horseY[index]*scene.clientHeight/1672}px)`;
    }
    if (state.solved && !wasSolved) onSolved();
    wasSolved=state.solved;
    audio.sync(snapshot, visible ? state.cues : [], 'carousel');
    // Activated music persists under other attractions, sharing their clock.
    audio.sync(snapshot,state.musicCues,'carousel-ambience');
  }
  playback.subscribe(render);

  function putAway() {
    if (!canUse()) return;
    clueOpen = false;
    model.inspect(playback.elapsedMs);
    playback.notify();
    open.focus({preventScroll:true});
  }
  for (const button of notes) button.addEventListener('click', () => {
    if (!canUse() || clueOpen || audio.status === 'loading') return;
    model.play(button.dataset.horseNote,playback.elapsedMs);
    playback.notify();
  });
  open.addEventListener('click', () => {
    if (!canUse()) return;
    if (clueOpen) {putAway();return;}
    clueOpen = true;
    model.inspect(playback.elapsedMs);
    playback.notify();
    close.focus({preventScroll:true});
  });
  close.addEventListener('click',putAway);
  document.addEventListener('keydown',event=>{
    if (event.key === 'Escape' && clueOpen && !document.querySelector('#credits-dialog').open) putAway();
  });
  return {
    snapshot: () => ({...model.snapshot(playback.elapsedMs,playback.reducedMotion),clueOpen}),
    restart:()=>{model.restart(playback.elapsedMs);clueOpen=false;}
  };
}
