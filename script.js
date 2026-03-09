// ========== PI DIGITS (first 1000) ==========
const PI_DIGITS =
  '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679' +
  '8214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196' +
  '4428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273' +
  '7245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094' +
  '3305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912' +
  '9833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132' +
  '0005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235' +
  '4201995611212902196086403441815981362977477130996051870721134999999837297804995105973173281609631859' +
  '5024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303' +
  '5982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989';

// ========== MATRIX-STYLE PI RAIN ==========
(function initPiRain() {
  const canvas = document.getElementById('pi-rain');
  const ctx = canvas.getContext('2d');

  let width, height, columns, drops;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const fontSize = 14;
    columns = Math.floor(width / fontSize);
    drops = new Array(columns).fill(1);
  }

  resize();
  window.addEventListener('resize', resize);

  const digits = '0123456789πeφ∞∑∫';

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 26, 0.06)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = '14px "Space Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = digits[Math.floor(Math.random() * digits.length)];
      const x = i * 14;
      const y = drops[i] * 14;

      // Gradient from cyan to purple
      const hue = 180 + (i / columns) * 100;
      ctx.fillStyle = `hsla(${hue}, 100%, 70%, 0.25)`;
      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
})();

// ========== SCROLL REVEAL ANIMATION ==========
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.section-title, .glass-card, .timeline-item, .fact-card').forEach((el) => {
    observer.observe(el);
  });
})();

// ========== PI PRACTICE ==========
(function initPractice() {
  const decimalsEl = document.getElementById('pi-decimals');
  const btnShow = document.getElementById('btn-show');
  const btnHide = document.getElementById('btn-hide');
  const slider = document.getElementById('decimal-count');
  const label = document.getElementById('decimal-label');

  function showDecimals() {
    const count = parseInt(slider.value, 10);
    let html = '';
    for (let i = 0; i < count; i++) {
      if (i > 0 && i % 5 === 0) html += ' ';
      if (i > 0 && i % 50 === 0) html += '<br>';
      html += PI_DIGITS[i] || '?';
    }
    decimalsEl.innerHTML = html;
    btnShow.style.display = 'none';
    btnHide.style.display = 'inline-block';
  }

  function hideDecimals() {
    decimalsEl.innerHTML = '••••••••••';
    btnShow.style.display = 'inline-block';
    btnHide.style.display = 'none';
  }

  btnShow.addEventListener('click', showDecimals);
  btnHide.addEventListener('click', hideDecimals);
  slider.addEventListener('input', () => {
    label.textContent = slider.value;
    if (btnHide.style.display !== 'none') showDecimals();
  });

  hideDecimals();
})();

// ========== PI QUIZ ==========
(function initQuiz() {
  const input = document.getElementById('pi-input');
  const feedback = document.getElementById('quiz-feedback');
  const btnCheck = document.getElementById('btn-check');

  // Only allow digits
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '');
  });

  btnCheck.addEventListener('click', () => {
    const answer = input.value.trim();
    if (!answer) {
      feedback.textContent = 'Skriv in minst en siffra!';
      feedback.className = 'quiz-feedback wrong';
      return;
    }

    let correctCount = 0;
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] === PI_DIGITS[i]) {
        correctCount++;
      } else {
        break;
      }
    }

    if (correctCount === answer.length) {
      feedback.textContent = `Perfekt! Alla ${correctCount} decimaler rätt! 🎉`;
      feedback.className = 'quiz-feedback correct';
    } else {
      feedback.textContent = `${correctCount} rätt av ${answer.length}. Fel på decimal ${correctCount + 1} — du skrev ${answer[correctCount]}, rätt svar var ${PI_DIGITS[correctCount]}.`;
      feedback.className = 'quiz-feedback wrong';
    }
  });

  // Check on Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnCheck.click();
  });
})();

// ========== COUNTDOWN TO NEXT PI DAY ==========
(function initCountdown() {
  function getNextPiDay() {
    const now = new Date();
    const year = now.getFullYear();
    let piDay = new Date(year, 2, 14); // March 14

    if (now >= piDay) {
      // Check if it's still Pi Day (same day)
      const endOfPiDay = new Date(year, 2, 14, 23, 59, 59, 999);
      if (now <= endOfPiDay) {
        return piDay;
      }
      piDay = new Date(year + 1, 2, 14);
    }
    return piDay;
  }

  function update() {
    const now = new Date();
    const target = getNextPiDay();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '🎉';
      document.getElementById('cd-hours').textContent = 'PI';
      document.getElementById('cd-minutes').textContent = 'DAG';
      document.getElementById('cd-seconds').textContent = '🎉';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();
