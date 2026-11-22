'use strict';

(function () {
  const WHATSAPP_NUMBER = '6281234567890';
  const PRICES = {
    '1L': 78000,
    '250ml': 22000,
  };

  const quantities = {
    '1L': 1,
    '250ml': 0,
  };

  function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  // 1. Dynamic Canonical & OpenGraph URL
  const currentUrl = window.location.origin + window.location.pathname;
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.setAttribute('href', currentUrl);
  }
  const ogUrlEl = document.querySelector('meta[property="og:url"]');
  if (ogUrlEl) {
    ogUrlEl.setAttribute('content', currentUrl);
  }

  // 2. Resilient Image Error Fallbacks
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      const key = img.getAttribute('data-fallback');
      img.classList.add('is-hidden');
      const fallbackBox = document.querySelector('[data-fallback-box="' + key + '"]');
      if (fallbackBox) {
        fallbackBox.classList.remove('is-hidden');
      }
    });
  });

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-navigation');
  const iconOpen = document.getElementById('icon-menu-open');
  const iconClose = document.getElementById('icon-menu-close');

  function setMobileMenu(open) {
    if (!mobileToggle || !mobileNav) return;
    mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileToggle.setAttribute(
      'aria-label',
      open ? 'Tutup menu navigasi' : 'Buka menu navigasi',
    );
    mobileNav.classList.toggle('is-hidden', !open);
    if (iconOpen && iconClose) {
      iconOpen.classList.toggle('is-hidden', open);
      iconClose.classList.toggle('is-hidden', !open);
    }
  }

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      setMobileMenu(!isExpanded);
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMobileMenu(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setMobileMenu(false);
      }
    });
  }

  // 4. Interactive Product Gallery Switcher
  const galleryMainImg = document.getElementById('gallery-main-img');
  const galleryFallback = document.querySelector('[data-fallback-box="gallery"]');
  const galleryKicker = document.getElementById('gallery-kicker');
  const galleryTitle = document.getElementById('gallery-title');
  const galleryDesc = document.getElementById('gallery-desc');
  const thumbButtons = document.querySelectorAll('.thumb-btn');

  thumbButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!galleryMainImg) return;
      const nextSrc = btn.getAttribute('data-src') || '';
      const nextAlt = btn.getAttribute('data-alt') || '';
      const nextKicker = btn.getAttribute('data-kicker') || '';
      const nextTitle = btn.getAttribute('data-title') || '';
      const nextDesc = btn.getAttribute('data-desc') || '';

      thumbButtons.forEach(function (item) {
        item.classList.remove('is-active');
        item.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      if (galleryFallback) {
        galleryFallback.classList.add('is-hidden');
      }
      galleryMainImg.classList.remove('is-hidden');
      galleryMainImg.classList.add('is-fading');

      window.setTimeout(function () {
        galleryMainImg.setAttribute('src', nextSrc);
        galleryMainImg.setAttribute('alt', nextAlt);
        if (galleryKicker) galleryKicker.textContent = nextKicker;
        if (galleryTitle) galleryTitle.textContent = nextTitle;
        if (galleryDesc) galleryDesc.textContent = nextDesc;
        galleryMainImg.classList.remove('is-fading');
      }, 120);
    });
  });

  // 5. Quantity Steppers, Live Totals & WhatsApp Order Builder
  const qty1LEl = document.getElementById('qty-1L');
  const qty250El = document.getElementById('qty-250ml');
  const sub1LEl = document.getElementById('subtotal-1L');
  const sub250El = document.getElementById('subtotal-250ml');
  const summaryCountEl = document.getElementById('summary-count');
  const summaryTotalEl = document.getElementById('summary-total');
  const customerNameInput = document.getElementById('order-customer-name');
  const orderNoteInput = document.getElementById('order-note');
  const whatsappLink = document.getElementById('whatsapp-order-link');
  const whatsappBtnText = document.getElementById('whatsapp-btn-text');
  const copyOrderBtn = document.getElementById('copy-order-btn');
  const copyOrderLabel = document.getElementById('copy-order-label');

  function buildOrderMessage() {
    const lines = ['Halo Mylattegram! Saya ingin memesan Kopi Susu Bapak:', ''];

    if (quantities['1L'] > 0) {
      lines.push(
        '• Kemasan 1 Liter: ' +
          quantities['1L'] +
          ' botol (' +
          formatRupiah(quantities['1L'] * PRICES['1L']) +
          ')',
      );
    }
    if (quantities['250ml'] > 0) {
      lines.push(
        '• Kemasan 250 ml: ' +
          quantities['250ml'] +
          ' botol (' +
          formatRupiah(quantities['250ml'] * PRICES['250ml']) +
          ')',
      );
    }

    const totalItems = quantities['1L'] + quantities['250ml'];
    const totalAmount = quantities['1L'] * PRICES['1L'] + quantities['250ml'] * PRICES['250ml'];

    lines.push('');
    lines.push('Total Pesanan: ' + totalItems + ' botol — ' + formatRupiah(totalAmount));

    const customerName = customerNameInput ? customerNameInput.value.trim() : '';
    const orderNote = orderNoteInput ? orderNoteInput.value.trim() : '';

    if (customerName) {
      lines.push('Nama Pemesan: ' + customerName);
    }
    if (orderNote) {
      lines.push('Catatan: ' + orderNote);
    }

    lines.push('');
    lines.push('Mohon informasi ketersediaan dan ongkos kirimnya. Terima kasih.');

    return lines.join('\n');
  }

  function renderOrderState() {
    const sub1L = quantities['1L'] * PRICES['1L'];
    const sub250 = quantities['250ml'] * PRICES['250ml'];
    const totalItems = quantities['1L'] + quantities['250ml'];
    const totalAmount = sub1L + sub250;

    if (qty1LEl) qty1LEl.textContent = String(quantities['1L']);
    if (qty250El) qty250El.textContent = String(quantities['250ml']);
    if (sub1LEl) sub1LEl.textContent = formatRupiah(sub1L);
    if (sub250El) sub250El.textContent = formatRupiah(sub250);
    if (summaryCountEl) summaryCountEl.textContent = totalItems + ' botol terpilih';
    if (summaryTotalEl) summaryTotalEl.textContent = formatRupiah(totalAmount);
    if (whatsappBtnText) {
      whatsappBtnText.textContent = 'Pesan via WhatsApp (' + formatRupiah(totalAmount) + ')';
    }

    if (whatsappLink) {
      const msg = buildOrderMessage();
      whatsappLink.setAttribute(
        'href',
        'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg),
      );
    }
  }

  document.querySelectorAll('.stepper-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const variant = btn.getAttribute('data-variant');
      const delta = Number(btn.getAttribute('data-delta') || '0');
      if (variant !== '1L' && variant !== '250ml') return;

      const nextVal = Math.max(0, quantities[variant] + delta);
      const otherVariant = variant === '1L' ? '250ml' : '1L';
      if (nextVal === 0 && quantities[otherVariant] === 0) {
        return;
      }

      quantities[variant] = nextVal;
      renderOrderState();
    });
  });

  if (customerNameInput) {
    customerNameInput.addEventListener('input', renderOrderState);
  }
  if (orderNoteInput) {
    orderNoteInput.addEventListener('input', renderOrderState);
  }

  if (copyOrderBtn && copyOrderLabel) {
    copyOrderBtn.addEventListener('click', function () {
      const text = buildOrderMessage();
      if (!navigator.clipboard) return;
      navigator.clipboard
        .writeText(text)
        .then(function () {
          copyOrderLabel.textContent = 'Format Tersalin';
          window.setTimeout(function () {
            copyOrderLabel.textContent = 'Salin Pesanan';
          }, 2000);
        })
        .catch(function () {
          copyOrderLabel.textContent = 'Salin Pesanan';
        });
    });
  }

  renderOrderState();

  // 6. Serving Mode Tabs (Dingin / Hangat)
  const servingTabs = document.querySelectorAll('[data-serving-tab]');
  const coldPanel = document.getElementById('panel-cold');
  const warmPanel = document.getElementById('panel-warm');

  servingTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const mode = tab.getAttribute('data-serving-tab');
      servingTabs.forEach(function (t) {
        const isMatch = t === tab;
        t.classList.toggle('is-active', isMatch);
        t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      if (coldPanel && warmPanel) {
        coldPanel.classList.toggle('is-hidden', mode !== 'cold');
        warmPanel.classList.toggle('is-hidden', mode !== 'warm');
      }
    });
  });

  // 7. Accessible FAQ Accordion
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const isCurrentlyOpen = trigger.getAttribute('aria-expanded') === 'true';
      const targetPanelId = trigger.getAttribute('aria-controls');

      faqTriggers.forEach(function (otherTrigger) {
        const panelId = otherTrigger.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        otherTrigger.setAttribute('aria-expanded', 'false');
        if (panel) {
          panel.classList.add('is-hidden');
        }
      });

      if (!isCurrentlyOpen && targetPanelId) {
        const targetPanel = document.getElementById(targetPanelId);
        trigger.setAttribute('aria-expanded', 'true');
        if (targetPanel) {
          targetPanel.classList.remove('is-hidden');
        }
      }
    });
  });
})();
