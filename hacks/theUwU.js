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

  const stored = localStorage.getItem('theUwU_uwued');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theUwU_uwued', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #uwu-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #ffb6c1, #ffc0cb, #ffb6c1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Comic Sans MS', cursive;
      }
      #uwu-overlay .uwu-text {
        color: #ff69b4;
        font-size: 4rem;
        text-shadow: 3px 3px 0 #fff;
        animation: uwuBounce 0.3s ease infinite alternate;
      }
      #uwu-overlay .uwu-face { font-size: 6rem; margin: 20px 0; }
      #uwu-overlay .uwu-subtitle { color: #ff1493; font-size: 1.5rem; }
      @keyframes uwuBounce {
        from { transform: rotate(-3deg); }
        to { transform: rotate(3deg); }
      }
    </style>
    <div id="uwu-overlay">
      <div class="uwu-text">UwU MODE ACTIVATED</div>
      <div class="uwu-face">OwO</div>
      <div class="uwu-subtitle">*notices your webpage*</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // UwU transformation rules
  function uwuify(text) {
    return text
      .replace(/r/g, 'w')
      .replace(/R/g, 'W')
      .replace(/l/g, 'w')
      .replace(/L/g, 'W')
      .replace(/th/g, 'd')
      .replace(/Th/g, 'D')
      .replace(/TH/g, 'D')
      .replace(/ove/g, 'uv')
      .replace(/n([aeiou])/g, 'ny$1')
      .replace(/N([aeiou])/g, 'Ny$1')
      .replace(/N([AEIOU])/g, 'NY$1')
      .replace(/\!/g, '! UwU ')
      .replace(/\?/g, '? OwO ')
      .replace(/\./g, '. >w< ')
      .replace(/,/g, ', *nuzzles* ');
  }

  function uwuifyNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const original = node.textContent;
      const uwued = uwuify(original);
      if (original !== uwued) {
        node.textContent = uwued;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Skip script and style tags
      if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        node.childNodes.forEach(uwuifyNode);
      }
    }
  }

  setTimeout(() => {
    const ov = document.getElementById('uwu-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // UwU-ify all text
      uwuifyNode(document.body);

      // Watch for new content
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          m.addedNodes.forEach(uwuifyNode);
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // Badge
      const badge = document.createElement('div');
      badge.innerHTML = `
        <style>
          #uwu-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(135deg, #ff69b4, #ff1493);
            color: #fff;
            padding: 8px 15px;
            font-size: 14px;
            border-radius: 20px;
            z-index: 999999;
            font-family: 'Comic Sans MS', cursive;
          }
        </style>
        <div id="uwu-badge">OwO what's this?</div>
      `;
      document.body.appendChild(badge);
    }, 1000);
  }, 2500);
})();
