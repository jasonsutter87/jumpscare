# chaos.js

**11 harmless office pranks for maximum chaos.**

Drop a single `<script>` tag into any webpage and watch your coworkers question reality. Each prank triggers once per victim (uses localStorage), so refreshing won't save them.

## Live Demo

**[https://jasonsutter87.github.io/jumpscare/](https://jasonsutter87.github.io/jumpscare/)**

---

## The Hacks

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
```

Each hack:
1. Shows a dramatic jumpscare intro
2. Applies the chaos effect
3. Stores a flag in localStorage (only triggers once per browser)

---

## Reset for Testing

Open browser console and run:

```js
// Reset a specific hack
localStorage.removeItem('theSans_spooked');
localStorage.removeItem('theCage_caged');
localStorage.removeItem('theDrift_drifted');
localStorage.removeItem('theGravity_fallen');
localStorage.removeItem('theBlur_blurred');
localStorage.removeItem('theRotate_rotated');
localStorage.removeItem('theSwap_swapped');
localStorage.removeItem('theClipper_clipped');
localStorage.removeItem('theDVD_bounced');
localStorage.removeItem('theVoid_voided');
localStorage.removeItem('theRickroll_rolled');

// Or reset all at once
['theSans_spooked', 'theCage_caged', 'theDrift_drifted', 'theGravity_fallen',
 'theBlur_blurred', 'theRotate_rotated', 'theSwap_swapped', 'theClipper_clipped',
 'theDVD_bounced', 'theVoid_voided', 'theRickroll_rolled'].forEach(k => localStorage.removeItem(k));
```

---

## Self-Hosting

Clone this repo and host it yourself:

```bash
git clone https://github.com/jasonsutter87/jumpscare.git
```

If hosting on a different domain, update `CHAOS_BASE` in `theClipper.js`:

```js
const CHAOS_BASE = 'https://your-domain.com/path';
```

---

## Project Structure

```
jumpscare/
├── index.html          # Main landing page
├── hacks/              # The chaos scripts
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
│   └── theRickroll.js
├── demos/              # Individual demo pages
│   ├── sans.html
│   ├── cage.html
│   └── ...
└── lib/                # Self-hosted dependencies
    └── clippy/         # Clippy assets (agent, sprites, sounds)
```

---

## Disclaimer

Use responsibly. Your coworkers will never trust you again.

No coworkers were permanently harmed in the making of these pranks.

---

## License

MIT - Go forth and cause chaos.
