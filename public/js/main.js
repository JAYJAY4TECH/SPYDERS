// ============================================================
// SPYDERS CLOTHER — Shared UI Behavior
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // ---- Fade-in body ----
  requestAnimationFrame(() => document.body.classList.add('loaded'));

  // ---- Year ----
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---- Sticky nav ----
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    header.classList.toggle('transparent', !scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    }));
  }

  // ---- Search overlay ----
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');

  const openSearch = () => {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('hidden');
    searchOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
    searchOverlay.querySelector('input')?.focus();
  };
  const closeSearch = () => {
    if (!searchOverlay) return;
    searchOverlay.classList.add('hidden');
    searchOverlay.classList.remove('flex');
    document.body.style.overflow = '';
  };

  searchBtn?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  // ---- Scroll reveals ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---- Newsletter ----
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const original = input.placeholder;
    input.value = '';
    input.placeholder = '✓ Subscribed';
    setTimeout(() => { input.placeholder = original; }, 3500);
  });
});
