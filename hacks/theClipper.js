(function() {
  if (localStorage.getItem('theClipper_clipped')) return;
  localStorage.setItem('theClipper_clipped', 'true');

  // Clippy ASCII art as base64 encoded image (using emoji for demo)
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

  setTimeout(() => {
    const ov = document.getElementById('clippy-overlay');
    ov.style.transition = 'opacity 1s';
    ov.style.opacity = '0';

    setTimeout(() => {
      ov.remove();

      // Create Clippy container
      const clippy = document.createElement('div');
      clippy.innerHTML = `
        <style>
          #clippy-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: 'Segoe UI', Tahoma, sans-serif;
          }
          #clippy-character {
            width: 100px;
            height: 120px;
            background: linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%);
            border-radius: 50% 50% 45% 45%;
            position: relative;
            cursor: pointer;
            box-shadow: 3px 3px 10px rgba(0,0,0,0.3);
            animation: clippyIdle 2s ease-in-out infinite;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
          }
          #clippy-character::before {
            content: '';
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            background: #c0c0c0;
            border-radius: 50%;
          }
          #clippy-eyes {
            position: absolute;
            top: 15px;
            display: flex;
            gap: 15px;
          }
          .clippy-eye {
            width: 20px;
            height: 25px;
            background: #fff;
            border-radius: 50%;
            position: relative;
            overflow: hidden;
          }
          .clippy-pupil {
            width: 10px;
            height: 10px;
            background: #000;
            border-radius: 50%;
            position: absolute;
            top: 8px;
            left: 5px;
            animation: lookAround 3s ease-in-out infinite;
          }
          #clippy-speech {
            position: absolute;
            bottom: 130px;
            right: 0;
            background: #ffffd5;
            border: 2px solid #000;
            border-radius: 10px;
            padding: 15px;
            max-width: 250px;
            font-size: 14px;
            box-shadow: 3px 3px 10px rgba(0,0,0,0.2);
            display: none;
          }
          #clippy-speech::after {
            content: '';
            position: absolute;
            bottom: -15px;
            right: 30px;
            border: 8px solid transparent;
            border-top-color: #ffffd5;
          }
          #clippy-speech::before {
            content: '';
            position: absolute;
            bottom: -18px;
            right: 28px;
            border: 10px solid transparent;
            border-top-color: #000;
          }
          #clippy-speech.show {
            display: block;
            animation: popIn 0.3s ease;
          }
          #clippy-dismiss {
            position: absolute;
            top: 5px;
            right: 8px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #666;
          }
          @keyframes clippyIdle {
            0%, 100% { transform: translateY(0) rotate(0); }
            25% { transform: translateY(-5px) rotate(-2deg); }
            75% { transform: translateY(-5px) rotate(2deg); }
          }
          @keyframes lookAround {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(5px, -2px); }
            50% { transform: translate(-3px, 2px); }
            75% { transform: translate(2px, 3px); }
          }
          @keyframes popIn {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
        <div id="clippy-container">
          <div id="clippy-speech">
            <button id="clippy-dismiss">x</button>
            <span id="clippy-message"></span>
          </div>
          <div id="clippy-character">
            <div id="clippy-eyes">
              <div class="clippy-eye"><div class="clippy-pupil"></div></div>
              <div class="clippy-eye"><div class="clippy-pupil"></div></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(clippy);

      const speech = document.getElementById('clippy-speech');
      const message = document.getElementById('clippy-message');
      const character = document.getElementById('clippy-character');
      const dismiss = document.getElementById('clippy-dismiss');

      let adviceIndex = 0;

      function showAdvice() {
        message.textContent = clippyAdvice[adviceIndex];
        speech.classList.add('show');
        adviceIndex = (adviceIndex + 1) % clippyAdvice.length;
      }

      function hideAdvice() {
        speech.classList.remove('show');
      }

      // Show first advice after a delay
      setTimeout(showAdvice, 2000);

      // Random advice popups
      setInterval(() => {
        if (!speech.classList.contains('show')) {
          showAdvice();
        }
      }, 15000 + Math.random() * 10000);

      // Click to get new advice
      character.addEventListener('click', () => {
        showAdvice();
      });

      // Dismiss button
      dismiss.addEventListener('click', (e) => {
        e.stopPropagation();
        hideAdvice();
      });

      // Auto-hide after 8 seconds
      setInterval(() => {
        if (speech.classList.contains('show')) {
          setTimeout(hideAdvice, 8000);
        }
      }, 1000);
    }, 1000);
  }, 2500);
})();
