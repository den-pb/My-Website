(function() {

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observeReveal() {
  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });
}
observeReveal();

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
    transOverlay.classList.add('active');
    setTimeout(function() {
      window.location.href = href;
    }, 250);
  }
});

window.addEventListener('pageshow', function() {
  transOverlay.classList.remove('active');
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

if (window.location.pathname.indexOf('faith') !== -1) {
  var verses = [
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

  var verseSlot = document.querySelector('.verse-of-day');
  if (verseSlot) {
    var v = verses[Math.floor(Math.random() * verses.length)];
    verseSlot.querySelector('.verse-text').textContent = v.text;
    verseSlot.querySelector('.verse-ref').textContent = v.ref;
  }

  var shuffleBtn = document.querySelector('.verse-shuffle');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', function() {
      var v = verses[Math.floor(Math.random() * verses.length)];
      var slot = document.querySelector('.verse-of-day');
      if (slot) {
        slot.querySelector('.verse-text').textContent = v.text;
        slot.querySelector('.verse-ref').textContent = v.ref;
      }
    });
  }
}

})();
