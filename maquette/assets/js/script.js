document.addEventListener("DOMContentLoaded", () => {

    /* ---------- en-tête : ombre au défilement ---------- */

    const header = document.querySelector(".header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();


    /* ---------- menu mobile ---------- */

    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");

    function closeNav() {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
        const open = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });


    /* ---------- filtre des terres ---------- */

    const filters = document.querySelectorAll(".filter");
    const terres = document.querySelectorAll(".terre[data-type]");

    filters.forEach((btn) => {
        btn.addEventListener("click", () => {
            filters.forEach((b) => {
                b.classList.toggle("is-active", b === btn);
                b.setAttribute("aria-pressed", b === btn ? "true" : "false");
            });
            const f = btn.dataset.filter;
            terres.forEach((t) => { t.hidden = f !== "all" && t.dataset.type !== f; });
        });
    });


    /* ---------- coupe de sol : une couche ouverte à la fois ---------- */

    const layers = document.querySelectorAll(".layer");

    layers.forEach((layer) => {
        layer.addEventListener("click", () => {
            const text = document.getElementById(layer.getAttribute("aria-controls"));
            const open = !text.classList.contains("is-open");
            layers.forEach((l) => {
                l.classList.remove("is-active");
                l.setAttribute("aria-expanded", "false");
                document.getElementById(l.getAttribute("aria-controls")).classList.remove("is-open");
            });
            if (open) {
                layer.classList.add("is-active");
                layer.setAttribute("aria-expanded", "true");
                text.classList.add("is-open");
            }
        });
    });


    /* ---------- formulaire (maquette : pas d'envoi réel) ---------- */

    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            form.querySelector(".form-ok").hidden = false;
            form.reset();
        });
    }


    /* ---------- apparitions au défilement ---------- */

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(
        ".arch, .section-head > *, .terre, .soil > div, .family > div, .figures div, .shop, .visit > div, .page-head > *, .form-wrap > *"
    ).forEach((el, i) => {
        if (el.closest(".opening")) return; // l'ouverture s'affiche tout de suite
        el.classList.add("reveal");
        if (el.classList.contains("terre")) el.style.transitionDelay = `${(i % 4) * 90}ms`;
        io.observe(el);
    });


    /* ---------- FR / EN ----------
       Chaque élément traduit porte son anglais dans data-en ;
       le français d'origine est gardé pour revenir en arrière. */

    const translatable = document.querySelectorAll("[data-en]");
    translatable.forEach((el) => { el.dataset.fr = el.innerHTML; });

    function setLang(lang) {
        translatable.forEach((el) => { el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.fr; });
        document.documentElement.lang = lang;
        document.querySelectorAll(".lang-switch button").forEach((b) => {
            b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
        });
        try { localStorage.setItem("lang", lang); } catch (e) { /* stockage bloqué */ }
    }

    document.querySelectorAll(".lang-switch button").forEach((b) => {
        b.addEventListener("click", () => setLang(b.dataset.lang));
    });

    let saved = "fr";
    try { saved = localStorage.getItem("lang") || "fr"; } catch (e) { /* stockage bloqué */ }
    if (saved === "en") setLang("en");


    /* ---------- année du pied de page, toujours à jour ---------- */

    document.querySelectorAll(".year").forEach((el) => { el.textContent = new Date().getFullYear(); });

});
