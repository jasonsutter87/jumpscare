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

  const stored = localStorage.getItem('theCursor_cursed');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theCursor_cursed', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #cursor-overlay {
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
      #cursor-overlay .cursor-text {
        color: #00ff88;
        font-size: 3rem;
      }
      #cursor-overlay .cursor-icon { font-size: 6rem; margin: 20px 0; animation: wiggle 0.3s infinite; }
      #cursor-overlay .cursor-subtitle { color: #888; font-size: 1.2rem; }
      @keyframes wiggle {
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(-20deg); }
        75% { transform: rotate(20deg); }
      }
    </style>
    <div id="cursor-overlay">
      <div class="cursor-text">CURSOR MULTIPLIED</div>
      <div class="cursor-icon">&#x1F5B1;</div>
      <div class="cursor-subtitle">Good luck finding the real one...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('cursor-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Hide real cursor
      const style = document.createElement('style');
      style.textContent = '* { cursor: none !important; }';
      document.head.appendChild(style);

      // Create multiple fake cursors
      const cursorCount = 5;
      const cursors = [];
      const cursorEmojis = ['&#x1F446;', '&#x1F448;', '&#x1F449;', '&#x1F447;', '&#x261D;'];

      for (let i = 0; i < cursorCount; i++) {
        const cursor = document.createElement('div');
        cursor.innerHTML = cursorEmojis[i];
        cursor.style.cssText = `
          position: fixed;
          font-size: 24px;
          pointer-events: none;
          z-index: 999998;
          transition: left 0.1s, top 0.1s;
          transform: translate(-5px, -5px);
        `;
        document.body.appendChild(cursor);
        cursors.push({
          el: cursor,
          offsetX: (Math.random() - 0.5) * 100,
          offsetY: (Math.random() - 0.5) * 100,
          delay: i * 50
        });
      }

      // One cursor follows exactly (the real one)
      cursors[0].offsetX = 0;
      cursors[0].offsetY = 0;
      cursors[0].delay = 0;

      let mouseX = 0;
      let mouseY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      function updateCursors() {
        cursors.forEach((cursor, i) => {
          const x = mouseX + cursor.offsetX + Math.sin(Date.now() / 200 + i) * 10;
          const y = mouseY + cursor.offsetY + Math.cos(Date.now() / 200 + i) * 10;
          cursor.el.style.left = x + 'px';
          cursor.el.style.top = y + 'px';
        });
        requestAnimationFrame(updateCursors);
      }

      updateCursors();

      // Randomly swap which cursor is "real"
      setInterval(() => {
        const realIndex = Math.floor(Math.random() * cursorCount);
        cursors.forEach((cursor, i) => {
          if (i === realIndex) {
            cursor.offsetX = 0;
            cursor.offsetY = 0;
          } else {
            cursor.offsetX = (Math.random() - 0.5) * 100;
            cursor.offsetY = (Math.random() - 0.5) * 100;
          }
        });
      }, 5000);

    }, 1000);
  }, 2500);
})();
