/* ================================================================
   components.js — 공통 HTML 컴포넌트 동적 삽입
   사용: product 페이지들 (dikel, cold-rolled, heat-treated, product-center, rnd)
   
   사용법: HTML에 플레이스홀더 요소를 배치하면 자동으로 내용 삽입
     <div id="support-placeholder"></div>
     <div id="footer-placeholder"></div>
     <div id="btn-top-placeholder"></div>
   ================================================================ */

(function () {
    /* ── 경로 감지: product/ 하위면 '../', 루트면 '' ── */
    const isSubdir = location.pathname.includes('/product/') ||
        location.pathname.includes('/company/') ||
        location.pathname.includes('/invest/') ||
        location.pathname.includes('/sustainability/') ||
        location.pathname.includes('/career/');
    const prefix = isSubdir ? '../' : '';

    /* ── 고객지원 배너 ── */
    const supportEl = document.getElementById('support-placeholder');
    if (supportEl) {
        supportEl.outerHTML = `
    <section class="support-section">
        <div class="support-banner">
            <div class="support-icon"></div>
            <div class="support-content-box">
                <div class="support-info">
                    <h3>동국산업에 대해 더 알고 싶으신가요?</h3>
                    <p>제품, 기술, 협력, 채용 등 다양한 문의를 남겨주시면 담당자가 확인 후 안내드립니다.</p>
                </div>
                <a href="#" class="btn-arrow-right">→</a>
            </div>
        </div>
    </section>`;
    }

    /* ── 푸터 ── */
    const footerEl = document.getElementById('footer-placeholder');
    if (footerEl) {
        footerEl.outerHTML = `
    <footer class="footer">
        <div class="footer-top">
            <div class="footer-logo">
                <img src="${prefix}assets/common/footer-logo.svg" alt="DK Steel Logo">
            </div>
            <div class="footer-btn-group">
                <a href="#" class="footer-btn">방문예약</a>
                <a href="#" class="footer-btn">
                    YOUTUBE
                    <img src="${prefix}assets/common/ic-youtube.svg" alt="Youtube" width="20" height="20">
                </a>
                <a href="#" class="footer-btn">
                    패밀리 사이트
                    <svg width="13.5" height="13.5" viewBox="0 0 13.5 13.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.75 0V13.5M0 6.75H13.5" stroke="white" stroke-width="1.5" />
                    </svg>
                </a>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="footer-divider"></div>
            <div class="footer-bottom-info">
                <div class="footer-links">
                    <a href="#">개인정보처리방침</a>
                    <div class="bar"></div>
                    <a href="#">내부정보관리규정</a>
                    <div class="bar"></div>
                    <a href="#">사이트맵</a>
                    <div class="bar"></div>
                    <a href="#">02-316-7500</a>
                    <div class="bar"></div>
                    <a href="#">서울특별시 중구 다동길 46</a>
                </div>
                <p class="footer-copy">Copyright(C) 2015 DONGKUK INDUSTRIES All rights Reserved.</p>
            </div>
        </div>
    </footer>`;
    }

    /* ── BTN TOP ── */
    const btnTopEl = document.getElementById('btn-top-placeholder');
    if (btnTopEl) {
        btnTopEl.outerHTML = `
    <a href="#" id="btn-top" class="btn-top">
        <img src="${prefix}assets/common/btn-top.svg" alt="맨 위로 가기">
    </a>`;
    }
})();
