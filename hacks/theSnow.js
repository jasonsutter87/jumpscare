(function() {
  if (localStorage.getItem('theSnow_frozen')) return;
  localStorage.setItem('theSnow_frozen', 'true');

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #snow-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(180deg, #1a1a3e, #2d3a4f);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Arial', sans-serif;
      }
      #snow-overlay .snow-text {
        color: #fff;
        font-size: 3rem;
        text-shadow: 0 0 20px rgba(255,255,255,0.5);
      }
      #snow-overlay .snow-icon { font-size: 6rem; margin: 20px 0; }
      #snow-overlay .snow-subtitle { color: #aaccff; font-size: 1.2rem; }
    </style>
    <div id="snow-overlay">
      <div class="snow-text">WINTER IS COMING</div>
      <div class="snow-icon">&#x2744;</div>
      <div class="snow-subtitle">Let it snow, let it snow, let it snow...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('snow-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Create snow container
      const snowContainer = document.createElement('div');
      snowContainer.id = 'snow-container';
      snowContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 999997;
        overflow: hidden;
      `;
      document.body.appendChild(snowContainer);

      // Snowflake styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes snowFall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.3;
          }
        }
        @keyframes snowSway {
          0%, 100% { margin-left: 0; }
          50% { margin-left: 30px; }
        }
        .snowflake {
          position: absolute;
          top: -20px;
          color: #fff;
          text-shadow: 0 0 5px rgba(255,255,255,0.8);
          animation: snowFall linear forwards, snowSway ease-in-out infinite;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);

      const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❉', '•'];

      function createSnowflake() {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];

        const size = 10 + Math.random() * 20;
        const x = Math.random() * window.innerWidth;
        const duration = 5 + Math.random() * 10;
        const swayDuration = 2 + Math.random() * 3;

        flake.style.cssText += `
          left: ${x}px;
          font-size: ${size}px;
          animation-duration: ${duration}s, ${swayDuration}s;
          opacity: ${0.5 + Math.random() * 0.5};
        `;

        snowContainer.appendChild(flake);

        // Remove after animation
        setTimeout(() => flake.remove(), duration * 1000);
      }

      // Create snowflakes continuously
      setInterval(createSnowflake, 100);

      // Initial burst of snowflakes
      for (let i = 0; i < 50; i++) {
        setTimeout(createSnowflake, i * 50);
      }

      // Frost effect on edges
      const frost = document.createElement('div');
      frost.innerHTML = `
        <style>
          #frost-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 999996;
            background: radial-gradient(ellipse at center, transparent 50%, rgba(200, 220, 255, 0.2) 100%);
            box-shadow: inset 0 0 100px rgba(200, 220, 255, 0.3);
          }
        </style>
        <div id="frost-overlay"></div>
      `;
      document.body.appendChild(frost);

      // Badge
      const badge = document.createElement('div');
      badge.innerHTML = `
        <style>
          #snow-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(135deg, #1a1a3e, #2d3a4f);
            color: #fff;
            padding: 8px 15px;
            font-size: 12px;
            border-radius: 4px;
            z-index: 999999;
            font-family: monospace;
          }
        </style>
        <div id="snow-badge">&#x2744; Snow mode</div>
      `;
      document.body.appendChild(badge);
    }, 1000);
  }, 2500);
})();
