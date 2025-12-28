(function() {
  if (localStorage.getItem('theNyan_nyaned')) return;
  localStorage.setItem('theNyan_nyaned', 'true');

  // Nyan cat pixel art as CSS
  const nyanCSS = `
    #nyan-container {
      position: fixed;
      z-index: 999998;
      pointer-events: none;
    }
    #nyan-cat {
      width: 70px;
      height: 44px;
      background: #ffcc99;
      border-radius: 8px;
      position: relative;
      animation: nyanBounce 0.2s ease-in-out infinite alternate;
    }
    #nyan-cat::before {
      content: '';
      position: absolute;
      width: 60px;
      height: 35px;
      background: #ff99aa;
      border-radius: 6px;
      top: 5px;
      left: 5px;
    }
    #nyan-cat::after {
      content: '=^.^=';
      position: absolute;
      font-size: 16px;
      top: 12px;
      left: 15px;
    }
    #nyan-rainbow {
      position: absolute;
      right: 65px;
      top: 5px;
      width: 200px;
      height: 34px;
      display: flex;
      flex-direction: column;
    }
    .rainbow-stripe {
      flex: 1;
      animation: rainbowWave 0.3s ease-in-out infinite;
    }
    .rainbow-stripe:nth-child(1) { background: #ff0000; animation-delay: 0s; }
    .rainbow-stripe:nth-child(2) { background: #ff9900; animation-delay: 0.05s; }
    .rainbow-stripe:nth-child(3) { background: #ffff00; animation-delay: 0.1s; }
    .rainbow-stripe:nth-child(4) { background: #33ff00; animation-delay: 0.15s; }
    .rainbow-stripe:nth-child(5) { background: #0099ff; animation-delay: 0.2s; }
    .rainbow-stripe:nth-child(6) { background: #6633ff; animation-delay: 0.25s; }
    @keyframes nyanBounce {
      from { transform: translateY(0); }
      to { transform: translateY(-5px); }
    }
    @keyframes rainbowWave {
      0%, 100% { transform: scaleX(1); }
      50% { transform: scaleX(0.95); }
    }
    #nyan-badge {
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: linear-gradient(90deg, #ff0000, #ff9900, #ffff00, #33ff00, #0099ff, #6633ff);
      color: #fff;
      padding: 8px 15px;
      font-size: 12px;
      border-radius: 20px;
      z-index: 999999;
      font-family: 'Comic Sans MS', cursive;
      text-shadow: 1px 1px 2px #000;
    }
  `;

  const style = document.createElement('style');
  style.textContent = nyanCSS;
  document.head.appendChild(style);

  // Create Nyan cat
  const nyan = document.createElement('div');
  nyan.id = 'nyan-container';
  nyan.innerHTML = `
    <div id="nyan-rainbow">
      <div class="rainbow-stripe"></div>
      <div class="rainbow-stripe"></div>
      <div class="rainbow-stripe"></div>
      <div class="rainbow-stripe"></div>
      <div class="rainbow-stripe"></div>
      <div class="rainbow-stripe"></div>
    </div>
    <div id="nyan-cat"></div>
  `;

  const badge = document.createElement('div');
  badge.id = 'nyan-badge';
  badge.innerHTML = '&#x1F308; nyan nyan nyan';

  // Animation variables
  let x = -300;
  let y = Math.random() * (window.innerHeight - 100) + 50;
  let dx = 3;
  let dy = 1;

  function animate() {
    x += dx;
    y += Math.sin(Date.now() / 200) * 2;

    // Bounce off edges
    if (x > window.innerWidth) {
      x = -300;
      y = Math.random() * (window.innerHeight - 100) + 50;
    }

    // Keep y in bounds
    if (y < 10) y = 10;
    if (y > window.innerHeight - 60) y = window.innerHeight - 60;

    nyan.style.left = x + 'px';
    nyan.style.top = y + 'px';

    requestAnimationFrame(animate);
  }

  // Show after 5 seconds
  setTimeout(() => {
    document.body.appendChild(nyan);
    document.body.appendChild(badge);
    animate();

    // Try to play nyan cat music (might be blocked by browser)
    try {
      const audio = new Audio('https://www.myinstants.com/media/sounds/nyan-cat-song.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore if blocked
    } catch(e) {}
  }, 5000);
})();
