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

  // Check if victim has already been caged (with expiration)
  const stored = localStorage.getItem('theCage_caged');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theCage_caged', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  // Self-hosted base URL
  const CHAOS_BASE = 'https://jasonsutter87.github.io/jumpscare';

  // 20 glorious Nicolas Cage face swaps
  const cageImages = [
    CHAOS_BASE + '/lib/cage/cage1.jpg',   // Mona Lisa
    CHAOS_BASE + '/lib/cage/cage2.jpg',   // Gandalf
    CHAOS_BASE + '/lib/cage/cage3.jpg',   // Forrest Gump
    CHAOS_BASE + '/lib/cage/cage4.jpg',   // Jack Sparrow
    CHAOS_BASE + '/lib/cage/cage5.jpg',   // Obama
    CHAOS_BASE + '/lib/cage/cage6.jpg',   // Kill Bill
    CHAOS_BASE + '/lib/cage/cage7.jpg',   // Pulp Fiction
    CHAOS_BASE + '/lib/cage/cage8.jpg',   // Titanic
    CHAOS_BASE + '/lib/cage/cage9.jpg',   // Michael Scott
    CHAOS_BASE + '/lib/cage/cage10.jpg',  // Leia
    CHAOS_BASE + '/lib/cage/cage11.jpg',  // Buzz Lightyear
    CHAOS_BASE + '/lib/cage/cage12.jpg',  // Ghostbusters
    CHAOS_BASE + '/lib/cage/cage13.jpg',  // Avatar
    CHAOS_BASE + '/lib/cage/cage14.jpg',  // Hermione
    CHAOS_BASE + '/lib/cage/cage15.jpg',  // Mt Rushmore
    CHAOS_BASE + '/lib/cage/cage16.jpg',  // Van Gogh
    CHAOS_BASE + '/lib/cage/cage17.jpg',  // Star Trek
    CHAOS_BASE + '/lib/cage/cage18.jpg',  // Johnny Cage
    CHAOS_BASE + '/lib/cage/cage19.jpg',  // E.T.
    CHAOS_BASE + '/lib/cage/cage20.jpg'   // Napoleon Dynamite
  ];

  // Show the jumpscare first
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #cage-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Impact', sans-serif;
      }
      #cage-overlay .cage-text {
        color: #ffd700;
        font-size: 2.5rem;
        text-shadow: 0 0 20px #ffd700;
        animation: cagePulse 0.5s infinite;
      }
      #cage-overlay .cage-face {
        font-size: 10rem;
        margin: 20px 0;
      }
      #cage-overlay .cage-subtitle {
        color: #fff;
        font-size: 1.5rem;
        opacity: 0.8;
      }
      @keyframes cagePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    </style>
    <div id="cage-overlay">
      <div class="cage-text">YOU'VE BEEN CAGED</div>
      <div class="cage-face">&#x1F3AD;</div>
      <div class="cage-subtitle">All images are Nicolas Cage now</div>
    </div>
  `;
  document.body.appendChild(overlay);

  function cageAllImages() {
    const images = document.querySelectorAll('img:not([data-caged])');
    images.forEach((img, i) => {
      img.dataset.caged = 'true';
      img.style.transition = 'opacity 0.5s';
      img.style.opacity = '0';
      setTimeout(() => {
        // Pick a random Cage image
        img.src = cageImages[Math.floor(Math.random() * cageImages.length)];
        img.style.objectFit = 'cover';
        img.style.opacity = '1';
      }, 500);
    });
  }

  setTimeout(() => {
    const ov = document.getElementById('cage-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();
      cageAllImages();

      // Keep watching for new images
      const observer = new MutationObserver(cageAllImages);
      observer.observe(document.body, { childList: true, subtree: true });
    }, 1000);
  }, 2500);
})();
