// ===== Lead form → WhatsApp =====
const leadForm = document.getElementById('leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('leadName').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    const service = document.getElementById('leadService').value;
    const msg = `Hello, my name is ${name} (${phone}). I'm interested in ${service}. Please call me back.`;
    window.open(`https://wa.me/919255820000?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// ===== Footer year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Animated counters =====
function animateCounters() {
  document.querySelectorAll('.readout-num').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
      current += step;
      if (current >= target) { el.textContent = target; return; }
      el.textContent = current;
      requestAnimationFrame(tick);
    };
    tick();
  });
}
animateCounters();

// ===== Helper: fetch JSON safely (path-aware for subfolders like /blog/) =====
const DATA_BASE = window.location.pathname.includes('/blog/') ? '../' : '';
async function loadJSON(path) {
  try {
    const res = await fetch(DATA_BASE + path);
    if (!res.ok) throw new Error('not found');
    return await res.json();
  } catch (e) {
    console.warn('Could not load', path, e);
    return null;
  }
}

// ===== Services =====
loadJSON('data/services.json').then(items => {
  if (!items) return;
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = items.map(s => `
    <a class="card" href="${s.link}">
      <span class="card-icon">${s.icon || ''}</span>
      <span class="tag">${s.tag}</span>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </a>`).join('');
});

// ===== Plans =====
loadJSON('data/plans.json').then(items => {
  if (!items) return;
  const grid = document.getElementById('plansGrid');
  if (!grid) return;
  grid.innerHTML = items.map(p => `
    <div class="plan-card ${p.featured ? 'featured' : ''}">
      ${p.featured ? '<span class="plan-badge">Most Popular</span>' : ''}
      <div class="plan-speed">${p.speed}<small> ${p.unit}</small></div>
      <div class="plan-price">${p.price}<small>${p.period}</small></div>
      <ul class="plan-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <a href="https://wa.me/919255820000?text=Hello%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(p.name)}%20plan" class="btn btn-primary" style="width:100%;text-align:center" target="_blank" rel="noopener">Choose ${p.name}</a>
    </div>`).join('');
});

// ===== OTT =====
loadJSON('data/ott.json').then(items => {
  if (!items) return;
  (document.getElementById('ottList') || {}).innerHTML = items.map(o => `<li>${o}</li>`).join('');
});

// ===== Gallery =====
loadJSON('data/gallery.json').then(items => {
  if (!items) return;
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = items.map(g => g.src
    ? `<figure><img src="${g.src}" alt="${g.alt}" loading="lazy"></figure>`
    : `<figure>${g.alt} — add photo</figure>`
  ).join('');
  // Simple lightbox on click
  let overlay = document.querySelector('.lightbox-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">×</button><img alt="">';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.classList.remove('open'));
  }
  grid.querySelectorAll('figure img').forEach(img => {
    img.addEventListener('click', () => {
      overlay.querySelector('img').src = img.src;
      overlay.querySelector('img').alt = img.alt;
      overlay.classList.add('open');
    });
  });
});

// ===== Back to top =====
(function(){
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = '↑';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();

// ===== Reviews =====
loadJSON('data/reviews.json').then(items => {
  if (!items) return;
  const grid = document.getElementById('reviewGrid');
  if (!grid) return;
  grid.innerHTML = items.map(r => `
    <div class="review-card">
      <div class="stars">★★★★★</div>
      <p>${r.text}</p>
      <div class="review-name">${r.name} · Google Review</div>
    </div>`).join('');
});

// ===== FAQ =====
loadJSON('data/faq.json').then(items => {
  if (!items) return;
  const list = document.getElementById('faqList');
  if (!list) return;
  list.innerHTML = items.map((f, i) => `
    <div class="faq-item ${i === 0 ? 'open' : ''}">
      <button class="faq-q" aria-expanded="${i === 0 ? 'true' : 'false'}">${f.q}<span class="faq-icon">${i === 0 ? '−' : '+'}</span></button>
      <div class="faq-a">${f.a}</div>
    </div>`).join('');
  list.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      list.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-icon').textContent = '+';
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        item.querySelector('.faq-icon').textContent = '−';
        item.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
      }
    });
  });
  // Inject FAQ schema for Google rich results
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
});

// ===== Postpaid comparison table =====
loadJSON('data/postpaid-plans.json').then(data => {
  if (!data) return;
  const noteEl = document.getElementById('offerNote');
  if (noteEl) noteEl.textContent = data.offer;
  const table = document.getElementById('postpaidTable');
  if (!table) return;
  const headHtml = `<tr><th>Plan Details</th>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
  const bodyHtml = data.rows.map(r => `
    <tr class="${r.label === 'Monthly Rental' ? 'rent-row' : ''}">
      <td>${r.label}</td>${r.values.map(v => `<td>${v}</td>`).join('')}
    </tr>`).join('');
  table.innerHTML = headHtml + bodyHtml;
});

// ===== Social links + business name in footer/header =====
loadJSON('data/settings.json').then(s => {
  if (!s) return;
  if (s.businessNameHtml) {
    document.querySelectorAll('.js-logo').forEach(el => { el.innerHTML = s.businessNameHtml; });
  }
  const row = document.getElementById('socialRow');
  const links = {
    facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn',
    x: 'X', pinterest: 'Pinterest', tumblr: 'Tumblr', gbp: 'Google Reviews',
    apple: 'Apple Maps', sulekha: 'Sulekha'
  };
  row.innerHTML = Object.entries(links)
    .filter(([key]) => s.social[key])
    .map(([key, label]) => `<a href="${s.social[key]}" target="_blank" rel="noopener">${label}</a>`)
    .join('') || '<span style="font-size:.8rem;color:#8B8894">Add links in data/settings.json</span>';

  // Visible icon row on homepage (near hero)
  const iconRow = document.getElementById('socialIconRow');
  if (iconRow) {
    const icons = {
      gbp: '★', facebook: 'f', instagram: '📷', x: '𝕏',
      linkedin: 'in', pinterest: 'P', tumblr: 't'
    };
    const iconLabels = { gbp: 'Google Reviews', facebook: 'Facebook', instagram: 'Instagram', x: 'X', linkedin: 'LinkedIn', pinterest: 'Pinterest', tumblr: 'Tumblr' };
    iconRow.innerHTML = Object.entries(icons)
      .filter(([key]) => s.social[key])
      .map(([key, glyph]) => `<a href="${s.social[key]}" target="_blank" rel="noopener" class="social-icon social-icon-${key}" aria-label="${iconLabels[key]}" title="${iconLabels[key]}">${glyph}</a>`)
      .join('');
  }
});
