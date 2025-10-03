// Elements
const scene = document.getElementById('scene');
const cups = Array.from(document.querySelectorAll('.cup'));
const shuffleBtn = document.getElementById('shuffleBtn');
const resetBtn = document.getElementById('resetBtn');
const messageEl = document.getElementById('message');

// Scoreboard elements
const scoreValEl = document.getElementById('scoreVal');
const winsValEl = document.getElementById('winsVal');
const roundsValEl = document.getElementById('roundsVal');
const highValEl = document.getElementById('highVal');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const resetHighBtn = document.getElementById('resetHighBtn');
const streakBadgeEl = document.getElementById('streakBadge');
const streakValEl = document.getElementById('streakVal');

// Logical state
let ballEl = null;
let ballCupIndex = 0;
let shuffling = false;
let revealed = false;
let shuffledThisRound = false;

// Scoring state
let streak = 0;
let currentScore = 0;
let wins = 0;
let rounds = 0;
let highScore = parseInt(localStorage.getItem('cupShuffleHigh') || '0', 10);

// Layout positions (px)
const positions = [0, 180, 360];
let ignoreNextClick = false;

// Initialize positions and event handlers
function initLayout() {
  cups.forEach((cup, i) => {
    cup.style.left = positions[i] + 'px';
    cup.style.transition = 'left 350ms cubic-bezier(.22,.9,.3,1), transform 200ms ease';
  });
}

// Scoreboard helpers
function updateScoreboardInstant() {
  scoreValEl.textContent = currentScore;
  winsValEl.textContent = wins;
  roundsValEl.textContent = rounds;
  highValEl.textContent = highScore;
  updateStreakUI();
}

function animateValue(el, start, end, duration = 600) {
  const startTime = performance.now();
  function step(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const cur = Math.round(start + (end - start) * eased);
    el.textContent = cur;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function saveHighScore() {
  localStorage.setItem('cupShuffleHigh', String(highScore));
}

// Streak UI update + pulse
function updateStreakUI() {
  streakValEl.textContent = `×${streak}`;
  if (streak > 0) {
    streakBadgeEl.classList.add('visible');
  } else {
    streakBadgeEl.classList.remove('visible');
  }
}

function pulseStreak() {
  streakBadgeEl.classList.remove('pulse');
  void streakBadgeEl.offsetWidth;
  streakBadgeEl.classList.add('pulse');
  setTimeout(() => streakBadgeEl.classList.remove('pulse'), 700);
}

// Create ball element
function createBall() {
  const b = document.createElement('div');
  b.className = 'ball';
  b.setAttribute('aria-hidden', 'true');
  return b;
}

// Reset visuals
function resetVisuals() {
  cups.forEach(c => {
    c.classList.remove('win', 'correct', 'celebrate', 'shake', 'lift', 'tilt', 'press');
  });
  clearMessage();
  cups.forEach(c => c.style.pointerEvents = '');
}

// New round
function newRound() {
  resetVisuals();
  if (ballEl && ballEl.parentNode) ballEl.parentNode.removeChild(ballEl);

  ballEl = createBall();
  ballCupIndex = Math.floor(Math.random() * cups.length);
  cups[ballCupIndex].appendChild(ballEl);

  shuffledThisRound = false;
  revealed = true;
  showMessage('Watch the ball for a moment...');
  ballEl.classList.remove('hidden');
  setTimeout(() => {
    if (!shuffling) {
      hideBall();
      revealed = false;
      showMessage('Ready! Press "Shuffle".');
    }
  }, 1100);
}

function hideBall() {
  if (ballEl) ballEl.classList.add('hidden');
}
function revealBall() {
  if (ballEl) ballEl.classList.remove('hidden');
  revealed = true;
}

// Celebration
function celebrate(winningCup) {
  winningCup.classList.add('celebrate', 'win');
  spawnConfetti(48, winningCup);
  playJingle();
}

function spawnConfetti(count = 24, originCup) {
  const rect = originCup.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  const originX = rect.left + rect.width / 2 - sceneRect.left;
  const originY = rect.top + rect.height / 3 - sceneRect.top;

  const container = document.createElement('div');
  container.className = 'confetti-container';
  container.style.left = '0';
  container.style.top = '0';
  scene.appendChild(container);

  for (let i = 0; i < count; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    const colors = ['#FFB84D','#FFD57A','#FF6B6B','#8BE3C9','#8BD3FF','#D6A4FF'];
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.floor(Math.random() * 8) + 8;
    conf.style.width = conf.style.height = size + 'px';
    conf.style.left = originX + (Math.random() - 0.5) * 30 + 'px';
    conf.style.top = originY + (Math.random() - 0.5) * 20 + 'px';
    conf.style.transform = `translate3d(0,0,0) rotate(${Math.random() * 360}deg)`;
    conf.style.animationDelay = (Math.random() * 80) + 'ms';
    conf.style.setProperty('--tx', (Math.random() * 320 - 160) + 'px');
    conf.style.setProperty('--ty', (Math.random() * -320 - 80) + 'px');
    conf.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');
    container.appendChild(conf);
  }
  setTimeout(() => { container.remove(); }, 2600);
}

function playJingle() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.connect(ctx.destination);
    const notes = [880, 1046.5, 1318.5];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(gain);
      o.start(now + i * 0.12);
      o.stop(now + i * 0.12 + 0.22);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.22);
    });
    setTimeout(() => { gain.disconnect(); ctx.close?.(); }, 900);
  } catch (e) {}
}

