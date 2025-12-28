(function() {
  if (localStorage.getItem('the3D_tilted')) return;
  localStorage.setItem('the3D_tilted', 'true');

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #tilt-overlay {
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
        perspective: 500px;
      }
      #tilt-overlay .tilt-text {
        color: #00ffff;
        font-size: 3rem;
        transform: rotateY(20deg);
        animation: tiltText 2s ease infinite alternate;
      }
      #tilt-overlay .tilt-icon { font-size: 6rem; margin: 20px 0; }
      #tilt-overlay .tilt-subtitle { color: #888; font-size: 1.2rem; }
      @keyframes tiltText {
        from { transform: rotateY(-20deg) rotateX(10deg); }
        to { transform: rotateY(20deg) rotateX(-10deg); }
      }
    </style>
    <div id="tilt-overlay">
      <div class="tilt-text">ENTERING 3D SPACE</div>
      <div class="tilt-icon">&#x1F4BB;</div>
      <div class="tilt-subtitle">Reality is now optional</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('tilt-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Add 3D tilt effect
      const style = document.createElement('style');
      style.id = 'tilt-style';
      style.textContent = `
        html {
          perspective: 1000px !important;
        }
        body {
          transform-style: preserve-3d !important;
          transform: rotateX(2deg) rotateY(3deg) !important;
          transition: transform 0.1s ease !important;
        }
      `;
      document.head.appendChild(style);

      // Tilt based on mouse position
      let tiltX = 2;
      let tiltY = 3;

      document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        tiltY = ((e.clientX - centerX) / centerX) * 5;
        tiltX = ((e.clientY - centerY) / centerY) * 3;

        document.body.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
      });

      // Badge
      const badge = document.createElement('div');
      badge.innerHTML = `
        <style>
          #tilt-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #000;
            color: #00ffff;
            padding: 8px 15px;
            font-size: 12px;
            border-radius: 4px;
            z-index: 999999;
            font-family: monospace;
          }
        </style>
        <div id="tilt-badge">&#x1F4BB; 3D mode</div>
      `;
      document.body.appendChild(badge);
    }, 1000);
  }, 2500);
})();
