(function() {
  // ===========================================
  // CONFIGURATION OPTIONS
  // ===========================================
  const CONFIG = {
    showIntro: true,                      // Set to false to skip the intro overlay
    introDelay: 2500,                     // How long to show intro (in milliseconds)
    storageDuration: 24 * 60 * 60 * 1000, // How long before hack can trigger again (default: 24 hours)
    ballSpeed: 5,                         // Initial ball speed
    paddleSpeed: 10                       // Paddle movement speed
  };
  // ===========================================

  const stored = localStorage.getItem('thePong_ponged');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('thePong_ponged', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #pong-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Courier New', monospace;
      }
      #pong-overlay .pong-text {
        color: #fff;
        font-size: 3rem;
        text-shadow: 0 0 10px #fff;
      }
      #pong-overlay .pong-icon {
        font-size: 4rem;
        margin: 20px 0;
      }
      #pong-overlay .pong-subtitle {
        color: #888;
        font-size: 1rem;
        text-align: center;
        line-height: 1.8;
      }
    </style>
    <div id="pong-overlay">
      <div class="pong-text">PONG CHAOS</div>
      <div class="pong-icon">🏓</div>
      <div class="pong-subtitle">
        ← → to move paddle<br>
        Ball scrambles everything it hits!<br>
        Don't let it fall!
      </div>
    </div>
  `;

  function applyEffect() {
    // Game state
    let paddle = {
      x: window.innerWidth / 2 - 50,
      y: window.innerHeight - 30,
      width: 100,
      height: 15
    };

    let ball = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 12,
      dx: CONFIG.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
      dy: CONFIG.ballSpeed
    };

    let score = 0;
    let chaos = 0;
    let gameOver = false;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'pong-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:999998;pointer-events:none;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // UI
    const ui = document.createElement('div');
    ui.innerHTML = `
      <style>
        #pong-ui {
          position: fixed;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          color: #fff;
          padding: 10px 20px;
          font-size: 14px;
          border-radius: 8px;
          z-index: 999999;
          font-family: 'Courier New', monospace;
          display: flex;
          gap: 20px;
        }
        #pong-badge {
          position: fixed;
          bottom: 10px;
          right: 10px;
          background: #000;
          color: #fff;
          padding: 8px 15px;
          font-size: 12px;
          border-radius: 4px;
          z-index: 999999;
          font-family: monospace;
        }
      </style>
      <div id="pong-ui">
        <span>🏓 Bounces: <span id="pong-score">0</span></span>
        <span>💥 Chaos: <span id="pong-chaos">0</span></span>
        <span>←→ to move</span>
      </div>
      <div id="pong-badge">🏓 Pong mode active</div>
    `;
    document.body.appendChild(ui);

    // Get hittable elements
    function getHittableElements() {
      const elements = [];
      document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, img, li, div').forEach(el => {
        if (el.id && el.id.includes('pong-')) return;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (rect.width > 20 && rect.height > 10 &&
            rect.width < 500 && rect.height < 200 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden') {
          elements.push(el);
        }
      });
      return elements;
    }

    // Effects when ball hits element
    function chaosEffect(el) {
      const effects = [
        // Rotate
        () => { el.style.transform = `rotate(${Math.random() * 20 - 10}deg)`; },
        // Scale
        () => { el.style.transform = `scale(${0.8 + Math.random() * 0.4})`; },
        // Color change
        () => { el.style.color = `hsl(${Math.random() * 360}, 70%, 50%)`; },
        // Background
        () => { el.style.backgroundColor = `hsla(${Math.random() * 360}, 70%, 50%, 0.3)`; },
        // Blur
        () => { el.style.filter = `blur(${Math.random() * 2}px)`; },
        // Move
        () => { el.style.position = 'relative'; el.style.left = `${Math.random() * 20 - 10}px`; },
        // Skew
        () => { el.style.transform = `skewX(${Math.random() * 10 - 5}deg)`; },
        // Opacity
        () => { el.style.opacity = `${0.5 + Math.random() * 0.5}`; }
      ];

      el.style.transition = 'all 0.3s ease';
      const effect = effects[Math.floor(Math.random() * effects.length)];
      effect();

      chaos++;
      document.getElementById('pong-chaos').textContent = chaos;
    }

    // Controls
    const keys = {};
    document.addEventListener('keydown', (e) => {
      keys[e.key] = true;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
    });
    document.addEventListener('keyup', (e) => {
      keys[e.key] = false;
    });

    function update() {
      if (gameOver) return;

      // Move paddle
      if (keys['ArrowLeft']) {
        paddle.x -= CONFIG.paddleSpeed;
      }
      if (keys['ArrowRight']) {
        paddle.x += CONFIG.paddleSpeed;
      }
      paddle.x = Math.max(0, Math.min(window.innerWidth - paddle.width, paddle.x));

      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collisions
      if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= window.innerWidth) {
        ball.dx *= -1;
      }
      if (ball.y - ball.radius <= 0) {
        ball.dy *= -1;
      }

      // Paddle collision
      if (ball.y + ball.radius >= paddle.y &&
          ball.y - ball.radius <= paddle.y + paddle.height &&
          ball.x >= paddle.x &&
          ball.x <= paddle.x + paddle.width) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.radius;

        // Add angle based on where it hit the paddle
        const hitPos = (ball.x - paddle.x) / paddle.width;
        ball.dx = CONFIG.ballSpeed * (hitPos - 0.5) * 3;

        score++;
        document.getElementById('pong-score').textContent = score;

        // Speed up slightly
        ball.dy *= 1.02;
      }

      // Check element collisions
      const elements = getHittableElements();
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (ball.x + ball.radius > rect.left &&
            ball.x - ball.radius < rect.right &&
            ball.y + ball.radius > rect.top &&
            ball.y - ball.radius < rect.bottom) {

          // Bounce
          const overlapLeft = ball.x + ball.radius - rect.left;
          const overlapRight = rect.right - (ball.x - ball.radius);
          const overlapTop = ball.y + ball.radius - rect.top;
          const overlapBottom = rect.bottom - (ball.y - ball.radius);

          const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

          if (minOverlap === overlapTop || minOverlap === overlapBottom) {
            ball.dy *= -1;
          } else {
            ball.dx *= -1;
          }

          // Apply chaos effect
          chaosEffect(el);
        }
      });

      // Ball fell below paddle
      if (ball.y - ball.radius > window.innerHeight) {
        // Reset ball
        ball.x = window.innerWidth / 2;
        ball.y = window.innerHeight / 2;
        ball.dx = CONFIG.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = CONFIG.ballSpeed;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      // Ball glow
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();

      // Draw paddle
      ctx.fillStyle = '#fff';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

      // Paddle glow
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 10;
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.shadowBlur = 0;
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }

  if (CONFIG.showIntro) {
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.style.transition = 'opacity 1s';
      overlay.style.opacity = '0';

      setTimeout(() => {
        overlay.remove();
        applyEffect();
      }, 1000);
    }, CONFIG.introDelay);
  } else {
    applyEffect();
  }
})();
