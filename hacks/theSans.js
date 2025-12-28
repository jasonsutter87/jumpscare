(function() {
  // Check if victim has already been spooked
  if (localStorage.getItem('theSans_spooked')) return;

  // Mark as spooked immediately
  localStorage.setItem('theSans_spooked', 'true');

  // Create the overlay
  const overlay = document.createElement('div');
  overlay.id = 'theSans-overlay';
  overlay.innerHTML = `
    <style>
      #theSans-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Courier New', monospace;
      }
      #theSans-overlay .hack-text {
        color: #00ff00;
        font-size: 3rem;
        text-shadow: 0 0 10px #00ff00;
        animation: glitch 0.3s infinite;
      }
      #theSans-overlay .hacker-name {
        color: #ff0000;
        font-size: 5rem;
        margin-top: 20px;
        text-shadow: 0 0 20px #ff0000;
        animation: blink 0.5s infinite;
      }
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      #theSans-overlay .skull {
        font-size: 8rem;
        animation: blink 0.3s infinite;
      }
    </style>
    <div class="skull">💀</div>
    <div class="hack-text">YOU ARE GETTING HACKED BY...</div>
    <div class="hacker-name">theSans</div>
  `;

  document.body.appendChild(overlay);

  // After 3 seconds, fade out and apply Comic Sans chaos
  setTimeout(() => {
    overlay.style.transition = 'opacity 1s';
    overlay.style.opacity = '0';

    setTimeout(() => {
      overlay.remove();

      // THE REAL HORROR: Comic Sans everywhere
      const style = document.createElement('style');
      style.id = 'theSans-comic-sans';
      style.textContent = `
        * {
          font-family: 'Comic Sans MS', 'Comic Sans', cursive !important;
        }
      `;
      document.head.appendChild(style);

      // Optional: small "hacked" badge in corner
      const badge = document.createElement('div');
      badge.innerHTML = `
        <style>
          #theSans-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #000;
            color: #00ff00;
            padding: 5px 10px;
            font-size: 12px;
            border-radius: 4px;
            z-index: 999999;
            font-family: 'Comic Sans MS', cursive !important;
          }
        </style>
        <div id="theSans-badge">hacked by theSans</div>
      `;
      document.body.appendChild(badge);

    }, 1000);
  }, 3000);
})();
