// Active time since meaningful progress, never wall time or a CSS animation.
// Every horse/can is lit equally: this locates an interaction, not its answer.
export function guidanceAt(time,since,reducedMotion=false,failedAttempts=0) {
  const waiting=since===null?0:Math.max(0,time-since);
  const ramp=Math.max(0,Math.min(1,(waiting-8000)/32000));
  const strength=Math.max(ramp,Math.min(.55,failedAttempts*.18));
  const pulse=reducedMotion?1:.76+.24*Math.sin(waiting/1000*Math.PI*2/4.8);
  return {strength,halo:strength*pulse};
}
