(function() {
'use strict';

var preloader = document.getElementById('preloader');
function hidePreloader() {
  if (!preloader || preloader.style.display === 'none') return;
  if (typeof gsap !== 'undefined') {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: function() { preloader.style.display = 'none'; }
    });
  } else {
    preloader.classList.add('hidden');
    setTimeout(function() { preloader.style.display = 'none'; }, 450);
  }
}
window.addEventListener('load', hidePreloader);

if (window.matchMedia('(pointer: fine)').matches) {
  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);
  var ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);

  var mouseX = 0, mouseY = 0;
  var ringX = 0, ringY = 0;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .btn, input, textarea, .card, .gallery-card, .stat-chip, .contact-row, .verse-card, .timeline-content').forEach(function(el) {
    el.addEventListener('mouseenter', function() { ring.classList.add('hover'); });
    el.addEventListener('mouseleave', function() { ring.classList.remove('hover'); });
  });
}

(function() {
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var isMobile = window.innerWidth < 768;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var count = isMobile ? 30 : 70;

  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.5 + 1,
      a: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var theme = document.documentElement.getAttribute('data-theme') || 'dark';
    var color = theme === 'light' ? '196,154,58' : '201,168,76';

    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + color + ',' + p.a + ')';
      ctx.fill();
    });

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + color + ',' + (0.06 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();

  var obs = new MutationObserver(function() {
    canvas.height = document.documentElement.scrollHeight;
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();

function gsapInit() {
  if (typeof gsap === 'undefined') return;

  var tl = gsap.timeline({ delay: 0 });

  var heroContent = document.querySelector('.hero-content');
  var heroImg = document.querySelector('.hero-img-wrap');
  if (heroContent) tl.from(heroContent, { opacity: 0, y: 25, duration: 0.5, ease: 'power2.out' }, 0);
  if (heroImg) tl.from(heroImg, { opacity: 0, x: 25, duration: 0.5, ease: 'power2.out' }, 0.1);

  tl.from('.stat-chip', { opacity: 0, y: 15, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, 0.25);
  tl.from('.card', { opacity: 0, y: 15, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 0.35);

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.reveal').forEach(function(el) {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 87%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
    ScrollTrigger.refresh();
  }
}

if (typeof gsap !== 'undefined') {
  if (document.readyState === 'complete') {
    gsapInit();
  } else {
    window.addEventListener('load', gsapInit);
  }
}

function typeWriter(el, text, speed, cb) {
  if (!el) return;
  speed = speed || 70;
  var i = 0;
  el.textContent = '';
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed + Math.random() * 40);
    } else if (cb) {
      cb();
    }
  }
  type();
}

var heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  var nameParts = heroTitle.querySelectorAll('.type-part');
  if (nameParts.length) {
    heroTitle.innerHTML = '';
    var cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    heroTitle.appendChild(cursor);

    var texts = ['Denmark', 'De Leon'];
    var current = 0;
    function typeNext() {
      if (current >= texts.length) {
        cursor.style.display = 'inline-block';
        return;
      }
      var span = document.createElement('span');
      if (current === 1) {
        var em = document.createElement('em');
        em.textContent = texts[current];
        span.appendChild(em);
      } else {
        span.textContent = texts[current];
      }
      heroTitle.insertBefore(span, cursor);
      if (current === 0) {
        heroTitle.insertBefore(document.createTextNode('\n'), cursor);
      }

      var txt = texts[current];
      var el = span;
      var i = 0;
      el.textContent = '';
      function type() {
        if (i < txt.length) {
          el.textContent += txt.charAt(i);
          i++;
          setTimeout(type, 60 + Math.random() * 40);
        } else {
          current++;
          setTimeout(typeNext, 50);
        }
      }
      type();
    }
    setTimeout(typeNext, 50);
  }
}

