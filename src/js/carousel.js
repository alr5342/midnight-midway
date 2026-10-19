const sequence = ['left', 'right', 'center', 'left'];
const rates = {left: 1, center: 2 ** (3 / 12), right: 2 ** (7 / 12)};

// Attempt state uses active time only. Solving remembers the tune, not a ride
// completion: the carousel's audiovisual story belongs to a later checkpoint.
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
  }

  unlock(time) { if (this.unlockedAt === null) this.unlockedAt = time; }

  play(note, time) {
    if (this.unlockedAt === null || !Object.hasOwn(rates,note)) return false;
    if (this.progress === sequence.length) this.progress = 0;
    this.mistake = note !== sequence[this.progress];
    this.progress = this.mistake ? 0 : this.progress + 1;
    if (this.progress === sequence.length) this.solved = true;
    this.feedbackAt = time;
    this.note = note;
    this.serial++;
    return true;
  }

  inspect(time) { this.inspectedAt = time; this.inspectionSerial++; }

  snapshot(time) {
    const feedback = this.feedbackAt !== null && time - this.feedbackAt < 700;
    const cues = [];
    if (this.feedbackAt !== null && time - this.feedbackAt < 800 / rates[this.note]) {
      cues.push({id:`carousel-${this.serial}`,name:'carousel-box',at:this.feedbackAt,duration:.8 / rates[this.note],rate:rates[this.note]});
    }
    if (this.mistake && this.feedbackAt !== null && time - this.feedbackAt < 1600) cues.push({id:`carousel-wrong-${this.serial}`,name:'carousel-box',at:this.feedbackAt,duration:1.6,rate:.5});
    if (this.inspectedAt !== null && time - this.inspectedAt < 250) cues.push({id:`music-paper-${this.inspectionSerial}`,name:'arrival',at:this.inspectedAt,duration:.25});
    const waiting = this.unlockedAt === null ? 0 : time - this.unlockedAt;
    const hint = this.progress === 4 ? 'The tune is remembered. You can play it again.' : feedback && this.mistake ? 'That note slips away. Begin the tune again.' : waiting >= 24000 ? 'The tune returns to the horse where it began.' : waiting >= 12000 ? 'A scrap of music rests beside the horses.' : 'Each horse remembers a different note.';
    return {progress:this.progress,solved:this.solved,note:feedback?this.note:null,mistake:feedback&&this.mistake,hint,cues};
  }
}

export function connectCarousel(scene, playback, audio, {access, onSolved}) {
  const model = new CarouselPuzzle();
  const controls = document.querySelector('#carousel-controls');
  const progress = document.querySelector('#carousel-progress');
  const paper = document.querySelector('#music-clue');
  const open = document.querySelector('#music-open');
  const close = document.querySelector('#music-close');
  const notes = [...controls.querySelectorAll('[data-horse-note]')];
  let clueOpen = false;
  let wasSolved = false;
  let lastProgress = '';
  const canUse = () => playback.canInteract && access().admitted && !access().storyPlaying;

  function render(snapshot) {
    const availability = access();
    if (availability.admitted) model.unlock(snapshot.elapsedMs);
    const state = model.snapshot(snapshot.elapsedMs);
    const visible = availability.admitted && !availability.storyPlaying && snapshot.state !== 'start';
    controls.hidden = !visible;
    paper.hidden = !visible || !clueOpen;
    const enabled = snapshot.canInteract && visible;
    for (const button of notes) {
      button.setAttribute('aria-disabled',String(!enabled || clueOpen || audio.status === 'loading'));
      button.dataset.active = String(state.note === button.dataset.horseNote);
    }
    open.setAttribute('aria-disabled',String(!enabled));
    open.setAttribute('aria-expanded',String(clueOpen));
    close.setAttribute('aria-disabled',String(!enabled));
    controls.dataset.mistake = String(state.mistake);
    const text = state.progress === 4 ? 'Melody complete · play again' : state.mistake ? 'Wrong note · start again' : `${state.progress} / 4 notes`;
    if (text !== lastProgress) {progress.textContent = text;lastProgress = text;}
    for (const note of Object.keys(rates)) {
      const horse = scene.querySelector(`.horse-${note === 'center' ? 'center' : note}`);
      horse.style.filter = state.note === note ? 'brightness(1.2) drop-shadow(0 0 6px #ffe1ad)' : '';
    }
    if (state.solved && !wasSolved) {wasSolved = true;onSolved();}
    audio.sync(snapshot, visible ? state.cues : [], 'carousel');
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
    snapshot: () => ({...model.snapshot(playback.elapsedMs),clueOpen}),
    hint: () => clueOpen ? 'The worn music pairs each note with a horse.' : model.snapshot(playback.elapsedMs).hint
  };
}
