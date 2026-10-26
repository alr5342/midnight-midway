// Attraction prose describes local states. Journey handoffs live separately
// so changing attraction order does not change the puzzle/story narration.
const copy = {
  admission: 'Your ticket promises a ride. The carousel waits beyond the booth.',
  prizeTransition: 'Beyond the carousel, the prize stall seems to be waiting for someone.',
  inspection: 'The ink kept the tune; the horses kept its voices.',
  token: 'Perhaps this place has one last thing to give.',
  tokenHint: 'The token waits for your hand.',
  paused: 'Paused. Choose Play to continue.'
};

export function boothNarration({playing, seconds, rings, waiting}) {
  if (playing) return seconds < 3.5
    ? 'Someone has kept the late shift all these years.'
    : 'There is still a place for one more visitor.';
  if (rings > 0) {
    if (waiting >= 12000) return 'The old counter bell may have another answer in it.';
    return rings === 1
      ? 'Something beyond the glass seems to be listening.'
      : 'The silence inside has grown thin.';
  }
  if (waiting >= 24000) return 'A quiet chime might carry farther than a voice here.';
  if (waiting >= 12000) return 'A little brass bell waits beneath the window.';
  return 'The ticket window is lit. Someone may still be keeping the late shift.';
}

export function carouselNarration({playing, age, mistake, feedbackAge, waiting}) {
  if (playing) return age < 4
    ? 'For a moment, the years loosen their hold.'
    : 'An old evening finds its way back.';
  // Text remains readable after the much shorter note glint/sound ends.
  if (mistake && feedbackAge !== null && feedbackAge < 3200)
    return 'The tune slips away. Its missing bars may be lying nearby.';
  if (waiting >= 24000) return 'The higher marks belong to higher voices among the horses.';
  if (waiting >= 12000) return 'Rain spared a scrap of music on the path below the carousel.';
  return 'The painted horses have forgotten how the music goes.';
}

export function prizeNarration({playing, storyAge, failed, returnAge, bags, waiting}) {
  if (playing) return storyAge < 4.5
    ? 'For a moment, the stall seems to remember its old crowd.'
    : 'Something has been kept for the last visitor.';
  if (failed) return returnAge >= 12000
    ? 'The returned beanbags are yours to take.'
    : 'The stall is not finished with you. Something waits in the beanbag boxes.';
  if (bags === 1) return waiting < 14000
    ? 'One bag remains. The old scuffs may be worth a closer look.'
    : 'Some tins carry deeper dents than others.';
  if (waiting >= 28000) return 'Some tins carry deeper dents than others.';
  if (waiting >= 14000) return 'Two bags for the whole stack. The sign has weathered many tries.';
  return 'The old sign still offers a chance at a prize.';
}

export function endingNarration(poseAge) {
  if (poseAge < 3) return 'Some places can only stay for a little while.';
  if (poseAge < 7) return 'The night lets go of what it borrowed.';
  return 'Keep something of this night.';
}

function actedSince(activity, time) {
  return [activity.feedbackAt, activity.inspectedAt].some(at => at != null && at >= time);
}

// One priority rule, one bottom-box writer in app.js. The coordinator supplies
// the pending objective; the last completed object touched never chooses it.
export function selectNarration({clock, objective, booth, carousel, prize, ending, warning = ''}) {
  const message = (owner, text) => ({owner, text, hidden: false});
  if (clock.state === 'start' || ending.gone) return {owner: 'quiet', text: '', hidden: true};
  if (clock.state === 'paused') return message('paused', copy.paused);
  if (ending.claimed) return message('ending', ending.hint);
  if (warning) return message('notice', warning);
  if (booth.playing) return message('booth-story', booth.hint);
  if (carousel.playing) return message('carousel-story', carousel.hint);
  if (prize.playing) return message('prize-story', prize.hint);
  if (carousel.clueOpen) return message('inspection', copy.inspection);

  if (objective === 'booth') return message('booth', booth.hint);
  if (objective === 'carousel') {
    const handoff = booth.completed === 1 && clock.elapsedMs - booth.completedAt < 3200
      && !actedSince(carousel, booth.completedAt);
    return message('carousel', handoff ? copy.admission : carousel.hint);
  }
  if (objective === 'prize') {
    const handoff = carousel.completedAt !== null && clock.elapsedMs - carousel.completedAt < 3200
      && !actedSince(prize, carousel.completedAt);
    return message('prize', handoff ? copy.prizeTransition : prize.hint);
  }
  // The current game can still be replayed. While its earned token is out of
  // the aiming space, guide that attempt; never invite an unavailable claim.
  if (prize.tokenOpacity !== 1) return message('prize', prize.hint);
  if (!ending.ready) return message('notice', ending.assetFailure
    ? 'The ending artwork could not load. Reload to try again.'
    : 'The night is gathering its last memory…');
  return message('token', prize.returnAge >= 12000 ? copy.tokenHint : copy.token);
}
