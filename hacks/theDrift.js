(function() {
  if (localStorage.getItem('theDrift_drifted')) return;
  localStorage.setItem('theDrift_drifted', 'true');

  // Show the jumpscare first
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #drift-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(45deg, #1a1a2e, #16213e);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Arial', sans-serif;
      }
      #drift-overlay .drift-text {
        color: #e94560;
        font-size: 3rem;
        animation: wobble 0.3s infinite;
      }
      #drift-overlay .drift-cursor {
        font-size: 6rem;
        margin: 20px 0;
        animation: drift 1s infinite ease-in-out;
      }
      #drift-overlay .drift-subtitle {
        color: #fff;
        font-size: 1.2rem;
        opacity: 0.7;
      }
      @keyframes wobble {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px) rotate(-2deg); }
        75% { transform: translateX(5px) rotate(2deg); }
      }
      @keyframes drift {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(10px, -5px); }
        50% { transform: translate(-5px, 10px); }
        75% { transform: translate(-10px, -5px); }
      }
    </style>
    <div id="drift-overlay">
      <div class="drift-text">YOUR CURSOR HAD TOO MANY</div>
      <div class="drift-cursor">&#x1F378;</div>
      <div class="drift-subtitle">Good luck clicking anything...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  let driftX = 0, driftY = 0;
  let targetDriftX = 0, targetDriftY = 0;

  // Create fake cursor
  const fakeCursor = document.createElement('div');
  fakeCursor.innerHTML = `
    <style>
      #fake-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        pointer-events: none;
        z-index: 999998;
        font-size: 24px;
        transform: translate(-2px, -2px);
        transition: left 0.1s, top 0.1s;
      }
    </style>
    <div id="fake-cursor">&#x1F446;</div>
  `;

  setTimeout(() => {
    const ov = document.getElementById('drift-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();
      document.body.appendChild(fakeCursor);

      // Hide real cursor
      const style = document.createElement('style');
      style.textContent = '* { cursor: none !important; }';
      document.head.appendChild(style);

      const cursor = document.getElementById('fake-cursor');

      // Random drift changes
      setInterval(() => {
        targetDriftX = (Math.random() - 0.5) * 30;
        targetDriftY = (Math.random() - 0.5) * 30;
      }, 500);

      // Smooth drift
      setInterval(() => {
        driftX += (targetDriftX - driftX) * 0.1;
        driftY += (targetDriftY - driftY) * 0.1;
      }, 16);

      document.addEventListener('mousemove', (e) => {
        cursor.style.left = (e.clientX + driftX) + 'px';
        cursor.style.top = (e.clientY + driftY) + 'px';
      });
    }, 1000);
  }, 2500);
})();