// Shuffle logic
function shuffleCups(times = 10, interval = 300) {
  if (shuffling) return;
  resetVisuals();
  shuffling = true;
  revealed = false;
  cups.forEach(c => c.style.pointerEvents = '');
  hideBall();
  showMessage('Shuffling...');
  shuffleBtn.disabled = true;
  resetBtn.disabled = true;

  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      let a = Math.floor(Math.random() * cups.length);
      let b;
      do { b = Math.floor(Math.random() * cups.length); } while (b === a);
      const leftA = cups[a].style.left;
      cups[a].style.left = cups[b].style.left;
      cups[b].style.left = leftA;
      cups[a].classList.add('tilt');
      cups[b].classList.add('tilt');
      setTimeout(() => { cups[a].classList.remove('tilt'); cups[b].classList.remove('tilt'); }, 220);
    }, i * interval);
  }

  setTimeout(() => {
    shuffling = false;
    shuffleBtn.disabled = false;
    resetBtn.disabled = false;
    hideBall();
    revealed = false;
    cups.forEach(c => c.style.pointerEvents = '');
    showMessage('Pick a cup to reveal the ball.');
    shuffledThisRound = true;
  }, times * interval + 80);
}

// Handle selection
function handleCupSelect(clickedCup) {
  if (!shuffledThisRound) {
    showMessage('Please shuffle before picking a cup!');
    return;
  }
  if (shuffling || revealed) return;
  clickedCup.classList.add('lift');
  cups.forEach(c => c.style.pointerEvents = 'none');

  setTimeout(() => {
    revealBall();
    rounds += 1;

    if (clickedCup.contains(ballEl)) {
      streak += 1;
      const prevScore = currentScore;
      currentScore = streak * 10;
      wins += 1;
      animateValue(scoreValEl, prevScore, currentScore, 700);
      winsValEl.textContent = wins;
      roundsValEl.textContent = rounds;
      updateStreakUI();
      pulseStreak();
      let beatHigh = false;
      if (currentScore > highScore) {
        highScore = currentScore;
        saveHighScore();
        beatHigh = true;
        animateValue(highValEl, parseInt(highValEl.textContent||'0',10), highScore, 900);
      } else {
        highValEl.textContent = highScore;
      }
      showMessage('🎉 You found the ball!');
      celebrate(clickedCup);
      if (beatHigh) spawnConfetti(64, clickedCup);
    } else {
      streak = 0;
      const prevScore = currentScore;
      currentScore = 0;
      animateValue(scoreValEl, prevScore, 0, 600);
      updateStreakUI();
      showMessage('😅 Wrong cup — the ball was under another cup.');
      roundsValEl.textContent = rounds;
      const correctCup = cups[ballCupIndex];
      correctCup.classList.add('correct');
      clickedCup.classList.add('shake');
      setTimeout(() => clickedCup.classList.remove('shake'), 500);
    }
    shuffledThisRound = false;
    revealed = true;
    setTimeout(() => { clickedCup.classList.remove('lift'); }, 600);
    setTimeout(() => cups.forEach(c => c.style.pointerEvents = ''), 600);
  }, 420);
}

// Cup events
cups.forEach(cup => {
  cup.addEventListener('pointerdown', (ev) => {
    if (ev.isPrimary === false) return;
    cup.classList.add('press');
    cup.setPointerCapture?.(ev.pointerId);
  });
  cup.addEventListener('pointerup', (ev) => {
    if (ev.isPrimary === false) return;
    cup.classList.remove('press');
    cup.releasePointerCapture?.(ev.pointerId);
    if (ev.pointerType === 'touch' || ev.pointerType === 'pen') {
      ignoreNextClick = true;
      handleCupSelect(cup);
      setTimeout(() => { ignoreNextClick = false; }, 450);
    }
  });
  cup.addEventListener('pointercancel', () => {
    cup.classList.remove('press');
  });
  cup.addEventListener('click', (ev) => {
    if (ignoreNextClick) { ev.preventDefault(); ev.stopImmediatePropagation(); return; }
    handleCupSelect(ev.currentTarget);
  });
});

// Button press animations
[shuffleBtn, resetBtn, resetScoreBtn, resetHighBtn].forEach(btn => {
  btn.addEventListener('pointerdown', (ev) => {
    if (ev.isPrimary === false) return;
    btn.classList.add('pressed');
  });
  btn.addEventListener('pointerup', (ev) => {
    if (ev.isPrimary === false) return;
    btn.classList.remove('pressed');
  });
  btn.addEventListener('pointercancel', () => btn.classList.remove('pressed'));
});

// Shuffle / reset wiring
shuffleBtn.addEventListener('click', () => {
  shuffleCups(10, 300);
});
resetBtn.addEventListener('click', () => {
  newRound();
});

// Reset score
resetScoreBtn.addEventListener('click', () => {
  streak = 0;
  currentScore = 0;
  wins = 0;
  rounds = 0;
  animateValue(scoreValEl, parseInt(scoreValEl.textContent||'0',10), 0, 600);
  winsValEl.textContent = wins;
  roundsValEl.textContent = rounds;
  updateStreakUI();
});
resetHighBtn.addEventListener('click', () => {
  highScore = 0;
  saveHighScore();
  animateValue(highValEl, parseInt(highValEl.textContent||'0',10), 0, 600);
  highValEl.textContent = 0;
});

// Message helpers
function showMessage(txt) { messageEl.textContent = txt; }
function clearMessage() { messageEl.textContent = ''; }

// Initial setup
initLayout();
updateScoreboardInstant();
newRound();
