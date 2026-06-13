/* ============================================================
   Arpi's World — interactions
   ============================================================ */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function rand(n) { return Math.floor(Math.random() * n); }

    /* ---------- Split hero title into animated letters ---------- */
    (function splitTitle() {
        var el = document.querySelector('[data-split]');
        if (!el) return;
        var words = el.textContent.split(' ');
        el.textContent = '';
        var d = 0;
        words.forEach(function (word, wi) {
            var w = document.createElement('span');
            w.className = 'word';
            for (var i = 0; i < word.length; i++) {
                var span = document.createElement('span');
                span.className = 'ch';
                span.textContent = word[i];
                span.style.setProperty('--d', d++);
                w.appendChild(span);
            }
            el.appendChild(w);
            if (wi < words.length - 1) {
                var sp = document.createElement('span');
                sp.className = 'ch sp';
                sp.innerHTML = '&nbsp;';
                sp.style.setProperty('--d', d++);
                el.appendChild(sp);
            }
        });
    })();

    /* ---------- Floating petals / hearts ---------- */
    (function petals() {
        if (reduceMotion) return;
        var host = document.getElementById('particles');
        if (!host) return;
        var glyphs = ['🌸', '💖', '✨', '🌷', '🦋', '💕', '⭐', '🤍'];
        var COUNT = window.innerWidth < 760 ? 12 : 26;
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
            if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) requestAnimationFrame(loop);
            else running = false;
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

    /* ---------- Date-aware moment ---------- */
    var bdayConfettiDone = false;
    (function moment() {
        var icon = document.getElementById('moment-icon'),
            kicker = document.getElementById('moment-kicker'),
            title = document.getElementById('moment-title'),
            lead = document.getElementById('moment-lead'),
            msg = document.getElementById('moment-msg'),
            cd = document.getElementById('countdown'),
            bday = document.getElementById('bday-msg'),
            badge = document.getElementById('badge-text'),
            elD = document.getElementById('cd-days'),
            elH = document.getElementById('cd-hours'),
            elM = document.getElementById('cd-mins'),
            elS = document.getElementById('cd-secs');
        if (!icon) return;

        var BADGE_OFF = '✦ SADIA ISLAM ARPI ✦ DREAM · TRAVEL · HEAL ✦ ';
        var BADGE_BDAY = '★ HAPPY BIRTHDAY ★ SADIA ISLAM ARPI ★ JUNE 16 ★ ';

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
            var m = offMessages[rotIdx % offMessages.length]; rotIdx++;
            msg.classList.remove('show');
            setTimeout(function () { msg.textContent = m.t; icon.textContent = m.i; msg.classList.add('show'); }, 380);
        }
        function startRotation() {
            stopRotation();
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
            if (badge) badge.textContent = (mode === 'off') ? BADGE_OFF : BADGE_BDAY;
            if (mode === 'off') {
                icon.textContent = '🌸';
                kicker.textContent = 'A little note in the air';
                title.textContent = 'Hey, Arpi';
                lead.hidden = true; cd.hidden = true; bday.hidden = true; msg.hidden = false;
                startRotation();
            } else if (mode === 'eve') {
                stopRotation(); msg.hidden = true;
                icon.textContent = '🎂';
                kicker.textContent = 'Almost time';
                title.textContent = 'One More Sleep...';
                lead.hidden = false;
                lead.innerHTML = "Arpi's birthday is almost here... counting down to <strong>16<sup>th</sup> June</strong> ✨";
                bday.hidden = true; cd.hidden = false;
            } else {
                stopRotation(); msg.hidden = true;
                icon.textContent = '🎂';
                kicker.textContent = 'The big day';
                title.textContent = 'Happy Birthday, Arpi!';
                lead.hidden = false;
                lead.textContent = 'Today, the whole world gets to celebrate you 🎉';
                cd.hidden = true; bday.hidden = false;
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

    /* ---------- Note for Arpi (rotating notes + animations) ---------- */
    (function notes() {
        var btn = document.getElementById('gift-btn');
        var modalEl = document.getElementById('modal');
        var card = document.getElementById('modal-card');
        var noteEl = document.getElementById('modal-note');
        var iconEl = document.getElementById('modal-icon');
        var againBtn = document.getElementById('modal-again');
        if (!btn || !modalEl || !noteEl) return;

        var NOTES = [
            "You have one of those smiles the whole world quietly rearranges itself around.",
            "Somewhere out there, a patient's best day is going to begin with your name on the coat.",
            "If daydreaming were a sport, you'd be unfairly good at it.",
            "You are ninety percent kindness, ten percent chaos, and one hundred percent worth knowing.",
            "On the days you feel ordinary, know that the world quietly disagrees.",
            "Ice cream melts and chocolate runs out, but your kind of sweet is the kind that stays.",
            "One day 'Dr. Sadia Islam Arpi' will sound completely normal. Let that sink in.",
            "You don't chase the light. More often, you're the reason it shows up.",
            "Whatever you're overthinking right now is smaller than it feels. Truly.",
            "The world handed you a big heart and excellent taste. Lucky world.",
            "Go where the flights are cheap and the memories are wildly expensive.",
            "You're allowed to be a masterpiece and a work in progress at the same time.",
            "Future doctor, lifelong daydreamer, certified menace to bad moods.",
            "If kindness were couture, you'd be on every cover this season.",
            "Some people light up a room. You light up the room, the street, and the group chat.",
            "Be as soft as your dessert order and as bold as your travel plans.",
            "The stars are just the sky's modest attempt at doing what you do effortlessly.",
            "Reminder: you are handling this better than the worry in your head admits.",
            "May your coffee be strong, your plot twists plenty, and your doubts very quiet.",
            "You are living proof that gentle and unstoppable can share one heartbeat.",
            "Snowdrop was a great drama. Your storyline, though, keeps outdoing it.",
            "Keep that stubborn, generous heart. It is going to mend a great many people.",
            "You, my friend, are a limited edition. Kindly never go generic.",
            "Wherever you decide to land next, that place just got unfairly lucky."
        ];
        var ICONS = ['🎀', '🌸', '💌', '✨', '🤍', '🌷', '💫', '🩷'];
        var ANIMS = ['anim-pop', 'anim-up', 'anim-zoom', 'anim-flip', 'anim-swing', 'anim-blur', 'anim-rotate', 'anim-drop'];
        var lastNote = -1, lastAnim = -1;

        function pick(len, last) { var i = rand(len); if (len > 1) while (i === last) i = rand(len); return i; }

        function show() {
            var ni = pick(NOTES.length, lastNote); lastNote = ni;
            var ai = pick(ANIMS.length, lastAnim); lastAnim = ai;
            noteEl.textContent = NOTES[ni];
            iconEl.textContent = ICONS[rand(ICONS.length)];
            ANIMS.forEach(function (a) { card.classList.remove(a); });
            void card.offsetWidth; // reflow to restart animation
            card.classList.add(ANIMS[ai]);
        }
        function open() {
            modalEl.hidden = false;
            document.body.style.overflow = 'hidden';
            show();
            launchConfetti(70);
        }
        function close() { modalEl.hidden = true; document.body.style.overflow = ''; }

        btn.addEventListener('click', open);
        if (againBtn) againBtn.addEventListener('click', function () { show(); launchConfetti(40); });
        modalEl.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modalEl.hidden) close(); });
    })();

    /* ---------- Little memory-match game ---------- */
    (function game() {
        var board = document.getElementById('game-board');
        var movesEl = document.getElementById('g-moves');
        var pairsEl = document.getElementById('g-pairs');
        var resetBtn = document.getElementById('g-reset');
        var winEl = document.getElementById('game-win');
        if (!board) return;

        var SYMBOLS = ['🍦', '🍫', '👗', '🎥', '🩺', '🌸'];
        var WINS = ['You did it! 🌟', 'Flawless, Arpi! 💖', 'Matched them all! 🎉', 'Too easy for you 😉'];
        var first = null, lock = false, moves = 0, pairs = 0;

        function shuffle(a) {
            for (var i = a.length - 1; i > 0; i--) {
                var j = rand(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t;
            }
            return a;
        }

        function build() {
            board.innerHTML = '';
            winEl.hidden = true; winEl.textContent = '';
            first = null; lock = false; moves = 0; pairs = 0;
            movesEl.textContent = '0'; pairsEl.textContent = '0';
            var deck = shuffle(SYMBOLS.concat(SYMBOLS).slice());
            deck.forEach(function (sym) {
                var card = document.createElement('div');
                card.className = 'gcard';
                card.setAttribute('data-sym', sym);
                card.innerHTML = '<div class="gcard__inner">' +
                    '<div class="gcard__face gcard__back"></div>' +
                    '<div class="gcard__face gcard__front">' + sym + '</div></div>';
                card.addEventListener('click', function () { flip(card); });
                board.appendChild(card);
            });
        }

        function flip(card) {
            if (lock || card === first) return;
            if (card.classList.contains('matched') || card.classList.contains('flipped')) return;
            card.classList.add('flipped');
            if (!first) { first = card; return; }

            moves++; movesEl.textContent = String(moves);
            if (card.getAttribute('data-sym') === first.getAttribute('data-sym')) {
                card.classList.add('matched'); first.classList.add('matched');
                first = null;
                pairs++; pairsEl.textContent = String(pairs);
                if (pairs === SYMBOLS.length) {
                    winEl.textContent = WINS[rand(WINS.length)] + ' (' + moves + ' moves)';
                    winEl.hidden = false;
                    launchConfetti(120);
                }
            } else {
                lock = true;
                var a = first, b = card; first = null;
                setTimeout(function () {
                    a.classList.remove('flipped'); b.classList.remove('flipped'); lock = false;
                }, 750);
            }
        }

        if (resetBtn) resetBtn.addEventListener('click', build);
        build();
    })();

})();
