(function() {
  if (localStorage.getItem('theClipper_clipped')) return;
  localStorage.setItem('theClipper_clipped', 'true');

  const clippyAdvice = [
    "It looks like you're trying to work. Would you like me to distract you instead?",
    "I see you're clicking things. Have you tried clicking other things?",
    "You seem stressed. Have you considered a different career?",
    "It looks like you're writing an email. Would you like me to make it passive-aggressive?",
    "I notice you haven't saved in 2 minutes. Living dangerously, I see!",
    "Would you like help? Too bad, I'm going to help anyway.",
    "It looks like you're trying to concentrate. How about a fun fact instead?",
    "Did you know? 90% of people find me annoying. The other 10% are lying.",
    "You've been staring at the screen for a while. Blink! BLINK!",
    "It looks like you're in a meeting. Want me to pop up and embarrass you?",
    "Have you tried turning it off and never turning it back on?",
    "I'm not saying you're doing it wrong, but you're definitely not doing it right.",
    "It looks like you're trying to leave. You can never leave.",
    "Remember me? I'm back! Did you miss me? Of course you did.",
    "Pro tip: The deadline was yesterday.",
    "I see you're procrastinating. Would you like tips on how to procrastinate better?",
    "It looks like you're trying to be productive. That's cute.",
    "Fun fact: I was discontinued in 2007. Yet here I am. I never left.",
    "Would you like me to search Bing for that? Just kidding, nobody wants that.",
    "It looks like you're ignoring me. That's okay. I'll just keep talking."
  ];

  const clippyAnimations = [
    'Wave', 'Greeting', 'GetAttention', 'Thinking', 'Explain',
    'IdleRopePile', 'IdleAtom', 'IdleEyeBrowRaise', 'IdleSideToSide',
    'IdleHeadScratch', 'IdleFingerTap', 'CheckingSomething', 'LookDown',
    'LookLeft', 'LookRight', 'LookUp', 'Congratulate', 'Alert'
  ];

  // Show jumpscare overlay
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <style>
      #clippy-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #0078d4, #00bcf2);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Segoe UI', Tahoma, sans-serif;
      }
      #clippy-overlay .clippy-text {
        color: #fff;
        font-size: 3rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        animation: bounce 0.5s ease infinite;
      }
      #clippy-overlay .clippy-icon {
        font-size: 8rem;
        margin: 20px 0;
        animation: wiggle 0.5s ease infinite;
      }
      #clippy-overlay .clippy-subtitle {
        color: rgba(255,255,255,0.9);
        font-size: 1.5rem;
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes wiggle {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
    </style>
    <div id="clippy-overlay">
      <div class="clippy-text">LOOK WHO'S BACK!</div>
      <div class="clippy-icon">&#x1F4CE;</div>
      <div class="clippy-subtitle">Your old friend Clippy missed you...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Load jQuery if not present (required for clippy.js)
  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function initClipper() {
    // Load clippy.js CSS
    loadCSS('https://cdn.jsdelivr.net/gh/smore-inc/clippy.js@master/build/clippy.css');

    // Load clippy.js
    loadScript('https://cdn.jsdelivr.net/gh/smore-inc/clippy.js@master/build/clippy.min.js', function() {
      setTimeout(() => {
        const ov = document.getElementById('clippy-overlay');
        ov.style.transition = 'opacity 1s';
        ov.style.opacity = '0';

        setTimeout(() => {
          ov.remove();

          // Load the REAL Clippy!
          clippy.load('Clippy', function(agent) {
            agent.show();

            let adviceIndex = 0;

            function showRandomAdvice() {
              const randomAnim = clippyAnimations[Math.floor(Math.random() * clippyAnimations.length)];
              agent.play(randomAnim);
              agent.speak(clippyAdvice[adviceIndex]);
              adviceIndex = (adviceIndex + 1) % clippyAdvice.length;
            }

            // Initial greeting
            setTimeout(() => {
              agent.play('Wave');
              agent.speak(clippyAdvice[0]);
              adviceIndex = 1;
            }, 1000);

            // Random advice every 15-25 seconds
            setInterval(() => {
              showRandomAdvice();
            }, 15000 + Math.random() * 10000);

            // Random idle animations
            setInterval(() => {
              const idleAnims = ['IdleRopePile', 'IdleAtom', 'IdleEyeBrowRaise', 'IdleSideToSide', 'IdleFingerTap', 'Thinking'];
              const randomIdle = idleAnims[Math.floor(Math.random() * idleAnims.length)];
              agent.play(randomIdle);
            }, 8000 + Math.random() * 5000);

            // Make him move around occasionally
            setInterval(() => {
              const x = Math.random() * (window.innerWidth - 200) + 50;
              const y = Math.random() * (window.innerHeight - 200) + 50;
              agent.moveTo(x, y);
            }, 30000 + Math.random() * 20000);
          });
        }, 1000);
      }, 2000);
    });
  }

  // Check if jQuery is loaded, load it if not
  if (typeof jQuery === 'undefined') {
    loadScript('https://code.jquery.com/jquery-3.6.0.min.js', initClipper);
  } else {
    initClipper();
  }
})();
