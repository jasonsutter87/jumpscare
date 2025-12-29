(function() {
  // ===========================================
  // CONFIGURATION OPTIONS
  // ===========================================
  const CONFIG = {
    showIntro: true,                      // Set to false to skip the popup ads entirely
    introDelay: 10000,                    // How long to wait before first popup (in milliseconds)
    storageDuration: 24 * 60 * 60 * 1000  // How long before hack can trigger again (default: 24 hours)
  };
  // ===========================================

  const stored = localStorage.getItem('theAds_advertised');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.timestamp && (Date.now() - data.timestamp) < CONFIG.storageDuration) {
        return;
      }
    } catch (e) {}
  }
  localStorage.setItem('theAds_advertised', JSON.stringify({ triggered: true, timestamp: Date.now() }));

  if (!CONFIG.showIntro) return;

  const ads = [
    { title: "CONGRATULATIONS!", body: "You are the 1,000,000th visitor! Click here to claim your FREE iPad!", color: "#ff0000" },
    { title: "HOT SINGLES IN YOUR AREA", body: "Click here to meet them! (This is definitely not a scam)", color: "#ff69b4" },
    { title: "YOUR COMPUTER HAS VIRUS!", body: "Download our FREE antivirus now! Only 3 viruses included!", color: "#ff6600" },
    { title: "MAKE $5000/DAY FROM HOME", body: "This weird trick will make your boss HATE you!", color: "#00cc00" },
    { title: "DOCTORS HATE HIM!", body: "Local man discovers one weird trick. Click to learn more!", color: "#9900ff" },
    { title: "FREE BITCOIN!!!", body: "Just enter your credit card and social security number!", color: "#f7931a" },
    { title: "LOSE 50 LBS IN 2 DAYS", body: "Scientists are SHOCKED by this new diet pill!", color: "#00ccff" },
    { title: "ENLARGE YOUR... SAVINGS", body: "Banks don't want you to know this ONE trick!", color: "#ff3366" },
    { title: "YOU WON A FREE CRUISE!", body: "Sponsored by NigerianPrince.com - 100% Legit!", color: "#00ff00" },
    { title: "PUNCH THE MONKEY!", body: "Win a FREE iPod Nano! (Remember those?)", color: "#ffcc00" }
  ];

  function createPopupAd() {
    const ad = ads[Math.floor(Math.random() * ads.length)];
    const popup = document.createElement('div');
    const popupId = 'popup-ad-' + Date.now();

    const x = 50 + Math.random() * (window.innerWidth - 350);
    const y = 50 + Math.random() * (window.innerHeight - 250);

    popup.innerHTML = `
      <style>
        .${popupId} {
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: 300px;
          background: #fff;
          border: 3px solid ${ad.color};
          box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
          z-index: 999999;
          font-family: 'Arial', sans-serif;
          animation: popIn 0.3s ease;
        }
        .${popupId} .ad-header {
          background: ${ad.color};
          color: #fff;
          padding: 5px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }
        .${popupId} .ad-close {
          cursor: pointer;
          font-weight: bold;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .${popupId} .ad-body {
          padding: 15px;
          text-align: center;
        }
        .${popupId} .ad-title {
          color: ${ad.color};
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          animation: blink 0.5s infinite;
        }
        .${popupId} .ad-text {
          font-size: 14px;
          margin-bottom: 15px;
        }
        .${popupId} .ad-button {
          background: ${ad.color};
          color: #fff;
          border: none;
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
          animation: pulse 1s infinite;
        }
        .${popupId} .ad-fake-close {
          position: absolute;
          top: 5px;
          right: 5px;
          opacity: 0;
        }
        @keyframes blink { 50% { opacity: 0.7; } }
        @keyframes pulse { 50% { transform: scale(1.05); } }
        @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
      </style>
      <div class="${popupId}">
        <div class="ad-header">
          <span>&#x26A0; SPECIAL OFFER &#x26A0;</span>
          <span class="ad-close" onclick="this.parentElement.parentElement.parentElement.remove()">X</span>
        </div>
        <div class="ad-body">
          <div class="ad-title">${ad.title}</div>
          <div class="ad-text">${ad.body}</div>
          <button class="ad-button" onclick="alert('Just kidding! This is a prank. &#x1F602;')">CLAIM NOW!!!</button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    // Auto-remove after 30 seconds
    setTimeout(() => popup.remove(), 30000);
  }

  // Start after delay
  setTimeout(() => {
    createPopupAd();

    // More popups every 15-30 seconds
    setInterval(() => {
      if (Math.random() > 0.4) {
        createPopupAd();
      }
    }, 15000 + Math.random() * 15000);
  }, CONFIG.introDelay);
})();
