#!/usr/bin/env python3
"""
nickel, brand-resource, dikel-value 3개 페이지를 
product/nickel/index.html 하나로 합치기:
- CSS: 각 페이지의 고유 CSS를 nickel <style>에 추가
- HTML: 탭 패널로 분리
- JS: 각 페이지 고유 JS 통합
"""

import re

BASE = '/Users/hare/Documents/비욘드엔'

# 1. 각 파일 읽기
with open(f'{BASE}/product/nickel/index.html', 'r') as f:
    nickel = f.read()
with open(f'{BASE}/brand-resource/index.html', 'r') as f:
    brand = f.read()
with open(f'{BASE}/dikel-value/index.html', 'r') as f:
    dikel = f.read()

nickel_lines = nickel.split('\n')
brand_lines = brand.split('\n')
dikel_lines = dikel.split('\n')

# 2. brand-resource에서 고유 CSS 추출 (공통 제외)
# CSS는 line 1 ~ </style> 직전. 공통부분(page-header, btn-top, support, footer, responsive) 제거
# brand 고유 CSS: story-section, bi-section, logo 관련
brand_css_end = next(i for i, l in enumerate(brand_lines) if '</style>' in l)
brand_css_block = '\n'.join(brand_lines[0:brand_css_end])
# 추출: story~bi 관련 CSS만 (대략 line 14~1090 정도)
# 공통 제외 목록
common_selectors = ['.page-header', '.tab-nav', '.tab-item', '.btn-top', '.support-', '.footer', '@media', '.gnb', 'html', 'body', '*', '.inner', '.btn-arrow']
brand_unique_css = []
in_block = False
brace_count = 0
current_block = []
for line in brand_lines[1:brand_css_end]:
    stripped = line.strip()
    if not stripped:
        if not in_block:
            brand_unique_css.append('')
        continue
    
    if not in_block and '{' in line:
        # Check if it's a common selector
        selector = stripped.split('{')[0].strip()
        is_common = any(sel in selector for sel in common_selectors)
        if is_common:
            brace_count = line.count('{') - line.count('}')
            if brace_count > 0:
                in_block = True
            continue
        else:
            current_block = [line]
            brace_count = line.count('{') - line.count('}')
            if brace_count <= 0:
                brand_unique_css.append(line)
            else:
                in_block = True
    elif in_block:
        is_selector_line = '{' in stripped and brace_count == 0
        if is_selector_line:
            selector = stripped.split('{')[0].strip()
            is_common = any(sel in selector for sel in common_selectors)
            if is_common:
                brace_count += line.count('{') - line.count('}')
                continue
        
        current_block.append(line)
        brace_count += line.count('{') - line.count('}')
        if brace_count <= 0:
            in_block = False
            # Check if first line of current_block has common selector
            first_sel = current_block[0].strip().split('{')[0].strip()
            if not any(sel in first_sel for sel in common_selectors):
                brand_unique_css.extend(current_block)
            current_block = []
    else:
        brand_unique_css.append(line)

# Simpler approach: just extract all CSS from brand and dikel, 
# wrap in comments. Duplicates don't matter much.
print("Extracting CSS...")

# Get brand CSS (everything between <style> and </style>)
brand_style_start = next(i for i, l in enumerate(brand_lines) if '<style>' in l) + 1
brand_style_end = next(i for i, l in enumerate(brand_lines) if '</style>' in l)

dikel_style_start = next(i for i, l in enumerate(dikel_lines) if '<style>' in l) + 1  
dikel_style_end = next(i for i, l in enumerate(dikel_lines) if '</style>' in l)

brand_all_css = '\n'.join(brand_lines[brand_style_start:brand_style_end])
dikel_all_css = '\n'.join(dikel_lines[dikel_style_start:dikel_style_end])

# 3. brand-resource 콘텐츠 HTML 추출 (page-header 다음 ~ support-section 전)
# brand: content = story-section + bi-section (lines 1376~1633)
brand_content_start = next(i for i, l in enumerate(brand_lines) if 'story-section' in l and '<section' in l)
brand_content_end = next(i for i, l in enumerate(brand_lines) if 'btn-top' in l and '<a' in l)
brand_content = '\n'.join(brand_lines[brand_content_start:brand_content_end])
# Fix asset paths: assets/ → ../../brand-resource/assets/  (relative to product/nickel/)
brand_content = brand_content.replace("src=\"assets/", "src=\"../../brand-resource/assets/")
brand_content = brand_content.replace("src='assets/", "src='../../brand-resource/assets/")

