# 콘텐츠 편집

이 디렉토리는 포트폴리오 콘텐츠의 원본입니다. 화면과 내비게이션 코드는 `app.js`, `blog/ui.js`, `styles.css`에 두고, 내용은 여기서 편집합니다. 서버나 데이터베이스 없이 JavaScript 모듈로 읽습니다.

| 위치 | 내용 |
| --- | --- |
| `about/` | 소개, 학력, 관심사, 기술, 연락 안내 |
| `experience/<slug>/` | 경력 한 항목 |
| `awards/<slug>/` | 수상 한 항목 |
| `research/<slug>/` | 논문 또는 진행 중인 연구 한 항목 |
| `software/` | 소프트웨어 소개 |
| `contact/` | 이메일 및 외부 프로필 |
| `posts/<slug>/` | 블로그 글 한 편과 해당 글의 데모·풀이 코드 |

## 연구·경력·수상

각 항목의 `meta.js`에는 식별자, 제목, 종류를 저장합니다. 경력에는 표시 기간(`period`)과 직책(`role`)도 있습니다. `en.js`와 `ko.js`는 해당 언어의 HTML 본문입니다. 두 본문의 `{{title}}`, `{{period}}`, `{{role}}`는 `meta.js`의 값을 사용하므로 공통 정보를 한 번만 수정하면 됩니다. `index.js`가 이 정보를 조합합니다.

- 논문: `research/mission-aware-hyperspectral/`, `research/historical-battle-records/`, `research/ship-fire-smoke/`
- 진행 중인 연구: `research/pact/`, `research/lineage/`
- 경력 예시: `experience/rok-navy/`, `experience/creaiit/`
- 수상 예시: `awards/navy-marine-ai-2026/`

새 항목을 만들면 해당 목록 파일(`research/index.js`, `experience/index.js`, `awards/index.js`)에서 한 번 등록합니다. 연구 목록은 `publications`와 `ongoing` 배열로 구분합니다. 경력과 수상은 About에 표시됩니다. 논문은 기존처럼 1저자 항목을 먼저 표시합니다.

## 블로그 글

예: `posts/cv-qaoa-continuous-problems/`

| 파일 | 편집 내용 |
| --- | --- |
| `meta.js` | slug, 분류, 날짜, 태그, 논문 정보, 참고문헌 URL |
| `ko.js` | 한국어 요약, 섹션별 본문, 데모 제목, 참고문헌 설명 |
| `en.js` | 영어 요약, 섹션별 본문, 데모 제목, 참고문헌 설명 |
| `demo.js` | 이 글에 쓰이는 인터랙티브 콘텐츠 |
| `index.js` | 공통 정보와 언어별 내용을 조합하는 작은 모듈 |
| `solution.py` | 알고리즘 글에만 있는 실행·복사·다운로드용 파이썬 원본 |

본문은 `sections` 배열의 `id`, `title`, `html`로 작성합니다. 수식은 기존 `data-math="display"` 또는 `data-math="inline"` 마크업을 사용합니다. 한국어/영어의 섹션 ID와 데모 ID를 동일하게 유지합니다. 제목·소제목·메뉴는 영어로 유지하고, 설명 본문만 언어에 따라 전환합니다.

한 글에 여러 데모를 넣을 수 있습니다. 각 데모의 `after`는 바로 앞에 놓일 섹션 ID입니다. 데모의 계산 함수와 공통 UI 도구는 `blog/algorithms.js`, `blog/*models.js`, `blog/*common.js`에서 공유하고, 개별 화면과 이벤트 처리는 각 글의 `demo.js`에서 관리합니다. 글 전용 이미지가 필요하면 해당 글 폴더에 `assets/`를 만들고, 사이트 루트 기준 경로(`content/posts/<slug>/assets/...`)를 사용합니다.

알고리즘 풀이를 수정할 때는 **`solution.py` 하나만** 수정합니다. 글의 코드 표시와 복사 기능도 이 파일을 읽습니다. 예전 `blog/code/`의 중복 원본은 제거했습니다. 글 주소 `#blog/<slug>`와 댓글 식별자는 변경하지 않았습니다.

새 글은 `posts/index.js`에 한국어 데이터와 영어 데이터 모듈을 등록합니다. 새 데모 유형이 있으면 `posts/demos.js`에도 등록합니다. 폴더 목록을 브라우저가 탐색할 수 없기 때문에 목록 등록은 명시적으로 유지합니다. 현재는 정적 import로 등록된 콘텐츠를 읽으며, 클릭할 때만 본문을 요청하는 지연 로딩 구조는 아닙니다.

## 검증

저장소 루트에서 `npm test`를 실행합니다. 등록 목록과 폴더 일치, 언어별 내용, 수식, 데모, 풀이 코드와 조명/날씨 동작을 검사합니다. GitHub Pages는 별도 빌드 없이 이 파일들을 제공합니다.

## HBR-IE 시각화

`research/historical-battle-records/example.js`에 설명용 예문, 원문 구간과 필드 연결, 한영 설명을 저장합니다. 실제 코퍼스 인용이 아닌 구성 예문입니다. `demo.js`가 시각화와 선택 동작, `demo.css`가 배치를 담당하며 `research/interactions.js`에서 활성화합니다. 항목이나 원문 구간을 누르면 양쪽이 연결되어 강조되고, 선택 상태는 언어 전환 시에도 유지됩니다.
