    (function () {
      'use strict';

      /* ════════════════════════════════════════════════════
         절차적 동심원 헤어라인 뚜껑(Cap) 텍스처 생성
         ════════════════════════════════════════════════════ */
      function buildCapCanvas(size) {
        var cv = document.createElement('canvas');
        cv.width = cv.height = size;
        var ctx = cv.getContext('2d');
        var cx = size / 2, cy = size / 2, r = size / 2;

        /* 베이스 그라디언트: 더 밝은 실버 */
        var radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        radGrad.addColorStop(0.00, '#cdd0d5');
        radGrad.addColorStop(0.20, '#c2c6cc');
        radGrad.addColorStop(0.50, '#b5b9c0');
        radGrad.addColorStop(0.75, '#a8acb3');
        radGrad.addColorStop(1.00, '#9a9ea5');
        ctx.fillStyle = radGrad;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();

        /* 동심원 헤어라인: 확 벌어진 불균일 감김 */
        var pos = 2;
        while (pos < r) {
          /* 간격: 2~8px — 확실히 듬성듬성 */
          var gap = 2.0 + Math.random() * 6.0;
          /* 20% 확률로 큰 틈 — 감김이 크게 벌어진 느낌 */
          if (Math.random() < 0.20) gap += 4.0 + Math.random() * 8.0;
          pos += gap;
          if (pos >= r) break;

          var rnd = Math.random();
          var isBright = rnd > 0.65;
          var alpha, color;

          if (isBright) {
            alpha = 0.08 + Math.random() * 0.16;
            color = '255,255,255';
          } else {
            alpha = 0.06 + Math.random() * 0.18;
            color = '10,18,28';
          }

          ctx.strokeStyle = 'rgba(' + color + ',' + alpha.toFixed(3) + ')';
          ctx.lineWidth = 0.4 + Math.random() * 0.8;
          var arcStart = Math.random() * 0.2;
          var arcEnd = Math.PI * 2 - Math.random() * 0.2;
          ctx.beginPath(); ctx.arc(cx, cy, pos, arcStart, arcEnd); ctx.stroke();
        }

        /* 두꺼운 층 경계선 (코일 시트 가장자리) — 간헐적 */
        pos = 8;
        while (pos < r) {
          pos += 6 + Math.random() * 18;
          if (pos >= r) break;
          if (Math.random() < 0.35) {
            ctx.strokeStyle = 'rgba(10,15,25,' + (0.08 + Math.random() * 0.12).toFixed(3) + ')';
            ctx.lineWidth = 0.6 + Math.random() * 0.8;
            ctx.beginPath(); ctx.arc(cx, cy, pos, 0, Math.PI * 2); ctx.stroke();
          }
        }

        /* (하이라이트는 조명으로 처리) */

        ctx.restore();
        return { canvas: cv, ctx: ctx };
      }

      /* ════════════════════════════════════════════════════
         사이드 레이어 밴딩 텍스처 생성
         ════════════════════════════════════════════════════ */
      function buildSideCanvas(w, h) {
        var cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        var ctx = cv.getContext('2d');

        /* 베이스: 밝은 스틸 그레이 */
        ctx.fillStyle = '#c0c4ca';
        ctx.fillRect(0, 0, w, h);

        /* 수직 그라디언트: 상단 밝음 → 하단 어두움 */
        var vGrad = ctx.createLinearGradient(0, 0, 0, h);
        vGrad.addColorStop(0.00, 'rgba(255,255,255,0.25)');
        vGrad.addColorStop(0.30, 'rgba(255,255,255,0.08)');
        vGrad.addColorStop(0.55, 'rgba(0,0,0,0.00)');
        vGrad.addColorStop(0.80, 'rgba(0,0,0,0.10)');
        vGrad.addColorStop(1.00, 'rgba(0,0,0,0.25)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, w, h);

        /* 1차 헤어라인: 촘촘한 수평선 (강도 낮춤) */
        var lineCount = 400;
        for (var i = 0; i < lineCount; i++) {
          var y = (i / lineCount) * h;
          var a = 0.02 + Math.random() * 0.03;
          var bright = Math.random() < 0.4;
          ctx.strokeStyle = bright
            ? 'rgba(255,255,255,' + a + ')'
            : 'rgba(10,15,25,' + (a * 0.6) + ')';
          ctx.lineWidth = 0.2 + Math.random() * 0.4;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        /* 2차 헤어라인: 불규칙한 긁힘 자국 */
        for (var j = 0; j < 600; j++) {
          var y2 = Math.random() * h;
          var xStart = Math.random() * w * 0.3;
          var xEnd = xStart + w * 0.3 + Math.random() * w * 0.5;
          var a2 = 0.01 + Math.random() * 0.04;
          ctx.strokeStyle = Math.random() < 0.5
            ? 'rgba(255,255,255,' + a2 + ')'
            : 'rgba(0,0,10,' + a2 + ')';
          ctx.lineWidth = 0.2 + Math.random() * 0.3;
          ctx.beginPath();
          ctx.moveTo(xStart, y2 + (Math.random() - 0.5) * 0.5);
          ctx.lineTo(xEnd, y2 + (Math.random() - 0.5) * 0.5);
          ctx.stroke();
        }

        /* 하이라이트 밴드: 코일 표면의 광택 줄기 */
        for (var b = 0; b < 8; b++) {
          var by = Math.random() * h;
          var bh = 2 + Math.random() * 6;
          var bGrad = ctx.createLinearGradient(0, by, 0, by + bh);
          bGrad.addColorStop(0, 'rgba(255,255,255,0)');
          bGrad.addColorStop(0.5, 'rgba(255,255,255,' + (0.06 + Math.random() * 0.12) + ')');
          bGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = bGrad;
          ctx.fillRect(0, by, w, bh);
        }

        /* 미세 그레인 노이즈: 금속 표면의 입자감 */
        var imgData = ctx.getImageData(0, 0, w, h);
        var data = imgData.data;
        for (var p = 0; p < data.length; p += 4) {
          var noise = (Math.random() - 0.5) * 12;
          data[p] = Math.max(0, Math.min(255, data[p] + noise));
          data[p + 1] = Math.max(0, Math.min(255, data[p + 1] + noise));
          data[p + 2] = Math.max(0, Math.min(255, data[p + 2] + noise));
        }
        ctx.putImageData(imgData, 0, 0);

        return cv;
      }

      /* ════════════════════════════════════════════════════
         내벽 텍스처: 아주 미세한 헤어라인 + 부드러운 그라데이션
         ════════════════════════════════════════════════════ */
      function buildBoreCanvas(w, h) {
        var cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        var ctx = cv.getContext('2d');

        /* 베이스: 밝은 스틸 그레이 */
        ctx.fillStyle = '#c8ccd2';
        ctx.fillRect(0, 0, w, h);

        /* 부드러운 수직 그라데이션 */
        var vGrad = ctx.createLinearGradient(0, 0, 0, h);
        vGrad.addColorStop(0.0, 'rgba(255,255,255,0.15)');
        vGrad.addColorStop(0.5, 'rgba(0,0,0,0.0)');
        vGrad.addColorStop(1.0, 'rgba(0,0,0,0.12)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, w, h);

        /* 아주 미세한 헤어라인 */
        for (var i = 0; i < 150; i++) {
          var y = (i / 150) * h;
          var a = 0.01 + Math.random() * 0.015;
          ctx.strokeStyle = Math.random() < 0.4
            ? 'rgba(255,255,255,' + a + ')'
            : 'rgba(10,15,25,' + a + ')';
          ctx.lineWidth = 0.15 + Math.random() * 0.2;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        return cv;
      }

      /* ════════════════════════════════════════════════════
         Fixed position wrapper + Canvas
         ════════════════════════════════════════════════════ */
      var fixedWrap = document.getElementById('coil-3d-fixed');
      if (!fixedWrap) {
        fixedWrap = document.createElement('div');
        fixedWrap.id = 'coil-3d-fixed';
        /* orbital-wrapper 안에 absolute로 배치 (top:0 = 섹션 시작점) */
        var orbWrap = document.getElementById('orbital-wrapper');
        if (orbWrap) {
          orbWrap.appendChild(fixedWrap);
        } else {
          document.body.appendChild(fixedWrap);
        }
      }
      var canvas3d = document.createElement('canvas');
      fixedWrap.innerHTML = '';
      fixedWrap.appendChild(canvas3d);


      /* ── 미세 색보정 ── */
      /* canvas CSS 필터 제거 — alpha 캔버스에서 프린징 유발 */

      /* ════════════════════════════════════════════════════
         THREE.JS 기본 설정
         ════════════════════════════════════════════════════ */
      var isMobile = window.innerWidth <= 1023;
      var renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: !isMobile, alpha: true, premultipliedAlpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 3));
      renderer.setClearColor(0x000000, 0); /* 완전 투명 */
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.10;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = isMobile ? THREE.PCFSoftShadowMap : THREE.VSMShadowMap;

      var scene = new THREE.Scene();
      window._scene = scene;
      var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.3, 3.8);
      camera.lookAt(0, 0, 0);

      /* ════════════════════════════════════════════════════
         스튜디오 환경 맵 생성 (프리미엄 스튜디오)
         ════════════════════════════════════════════════════ */
      (function buildEnvMap() {
        try {
          var W = 2048, H = 1024;
          var envCv = document.createElement('canvas');
          envCv.width = W; envCv.height = H;
          var ectx = envCv.getContext('2d');

          /* 깊은 어둠 배경 */
          ectx.fillStyle = '#020304';
          ectx.fillRect(0, 0, W, H);

          /* ━━━ 메인 소프트박스 (좌상단, 크고 부드러움) ━━━ */
          var mainBox = ectx.createRadialGradient(
            W * 0.22, H * 0.28, 0, W * 0.22, H * 0.28, W * 0.30
          );
          mainBox.addColorStop(0.00, 'rgba(255,252,248,1.00)');
          mainBox.addColorStop(0.10, 'rgba(255,250,245,0.95)');
          mainBox.addColorStop(0.30, 'rgba(240,238,235,0.65)');
          mainBox.addColorStop(0.55, 'rgba(180,185,195,0.25)');
          mainBox.addColorStop(0.80, 'rgba(80,90,110,0.06)');
          mainBox.addColorStop(1.00, 'rgba(0,0,0,0)');
          ectx.fillStyle = mainBox;
          ectx.fillRect(0, 0, W, H);

          /* ━━━ 보조 소프트박스 (우측, 쿨톤) ━━━ */
          var fillBox = ectx.createRadialGradient(
            W * 0.78, H * 0.35, 0, W * 0.78, H * 0.35, W * 0.20
          );
          fillBox.addColorStop(0.00, 'rgba(220,230,250,0.60)');
          fillBox.addColorStop(0.40, 'rgba(180,195,220,0.30)');
          fillBox.addColorStop(1.00, 'rgba(0,0,0,0)');
          ectx.fillStyle = fillBox;
          ectx.fillRect(0, 0, W, H);

          /* ━━━ 수평 스트립라이트 (넓은 띠 — 옆면 반사) ━━━ */
          var strip1 = ectx.createLinearGradient(0, H * 0.40, 0, H * 0.58);
          strip1.addColorStop(0.00, 'rgba(0,0,0,0)');
          strip1.addColorStop(0.15, 'rgba(210,218,235,0.35)');
          strip1.addColorStop(0.40, 'rgba(250,250,255,0.80)');
          strip1.addColorStop(0.50, 'rgba(255,255,255,1.00)');
          strip1.addColorStop(0.60, 'rgba(250,250,255,0.80)');
          strip1.addColorStop(0.85, 'rgba(210,218,235,0.35)');
          strip1.addColorStop(1.00, 'rgba(0,0,0,0)');
          ectx.fillStyle = strip1;
          ectx.fillRect(0, H * 0.38, W, H * 0.22);

          /* ━━━ 하단 바닥 반사 (약한 워밍) ━━━ */
          var floor = ectx.createLinearGradient(0, H * 0.75, 0, H);
          floor.addColorStop(0.00, 'rgba(0,0,0,0)');
          floor.addColorStop(0.40, 'rgba(40,35,30,0.15)');
          floor.addColorStop(1.00, 'rgba(25,22,18,0.30)');
          ectx.fillStyle = floor;
          ectx.fillRect(0, H * 0.75, W, H * 0.25);

          /* ━━━ 상단 엣지 림라이트 ━━━ */
          var topRim = ectx.createLinearGradient(0, 0, 0, H * 0.12);
          topRim.addColorStop(0.00, 'rgba(200,210,230,0.25)');
          topRim.addColorStop(1.00, 'rgba(0,0,0,0)');
          ectx.fillStyle = topRim;
          ectx.fillRect(0, 0, W, H * 0.12);

          /* ━━━ 작은 하이라이트 포인트 (스페큘러 핀포인트) ━━━ */
          var pinLight = ectx.createRadialGradient(
            W * 0.35, H * 0.42, 0, W * 0.35, H * 0.42, W * 0.04
          );
          pinLight.addColorStop(0.00, 'rgba(255,255,255,0.90)');
          pinLight.addColorStop(0.50, 'rgba(255,255,255,0.30)');
          pinLight.addColorStop(1.00, 'rgba(0,0,0,0)');
          ectx.fillStyle = pinLight;
          ectx.fillRect(W * 0.25, H * 0.35, W * 0.2, H * 0.15);

          window._envCanvas = envCv; /* GUI 토글용 */

          var envTex = new THREE.CanvasTexture(envCv);
          envTex.mapping = THREE.EquirectangularReflectionMapping;
          envTex.encoding = THREE.sRGBEncoding;

          var pmrem = new THREE.PMREMGenerator(renderer);
          pmrem.compileEquirectangularShader();
          var envRT = pmrem.fromEquirectangular(envTex);
          window._proceduralEnvTex = envRT.texture; /* 프로시저럴 보관 */
          scene.environment = envRT.texture;
          envTex.dispose();
          pmrem.dispose();
        } catch (e) { console.warn('EnvMap skipped:', e); }
        renderer.setRenderTarget(null);

        /* ── HDRI 환경맵 로드 (workshop) ── */
        try {
          new THREE.RGBELoader()
            .setDataType(THREE.UnsignedByteType)
            .load('assets/main/workshop.hdr', function (hdrTex) {
              var pmrem2 = new THREE.PMREMGenerator(renderer);
              pmrem2.compileEquirectangularShader();
              var hdrRT = pmrem2.fromEquirectangular(hdrTex);
              scene.environment = hdrRT.texture;
              window._hdriEnvTex = hdrRT.texture;
              hdrTex.dispose();
              pmrem2.dispose();
              renderer.setRenderTarget(null);
            });
        } catch (e) { console.warn('HDRI load skipped:', e); }
      })();

      /* ════════════════════════════════════════════════════
         조명 — 최소화. 환경맵이 반사를 담당.
         ════════════════════════════════════════════════════ */
      var ambientLight = new THREE.AmbientLight(0x8898a8, 0.10);
      scene.add(ambientLight);

      /* 좌상단광: 환경맵의 밝은 영역과 같은 방향으로 보강 */
      var keyLight = new THREE.DirectionalLight(0xffffff, 1.80);
      keyLight.position.set(0, 2.5, 1.7);
      keyLight.castShadow = true;
      var shadowRes = isMobile ? 512 : 2048;
      keyLight.shadow.mapSize.width = shadowRes;
      keyLight.shadow.mapSize.height = shadowRes;
      keyLight.shadow.camera.near = 0.1;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.camera.left = -5;
      keyLight.shadow.camera.right = 5;
      keyLight.shadow.camera.top = 5;
      keyLight.shadow.camera.bottom = -5;
      keyLight.shadow.bias = -0.001;
      keyLight.shadow.normalBias = 0.05;
      keyLight.shadow.radius = 8;
      scene.add(keyLight);

      /* 안쪽 엣지 보강 */
      var rimLight = new THREE.DirectionalLight(0xd0dce8, 0.40);
      rimLight.position.set(0, 0, -3);
      scene.add(rimLight);

      /* 옆면 수직 스트립 */
      THREE.RectAreaLightUniformsLib.init();
      var sideLight = new THREE.RectAreaLight(0xffffff, 12.0, 0.3, 3.0);
      sideLight.position.set(2.5, 0, 1.5);
      sideLight.lookAt(0, 0, 0);
      scene.add(sideLight);

      /* 앞면 대각선 라이트 — yawGroup에 나중에 추가 (코일과 동행) */
      var diagLight = new THREE.RectAreaLight(0xffffff, 1.0, 12.0, 0.22);
      diagLight.position.set(-1.4, -0.7, 1.3);
      diagLight.lookAt(0, 0, 0);
      diagLight.rotation.z = 0.90;
      /* scene.add 하지 않음 — yawGroup에 추가 */

      var diagLight3 = new THREE.RectAreaLight(0xf0f4ff, 22.0, 20.0, 0.25);
      diagLight3.position.set(-0.3, 0.9, 1.3);
      diagLight3.lookAt(0, 0, 0);
      diagLight3.rotation.z = 0.20;

      /* 중앙 고정용: 사선 빛 */
      var centerDiag = new THREE.RectAreaLight(0xffffff, 1.0, 20.0, 0.3);
      centerDiag.position.set(0, 0.3, 1.5);
      centerDiag.lookAt(0, 0, 0);
      centerDiag.rotation.z = -1.6;
      scene.add(centerDiag);

      window._coilLights = {
        ambient: ambientLight,
        keyLight: keyLight,
        rimLight: rimLight,
        sideLight: sideLight,
        diagLight: diagLight,
        diagLight3: diagLight3,
        centerDiag: centerDiag
      };

      /* ════════════════════════════════════════════════════
         텍스처 + 재질
         ════════════════════════════════════════════════════ */
      var capData = buildCapCanvas(2048);
      var capTex = new THREE.CanvasTexture(capData.canvas);
      capTex.encoding = THREE.sRGBEncoding;

      var STEEL_COLOR = 0xBABDC3;

      /* ── 절차적 노멀맵: 방향성 미세 스크래치 ── */
      function buildScratchNormalMap(w, h, scratchCount, horizontal) {
        var cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        var ctx = cv.getContext('2d');
        ctx.fillStyle = 'rgb(128,128,255)';
        ctx.fillRect(0, 0, w, h);

        /* 다양한 굵기/길이의 불규칙 스크래치 */
        for (var i = 0; i < scratchCount; i++) {
          var x = Math.random() * w;
          var y = Math.random() * h;
          var len = 8 + Math.random() * 160;
          var angle = horizontal
            ? (Math.random() - 0.5) * 0.6 + (Math.random() < 0.08 ? (Math.random() - 0.5) * 1.5 : 0)
            : Math.random() * Math.PI;
          var bright = 128 + (Math.random() - 0.5) * 30;

          ctx.strokeStyle = 'rgb(' + Math.round(bright) + ',' + Math.round(128 + (Math.random() - 0.5) * 14) + ',255)';
          ctx.lineWidth = 0.2 + Math.random() * 0.9;
          ctx.globalAlpha = 0.15 + Math.random() * 0.55;
          ctx.beginPath();
          ctx.moveTo(x, y);
          /* 살짝 구부러진 곡선 */
          var mx = x + Math.cos(angle) * len * 0.5 + (Math.random() - 0.5) * 6;
          var my = y + Math.sin(angle) * len * 0.5 + (Math.random() - 0.5) * 6;
          var ex = x + Math.cos(angle) * len;
          var ey = y + Math.sin(angle) * len;
          ctx.quadraticCurveTo(mx, my, ex, ey);
          ctx.stroke();
        }
        /* 깊은 강한 스크래치 소수 추가 */
        for (var j = 0; j < Math.floor(scratchCount * 0.05); j++) {
          var x2 = Math.random() * w;
          var y2 = Math.random() * h;
          var len2 = 60 + Math.random() * 200;
          var angle2 = horizontal ? (Math.random() - 0.5) * 0.25 : Math.random() * Math.PI;
          ctx.strokeStyle = 'rgb(' + Math.round(128 + (Math.random() - 0.5) * 40) + ',128,255)';
          ctx.lineWidth = 0.8 + Math.random() * 1.2;
          ctx.globalAlpha = 0.5 + Math.random() * 0.3;
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 + Math.cos(angle2) * len2, y2 + Math.sin(angle2) * len2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        return cv;
      }
      function buildCapNormalMap(size) {
        var cv = document.createElement('canvas');
        cv.width = size; cv.height = size;
        var ctx = cv.getContext('2d');
        /* 기본 플랫 노멀 */
        ctx.fillStyle = 'rgb(128,128,255)';
        ctx.fillRect(0, 0, size, size);

        var cx = size / 2, cy = size / 2;
        var maxR = size / 2;

        /* 코일 층 경계 — 각 층마다 단차(step)를 노멀로 표현 */
        var layerPos = 4;
        while (layerPos < maxR) {
          /* 층 간격: 불규칙 (강판 두께 변화) */
          var layerGap = 1.0 + Math.random() * 3.5;
          layerPos += layerGap;
          if (layerPos >= maxR) break;

          /* 단차 폭: 0.8~2.0px */
          var stepW = 1.4 * (0.8 + Math.random() * 0.4);
          var stepStrength = 8 * (0.7 + Math.random() * 0.6);

          /* 안쪽 밝은 면 (노멀이 안쪽을 향함 → R > 128) */
          ctx.strokeStyle = 'rgb(' + Math.round(128 + stepStrength) + ',128,255)';
          ctx.lineWidth = stepW;
          ctx.globalAlpha = 0.7 + Math.random() * 0.3;
          ctx.beginPath();
          ctx.arc(cx, cy, layerPos - stepW * 0.5, 0, Math.PI * 2);
          ctx.stroke();

          /* 바깥쪽 어두운 면 (노멀이 바깥을 향함 → R < 128) */
          ctx.strokeStyle = 'rgb(' + Math.round(128 - stepStrength) + ',128,255)';
          ctx.lineWidth = stepW;
          ctx.beginPath();
          ctx.arc(cx, cy, layerPos + stepW * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        }


        ctx.globalAlpha = 1;
        return cv;
      }

      /* ── 러프니스 변화맵: 미세한 광택 차이 ── */
      function buildRoughnessMap(w, h) {
        var cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        var ctx = cv.getContext('2d');
        /* 기본 회색 (0.5 = 기본 roughness) */
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, w, h);
        /* 부드러운 밝기 변화: 큰 패치 단위 */
        for (var i = 0; i < 60; i++) {
          var x = Math.random() * w;
          var y = Math.random() * h;
          var r = 30 + Math.random() * 80;
          var v = 120 + Math.random() * 16;
          var grad = ctx.createRadialGradient(x, y, 0, x, y, r);
          grad.addColorStop(0, 'rgba(' + Math.round(v) + ',' + Math.round(v) + ',' + Math.round(v) + ',0.3)');
          grad.addColorStop(1, 'rgba(128,128,128,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
        return cv;
      }

      var capNormCv = buildCapNormalMap(1024);
      window._capNormCv = capNormCv;
      var sideNormCv = buildScratchNormalMap(512, 256, 400, true);
      var roughCv = buildRoughnessMap(512, 512);

      /* 원본 이미지 데이터 캐시 (노이즈 적용 전) */
      var _origCapData = capNormCv.getContext('2d').getImageData(0, 0, 1024, 1024);
      var _origSideData = sideNormCv.getContext('2d').getImageData(0, 0, 512, 256);
      var _origRoughData = roughCv.getContext('2d').getImageData(0, 0, 512, 512);

      var capNormTex = new THREE.CanvasTexture(capNormCv);
      window._capNormTex = capNormTex;
      var sideNormTex = new THREE.CanvasTexture(sideNormCv);
      sideNormTex.wrapS = THREE.RepeatWrapping;
      sideNormTex.wrapT = THREE.ClampToEdgeWrapping;
      sideNormTex.repeat.set(3, 1);

      var roughMapTex = new THREE.CanvasTexture(roughCv);

      /* 노이즈 강도 실시간 재적용 */
      window._noiseStrength = 1.0;
      window._reapplyNoise = function (strength) {
        /* cap normal */
        var ctx1 = capNormCv.getContext('2d');
        var d1 = ctx1.createImageData(1024, 1024);
        var s1 = _origCapData.data, t1 = d1.data;
        var n = strength * 10;
        for (var i = 0; i < s1.length; i += 4) {
          var noise = (Math.random() - 0.5) * n;
          t1[i] = Math.max(0, Math.min(255, s1[i] + noise));
          t1[i + 1] = Math.max(0, Math.min(255, s1[i + 1] + noise));
          t1[i + 2] = s1[i + 2]; t1[i + 3] = s1[i + 3];
        }
        ctx1.putImageData(d1, 0, 0);
        capNormTex.needsUpdate = true;

        /* side normal */
        var ctx2 = sideNormCv.getContext('2d');
        var d2 = ctx2.createImageData(512, 256);
        var s2 = _origSideData.data, t2 = d2.data;
        var n2 = strength * 12;
        for (var i = 0; i < s2.length; i += 4) {
          var noise = (Math.random() - 0.5) * n2;
          t2[i] = Math.max(0, Math.min(255, s2[i] + noise));
          t2[i + 1] = Math.max(0, Math.min(255, s2[i + 1] + noise));
          t2[i + 2] = s2[i + 2]; t2[i + 3] = s2[i + 3];
        }
        ctx2.putImageData(d2, 0, 0);
        sideNormTex.needsUpdate = true;

        /* roughness */
        var ctx3 = roughCv.getContext('2d');
        var d3 = ctx3.createImageData(512, 512);
        var s3 = _origRoughData.data, t3 = d3.data;
        var n3 = strength * 30;
        for (var i = 0; i < s3.length; i += 4) {
          var noise = (Math.random() - 0.5) * n3;
          t3[i] = Math.max(0, Math.min(255, s3[i] + noise));
          t3[i + 1] = Math.max(0, Math.min(255, s3[i + 1] + noise));
          t3[i + 2] = Math.max(0, Math.min(255, s3[i + 2] + noise));
          t3[i + 3] = s3[i + 3];
        }
        ctx3.putImageData(d3, 0, 0);
        roughMapTex.needsUpdate = true;
      };
      window._reapplyNoise(0); /* 기본: 노이즈 없음 */

      var matCap = new THREE.MeshPhysicalMaterial({
        map: capTex, color: 0xffffff,
        roughness: 0.30, metalness: 0.85, envMapIntensity: 2.5,
        clearcoat: 0.50, clearcoatRoughness: 0.04,
        normalMap: capNormTex, normalScale: new THREE.Vector2(0.35, 0.35),
        roughnessMap: roughMapTex
      });

      var sideCv = buildSideCanvas(1024, 256);
      var sideTex = new THREE.CanvasTexture(sideCv);
      sideTex.encoding = THREE.sRGBEncoding;
      sideTex.wrapS = THREE.RepeatWrapping;
      sideTex.wrapT = THREE.ClampToEdgeWrapping;
      sideTex.repeat.set(3, 1);

      /* 외벽 요철용 범프맵 */
      var bumpCv = document.createElement('canvas');
      bumpCv.width = 512; bumpCv.height = 256;
      var bumpCtx = bumpCv.getContext('2d');
      bumpCtx.fillStyle = '#808080';
      bumpCtx.fillRect(0, 0, 512, 256);
      /* 수평 띠 형태 요철 — 코일 감김 경계 */
      for (var bi = 0; bi < 256; bi++) {
        var bv = 128 + (Math.random() - 0.5) * 30;
        if (Math.random() < 0.06) bv += (Math.random() - 0.5) * 60;
        bumpCtx.fillStyle = 'rgb(' + Math.round(bv) + ',' + Math.round(bv) + ',' + Math.round(bv) + ')';
        bumpCtx.fillRect(0, bi, 512, 1);
      }
      var sideBumpTex = new THREE.CanvasTexture(bumpCv);
      sideBumpTex.wrapS = THREE.RepeatWrapping;
      sideBumpTex.wrapT = THREE.ClampToEdgeWrapping;
      sideBumpTex.repeat.set(3, 1);

      var matSide = new THREE.MeshPhysicalMaterial({
        map: sideTex, color: 0xffffff,
        roughness: 0.04, metalness: 0.85, envMapIntensity: 2.5,
        normalMap: sideNormTex, normalScale: new THREE.Vector2(0.15, 0.15),
        roughnessMap: roughMapTex,
        bumpMap: sideBumpTex, bumpScale: 0.002
      });

      /* 제품별 재질 프리셋 — 전체적으로 광택 강화 + 제품 간 차이 극대화 */
      var matPresets = {
        /* 니켈: 거울처럼 반짝이는 프리미엄 광택 */
        nickel: { capR: 0.20, capM: 0.95, capEnv: 3.5, capCC: 0.80, capNS: 0.35, sideR: 0.20, sideM: 0.95, sideEnv: 3.0 },
        /* 냉연: 새틴 피니시 — 약간 무광 */
        coldRoll: { capR: 0.45, capM: 0.88, capEnv: 0.4, capCC: 0.0, capNS: 0.35, sideR: 0.40, sideM: 0.88, sideEnv: 0.5 },
        /* QT: 산업용 강판 — 어둡고 거친 느낌 */
        qt: { capR: 0.50, capM: 0.70, capEnv: 0.0, capCC: 0.0, capNS: 0.35, sideR: 0.55, sideM: 0.70, sideEnv: 0.0 },
        /* */
        hero: { capR: 0.30, capM: 0.85, capEnv: 2.5, capCC: 0.50, capNS: 0.35, sideR: 0.04, sideM: 0.85, sideEnv: 2.5 }
      };
      window._matPresets = matPresets;
      function applyMatPreset(name) {
        var p = matPresets[name]; if (!p) return;
        if (window._matLock) return;
        matCap.roughness = p.capR; matCap.metalness = p.capM;
        var em = (name === 'hero') ? 1.0 : (window._envMultiplier || 1.0);
        matCap.envMapIntensity = p.capEnv * em;
        matCap._presetR = p.capR;
        matCap._presetEnv = p.capEnv;
        matCap.clearcoat = p.capCC; matCap.clearcoatRoughness = 0.20;
        if (p.capNS !== undefined) matCap.normalScale.set(p.capNS, p.capNS);
        matSide.roughness = p.sideR; matSide.metalness = p.sideM;
        matSide.envMapIntensity = p.sideEnv * em;
        matSide._presetEnv = p.sideEnv;
        /* bore도 동기화 (GUI 잠금 아닐 때만) */
        if (!window._boreLock) {
          matBore.roughness = Math.max(p.sideR + 0.05, 0.20);
          matBore.metalness = p.sideM;
          matBore.envMapIntensity = 0.1;
        }

      }
      window._applyMatPreset = applyMatPreset;
      function lerpMatPreset(from, to, t) {
        var a = matPresets[from], b = matPresets[to]; if (!a || !b) return;
        if (window._matLock) return;
        var _l = function (x, y, u) { return x + (y - x) * u; };
        matCap.roughness = _l(a.capR, b.capR, t);
        matCap._presetR = _l(a.capR, b.capR, t);
        matCap.metalness = _l(a.capM, b.capM, t);
        var em = window._envMultiplier || 1.0;
        matCap.envMapIntensity = _l(a.capEnv, b.capEnv, t) * em;
        matCap._presetEnv = _l(a.capEnv, b.capEnv, t);
        matCap.clearcoat = _l(a.capCC, b.capCC, t);
        if (a.capNS !== undefined && b.capNS !== undefined) matCap.normalScale.set(_l(a.capNS, b.capNS, t), _l(a.capNS, b.capNS, t));
        matSide.roughness = _l(a.sideR, b.sideR, t);
        matSide.metalness = _l(a.sideM, b.sideM, t);
        matSide.envMapIntensity = _l(a.sideEnv, b.sideEnv, t) * em;
        matSide._presetEnv = _l(a.sideEnv, b.sideEnv, t);
        /* bore도 동기화 (GUI 잠금 아닐 때만) */
        if (!window._boreLock) {
          matBore.roughness = Math.max(_l(a.sideR, b.sideR, t) + 0.05, 0.20);
          matBore.metalness = _l(a.sideM, b.sideM, t);
          matBore.envMapIntensity = 0.1;
        }

      }

      /* 안쪽 내벽: 사이드 텍스쳐 공유 + 노멀맵으로 디테일 */
      var boreTex = new THREE.CanvasTexture(buildBoreCanvas(512, 128));
      boreTex.encoding = THREE.sRGBEncoding;
      boreTex.wrapS = THREE.RepeatWrapping;
      boreTex.wrapT = THREE.ClampToEdgeWrapping;
      boreTex.repeat.set(2, 1);
      /* bore용 노멀맵 (사이드와 공유, 별도 repeat) */
      var boreNormTex = new THREE.CanvasTexture(buildScratchNormalMap(512, 256, 300, true));
      boreNormTex.wrapS = THREE.RepeatWrapping;
      boreNormTex.wrapT = THREE.ClampToEdgeWrapping;
      boreNormTex.repeat.set(2, 1);
      var matBore = new THREE.MeshPhysicalMaterial({
        map: boreTex, color: 0xb8bcc4, roughness: 0.25, metalness: 0.85,
        envMapIntensity: 0.1, side: THREE.BackSide,
        normalMap: boreNormTex, normalScale: new THREE.Vector2(0.20, 0.20)
      });

      /* */
      window._coilMats = {
        cap: matCap, side: matSide, bore: matBore,
        _capNorm: capNormTex, _sideNorm: sideNormTex, _roughMap: roughMapTex
      };

      /* ════════════════════════════════════════════════════
         구멍 뚫린 원통 형태 구성
         ════════════════════════════════════════════════════ */
      var SCALE = 1.5 / 3;
      var OUTER_R = 1.0 * SCALE;
      var INNER_R = OUTER_R * 0.48;
      var MAIN_H = 1.05 * SCALE;

      var yawGroup = new THREE.Group();
      var orientGroup = new THREE.Group();
      var rollGroup = new THREE.Group();

      orientGroup.rotation.x = -Math.PI / 2;
      orientGroup.position.x = OUTER_R;
      yawGroup.add(orientGroup);
      orientGroup.add(rollGroup);
      scene.add(yawGroup);

      /* 대각선 라이트를 yawGroup에 추가 → 코일과 함께 이동 */
      yawGroup.add(diagLight);
      yawGroup.add(diagLight3);
      /* keyLight도 yawGroup에 → 그림자가 코일 따라감 */
      yawGroup.add(keyLight);
      yawGroup.add(keyLight.target);

      /* 바깥쪽 큰 벽 */
      var WALL_EXT = 0.008;
      var outerWall = new THREE.Mesh(
        new THREE.CylinderGeometry(OUTER_R, OUTER_R, MAIN_H, 128, 1, true), matSide
      );
      outerWall.castShadow = false;
      rollGroup.add(outerWall);

      /* 앞면 뚜껑 — 내경을 챔퍼 끝에 맞춤 */
      var BEVEL_R = 0.015 * SCALE;
      var topCapMesh = new THREE.Mesh(new THREE.RingGeometry(INNER_R + BEVEL_R - 0.002, OUTER_R + 0.004, 128, 1), matCap);
      topCapMesh.rotation.x = -Math.PI / 2;
      topCapMesh.position.y = MAIN_H / 2;
      topCapMesh.castShadow = false;
      rollGroup.add(topCapMesh);

      /* 뒷면 뚜껑 */
      var botCapMesh = new THREE.Mesh(new THREE.RingGeometry(INNER_R + BEVEL_R - 0.002, OUTER_R + 0.004, 128, 1), matCap);
      botCapMesh.rotation.x = Math.PI / 2;
      botCapMesh.position.y = -MAIN_H / 2;
      botCapMesh.castShadow = false;
      rollGroup.add(botCapMesh);

      /* ── 고정 스트랩 밴드 (외벽 둘레 / 벨트 부분 돌출) ── */
      var STRAP_R = OUTER_R + 0.003;
      var STRAP_THICK = 0.003;       /* 물리 두께 (clipSurfR 계산용) */
      var BAND_WIDTH = 0.018;        /* 띠 너비 (코일 축 방향) — 70% */
      var BAND_DEPTH = 0.002;       /* 띠 두께 — 얇게 */
      var matStrap = matSide.clone();
      // matStrap.color.set(0x404448);
      matStrap.map = null;
      matStrap.normalMap = null;
      matStrap.roughnessMap = null;
      matStrap.roughness = 0.05;
      matStrap.metalness = 0.8;
      matStrap.needsUpdate = true;

      /* ── 벨트 클립 파라미터 ── */
      var _clipAngle = Math.PI * 1.52;
      var BULGE_AMOUNT = 0.01;
      var BULGE_WIDTH = Math.PI / 5;  /* 36° 양쪽 — 넓은 범위 */

      /* 커스텀 BufferGeometry — 두께 + 엣지 면 있는 금속 밴드 */
      function createFlatBandStrap(clipAngle) {
        var segs = 256;
        var halfW = BAND_WIDTH / 2;
        var halfD = BAND_DEPTH / 2;
        var R = STRAP_R;
        var H = BULGE_AMOUNT;

        var positions = [];
        var normals = [];
        var indices = [];

        for (var i = 0; i <= segs; i++) {
          var theta = (i / segs) * Math.PI * 2;
          var r = R;

          var diff = theta - clipAngle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          var absDiff = Math.abs(diff);

          if (absDiff < BULGE_WIDTH) {
            /* 파워 커브: 멀리서 천천히, 벨트 근처 급상승 → 팽팽한 느낌 */
            var t = 1.0 - absDiff / BULGE_WIDTH;
            r = R + H * t * t * t;
          }

          var cosT = Math.cos(theta), sinT = Math.sin(theta);
          var rO = r + halfD, rI = r - halfD;

          /* 0: outer -Z   1: outer +Z  (노멀: 방사 외향) */
          positions.push(rO * cosT, rO * sinT, -halfW);
          normals.push(cosT, sinT, 0);
          positions.push(rO * cosT, rO * sinT, halfW);
          normals.push(cosT, sinT, 0);
          /* 2: inner -Z   3: inner +Z  (노멀: 방사 내향) */
          positions.push(rI * cosT, rI * sinT, -halfW);
          normals.push(-cosT, -sinT, 0);
          positions.push(rI * cosT, rI * sinT, halfW);
          normals.push(-cosT, -sinT, 0);
          /* 4: outer +Z (edge)  5: inner +Z (edge)  (노멀: +Z) */
          positions.push(rO * cosT, rO * sinT, halfW);
          normals.push(0, 0, 1);
          positions.push(rI * cosT, rI * sinT, halfW);
          normals.push(0, 0, 1);
          /* 6: outer -Z (edge)  7: inner -Z (edge)  (노멀: -Z) */
          positions.push(rO * cosT, rO * sinT, -halfW);
          normals.push(0, 0, -1);
          positions.push(rI * cosT, rI * sinT, -halfW);
          normals.push(0, 0, -1);
        }

        for (var i = 0; i < segs; i++) {
          var b = i * 8, n = (i + 1) * 8;
          /* 외면 */
          indices.push(b, n, b + 1);
          indices.push(b + 1, n, n + 1);
          /* 내면 (역순) */
          indices.push(b + 2, b + 3, n + 2);
          indices.push(b + 3, n + 3, n + 2);
          /* 상단 엣지 +Z */
          indices.push(b + 4, n + 4, b + 5);
          indices.push(b + 5, n + 4, n + 5);
          /* 하단 엣지 -Z */
          indices.push(b + 6, b + 7, n + 6);
          indices.push(b + 7, n + 7, n + 6);
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geo.setIndex(indices);
        return new THREE.Mesh(geo, matStrap);
      }

      var strap1 = createFlatBandStrap(_clipAngle);
      strap1.rotation.x = Math.PI / 2;
      strap1.position.y = MAIN_H * 0.25;
      rollGroup.add(strap1);
      var strap2 = createFlatBandStrap(_clipAngle);
      strap2.rotation.x = Math.PI / 2;
      strap2.position.y = -MAIN_H * 0.25;
      rollGroup.add(strap2);
      window._matStrap = matStrap;
      window._strap1 = strap1;
      window._strap2 = strap2;

      /* ── 벨트 클립 (원래 디자인 — 판 + 플랜지) ── */
      var matClip = new THREE.MeshPhysicalMaterial({
        color: 0x0e0f12, roughness: 0.55, metalness: 0.85,
        clearcoat: 0.0, clearcoatRoughness: 0.5,
        envMapIntensity: 2.0
      });
      window._matClip = matClip;

      var clipSurfR = STRAP_R + STRAP_THICK;
      var _clipMeshes = [];

      function createClipMesh() {
        var g = new THREE.Group();
        var pw = 0.04 * SCALE;
        var ph = BAND_WIDTH + 0.004;
        var pd = 0.02;

        /* === 복합 결합 클립 (Industrial Seal Buckle) === */

        /* 1. 베이스 플레이트 — 넓은 하단 */
        var baseH = 0.0025;
        var base = new THREE.Mesh(
          new THREE.BoxGeometry(pw * 1.2, baseH, ph * 1.2), matClip
        );
        base.position.y = -pd * 0.35;
        g.add(base);

        /* 2. 양쪽 측벽 — 높은 벽 */
        var wallH = pd * 0.6;
        var wallT = 0.002;
        var wallGeo = new THREE.BoxGeometry(pw * 1.0, wallH, wallT);
        [-1, 1].forEach(function (s) {
          var w = new THREE.Mesh(wallGeo, matClip);
          w.position.z = s * ph * 0.55;
          w.position.y = -pd * 0.35 + baseH / 2 + wallH / 2;
          g.add(w);
        });

        /* 3. 상판 — 측벽 위를 덮는 판 */
        var topH = 0.003;
        var top = new THREE.Mesh(
          new THREE.BoxGeometry(pw * 1.05, topH, ph * 1.15), matClip
        );
        top.position.y = -pd * 0.35 + baseH + wallH;
        g.add(top);

        /* 4. 중앙 잠금 블록 — 상판 위 돌출 */
        var lockW = pw * 0.35;
        var lockH = 0.004;
        var lockD = ph * 0.5;
        var lock = new THREE.Mesh(
          new THREE.BoxGeometry(lockW, lockH, lockD), matClip
        );
        lock.position.y = -pd * 0.35 + baseH + wallH + topH / 2 + lockH / 2;
        g.add(lock);

        /* 5. 잠금 블록 위 래치 바 — 가로 방향 바 */
        var latchW = pw * 0.6;
        var latchH = 0.002;
        var latchD = lockD * 0.4;
        var latch = new THREE.Mesh(
          new THREE.BoxGeometry(latchW, latchH, latchD), matClip
        );
        latch.position.y = lock.position.y + lockH / 2 + latchH / 2;
        g.add(latch);

        /* 6. 양쪽 보강 거싯 — 측벽-베이스 모서리 삼각 보강 */
        var gusW = pw * 0.3;
        var gusH = wallH * 0.4;
        var gusT = wallT * 1.5;
        var gusGeo = new THREE.BoxGeometry(gusW, gusH, gusT);
        [-1, 1].forEach(function (sz) {
          [-1, 1].forEach(function (sx) {
            var gus = new THREE.Mesh(gusGeo, matClip);
            gus.position.x = sx * pw * 0.35;
            gus.position.z = sz * ph * 0.55;
            gus.position.y = -pd * 0.35 + baseH / 2 + gusH / 2;
            g.add(gus);
          });
        });

        /* 7. 가이드 핀 — 베이스 양쪽 끝 수직 돌기 */
        var pinW = 0.002;
        var pinH = wallH * 0.7;
        var pinD = 0.002;
        var pinGeo = new THREE.BoxGeometry(pinW, pinH, pinD);
        [-1, 1].forEach(function (s) {
          var pin = new THREE.Mesh(pinGeo, matClip);
          pin.position.x = s * pw * 0.55;
          pin.position.y = -pd * 0.35 + baseH / 2 + pinH / 2;
          g.add(pin);
        });

        /* 8. 내부 채널 릿지 — 베이스 위 스트랩 가이드용 돌기 */
        var ridgeW = pw * 0.8;
        var ridgeH = 0.001;
        var ridgeD = 0.002;
        var ridgeGeo = new THREE.BoxGeometry(ridgeW, ridgeH, ridgeD);
        [-1, 1].forEach(function (s) {
          var ridge = new THREE.Mesh(ridgeGeo, matClip);
          ridge.position.z = s * ph * 0.25;
          ridge.position.y = -pd * 0.35 + baseH + ridgeH / 2;
          g.add(ridge);
        });

        /* 9. 상판 슬롯 마크 — 어두운 홈 2개 */
        var slotMat = matClip.clone();
        slotMat.color.set(0x080810);
        var slotW = pw * 0.12;
        var slotH = topH * 1.01;
        var slotD = ph * 0.3;
        var slotGeo = new THREE.BoxGeometry(slotW, slotH, slotD);
        [-1, 1].forEach(function (s) {
          var slot = new THREE.Mesh(slotGeo, slotMat);
          slot.position.x = s * pw * 0.3;
          slot.position.y = top.position.y;
          g.add(slot);
        });

        return g;
      }

      var _clipRot = { x: 1.5, y: 0, z: -1.6 };

      function positionClip(clipMesh, strapY, angle) {
        var r = OUTER_R + 0.005;  /* 코일 외벽 표면에 밀착 */
        clipMesh.position.set(
          r * Math.cos(angle),
          strapY,
          r * Math.sin(angle)
        );
        clipMesh.rotation.order = 'YXZ';
        clipMesh.rotation.set(_clipRot.x, -angle + _clipRot.y, _clipRot.z);
      }

      window._clipRot = _clipRot;
      window._refreshClips = function () {
        _clipMeshes.forEach(function (c) { positionClip(c.mesh, c.y, _clipAngle); });
      };

      /* 스트랩 재생성 (클립 각도 변경 시) */
      function rebuildStraps(newAngle) {
        rollGroup.remove(strap1);
        rollGroup.remove(strap2);
        if (strap1.geometry) strap1.geometry.dispose();
        if (strap2.geometry) strap2.geometry.dispose();
        strap1 = createFlatBandStrap(newAngle);
        strap1.rotation.x = Math.PI / 2;
        strap1.position.y = MAIN_H * 0.25;
        rollGroup.add(strap1);
        strap2 = createFlatBandStrap(newAngle);
        strap2.rotation.x = Math.PI / 2;
        strap2.position.y = -MAIN_H * 0.25;
        rollGroup.add(strap2);
        window._strap1 = strap1;
        window._strap2 = strap2;
      }

      var clip1 = createClipMesh();
      positionClip(clip1, MAIN_H * 0.25, _clipAngle);
      rollGroup.add(clip1);
      _clipMeshes.push({ mesh: clip1, y: MAIN_H * 0.25 });

      var clip2 = createClipMesh();
      positionClip(clip2, -MAIN_H * 0.25, _clipAngle);
      rollGroup.add(clip2);
      _clipMeshes.push({ mesh: clip2, y: -MAIN_H * 0.25 });

      window._updateClipAngle = function (a) {
        _clipAngle = a;
        _clipMeshes.forEach(function (c) { positionClip(c.mesh, c.y, a); });
        rebuildStraps(a);
      };

      /* 안쪽 구멍 내벽 — 캡 면보다 양쪽 돌출 (틈 방지) */
      var innerWall = new THREE.Mesh(
        new THREE.CylinderGeometry(INNER_R, INNER_R, MAIN_H + WALL_EXT * 2, 64, 1, true), matBore
      );
      innerWall.castShadow = false;
      rollGroup.add(innerWall);

      /* 45도 챔퍼 — 내벽(INNER_R)에서 캡면으로 확장 */
      var matChamfer = matCap.clone();
      matChamfer.side = THREE.DoubleSide;

      /* 앞면 챔퍼 (카메라쪽) — 캡면(INNER_R+BEVEL_R)에서 내벽(INNER_R)으로 */
      var chamferPtsFront = [
        new THREE.Vector2(INNER_R, -MAIN_H / 2 + BEVEL_R),
        new THREE.Vector2(INNER_R + BEVEL_R, -MAIN_H / 2)
      ];
      var chamferFront = new THREE.Mesh(new THREE.LatheGeometry(chamferPtsFront, 128), matChamfer);
      chamferFront.castShadow = false;
      rollGroup.add(chamferFront);

      /* 뒷면 챔퍼 (바깥 향함) */
      var chamferPtsBack = [
        new THREE.Vector2(INNER_R + BEVEL_R, MAIN_H / 2),
        new THREE.Vector2(INNER_R, MAIN_H / 2 - BEVEL_R)
      ];
      var chamferBack = new THREE.Mesh(new THREE.LatheGeometry(chamferPtsBack, 128), matChamfer);
      chamferBack.castShadow = false;
      rollGroup.add(chamferBack);

      /* ── 솔리드 그림자 캐스터 (카메라에 안 보임, 그림자만) ── */
      var shadowCasterMat = new THREE.MeshBasicMaterial();
      shadowCasterMat.colorWrite = false;
      var shadowCaster = new THREE.Mesh(
        new THREE.CylinderGeometry(OUTER_R, OUTER_R, MAIN_H, 64, 1, false), shadowCasterMat
      );
      shadowCaster.castShadow = true;
      rollGroup.add(shadowCaster);

      /* ── 그림자 받는 바닥면 (코일과 함께 이동) ── */
      var shadowMat = new THREE.ShadowMaterial({ opacity: 0.3 });
      var shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10), shadowMat
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.set(0.0, -0.55, 0.0);
      shadowPlane.receiveShadow = true;
      shadowPlane.visible = false;
      yawGroup.add(shadowPlane);
      window._shadowPlane = shadowPlane;
      window._shadowMat = shadowMat;


      /* ════════════════════════════════════════════════════
         캔버스 = 뷰포트 전체. 위치/크기는 3D 씬에서 처리.
         ════════════════════════════════════════════════════ */
      /* 모바일: 초기 높이 캐시 — 브라우저 바 토글 시 리사이즈 방지 */
      var cachedMobileVh = null;
      function resize3d() {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        /* 모바일에서는 최초 높이 또는 너비 변경 시에만 높이 업데이트 */
        if (vw <= 1023) {
          if (cachedMobileVh === null) cachedMobileVh = vh;
          /* 너비가 바뀌면(회전) 높이도 갱신 */
          var widthChanged = (resize3d._prevVw && resize3d._prevVw !== vw);
          if (widthChanged) cachedMobileVh = vh;
          resize3d._prevVw = vw;
          vh = cachedMobileVh;
        }
        renderer.setSize(vw, vh, false);
        camera.aspect = vw / vh;
        /* 모바일: 화면이 좁을수록 FOV를 키워서 코일이 안 잘리게 */
        if (vw <= 1023) {
          /* 390px → FOV ~68°, 768px → FOV ~48° */
          camera.fov = Math.min(75, 42 + (1023 - vw) * 0.04);
        } else {
          camera.fov = 42;
        }
        camera.updateProjectionMatrix();
      }

      /* t=0: 화면 중앙(orbital), t=1: 오른쪽(product) — 카메라 X 오프셋으로 처리 */
      window._coilMoveT = 0;
      function updatePosition(t) {
        t = Math.max(0, Math.min(1, t));
        window._coilMoveT = t;
      }

      /* ════════════════════════════════════════════════════
         스크롤 애니메이션 파라미터 (원본 8단계 타임라인)
         ════════════════════════════════════════════════════ */
      var lerp3d = function (a, b, t) { return a + (b - a) * t; };
      var clamp01 = function (v) { return Math.max(0, Math.min(1, v)); };

      /* 색상 프리셋: 니켈(밝은 실버) → 냉연(중간 그레이) → QT(차콜) */
      var colorBase = new THREE.Color(0xE0E2E6);  /* 니켈: 밝고 깨끗한 실버 */
      var colorDark1 = new THREE.Color(0x9EA2AA); /* 냉연: 중성적 실버그레이 */
      var colorDark2 = new THREE.Color(0x3A3E46); /* QT: 짙은 그레이 (밝게 조정) */

      var deg0 = 0;
      var deg1 = -53 * (Math.PI / 180);
      var deg2 = -46 * (Math.PI / 180);
      var deg3 = -39 * (Math.PI / 180);

      var ROLL_END = Math.PI * 5.50;
      var _isMob = window.innerWidth <= 1023;
      var X_END = _isMob ? 0.6 : 0.5;
      var CAM_Y_START = 0.3, CAM_Y_END = _isMob ? 1.2 : 0.53;
      var CAM_Z_START = 2.8, CAM_Z_END = _isMob ? 3.2 : 2.7;

      /* ════════════════════════════════════════════════════
         window._coil3d 노출 + 렌더 루프
         ════════════════════════════════════════════════════ */
      /* 초기 재질: hero 프리셋 적용 */
      applyMatPreset('hero');

      window._coil3d = {
        _lastT: 0,
        render: function () {
          try { renderer.render(scene, camera); } catch (e) { }
        },
        updatePosition: function (t) {
          window._coil3d._lastT = t;
          updatePosition(t);
        },
        /* 8단계 타임라인 기반 회전 업데이트 */
        updateRotation: function (tRaw) {
          /* */
          var ov = window._coilOverrides || {};
          var _deg1 = ov.deg1 !== undefined ? ov.deg1 : deg1;
          var _deg2 = ov.deg2 !== undefined ? ov.deg2 : deg2;
          var _deg3 = ov.deg3 !== undefined ? ov.deg3 : deg3;
          var _CAM_Y_END = ov.camY !== undefined ? ov.camY : CAM_Y_END;
          var _CAM_Z_END = ov.camZ !== undefined ? ov.camZ : CAM_Z_END;
          var _lookAtY = ov.lookAtY !== undefined ? ov.lookAtY : (window.innerWidth <= 1023 ? 1.0 : -0.01);
          var _scale = ov.scale !== undefined ? ov.scale : 1.0;

          var currentYaw = 0, currentX = 0, currentZ = 0, currentRoll = 0;
          var camZOverride = null;

          if (tRaw < 0.10) {
            var localT = tRaw / 0.10;
            yawGroup.scale.setScalar(lerp3d(0.90 * 1.38, 1.38, localT));
            camZOverride = lerp3d(5.0, CAM_Z_START, localT);
            currentYaw = deg0; currentX = 0; currentRoll = 0;
            matSide.color.copy(colorBase);
            matCap.color.copy(colorBase);
            matBore.color.copy(colorBase);
            if (window._matStrap) window._matStrap.color.set(0x404448);
            applyMatPreset('hero');
          } else if (tRaw < 0.15) {
            yawGroup.scale.setScalar(1.38);
            camZOverride = CAM_Z_START;
            currentYaw = deg0; currentX = 0; currentRoll = 0;
            matSide.color.copy(colorBase);
            matCap.color.copy(colorBase);
            matBore.color.copy(colorBase);
            if (window._matStrap) window._matStrap.color.set(0x404448);
            applyMatPreset('hero');
          } else if (tRaw < 0.35) {
            var localT = clamp01((tRaw - 0.15) / 0.20);
            var m = localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;
            currentYaw = lerp3d(deg0, _deg1, m);
            currentX = lerp3d(0, X_END, m);
            currentRoll = lerp3d(0, ROLL_END, m);
            currentZ = lerp3d(0, 0.4, m);
            yawGroup.scale.setScalar(lerp3d(1.35, _scale, m));
            matSide.color.copy(colorBase);
            matCap.color.copy(colorBase);
            matBore.color.copy(colorBase);
            if (window._matStrap) window._matStrap.color.set(0x404448);
            lerpMatPreset('hero', 'nickel', m);
          } else if (tRaw < 0.67) {
            /* 니켈 → 냉연: 0.45~0.67 (텍스트 전환점 tRaw≈0.57 중심) */
            var localT = clamp01((tRaw - 0.45) / 0.22);
            localT = localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;
            if (window._snapMode) localT = clamp01((localT - 0.35) / 0.30);
            yawGroup.scale.setScalar(_scale);
            currentYaw = lerp3d(_deg1, _deg2, localT);
            currentX = X_END; currentZ = lerp3d(0.4, 0.4, localT); currentRoll = ROLL_END;
            matSide.color.lerpColors(colorBase, colorDark1, localT);
            matCap.color.lerpColors(colorBase, colorDark1, localT);
            matBore.color.lerpColors(colorBase, colorDark1, localT);
            if (window._matStrap) window._matStrap.color.lerpColors(new THREE.Color(0x404448), new THREE.Color(0x282830), localT);
            lerpMatPreset('nickel', 'coldRoll', localT);
          } else if (tRaw < 0.82) {
            /* 냉연 → QT: 0.67~0.82 (텍스트 전환점 tRaw≈0.78 중심) */
            var localT = clamp01((tRaw - 0.67) / 0.15);
            localT = localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;
            if (window._snapMode) localT = clamp01((localT - 0.35) / 0.30);
            yawGroup.scale.setScalar(_scale);
            currentYaw = lerp3d(_deg2, _deg3, localT);
            currentX = X_END; currentZ = 0.4; currentRoll = ROLL_END;
            matSide.color.lerpColors(colorDark1, colorDark2, localT);
            matCap.color.lerpColors(colorDark1, colorDark2, localT);
            matBore.color.lerpColors(colorDark1, colorDark2, localT);
            if (window._matStrap) window._matStrap.color.lerpColors(new THREE.Color(0x282830), new THREE.Color(0x0c0c0c), localT);
            lerpMatPreset('coldRoll', 'qt', localT);
          } else {
            yawGroup.scale.setScalar(_scale);
            currentYaw = _deg3; currentX = X_END; currentRoll = ROLL_END; currentZ = 0.4;
            matSide.color.copy(colorDark2);
            matCap.color.copy(colorDark2);
            matBore.color.copy(colorDark2);
            if (window._matStrap) window._matStrap.color.set(0x0c0c0c);
            applyMatPreset('qt');
          }

          /* 모델 이동: 카메라는 고정, 모델이 오른쪽으로 이동 */
          var moveRatio = X_END > 0 ? currentX / X_END : 0;
          var et = moveRatio < 0.5 ? 2 * moveRatio * moveRatio : 1 - Math.pow(-2 * moveRatio + 2, 2) / 2;
          updatePosition(moveRatio);

          /* 모델 X/Y: et 비율에 따라 이동 (양수=오른쪽/위) */
          /* 모바일: 카드 우상단에 안착 → X 더 크게, Y 더 크게 */
          var _mobNow = window.innerWidth <= 1023;
          var modelXEnd = ov.modelX !== undefined ? ov.modelX : (_mobNow ? 0.55 : 0.75);
          var modelYEnd = ov.modelY !== undefined ? ov.modelY : (_mobNow ? 1.2 : 0.3);
          var curScale = yawGroup.scale.x;
          yawGroup.position.set(
            -OUTER_R * curScale + lerp3d(0, modelXEnd, et),
            lerp3d(0, modelYEnd, et),
            currentZ
          );
          yawGroup.rotation.y = currentYaw;
          orientGroup.rotation.y = 0;
          rollGroup.rotation.y = currentRoll;

          /* 카메라: X 고정, Y/Z만 변화 */
          camera.position.x = 0;
          camera.position.y = lerp3d(CAM_Y_START, _CAM_Y_END, et);
          camera.position.z = (camZOverride !== null) ? camZOverride : lerp3d(CAM_Z_START, _CAM_Z_END, et);
          camera.lookAt(0, et * _lookAtY, 0);

          /* (재질은 프리셋/lerp에서 일원화 관리 — et 보간 제거) */

          /* 중앙 상태: hero 프리셋 → 이동 시 프리셋으로 서서히 전환 */
          var _hp = matPresets.hero;
          var centerCapR = _hp.capR, centerSideR = _hp.sideR;
          var centerCapEnv = _hp.capEnv, centerSideEnv = _hp.sideEnv;
          var centerCapM = _hp.capM, centerSideM = _hp.sideM;
          matCap.roughness = centerCapR + (matCap.roughness - centerCapR) * et;
          matSide.roughness = centerSideR + (matSide.roughness - centerSideR) * et;
          matCap.envMapIntensity = centerCapEnv + (matCap.envMapIntensity - centerCapEnv) * et;
          matSide.envMapIntensity = centerSideEnv + (matSide.envMapIntensity - centerSideEnv) * et;
          matCap.metalness = centerCapM + (matCap.metalness - centerCapM) * et;
          matSide.metalness = centerSideM + (matSide.metalness - centerSideM) * et;
          matBore.roughness = Math.max(matBore.roughness, 0.20 + (0.15 * (1.0 - et)));

          /* 중앙 사선광: 이동 시 페이드아웃 */
          centerDiag.intensity = 1.0 * (1.0 - et);

          /* 그림자: 안착 시 페이드인 (et 0.6 이후) */
          var shadowT = Math.max(0, (et - 0.6) / 0.4);
          shadowPlane.visible = shadowT > 0.01;
          shadowMat.opacity = 0.37 * shadowT;
        }
      };

      /* 렌더 루프 */
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener('resize', function () {
        resize3d();
        if (window._composer) window._composer.setSize(renderer.domElement.width, renderer.domElement.height);
      }, { passive: true });

      /* 초기: 뷰포트 크기 설정 + 줌인 상태로 중앙에 표시 */
      resize3d();
      window._coil3d.updateRotation(0.12);
      renderer.render(scene, camera);
    })();
