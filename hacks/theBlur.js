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

  // Check if victim has already been blurred (with expiration)
  const stored = localStorage.getItem('theBlur_blurred');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theBlur_blurred', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #blur-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Arial', sans-serif;
      }
      #blur-overlay .blur-text {
        color: #fff;
        font-size: 2.5rem;
        filter: blur(0px);
        animation: blurIn 2s forwards;
      }
      #blur-overlay .blur-icon {
        font-size: 6rem;
        margin: 20px 0;
        animation: blurIn 2s forwards;
      }
      #blur-overlay .blur-subtitle {
        color: #888;
        font-size: 1.2rem;
        animation: blurIn 2s 0.5s forwards;
      }
      @keyframes blurIn {
        0% { filter: blur(0px); }
        100% { filter: blur(3px); }
      }
    </style>
    <div id="blur-overlay">
      <div class="blur-text">YOUR VISION IS DETERIORATING</div>
      <div class="blur-icon">&#x1F453;</div>
      <div class="blur-subtitle">Maybe you need glasses?</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('blur-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Progressive blur over 10 minutes
      let blurLevel = 0;
      const maxBlur = 5;
      const duration = 10 * 60 * 1000; // 10 minutes
      const steps = 100;
      const interval = duration / steps;
      const blurIncrement = maxBlur / steps;

      const blurStyle = document.createElement('style');
      blurStyle.id = 'blur-style';
      document.head.appendChild(blurStyle);

      const blurInterval = setInterval(() => {
        blurLevel += blurIncrement;
        if (blurLevel >= maxBlur) {
          blurLevel = maxBlur;
          clearInterval(blurInterval);
        }
        blurStyle.textContent = `body > *:not(script):not(style) { filter: blur(${blurLevel}px) !important; }`;
      }, interval);

      // Add a fake "eye test" in the corner
      const eyeTest = document.createElement('div');
      eyeTest.innerHTML = `
        <style>
          #eye-test {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #fff;
            color: #000;
            padding: 10px;
            font-size: 10px;
            border-radius: 4px;
            z-index: 999999;
            font-family: monospace;
            line-height: 1.2;
          }
        </style>
        <div id="eye-test">
          E<br>
          F P<br>
          T O Z<br>
          <span style="font-size:6px">can you read this?</span>
        </div>
      `;
      document.body.appendChild(eyeTest);
    }, 1000);
  }, 2500);
})();
