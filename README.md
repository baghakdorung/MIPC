# 🌌 The Vanishing Hope: 2025 Admission Simulator
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-Stable-green?style=for-the-badge)

> **"당신의 미래가 결정되는 순간, 가장 완벽한 전략을 수립하세요."** 

## 1. Project Concept & Philosophy
이 프로젝트는 한국의 입시 과열 현상을 **Three.js 기반의 3D 인터랙티브 아트**로 승화시켰습니다.
  * **희망과 절망의 이중주**: 사용자는 아름다운 우주와 같은 미래를 꿈꾸며 **'원서 접수'** 버튼을 누릅니다.
  * **차가운 현실**: 하지만 결국 마주하는 것은 차가운 현실과 사회적 메시지입니다.
  * **결론**: 시각적 아름다움과 반전의 충격을 통해 강렬한 **Impact**를 전달합니다.

## 2. Technical Implementation (Core Logic)
단순한 정적 웹사이트를 넘어, 고성능 그래픽 라이브러리를 활용하여 기술적 한계에 도전했습니다.
  * **Advanced Rendering**: `Three.js`를 활용하여 **Icosahedron Geometry** 기반의 코어와 \*\*3,000개의 개별 파티클(Particles)\*\*을 실시간으로 렌더링합니다.
  * **Performance Optimization**: `requestAnimationFrame`을 사용하여 끊김 없는 애니메이션 루프를 구현하였으며, 렌더링 성능을 최적화했습니다.
  * **Interactive Parallax**: 마우스 움직임에 반응하는 **파랄락스(Parallax)** 효과와 부드러운 보간(Interpolation) 로직을 적용하여 몰입감을 극대화했습니다.

## 3. System Architecture
코드의 유지보수성과 확장성을 고려한 설계로 완성도를 높였습니다.
  * **Decoupled Architecture**: UI 로직(DOM 조작)과 3D 씬 로직(Canvas 렌더링)을 완벽하게 분리(**Decoupling**)하여 코드의 가독성과 재사용성을 확보했습니다.
  * **Efficient Styling**: `Tailwind CSS`를 CDN으로 로드하여 유틸리티 퍼스트(Utility-first) 방식의 빠르고 일관성 있는 스타일링을 구현했습니다.
  * **Responsive Design**: 윈도우 리사이즈 이벤트에 대응하여 카메라 종횡비(Aspect Ratio)와 렌더러 사이즈가 자동으로 조정됩니다.