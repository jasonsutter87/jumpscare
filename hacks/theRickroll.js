(function() {
  if (localStorage.getItem('theRickroll_rolled')) return;
  localStorage.setItem('theRickroll_rolled', 'true');

  // No splash. Just silence. They suspect nothing.

  setTimeout(() => {
    // Create the rickroll overlay
    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <style>
        #rickroll-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: #000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 999999;
          font-family: 'Impact', 'Arial Black', sans-serif;
        }
        #rickroll-text {
          color: #fff;
          font-size: 4rem;
          text-align: center;
          text-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000;
          animation: pulse 0.5s ease-in-out infinite;
          margin-bottom: 30px;
        }
        #rickroll-video {
          width: 80%;
          max-width: 800px;
          aspect-ratio: 16/9;
          border: 4px solid #fff;
          border-radius: 8px;
        }
        #rickroll-close {
          position: absolute;
          top: 20px;
          right: 30px;
          color: #666;
          font-size: 1rem;
          cursor: pointer;
          font-family: sans-serif;
        }
        #rickroll-close:hover {
          color: #fff;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      </style>
      <div id="rickroll-overlay">
        <div id="rickroll-close">skip (coward)</div>
        <div id="rickroll-text">YOU'VE BEEN RICKROLLED!</div>
        <iframe
          id="rickroll-video"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&loop=1&playlist=dQw4w9WgXcQ"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen>
        </iframe>
      </div>
    `;
    document.body.appendChild(overlay);

    // Close button (for cowards)
    document.getElementById('rickroll-close').addEventListener('click', () => {
      overlay.style.transition = 'opacity 0.5s';
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 500);
    });

  }, 10000); // 10 seconds of false security
})();
