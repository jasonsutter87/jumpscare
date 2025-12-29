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

  const stored = localStorage.getItem('theEarthquake_shaken');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theEarthquake_shaken', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #quake-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #8b4513;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Impact', sans-serif;
        animation: quakeOverlay 0.1s infinite;
      }
      #quake-overlay .quake-text {
        color: #fff;
        font-size: 3rem;
        text-shadow: 2px 2px 4px #000;
      }
      #quake-overlay .quake-icon {
        font-size: 6rem;
        margin: 20px 0;
      }
      #quake-overlay .quake-subtitle {
        color: #ffd700;
        font-size: 1.5rem;
      }
      @keyframes quakeOverlay {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-5px, 5px); }
        50% { transform: translate(5px, -5px); }
        75% { transform: translate(-5px, -5px); }
      }
    </style>
    <div id="quake-overlay">
      <div class="quake-text">SEISMIC ACTIVITY DETECTED</div>
      <div class="quake-icon">&#x1F30B;</div>
      <div class="quake-subtitle">Magnitude: 7.5</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('quake-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Add earthquake style
      const style = document.createElement('style');
      style.id = 'quake-style';
      style.textContent = `
        @keyframes earthquake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-2px, -1px) rotate(-0.5deg); }
          20% { transform: translate(3px, 2px) rotate(0.5deg); }
          30% { transform: translate(-3px, 1px) rotate(0deg); }
          40% { transform: translate(2px, -2px) rotate(0.5deg); }
          50% { transform: translate(-1px, 3px) rotate(-0.5deg); }
          60% { transform: translate(3px, 1px) rotate(0deg); }
          70% { transform: translate(-2px, -3px) rotate(-0.5deg); }
          80% { transform: translate(1px, 2px) rotate(0.5deg); }
          90% { transform: translate(-3px, -1px) rotate(0deg); }
        }
        #quake-magnitude {
          position: fixed;
          top: 10px;
          right: 10px;
          background: #8b4513;
          color: #fff;
          padding: 10px 15px;
          font-size: 14px;
          border-radius: 4px;
          z-index: 999999;
          font-family: monospace;
        }
      `;
      document.head.appendChild(style);

      // Magnitude display
      const mag = document.createElement('div');
      mag.id = 'quake-magnitude';
      mag.innerHTML = '&#x1F30B; Magnitude: <span id="mag-value">0.0</span>';
      document.body.appendChild(mag);

      // Random earthquakes
      function triggerQuake() {
        const magnitude = (Math.random() * 3 + 1).toFixed(1);
        const duration = 500 + Math.random() * 2000;

        document.getElementById('mag-value').textContent = magnitude;
        document.body.style.animation = `earthquake ${0.05 + magnitude * 0.02}s infinite`;

        setTimeout(() => {
          document.body.style.animation = 'none';
        }, duration);
      }

      // Initial quake
      setTimeout(triggerQuake, 1000);

      // Random quakes every 5-15 seconds
      setInterval(() => {
        if (Math.random() > 0.3) {
          triggerQuake();
        }
      }, 5000 + Math.random() * 10000);
    }, 1000);
  }, 2500);
})();