function fireConfetti(origin) {
  origin = origin || { x: 0.5, y: 0.5 };
  var canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
  }
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var pieces = [];
  var colors = ['#c9a84c', '#e2c06a', '#8a2b4e', '#b8405e', '#4a7fc1', '#66bb6a', '#fff'];
  var duration = 2000;
  var start = Date.now();

  for (var i = 0; i < 120; i++) {
    pieces.push({
      x: canvas.width * origin.x + (Math.random() - 0.5) * 100,
      y: canvas.height * origin.y + (Math.random() - 0.5) * 100,
      w: Math.random() * 8 + 4,
      h: Math.random() * 5 + 3,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -8 - 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      gravity: 0.15 + Math.random() * 0.1,
      opacity: 1
    });
  }

  function anim() {
    var elapsed = Date.now() - start;
    if (elapsed > duration) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(function(p) {
      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.rot += p.rotV;
      p.opacity = Math.max(0, 1 - elapsed / duration);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    requestAnimationFrame(anim);
  }
  canvas.style.display = 'block';
  anim();
}

var verseSlot = document.querySelector('.verse-of-day');
if (verseSlot) {
  var verseTextEl = verseSlot.querySelector('.verse-text');
  var verseRefEl = verseSlot.querySelector('.verse-ref');

  function fetchLiveVerse() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://bible-api.com/?random=verse', true);
    xhr.timeout = 5000;
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          if (data && data.text && data.reference) {
            verseTextEl.textContent = '"' + data.text.replace(/\s+/g, ' ').trim() + '"';
            verseRefEl.textContent = data.reference;
            var status = verseSlot.querySelector('.verse-status');
            if (status) status.textContent = '📡 Live from API';
            return;
          }
        } catch(e) {}
      }
      fallbackVerse();
    };
    xhr.onerror = fallbackVerse;
    xhr.ontimeout = fallbackVerse;
    xhr.send();
  }

  var fallbackVerses = [
    { text: '"For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life."', ref: 'John 3:16' },
    { text: '"I can do all things through Christ who strengthens me."', ref: 'Philippians 4:13' },
    { text: '"The LORD will fight for you; you need only to be still."', ref: 'Exodus 14:14' },
    { text: '"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."', ref: 'Jeremiah 29:11' },
    { text: '"The Lord is my shepherd; I shall not want."', ref: 'Psalm 23:1' },
    { text: '"Trust in the Lord with all your heart and lean not on your own understanding."', ref: 'Proverbs 3:5' },
    { text: '"We love because He first loved us."', ref: '1 John 4:19' },
    { text: '"Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid."', ref: 'John 14:27' },
    { text: '"The Lord is my light and my salvation — whom shall I fear?"', ref: 'Psalm 27:1' },
    { text: '"Come to me, all you who are weary and burdened, and I will give you rest."', ref: 'Matthew 11:28' }
  ];

  function fallbackVerse() {
    var v = fallbackVerses[Math.floor(Math.random() * fallbackVerses.length)];
    verseTextEl.textContent = v.text;
    verseRefEl.textContent = v.ref;
  }

  fetchLiveVerse();

  var shuffleBtn = verseSlot.querySelector('.verse-shuffle');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', function() {
      fireConfetti({ x: 0.5, y: 0.3 });
      fetchLiveVerse();
    });
  }
}

var ghContainer = document.querySelector('.github-stats');
if (ghContainer) {
  (function() {
    var username = ghContainer.getAttribute('data-user') || 'denmark0901';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/users/' + username, true);
    xhr.timeout = 5000;
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var items = ghContainer.querySelectorAll('.github-stat');
          if (items.length >= 3) {
            items[0].querySelector('.num').textContent = data.public_repos || '—';
            items[1].querySelector('.num').textContent = data.followers || '—';
            items[2].querySelector('.num').textContent = data.public_repos > 0 ? (data.public_repos * 3 + '') : '—';
          }
        } catch(e) {}
      }
    };
    xhr.send();
  })();
}

var backBtn = document.createElement('button');
backBtn.className = 'back-to-top';
backBtn.innerHTML = '&#8593;';
backBtn.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backBtn);

function checkScroll() {
  if (window.scrollY > 400) {
    backBtn.classList.add('visible');
  } else {
    backBtn.classList.remove('visible');
  }
}
window.addEventListener('scroll', checkScroll);
checkScroll();

backBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

var transOverlay = document.createElement('div');
transOverlay.className = 'page-transition';
document.body.appendChild(transOverlay);

document.addEventListener('click', function(e) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  var link = e.target.closest('a');
  if (link && link.hostname === window.location.hostname && !link.hasAttribute('target') && !link.getAttribute('href').startsWith('#') && !link.getAttribute('href').startsWith('tel:') && !link.getAttribute('href').startsWith('mailto:') && link.getAttribute('href') !== '') {
    e.preventDefault();
    var href = link.href;
    if (typeof gsap !== 'undefined') {
      gsap.to(transOverlay, { opacity: 1, duration: 0.2, ease: 'power2.in', onComplete: function() { window.location.href = href; } });
    } else {
      transOverlay.classList.add('active');
      setTimeout(function() { window.location.href = href; }, 200);
    }
  }
});

window.addEventListener('pageshow', function() {
  if (typeof gsap !== 'undefined') {
    gsap.set(transOverlay, { opacity: 0 });
  } else {
    transOverlay.classList.remove('active');
  }
});

var lbOverlay = document.createElement('div');
lbOverlay.className = 'lightbox';
lbOverlay.innerHTML = '<button class="lb-close">&times;</button><img src="" alt="">';
document.body.appendChild(lbOverlay);

var lbImg = lbOverlay.querySelector('img');
var lbClose = lbOverlay.querySelector('.lb-close');

document.addEventListener('click', function(e) {
  var trigger = e.target.closest('[data-lightbox]');
  if (trigger) {
    e.preventDefault();
    var src = trigger.getAttribute('data-lightbox');
    if (!src) src = trigger.getAttribute('href');
    if (!src) src = trigger.querySelector('img') && trigger.querySelector('img').src;
    if (src) {
      lbImg.src = src;
      lbOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
});

function closeLightbox() {
  lbOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lbOverlay.addEventListener('click', function(e) {
  if (e.target === lbOverlay) closeLightbox();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});

document.querySelectorAll('.filter-bar').forEach(function(bar) {
  var items = document.querySelectorAll('.filter-item');

  bar.addEventListener('click', function(e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;

    bar.querySelectorAll('.filter-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    var filter = btn.getAttribute('data-filter');

    items.forEach(function(item) {
      if (filter === 'all') {
        item.classList.remove('hidden');
      } else {
        var cats = item.getAttribute('data-category');
        if (cats && cats.split(' ').indexOf(filter) !== -1) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      }
    });
  });
});

})();
