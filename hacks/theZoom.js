(function() {
  if (localStorage.getItem('theZoom_zoomed')) return;
  localStorage.setItem('theZoom_zoomed', 'true');

  // No splash - subtle chaos
  let zoom = 100;
  const maxZoom = 200;
  const zoomSpeed = 0.05; // Very slow

  const style = document.createElement('style');
  style.id = 'zoom-style';
  document.head.appendChild(style);

  // Zoom indicator (hidden initially)
  const indicator = document.createElement('div');
  indicator.innerHTML = `
    <style>
      #zoom-indicator {
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        color: #fff;
        padding: 8px 15px;
        font-size: 12px;
        border-radius: 4px;
        z-index: 999999;
        font-family: monospace;
        opacity: 0;
        transition: opacity 0.3s;
      }
    </style>
    <div id="zoom-indicator">&#x1F50D; Zoom: <span id="zoom-value">100</span>%</div>
  `;
  document.body.appendChild(indicator);

  const zoomIndicator = document.getElementById('zoom-indicator');
  const zoomValue = document.getElementById('zoom-value');

  function updateZoom() {
    if (zoom < maxZoom) {
      zoom += zoomSpeed;
      style.textContent = `
        html {
          zoom: ${zoom}% !important;
        }
      `;
      zoomValue.textContent = Math.floor(zoom);

      // Show indicator when zoom becomes noticeable
      if (zoom > 110) {
        zoomIndicator.style.opacity = '1';
      }
    }
    requestAnimationFrame(updateZoom);
  }

  // Start zooming after 5 seconds
  setTimeout(() => {
    updateZoom();
  }, 5000);
})();
