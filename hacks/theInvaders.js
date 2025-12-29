(function() {
  // ===========================================
  // CONFIGURATION OPTIONS
  // ===========================================
  const CONFIG = {
    showIntro: true,                      // Set to false to skip the intro overlay
    introDelay: 2500,                     // How long to show intro (in milliseconds)
    storageDuration: 24 * 60 * 60 * 1000, // How long before hack can trigger again (default: 24 hours)
    alienRows: 3,                         // Number of alien rows
    alienCols: 8,                         // Number of aliens per row
    alienSpeed: 1                         // Alien movement speed
  };
  // ===========================================

  const stored = localStorage.getItem('theInvaders_invaded');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theInvaders_invaded', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #invaders-overlay {
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
      #invaders-overlay .invaders-text {
        color: #00ff00;
        font-size: 2.5rem;
        text-shadow: 0 0 10px #00ff00;
      }
      #invaders-overlay .invaders-icon {
        font-size: 4rem;
        margin: 20px 0;
        animation: invaderWiggle 0.3s ease infinite alternate;
      }
      #invaders-overlay .invaders-subtitle {
        color: #00aa00;
        font-size: 1rem;
        text-align: center;
        line-height: 1.8;
      }
      @keyframes invaderWiggle {
        from { transform: translateX(-5px); }
        to { transform: translateX(5px); }
      }
    </style>
    <div id="invaders-overlay">
      <div class="invaders-text">SPACE INVADERS</div>
      <div class="invaders-icon">👾 👾 👾</div>
      <div class="invaders-subtitle">
        ← → to move | SPACE to shoot<br>
        Defend your webpage!<br>
        Aliens will abduct your content!
      </div>
    </div>
  `;

  function applyEffect() {
    // Game state
    let player = {
      x: window.innerWidth / 2,
      y: window.innerHeight - 60,
      width: 50,
      speed: 8
    };

    let aliens = [];
    let bullets = [];
    let alienBullets = [];
    let alienDirection = 1;
    let alienSpeed = CONFIG.alienSpeed;
    let score = 0;
    let abductedElements = [];
    let gameOver = false;

    const alienEmojis = ['👾', '👽', '🛸'];

    // Initialize aliens
    function initAliens() {
      aliens = [];
      const startX = 50;
      const startY = 50;
      const spacingX = 60;
      const spacingY = 50;

      for (let row = 0; row < CONFIG.alienRows; row++) {
        for (let col = 0; col < CONFIG.alienCols; col++) {
          aliens.push({
            x: startX + col * spacingX,
            y: startY + row * spacingY,
            width: 40,
            height: 40,
            emoji: alienEmojis[row % alienEmojis.length],
            alive: true
          });
        }
      }
    }
    initAliens();

    // Get elements that can be abducted
    function getAbductableElements() {
      const elements = [];
      document.querySelectorAll('p, h1, h2, h3, img, button, a, span, div').forEach(el => {
        if (el.id && el.id.includes('invaders-')) return;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (rect.width > 20 && rect.height > 10 &&
            rect.width < 400 && rect.height < 150 &&
            rect.bottom > window.innerHeight - 200 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            !el.dataset.abducted) {
          elements.push(el);
        }
      });
      return elements;
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'invaders-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:999998;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // UI
    const ui = document.createElement('div');
    ui.innerHTML = `
      <style>
        #invaders-ui {
          position: fixed;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          color: #00ff00;
          padding: 10px 20px;
          font-size: 14px;
          border-radius: 8px;
          z-index: 999999;
          font-family: 'Courier New', monospace;
          display: flex;
          gap: 20px;
        }
        #invaders-badge {
          position: fixed;
          bottom: 10px;
          right: 10px;
          background: #000;
          color: #00ff00;
          padding: 8px 15px;
          font-size: 12px;
          border-radius: 4px;
          z-index: 999999;
          font-family: monospace;
        }
      </style>
      <div id="invaders-ui">
        <span>👾 Score: <span id="invaders-score">0</span></span>
        <span>🛸 Abducted: <span id="invaders-abducted">0</span></span>
        <span>←→ SPACE</span>
      </div>
      <div id="invaders-badge">👾 Invasion in progress</div>
    `;
    document.body.appendChild(ui);

    // Controls
    const keys = {};
    document.addEventListener('keydown', (e) => {
      keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
      if (e.key === ' ' && !gameOver) {
        // Shoot
        bullets.push({
          x: player.x + player.width / 2 - 3,
          y: player.y,
          width: 6,
          height: 15,
          speed: 10
        });
      }
    });
    document.addEventListener('keyup', (e) => {
      keys[e.key] = false;
    });

    function update() {
      if (gameOver) return;

      // Move player
      if (keys['ArrowLeft']) {
        player.x -= player.speed;
      }
      if (keys['ArrowRight']) {
        player.x += player.speed;
      }
      player.x = Math.max(0, Math.min(window.innerWidth - player.width, player.x));

      // Move bullets
      bullets.forEach((bullet, i) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
          bullets.splice(i, 1);
        }
      });

      // Move aliens
      let hitEdge = false;
      let lowestAlien = 0;

      aliens.forEach(alien => {
        if (!alien.alive) return;
        alien.x += alienSpeed * alienDirection;
        if (alien.x <= 0 || alien.x >= window.innerWidth - alien.width) {
          hitEdge = true;
        }
        if (alien.y > lowestAlien) {
          lowestAlien = alien.y;
        }
      });

      if (hitEdge) {
        alienDirection *= -1;
        aliens.forEach(alien => {
          alien.y += 20;
        });
      }

      // Check if aliens reached bottom
      if (lowestAlien > window.innerHeight - 150) {
        // Abduct an element!
        const elements = getAbductableElements();
        if (elements.length > 0) {
          const el = elements[Math.floor(Math.random() * elements.length)];
          el.dataset.abducted = 'true';
          el.style.transition = 'all 0.5s';
          el.style.transform = 'translateY(-100vh) scale(0)';
          el.style.opacity = '0';
          setTimeout(() => {
            el.style.visibility = 'hidden';
          }, 500);
          abductedElements.push(el);
          document.getElementById('invaders-abducted').textContent = abductedElements.length;
        }

        // Reset aliens higher up
        aliens.forEach(alien => {
          alien.y -= 100;
        });
      }

      // Collision detection: bullets hit aliens
      bullets.forEach((bullet, bi) => {
        aliens.forEach((alien, ai) => {
          if (!alien.alive) return;
          if (bullet.x < alien.x + alien.width &&
              bullet.x + bullet.width > alien.x &&
              bullet.y < alien.y + alien.height &&
              bullet.y + bullet.height > alien.y) {
            alien.alive = false;
            bullets.splice(bi, 1);
            score += 100;
            document.getElementById('invaders-score').textContent = score;
          }
        });
      });

      // Check win condition
      const aliveAliens = aliens.filter(a => a.alive);
      if (aliveAliens.length === 0) {
        // Spawn new wave
        alienSpeed += 0.5;
        initAliens();
      }

      // Alien shooting (random)
      if (Math.random() < 0.01) {
        const aliveAliens = aliens.filter(a => a.alive);
        if (aliveAliens.length > 0) {
          const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
          alienBullets.push({
            x: shooter.x + shooter.width / 2 - 3,
            y: shooter.y + shooter.height,
            width: 6,
            height: 10,
            speed: 5
          });
        }
      }

      // Move alien bullets
      alienBullets.forEach((bullet, i) => {
        bullet.y += bullet.speed;
        if (bullet.y > window.innerHeight) {
          alienBullets.splice(i, 1);
        }

        // Check if hit player
        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + 30 &&
            bullet.y + bullet.height > player.y) {
          // Player hit - just flash for now
          alienBullets.splice(i, 1);
        }
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.font = '40px Arial';
      ctx.fillText('🚀', player.x, player.y + 35);

      // Draw aliens
      aliens.forEach(alien => {
        if (!alien.alive) return;
        ctx.font = '35px Arial';
        ctx.fillText(alien.emoji, alien.x, alien.y + 35);
      });

      // Draw bullets
      ctx.fillStyle = '#00ff00';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      // Draw alien bullets
      ctx.fillStyle = '#ff0000';
      alienBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
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
