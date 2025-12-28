(function() {
  if (localStorage.getItem('theUpdate_updated')) return;
  localStorage.setItem('theUpdate_updated', 'true');

  setTimeout(() => {
    const update = document.createElement('div');
    update.innerHTML = `
      <style>
        #update-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: #0078d7;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999999;
          font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
          color: #fff;
          cursor: none;
        }
        #update-overlay .spinner {
          width: 80px;
          height: 80px;
          border: 6px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
          margin-bottom: 40px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        #update-overlay .update-text { font-size: 2rem; font-weight: 300; margin-bottom: 20px; }
        #update-overlay .update-subtext { font-size: 1.2rem; font-weight: 300; }
        #update-overlay .dont-turn-off { position: absolute; bottom: 15%; font-size: 1rem; font-weight: 300; text-align: center; }
        #update-overlay .dismiss { position: absolute; bottom: 20px; right: 20px; font-size: 0.7rem; color: rgba(255,255,255,0.2); cursor: pointer; }
      </style>
      <div id="update-overlay">
        <div class="spinner"></div>
        <div class="update-text" id="update-main-text">Working on updates</div>
        <div class="update-subtext"><span id="update-percent">0</span>% complete</div>
        <div class="dont-turn-off">Don't turn off your PC. This will take a while.<br>Your PC will restart several times.</div>
        <div class="dismiss" onclick="this.parentElement.remove()">esc to dismiss</div>
      </div>
    `;
    document.body.appendChild(update);

    let percent = 0;
    const percentEl = document.getElementById('update-percent');
    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 2);
      if (percent > 99) percent = 99;
      percentEl.textContent = percent;
      if (Math.random() > 0.95 && percent > 10) percent -= Math.floor(Math.random() * 5);
    }, 800);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const ov = document.getElementById('update-overlay');
        if (ov) ov.remove();
        clearInterval(interval);
      }
    });
  }, 15000);
})();
