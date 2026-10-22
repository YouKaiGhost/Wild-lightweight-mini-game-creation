(function () {
  document.documentElement.classList.add('js');

  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (navLinks.length === 0 || !('IntersectionObserver' in window)) {
    return;
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach((section) => observer.observe(section));
})();
