(function() {
  // ===========================================
  // CONFIGURATION OPTIONS
  // ===========================================
  const CONFIG = {
    showIntro: true,                      // Set to false to skip the intro overlay
    introDelay: 2500,                     // How long to show intro (in milliseconds)
    storageDuration: 24 * 60 * 60 * 1000  // How long before hack can trigger again (default: 24 hours)
  };
  // ===========================================

  const stored = localStorage.getItem('theSwap_swapped');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theSwap_swapped', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const swaps = {
    'meeting': 'seance',
    'Meeting': 'Seance',
    'deadline': 'day of reckoning',
    'Deadline': 'Day of Reckoning',
    'urgent': 'mildly interesting',
    'Urgent': 'Mildly Interesting',
    'ASAP': 'whenever you feel like it',
    'important': 'optional',
    'Important': 'Optional',
    'manager': 'overlord',
    'Manager': 'Overlord',
    'team': 'cult',
    'Team': 'Cult',
    'sync': 'summoning',
    'Sync': 'Summoning',
    'bandwidth': 'emotional capacity',
    'stakeholder': 'random person',
    'Stakeholder': 'Random Person',
    'leverage': 'exploit',
    'Leverage': 'Exploit',
    'circle back': 'haunt you later',
    'touchbase': 'awkward encounter',
    'deliverable': 'sacrifice',
    'Deliverable': 'Sacrifice',
    'align': 'brainwash',
    'Align': 'Brainwash',
    'synergy': 'dark magic',
    'Synergy': 'Dark Magic',
    'proactive': 'anxious',
    'Proactive': 'Anxious',
    'pivot': 'panic',
    'Pivot': 'Panic',
    'roadmap': 'treasure map',
    'Roadmap': 'Treasure Map',
    'workflow': 'hamster wheel',
    'Workflow': 'Hamster Wheel',
    'optimize': 'complicate',
    'Optimize': 'Complicate',
    'robust': 'fragile',
    'Robust': 'Fragile',
    'scalable': 'probably broken',
    'Scalable': 'Probably Broken'
  };

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #swap-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #0d0d0d;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Courier New', monospace;
      }
      #swap-overlay .swap-text {
        color: #00ff00;
        font-size: 2rem;
        animation: glitch 0.3s infinite;
      }
      #swap-overlay .swap-icon {
        font-size: 5rem;
        margin: 20px 0;
      }
      #swap-overlay .swap-subtitle {
        color: #666;
        font-size: 1rem;
      }
      @keyframes glitch {
        0%, 100% { text-shadow: 2px 0 red, -2px 0 cyan; }
        50% { text-shadow: -2px 0 red, 2px 0 cyan; }
      }
    </style>
    <div id="swap-overlay">
      <div class="swap-text">CORPORATE TRANSLATOR ACTIVATED</div>
      <div class="swap-icon">&#x1F4DD;</div>
      <div class="swap-subtitle">Converting buzzwords to truth...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  function swapText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      for (const [from, to] of Object.entries(swaps)) {
        text = text.split(from).join(to);
      }
      if (text !== node.textContent) {
        node.textContent = text;
      }
    } else {
      node.childNodes.forEach(swapText);
    }
  }

  setTimeout(() => {
    const ov = document.getElementById('swap-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();
      swapText(document.body);

      // Watch for new content
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          m.addedNodes.forEach(swapText);
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // Badge
      const badge = document.createElement('div');
      badge.innerHTML = `
        <style>
          #swap-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #000;
            color: #00ff00;
            padding: 8px 12px;
            font-size: 11px;
            border-radius: 4px;
            z-index: 999999;
            font-family: 'Courier New', monospace;
          }
        </style>
        <div id="swap-badge">&#x1F50D; truth mode enabled</div>
      `;
      document.body.appendChild(badge);
    }, 1000);
  }, 2500);
})();
