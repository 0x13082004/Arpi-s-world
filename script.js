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

    /* ---------- Date-aware moment (off-season / birthday eve / birthday) ---------- */
    function setNote(mode) {
        var noteEl = document.querySelector('.modal__note');
        var signEl = document.querySelector('.modal__sign');
        var titleEl = document.getElementById('modal-title');
        if (!noteEl) return;
        if (mode === 'bday' || mode === 'eve') {
            if (titleEl) titleEl.textContent = 'A little wish for you';
            noteEl.innerHTML = "Happy Birthday, Arpi! 🎂<br><br>" +
                "Here's to the dreamer who's going to travel the world and heal it as a doctor someday. " +
                "May this year be as sweet as your favourite ice cream, as bright as your smile, " +
                "and full of every little thing that makes you happy. " +
                "Keep dreaming, keep shining... the world is so much better with you in it. 🌸";
            if (signEl) signEl.textContent = '... with the warmest birthday wishes';
        } else {
            if (titleEl) titleEl.textContent = 'A little note for you';
            noteEl.innerHTML = "Hey, Arpi 🌸<br><br>" +
                "Just a little note tucked away here, for whenever you happen to find it. " +
                "Whatever you've been carrying lately, I hope it gets a little lighter. " +
                "Keep dreaming those big dreams... travel far, heal hearts, and stay every bit as kind as you are. " +
                "The world is so much better with you somewhere in it.";
            if (signEl) signEl.textContent = '... from an old friend';
        }
    }

    var bdayConfettiDone = false;
    (function moment() {
        var icon = document.getElementById('moment-icon'),
            kicker = document.getElementById('moment-kicker'),
            title = document.getElementById('moment-title'),
            lead = document.getElementById('moment-lead'),
            msg = document.getElementById('moment-msg'),
            cd = document.getElementById('countdown'),
            bday = document.getElementById('bday-msg'),
            elD = document.getElementById('cd-days'),
            elH = document.getElementById('cd-hours'),
            elM = document.getElementById('cd-mins'),
            elS = document.getElementById('cd-secs');
        if (!icon) return;

        var offMessages = [
            { i: '🌸', t: "Some people make the whole world softer just by being in it. You're one of them." },
            { i: '✈️', t: "Wherever the road takes you, may it always be a little kind to you." },
            { i: '🍦', t: "Stay sweet, stay dreaming, stay exactly as you are." },
            { i: '🩺', t: "One day you'll heal hearts for a living... you already do, you know." },
            { i: '✨', t: "A little reminder for today... you're doing far better than you think." },
            { i: '🌍', t: "Here's to big dreams, far-off places, and the girl quietly chasing them." },
            { i: '🤍', t: "Whatever today feels like, I hope it gets lighter from here." },
            { i: '💫', t: "The world is a better place with you somewhere in it. Don't forget that." }
        ];

        function pad(n) { return (n < 10 ? '0' : '') + n; }
        function getMode(now) {
            var m = now.getMonth(), d = now.getDate();
            if (m === 5 && d === 16) return 'bday';
            if (m === 5 && d === 15) return 'eve';
            return 'off';
        }

        var curMode = null, rotTimer = null, rotIdx = 0;

        function stopRotation() { if (rotTimer) { clearInterval(rotTimer); rotTimer = null; } }
        function rotate() {
            var m = offMessages[rotIdx % offMessages.length];
            rotIdx++;
            msg.classList.remove('show');
            setTimeout(function () {
                msg.textContent = m.t;
                icon.textContent = m.i;
                msg.classList.add('show');
            }, 380);
        }
        function startRotation() {
            stopRotation();
            // first message instantly visible
            var m = offMessages[rotIdx % offMessages.length]; rotIdx++;
            msg.textContent = m.t; icon.textContent = m.i; msg.classList.add('show');
            rotTimer = setInterval(rotate, 5400);
        }

        function tickCountdown(now) {
            var target = new Date(now.getFullYear(), 5, 16, 0, 0, 0);
            var diff = Math.max(0, target - now);
            var s = Math.floor(diff / 1000);
            elD.textContent = pad(Math.floor(s / 86400));
            elH.textContent = pad(Math.floor((s % 86400) / 3600));
            elM.textContent = pad(Math.floor((s % 3600) / 60));
            elS.textContent = pad(s % 60);
        }

        function applyMode(mode) {
            if (mode === curMode) return;
            curMode = mode;
            setNote(mode);
            if (mode === 'off') {
                icon.textContent = '🌸';
                kicker.textContent = 'A little note in the air';
                title.textContent = 'Hey, Arpi';
                lead.hidden = true;
                cd.hidden = true;
                bday.hidden = true;
                msg.hidden = false;
                startRotation();
            } else if (mode === 'eve') {
                stopRotation();
                msg.hidden = true;
                icon.textContent = '🎂';
                kicker.textContent = 'Almost time';
                title.textContent = 'One More Sleep...';
                lead.hidden = false;
                lead.innerHTML = "Arpi's birthday is almost here... counting down to <strong>16<sup>th</sup> June</strong> ✨";
                bday.hidden = true;
                cd.hidden = false;
            } else { // bday
                stopRotation();
                msg.hidden = true;
                icon.textContent = '🎂';
                kicker.textContent = 'The big day';
                title.textContent = 'Happy Birthday, Arpi!';
                lead.hidden = false;
                lead.textContent = 'Today, the whole world gets to celebrate you 🎉';
                cd.hidden = true;
                bday.hidden = false;
                if (!bdayConfettiDone) { bdayConfettiDone = true; launchConfetti(150); }
            }
        }

        function loop() {
            var now = new Date();
            var mode = getMode(now);
            applyMode(mode);
            if (mode === 'eve') tickCountdown(now);
        }
        loop();
        setInterval(loop, 1000);
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