# 4. dikel-value 콘텐츠 HTML 추출
dikel_content_start = next(i for i, l in enumerate(dikel_lines) if '<section class="hero">' in l or ('<section' in l and 'hero' in l and i > 1200))
# Find the line with support-section
dikel_content_end = next(i for i, l in enumerate(dikel_lines) if 'support-section' in l and '<section' in l)
dikel_content = '\n'.join(dikel_lines[dikel_content_start:dikel_content_end])
# Fix asset paths
dikel_content = dikel_content.replace("src=\"assets/", "src=\"../../dikel-value/assets/")
dikel_content = dikel_content.replace("src='assets/", "src='../../dikel-value/assets/")
dikel_content = dikel_content.replace("url('assets/", "url('../../dikel-value/assets/")
dikel_content = dikel_content.replace("url(assets/", "url(../../dikel-value/assets/")

# 5. dikel-value 고유 JS 추출
dikel_js_start = next(i for i, l in enumerate(dikel_lines) if '<script>' in l and i > 1400)
dikel_js_end = next(i for i, l in enumerate(dikel_lines) if '</script>' in l and i > dikel_js_start)
dikel_js = '\n'.join(dikel_lines[dikel_js_start+1:dikel_js_end])

# 6. nickel page 수정
nickel_style_end = next(i for i, l in enumerate(nickel_lines) if '</style>' in l)

# Add CSS for tab panels + brand + dikel CSS before </style>
tab_css = """
        /* ===== TAB PANELS ===== */
        .tab-panel { display: none; }
        .tab-panel.active { display: block; }

        /* ===== BRAND RESOURCE CSS ===== */
""" + brand_all_css + """

        /* ===== DIKEL VALUE CSS ===== */
""" + dikel_all_css

nickel_lines[nickel_style_end] = tab_css + "\n    </style>"

# 7. Update tab-nav to use JS instead of location.href
# Find the tab-nav lines
for i, line in enumerate(nickel_lines):
    if "tab-item active" in line and "제품소개" in line:
        nickel_lines[i] = '            <div class="tab-item active" data-tab="tab-product">제품소개</div>'
    elif "tab-item" in line and "브랜드 리소스" in line:
        nickel_lines[i] = '            <div class="tab-item" data-tab="tab-brand">브랜드 리소스</div>'
    elif "tab-item" in line and "DiKel 가치" in line:
        nickel_lines[i] = '            <div class="tab-item" data-tab="tab-dikel">DiKel 가치</div>'

# 8. Wrap existing content in tab-product panel and add brand/dikel panels
# Find "<!-- Hero Text -->" line (start of product content)
hero_line = next(i for i, l in enumerate(nickel_lines) if '<!-- Hero Text -->' in l)
# Find support-section line (end of product content)  
support_line = next(i for i, l in enumerate(nickel_lines) if 'support-section' in l and '<section' in l)

# Insert tab-product wrapper
nickel_lines[hero_line] = '    <div id="tab-product" class="tab-panel active">\n    <!-- Hero Text -->'
nickel_lines[support_line] = '    </div>\n\n    <!-- TAB: 브랜드 리소스 -->\n    <div id="tab-brand" class="tab-panel">\n' + brand_content + '\n    </div>\n\n    <!-- TAB: DiKel 가치 -->\n    <div id="tab-dikel" class="tab-panel">\n' + dikel_content + '\n    </div>\n\n' + nickel_lines[support_line]

# 9. Add tab switching JS before the closing </script>
# Find the last </script> before gnb.js
script_lines = [(i, l) for i, l in enumerate(nickel_lines) if '</script>' in l]
# Get the last one before gnb.js
last_script_end = [i for i, l in script_lines if i < len(nickel_lines) - 5][-1]

tab_js = """
        // ===== TAB SWITCHING =====
        document.querySelectorAll('.tab-item[data-tab]').forEach(function(tab) {
            tab.addEventListener('click', function() {
                var targetId = this.getAttribute('data-tab');
                // Deactivate all
                document.querySelectorAll('.tab-item[data-tab]').forEach(function(t) { t.classList.remove('active'); });
                document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
                // Activate target
                this.classList.add('active');
                var panel = document.getElementById(targetId);
                if (panel) panel.classList.add('active');
                // Scroll to top of tabs
                var pageHeader = document.querySelector('.page-header');
                if (pageHeader) {
                    var rect = pageHeader.getBoundingClientRect();
                    window.scrollTo({ top: window.scrollY + rect.top - 100, behavior: 'smooth' });
                }
            });
        });
"""

# Also add dikel-value JS
tab_js += '\n' + dikel_js

nickel_lines[last_script_end] = tab_js + '\n    </script>'

# 10. Write output
output = '\n'.join(nickel_lines)
with open(f'{BASE}/product/nickel/index.html', 'w') as f:
    f.write(output)

print("Done! Merged 3 pages into product/nickel/index.html")
print(f"Output: {len(nickel_lines)} lines")
