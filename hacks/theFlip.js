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

  const stored = localStorage.getItem('theFlip_flipped');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theFlip_flipped', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #flip-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Arial', sans-serif;
      }
      #flip-overlay .flip-text {
        color: #ff6b6b;
        font-size: 3rem;
        animation: flipText 1s ease infinite;
      }
      #flip-overlay .flip-icon {
        font-size: 6rem;
        margin: 20px 0;
        animation: rotate 2s linear infinite;
      }
      #flip-overlay .flip-subtitle {
        color: #888;
        font-size: 1.2rem;
      }
      @keyframes flipText {
        0%, 100% { transform: rotateX(0); }
        50% { transform: rotateX(180deg); }
      }
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
    <div id="flip-overlay">
      <div class="flip-text">GRAVITY REVERSED</div>
      <div class="flip-icon">&#x1F504;</div>
      <div class="flip-subtitle">Your screen has been flipped...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('flip-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Flip the entire page
      const style = document.createElement('style');
      style.id = 'flip-style';
      style.textContent = `
        html {
          transform: rotate(180deg) !important;
          transform-origin: center center !important;
        }
      `;
      document.head.appendChild(style);

      // Badge
      const badge = document.createElement('div');
      badge.innerHTML = `
        <style>
          #flip-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #000;
            color: #ff6b6b;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 4px;
            z-index: 999999;
            font-family: monospace;
            transform: rotate(180deg);
          }
        </style>
        <div id="flip-badge">&#x1F643; flipped</div>
      `;
      document.body.appendChild(badge);
    }, 1000);
  }, 2500);
})();
