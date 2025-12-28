# chaos.js

**27 harmless office pranks for maximum chaos.**

Drop a single `<script>` tag into any webpage and watch your coworkers question reality. Each prank triggers once per victim (uses localStorage), so refreshing won't save them.

## Live Demo

**[https://jasonsutter87.github.io/jumpscare/](https://jasonsutter87.github.io/jumpscare/)**

---

## The Hacks

### Classic Collection

| Hack | Description | Demo |
|------|-------------|------|
| **theSans** | "You're getting hacked by theSans" jumpscare, then Comic Sans takes over everything. Forever. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/sans.html) |
| **theCage** | All images slowly transform into Nicolas Cage. Every. Single. One. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/cage.html) |
| **theDrift** | The cursor gets drunk. It drifts and wobbles, making clicking anything an adventure. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/drift.html) |
| **theGravity** | Newton's revenge. Page elements fall to the bottom with realistic physics. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/gravity.html) |
| **theBlur** | Page progressively gets blurrier over 10 minutes. Includes a helpful eye test chart. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/blur.html) |
| **theRotate** | The entire page slowly rotates. 0.1° at a time. Subtle enough to question your sanity. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/rotate.html) |
| **theSwap** | Corporate buzzword translator. "Meeting" → "Seance", "Deadline" → "Day of Reckoning". | [Demo](https://jasonsutter87.github.io/jumpscare/demos/swap.html) |
| **theClipper** | Clippy returns with the original animations. Dispenses unsolicited, unhelpful advice. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/clipper.html) |
| **theDVD** | The classic DVD screensaver logo bounces around. Corner hit counter included. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/dvd.html) |
| **theVoid** | Screen slowly fades to black like a dying monitor. "If you stare into the void..." | [Demo](https://jasonsutter87.github.io/jumpscare/demos/void.html) |
| **theRickroll** | No warning. No splash. 10 seconds of false security, then... never gonna give you up. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/rickroll.html) |

### Chaos Expansion Pack

| Hack | Description | Demo |
|------|-------------|------|
| **theFlip** | The entire page flips upside down. Australian mode engaged. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/flip.html) |
| **theEarthquake** | Random seismic activity shakes the page. Magnitude varies. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/earthquake.html) |
| **theCrash** | Fake Windows Blue Screen of Death. Complete with error codes. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/crash.html) |
| **theUpdate** | Fake Windows Update screen. Progress bar never finishes. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/update.html) |
| **theColoring** | Children's coloring book mode. Draw anywhere on screen with a color palette. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/coloring.html) |
| **theMatrix** | Green matrix rain falls across the screen. You are The One. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/matrix.html) |
| **theNyan** | Nyan Cat flies across the screen leaving a rainbow trail. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/nyan.html) |
| **theUwU** | All text transforms into UwU speak. *notices your productivity* OwO | [Demo](https://jasonsutter87.github.io/jumpscare/demos/uwu.html) |
| **theConfetti** | Random confetti explosions celebrate absolutely nothing. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/confetti.html) |
| **theZoom** | The page slowly zooms in. So slowly you won't notice until everything is HUGE. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/zoom.html) |
| **theCursor** | Five cursors appear. One is real. Good luck finding it. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/cursor.html) |
| **theDoge** | Much text. Very float. Wow. Doge-speak appears randomly. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/doge.html) |
| **theAds** | Fake 90s popup ads. "CONGRATULATIONS! You're the 1,000,000th visitor!" | [Demo](https://jasonsutter87.github.io/jumpscare/demos/ads.html) |
| **the3D** | The page tilts in 3D following your mouse. Reality is now optional. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/3d.html) |
| **theSound** | Random Windows XP-style sounds play. Beeps, boops, and chimes. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/sound.html) |
| **theSnow** | Snowflakes fall across the screen. Frost edges appear. Winter is coming. | [Demo](https://jasonsutter87.github.io/jumpscare/demos/snow.html) |

---

## Usage

Add one of these to any page's `<head>`:

```html
<!-- Pick your poison -->
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theSans.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theCage.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theDrift.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theGravity.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theBlur.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theRotate.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theSwap.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theClipper.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theDVD.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theVoid.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theRickroll.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theFlip.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theEarthquake.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theCrash.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theUpdate.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theColoring.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theMatrix.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theNyan.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theUwU.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theConfetti.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theZoom.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theCursor.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theDoge.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theAds.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/the3D.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theSound.js"></script>
<script src="https://jasonsutter87.github.io/jumpscare/hacks/theSnow.js"></script>
```

Each hack:
1. Shows a dramatic jumpscare intro
2. Applies the chaos effect
3. Stores a flag in localStorage (only triggers once per browser)

---

## Reset for Testing

Open browser console and run:

```js
// Reset all hacks at once
[
  'theSans_spooked', 'theCage_caged', 'theDrift_drifted', 'theGravity_fallen',
  'theBlur_blurred', 'theRotate_rotated', 'theSwap_swapped', 'theClipper_clipped',
  'theDVD_bounced', 'theVoid_voided', 'theRickroll_rolled', 'theFlip_flipped',
  'theEarthquake_shook', 'theCrash_crashed', 'theUpdate_updated', 'theColoring_colored',
  'theMatrix_unplugged', 'theNyan_nyaned', 'theUwU_uwued', 'theConfetti_partied',
  'theZoom_zoomed', 'theCursor_cursed', 'theDoge_wowed', 'theAds_advertised',
  'the3D_tilted', 'theSound_noisy', 'theSnow_frozen'
].forEach(k => localStorage.removeItem(k));
```

---

## Self-Hosting

Clone this repo and host it yourself:

```bash
git clone https://github.com/jasonsutter87/jumpscare.git
```

If hosting on a different domain, update `CHAOS_BASE` in `theClipper.js` and `theCage.js`:

```js
const CHAOS_BASE = 'https://your-domain.com/path';
```

---

## Project Structure

```
jumpscare/
├── index.html          # Main landing page
├── README.md           # This file
├── hacks/              # The chaos scripts (27 hacks)
│   ├── theSans.js
│   ├── theCage.js
│   ├── theDrift.js
│   ├── theGravity.js
│   ├── theBlur.js
│   ├── theRotate.js
│   ├── theSwap.js
│   ├── theClipper.js
│   ├── theDVD.js
│   ├── theVoid.js
│   ├── theRickroll.js
│   ├── theFlip.js
│   ├── theEarthquake.js
│   ├── theCrash.js
│   ├── theUpdate.js
│   ├── theColoring.js
│   ├── theMatrix.js
│   ├── theNyan.js
│   ├── theUwU.js
│   ├── theConfetti.js
│   ├── theZoom.js
│   ├── theCursor.js
│   ├── theDoge.js
│   ├── theAds.js
│   ├── the3D.js
│   ├── theSound.js
│   └── theSnow.js
├── demos/              # Individual demo pages
│   ├── sans.html
│   ├── cage.html
│   ├── drift.html
│   └── ... (27 demo pages)
└── lib/                # Self-hosted dependencies
    ├── clippy/         # Clippy assets (agent, sprites, sounds)
    └── cage/           # Nicolas Cage images
```

---

## Disclaimer

Use responsibly. Your coworkers will never trust you again.

No coworkers were permanently harmed in the making of these pranks.

---

## License

MIT - Go forth and cause chaos.
