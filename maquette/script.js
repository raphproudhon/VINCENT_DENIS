// Année du pied de page, toujours à jour
document.getElementById('year').textContent = new Date().getFullYear();

// Menu mobile
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', false);
  })
);

// Filtre des vins
const filters = document.querySelectorAll('.filter');
const wines = document.querySelectorAll('.wine');
filters.forEach((btn) =>
  btn.addEventListener('click', () => {
    filters.forEach((b) => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-selected', b === btn);
    });
    const f = btn.dataset.filter;
    wines.forEach((w) => (w.hidden = f !== 'all' && w.dataset.type !== f));
  })
);

// Apparition douce au défilement
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
document
  .querySelectorAll('.section-head, .split > *, .card, .wine, .shop-band, .contact > *')
  .forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
