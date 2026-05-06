/* ================================================================
   product-common.js — 제품 페이지 공통 스크립트
   사용: dikel.html, cold-rolled.html, heat-treated.html
   ================================================================ */

/* ── 탭 전환 ── */
function setTab(el) {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

/* ── 아코디언 토글 ── */
function toggleAcc(header) {
    const item = header.closest('.acc-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
}

/* ── 활용분야 탭 전환 ── */
function setUsageTab(index) {
    const menuItems = document.querySelectorAll('.usage-menu-item');
    menuItems.forEach((el, i) => {
        if (i === index) el.classList.add('active');
        else el.classList.remove('active');
    });

    const tabContents = document.querySelectorAll('.usage-tab-content');
    tabContents.forEach((el, i) => {
        if (i === index) el.classList.add('active');
        else el.classList.remove('active');
    });
}

/* ── 공정카드 스케일링 (데스크탑) ── */
function scaleProcessCard() {
    const card = document.getElementById('process-card');
    const sticky = card?.parentElement;
    if (!card || !sticky) return;
    if (window.innerWidth <= 1023) return;
    const availW = sticky.clientWidth;
    const cardW = 1860;
    const cardH = 1080;
    if (availW <= 0) return;
    if (availW < cardW) {
        const s = availW / cardW;
        card.style.transform = `scale(${s})`;
        sticky.style.height = (cardH * s) + 'px';
    } else {
        card.style.transform = '';
        sticky.style.height = '';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    scaleProcessCard();
    window.addEventListener('resize', function () {
        requestAnimationFrame(scaleProcessCard);
    });
});

/* ── 히어로 텍스트 스크롤 컬러 전환 ── */
document.addEventListener('DOMContentLoaded', function () {
    const outer = document.querySelector('.hero-text-outer');
    if (!outer) return;
    const h2 = outer.querySelector('.hero-text-section h2');
    if (!h2) return;

    /* 글자를 한 글자씩 span.char로 감싸기 */
    function wrapCharacters(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const frag = document.createDocumentFragment();
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = text[i];
                frag.appendChild(span);
            }
            node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
            Array.from(node.childNodes).forEach(wrapCharacters);
        }
    }
    wrapCharacters(h2);

    const chars = h2.querySelectorAll('.char');

    function onScroll() {
        const rect = outer.getBoundingClientRect();
        const scrollRoom = outer.offsetHeight - outer.querySelector('.hero-text-inner').offsetHeight;
        const scrolled = -rect.top;

        let progress = Math.max(0, Math.min(1, scrolled / Math.max(scrollRoom * 0.6, 1)));

        const activeCount = Math.floor(progress * chars.length);
        chars.forEach((c, i) => c.classList.toggle('active', i < activeCount));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});

/* ── 탭 패널 전환 (디켈 가치/제품/브랜드 탭) ── */
document.querySelectorAll('.tab-item[data-tab]').forEach(function (tab) {
    tab.addEventListener('click', function () {
        const panelId = this.getAttribute('data-tab');

        document.querySelectorAll('.tab-item[data-tab]').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });

        this.classList.add('active');
        const panel = document.getElementById(panelId);
        if (panel) panel.classList.add('active');
    });
});
