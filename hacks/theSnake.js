(function() {
  // ===========================================
  // CONFIGURATION OPTIONS
  // ===========================================
  const CONFIG = {
    showIntro: true,                      // Set to false to skip the intro overlay
    introDelay: 2500,                     // How long to show intro (in milliseconds)
    storageDuration: 24 * 60 * 60 * 1000, // How long before hack can trigger again (default: 24 hours)
    snakeSpeed: 100,                      // Movement interval in ms (lower = faster)
    gridSize: 20                          // Size of each grid cell in pixels
  };
  // ===========================================

  const stored = localStorage.getItem('theSnake_eaten');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theSnake_eaten', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #snake-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Press Start 2P', 'Courier New', monospace;
      }
      #snake-overlay .snake-text {
        color: #00ff00;
        font-size: 2rem;
        text-shadow: 0 0 10px #00ff00;
        animation: snakePulse 0.5s ease infinite alternate;
      }
      #snake-overlay .snake-icon {
        font-size: 5rem;
        margin: 20px 0;
      }
      #snake-overlay .snake-subtitle {
        color: #00aa00;
        font-size: 1rem;
        text-align: center;
        line-height: 1.8;
      }
      @keyframes snakePulse {
        from { transform: scale(1); }
        to { transform: scale(1.05); }
      }
    </style>
    <div id="snake-overlay">
      <div class="snake-text">SNAKE MODE</div>
      <div class="snake-icon">🐍</div>
      <div class="snake-subtitle">
        Arrow keys to move<br>
        Eat the page. Collect 🍎 to restore it.<br>
        Don't hit yourself!
      </div>
    </div>
  `;

  function applyEffect() {
    const gridSize = CONFIG.gridSize;
    const cols = Math.floor(window.innerWidth / gridSize);
    const rows = Math.floor(window.innerHeight / gridSize);

    // Snake state
    let snake = [
      { x: Math.floor(cols / 2), y: Math.floor(rows / 2) }
    ];
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let food = null;
    let score = 0;
    let eatenElements = [];
    let gameOver = false;

    // Get all visible elements that can be "eaten"
    function getEdibleElements() {
      const elements = [];
      document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, img, li, td, th, label, div').forEach(el => {
        if (el.id && el.id.includes('snake-')) return;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (rect.width > 10 && rect.height > 10 &&
            rect.width < 500 && rect.height < 200 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            !el.dataset.snakeEaten) {
          elements.push(el);
        }
      });
      return elements;
    }

    // Create game canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'snake-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:999998;pointer-events:none;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // UI elements
    const ui = document.createElement('div');
    ui.innerHTML = `
      <style>
        #snake-ui {
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
        #snake-badge {
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
      <div id="snake-ui">
        <span>🐍 Score: <span id="snake-score">0</span></span>
        <span>🍎 Eaten: <span id="snake-eaten-count">0</span></span>
        <span>↑↓←→ to move</span>
      </div>
      <div id="snake-badge">🐍 Snake mode active</div>
    `;
    document.body.appendChild(ui);

    // Spawn food
    function spawnFood() {
      food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
      };
    }
    spawnFood();

    // Handle keyboard
    document.addEventListener('keydown', (e) => {
      if (gameOver) return;

      switch(e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
          e.preventDefault();
          break;
      }
    });

    // Game loop
    function gameLoop() {
      if (gameOver) return;

      direction = nextDirection;

      // Move snake
      const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
      };

      // Wrap around edges
      if (head.x < 0) head.x = cols - 1;
      if (head.x >= cols) head.x = 0;
      if (head.y < 0) head.y = rows - 1;
      if (head.y >= rows) head.y = 0;

      // Check self collision
      for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
          gameOver = true;
          showGameOver();
          return;
        }
      }

      snake.unshift(head);

      // Check food collision
      if (food && head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('snake-score').textContent = score;

        // Restore an eaten element
        if (eatenElements.length > 0) {
          const restored = eatenElements.pop();
          restored.style.opacity = '1';
          restored.style.visibility = 'visible';
          restored.dataset.snakeEaten = '';
        }

        spawnFood();
        // Don't remove tail - snake grows
      } else {
        snake.pop();
      }

      // Check if snake head hits any page element
      const headPixelX = head.x * gridSize + gridSize / 2;
      const headPixelY = head.y * gridSize + gridSize / 2;

      const edible = getEdibleElements();
      for (let el of edible) {
        const rect = el.getBoundingClientRect();
        if (headPixelX >= rect.left && headPixelX <= rect.right &&
            headPixelY >= rect.top && headPixelY <= rect.bottom) {
          // Eat the element!
          el.dataset.snakeEaten = 'true';
          el.style.transition = 'opacity 0.3s';
          el.style.opacity = '0';
          setTimeout(() => {
            el.style.visibility = 'hidden';
          }, 300);
          eatenElements.push(el);
          document.getElementById('snake-eaten-count').textContent = eatenElements.length;
          score += 5;
          document.getElementById('snake-score').textContent = score;
          break;
        }
      }

      // Draw
      draw();

      setTimeout(gameLoop, CONFIG.snakeSpeed);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      snake.forEach((segment, i) => {
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;

        if (i === 0) {
          // Head
          ctx.font = `${gridSize}px Arial`;
          ctx.fillText('🐍', x, y + gridSize - 2);
        } else {
          // Body
          ctx.fillStyle = `hsl(${120 - i * 2}, 100%, ${50 - i}%)`;
          ctx.fillRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
          ctx.fillStyle = `hsl(${120 - i * 2}, 100%, ${60 - i}%)`;
          ctx.fillRect(x + 4, y + 4, gridSize - 8, gridSize - 8);
        }
      });

      // Draw food
      if (food) {
        ctx.font = `${gridSize}px Arial`;
        ctx.fillText('🍎', food.x * gridSize, food.y * gridSize + gridSize - 2);
      }
    }

    function showGameOver() {
      const gameOverEl = document.createElement('div');
      gameOverEl.innerHTML = `
        <style>
          #snake-gameover {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.95);
            color: #ff0000;
            padding: 40px;
            font-size: 24px;
            border-radius: 10px;
            z-index: 9999999;
            font-family: 'Courier New', monospace;
            text-align: center;
            border: 3px solid #00ff00;
          }
          #snake-gameover .final-score {
            color: #00ff00;
            font-size: 48px;
            margin: 20px 0;
          }
          #snake-gameover .eaten-count {
            color: #ffaa00;
            font-size: 18px;
          }
        </style>
        <div id="snake-gameover">
          <div>GAME OVER</div>
          <div class="final-score">${score}</div>
          <div class="eaten-count">Elements eaten: ${eatenElements.length}</div>
          <div style="margin-top:20px;font-size:14px;color:#888">They stay eaten forever...</div>
        </div>
      `;
      document.body.appendChild(gameOverEl);
    }

    // Start game
    draw();
    setTimeout(gameLoop, 1000);
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
