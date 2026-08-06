// ===== Helper: fetch JSON safely (path-aware for subfolders like /blog/) =====
const DATA_BASE = window.location.pathname.includes('/blog/') ? '../' : '';
async function loadJSON(path) {
  const fullPath = DATA_BASE + path;
  try {
    const res = await fetch(fullPath);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    console.log('[loadJSON] OK:', fullPath);
    return await res.json();
  } catch (e) {
    console.error('[loadJSON] FAILED:', fullPath, '—', e.message);
    return null;
  }
}

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

// ===== OTT brand colors =====
const OTT_COLORS = {
  "Netflix": "#E50914",
  "Amazon Prime Video": "#00A8E1",
  "Disney+ Hotstar": "#0F142D",
  "Apple TV": "#1C1C1E",
  "Airtel Xstream Play": "#ED1C24"
};

function renderPlanCard(p) {
  const ottHtml = p.ottBadges ? `<div class="ott-badges">${p.ottBadges.map(o =>
    `<span class="ott-badge" style="background:${OTT_COLORS[o] || '#333'}">${o}</span>`).join('')}</div>` : '';
  const msg = `Hi, I am interested in booking the ${p.price}${p.period} ${p.speed} ${p.unit} Broadband Plan`;
  return `
    <div class="plan-card ${p.badge ? 'featured' : ''}">
      ${p.badge ? `<span class="plan-badge">${p.badge}</span>` : ''}
      <div class="plan-speed">${p.speed}<small> ${p.unit}</small></div>
      <div class="plan-price">${p.price}<small>${p.period}</small></div>
      <ul class="plan-features">${p.features.map(f => `<li>✔️ ${f}</li>`).join('')}</ul>
      ${ottHtml}
      <a href="https://wa.me/919255820000?text=${encodeURIComponent(msg)}" class="btn btn-primary" style="width:100%;text-align:center;display:block" target="_blank" rel="noopener">Book This Plan</a>
    </div>`;
}

function loadPlansInto(containerId, dataFile) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  loadJSON(dataFile).then(data => {
    const items = data && data.items;
    if (!items) return;
    grid.innerHTML = items.map(renderPlanCard).join('');
  });
}

// Fiber/AirFiber tab toggle (homepage + plans.html)
const tabFiber = document.getElementById('tabFiber');
const tabAirFiber = document.getElementById('tabAirFiber');
if (tabFiber && tabAirFiber) {
  loadPlansInto('plansGridFiber', 'data/fiber-plans.json');
  loadPlansInto('plansGridAirFiber', 'data/airfiber-plans.json');
  tabFiber.addEventListener('click', () => {
    tabFiber.classList.add('active'); tabAirFiber.classList.remove('active');
    document.getElementById('plansGridFiber').style.display = '';
    document.getElementById('plansGridAirFiber').style.display = 'none';
    document.getElementById('airfiberNote').style.display = 'none';
  });
  tabAirFiber.addEventListener('click', () => {
    tabAirFiber.classList.add('active'); tabFiber.classList.remove('active');
    document.getElementById('plansGridAirFiber').style.display = '';
    document.getElementById('plansGridFiber').style.display = 'none';
    document.getElementById('airfiberNote').style.display = '';
  });
}
// Single-type pages (fiber.html / airfiber.html)
loadPlansInto('plansGridOnlyFiber', 'data/fiber-plans.json');
loadPlansInto('plansGridOnlyAirFiber', 'data/airfiber-plans.json');

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

// ===== Services =====
loadJSON('data/services.json').then(data => {
  const items = data && data.items;
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


// ===== OTT =====
loadJSON('data/ott.json').then(items => {
  if (!items) return;
  (document.getElementById('ottList') || {}).innerHTML = items.map(o => `<li>${o}</li>`).join('');
});

// ===== Gallery =====
loadJSON('data/gallery.json').then(data => {
  const items = data && data.items;
  if (!items) return;
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = items.map(g => `
    <figure>
      <img src="${g.image}" alt="${g.title}" loading="lazy" onerror="this.closest('figure').style.display='none'">
      <figcaption>${g.description || ''}</figcaption>
    </figure>`
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
loadJSON('data/reviews.json').then(data => {
  const items = data && data.items;
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
loadJSON('data/faq.json').then(data => {
  const items = data && data.items;
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
