/* ================================================================
   GNB Menu — Dynamic injection + behavior
   
   Usage:
     <body data-page="nickel">
     <script src="../js/gnb.js"></script>
   ================================================================ */
(function () {
  'use strict';

  /* 경로 자동 감지: <script src="../js/gnb.js"> → B = "../" */
  var scripts = document.getElementsByTagName('script');
  var thisScript = scripts[scripts.length - 1];
  var src = thisScript.getAttribute('src') || '';
  var B = src.replace(/js\/gnb\.js.*$/, '');
  if (!B) B = './';

  var M = B || './';
  var LOGO = B + 'assets/common/logo.svg';
  var THUMB = B + 'assets/common/gnb-thumb.png';
  var PAGE = document.body.getAttribute('data-page') || '';

  /* ── 메뉴 데이터 ── */
  var categories = [
    {
      title: '회사정보',
      items: [
        { text: '회사소개', href: B + 'company/index.html', key: 'company' },
        { text: '연혁', href: '#', key: '' },
        { text: '네트워크', href: '#', key: '' },
        { text: '뉴스', href: '#', key: '' },
        { text: 'CI', href: '#', key: '' }
      ]
    },
    {
      title: '제품소개',
      items: [
        { text: '제품정보 센터', href: '#', key: '' },
        { text: '니켈도금강판: DiKel', href: B + 'product/nickel/index.html', key: 'nickel' },
        { text: '냉연강판', href: B + 'product/cold-rolled/index.html', key: 'cold-rolled' },
        { text: 'Q/T 열처리 강판', href: B + 'product/heat-treated/index.html', key: 'heat-treated' },
        { text: '연구개발', href: B + 'product/rnd/index.html', key: 'rnd' }
      ]
    },
    {
      title: '투자정보',
      items: [
        { text: '투자정보 센터', href: '#', key: '' },
        { text: '주식정보', href: '#', key: '' },
        { text: '재무정보', href: '#', key: '' },
        { text: '공시', href: '#', key: '' },
        { text: '공고', href: '#', key: '' },
        { text: '내부관리규정', href: '#', key: '' }
      ]
    },
    {
      title: '지속가능경영',
      items: [
        { text: '지속가능경영 센터', href: '#', key: '' },
        { text: '환경경영', href: '#', key: '' },
        { text: '사회경영', href: '#', key: '' },
        { text: '윤리경영', href: '#', key: '' }
      ]
    },
    {
      title: '인재경영',
      items: [
        { text: '기업문화', href: '#', key: '' },
        { text: '직무소개', href: '#', key: '' },
        { text: '모집공고', href: '#', key: '' }
      ]
    }
  ];

  /* ── 현재 카테고리 판별 ── */
  function getActiveCategory() {
    for (var ci = 0; ci < categories.length; ci++) {
      for (var ii = 0; ii < categories[ci].items.length; ii++) {
        if (categories[ci].items[ii].key && categories[ci].items[ii].key === PAGE) return ci;
      }
    }
    if (PAGE === 'dikel-value' || PAGE === 'brand-resource' || PAGE === 'battery') return 1;
    return -1;
  }

  /* ── HTML 빌더 ── */
  function linkHTML(item) {
    var cls = (item.key && item.key === PAGE) ? ' class="is-active"' : '';
    return '<a href="' + item.href + '"' + cls + '>' + item.text + '</a>';
  }

  function desktopHTML() {
    var h = '<div class="gnb-menu-columns">';
    for (var i = 0; i < categories.length; i++) {
      var c = categories[i];
      h += '<div class="gnb-menu-col">';
      h += '<div class="gnb-menu-thumb"><img src="' + THUMB + '" alt="' + c.title + '"></div>';
      h += '<div class="gnb-menu-cat">' + c.title + '</div>';
      h += '<ul class="gnb-menu-links">';
      for (var j = 0; j < c.items.length; j++) h += '<li>' + linkHTML(c.items[j]) + '</li>';
      h += '</ul></div>';
    }
    return h + '</div>';
  }

  /* ── 모바일 HTML — Figma 16:17003 ──
     화살표/가로선 없음, 카테고리 + 서브메뉴 심플 리스트 */
  function mobileHTML() {
    var activeCat = getActiveCategory();
    var h = '<div class="gnb-menu-mobile"><div class="gnb-mob-list">';
    for (var i = 0; i < categories.length; i++) {
      var c = categories[i];
      var isActive = (i === activeCat);
      // 카테고리 타이틀
      h += '<div class="gnb-mob-cat' + (isActive ? ' is-active' : '') + '" data-cat="' + i + '">' + c.title + '</div>';
      // 서브메뉴 패널
      h += '<div class="gnb-mob-sub' + (isActive ? ' is-open' : '') + '">';
      h += '<div class="gnb-mob-sub-inner">';
      for (var j = 0; j < c.items.length; j++) {
        var item = c.items[j];
        var cls = (item.key && item.key === PAGE) ? ' class="is-active"' : '';
        h += '<a href="' + item.href + '"' + cls + '>' + item.text + '</a>';
      }
      h += '</div></div>';
    }
    return h + '</div></div>';
  }

  /* ── DOM 주입 ── */
  var html = '';
  html += '<div class="gnb-overlay" id="gnb-overlay"></div>';
  html += '<div class="gnb-menu" id="gnb-menu">';
  // 모바일 전용 헤더 (데스크톱에서는 CSS로 숨김)
  html += '<div class="gnb-menu-header">';
  html += '<a href="' + M + '"><img class="gnb-menu-logo" src="' + LOGO + '" alt="DK 동국산업"></a>';
  html += '<button class="gnb-menu-close" id="gnb-close" aria-label="닫기">';
  html += '<svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1b1b1b" stroke-width="2" stroke-linecap="round"/></svg>';
  html += '</button></div>';
  // Desktop body — 기존 헤더 아래에서 바로 콘텐츠
  html += '<div class="gnb-menu-body">' + desktopHTML() + '</div>';
  // Mobile accordion
  html += mobileHTML();
  html += '</div>';

  var w = document.createElement('div');
  w.innerHTML = html;
  while (w.firstChild) document.body.appendChild(w.firstChild);

  /* ── 요소 ── */
  var menu = document.getElementById('gnb-menu');
  var overlay = document.getElementById('gnb-overlay');
  var closeBtn = document.getElementById('gnb-close');

  var savedScrollY = 0;

  function openMenu() {
    savedScrollY = window.scrollY;
    menu.classList.add('is-open');
    overlay.classList.add('is-open');
    // body를 fixed로 고정 → 스크롤바는 유지, 스크롤만 차단 → 밀림 없음
    document.body.style.position = 'fixed';
    document.body.style.top = -savedScrollY + 'px';
    document.body.style.width = '100%';
    document.body.style.overflowY = 'scroll';
    var pageHeader = document.querySelector('#nav, .gnb, .header');
    if (pageHeader) pageHeader.classList.add('gnb-menu-active');
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflowY = '';
    window.scrollTo(0, savedScrollY);
    var pageHeader = document.querySelector('#nav, .gnb, .header');
    if (pageHeader) pageHeader.classList.remove('gnb-menu-active');
  }
  function toggleMenu() {
    if (menu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /* ── 햄버거 토글 연결 (열기/닫기 모두) ── */
  var triggers = document.querySelectorAll('.nav-hamburger, .gnb-menu-btn, .btn-menu');
  for (var t = 0; t < triggers.length; t++) {
    triggers[t].addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
  }

  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });

  /* ── 모바일 카테고리 토글 ── */
  var mobCats = menu.querySelectorAll('.gnb-mob-cat');
  for (var a = 0; a < mobCats.length; a++) {
    mobCats[a].addEventListener('click', function () {
      var catIdx = this.getAttribute('data-cat');
      var sub = this.nextElementSibling; // .gnb-mob-sub
      var isOpen = sub.classList.contains('is-open');

      // 모두 닫기
      var allCats = menu.querySelectorAll('.gnb-mob-cat');
      var allSubs = menu.querySelectorAll('.gnb-mob-sub');
      for (var i = 0; i < allCats.length; i++) {
        allCats[i].classList.remove('is-active');
        allSubs[i].classList.remove('is-open');
      }

      // 클릭한 것만 토글
      if (!isOpen) {
        this.classList.add('is-active');
        sub.classList.add('is-open');
      }
    });
  }

})();
