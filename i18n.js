const pairs = [
  [
    "Modular arithmetic",
    "모듈러 연산"
  ],
  [
    "Wilson’s theorem",
    "Wilson 정리"
  ],
  [
    "Combinatorics",
    "조합론"
  ],
  [
    "Interval partitioning",
    "구간 분할"
  ],
  [
    "State compression",
    "상태 압축"
  ],
  [
    "Optimization",
    "최적화"
  ],
  [
    "Diagonals",
    "대각선"
  ],
  [
    "Backtracking",
    "백트래킹"
  ],
  [
    "Experience on the right notebook page",
    "노트 오른쪽 페이지의 경력"
  ],
  [
    "About Youngkwon Ko on the left notebook page",
    "노트 왼쪽 페이지의 소개"
  ],
  [
    "Copy failed. Select the code or download the file.",
    "복사에 실패했습니다. 코드를 선택해 복사하거나 파일을 다운로드할 수 있습니다."
  ],
  [
    "The slider controls how many rows contain queens. Red cells are attacked in the next row; the arrows select another solution.",
    "슬라이더는 퀸을 놓은 행 수를 조절한다. 붉은 칸은 다음 행에서 공격받는 위치이고, 화살표는 다른 해로 전환한다."
  ],
  [
    "Board size",
    "보드 크기"
  ],
  [
    "Previous solution",
    "이전 해"
  ],
  [
    "Next solution",
    "다음 해"
  ],
  [
    "Placement step",
    "배치 단계"
  ],
  [
    "Placement complete",
    "배치 완성"
  ],
  [
    "Red cells are attacked by previously placed queens.",
    "붉은 칸은 앞서 놓인 퀸에게 공격받습니다."
  ],
  [
    "Available in the next row",
    "다음 행의 available"
  ],
  [
    "Click a cell to toggle whether a bishop is allowed (× means forbidden). The maximum placement is recalculated whenever the board changes.",
    "칸을 누르면 비숍을 놓을 수 있는 칸과 없는 칸(×)이 전환된다. 판이 바뀔 때마다 최대 배치 수를 다시 계산한다."
  ],
  [
    "Problem sample",
    "문제 예시"
  ],
  [
    "Allow all cells",
    "모든 칸 허용"
  ],
  [
    "Maximum bishops",
    "놓을 수 있는 비숍"
  ],
  [
    "Only squares of the same color can conflict diagonally. Attacks can pass through × cells.",
    "같은 색 칸끼리 대각선 충돌을 검사한다. × 칸을 지나가는 공격도 유효하다."
  ],
  [
    "The slider controls how many blocks have been processed. Choose a height difference in the table to display its two towers.",
    "슬라이더는 처리한 블록 수를 조절한다. 표에서 높이 차이를 선택하면 해당 DP 상태의 두 탑이 표시된다."
  ],
  [
    "Block heights",
    "블록 높이"
  ],
  [
    "Calculate",
    "계산"
  ],
  [
    "Up to 8 blocks, each from 1 to 30",
    "최대 8개, 각각 1–30"
  ],
  [
    "Processed blocks",
    "처리한 블록"
  ],
  [
    "Taller tower",
    "높은 탑"
  ],
  [
    "Shorter tower",
    "낮은 탑"
  ],
  [
    "Processing order:",
    "처리 순서:"
  ],
  [
    "Difference d",
    "차이 d"
  ],
  [
    "Taller height a",
    "높은 탑 a"
  ],
  [
    "Shorter height a−d",
    "낮은 탑 a−d"
  ],
  [
    "The first 16 states are shown, ordered by increasing difference.",
    "작은 차이부터 16개 상태를 표시합니다."
  ],
  [
    "Maximum equal height at this step:",
    "현재 단계에서 가능한 같은 높이의 최대 탑:"
  ],
  [
    "None yet",
    "아직 없음"
  ],
  [
    "Enter up to 8 integers between 1 and 30.",
    "1–30 사이 정수를 최대 8개 입력해 주세요."
  ],
  [
    "The triangle or quadrilateral incident to the thick base edge is fixed. Changing its vertices changes the remaining regions and this case’s partition count.",
    "굵은 변에 붙은 삼각형이나 사각형을 고정한 상태다. 꼭짓점을 바꾸면 남은 영역과 그 배치의 분할 수가 달라진다."
  ],
  [
    "Vertex count",
    "꼭짓점 수"
  ],
  [
    "Partition",
    "분할"
  ],
  [
    "Triangles",
    "삼각형"
  ],
  [
    "Quadrilaterals",
    "사각형"
  ],
  [
    "Vertices incident to the base edge",
    "기준 변에 붙은 꼭짓점"
  ],
  [
    "Total triangulations",
    "전체 삼각분할"
  ],
  [
    "Total quadrangulations",
    "전체 사각분할"
  ],
  [
    "An odd number of vertices cannot be partitioned entirely into quadrilaterals.",
    "홀수 개 꼭짓점은 전부 사각형으로 나눌 수 없습니다."
  ],
  [
    "Contribution of the selected face",
    "선택한 기준 도형의 기여"
  ],
  [
    "Multiply the independent region counts, then sum over all choices of the base face.",
    "각 영역의 경우의 수를 곱하고, 모든 기준 도형 선택을 더합니다."
  ],
  [
    "P and N determine the forward interval (N factors) and tail interval (P − N − 1 factors). The outlined path is the one selected by the code.",
    "P와 N에 따라 앞쪽 구간(N개)과 뒤쪽 구간(P − N − 1개)의 길이가 달라진다. 테두리가 있는 쪽이 실제 코드에서 선택하는 구간이다."
  ],
  [
    "Prime P",
    "소수 P"
  ],
  [
    "Forward computation",
    "앞에서 계산"
  ],
  [
    "Tail computation",
    "뒤에서 계산"
  ],
  [
    "Shorter interval:",
    "짧은 쪽:"
  ],
  [
    "Forward N!",
    "앞쪽 N!"
  ],
  [
    "Tail L!",
    "뒤쪽 L!"
  ],
  [
    "Results from both paths",
    "두 계산의 결과"
  ],
  [
    "This two-dimensional example uses Q = K = [[1, 0], [0, 1], [1, 1]]. These are not attention weights from a trained language model. Select a row to inspect its weighted sum.",
    "Q = K = [[1, 0], [0, 1], [1, 1]]인 2차원 예다. 학습된 언어 모델의 attention이 아니다. 행을 고르면 가중합 계산이 표시된다."
  ],
  [
    "Score multiplier",
    "점수 배율"
  ],
  [
    "Weights over keys 1, 2 and 3 (each row sums to 1)",
    "각 query가 key 1·2·3에 주는 가중치 (행의 합 = 1)"
  ],
  [
    "Scores for the selected row",
    "선택한 행의 점수"
  ],
  [
    "Masked future positions have zero weight. The multiplier illustrates how score scale changes the distribution.",
    "마스크된 미래 위치의 가중치는 0이다. 배율은 분포의 변화를 보여주기 위한 조절값이다."
  ],
  [
    "The example has six class probabilities: [0.60, 0.20, 0.10, 0.05, 0.03, 0.02]. Changing k reconstructs the omitted entries with a shared probability.",
    "6개 클래스에 대한 예시 확률 [0.60, 0.20, 0.10, 0.05, 0.03, 0.02]을 사용한다. k를 바꾸면 저장하지 않은 확률들이 균등한 값으로 복원된다."
  ],
  [
    "Retain the top k entries",
    "저장할 상위 k개"
  ],
  [
    "Original probability",
    "원래 확률"
  ],
  [
    "Reconstructed probability",
    "복원 확률"
  ],
  [
    "Compare calls to the main model generating the next vector. Costs below are calculated from explicit assumptions, not measured CALM benchmarks or generated text.",
    "다음 벡터를 생성하는 큰 모델의 호출 수를 비교한다. 아래 비용은 지정한 가정으로 계산한 값이며 실제 CALM의 벤치마크나 생성 결과가 아니다."
  ],
  [
    "Output tokens",
    "출력 토큰 수"
  ],
  [
    "Chunk size K",
    "묶음 크기 K"
  ],
  [
    "Extra cost per chunk",
    "묶음당 추가 비용"
  ],
  [
    "One token per step",
    "한 토큰씩 생성"
  ],
  [
    "K tokens per chunk",
    "K개씩 묶어 생성"
  ],
  [
    ". The ordinary model’s step and the chunk model’s base step both cost 1; the extra cost is added per chunk. The last chunk shows only the remaining tokens.",
    ". 일반 모델의 1단계 비용과 묶음 모델의 기본 비용을 모두 1로 가정하고, 묶음마다 추가 비용을 더했다. 마지막 묶음은 남은 토큰 수만큼 표시한다."
  ],
  [
    "This illustrative schedule has modules updated every 1, 4 or 16 inputs. Each square is an input; filled squares mark updates. It does not simulate memory contents or retrieval accuracy.",
    "1·4·16 입력마다 갱신하는 세 모듈의 예시 일정이다. 각 칸은 입력 하나이며, 채워진 칸은 업데이트 시점이다. 메모리의 내용이나 기억 정확도를 시뮬레이션하지 않는다."
  ],
  [
    "Input progress",
    "입력 진행"
  ],
  [
    "Paper reviews and algorithm solutions.",
    "논문 리뷰와 알고리즘 문제 풀이."
  ],
  [
    "Title, topic, problem number",
    "제목, 주제, 문제 번호"
  ],
  [
    "References",
    "참고문헌"
  ],
  [
    "Light",
    "라이트"
  ],
  [
    "Dark",
    "다크"
  ],
  [
    "switch to dark mode",
    "다크 모드로 전환"
  ],
  [
    "switch to light mode",
    "라이트 모드로 전환"
  ],
  [
    "Main navigation",
    "주 메뉴"
  ],
  [
    "Selected section",
    "현재 섹션"
  ],
  [
    "Personal profiles",
    "개인 프로필"
  ],
  [
    "Weather unavailable · Seoul local time",
    "날씨 정보 없음 · 서울 시간"
  ],
  [
    "Connecting to the sky…",
    "날씨 확인 중…"
  ],
  [
    "Clear · Live weather",
    "맑음 · 실시간 날씨"
  ],
  [
    "Cloudy · Live weather",
    "흐림 · 실시간 날씨"
  ],
  [
    "Rain · Live weather",
    "비 · 실시간 날씨"
  ],
  [
    "Snow · Live weather",
    "눈 · 실시간 날씨"
  ],
  [
    "Comments",
    "댓글"
  ],
  [
    "Comments are not available yet.",
    "댓글은 준비 중입니다."
  ],
  [
    "Comments could not be loaded.",
    "댓글을 불러오지 못했습니다."
  ],
  [
    "About",
    "소개"
  ],
  [
    "Research",
    "연구"
  ],
  [
    "Software",
    "소프트웨어"
  ],
  [
    "Blog",
    "블로그"
  ],
  [
    "Experience",
    "경력"
  ],
  [
    "Contact",
    "연락처"
  ],
  [
    "Research.",
    "연구."
  ],
  [
    "Blog.",
    "블로그."
  ],
  [
    "Experience.",
    "경력."
  ],
  [
    "Built with curiosity.",
    "직접 만든 소프트웨어."
  ],
  [
    "Let’s talk.",
    "연락주세요."
  ],
  [
    "Back to the desk ↑",
    "책상으로 돌아가기 ↑"
  ],
  [
    "Skip to content",
    "본문으로 이동"
  ],
  [
    "THE OPEN NOTEBOOK",
    "펼쳐 놓은 노트"
  ],
  [
    "PAPERS ON THE DESK",
    "책상 위 논문"
  ],
  [
    "ON THE LAPTOP",
    "노트북 속 프로젝트"
  ],
  [
    "BETWEEN THE BOOKS",
    "책 사이의 기록"
  ],
  [
    "RIGHT NOTEBOOK PAGE",
    "노트 오른쪽의 이력"
  ],
  [
    "A LETTER FROM THE DESK",
    "책상에서 보내는 편지"
  ],
  [
    "A desk of ideas, a little further down the page.",
    "책상 아래에 이어지는 이야기."
  ],
  [
    "AI / ML research & software development",
    "AI / ML 연구 및 소프트웨어 개발"
  ],
  [
    "EDUCATION · MAR 2023–PRESENT",
    "학력 · 2023년 3월–현재"
  ],
  [
    "Yonsei University",
    "연세대학교"
  ],
  [
    "INTERESTS",
    "관심 분야"
  ],
  [
    "How we represent and use information.",
    "정보를 표현하고 활용하는 방법."
  ],
  [
    "Representation learning",
    "표현 학습"
  ],
  [
    "Computer vision",
    "컴퓨터 비전"
  ],
  [
    "Efficient AI",
    "효율적인 AI"
  ],
  [
    "Quantum optimization",
    "양자 최적화"
  ],
  [
    "HOW I WORK",
    "연구와 개발"
  ],
  [
    "From questions to working tools.",
    "질문에서 시작해 도구로 만들기."
  ],
  [
    "Explore my software",
    "개발한 소프트웨어 보기"
  ],
  [
    "TECHNICAL SKILLS",
    "기술"
  ],
  [
    "Tools I work with.",
    "사용하는 도구."
  ],
  [
    "Programming",
    "프로그래밍"
  ],
  [
    "Machine learning",
    "머신러닝"
  ],
  [
    "Development",
    "개발"
  ],
  [
    "GET IN TOUCH",
    "연락처"
  ],
  [
    "Let’s compare notes.",
    "함께 이야기해요."
  ],
  [
    "Email",
    "이메일"
  ],
  [
    "01 / SELECTED PUBLICATIONS",
    "01 / 주요 논문"
  ],
  [
    "Publications",
    "논문"
  ],
  [
    "Hyperspectral imaging",
    "초분광 영상"
  ],
  [
    "Compression",
    "압축"
  ],
  [
    "Mission-aware AI",
    "임무 기반 AI"
  ],
  [
    "Information extraction",
    "정보 추출"
  ],
  [
    "Corpus construction",
    "코퍼스 구축"
  ],
  [
    "Provenance",
    "출처 보존"
  ],
  [
    "MULTI-CCTV · FIRE & SMOKE DETECTION",
    "다중 CCTV · 화재 및 연기 탐지"
  ],
  [
    "Fire & smoke detection",
    "화재·연기 탐지"
  ],
  [
    "Multi-CCTV",
    "다중 CCTV"
  ],
  [
    "Public data",
    "공개 데이터"
  ],
  [
    "02 / IN PROGRESS",
    "02 / 진행 중"
  ],
  [
    "Ongoing work",
    "진행 중인 연구"
  ],
  [
    "Explore repository",
    "저장소 보기"
  ],
  [
    "PYTHON · DOCUMENT TOOLS",
    "PYTHON · 문서 도구"
  ],
  [
    "AI · INFORMATION RETRIEVAL",
    "AI · 정보 검색"
  ],
  [
    "More on GitHub",
    "GitHub에서 더 보기"
  ],
  [
    "Research, product development, and the people I’ve built with.",
    "연구 및 제품 개발 경력과 함께 일한 팀을 소개합니다."
  ],
  [
    "01 / CAREER",
    "01 / 경력"
  ],
  [
    "Research & professional experience",
    "연구 및 실무 경험"
  ],
  [
    "DEC 2025–PRESENT",
    "2025년 12월–현재"
  ],
  [
    "Current",
    "현재"
  ],
  [
    "Republic of Korea Navy",
    "대한민국 해군"
  ],
  [
    "Artificial Intelligence Specialist",
    "AI 개발병"
  ],
  [
    "Expected service completion: August 2027.",
    "전역 예정: 2027년 8월."
  ],
  [
    "Explore the research",
    "연구 보기"
  ],
  [
    "SEP–DEC 2025",
    "2025년 9–12월"
  ],
  [
    "Co-Founder",
    "공동 창업자"
  ],
  [
    "SEP–OCT 2025",
    "2025년 9–10월"
  ],
  [
    "Contract Software Developer",
    "계약 소프트웨어 개발자"
  ],
  [
    "JAN–JUN 2025",
    "2025년 1–6월"
  ],
  [
    "Yonsei Medisys Lab",
    "연세대학교 Medisys 연구실"
  ],
  [
    "Research Intern",
    "연구 인턴"
  ],
  [
    "SEP 2024–DEC 2025",
    "2024년 9월–2025년 12월"
  ],
  [
    "Co-Leader · AI Startup Club",
    "공동 대표 · AI 창업 동아리"
  ],
  [
    "02 / RECOGNITION",
    "02 / 수상"
  ],
  [
    "Awards & honors",
    "수상"
  ],
  [
    "AWARD · 2026",
    "수상 · 2026년"
  ],
  [
    "1st Place",
    "1위"
  ],
  [
    "Navy & Marine Corps Artificial Intelligence Competition.",
    "해군·해병대 인공지능 경진대회."
  ],
  [
    "AWARD · JUN 2025",
    "수상 · 2025년 6월"
  ],
  [
    "RED S Design Award",
    "RED S 디자인 어워드"
  ],
  [
    "Looking for a CV?",
    "이력서가 필요하신가요?"
  ],
  [
    "Request a CV",
    "이력서 요청"
  ],
  [
    "EMAIL",
    "이메일"
  ],
  [
    "Copy email address",
    "이메일 주소 복사"
  ],
  [
    "CODE & PROJECTS",
    "코드 및 프로젝트"
  ],
  [
    "PROFILE & CONNECTIONS",
    "프로필"
  ],
  [
    "RESEARCH IDENTIFIER",
    "연구자 식별자"
  ],
  [
    "Algorithms and Python solutions.",
    "알고리즘 문제 풀이와 Python 코드."
  ],
  [
    "Search posts",
    "글 찾기"
  ],
  [
    "Title, algorithm, problem number",
    "제목, 알고리즘, 문제 번호"
  ],
  [
    "Algorithms",
    "알고리즘"
  ],
  [
    "Research notes",
    "연구노트"
  ],
  [
    "All",
    "전체"
  ],
  [
    "Bitmask",
    "비트마스크"
  ],
  [
    "Number theory",
    "수론"
  ],
  [
    "No results.",
    "검색 결과가 없습니다."
  ],
  [
    "No posts yet.",
    "아직 작성한 글이 없습니다."
  ],
  [
    "← Posts",
    "← 글 목록"
  ],
  [
    "Published",
    "작성"
  ],
  [
    "Updated",
    "수정"
  ],
  [
    "Python solution",
    "Python 코드"
  ],
  [
    "Download",
    "다운로드"
  ],
  [
    "Copy code",
    "코드 복사"
  ],
  [
    "Contents",
    "목차"
  ],
  [
    "All posts →",
    "모든 글 보기 →"
  ],
  [
    "Code copied.",
    "코드를 복사했습니다."
  ],
  [
    "Copied ✓",
    "복사됨 ✓"
  ],
  [
    "Email address copied",
    "이메일 주소를 복사했습니다"
  ],
  [
    "Select the email address above to copy",
    "위 이메일 주소를 선택해 복사해주세요"
  ]
];
const dictionaries={ko:new Map(pairs),en:new Map(pairs.map(([en,ko])=>[ko,en]))};
let language='en';
try{const saved=localStorage.getItem('desk-language');language=['ko','en'].includes(saved)?saved:(navigator.language.startsWith('ko')?'ko':'en');}catch{}
export const getLanguage=()=>language;
export function t(value,target=language){
 const text=String(value),trimmed=text.trim();
 let result=dictionaries[target].get(trimmed);
 if(result===undefined){
  if(target==='en')result=trimmed.replace(/^(\d+)개의 글$/,'$1 posts').replace(/^작성 /,'Published ').replace(/^수정 /,'Updated ');
  else result=trimmed.replace(/^(\d+) posts$/,'$1개의 글').replace(/^(\d{2}) \/ From the desk$/,'$1 / 책상에서').replace(/^Published /,'작성 ').replace(/^Updated /,'수정 ');
 }

 if(target==='en')result=result
 .replace(/^(\d+) \/ (\d+)개 해$/,'$1 / $2 solutions')
 .replace(/^(\d+) \/ (\d+)행$/,'$1 / $2 rows')
 .replace(/^다음은 (\d+)번째 행$/,'Next: row $1')
 .replace(/^(\d+)개의 퀸이 서로 공격하지 않습니다\.$/,'The $1 queens do not attack one another.')
 .replace(/^왼쪽부터 열 1 … (\d+)\. 1인 칸에 놓을 수 있습니다\.$/,'Columns 1 … $1 from left to right. A 1 marks an available square.')
 .replace(/^짝수 색 (\d+) \+ 홀수 색 (\d+)$/,'Even color $1 + odd color $2')
 .replace(/^차이 (\d+), 높은 탑 (\d+), 낮은 탑 (\d+)$/,'Difference $1, taller $2, shorter $3')
 .replace(/(\d+)개 상태/g,'$1 states')
 .replace(/^(\d+)각형$/,'$1-gon')
 .replace(/^꼭짓점 (\d+)$/,'Vertex $1')
 .replace(/^(\d+)개 인수 \+ 역원$/,'$1 factors + inverse')
 .replace(/^(\d+)개 인수$/,'$1 factors')
 .replace(/뒤쪽 계산: L!/g,'Tail: L!').replace(/역원 ≡/g,'inverse ≡')
 .replace(/^위치 (\d+)$/,'Position $1')
 .replace(/^출력 =/,'Output =')
 .replace(/^복원 확률의 합 ([\d.]+) · 상위 값 (\d+)개와 해당 인덱스를 저장한다\. 그래프는 저장 바이트 수나 정확도 개선을 측정한 결과가 아니다\.$/,'Reconstructed sum $1. Store the top $2 values and their indices. The chart does not measure storage bytes or accuracy improvements.')
 .replace(/^(\d+)회$/,'$1 steps')
 .replace(/^상대 비용 ([\d.]+)$/,'Relative cost $1')
 .replace(/^비용 비율:/,'Cost ratio:')
 .replace(/^([\d.]+)배$/,'$1×')
 .replace(/^주기 (\d+)$/,'Period $1')
 .replace(/^(\d+)회 갱신$/,'$1 updates')
 .replace(/^동일한 (\d+)개 입력이 들어와도 모듈마다 갱신 횟수가 다르다\. 실제 CMS는 이 일정에 각 모듈의 학습 목적과 업데이트 규칙을 결합한다\.$/,'The same $1 inputs produce different update counts. An actual CMS combines a schedule with each module’s learning objective and update rule.')
 .replace(/^입력 (\d+): 갱신$/,'Input $1: update').replace(/^입력 (\d+)$/,'Input $1')
 .replace(/^(\d+) 곱하기 (\d+) 체스판$/,'$1 by $2 chessboard')
 .replace(/(\d+)행 (\d+)열/g,'row $1, column $2')
 .replace(/ 퀸/g,' queen').replace(/ 공격받는 칸/g,' attacked square')
 .replace(/배치 불가, 클릭해 변경/g,'forbidden, click to toggle').replace(/배치 가능, 클릭해 변경/g,'allowed, click to toggle')
 .replace(/^높은 탑 (\d+), 낮은 탑 (\d+)$/,'Taller tower $1, shorter tower $2')
 .replace(/^(\d+)각형의 삼각분할$/,'Triangulation of a $1-gon').replace(/^(\d+)각형의 사각분할$/,'Quadrangulation of a $1-gon')
 .replace(/^주기 (\d+), (\d+)회 갱신$/,'Period $1, $2 updates');

 return text.replace(trimmed,result);
}
export const english=value=>t(value,'en');
const sources=new WeakMap();
export function translateDOM(scope=document.body){
 // Article prose is supplied by explicit locale variants; generated controls use this dictionary.
 const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(node.parentElement?.closest('script,style,pre,code,.stream-char,.article-section,[data-content-localized],.localized-demo,.language-switch'))continue;
  let entry=sources.get(node);if(!entry||node.textContent!==entry.last)entry={original:node.textContent,last:node.textContent};
  const parent=node.parentElement;
  const fixed=parent?.closest('h1,h2,h3,h4,h5,h6,a,button,label,select,option,th,nav,.timeline-entry p>strong,.panel-entry p>strong,.entry-meta,.entry-tags,.blog-tags,.post-meta,.blog-card-meta,.paper-details,.page-index,.profile-mark,.timeline-date,.timeline-status,.publication-authors,.publication-venue,.code-toolbar,.site-header,.site-footer,.page-bottom,.blog-tools');
  const prose=!fixed&&parent?.closest('p,li,small,.page-intro,.demo-readout,.demo-caption,figcaption');
  const value=prose?t(entry.original):english(entry.original);if(value!==node.textContent)node.textContent=value;entry.last=value;sources.set(node,entry);
 }
 for(const attr of ['placeholder','aria-label','title'])for(const el of scope.querySelectorAll(`[${attr}]`)){const value=english(el.getAttribute(attr));if(value!==el.getAttribute(attr))el.setAttribute(attr,value);}
}
export function setLanguage(value){
 if(!['ko','en'].includes(value))return;
 language=value;document.documentElement.lang=value;
 try{localStorage.setItem('desk-language',value);}catch{}
 document.querySelectorAll('.language-switch button[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===value)));
 translateDOM();
}
export function observeLanguage(){
 const observer=new MutationObserver(()=>translateDOM());
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
 return ()=>observer.disconnect();
}
