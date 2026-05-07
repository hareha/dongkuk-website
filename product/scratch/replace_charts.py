import re

with open("/Users/jangjong-won/Desktop/dongkuk-website/product/cold-rolled.html", "r") as f:
    content = f.read()

# 1. PO
content = re.sub(
    r'(산세강판.*?m-chart-visual.*?>).*?(</div>\s+<!-- Capa Box \(Frame 2116933653\) -->)',
    r'\1\n                                            <img src="./assets/cold-rolled/산세강판_모바일.png" alt="산세강판 생산범위" style="width: 100%; height: 100%; object-fit: contain;">\n\2',
    content, flags=re.DOTALL
)

# 2. CR
content = re.sub(
    r'(냉연강판.*?m-chart-visual.*?>).*?(</div>\s+<!-- Capa Box \(Frame 2116933656\) -->)',
    r'\1\n                                            <img src="./assets/cold-rolled/냉연강판_모바일.png" alt="냉연강판 생산범위" style="width: 100%; height: 100%; object-fit: contain;">\n\2',
    content, flags=re.DOTALL
)

# 3. Oscillating
content = re.sub(
    r'(대용량 연속 코일.*?m-chart-visual.*?>).*?(</div>\s+<!-- Capa Box \(Frame 2116933657\) -->)',
    r'\1\n                                            <img src="./assets/cold-rolled/대용량연속코일_모바일.png" alt="대용량 연속 코일 생산범위" style="width: 100%; height: 100%; object-fit: contain;">\n\2',
    content, flags=re.DOTALL
)

# 4. Mini Shear (Note the typo in filename 가공가능구격_모바일.png)
content = re.sub(
    r'(가공 가능 규격.*?m-chart-visual.*?>).*?(</div>\s+<!-- Capa Box \(Frame 2116933657\) -->)',
    r'\1\n                                            <img src="./assets/cold-rolled/가공가능구격_모바일.png" alt="가공 가능 규격 생산범위" style="width: 100%; height: 100%; object-fit: contain;">\n\2',
    content, flags=re.DOTALL
)

with open("/Users/jangjong-won/Desktop/dongkuk-website/product/cold-rolled.html", "w") as f:
    f.write(content)
