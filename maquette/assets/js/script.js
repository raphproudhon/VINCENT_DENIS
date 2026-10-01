document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================= */

    const agePopup = document.getElementById("agePopup");
    const yesAge = document.getElementById("yesAge");
    const noAge = document.getElementById("noAge");

    const loader = document.querySelector(".loader");
    const header = document.querySelector(".header");
    const hero = document.querySelector(".hero, .page-hero");


    /* =========================
       MÉMOIRE DE LA VÉRIFICATION D'ÂGE
       (localStorage, avec repli cookie : certains navigateurs
       bloquent l'un ou l'autre en navigation privée)
    ========================= */

    function setAgeVerified() {
        try { localStorage.setItem("ageVerified", "true"); } catch (e) { /* stockage bloqué */ }
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        document.cookie = "ageVerified=true; expires=" + date.toUTCString() + "; path=/";
    }

    function isAgeVerified() {
        try { if (localStorage.getItem("ageVerified") === "true") return true; } catch (e) { /* stockage bloqué */ }
        return document.cookie.split("; ").includes("ageVerified=true");
    }


    /* =========================
       LOADER
    ========================= */

    function hideLoader() {
        if (loader) loader.classList.add("hide");
    }

    function showLoaderThenHide() {
        if (!loader) return;
        loader.classList.remove("hide");
        setTimeout(hideLoader, 1500);
    }


    /* =========================
       VÉRIFICATION D'ÂGE
       Le focus reste piégé dans la fenêtre tant qu'elle est ouverte.
    ========================= */

    const FOCUSABLES = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let libererFocus = null;

    function piegerFocus(conteneur) {
        const cibles = () => Array.from(conteneur.querySelectorAll(FOCUSABLES))
            .filter((el) => !el.disabled && el.offsetParent !== null);

        function surTouche(e) {
            if (e.key !== "Tab") return;
            const liste = cibles();
            if (!liste.length) return;
            const premier = liste[0];
            const dernier = liste[liste.length - 1];
            if (!conteneur.contains(document.activeElement)) {
                e.preventDefault();
                premier.focus();
                return;
            }
            if (e.shiftKey && document.activeElement === premier) {
                e.preventDefault();
                dernier.focus();
            } else if (!e.shiftKey && document.activeElement === dernier) {
                e.preventDefault();
                premier.focus();
            }
        }

        document.addEventListener("keydown", surTouche, true);
        const premier = cibles()[0];
        if (premier) premier.focus();
        return () => document.removeEventListener("keydown", surTouche, true);
    }

    function unlockSite() {
        document.body.classList.remove("age-lock");
        if (agePopup) {
            agePopup.classList.add("hide");
            agePopup.setAttribute("aria-hidden", "true");
        }
        if (libererFocus) { libererFocus(); libererFocus = null; }
    }

    if (agePopup && !isAgeVerified()) {
        document.body.classList.add("age-lock");
        hideLoader();
        libererFocus = piegerFocus(agePopup);

        yesAge.addEventListener("click", () => {
            setAgeVerified();
            unlockSite();
            showLoaderThenHide();
        });
        noAge.addEventListener("click", () => {
            window.location.href = "https://www.google.com";
        });
    } else {
        // visiteur déjà vérifié : pas de popup, juste l'animation du loader
        unlockSite();
        if (agePopup) agePopup.style.display = "none";
        showLoaderThenHide();
    }


    /* =========================
       HEADER + PARALLAX
       (un seul listener scroll, throttlé via rAF)
    ========================= */

    let ticking = false;

    function onScroll() {
        const scrollY = window.scrollY;
        if (header) header.classList.toggle("scrolled", scrollY > 80);
        if (hero) hero.style.backgroundPositionY = `calc(50% + ${scrollY * 0.45}px)`;
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    onScroll();


    /* =========================
       FORMULAIRE DE CONTACT
       -> Pas de backend pour la maquette : on affiche une confirmation.
          À relier à la boîte mail du domaine (Formspree, etc.).
    ========================= */

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            contactForm.querySelector(".form-ok").hidden = false;
            contactForm.reset();
        });
    }


    /* =========================
       FILTRE DES CUVÉES
    ========================= */

    const filters = document.querySelectorAll(".filter");
    const wines = document.querySelectorAll(".card[data-type]");

    filters.forEach((btn) => {
        btn.addEventListener("click", () => {
            filters.forEach((b) => {
                b.classList.toggle("is-active", b === btn);
                b.setAttribute("aria-pressed", b === btn ? "true" : "false");
            });
            const f = btn.dataset.filter;
            wines.forEach((w) => { w.hidden = f !== "all" && w.dataset.type !== f; });
        });
    });


    /* =========================
       ANIMATIONS SCROLL
    ========================= */

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(
        ".split > *, .band > div, .section-head, .card, .engagement, .stats div, .shop > *, .timeline li, .contact-section > *"
    ).forEach((el) => {
        el.classList.add("hidden");
        observer.observe(el);
    });

    document.querySelectorAll(".cards").forEach((grid) => {
        grid.querySelectorAll(".card").forEach((card, i) => {
            card.style.transitionDelay = `${i * 150}ms`;
        });
    });


    /* =========================
       MENU MOBILE
    ========================= */

    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");

    if (navToggle && mainNav) {
        function closeNav() {
            document.body.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
        }

        navToggle.addEventListener("click", () => {
            const open = document.body.classList.toggle("nav-open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
    }


    /* =========================
       FR / EN
       Chaque élément traduit porte son texte anglais dans data-en ;
       le français d'origine est gardé de côté pour revenir en arrière.
    ========================= */

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


    /* =========================
       ANNÉE DU PIED DE PAGE (toujours à jour)
    ========================= */

    document.querySelectorAll(".year").forEach((el) => { el.textContent = new Date().getFullYear(); });

});
