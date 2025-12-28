(function() {
  if (localStorage.getItem('theSound_noisy')) return;
  localStorage.setItem('theSound_noisy', 'true');

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #sound-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Arial', sans-serif;
      }
      #sound-overlay .sound-text {
        color: #00ff88;
        font-size: 3rem;
      }
      #sound-overlay .sound-icon {
        font-size: 6rem;
        margin: 20px 0;
        animation: soundPulse 0.5s infinite alternate;
      }
      #sound-overlay .sound-subtitle { color: #888; font-size: 1.2rem; }
      @keyframes soundPulse {
        from { transform: scale(1); }
        to { transform: scale(1.2); }
      }
    </style>
    <div id="sound-overlay">
      <div class="sound-text">AUDIO CHAOS ENABLED</div>
      <div class="sound-icon">&#x1F50A;</div>
      <div class="sound-subtitle">Hope you have speakers...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Audio context for generating sounds
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  // Sound generators
  function playBeep(frequency, duration, type = 'sine') {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  function playWindowsError() {
    playBeep(400, 0.1);
    setTimeout(() => playBeep(300, 0.2), 100);
  }

  function playWindowsNotify() {
    playBeep(800, 0.1);
    setTimeout(() => playBeep(1000, 0.15), 100);
  }

  function playWindowsStartup() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playBeep(freq, 0.3, 'sine'), i * 200);
    });
  }

  function playDing() {
    playBeep(1200, 0.2);
  }

  function playBoop() {
    playBeep(200, 0.15, 'square');
  }

  function playChime() {
    playBeep(880, 0.1);
    setTimeout(() => playBeep(1100, 0.1), 80);
    setTimeout(() => playBeep(1320, 0.15), 160);
  }

  function playWhoosh() {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  function playPop() {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  const sounds = [
    playWindowsError,
    playWindowsNotify,
    playDing,
    playBoop,
    playChime,
    playWhoosh,
    playPop
  ];

  function playRandomSound() {
    const sound = sounds[Math.floor(Math.random() * sounds.length)];
    sound();
  }

  setTimeout(() => {
    const ov = document.getElementById('sound-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Play startup sound
      playWindowsStartup();

      // Random sounds every 10-30 seconds
      setInterval(() => {
        if (Math.random() > 0.3) {
          playRandomSound();
        }
      }, 10000 + Math.random() * 20000);

      // Sound on clicks
      document.addEventListener('click', () => {
        playPop();
      });

      // Sound on keypresses
      document.addEventListener('keydown', () => {
        if (Math.random() > 0.7) {
          playBeep(300 + Math.random() * 500, 0.05);
        }
      });

      // Badge
      const badge = document.createElement('div');
      badge.innerHTML = `
        <style>
          #sound-badge {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: #00ff88;
            padding: 8px 15px;
            font-size: 12px;
            border-radius: 4px;
            z-index: 999999;
            font-family: monospace;
          }
        </style>
        <div id="sound-badge">&#x1F50A; Audio chaos</div>
      `;
      document.body.appendChild(badge);
    }, 1000);
  }, 2500);
})();
