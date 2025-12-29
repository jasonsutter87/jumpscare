(function() {
  // ===========================================
  // CONFIGURATION OPTIONS
  // ===========================================
  const CONFIG = {
    showIntro: true,                      // Set to false to skip the intro overlay
    introDelay: 2500,                     // How long to show intro (in milliseconds)
    storageDuration: 24 * 60 * 60 * 1000, // How long before hack can trigger again (default: 24 hours)
    minLag: 200,                          // Minimum click delay in ms
    maxLag: 800                           // Maximum click delay in ms
  };
  // ===========================================

  const stored = localStorage.getItem('theDelay_lagged');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theDelay_lagged', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #delay-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #1a1a2e;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Courier New', monospace;
      }
      #delay-overlay .delay-text {
        color: #ff6b6b;
        font-size: 2.5rem;
        animation: lagText 0.5s ease infinite;
      }
      #delay-overlay .delay-icon {
        font-size: 6rem;
        margin: 20px 0;
        animation: loadingSpin 2s linear infinite;
      }
      #delay-overlay .delay-subtitle {
        color: #888;
        font-size: 1.2rem;
      }
      @keyframes lagText {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes loadingSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
    <div id="delay-overlay">
      <div class="delay-text">CONNECTION ISSUES DETECTED</div>
      <div class="delay-icon">&#x23F3;</div>
      <div class="delay-subtitle">Your clicks may be... delayed</div>
    </div>
  `;

  function applyEffect() {
    // Loading cursor style
    const style = document.createElement('style');
    style.id = 'delay-style';
    style.textContent = `
      .delay-waiting {
        cursor: wait !important;
      }
      .delay-waiting * {
        cursor: wait !important;
      }
    `;
    document.head.appendChild(style);

    // Intercept all clicks
    document.addEventListener('click', function(e) {
      // Don't delay if already processing
      if (document.body.classList.contains('delay-waiting')) return;

      // Calculate random lag
      const lag = CONFIG.minLag + Math.random() * (CONFIG.maxLag - CONFIG.minLag);

      // Prevent the original click
      e.preventDefault();
      e.stopPropagation();

      // Show waiting cursor
      document.body.classList.add('delay-waiting');

      // Store target info
      const target = e.target;
      const x = e.clientX;
      const y = e.clientY;

      // Replay the click after delay
      setTimeout(() => {
        document.body.classList.remove('delay-waiting');

        // Create and dispatch a new click event
        const newClick = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: x,
          clientY: y
        });

        // Mark it so we don't intercept it again
        newClick._delayProcessed = true;
        target.dispatchEvent(newClick);

        // Also try to trigger default behaviors
        if (target.tagName === 'A' && target.href) {
          window.location.href = target.href;
        } else if (target.tagName === 'BUTTON' || target.type === 'submit') {
          target.click();
        }
      }, lag);
    }, true);

    // Skip already-processed events
    document.addEventListener('click', function(e) {
      if (e._delayProcessed) {
        e.stopImmediatePropagation();
      }
    }, false);

    // Badge
    const badge = document.createElement('div');
    badge.innerHTML = `
      <style>
        #delay-badge {
          position: fixed;
          bottom: 10px;
          right: 10px;
          background: #1a1a2e;
          color: #ff6b6b;
          padding: 8px 12px;
          font-size: 12px;
          border-radius: 4px;
          z-index: 999999;
          font-family: 'Courier New', monospace;
        }
        #delay-badge .ping {
          display: inline-block;
          animation: pingPulse 1s infinite;
        }
        @keyframes pingPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      </style>
      <div id="delay-badge"><span class="ping">&#x1F4E1;</span> Ping: ${Math.floor(CONFIG.minLag + (CONFIG.maxLag - CONFIG.minLag) / 2)}ms</div>
    `;
    document.body.appendChild(badge);

    // Update ping display randomly
    setInterval(() => {
      const ping = Math.floor(CONFIG.minLag + Math.random() * (CONFIG.maxLag - CONFIG.minLag));
      const pingEl = document.querySelector('#delay-badge');
      if (pingEl) {
        pingEl.innerHTML = `<span class="ping">&#x1F4E1;</span> Ping: ${ping}ms`;
      }
    }, 2000);
  }

  if (CONFIG.showIntro) {
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.style.transition = 'opacity 1s';
      overlay.style.opacity = '0';

      setTimeout(() => {
        overlay.remove();
        applyEffect();
      }, 1000);
    }, CONFIG.introDelay);
  } else {
    applyEffect();
  }
})();
