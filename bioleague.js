/* ============================================================
   BioLeague site JS (navbar + reveal + stats + PDF viewer)
   ============================================================ */

(function () {
  /* ---------------- Theme toggle (no external file) ---------------- */
  const STORAGE_KEY = 'bioleague-theme';
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  const btnMobile = document.getElementById('themeToggleMobile');

  const moonPath =
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  const sunPath =
    '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';

  function setIcons(isDark) {
    const icon = document.getElementById('themeIcon');
    const iconM = document.getElementById('themeIconMobile');
    if (icon) icon.innerHTML = isDark ? sunPath : moonPath;
    if (iconM) iconM.innerHTML = isDark ? sunPath : moonPath;
  }

  function setLabels(isDark) {
    const label = document.getElementById('themeLabel');
    const labelM = document.getElementById('themeLabelMobile');
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
    if (labelM) labelM.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }

  function applyTheme(isDark) {
    body.classList.toggle('dark-mode', isDark);
    setIcons(isDark);
    setLabels(isDark);
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      // ignore
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  applyTheme(getInitialTheme());

  function toggleTheme() {
    applyTheme(!body.classList.contains('dark-mode'));
  }

  if (btn) btn.addEventListener('click', toggleTheme);
  if (btnMobile) btnMobile.addEventListener('click', toggleTheme);

  /* ---------------- Navbar: mobile menu toggle ---------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');

  if (navbar && hamburger) {
    hamburger.addEventListener('click', function () {
      navbar.classList.toggle('menu-open');
    });

    document.querySelectorAll('.navbar__mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navbar.classList.remove('menu-open');
      });
    });

    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals && reveals.length) {
    const revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const delay = parseInt(entry.target.dataset.delay, 10) || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          revealObs.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    reveals.forEach(function (el) {
      revealObs.observe(el);
    });
  }

  /* ---------------- Stat counter ---------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers && statNumbers.length) {
    const statObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          statObs.unobserve(entry.target);

          const target = parseInt(entry.target.dataset.target, 10);
          if (!Number.isFinite(target)) return;

          const increment = target / 30;
          let current = 0;

          const interval = setInterval(function () {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            entry.target.textContent = Math.floor(current);
          }, 50);
        });
      },
      { threshold: 0.2 }
    );

    statNumbers.forEach(function (el) {
      statObs.observe(el);
    });
  }

  /* ---------------- PDF viewer modal ---------------- */
  const pdfModal = document.getElementById('pdfModal');
  const pdfFrame = document.getElementById('pdfFrame');
  const pdfModalTitle = document.getElementById('pdfModalTitle');
  const pdfModalClose = document.getElementById('pdfModalClose');

  if (pdfModal && pdfFrame) {
    function openPdf(url, title) {
      if (pdfModalTitle && title) pdfModalTitle.textContent = title;
      pdfFrame.src = url;
      pdfModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      pdfModal.setAttribute('aria-hidden', 'false');
    }

    function closePdf() {
      pdfModal.style.display = 'none';
      pdfFrame.src = 'about:blank';
      document.body.style.overflow = '';
      pdfModal.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('[data-pdf-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const url = btn.getAttribute('data-pdf-open');
        const title = btn.getAttribute('data-pdf-title') || 'PDF Viewer';
        if (url) openPdf(url, title);
      });
    });

    if (pdfModalClose) {
      pdfModalClose.addEventListener('click', closePdf);
    }

    pdfModal.addEventListener('click', function (e) {
      if (e.target === pdfModal) closePdf();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePdf();
    });
  }
})();

