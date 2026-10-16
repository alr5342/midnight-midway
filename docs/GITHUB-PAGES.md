# GitHub Pages publishing handoff

Prepared locally only. **No GitHub repository, remote, push, Pages deployment or submission ZIP was created by the agent.** Review the app and preflight results before doing these steps. Keep Phase 2 deferred.

## What is prepared

- Static index.html at repository root; no npm build/framework/backend required.
- All runtime image, module, CSS, mask and audio URLs are relative to the project path. Local preflight serves the app under /midnight-midway-check/ to catch root-relative mistakes and verifies URL filename case against the filesystem.
- Empty .nojekyll tells Pages to serve the static files without Jekyll processing.
- Local main branch with real commits starting from the existing approved prototype. Earlier dates/commits have not been invented; docs/history/ retains prior development evidence.
- .gitignore excludes credentials/caches/debug output/generated Git log/ZIPs. .gitattributes preserves approved binary/SVG artwork and normalizes source-code line endings.
- GIT-LOG.txt is generated after commits with `node tools/export-git-log.mjs`. It is intentionally untracked so its own hash does not create a circular update; include the refreshed export in the eventual submission ZIP.

## Publish after approving the local result

1. Sign into the intended GitHub account. Create a new **empty public repository**, for example midnight-midway. Do not initialize another README/license/gitignore because this folder already has its own Git history. Keep the previous project's repository unchanged.
2. Open this project folder in VS Code. In its terminal, verify `git status` and `git log --oneline -3`. The app candidate should be committed and the tree clean except ignored generated files. Review the commit identity before uploading.
3. Copy the new repository's HTTPS clone URL from GitHub. Replace YOUR-USERNAME below with your actual account and the repository name if different. Run each command separately:

   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/midnight-midway.git
   git push -u origin main
   ```

   Use GitHub's normal browser sign-in/credential manager if prompted. Do not paste a token or password into project files or the remote URL. If origin already exists, inspect `git remote -v` and stop to resolve the intended destination rather than overwriting it blindly. No force push is needed.
4. In the new GitHub repository, open **Settings → Pages**. Under Build and deployment, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then Save. Use root, not /docs: this project's docs/ contains documentation, not the app entry point.
5. Wait for the Pages deployment to succeed. Settings → Pages → **Visit site** gives the actual public URL, normally `https://YOUR-USERNAME.github.io/midnight-midway/`. Record the URL shown there instead of assuming a successful deployment. Check the repository's Actions tab if deployment fails.
6. Send the public URL back for verification. Check entry/reload, every image/mask/module/audio resource and three-ring story/replay before the phone checklist. Record the deployed commit via `git rev-parse HEAD` and the Pages deployment result.

Source checked 2026-10-16: [GitHub — configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GitHub — creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site). Branch/root publishing and .nojekyll suit this buildless app. Public repositories work with GitHub Free; account/organization policies may affect availability.

## Physical-phone verification — after public deployment

Test the public HTTPS link on the actual phone, not VS Code localhost. Fill in docs/PHONE-VERIFICATION.md with observed results. Include Enter/audio unlock, all ambience, hints/rings/story/replay, Play/Pause at each beat, tab/OS interruption followed by explicit Play, reduced motion, readability/targets, browser chrome and orientation. Any failure requires a fix, new commit/deploy and retest of the affected behavior.

## Final files and ZIP — after phone verification

Refresh the documents and Git log for the verified revision. Only then create the submission ZIP with sources, assets, brief/research/spec/plan/credits, deployment/phone evidence, relevant tests/history and GIT-LOG.txt. Exclude .git internals, caches, credentials/debug logs and recursive archives. Preserve all local work. Extract into a fresh folder, compare the inventory and run the extracted app. Record ZIP name, tested revision and results. No archive has been created at this checkpoint.

If Git reports ownership differences between this sandbox and your Windows account, use the following project-scoped versions of the commands above. This trusts only this known folder for that command and does not change global settings. Replace YOUR-USERNAME/repository as above; run the remote-add only once:

```powershell
git -c safe.directory=C:/Users/arose/OneDrive/Desktop/project-4-template status
git -c safe.directory=C:/Users/arose/OneDrive/Desktop/project-4-template remote add origin https://github.com/YOUR-USERNAME/midnight-midway.git
git -c safe.directory=C:/Users/arose/OneDrive/Desktop/project-4-template push -u origin main
```

The agent used this same scoped exception locally. No global trust setting was changed. Do not disable Git's safety check globally or force-push to resolve an ownership warning.
