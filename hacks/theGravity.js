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

  // Check if victim has already fallen (with expiration)
  const stored = localStorage.getItem('theGravity_fallen');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theGravity_fallen', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #gravity-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Georgia', serif;
      }
      #gravity-overlay .gravity-text {
        color: #8b0000;
        font-size: 3rem;
        animation: fall-text 0.5s ease-in infinite;
      }
      #gravity-overlay .gravity-icon {
        font-size: 6rem;
        margin: 20px 0;
        animation: fall-icon 1s ease-in infinite;
      }
      #gravity-overlay .gravity-subtitle {
        color: #666;
        font-size: 1.2rem;
      }
      @keyframes fall-text {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(10px); }
      }
      @keyframes fall-icon {
        0% { transform: translateY(-20px); opacity: 0; }
        100% { transform: translateY(20px); opacity: 1; }
      }
    </style>
    <div id="gravity-overlay">
      <div class="gravity-text">GRAVITY HAS BEEN ENABLED</div>
      <div class="gravity-icon">&#x1F34E;</div>
      <div class="gravity-subtitle">Newton sends his regards</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('gravity-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Get all elements
      const elements = document.body.querySelectorAll('*:not(script):not(style):not(link)');
      const fallElements = [];

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (rect.width > 0 && rect.height > 0 &&
            style.display !== 'none' &&
            el.children.length === 0 &&
            rect.height < 200) {
          fallElements.push({
            el,
            y: 0,
            velocity: 0,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 5
          });
          el.style.position = 'relative';
          el.style.transition = 'none';
        }
      });

      const gravity = 0.5;
      const bounce = 0.3;
      const floor = window.innerHeight;

      function animate() {
        fallElements.forEach(item => {
          item.velocity += gravity;
          item.y += item.velocity;
          item.rotation += item.rotationSpeed;

          const rect = item.el.getBoundingClientRect();
          const maxY = floor - rect.bottom + item.y;

          if (item.y > maxY) {
            item.y = maxY;
            item.velocity *= -bounce;
            if (Math.abs(item.velocity) < 1) {
              item.velocity = 0;
            }
          }

          item.el.style.transform = `translateY(${item.y}px) rotate(${item.rotation}deg)`;
        });

        requestAnimationFrame(animate);
      }

      animate();
    }, 1000);
  }, 2500);
})();
