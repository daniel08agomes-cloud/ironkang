# IRONKANG

A single-file, installable PWA workout tracker for two profiles (Daniel and
Beatriz). No build step, no backend — everything lives in `index.html` and
persists to `localStorage` on-device.

## Files

- `index.html` — the entire app: CSS, markup shell, and all JS (state,
  rendering, persistence). Everything below refers to this file.
- `manifest.json` / `sw.js` — PWA install manifest and service worker
  (offline caching, registered near the bottom of `index.html`).
- `icon-192.png`, `icon-512.png` — PWA icons.
- `gifs/` — exercise demo videos (`.mp4`). Currently **not referenced** by
  `index.html` — treat as an asset pool for a future feature, not dead code
  to delete.

## Architecture

Plain JS, no framework. A global `state` object holds UI/session state; a
`render()` function does a full re-render to `#app` by string-concatenating
HTML. Hot per-profile data (`userData`: progressions, PRs, history,
completed days) is separate from cold per-profile session logs
(`workoutSessions`), loaded/saved independently so the common path stays
cheap — see `loadCoreData`/`saveCoreData` vs `loadSessions`/`appendSession`.

`saveSession()` persists the in-progress workout (current sets, active day,
rest timer) to `ironkang_session` so a reload mid-workout doesn't lose data.

### Workout program data (`PROGRAMS`)

`PROGRAMS.<profile>.days.<dayKey>.exercises` is the source of truth for each
profile's split. Each exercise entry is one of two shapes:

- **Rep scheme** (pyramid/fixed-rep work, e.g. 21s, straight sets):
  `{ id, name, repScheme: [reps, ...], startWeight, tip }`. Number of sets
  is implied by `repScheme.length`. No automatic weight-progression button —
  the lifter taps the weight pill to adjust it manually when ready.
- **Range-based** (legacy style, e.g. Band Face Pull):
  `{ id, name, sets, min, max, startWeight, tip }`. Hitting `max` reps on
  every set surfaces a "Progress to weight+5" button (with PR detection).

Anywhere code needs a set count, branch on `ex.repScheme` first:
`ex.repScheme ? ex.repScheme.length : ex.sets`. This pattern is already used
in `completeWorkout()`, `addSet()`, and the exercise-card renderer — if you
add a new code path that touches set counts, follow the same branch or
rep-scheme exercises will silently log zero sets/volume.

### Exercise `id` stability

`id` is the persistence key for `userData.progressions[id]`, `userData.prs[id]`,
and `userData.history[].exerciseId` — it's what makes weight/PR history
survive a name or rep-scheme change. **Never change the `id` of an exercise
that has lifting history** if you want that history to carry over; change
`name`/`repScheme`/`tip` freely, but keep `id` and `startWeight` fixed
(current weight = `startWeight + 5 * progressions[id]`, via
`getCurrentWeight()`).

When a trainer plan reuses an id, keep `startWeight` exactly as it was —
don't reset it to match the new exercise's nominal starting load.

## Conventions

- Tips are short, imperative, form-cue sentences (one line, ~10-20 words).
- Profiles are fully independent: same exercise `id` used by both Daniel and
  Beatriz are unrelated — `userData` is keyed per-profile
  (`ironkang_<profile>_core` / `ironkang_<profile>_sessions`), so there's no
  cross-profile history collision.
- No tests/build/lint — this is a single static HTML file. Validate changes
  by opening `index.html` directly or via the `run` skill, and sanity-check
  JS syntax (e.g. `node -e "new Function(fs.readFileSync(...))"` on the
  extracted `<script>` block) before committing.
