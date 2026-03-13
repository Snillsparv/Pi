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

// ========== SACRED GEOMETRY BACKGROUND ==========
(function initSacredGeometry() {
  const canvas = document.getElementById('sacred-geometry');
  const ctx = canvas.getContext('2d');

  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // Floating sacred symbols
  const symbols = [];
  const glyphs = '\u03C0\u2206\u03A6\u03A9\u221E\u2220\u25CB\u2299\u2609\u2295\u25B3\u2641';
  const symbolCount = Math.min(25, Math.floor(width / 60));

  for (let i = 0; i < symbolCount; i++) {
    symbols.push({
      x: Math.random() * width,
      y: Math.random() * height,
      char: glyphs[Math.floor(Math.random() * glyphs.length)],
      size: 12 + Math.random() * 16,
      speed: 0.15 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: 0.04 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Slowly rotating concentric circles
  let rotation = 0;

  function drawCirclePattern(cx, cy, maxR, time) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    for (let r = 60; r < maxR; r += 80) {
      const alpha = 0.015 * (1 - r / maxR);
      ctx.strokeStyle = `rgba(212, 165, 74, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Rotating inscribed triangle
    const triR = maxR * 0.4;
    ctx.strokeStyle = 'rgba(212, 165, 74, 0.02)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 0; i <= 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * triR;
      const y = Math.sin(angle) * triR;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    rotation += 0.0003;

    // Draw sacred circle patterns
    drawCirclePattern(width * 0.2, height * 0.3, 250, rotation);
    drawCirclePattern(width * 0.8, height * 0.7, 200, rotation * 0.7);
    drawCirclePattern(width * 0.5, height * 0.5, 300, rotation * 0.5);

    // Draw floating symbols
    for (const s of symbols) {
      s.y -= s.speed;
      s.x += s.drift + Math.sin(s.phase + rotation * 10) * 0.2;
      s.phase += 0.005;

      if (s.y < -30) {
        s.y = height + 30;
        s.x = Math.random() * width;
      }
      if (s.x < -30) s.x = width + 30;
      if (s.x > width + 30) s.x = -30;

      const flicker = 0.8 + Math.sin(s.phase * 3) * 0.2;
      ctx.font = `${s.size}px "EB Garamond", serif`;
      ctx.fillStyle = `rgba(212, 165, 74, ${s.opacity * flicker})`;
      ctx.fillText(s.char, s.x, s.y);
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

// ========== NAV ==========
(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });
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

  document.querySelectorAll('.section-title, .glass-card, .timeline-item, .fact-card, .leve-hurra, .leve-h').forEach((el) => {
    observer.observe(el);
  });
})();

// ========== SACRED FIRE ==========
(function initFire() {
  const canvas = document.getElementById('fire-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = Math.floor(rect.width);
    H = canvas.height = Math.floor(rect.height);
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle-based fire — slow, red-orange
  const particles = [];
  const maxParticles = 250;

  function spawnParticle() {
    const x = Math.random() * W;
    particles.push({
      x: x,
      y: H + 5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.6 + Math.random() * 1.2),
      life: 1,
      decay: 0.004 + Math.random() * 0.007,
      size: 18 + Math.random() * 30,
      drift: (Math.random() - 0.5) * 0.008,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Spawn new particles (fewer per frame = slower buildup)
    for (let i = 0; i < 3; i++) {
      if (particles.length < maxParticles) spawnParticle();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx += p.drift;
      p.vy *= 0.998;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // Color: bright orange core -> red-orange -> deep red -> dark ember
      let r, g, b, a;
      if (p.life > 0.7) {
        // Core: bright orange-yellow
        const t = (p.life - 0.7) / 0.3;
        r = 255;
        g = 120 + t * 80;
        b = 20 + t * 30;
        a = p.life * 0.55;
      } else if (p.life > 0.4) {
        // Mid: red-orange
        const t = (p.life - 0.4) / 0.3;
        r = 200 + t * 55;
        g = 40 + t * 80;
        b = 5 + t * 15;
        a = p.life * 0.45;
      } else {
        // Dying: deep crimson ember
        const t = p.life / 0.4;
        r = 100 + t * 100;
        g = 10 + t * 30;
        b = 2 + t * 3;
        a = p.life * 0.3;
      }

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * p.life);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }

    // Warm red-orange glow at the base
    const baseGlow = ctx.createLinearGradient(0, H, 0, H - 80);
    baseGlow.addColorStop(0, 'rgba(180, 60, 15, 0.15)');
    baseGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = baseGlow;
    ctx.fillRect(0, H - 80, W, 80);

    requestAnimationFrame(draw);
  }

  draw();
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
    decimalsEl.innerHTML = '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';
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

  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '');
  });

  // Result display element (replaces input visually during check)
  let resultEl = document.createElement('div');
  resultEl.className = 'pi-input pi-result';
  resultEl.style.display = 'none';
  input.parentNode.insertBefore(resultEl, input.nextSibling);

  resultEl.addEventListener('click', () => {
    resultEl.style.display = 'none';
    input.style.display = '';
    input.focus();
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
  });

  btnCheck.addEventListener('click', () => {
    const answer = input.value.trim();
    if (!answer) {
      feedback.textContent = 'Skriv in minst en siffra!';
      feedback.className = 'quiz-feedback wrong';
      return;
    }

    let correctCount = 0;
    let html = '';
    for (let i = 0; i < answer.length; i++) {
      const isCorrect = answer[i] === PI_DIGITS[i];
      if (isCorrect && correctCount === i) correctCount++;
      html += '<span class="' + (isCorrect ? 'pi-digit-correct' : 'pi-digit-wrong') + '">' + answer[i] + '</span>';
    }

    resultEl.innerHTML = html;
    resultEl.style.display = '';
    input.style.display = 'none';

    if (correctCount === answer.length) {
      feedback.textContent = 'Fullkomligt! Alla ' + correctCount + ' decimaler korrekt.';
      feedback.className = 'quiz-feedback correct';
    } else {
      feedback.textContent = correctCount + ' r\u00E4tt i rad av ' + answer.length + '. Klicka p\u00E5 siffrorna f\u00F6r att f\u00F6rs\u00F6ka igen.';
      feedback.className = 'quiz-feedback wrong';
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnCheck.click();
  });
})();

// ========== COUNTDOWN TO NEXT PIAFTON (March 13) ==========
(function initCountdown() {
  function getNextPiafton() {
    const now = new Date();
    const year = now.getFullYear();
    let piafton = new Date(year, 2, 13);

    if (now >= piafton) {
      const endOfDay = new Date(year, 2, 13, 23, 59, 59, 999);
      if (now <= endOfDay) {
        return piafton;
      }
      piafton = new Date(year + 1, 2, 13);
    }
    return piafton;
  }

  function update() {
    const now = new Date();
    const target = getNextPiafton();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
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
