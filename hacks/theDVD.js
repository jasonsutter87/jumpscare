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

  const stored = localStorage.getItem('theDVD_bounced');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theDVD_bounced', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #dvd-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Arial Black', sans-serif;
      }
      #dvd-overlay .dvd-text {
        color: #9400d3;
        font-size: 2.5rem;
        animation: colorShift 2s linear infinite;
      }
      #dvd-overlay .dvd-icon {
        font-size: 6rem;
        margin: 20px 0;
        animation: colorShift 2s linear infinite;
      }
      #dvd-overlay .dvd-subtitle {
        color: #666;
        font-size: 1.2rem;
      }
      @keyframes colorShift {
        0% { color: #9400d3; }
        25% { color: #00ff00; }
        50% { color: #ff6600; }
        75% { color: #00ffff; }
        100% { color: #9400d3; }
      }
    </style>
    <div id="dvd-overlay">
      <div class="dvd-text">SCREENSAVER MODE ACTIVATED</div>
      <div class="dvd-icon">&#x1F4C0;</div>
      <div class="dvd-subtitle">Will it hit the corner? Only time will tell...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('dvd-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Create DVD logo
      const dvd = document.createElement('div');
      dvd.innerHTML = `
        <style>
          #dvd-logo {
            position: fixed;
            z-index: 999998;
            font-size: 60px;
            font-family: 'Arial Black', sans-serif;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            pointer-events: none;
            transition: color 0s;
          }
          #corner-counter {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #000;
            color: #fff;
            padding: 8px 12px;
            font-size: 14px;
            border-radius: 4px;
            z-index: 999999;
            font-family: monospace;
          }
        </style>
        <div id="dvd-logo">DVD</div>
        <div id="corner-counter">Corner hits: <span id="corner-count">0</span></div>
      `;
      document.body.appendChild(dvd);

      const logo = document.getElementById('dvd-logo');
      const counter = document.getElementById('corner-count');

      const colors = ['#9400d3', '#00ff00', '#ff6600', '#00ffff', '#ff00ff', '#ffff00', '#ff0000'];
      let colorIndex = 0;
      let cornerHits = 0;

      let x = Math.random() * (window.innerWidth - 100);
      let y = Math.random() * (window.innerHeight - 60);
      let dx = 2;
      let dy = 2;

      function changeColor() {
        colorIndex = (colorIndex + 1) % colors.length;
        logo.style.color = colors[colorIndex];
      }

      function animate() {
        x += dx;
        y += dy;

        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 60;

        let hitCorner = false;

        if (x <= 0 || x >= maxX) {
          dx = -dx;
          changeColor();
          if ((x <= 0 || x >= maxX) && (y <= 0 || y >= maxY)) {
            hitCorner = true;
          }
        }

        if (y <= 0 || y >= maxY) {
          dy = -dy;
          changeColor();
          if ((x <= 5 || x >= maxX - 5) && (y <= 0 || y >= maxY)) {
            hitCorner = true;
          }
        }

        // Check for corner hit (within 10px of corner)
        const nearCorner = (
          (x <= 10 && y <= 10) ||
          (x <= 10 && y >= maxY - 10) ||
          (x >= maxX - 10 && y <= 10) ||
          (x >= maxX - 10 && y >= maxY - 10)
        );

        if (nearCorner) {
          cornerHits++;
          counter.textContent = cornerHits;
          // Celebration!
          logo.style.transform = 'scale(1.5)';
          setTimeout(() => {
            logo.style.transform = 'scale(1)';
          }, 200);
        }

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        logo.style.left = x + 'px';
        logo.style.top = y + 'px';

        requestAnimationFrame(animate);
      }

      changeColor();
      animate();
    }, 1000);
  }, 2500);
})();
