# 🐢 닥터거북 (turtle5) — 거북목 자세 인식 · MediaPipe

웹캠 영상에서 **MediaPipe**로 얼굴과 상체 랜드마크를 추출하고, 턱·코·어깨 좌표로 **거북목 자세를 실시간으로 판별**하는 React 모듈입니다.

> 한성대학교 캡스톤 디자인 · 팀 turtle5 (2024.03 ~ 2024.05)
> 🔗 Backend: [haeri-J/turtle5_backend](https://github.com/haeri-J/turtle5_backend) · Frontend: [dain0l/capstone_turtlefive](https://github.com/dain0l/capstone_turtlefive)

## 🛠 Tech Stack
- React 18 (Create React App)
- MediaPipe Holistic / Pose, `react-webcam`
- `@mediapipe/camera_utils`, `@mediapipe/drawing_utils`

## ⚙️ 동작 방식

1. `react-webcam`으로 웹캠 영상을 받아서, 프레임마다 **MediaPipe Holistic**에 넘깁니다.
2. 결과로 나온 **포즈 랜드마크**(어깨 11·12번)와 **얼굴 랜드마크**(코 0번, 턱끝 152번)를 사용합니다.
3. 양쪽 어깨의 중점(`shoulderMidPoint`)을 기준으로 아래 지표들을 계산합니다.
4. 지표들이 기준값을 넘으면 캔버스에 경고 문구를 띄웁니다.
   - 바른 자세: `Your pose is normal` (초록)
   - 거북목: `You have to fix your pose.` (빨강)
   - 턱이 인식되지 않으면: `No recognized...`

## 📐 판별 알고리즘 (`src/algorithms`)

| 파일 | 계산 내용 | 의미 |
|---|---|---|
| `checkZValues.jsx` | 코와 어깨 중점의 **z값(깊이) 차이** | 머리가 어깨보다 얼마나 앞으로 나와 있는지 |
| `checkDistance.jsx` | 턱끝과 어깨 중점 사이의 **2D 거리** | 고개가 숙여지거나 목이 짧아 보이는 정도 |
| `checkAngle.jsx` | 어깨 중점 기준 **왼쪽 어깨 벡터와 턱끝 벡터의 각도** | 목이 앞뒤로 기운 각도 |
| `check3D.jsx` | 턱끝과 어깨 중점 사이의 **3D 거리** (x, y, z) | 깊이까지 포함한 목 길이 |

여러 지표를 실험하며 기준값(임계값)을 조정했고, 최종 판별에는 **z값 차이와 2D 거리**를 조합해서 썼습니다.

## 📁 구조

```
src
├── PoseDetector.jsx      # Holistic 기반 거북목 판별 (메인 로직)
├── PostureAnalysis.jsx   # Pose 기반 어깨 수평·머리 기울기 분석 (실험용)
├── algorithms/           # 판별 지표 계산 함수
│   ├── checkZValues.jsx
│   ├── checkDistance.jsx
│   ├── checkAngle.jsx
│   └── check3D.jsx
└── App.js
```

## ▶️ 실행 방법

```bash
npm install
npm start
```
http://localhost:3000 에서 웹캠 접근을 허용하면 바로 동작합니다.
