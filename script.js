/* ============================================================
   Arpi's World — interactions
   ============================================================ */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------- Split hero title into animated letters ---------- */
    (function splitTitle() {
        var el = document.querySelector('[data-split]');
        if (!el) return;
        var text = el.textContent;
        el.textContent = '';
        var d = 0;
        for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            var span = document.createElement('span');
            if (ch === ' ') {
                span.className = 'ch sp';
                span.innerHTML = '&nbsp;';
            } else {
                span.className = 'ch';
                span.textContent = ch;
            }
            span.style.setProperty('--d', d++);
            el.appendChild(span);
        }
    })();

    /* ---------- Floating petals / hearts ---------- */
    (function petals() {
        if (reduceMotion) return;
        var host = document.getElementById('particles');
        if (!host) return;
        var glyphs = ['🌸', '💖', '✨', '🌷', '🦋', '💕', '⭐', '🤍'];
        var COUNT = window.innerWidth < 760 ? 14 : 28;
        for (var i = 0; i < COUNT; i++) {
            var p = document.createElement('span');
            p.className = 'petal';
            p.textContent = glyphs[i % glyphs.length];
            var size = 12 + Math.random() * 18;
            var dur = 10 + Math.random() * 13;
            p.style.left = (Math.random() * 100) + 'vw';
            p.style.fontSize = size + 'px';
            p.style.setProperty('--op', (0.4 + Math.random() * 0.5).toFixed(2));
            p.style.animationDuration = dur + 's';
            p.style.animationDelay = (-Math.random() * dur) + 's';
            host.appendChild(p);
        }
    })();

    /* ---------- Scroll reveal ---------- */
    (function reveal() {
        var items = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('in'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
            });
        }, { threshold: 0.12 });
        items.forEach(function (el) { io.observe(el); });
    })();

    /* ---------- Navbar shadow + scroll progress ---------- */
    (function scrollFx() {
        var nav = document.getElementById('nav');
        var bar = document.getElementById('progress');
        function onScroll() {
            var y = window.scrollY;
            if (nav) nav.classList.toggle('scrolled', y > 24);
            if (bar) {
                var h = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    })();

    /* ---------- Cursor spotlight + parallax (desktop) ---------- */
    (function pointerFx() {
        if (!finePointer || reduceMotion) return;
        document.body.classList.add('has-pointer');
        var spot = document.getElementById('spotlight');
        var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
        var px = 0, py = 0, tx = 0, ty = 0, running = false;

        window.addEventListener('mousemove', function (e) {
            if (spot) {
                spot.style.setProperty('--x', e.clientX + 'px');
                spot.style.setProperty('--y', e.clientY + 'px');
            }
            tx = (e.clientX / window.innerWidth - 0.5);
            ty = (e.clientY / window.innerHeight - 0.5);
            if (!running) { running = true; requestAnimationFrame(loop); }
        }, { passive: true });

        function loop() {
            px += (tx - px) * 0.08;
            py += (ty - py) * 0.08;
            parallax.forEach(function (el) {
                var amt = parseFloat(el.getAttribute('data-parallax')) || 10;
                el.style.transform = 'translate(' + (px * amt) + 'px,' + (py * amt) + 'px)';
            });
            // keep animating only until settled, then idle
            if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) {
                requestAnimationFrame(loop);
            } else {
                running = false;
            }
        }
    })();

    /* ---------- 3D tilt cards ---------- */
    (function tilt() {
        if (!finePointer || reduceMotion) return;
        document.querySelectorAll('.tilt').forEach(function (card) {
            var max = card.classList.contains('interest') ? 9 : 5;
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var cx = (e.clientX - r.left) / r.width - 0.5;
                var cy = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = 'perspective(900px) rotateY(' + (cx * max) + 'deg) rotateX(' + (-cy * max) + 'deg) translateY(-6px)';
            });
            card.addEventListener('mouseleave', function () { card.style.transform = ''; });
        });
    })();

    /* ---------- Magnetic buttons ---------- */
    (function magnetic() {
        if (!finePointer || reduceMotion) return;
        document.querySelectorAll('.magnetic').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var r = btn.getBoundingClientRect();
                var mx = e.clientX - r.left - r.width / 2;
                var my = e.clientY - r.top - r.height / 2;
                btn.style.transform = 'translate(' + (mx * 0.25) + 'px,' + (my * 0.35) + 'px)';
            });
            btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
        });
    })();

    /* ---------- Birthday countdown (16 June) ---------- */
    var isBirthday = false;
    (function countdown() {
        var elD = document.getElementById('cd-days'),
            elH = document.getElementById('cd-hours'),
            elM = document.getElementById('cd-mins'),
            elS = document.getElementById('cd-secs'),
            bday = document.getElementById('bday-msg'),
            cd = document.getElementById('countdown');
        if (!elD) return;

        function pad(n) { return (n < 10 ? '0' : '') + n; }
        function nextBirthday(now) {
            var y = now.getFullYear();
            var target = new Date(y, 5, 16, 0, 0, 0);
            var endOfDay = new Date(y, 5, 16, 23, 59, 59);
            if (now > endOfDay) target = new Date(y + 1, 5, 16, 0, 0, 0);
            return target;
        }
        function tick() {
            var now = new Date();
            if (now.getMonth() === 5 && now.getDate() === 16) {
                if (!isBirthday) {
                    isBirthday = true;
                    if (bday) bday.hidden = false;
                    if (cd) cd.style.display = 'none';
                    launchConfetti(140);
                }
                return;
            }
            var diff = Math.max(0, nextBirthday(now) - now);
            var s = Math.floor(diff / 1000);
            elD.textContent = pad(Math.floor(s / 86400));
            elH.textContent = pad(Math.floor((s % 86400) / 3600));
            elM.textContent = pad(Math.floor((s % 3600) / 60));
            elS.textContent = pad(s % 60);
        }
        tick();
        setInterval(tick, 1000);
    })();

    /* ---------- Confetti ---------- */
    function launchConfetti(amount) {
        if (reduceMotion) return;
        var colors = ['#ff8fb1', '#b06fd6', '#ffd9e6', '#e9b9a3', '#7e5bd0', '#ffb6d5'];
        amount = amount || 80;
        for (var i = 0; i < amount; i++) {
            (function (i) {
                var c = document.createElement('span');
                c.className = 'confetti';
                var size = 6 + Math.random() * 8;
                c.style.left = (Math.random() * 100) + 'vw';
                c.style.width = size + 'px';
                c.style.height = (size * (0.4 + Math.random())) + 'px';
                c.style.background = colors[i % colors.length];
                c.style.opacity = '0';
                c.style.animationDuration = (2.4 + Math.random() * 2) + 's';
                c.style.animationDelay = (Math.random() * 0.3) + 's';
                if (Math.random() > 0.5) c.style.borderRadius = '50%';
                document.body.appendChild(c);
                c.style.opacity = '1';
                setTimeout(function () { c.remove(); }, 5000);
            })(i);
        }
    }

    /* ---------- Surprise modal ---------- */
    (function modal() {
        var btn = document.getElementById('gift-btn');
        var modalEl = document.getElementById('modal');
        if (!btn || !modalEl) return;
        function open() { modalEl.hidden = false; launchConfetti(120); document.body.style.overflow = 'hidden'; }
        function close() { modalEl.hidden = true; document.body.style.overflow = ''; }
        btn.addEventListener('click', open);
        modalEl.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modalEl.hidden) close(); });
    })();

})();
