(function() {
  if (localStorage.getItem('theCage_caged')) return;
  localStorage.setItem('theCage_caged', 'true');

  // Nicolas Cage placeholder images
  const cageImages = [
    'https://www.placecage.com/200/200',
    'https://www.placecage.com/c/200/200',
    'https://www.placecage.com/g/200/200',
    'https://www.placecage.com/gif/200/200'
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
      const width = img.width || 200;
      const height = img.height || 200;
      const cageType = ['', 'c/', 'g/', 'gif/'][i % 4];
      img.style.transition = 'opacity 0.5s';
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = `https://www.placecage.com/${cageType}${width}/${height}`;
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
