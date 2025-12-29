(function() {
  // ===========================================
  // CONFIGURATION OPTIONS
  // ===========================================
  const CONFIG = {
    showIntro: true,                      // Set to false to skip the intro overlay
    introDelay: 2500,                     // How long to show intro (in milliseconds)
    storageDuration: 24 * 60 * 60 * 1000, // How long before hack can trigger again (default: 24 hours)
    trailLength: 20,                      // Number of trail elements
    trailType: 'fire'                     // 'fire', 'sparkle', 'rainbow', 'skull'
  };
  // ===========================================

  const stored = localStorage.getItem('theTrail_blazed');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theTrail_blazed', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const trailEmojis = {
    fire: ['🔥', '🔥', '🔥', '💥', '✨'],
    sparkle: ['✨', '⭐', '💫', '🌟', '⚡'],
    rainbow: ['❤️', '🧡', '💛', '💚', '💙', '💜'],
    skull: ['💀', '☠️', '👻', '🦴', '💀']
  };

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #trail-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #1a0a0a, #2d1810, #1a0a0a);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Arial', sans-serif;
      }
      #trail-overlay .trail-text {
        color: #ff4500;
        font-size: 3rem;
        text-shadow: 0 0 20px #ff4500, 0 0 40px #ff0000;
        animation: fireGlow 0.5s ease infinite alternate;
      }
      #trail-overlay .trail-icon {
        font-size: 6rem;
        margin: 20px 0;
        animation: fireFlicker 0.15s ease infinite;
      }
      #trail-overlay .trail-subtitle {
        color: #ffaa00;
        font-size: 1.2rem;
      }
      @keyframes fireGlow {
        from { text-shadow: 0 0 20px #ff4500, 0 0 40px #ff0000; }
        to { text-shadow: 0 0 30px #ff6600, 0 0 60px #ff4500; }
      }
      @keyframes fireFlicker {
        0%, 100% { transform: scale(1) rotate(-2deg); }
        50% { transform: scale(1.1) rotate(2deg); }
      }
    </style>
    <div id="trail-overlay">
      <div class="trail-text">CURSOR ON FIRE</div>
      <div class="trail-icon">🔥</div>
      <div class="trail-subtitle">Your mouse is now lit...</div>
    </div>
  `;

  function applyEffect() {
    const emojis = trailEmojis[CONFIG.trailType] || trailEmojis.fire;
    const trails = [];

    // Create trail style
    const style = document.createElement('style');
    style.textContent = `
      .cursor-trail {
        position: fixed;
        pointer-events: none;
        z-index: 999997;
        font-size: 24px;
        transition: opacity 0.3s ease, transform 0.3s ease;
        user-select: none;
      }
      #trail-badge {
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: linear-gradient(135deg, #ff4500, #ff0000);
        color: #fff;
        padding: 8px 15px;
        font-size: 12px;
        border-radius: 4px;
        z-index: 999999;
        font-family: sans-serif;
      }
    `;
    document.head.appendChild(style);

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Create trail elements
    function spawnTrail() {
      // Only spawn if mouse is moving
      const distance = Math.sqrt(Math.pow(mouseX - lastX, 2) + Math.pow(mouseY - lastY, 2));
      if (distance < 5) return;

      lastX = mouseX;
      lastY = mouseY;

      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      trail.style.left = (mouseX - 12 + (Math.random() - 0.5) * 20) + 'px';
      trail.style.top = (mouseY - 12 + (Math.random() - 0.5) * 20) + 'px';
      trail.style.fontSize = (16 + Math.random() * 16) + 'px';
      trail.style.opacity = '1';

      document.body.appendChild(trail);
      trails.push(trail);

      // Animate and remove
      let opacity = 1;
      let scale = 1;
      let y = parseFloat(trail.style.top);

      function animate() {
        opacity -= 0.03;
        scale += 0.02;
        y -= 1;

        trail.style.opacity = opacity;
        trail.style.transform = `scale(${scale}) rotate(${(1 - opacity) * 30}deg)`;
        trail.style.top = y + 'px';

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          trail.remove();
          const index = trails.indexOf(trail);
          if (index > -1) trails.splice(index, 1);
        }
      }

      requestAnimationFrame(animate);

      // Limit total trails
      while (trails.length > CONFIG.trailLength * 2) {
        const old = trails.shift();
        if (old && old.parentNode) old.remove();
      }
    }

    // Spawn trails continuously
    setInterval(spawnTrail, 30);

    // Badge
    const badge = document.createElement('div');
    badge.id = 'trail-badge';
    badge.innerHTML = '🔥 Fire cursor active';
    document.body.appendChild(badge);
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
