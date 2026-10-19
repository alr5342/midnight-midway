import {readFileSync} from 'node:fs';
const mapping=JSON.parse(readFileSync(new URL('../../docs/FILE-MAP.json',import.meta.url),'utf8'));
// Historical hash inventories retain original paths and bytes. Resolve their
// old asset locations against the active checkout instead of rewriting evidence.
export function legacyAssetPath(file) {
  const relative=file.replaceAll('\\','/').split('/project-4-template/').at(-1);
  return mapping[relative] || relative;
}

// The original inventory also included five Markdown notes and a .gitkeep.
// Current notes need relocated links; only image/mask bytes are artwork.
// Keep the historical inventory untouched and retain every media comparison.
export function artworkBaseline() {
  const inventory=JSON.parse(readFileSync(new URL('../../docs/history/20261016-145826/artwork-hashes.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
  return inventory.filter(entry=>/\.(?:png|svg|wav|ogg)$/i.test(entry.Path));
}
