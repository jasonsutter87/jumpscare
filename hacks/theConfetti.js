(function() {
  if (localStorage.getItem('theConfetti_partied')) return;
  localStorage.setItem('theConfetti_partied', 'true');

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #confetti-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #667eea, #764ba2);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Arial', sans-serif;
      }
      #confetti-overlay .confetti-text {
        color: #fff;
        font-size: 3rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }
      #confetti-overlay .confetti-icon { font-size: 6rem; margin: 20px 0; }
      #confetti-overlay .confetti-subtitle { color: rgba(255,255,255,0.8); font-size: 1.2rem; }
    </style>
    <div id="confetti-overlay">
      <div class="confetti-text">PARTY MODE!</div>
      <div class="confetti-icon">&#x1F389;</div>
      <div class="confetti-subtitle">Random celebrations incoming...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#ff9ff3', '#00d2d3', '#ff9f43'];

  function createConfetti(x, y) {
    const confettiCount = 50 + Math.floor(Math.random() * 50);

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: ${5 + Math.random() * 10}px;
        height: ${5 + Math.random() * 10}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${x}px;
        top: ${y}px;
        z-index: 999998;
        pointer-events: none;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      `;

      document.body.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 10;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 10;
      const rotation = Math.random() * 360;
      const rotationSpeed = (Math.random() - 0.5) * 20;

      let posX = x;
      let posY = y;
      let velX = vx;
      let velY = vy;
      let rot = rotation;
      let opacity = 1;

      function animateConfetti() {
        velY += 0.3; // gravity
        posX += velX;
        posY += velY;
        rot += rotationSpeed;
        opacity -= 0.01;

        confetti.style.left = posX + 'px';
        confetti.style.top = posY + 'px';
        confetti.style.transform = `rotate(${rot}deg)`;
        confetti.style.opacity = opacity;

        if (opacity > 0 && posY < window.innerHeight + 50) {
          requestAnimationFrame(animateConfetti);
        } else {
          confetti.remove();
        }
      }

      setTimeout(() => requestAnimationFrame(animateConfetti), i * 10);
    }
  }

  function randomConfettiBurst() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight / 2);
    createConfetti(x, y);
  }

  setTimeout(() => {
    const ov = document.getElementById('confetti-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Initial burst
      randomConfettiBurst();

      // Random bursts every 10-30 seconds
      setInterval(() => {
        if (Math.random() > 0.3) {
          randomConfettiBurst();
        }
      }, 10000 + Math.random() * 20000);

      // Click to create confetti
      document.addEventListener('click', (e) => {
        if (Math.random() > 0.7) {
          createConfetti(e.clientX, e.clientY);
        }
      });

      // Badge
      const badge = document.createElement('div');
      badge.innerHTML = `
        <style>
          #confetti-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #fff;
            padding: 8px 15px;
            font-size: 12px;
            border-radius: 20px;
            z-index: 999999;
          }
        </style>
        <div id="confetti-badge">&#x1F389; party mode</div>
      `;
      document.body.appendChild(badge);
    }, 1000);
  }, 2500);
})();
