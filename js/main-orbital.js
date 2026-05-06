    (function () {
      const wrapper = document.getElementById('orbital-wrapper');
      const section = document.querySelector('.orbital-sticky');
      const svg = document.getElementById('orb-svg');
      const e1 = document.getElementById('orb-e1');
      const e2 = document.getElementById('orb-e2');
      const coil = document.getElementById('orb-coil');
      const idotA = document.getElementById('orb-idot-a');
      const idotB = document.getElementById('orb-idot-b');
      const idotC = document.getElementById('orb-idot-c');
      const odot1 = document.getElementById('orb-odot-1');
      const odot2 = document.getElementById('orb-odot-2');
      const odot3 = document.getElementById('orb-odot-3');
      const odot4 = document.getElementById('orb-odot-4');
      const card1 = document.getElementById('orb-card-1');
      const card2 = document.getElementById('orb-card-2');
      const card3 = document.getElementById('orb-card-3');
      const card4 = document.getElementById('orb-card-4');
      const phase1 = document.getElementById('orb-phase-1');
      const phase2 = document.getElementById('orb-phase-2');
      const innerTrailA = document.getElementById('orb-inner-trail-a');
      const innerTrailB = document.getElementById('orb-inner-trail-b');
      const innerTrailC = document.getElementById('orb-inner-trail-c');
      const outerTrail1 = document.getElementById('orb-outer-trail-1');
      const outerTrail2 = document.getElementById('orb-outer-trail-2');
      const outerTrail3 = document.getElementById('orb-outer-trail-3');
      const outerTrail4 = document.getElementById('orb-outer-trail-4');

      const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
      const easeInCubic = t => t * t * t;
      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
      const norm = (v, lo, hi) => clamp((v - lo) / (hi - lo), 0, 1);

      let W, H, cx, cy, rx_in, ry_in, rx_out, ry_out, len1 = 0, len2 = 0, ready = false;
      var isMobile = window.innerWidth <= 1023;

      function setup() {
        W = section.offsetWidth;
        H = section.offsetHeight;
        isMobile = window.innerWidth <= 1023;
        cx = W * 0.50;
        cy = H * 0.50;
        /* 모바일: 코일 궤도 반경 — 코일보다 훨씬 넓게 */
        const COIL_R = isMobile ? Math.min(W * 0.8, H * 0.42, 380) : 420;
        rx_in = COIL_R; ry_in = COIL_R;
        const R_OUT = isMobile ? Math.min(W * 1.0, H * 0.52, 460) : Math.min(W * 0.7, H * 0.7);
        rx_out = R_OUT; ry_out = R_OUT;

        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        e1.setAttribute('cx', cx); e1.setAttribute('cy', cy);
        e1.setAttribute('rx', rx_in); e1.setAttribute('ry', ry_in);
        e2.setAttribute('cx', cx); e2.setAttribute('cy', cy);
        e2.setAttribute('rx', rx_out); e2.setAttribute('ry', ry_out);

        coil.style.left = cx + 'px';
        coil.style.top = cy + 'px';
        /* 모바일: orb-coil 크기 동적 조절 (인라인 style 오버라이드) */
        var coilSize = isMobile ? Math.min(W * 0.7, H * 0.4, 320) : Math.max(560, W * 0.4);
        coil.style.width = coilSize + 'px';
        coil.style.height = coilSize + 'px';

        len1 = e1.getTotalLength() || 1900;
        len2 = e2.getTotalLength() || 2600;
        e1.style.strokeDasharray = len1; e1.style.strokeDashoffset = 0;
        e2.style.strokeDasharray = len2; e2.style.strokeDashoffset = 0;
        ready = true;
      }

      function pt(t, ecx, ecy, erx, ery) {
        const a = t * Math.PI * 2;
        return { x: ecx + erx * Math.cos(a), y: ecy + ery * Math.sin(a) };
      }

      const p1l1 = document.getElementById('p1l1');
      const p1l2 = document.getElementById('p1l2');
      const p2l1 = document.getElementById('p2l1');
      const p2l2 = document.getElementById('p2l2');
      const ctaEl = document.getElementById('orb-cta');

      function onScroll() {
        if (!ready) setup();
        const wTop = wrapper.getBoundingClientRect().top;
        const range = wrapper.offsetHeight - window.innerHeight;
        const p = clamp(-wTop / range, 0, 1);

        coil.style.opacity = '1';
        coil.style.transform = 'translate(-50%, -50%) scale(1)';
        e1.style.strokeDashoffset = '0';
        e2.style.strokeDashoffset = '0';

        function setGradTrail(trailEl, gradId, t_dot, tailFraction, sweepCW, ecx, ecy, erx, ery) {
          const t_start = sweepCW ? t_dot - tailFraction : t_dot + tailFraction;
          const a_s = t_start * Math.PI * 2;
          const a_e = t_dot * Math.PI * 2;
          const pS = { x: ecx + erx * Math.cos(a_s), y: ecy + ery * Math.sin(a_s) };
          const pE = { x: ecx + erx * Math.cos(a_e), y: ecy + ery * Math.sin(a_e) };
          trailEl.setAttribute('d', `M ${pS.x} ${pS.y} A ${erx} ${ery} 0 0 ${sweepCW ? 1 : 0} ${pE.x} ${pE.y}`);
          trailEl.style.stroke = `url(#${gradId})`;
          trailEl.style.opacity = '1';
          const grad = document.getElementById(gradId);
          if (grad) {
            grad.setAttribute('x1', pS.x); grad.setAttribute('y1', pS.y);
            grad.setAttribute('x2', pE.x); grad.setAttribute('y2', pE.y);
          }
        }

        const dp = p;
        /* inner dots: navy=2시(0.89) gray=11시(0.625) orange=7시(0.333) */
        const innerBase = dp * 0.25;
        const TAIL_IN = 0.25;
        const tA = innerBase + 0.333; const tB = innerBase + 0.625; const tC = innerBase + 0.89;

        const iA = pt(tA, cx, cy, rx_in, ry_in); const iB = pt(tB, cx, cy, rx_in, ry_in); const iC = pt(tC, cx, cy, rx_in, ry_in);
        idotA.style.left = iA.x + 'px'; idotA.style.top = iA.y + 'px'; idotA.style.opacity = '1';
        idotB.style.left = iB.x + 'px'; idotB.style.top = iB.y + 'px'; idotB.style.opacity = '1';
        idotC.style.left = iC.x + 'px'; idotC.style.top = iC.y + 'px'; idotC.style.opacity = '1';

        setGradTrail(innerTrailA, 'trail-grad-orange', tA, TAIL_IN, true, cx, cy, rx_in, ry_in);
        setGradTrail(innerTrailB, 'trail-grad-gray', tB, TAIL_IN, true, cx, cy, rx_in, ry_in);
        setGradTrail(innerTrailC, 'trail-grad-navy', tC, TAIL_IN, true, cx, cy, rx_in, ry_in);

        const HALF = 1 / 2;
        const outerBase = dp * 0.25;
        const tO1 = outerBase; const tO2 = outerBase + HALF;

        const oP1 = pt(tO1, cx, cy, rx_out, ry_out); const oP2 = pt(tO2, cx, cy, rx_out, ry_out);

        odot1.style.left = oP1.x + 'px'; odot1.style.top = oP1.y + 'px'; odot1.style.opacity = '1';
        odot2.style.left = oP2.x + 'px'; odot2.style.top = oP2.y + 'px'; odot2.style.opacity = '1';

        const TAIL_OUT = 1 / 6;
        setGradTrail(outerTrail1, 'trail-grad-out-orange', tO1, TAIL_OUT, true, cx, cy, rx_out, ry_out);
        setGradTrail(outerTrail2, 'trail-grad-out-orange-2', tO2, TAIL_OUT, true, cx, cy, rx_out, ry_out);

        const t1 = norm(p, 0.25, 0.62); const t2 = norm(p, 0.28, 0.65);
        const t3 = norm(p, 0.31, 0.68); const t4 = norm(p, 0.34, 0.71);
        const cY = t => 220 - t * 720;
        const cardOp = t => clamp(t / 0.15, 0, 1) * clamp((1 - t) / 0.25, 0, 1);
        card1.style.opacity = cardOp(t1); card2.style.opacity = cardOp(t2);
        card3.style.opacity = cardOp(t3); card4.style.opacity = cardOp(t4);
        const cardSc = t => 0.88 + 0.12 * clamp(t / 0.15, 0, 1);
        card1.style.transform = `translateY(${cY(t1)}px) scale(${cardSc(t1)})`;
        card2.style.transform = `translateY(${cY(t2)}px) scale(${cardSc(t2)})`;
        card3.style.transform = `translateY(${cY(t3)}px) scale(${cardSc(t3)})`;
        card4.style.transform = `translateY(${cY(t4)}px) scale(${cardSc(t4)})`;

        const ph1In = easeOutCubic(norm(p, 0.25, 0.40));
        const ph1Out = easeInCubic(norm(p, 0.50, 0.62));
        const ph1Y = (1 - ph1In) * 320 - ph1Out * 240;
        phase1.style.opacity = ph1In * (1 - ph1Out);
        /* 모바일: translateX(-50%) 제거 → CSS에서 left:50% + margin-left:-45vw로 중앙 정렬 */
        if (isMobile) {
          phase1.style.transform = `translateY(calc(-50% + ${ph1Y}px))`;
        } else {
          phase1.style.transform = `translateX(-50%) translateY(calc(-50% + ${ph1Y}px))`;
        }
        p1l1.style.transform = 'translateY(0)'; p1l2.style.transform = 'translateY(0)';

        const ph2In = easeOutCubic(norm(p, 0.62, 0.78));
        /* ── EXIT 트랜지션: p=0.82~0.96 구간에서 phase2 위로 올라감 ── */
        const ph2Out = easeInCubic(norm(p, 0.82, 0.96));
        const ph2Y = (1 - ph2In) * 320 - ph2Out * 500;
        phase2.style.opacity = ph2In * (1 - ph2Out);
        /* 모바일: translateX(-50%) 제거 */
        if (isMobile) {
          phase2.style.transform = `translateY(calc(-50% + ${ph2Y}px))`;
        } else {
          phase2.style.transform = `translateX(-50%) translateY(calc(-50% + ${ph2Y}px))`;
        }
        p2l1.style.transform = 'translateY(0)'; p2l2.style.transform = 'translateY(0)';
        ctaEl.style.opacity = clamp(1 - ph2Out * 2, 0, 1);

        /* ── EXIT 트랜지션: p=0.82~0.96 구간에서 위성(dots/trails) 확 퍼지며 사라짐 ── */
        const exitT = norm(p, 0.82, 0.96);
        if (exitT > 0) {
          const exitEase = easeInCubic(exitT);
          const spreadScale = 1 + exitEase * 3.5; /* 반지름이 4.5배까지 확장 */
          const exitOpacity = clamp(1 - exitEase * 1.5, 0, 1); /* 빠르게 사라짐 */
          const exitBlur = exitEase * 12; /* 점점 흐려짐 */

          /* inner dots 반지름 확대 + 사라짐 */
          const rx_in_exit = rx_in * spreadScale;
          const ry_in_exit = ry_in * spreadScale;
          const iAe = pt(tA, cx, cy, rx_in_exit, ry_in_exit);
          const iBe = pt(tB, cx, cy, rx_in_exit, ry_in_exit);
          const iCe = pt(tC, cx, cy, rx_in_exit, ry_in_exit);
          idotA.style.left = iAe.x + 'px'; idotA.style.top = iAe.y + 'px';
          idotB.style.left = iBe.x + 'px'; idotB.style.top = iBe.y + 'px';
          idotC.style.left = iCe.x + 'px'; idotC.style.top = iCe.y + 'px';
          idotA.style.opacity = exitOpacity; idotB.style.opacity = exitOpacity; idotC.style.opacity = exitOpacity;
          idotA.style.filter = `blur(${exitBlur}px)`;
          idotB.style.filter = `blur(${exitBlur}px)`;
          idotC.style.filter = `blur(${exitBlur}px)`;

          /* inner trails 확대 + 사라짐 */
          setGradTrail(innerTrailA, 'trail-grad-orange', tA, TAIL_IN, true, cx, cy, rx_in_exit, ry_in_exit);
          setGradTrail(innerTrailB, 'trail-grad-gray', tB, TAIL_IN, true, cx, cy, rx_in_exit, ry_in_exit);
          setGradTrail(innerTrailC, 'trail-grad-navy', tC, TAIL_IN, true, cx, cy, rx_in_exit, ry_in_exit);
          innerTrailA.style.opacity = exitOpacity;
          innerTrailB.style.opacity = exitOpacity;
          innerTrailC.style.opacity = exitOpacity;

          /* outer dots 반지름 확대 + 사라짐 */
          const rx_out_exit = rx_out * spreadScale;
          const ry_out_exit = ry_out * spreadScale;
          const oP1e = pt(tO1, cx, cy, rx_out_exit, ry_out_exit);
          const oP2e = pt(tO2, cx, cy, rx_out_exit, ry_out_exit);
          odot1.style.left = oP1e.x + 'px'; odot1.style.top = oP1e.y + 'px';
          odot2.style.left = oP2e.x + 'px'; odot2.style.top = oP2e.y + 'px';
          odot1.style.opacity = exitOpacity; odot2.style.opacity = exitOpacity;
          odot1.style.filter = `blur(${exitBlur}px)`;
          odot2.style.filter = `blur(${exitBlur}px)`;

          /* outer trails 확대 + 사라짐 */
          setGradTrail(outerTrail1, 'trail-grad-out-orange', tO1, TAIL_OUT, true, cx, cy, rx_out_exit, ry_out_exit);
          setGradTrail(outerTrail2, 'trail-grad-out-orange-2', tO2, TAIL_OUT, true, cx, cy, rx_out_exit, ry_out_exit);
          outerTrail1.style.opacity = exitOpacity;
          outerTrail2.style.opacity = exitOpacity;

          /* 궤도 타원(ellipse) 자체도 확대 + 사라짐 */
          e1.setAttribute('rx', rx_in_exit); e1.setAttribute('ry', ry_in_exit);
          e2.setAttribute('rx', rx_out_exit); e2.setAttribute('ry', ry_out_exit);
          e1.style.opacity = exitOpacity;
          e2.style.opacity = exitOpacity;

          /* 코일은 그대로 유지 (축소/사라짐 없음) */
          coil.style.opacity = '1';
          coil.style.transform = 'translate(-50%, -50%) scale(1)';
        } else {
          /* exit 구간 진입 전에는 blur/opacity 원래대로 */
          [idotA, idotB, idotC].forEach(d => { d.style.filter = 'blur(0px)'; });
          [odot1, odot2].forEach(d => { d.style.filter = 'blur(1.5px)'; });
          e1.setAttribute('rx', rx_in); e1.setAttribute('ry', ry_in);
          e2.setAttribute('rx', rx_out); e2.setAttribute('ry', ry_out);
          e1.style.opacity = '1'; e2.style.opacity = '1';
        }

        /* ── 3D 코일: orbital 구간에서는 줌 상태 고정 (이동 없음) ── */
        /* product 섹션이 이미 화면에 있으면 여기서 건드리지 않음 (onProdScroll이 담당) */
        var prodWrap = document.getElementById('product-wrapper');
        var prodOnScreen = prodWrap && prodWrap.getBoundingClientRect().top < window.innerHeight;
        if (window._coil3d && !prodOnScreen) {
          const fixedWrap = document.getElementById('coil-3d-fixed');
          if (fixedWrap) {
            /* orbital-sticky가 뷰포트에 걸리면 fixed로 전환 */
            var orbRect = wrapper.getBoundingClientRect();
            if (orbRect.top <= 0) {
              /* sticky 동작 중: 코일도 fixed */
              fixedWrap.classList.add('coil-fixed');
              fixedWrap.style.transform = 'none';
              fixedWrap.style.opacity = '1';
            } else {
              /* 아직 스크롤 안 됨: absolute로 orbital 위치에 배치 */
              fixedWrap.classList.remove('coil-fixed');
              fixedWrap.style.opacity = '1';
            }
          }
          if (p < 0.96) {
            window._coil3d.updateRotation(0.12);
          } else {
            const exitToProduct = norm(p, 0.96, 1.0);
            const tRaw = 0.12 + exitToProduct * 0.08;
            window._coil3d.updateRotation(tRaw);
          }
        }
      }

      coil.style.opacity = '1';
      coil.style.transform = 'translate(-50%, -50%) scale(1)';
      [card1, card2, card3, card4].forEach(c => { c.style.opacity = '0'; });
      [idotA, idotB, idotC, odot1, odot2].forEach(d => { d.style.opacity = '1'; });

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => { setup(); onScroll(); }, { passive: true });
      setup(); onScroll();
    })();

    const fadeEls = document.querySelectorAll('.fade-in');
    const fadeIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); fadeIO.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => fadeIO.observe(el));

    /* ══ GNB 컬러 전환 및 스크롤 숨김 처리 ══ */
    (function () {
      const gnb = document.querySelector('.gnb');
      const hero = document.getElementById('hero');
      let lastY = window.scrollY;

      function updateGnb() {
        const currentY = window.scrollY;
        const delta = currentY - lastY;

        // 1. 투명↔solid 전환
        // 투명 = 최상단(scrollY ≈ 0)에서만
        // solid = 그 외 모든 경우 (히어로 영역 안이라도 스크롤 내리면 solid)
        if (hero) {
          const atTop = currentY <= 10;
          gnb.classList.toggle('gnb-transparent', atTop);
          gnb.classList.toggle('gnb-solid', !atTop);
        }

        // 2. orbital 섹션 감지
        const orbital = document.querySelector('.orbital-sticky');
        const inOrbital = orbital && orbital.getBoundingClientRect().top < 100 && orbital.getBoundingClientRect().bottom > 0;

        if (inOrbital) {
          gnb.classList.remove('gnb-hidden');
        } else if (delta > 0 && currentY > 50) {
          gnb.classList.add('gnb-hidden');
        } else if (delta < 0) {
          gnb.classList.remove('gnb-hidden');
        }

        lastY = currentY;
      }

      window.addEventListener('scroll', updateGnb, { passive: true });
      updateGnb();
    })();

    (function () {
      const wrapper = document.getElementById('invest-wrapper');
      const track = document.getElementById('invest-track');
      if (!wrapper || !track) return;
      const CARDS = [...track.querySelectorAll('.ic')];
      let curIdx = -1; let targetP = 0; let currentP = 0;

      function applyIdx(idx) {
        if (idx === curIdx) return;
        curIdx = idx;
        CARDS.forEach((c, i) => {
          c.classList.remove('ic-active', 'ic-past', 'ic-next');
          if (i === idx) c.classList.add('ic-active');
          else if (i < idx) c.classList.add('ic-past');
          else if (i === idx + 1) c.classList.add('ic-next');
        });
      }

      function onScroll() {
        const t = wrapper.getBoundingClientRect().top;
        const r = wrapper.offsetHeight - window.innerHeight;
        if (r > 0) targetP = Math.max(0, Math.min(1, -t / r));
      }

      var _cachedMaxScroll = null;
      function cacheMaxScroll() {
        _cachedMaxScroll = track.scrollHeight - track.parentElement.offsetHeight;
      }
      cacheMaxScroll();
      window.addEventListener('resize', cacheMaxScroll);

      function render() {
        currentP += (targetP - currentP) * 0.15;
        let idx = 0;
        if (currentP < 0.26) idx = 0;
        else if (currentP < 0.52) idx = 1;
        else if (currentP < 0.78) idx = 2;
        else idx = 3;
        applyIdx(idx);

        if (_cachedMaxScroll > 0) {
          track.style.transform = `translateY(${-currentP * _cachedMaxScroll}px)`;
        }
        requestAnimationFrame(render);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); render();
    })();

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
      });
    });

    (function () {
      'use strict';
      var wrapper = document.getElementById('product-wrapper');
      if (!wrapper) return;
      var steps = Array.from(document.querySelectorAll('.prod-step'));
      var imgs = Array.from(document.querySelectorAll('.prod-coil-img'));
      var segs = Array.from(document.querySelectorAll('.prod-arc-seg'));
      var loadingBar = document.querySelector('.product-loading-bar');
      var dots = Array.from(document.querySelectorAll('.prod-dot'));
      var curStep = -1;

      function setStep(idx) {
        if (idx === curStep) return;
        curStep = idx;
        steps.forEach(function (el, i) { el.classList.toggle('prod-active', i === idx); });
        imgs.forEach(function (el, i) { el.classList.toggle('prod-active', i === idx); });
        segs.forEach(function (el, i) { el.style.opacity = i === idx ? '1' : '0'; });
        dots.forEach(function (el, i) { el.classList.toggle('active', i === idx); });
      }

      function onProdScroll() {
        var rect = wrapper.getBoundingClientRect();
        var range = wrapper.offsetHeight - window.innerHeight;
        if (range <= 0) return;
        var p = Math.max(0, Math.min(1, -rect.top / range));
        if (loadingBar) loadingBar.style.width = (p * 100) + '%';
        var idx = Math.min(Math.floor(Math.max(0, (p - 0.15) / 0.85) * 3), 2);
        setStep(idx);

        /* 3D 코일: product 섹션 접근 시 이동 + 각도 변경 + 스크롤 아웃 */
        if (window._coil3d) {
          var vh = window.innerHeight;
          var vw = window.innerWidth;
          var fixedWrap = document.getElementById('coil-3d-fixed');
          var mobCoil = vw <= 1023;
          var mobUp = mobCoil ? Math.round(vh * -0.20) : 0; /* 모바일: 20vh 위로 */

          if (rect.top > 0 && rect.top < vh) {
            /* ── 섹션이 아래에서 올라오는 중: 코일 이동 (center → product) ── */
            var entry = 1 - (rect.top / vh);
            if (!window._coilLocked) {
              var tRaw = 0.20 + entry * 0.15;
              window._coil3d.updateRotation(tRaw);
            }
            if (fixedWrap) {
              fixedWrap.classList.add('coil-fixed');
              fixedWrap.classList.add('coil-on-product');
              var curUp = mobUp ? Math.round(mobUp * entry) : 0;
              fixedWrap.style.transform = curUp ? 'translateY(' + curUp + 'px)' : 'none';
              fixedWrap.style.opacity = '1';
            }
          } else if (rect.top <= 0) {
            /* ── 섹션 진입 완료 ── */
            if (!window._coilLocked) {
              var tRaw = 0.35 + p * 0.65;
              if (idx >= 2) {
                window._coilLocked = true;
                window._coilLockedTRaw = Math.min(tRaw, 0.82);
              }
              window._coil3d.updateRotation(Math.min(tRaw, 0.82));
            } else {
              /* 잠긴 상태에서는 고정 tRaw 사용 */
              window._coil3d.updateRotation(window._coilLockedTRaw || 0.82);
            }
            if (fixedWrap) fixedWrap.classList.add('coil-on-product');

            /* 카드가 위로 빠질 때 코일도 같이 올라감 */
            if (rect.bottom <= 0) {
              if (fixedWrap) {
                fixedWrap.style.transform = 'translateY(' + (mobUp - vh) + 'px)';
                fixedWrap.style.opacity = '1';
              }
            } else if (rect.bottom < vh) {
              var offset = vh - rect.bottom;
              if (fixedWrap) {
                fixedWrap.style.transform = 'translateY(' + (mobUp - offset) + 'px)';
                fixedWrap.style.opacity = '1';
              }
            } else {
              if (fixedWrap) {
                fixedWrap.style.transform = mobUp ? 'translateY(' + mobUp + 'px)' : 'none';
                fixedWrap.style.opacity = '1';
              }
            }
          } else {
            /* product 아직 안 보임 → orbital 영역 = 글자 뒤 */
            if (fixedWrap) fixedWrap.classList.remove('coil-on-product');
          }

          /* 위로 스크롤해서 돌아가면 잠금 해제 */
          if (window._coilLocked && (idx < 2 || rect.top > 0)) {
            window._coilLocked = false;
            window._coilLockedTRaw = null;
          }
        }
      }
      window.addEventListener('scroll', onProdScroll, { passive: true });

      function initProd() {
        if (!wrapper.offsetHeight) { requestAnimationFrame(initProd); return; }
        setStep(0); onProdScroll();
      }
      requestAnimationFrame(initProd);
    })();
