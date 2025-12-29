(function() {
  // ===========================================
  // CONFIGURATION OPTIONS
  // ===========================================
  const CONFIG = {
    showIntro: true,                      // Set to false to skip the intro overlay
    introDelay: 2500,                     // How long to show intro (in milliseconds)
    storageDuration: 24 * 60 * 60 * 1000, // How long before hack can trigger again (default: 24 hours)
    maxSpeed: 12,                         // Maximum car speed
    acceleration: 0.3,                    // How fast car accelerates
    friction: 0.98,                       // How fast car slows down
    turnSpeed: 0.06,                      // How fast car turns
    driftFactor: 0.92                     // Drift physics (lower = more drift)
  };
  // ===========================================

  const stored = localStorage.getItem('theDrift_drifted');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theDrift_drifted', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #drift-game-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Impact', sans-serif;
      }
      #drift-game-overlay .drift-text {
        color: #ff6b35;
        font-size: 4rem;
        text-shadow: 0 0 20px #ff6b35, 3px 3px 0 #000;
        letter-spacing: 5px;
      }
      #drift-game-overlay .drift-icon {
        font-size: 5rem;
        margin: 20px 0;
        animation: carShake 0.1s ease infinite;
      }
      #drift-game-overlay .drift-subtitle {
        color: #fff;
        font-size: 1.2rem;
        text-align: center;
        line-height: 1.8;
        font-family: sans-serif;
      }
      @keyframes carShake {
        0%, 100% { transform: translateX(-2px) rotate(-1deg); }
        50% { transform: translateX(2px) rotate(1deg); }
      }
    </style>
    <div id="drift-game-overlay">
      <div class="drift-text">TOKYO DRIFT</div>
      <div class="drift-icon">🏎️</div>
      <div class="drift-subtitle">
        WASD or Arrow Keys to drive<br>
        SPACE for handbrake<br>
        Leave your mark on this page!
      </div>
    </div>
  `;

  function applyEffect() {
    // Car state
    let car = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      angle: 0,
      velocity: { x: 0, y: 0 },
      speed: 0,
      drifting: false
    };

    let tireMarks = [];
    let driftScore = 0;
    let totalDistance = 0;

    // Create canvas for tire marks
    const canvas = document.createElement('canvas');
    canvas.id = 'drift-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:999997;pointer-events:none;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Create car element
    const carEl = document.createElement('div');
    carEl.id = 'drift-car';
    carEl.innerHTML = `
      <style>
        #drift-car {
          position: fixed;
          font-size: 40px;
          z-index: 999998;
          pointer-events: none;
          transition: none;
          filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5));
        }
        #drift-car.drifting::after {
          content: '💨';
          position: absolute;
          font-size: 24px;
          left: -30px;
          top: 5px;
          opacity: 0.7;
        }
        #drift-ui {
          position: fixed;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          color: #ff6b35;
          padding: 10px 20px;
          font-size: 14px;
          border-radius: 8px;
          z-index: 999999;
          font-family: 'Impact', sans-serif;
          display: flex;
          gap: 20px;
          letter-spacing: 1px;
        }
        #drift-badge {
          position: fixed;
          bottom: 10px;
          right: 10px;
          background: linear-gradient(135deg, #ff6b35, #ff0000);
          color: #fff;
          padding: 8px 15px;
          font-size: 12px;
          border-radius: 4px;
          z-index: 999999;
          font-family: 'Impact', sans-serif;
        }
        #speed-meter {
          width: 100px;
          height: 8px;
          background: #333;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 5px;
        }
        #speed-bar {
          height: 100%;
          background: linear-gradient(90deg, #00ff00, #ffff00, #ff0000);
          transition: width 0.1s;
        }
      </style>
      <span>🏎️</span>
    `;
    document.body.appendChild(carEl);

    // UI
    const ui = document.createElement('div');
    ui.innerHTML = `
      <div id="drift-ui">
        <span>🏎️ SPEED: <span id="drift-speed">0</span></span>
        <span>🔥 DRIFT: <span id="drift-score">0</span></span>
        <span>📏 <span id="drift-distance">0</span>m</span>
      </div>
      <div id="drift-badge">🏎️ DRIFT MODE</div>
    `;
    document.body.appendChild(ui);

    // Controls
    const keys = {};
    document.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true;
      keys[e.key] = true;
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });
    document.addEventListener('keyup', (e) => {
      keys[e.key.toLowerCase()] = false;
      keys[e.key] = false;
    });

    function addTireMark(x, y, angle, intensity) {
      tireMarks.push({
        x, y, angle, intensity,
        opacity: 0.6,
        age: 0
      });

      // Limit tire marks
      if (tireMarks.length > 2000) {
        tireMarks.shift();
      }
    }

    function update() {
      const accelerating = keys['w'] || keys['arrowup'];
      const braking = keys['s'] || keys['arrowdown'];
      const turningLeft = keys['a'] || keys['arrowleft'];
      const turningRight = keys['d'] || keys['arrowright'];
      const handbrake = keys[' '];

      // Acceleration
      if (accelerating) {
        car.speed = Math.min(car.speed + CONFIG.acceleration, CONFIG.maxSpeed);
      } else if (braking) {
        car.speed = Math.max(car.speed - CONFIG.acceleration * 1.5, -CONFIG.maxSpeed / 2);
      } else {
        car.speed *= CONFIG.friction;
      }

      // Turning (only when moving)
      if (Math.abs(car.speed) > 0.5) {
        if (turningLeft) {
          car.angle -= CONFIG.turnSpeed * (car.speed > 0 ? 1 : -1);
        }
        if (turningRight) {
          car.angle += CONFIG.turnSpeed * (car.speed > 0 ? 1 : -1);
        }
      }

      // Calculate velocity
      const targetVelX = Math.sin(car.angle) * car.speed;
      const targetVelY = -Math.cos(car.angle) * car.speed;

      // Apply drift physics
      let driftAmount = handbrake ? 0.85 : CONFIG.driftFactor;
      car.velocity.x = car.velocity.x * (1 - driftAmount) + targetVelX * driftAmount;
      car.velocity.y = car.velocity.y * (1 - driftAmount) + targetVelY * driftAmount;

      // Check if drifting
      const velocityAngle = Math.atan2(car.velocity.x, -car.velocity.y);
      const angleDiff = Math.abs(car.angle - velocityAngle);
      car.drifting = (angleDiff > 0.3 && Math.abs(car.speed) > 3) || handbrake;

      // Update position
      car.x += car.velocity.x;
      car.y += car.velocity.y;

      // Track distance
      totalDistance += Math.abs(car.speed) * 0.01;

      // Wrap around screen
      if (car.x < -50) car.x = window.innerWidth + 50;
      if (car.x > window.innerWidth + 50) car.x = -50;
      if (car.y < -50) car.y = window.innerHeight + 50;
      if (car.y > window.innerHeight + 50) car.y = -50;

      // Add tire marks when drifting or braking
      if ((car.drifting || handbrake) && Math.abs(car.speed) > 1) {
        const wheelOffset = 15;
        // Left wheel
        addTireMark(
          car.x - Math.cos(car.angle) * wheelOffset,
          car.y - Math.sin(car.angle) * wheelOffset,
          car.angle,
          Math.min(1, Math.abs(car.speed) / CONFIG.maxSpeed)
        );
        // Right wheel
        addTireMark(
          car.x + Math.cos(car.angle) * wheelOffset,
          car.y + Math.sin(car.angle) * wheelOffset,
          car.angle,
          Math.min(1, Math.abs(car.speed) / CONFIG.maxSpeed)
        );

        driftScore += Math.abs(car.speed) * 0.1;
      }

      // Update UI
      document.getElementById('drift-speed').textContent = Math.abs(Math.round(car.speed * 10));
      document.getElementById('drift-score').textContent = Math.floor(driftScore);
      document.getElementById('drift-distance').textContent = Math.floor(totalDistance);

      // Update car element
      carEl.style.left = (car.x - 20) + 'px';
      carEl.style.top = (car.y - 20) + 'px';
      carEl.style.transform = `rotate(${car.angle}rad)`;
      carEl.className = car.drifting ? 'drifting' : '';
    }

    function draw() {
      // Draw tire marks
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      tireMarks.forEach((mark, i) => {
        if (i === 0) return;
        const prevMark = tireMarks[i - 1];

        // Only connect marks that are close
        const dist = Math.sqrt(Math.pow(mark.x - prevMark.x, 2) + Math.pow(mark.y - prevMark.y, 2));
        if (dist > 50) return;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(30, 30, 30, ${mark.opacity * mark.intensity})`;
        ctx.moveTo(prevMark.x, prevMark.y);
        ctx.lineTo(mark.x, mark.y);
        ctx.stroke();

        // Age marks
        mark.opacity *= 0.9995;
      });

      // Remove old marks
      tireMarks = tireMarks.filter(m => m.opacity > 0.05);
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
