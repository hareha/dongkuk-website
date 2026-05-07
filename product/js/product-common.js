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
    if (!wasOpen) {
        item.classList.add('open');
        // 아코디언이 열릴 때 레이아웃 재계산을 위해 resize 이벤트 발생 (약간의 지연 필요)
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
    }
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
    
    // 탭 전환 시에도 레이아웃 재계산
    window.dispatchEvent(new Event('resize'));
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

        // 모든 탭 아이템에서 active 제거
        document.querySelectorAll('.tab-item[data-tab]').forEach(function (t) { 
            t.classList.remove('active'); 
        });
        
        // 모든 탭 패널에서 active 제거
        document.querySelectorAll('.tab-panel').forEach(function (p) { 
            p.classList.remove('active'); 
        });

        // 클릭된 탭과 동일한 data-tab을 가진 모든 탭 아이템에 active 추가 (동기화)
        document.querySelectorAll('.tab-item[data-tab="' + panelId + '"]').forEach(function (t) {
            t.classList.add('active');
        });

        // 해당 패널 활성화
        const panel = document.getElementById(panelId);
        if (panel) panel.classList.add('active');
        
        // 패널 전환 시 레이아웃 재계산
        window.dispatchEvent(new Event('resize'));
    });
});

/* ── 가로 스크롤바 동기화 (모바일 전용) ── */
document.addEventListener('DOMContentLoaded', function() {
    function initScrollSync() {
        // 기존 .spec-table-container 대응
        document.querySelectorAll('.spec-table-container').forEach(function(container) {
            if (container.dataset.scrollBound) return; // 이미 바인딩됨
            
            const scrollHorizontal = container.nextElementSibling;
            if (scrollHorizontal && scrollHorizontal.classList.contains('scroll-horizontal')) {
                const thumb = scrollHorizontal.querySelector('.scroll-thumb');
                const track = scrollHorizontal.querySelector('.scroll-track');
                
                if (thumb && track) {
                    container.addEventListener('scroll', function() {
                        const scrollWidth = this.scrollWidth - this.clientWidth;
                        if (scrollWidth <= 0) return;
                        const scrollLeft = this.scrollLeft;
                        const scrollPercent = Math.max(0, Math.min(1, scrollLeft / scrollWidth));
                        const maxTravel = track.clientWidth - thumb.clientWidth;
                        thumb.style.transform = `translateX(${scrollPercent * maxTravel}px)`;
                    });
                    container.dataset.scrollBound = "true";
                }
            }
        });

        // .cat-scroll-indicator 대응 (data-target 기반 혹은 형제 요소 기반)
        document.querySelectorAll('.cat-scroll-indicator').forEach(function(indicator) {
            if (indicator.dataset.scrollBound) return; // 이미 바인딩됨

            const thumb = indicator.querySelector('.cat-scroll-thumb');
            const track = indicator.querySelector('.cat-scroll-track, .cat-scroll-bg');
            if (!thumb || !track) return;

            const targetId = indicator.getAttribute('data-target');
            let scrollBox = targetId ? document.getElementById(targetId) : null;
            
            if (!scrollBox) {
                const prev = indicator.previousElementSibling;
                if (prev) {
                    scrollBox = prev.querySelector('[id*="scroll"]') || (prev.classList.contains('cat-table-wrap') ? prev : null);
                }
            }

            if (scrollBox && thumb && track) {
                scrollBox.addEventListener('scroll', function() {
                    const scrollWidth = this.scrollWidth - this.clientWidth;
                    if (scrollWidth <= 0) return;
                    
                    const scrollLeft = this.scrollLeft;
                    const scrollPercent = Math.max(0, Math.min(1, scrollLeft / scrollWidth));
                    
                    const maxTravel = track.clientWidth - thumb.clientWidth;
                    thumb.style.transform = `translateX(${scrollPercent * maxTravel}px)`;
                });
                indicator.dataset.scrollBound = "true";
                
                // 초기 위치 설정 (이미 스크롤되어 있을 경우 대비)
                const initialWidth = scrollBox.scrollWidth - scrollBox.clientWidth;
                if (initialWidth > 0) {
                    const initialPercent = scrollBox.scrollLeft / initialWidth;
                    const initialTravel = (track.clientWidth - thumb.clientWidth) * initialPercent;
                    thumb.style.transform = `translateX(${initialTravel}px)`;
                }
            }
        });
    }
    
    initScrollSync();
    // 리사이즈 시 다시 시도 (숨겨져 있던 요소가 나타날 수 있음)
    window.addEventListener('resize', initScrollSync);
});

