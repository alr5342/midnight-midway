// Credits are an in-scene modal. Opening it pauses the shared experience;
// closing it never resumes audio or a story without an explicit Play action.
export function connectCredits(playback) {
  const dialog = document.querySelector('#credits-dialog');
  const open = document.querySelector('#credits-open');
  const close = document.querySelector('#credits-close');
  open.addEventListener('click', () => {
    playback.pause();
    dialog.showModal();
    close.focus();
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if(event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href]')];
    // Some browsers skip links in their default Tab order. Use the same full
    // control order everywhere instead of only trapping the boundary keys.
    const index = controls.indexOf(document.activeElement);
    const next = (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
    event.preventDefault();
    controls[next].focus();
  });
  dialog.addEventListener('close', () => open.focus({preventScroll:true}));
}
