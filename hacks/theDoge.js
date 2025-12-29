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

  const stored = localStorage.getItem('theDoge_wowed');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theDoge_wowed', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #doge-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #f7dc6f, #f39c12);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Comic Sans MS', cursive;
      }
      #doge-overlay .doge-text {
        color: #8e44ad;
        font-size: 4rem;
        text-shadow: 3px 3px 0 #fff;
      }
      #doge-overlay .doge-icon { font-size: 6rem; margin: 20px 0; }
      #doge-overlay .doge-subtitle { color: #e74c3c; font-size: 2rem; }
    </style>
    <div id="doge-overlay">
      <div class="doge-text">WOW</div>
      <div class="doge-icon">&#x1F436;</div>
      <div class="doge-subtitle">such hack. very prank.</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const dogeWords = [
    { word: 'wow', color: '#e74c3c' },
    { word: 'such', color: '#9b59b6' },
    { word: 'very', color: '#3498db' },
    { word: 'much', color: '#1abc9c' },
    { word: 'so', color: '#f39c12' },
    { word: 'many', color: '#e91e63' },
    { word: 'amaze', color: '#00bcd4' },
    { word: 'excite', color: '#8bc34a' }
  ];

  const dogeNouns = ['text', 'page', 'click', 'scroll', 'work', 'code', 'hack', 'chaos', 'productivity', 'meeting'];

  function createDogeText() {
    const doge = document.createElement('div');
    const wordObj = dogeWords[Math.floor(Math.random() * dogeWords.length)];
    const noun = dogeNouns[Math.floor(Math.random() * dogeNouns.length)];

    doge.textContent = `${wordObj.word} ${noun}`;
    doge.style.cssText = `
      position: fixed;
      left: ${Math.random() * (window.innerWidth - 200)}px;
      top: ${Math.random() * (window.innerHeight - 50)}px;
      color: ${wordObj.color};
      font-family: 'Comic Sans MS', cursive;
      font-size: ${16 + Math.random() * 24}px;
      font-weight: bold;
      z-index: 999997;
      pointer-events: none;
      text-shadow: 2px 2px 0 #fff;
      animation: dogeFloat 3s ease-out forwards;
    `;
    document.body.appendChild(doge);

    setTimeout(() => doge.remove(), 3000);
  }

  setTimeout(() => {
    const ov = document.getElementById('doge-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Add animation style
      const style = document.createElement('style');
      style.textContent = `
        @keyframes dogeFloat {
          0% { opacity: 1; transform: translateY(0) rotate(0); }
          100% { opacity: 0; transform: translateY(-50px) rotate(${Math.random() > 0.5 ? '' : '-'}10deg); }
        }
      `;
      document.head.appendChild(style);

      // Create doge texts periodically
      setInterval(createDogeText, 2000);

      // Create on click
      document.addEventListener('click', () => {
        for (let i = 0; i < 3; i++) {
          setTimeout(createDogeText, i * 100);
        }
      });

      // Badge
      const badge = document.createElement('div');
      badge.innerHTML = `
        <style>
          #doge-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(135deg, #f7dc6f, #f39c12);
            color: #8e44ad;
            padding: 8px 15px;
            font-size: 14px;
            border-radius: 20px;
            z-index: 999999;
            font-family: 'Comic Sans MS', cursive;
            font-weight: bold;
          }
        </style>
        <div id="doge-badge">&#x1F436; wow</div>
      `;
      document.body.appendChild(badge);
    }, 1000);
  }, 2500);
})();
