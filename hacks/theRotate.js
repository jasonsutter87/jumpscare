(function() {
  if (localStorage.getItem('theRotate_rotated')) return;
  localStorage.setItem('theRotate_rotated', 'true');

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #rotate-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #1a1a2e;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Arial', sans-serif;
      }
      #rotate-overlay .rotate-text {
        color: #00d4ff;
        font-size: 2.5rem;
        animation: spinText 1s linear infinite;
      }
      #rotate-overlay .rotate-icon {
        font-size: 6rem;
        margin: 20px 0;
        animation: spinIcon 2s linear infinite;
      }
      #rotate-overlay .rotate-subtitle {
        color: #888;
        font-size: 1.2rem;
      }
      @keyframes spinText {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes spinIcon {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
      }
    </style>
    <div id="rotate-overlay">
      <div class="rotate-text">INITIATING ROTATION PROTOCOL</div>
      <div class="rotate-icon">&#x1F300;</div>
      <div class="rotate-subtitle">Hold onto something...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('rotate-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Slow rotation
      let rotation = 0;
      const rotateStyle = document.createElement('style');
      rotateStyle.id = 'rotate-style';
      document.head.appendChild(rotateStyle);

      // Also need to adjust body to handle overflow
      document.body.style.overflow = 'visible';
      document.documentElement.style.overflow = 'visible';

      setInterval(() => {
        rotation += 0.1;
        rotateStyle.textContent = `
          body {
            transform: rotate(${rotation}deg) !important;
            transform-origin: center center !important;
          }
        `;
      }, 100);

      // Level indicator in corner
      const level = document.createElement('div');
      level.innerHTML = `
        <style>
          #level-indicator {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #000;
            color: #00d4ff;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 4px;
            z-index: 999999;
            font-family: monospace;
          }
        </style>
        <div id="level-indicator">&#x1F4D0; page not level</div>
      `;
      document.body.appendChild(level);
    }, 1000);
  }, 2500);
})();
