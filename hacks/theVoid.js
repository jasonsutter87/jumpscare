(function() {
  if (localStorage.getItem('theVoid_voided')) return;
  localStorage.setItem('theVoid_voided', 'true');

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #void-overlay {
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
      #void-overlay .void-text {
        color: #1a1a1a;
        font-size: 3rem;
        animation: fadeVoid 2s ease-in-out infinite;
      }
      #void-overlay .void-icon {
        font-size: 6rem;
        margin: 20px 0;
        animation: pulse 1s ease-in-out infinite;
      }
      #void-overlay .void-subtitle {
        color: #333;
        font-size: 1.2rem;
        font-style: italic;
      }
      @keyframes fadeVoid {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 1; }
      }
    </style>
    <div id="void-overlay">
      <div class="void-text">THE VOID CONSUMES ALL</div>
      <div class="void-icon">&#x1F573;&#xFE0F;</div>
      <div class="void-subtitle">Your monitor is dying... slowly...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('void-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Create void overlay that slowly fades in
      const voidScreen = document.createElement('div');
      voidScreen.innerHTML = `
        <style>
          #the-void {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            opacity: 0;
            z-index: 999997;
            pointer-events: none;
            transition: opacity 0.5s;
          }
          #void-message {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: #333;
            font-size: 14px;
            font-family: 'Courier New', monospace;
            z-index: 999999;
            opacity: 0;
            transition: opacity 2s;
          }
          #power-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #111;
            color: #ff0000;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 4px;
            z-index: 999999;
            font-family: monospace;
          }
          #power-bar {
            width: 100px;
            height: 10px;
            background: #333;
            border-radius: 5px;
            margin-top: 5px;
            overflow: hidden;
          }
          #power-level {
            height: 100%;
            background: linear-gradient(90deg, #ff0000, #ff6600);
            transition: width 0.5s;
          }
        </style>
        <div id="the-void"></div>
        <div id="void-message">if you stare into the void, the void stares back</div>
        <div id="power-indicator">
          DISPLAY POWER
          <div id="power-bar"><div id="power-level" style="width: 100%"></div></div>
        </div>
      `;
      document.body.appendChild(voidScreen);

      const theVoid = document.getElementById('the-void');
      const voidMessage = document.getElementById('void-message');
      const powerLevel = document.getElementById('power-level');

      // Slowly increase opacity over 5 minutes
      let opacity = 0;
      const maxOpacity = 0.85;
      const duration = 5 * 60 * 1000; // 5 minutes
      const steps = 100;
      const interval = duration / steps;
      const opacityIncrement = maxOpacity / steps;

      const fadeInterval = setInterval(() => {
        opacity += opacityIncrement;
        if (opacity >= maxOpacity) {
          opacity = maxOpacity;
          clearInterval(fadeInterval);
          voidMessage.style.opacity = '1';
        }
        theVoid.style.opacity = opacity;
        powerLevel.style.width = (100 - (opacity / maxOpacity) * 100) + '%';
      }, interval);

      // Occasional "flicker" effect
      setInterval(() => {
        if (Math.random() > 0.7) {
          const currentOpacity = parseFloat(theVoid.style.opacity) || 0;
          theVoid.style.opacity = currentOpacity + 0.1;
          setTimeout(() => {
            theVoid.style.opacity = currentOpacity;
          }, 100);
        }
      }, 5000);
    }, 1000);
  }, 2500);
})();
