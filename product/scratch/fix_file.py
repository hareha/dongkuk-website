import re

with open("/Users/jangjong-won/Desktop/dongkuk-website/product/cold-rolled.html", "r") as f:
    content = f.read()

# I will replace the entire broken part between <!-- 2. 생산범위 --> and <!-- 활용분야 -->

replacement = """            <!-- 2. 생산범위 -->
            <div class="acc-item">
                <div class="acc-header" onclick="toggleAcc(this)">
                    <div class="acc-header-left">
                        <div class="acc-dot"></div>
                        <span class="acc-title">생산범위</span>
                    </div>
                    <div class="acc-dropdown-icon">
                        <img src="../assets/common/ic-dropdown.svg" class="plus" alt="열기">
                        <img src="../assets/common/ic-dropdown-m.svg" class="minus" alt="닫기">
                    </div>
                </div>
                <div class="acc-body">
                    <div class="acc-content-box" style="padding: 30px 0 0 0; display: flex; flex-direction: column; gap: 20px; box-sizing: border-box;">
                        <!-- 안내 문구 -->
                        <p class="desktop-only" style="width: 461px; height: 32px; font-family: 'Pretendard'; font-style: normal; font-weight: 400; font-size: 20px; line-height: 160%; color: #F27100; margin: 0;">표의 색상 영역에서 제품별 상세 생산 범위를 확인해 보세요.</p>
                        <p class="mobile-only m-notice-text">표의 색상 영역에서 제품별 상세 생산 범위를 확인해 보세요.</p>

                        <div class="pr-list-container">
                            <!-- 1. 산세강판 (Pickled & Oiled Coil) -->
                            <div class="pr-item-row" style="display: flex; align-items: flex-start; align-self: stretch;">
                                <div class="pr-item-info">
                                    <div class="pr-title-box">
                                        <span class="pr-title-main">산세강판</span>
                                        <span class="pr-title-sub">Pickled & Oiled Coil (PO)</span>
                                    </div>
                                    <p class="pr-item-desc">열연강판 표면의 산화물과 이물질을 염산 <br class="m-br">세척으로 제거한 후, 방청을 위해 기름을 <br class="m-br">도포해 표면을 깨끗하게 정리한 강판</p>
                                </div>
                                <div class="desktop-only" style="width: 890px; height: 613px;">
                                    <img src="./assets/cold-rolled/그래프1.svg" alt="산세강판 생산범위" style="width: 100%; height: 100%; object-fit: contain;">
                                </div>
                                <!-- Mobile View -->
                                <div class="mobile-only m-chart-container" style="height: 304px; display: flex; flex-direction: column; gap: 20px;">
                                    <div class="m-chart-visual-wrap" style="width: 328px; height: 304px; padding: 24px 20px; background: #F8F9FB; border-radius: 16px; box-sizing: border-box; display: flex; flex-direction: column; gap: 30px;">
                                        <div class="m-chart-visual" style="width: 288px; height: 179px; position: relative;">
                                            <img src="./assets/cold-rolled/산세강판_모바일.png" alt="산세강판 생산범위" style="width: 100%; height: 100%; object-fit: contain;">
                                        </div>
                                        
                                        <!-- Capa Box -->
                                        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                                            <div style="display: flex; align-items: center; gap: 4px;">
                                                <div style="display: flex; align-items: center; gap: 2px;">
                                                    <span style="font-family: 'Pretendard'; font-weight: 700; font-size: 14px; line-height: 150%; color: #363636;">설비 전체 Capa.</span>
                                                    <span style="font-family: 'Pretendard'; font-weight: 400; font-size: 14px; line-height: 150%; color: #7A7A7A;">(생산 가능 용량)</span>
                                                </div>
                                                <span style="font-family: 'Pretendard'; font-weight: 400; font-size: 14px; line-height: 150%; color: #363636;">600,000 MT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 2. 냉연강판 (Cold Rolled Coil) -->
                            <div class="pr-item-row" style="display: flex; align-items: flex-start; align-self: stretch;">
                                <div class="pr-item-info">
                                    <div class="pr-title-box">
                                        <span class="pr-title-main">냉연강판</span>
                                        <span class="pr-title-sub">Cold Rolled Coil (CR)</span>
                                    </div>
                                    <p class="pr-item-desc">열연강판에 산세 공정(PO)을 적용한 후 상온에서 정밀 압연(Cold Rolled)과 열처리를 거쳐, <br class="m-br">표면이 매끄럽고 강도가 우수한 강판</p>
                                </div>
                                <div class="desktop-only" style="width: 890px; height: 616px;">
                                    <img src="./assets/cold-rolled/그래프2.svg" alt="냉연강판 생산범위" style="width: 100%; height: 100%; object-fit: contain;">
                                </div>
                                <!-- Mobile View -->
                                <div class="mobile-only m-chart-container" style="height: 328px; display: flex; flex-direction: column; gap: 20px;">
                                    <div class="m-chart-visual-wrap" style="width: 328px; height: 328px; padding: 24px 20px; background: #F8F9FB; border-radius: 16px; box-sizing: border-box; display: flex; flex-direction: column; gap: 30px;">
                                        <div class="m-chart-visual" style="width: 288px; height: 179px; position: relative;">
                                            <img src="./assets/cold-rolled/냉연강판_모바일.png" alt="냉연강판 생산범위" style="width: 100%; height: 100%; object-fit: contain;">
                                        </div>
                                        
                                        <!-- Capa Box -->
                                        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                                            <div style="display: flex; align-items: center; gap: 4px;">
                                                <div style="display: flex; align-items: center; gap: 2px;">
                                                    <span style="font-family: 'Pretendard'; font-weight: 700; font-size: 14px; line-height: 150%; color: #363636;">설비 전체 Capa.</span>
                                                    <span style="font-family: 'Pretendard'; font-weight: 400; font-size: 14px; line-height: 150%; color: #7A7A7A;">(생산 가능 용량)</span>
                                                </div>
                                                <span style="font-family: 'Pretendard'; font-weight: 400; font-size: 14px; line-height: 150%; color: #363636;">360,000 MT</span>
                                            </div>
                                            <p style="width: 258px; height: 42px; font-family: 'Pretendard'; font-style: normal; font-weight: 400; font-size: 14px; line-height: 150%; color: #F27100; margin: 0;">별표(*)가 표시된 규격은 생산 조건에 따라 <br class="m-br">협의가 필요하오니 고객센터로 문의해 주세요.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 3. 대용량 연속 코일 (Oscillating Coil) -->
                            <div class="pr-item-row" style="display: flex; align-items: flex-start; align-self: stretch;">
                                <div class="pr-item-info">
                                    <div class="pr-title-box">
                                        <span class="pr-title-main">대용량 연속 코일</span>
                                        <span class="pr-title-sub">Oscillating Coil</span>
                                    </div>
                                    <p class="pr-item-desc">협폭 코일을 층간 겹침 압연(Oscillating) 방식으로 <br class="m-br">권취하여, 기존 코일 대비 대량의 연속 작업이 <br class="m-br">가능한 고효율 강판</p>
                                </div>
                                <div class="desktop-only" style="width: 890px; height: 613px;">
                                    <img src="./assets/cold-rolled/그래프3.svg" alt="대용량 연속 코일 생산범위" style="width: 100%; height: 100%; object-fit: contain;">
                                </div>
                                <!-- Mobile View -->
                                <div class="mobile-only m-chart-container" style="height: 278px; display: flex; flex-direction: column; gap: 20px;">
                                    <div class="m-chart-visual-wrap" style="width: 328px; height: 278px; padding: 24px 20px; background: #F8F9FB; border-radius: 16px; box-sizing: border-box; display: flex; flex-direction: column; gap: 30px;">
                                        <div class="m-chart-visual" style="width: 288px; height: 179px; position: relative;">
                                            <img src="./assets/cold-rolled/대용량연속코일_모바일.png" alt="대용량 연속 코일 생산범위" style="width: 100%; height: 100%; object-fit: contain;">
                                        </div>
                                        
                                        <!-- Capa Box -->
                                        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                                            <div style="display: flex; align-items: center; gap: 4px;">
                                                <div style="display: flex; align-items: center; gap: 2px;">
                                                    <span style="font-family: 'Pretendard'; font-weight: 700; font-size: 14px; line-height: 150%; color: #363636;">설비 전체 Capa.</span>
                                                    <span style="font-family: 'Pretendard'; font-weight: 400; font-size: 14px; line-height: 150%; color: #7A7A7A;">(생산 가능 용량)</span>
                                                </div>
                                                <span style="font-family: 'Pretendard'; font-weight: 400; font-size: 14px; line-height: 150%; color: #363636;">9,000 MT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 4. 가공 가능 규격 (Mini Shear Line) -->
                            <div class="pr-item-row" style="display: flex; align-items: flex-start; align-self: stretch;">
                                <div class="pr-item-info">
                                    <div class="pr-title-box">
                                        <span class="pr-title-main">가공 가능 규격</span>
                                        <span class="pr-title-sub">Mini Shear Line</span>
                                    </div>
                                    <p class="pr-item-desc">코일 형태의 강판을 고객이 요구하는 <br class="m-br">규격의 판재로 정밀 절단하는 가공 설비</p>
                                </div>
                                <div class="desktop-only" style="width: 890px; height: 582px;">
                                    <img src="./assets/cold-rolled/그래프4.svg" alt="가공 가능 규격 생산범위" style="width: 100%; height: 100%; object-fit: contain;">
                                </div>
                                <!-- Mobile View -->
                                <div class="mobile-only m-chart-container" style="height: 278px; display: flex; flex-direction: column; gap: 20px;">
                                    <div class="m-chart-visual-wrap" style="width: 328px; height: 278px; padding: 24px 20px; background: #F8F9FB; border-radius: 16px; box-sizing: border-box; display: flex; flex-direction: column; gap: 30px;">
                                        <div class="m-chart-visual" style="width: 288px; height: 179px; position: relative;">
                                            <img src="./assets/cold-rolled/가공가능구격_모바일.png" alt="가공 가능 규격 생산범위" style="width: 100%; height: 100%; object-fit: contain;">
                                        </div>
                                        
                                        <!-- Capa Box -->
                                        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                                            <div style="display: flex; align-items: center; gap: 4px;">
                                                <div style="display: flex; align-items: center; gap: 2px;">
                                                    <span style="font-family: 'Pretendard'; font-weight: 700; font-size: 14px; line-height: 150%; color: #363636;">설비 전체 Capa.</span>
                                                    <span style="font-family: 'Pretendard'; font-weight: 400; font-size: 14px; line-height: 150%; color: #7A7A7A;">(생산 가능 용량)</span>
                                                </div>
                                                <span style="font-family: 'Pretendard'; font-weight: 400; font-size: 14px; line-height: 150%; color: #363636;">11,400 MT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>"""

pattern = re.compile(r'            <!-- 2. 생산범위 -->.*?    <!-- 활용분야 -->', re.DOTALL)
new_content = pattern.sub(replacement + "\n    <!-- 활용분야 -->", content)

with open("/Users/jangjong-won/Desktop/dongkuk-website/product/cold-rolled.html", "w") as f:
    f.write(new_content)
