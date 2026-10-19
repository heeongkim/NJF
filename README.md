# 2027 NODEUL JAZZ FESTIVAL

Vite + React + TypeScript 기반 2027 노들 재즈 페스티벌 웹사이트.

## 개발

Node.js 24 환경에서 검증했습니다.

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

```sh
npm run lint
npm run build
npm run preview -- --host 0.0.0.0 --port 4173 --strictPort
```

## 페이지 구성

- `/`: 크롬 색소폰·바이닐·구체·궤도선을 활용한 인터랙티브 포스터, 소개, 3일 프로그램, Jazz Test 진입
- `/festival`: 제공된 소개·일시·장소·프로그램의 기본 페이지
- `/schedule`: 날짜별 MAIN/SUB 스테이지 기본 시간표 (`src/schedule.ts`)
- `/jazz-test`: 기존 테스트 (질문·결과 계산 유지)

History API 기반 내부 링크와 브라우저 뒤로/앞으로 이동을 지원합니다. Vercel의 기존 SPA rewrite로 각 경로의 직접 진입·새로고침을 처리합니다. 새 라이브러리는 사용하지 않습니다.

홈 색소폰은 제공된 포스터의 컬러와 질감을 참고해 생성한 개별 투명 에셋입니다. 바이닐·구체·궤도는 CSS로 구성합니다. 포인터 움직임은 requestAnimationFrame으로 제한하고, reduced-motion 설정에서는 움직임을 끕니다.

## Jazz Test

- 순차 스티커 인트로, 건너뛰기 및 다시 보기
- 테스트 소개 화면, 8개 질문의 순차 전환 및 이전 답변 수정
- A–D 최다 선택 집계와 기본 결과 화면
- 로컬 Pretendard 가변 폰트 (OFL 라이선스 동봉)
- 반응형 레이아웃, 키보드 포커스, 모션 감소 설정 지원

제공된 스티커팩을 바탕으로 이미지 도구로 가공한 투명 스티커 시트를 사용합니다. 원본을 픽셀 단위로 잘라낸 에셋과는 미세한 차이가 있을 수 있습니다. `src/JazzTest.tsx`의 `stickers` 데이터에서 SVG viewBox로 각 스티커를 분리해 배치합니다. 하늘색·갈색 색상은 스티커팩에 맞췄습니다. 8개 질문과 결과 계산을 구현했습니다. 상세 결과 페이지 디자인은 후속 작업입니다. 동점이면 Q8의 선택을 우선합니다. Q8이 최다 득표 유형에 포함되지 않는 경우에는 동점 유형 중 가장 최근에 선택한 유형을 사용합니다.

계산 로직·일정 데이터 테스트: `node --test tests/*.test.mjs` (Node.js 24).

## Vercel 배포

1. 프로젝트 파일과 `package-lock.json`, `public/`, `vercel.json`을 GitHub에 커밋·푸시합니다.
2. Vercel에서 **Add New → Project**로 `heeongkim/NJF`를 가져옵니다.
3. Root Directory는 저장소 루트(`.`), Framework Preset은 **Vite**로 설정하고 **Deploy**를 누릅니다.

`vercel.json`에 설치 명령 `npm ci`, 빌드 명령 `npm run build`, 출력 폴더 `dist`가 지정되어 있습니다. Node.js는 `package.json`의 `24.x`를 사용합니다. 별도 환경 변수는 필요하지 않습니다.

SPA 경로는 `index.html`로 연결되며, 기존 정적 파일은 그대로 제공됩니다. 폰트·스티커·파비콘은 `public/`에서 빌드 결과로 복사되므로 GitHub에 반드시 포함해야 합니다. `dist/`와 `node_modules/`는 커밋하지 않습니다.
