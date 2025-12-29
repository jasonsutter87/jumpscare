(function() {
  // ===========================================
  // CONFIGURATION OPTIONS
  // ===========================================
  const CONFIG = {
    showIntro: true,                      // Set to false to skip the BSOD effect entirely
    introDelay: 10000,                    // How long to wait before BSOD (in milliseconds)
    storageDuration: 24 * 60 * 60 * 1000  // How long before hack can trigger again (default: 24 hours)
  };
  // ===========================================

  const stored = localStorage.getItem('theCrash_crashed');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theCrash_crashed', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  if (!CONFIG.showIntro) return;

  // No warning - just straight to BSOD after delay
  setTimeout(() => {
    const bsod = document.createElement('div');
    bsod.innerHTML = `
      <style>
        #bsod-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: #0078d7;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 10%;
          z-index: 9999999;
          font-family: 'Segoe UI', sans-serif;
          color: #fff;
          cursor: none;
        }
        #bsod-overlay .sad-face {
          font-size: 8rem;
          margin-bottom: 30px;
        }
        #bsod-overlay .main-text {
          font-size: 1.8rem;
          margin-bottom: 20px;
        }
        #bsod-overlay .sub-text {
          font-size: 1rem;
          margin-bottom: 30px;
          max-width: 600px;
          line-height: 1.6;
        }
        #bsod-overlay .progress-text {
          font-size: 1rem;
          margin-bottom: 20px;
        }
        #bsod-overlay .qr-area {
          display: flex;
          align-items: flex-start;
          margin-top: 30px;
        }
        #bsod-overlay .fake-qr {
          width: 100px;
          height: 100px;
          background: #fff;
          margin-right: 20px;
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-template-rows: repeat(10, 1fr);
          padding: 5px;
        }
        #bsod-overlay .fake-qr span {
          background: #000;
        }
        #bsod-overlay .stop-code {
          font-size: 0.85rem;
          line-height: 1.8;
        }
        #bsod-overlay .dismiss {
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
        }
        #bsod-overlay .dismiss:hover {
          color: rgba(255,255,255,0.6);
        }
      </style>
      <div id="bsod-overlay">
        <div class="sad-face">:(</div>
        <div class="main-text">Your PC ran into a problem and needs to restart.</div>
        <div class="sub-text">We're just collecting some error info, and then we'll restart for you.</div>
        <div class="progress-text"><span id="bsod-percent">0</span>% complete</div>
        <div class="qr-area">
          <div class="fake-qr" id="fake-qr"></div>
          <div class="stop-code">
            For more information about this issue and possible fixes, visit<br>
            https://www.windows.com/stopcode<br><br>
            If you call a support person, give them this info:<br>
            Stop code: CRITICAL_PROCESS_DIED<br>
            What failed: ntoskrnl.exe
          </div>
        </div>
        <div class="dismiss" onclick="this.parentElement.remove()">just kidding, click to dismiss</div>
      </div>
    `;
    document.body.appendChild(bsod);

    // Generate fake QR code pattern
    const qr = document.getElementById('fake-qr');
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('span');
      if (Math.random() > 0.5) {
        cell.style.background = '#000';
      } else {
        cell.style.background = '#fff';
      }
      qr.appendChild(cell);
    }

    // Animate percentage
    let percent = 0;
    const percentEl = document.getElementById('bsod-percent');
    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 3);
      if (percent > 100) percent = 100;
      percentEl.textContent = percent;
      if (percent >= 100) {
        clearInterval(interval);
        // Just stays at 100% forever lol
      }
    }, 500);
  }, CONFIG.introDelay);
})();
