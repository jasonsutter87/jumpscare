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

  const stored = localStorage.getItem('theColoring_colored');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theColoring_colored', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #coloring-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #ff9a9e, #fecfef, #fecfef, #a18cd1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Comic Sans MS', cursive;
      }
      #coloring-overlay .coloring-text {
        color: #ff6b6b;
        font-size: 3rem;
        text-shadow: 3px 3px 0 #fff;
        animation: bounce 0.5s ease infinite alternate;
      }
      #coloring-overlay .coloring-icon { font-size: 6rem; margin: 20px 0; }
      #coloring-overlay .coloring-subtitle { color: #9b59b6; font-size: 1.5rem; }
      @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }
    </style>
    <div id="coloring-overlay">
      <div class="coloring-text">COLORING TIME!</div>
      <div class="coloring-icon">&#x1F3A8;</div>
      <div class="coloring-subtitle">Let your creativity flow!</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    const ov = document.getElementById('coloring-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Create canvas overlay
      const canvas = document.createElement('canvas');
      canvas.id = 'coloring-canvas';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:999998;pointer-events:auto;cursor:crosshair;';
      document.body.appendChild(canvas);

      // Color palette
      const palette = document.createElement('div');
      palette.innerHTML = `
        <style>
          #color-palette {
            position: fixed;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 999999;
            background: #fff;
            padding: 10px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          }
          #color-palette .color-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid #fff;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: transform 0.2s;
          }
          #color-palette .color-btn:hover { transform: scale(1.2); }
          #color-palette .color-btn.active { border-color: #333; transform: scale(1.2); }
          #color-palette .size-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid #333;
            background: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }
          #color-palette .clear-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background: #ff6b6b;
            color: #fff;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
        <div id="color-palette">
          <button class="color-btn active" style="background:#ff6b6b" data-color="#ff6b6b"></button>
          <button class="color-btn" style="background:#feca57" data-color="#feca57"></button>
          <button class="color-btn" style="background:#48dbfb" data-color="#48dbfb"></button>
          <button class="color-btn" style="background:#1dd1a1" data-color="#1dd1a1"></button>
          <button class="color-btn" style="background:#5f27cd" data-color="#5f27cd"></button>
          <button class="color-btn" style="background:#ff9ff3" data-color="#ff9ff3"></button>
          <button class="color-btn" style="background:#000" data-color="#000"></button>
          <button class="color-btn" style="background:#fff" data-color="#fff"></button>
          <button class="size-btn" data-size="5">S</button>
          <button class="size-btn" data-size="15">M</button>
          <button class="size-btn" data-size="30">L</button>
          <button class="clear-btn" id="clear-canvas">X</button>
        </div>
      `;
      document.body.appendChild(palette);

      const ctx = canvas.getContext('2d');
      let drawing = false;
      let currentColor = '#ff6b6b';
      let brushSize = 15;
      let lastX = 0;
      let lastY = 0;

      // Drawing functions
      canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        lastX = e.clientX;
        lastY = e.clientY;
      });

      canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        lastX = e.clientX;
        lastY = e.clientY;
      });

      canvas.addEventListener('mouseup', () => drawing = false);
      canvas.addEventListener('mouseout', () => drawing = false);

      // Touch support
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        drawing = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      });

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!drawing) return;
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
        ctx.stroke();
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      });

      canvas.addEventListener('touchend', () => drawing = false);

      // Color selection
      document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentColor = btn.dataset.color;
        });
      });

      // Size selection
      document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          brushSize = parseInt(btn.dataset.size);
        });
      });

      // Clear canvas
      document.getElementById('clear-canvas').addEventListener('click', (e) => {
        e.stopPropagation();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });

      // Resize handler
      window.addEventListener('resize', () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.putImageData(imageData, 0, 0);
      });

    }, 1000);
  }, 2500);
})();
