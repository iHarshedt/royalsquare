/* Royal Square: navigation, progressive enhancement, and WhatsApp enquiries. */
document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 768px)');
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navLinks = [...links.querySelectorAll('a')];
    const sections = [...document.querySelectorAll('section[id]')];

    function setMenu(open, restoreFocus = false) {
        toggle.classList.toggle('active', open);
        links.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        links.inert = mobile.matches && !open;
        document.body.style.overflow = open ? 'hidden' : '';
        if (restoreFocus) toggle.focus();
    }
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
    mobile.addEventListener('change', () => setMenu(false));
    document.addEventListener('keydown', event => {
        if (toggle.getAttribute('aria-expanded') !== 'true') return;
        if (event.key === 'Escape') setMenu(false, true);
        if (event.key === 'Tab') {
            const controls = [...navLinks, toggle];
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
    setMenu(false);

    let scheduled = false;
    function updateScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
        let current = sections[0]?.id;
        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= 160) current = section.id;
        });
        navLinks.forEach(link => {
            const active = link.hash === '#' + current;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        scheduled = false;
    }
    window.addEventListener('scroll', () => {
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(updateScroll);
        }
    }, { passive: true });
    updateScroll();

    // Content stays visible if JavaScript or IntersectionObserver is unavailable.
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.classList.add('reveal-ready');
            observer.observe(element);
        });
    }

    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    [nameInput, phoneInput].forEach(input => {
        input.addEventListener('input', () => input.setCustomValidity(''));
    });
    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        nameInput.setCustomValidity(name ? '' : 'Please enter your name.');
        const digits = phone.replace(/\D/g, '');
        phoneInput.setCustomValidity(/^[+\d\s().-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15
            ? '' : 'Please enter a valid phone number, including your country code.');
        if (!form.reportValidity()) return;
        const email = document.getElementById('email').value.trim();
        const product = document.getElementById('product-interest');
        const message = document.getElementById('message').value.trim();
        const lines = ['Hello Royal Square!', '', '*Name:* ' + name, '*Phone:* ' + phone];
        if (email) lines.push('*Email:* ' + email);
        if (product.value) lines.push('*Product Interest:* ' + product.selectedOptions[0].textContent);
        if (message) lines.push('*Message:* ' + message);
        window.open('https://wa.me/971503772093?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener,noreferrer');
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('product-search');
    const cards = [...document.querySelectorAll('.product-card')];
    const count = document.getElementById('product-count');
    search.addEventListener('input', () => {
        const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
        let visible = 0;
        cards.forEach(card => {
            const matches = terms.every(term => card.textContent.toLowerCase().includes(term));
            card.hidden = !matches;
            if (matches) visible++;
        });
        count.textContent = visible ? visible + ' product ' + (visible === 1 ? 'category' : 'categories') : 'No matches. Try another term.';
    });
});