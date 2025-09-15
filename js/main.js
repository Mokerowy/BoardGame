document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector(".mobile-nav");
    const navBtn = document.querySelector(".burger-btn");
    const navLinks = document.querySelectorAll(".mobile-nav__item"); // Nowa zmienna dla linków

    const mobileNav = () => {
        nav.classList.toggle("mobile-nav--active");
    };

    if (nav && navBtn) {
        navBtn.addEventListener("click", mobileNav);
    }
    
    // Dodanie nasłuchiwacza do każdego linku w menu mobilnym
    navLinks.forEach(link => {
        link.addEventListener("click", mobileNav);
    });
});