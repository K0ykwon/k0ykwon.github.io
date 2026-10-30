const pairs = [
 ["For research conversations, collaboration, or a simple hello.","연구나 협업에 관한 이야기, 가벼운 인사도 환영합니다."],
 ["Light","라이트"],["Dark","다크"],["switch to dark mode","다크 모드로 전환"],["switch to light mode","라이트 모드로 전환"],
 ["Main navigation","주 메뉴"],["Selected section","현재 섹션"],["Personal profiles","개인 프로필"],

 ["Weather unavailable · Seoul local time","날씨 정보 없음 · 서울 시간"],["Connecting to the sky…","날씨 확인 중…"],["Clear · Live weather","맑음 · 실시간 날씨"],["Cloudy · Live weather","흐림 · 실시간 날씨"],["Rain · Live weather","비 · 실시간 날씨"],["Snow · Live weather","눈 · 실시간 날씨"],["Comments","댓글"],["Comments are not available yet.","댓글은 준비 중입니다."],["Comments could not be loaded.","댓글을 불러오지 못했습니다."],
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
    "INSIDE THE FOLDER",
    "폴더 속 이력"
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
    "I’m an Artificial Intelligence undergraduate at Yonsei University, currently on leave while serving as an AI Specialist in the Republic of Korea Navy. I work across applied AI research and software development.",
    "연세대학교 인공지능학과에 재학 중이며, 현재 휴학 후 대한민국 해군 AI 개발병으로 복무하고 있습니다. 응용 AI 연구와 소프트웨어 개발을 하고 있습니다."
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
    "B.S. in Artificial Intelligence — in progress.",
    "인공지능학과 학사과정 재학 중."
  ],
  [
    "Seoul, Republic of Korea. Currently on a leave of absence.",
    "대한민국 서울. 현재 휴학 중."
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
    "I’m interested in representation learning, computer vision, and efficient AI systems. My research also explores quantum optimization.",
    "표현 학습, 컴퓨터 비전, 효율적인 AI 시스템에 관심이 있습니다. 양자 최적화도 연구하고 있습니다."
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
    "I like connecting research with implementation: exploring an idea, testing it in code, and turning what I learn into tools that help with real tasks.",
    "아이디어를 코드로 실험하고, 그 과정에서 배운 내용을 실제 작업에 쓰이는 도구로 만드는 일을 좋아합니다."
  ],
  [
    "Python and PyTorch are central to my machine learning work; I also build the interfaces and services around it.",
    "머신러닝에는 주로 Python과 PyTorch를 사용하며, 모델을 활용하는 인터페이스와 서비스도 개발합니다."
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
    "For research conversations, software projects, or collaboration, feel free to reach out.",
    "연구, 소프트웨어 프로젝트, 협업에 관한 이야기를 기다립니다."
  ],
  [
    "Email",
    "이메일"
  ],
  [
    "Selected publications in applied AI and information representation, followed by a short overview of ongoing work.",
    "응용 AI 및 정보 표현 분야의 논문과 진행 중인 연구를 소개합니다."
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
    "An autoencoder-based transmission framework combining latent compression with spectral patch prioritization. On KSC and Salinas, it achieves approximately 613× and 710.5× latent-payload reductions, respectively, while outperforming random and edge-based selection on important-region retrieval.",
    "오토인코더 기반 잠재 표현 압축과 스펙트럼 패치 우선순위 선정을 결합한 전송 프레임워크입니다. KSC와 Salinas에서 잠재 페이로드를 각각 약 613배, 710.5배 줄였으며, 중요 영역 검색 지표에서 무작위·에지 기반 선택보다 높은 성능을 얻었습니다."
  ],
  [
    "A corpus study of the Inchon Landing that develops a provenance-preserving schema and resources for extracting structured information from historical battle records.",
    "인천상륙작전 기록을 대상으로, 역사 전투 기록에서 구조화된 정보를 추출하기 위한 출처 보존 스키마와 자원을 구축한 코퍼스 연구입니다."
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
    "A public-data-based framework combining fire/smoke donor crops, ship-like background and confuser images, and synthetic positive proxies. The prototype connects detection, temporal verification, and alert evidence capture across multiple camera channels.",
    "공개 화재·연기 이미지, 함정과 유사한 배경 및 오탐 유발 이미지, 합성 양성 자료를 결합한 프레임워크입니다. 여러 카메라 채널에서 탐지, 시간축 검증, 경보 근거 저장을 연결했습니다."
  ],
  [
    "A four-stream MP4 NVR emulator processed 240 sampled frames at 27.80 analyzed FPS, providing preliminary validation of the end-to-end processing pipeline.",
    "4개 스트림의 MP4 NVR 에뮬레이터에서 240개 샘플 프레임을 초당 27.80프레임으로 분석해 전체 처리 흐름을 예비 검증했습니다."
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
    "Phase-aware compression and transfer for continuing CV-QAOA optimization through short coherent blocks.",
    "짧은 결맞음 블록을 이어 CV-QAOA 최적화를 계속하기 위한 위상 기반 압축 및 전달 기법."
  ],
  [
    "Resolving parent relationships between entities using passage evidence.",
    "본문의 근거를 이용한 개체 간 부모 관계 판별."
  ],
  [
    "Tools for exploring models, working with information, and turning experiments into software.",
    "모델을 분석하고 정보를 다루며, 실험을 소프트웨어로 구현한 프로젝트입니다."
  ],
  [
    "PyTorch tracing and model exploration, with observed Model IR, editable ArchitectureIR, a harness, and a skill registry.",
    "관측 기반 Model IR, 편집 가능한 ArchitectureIR, 하네스와 스킬 레지스트리를 갖춘 PyTorch 추적 및 모델 분석 도구입니다."
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
    "A legal document analysis and case-retrieval system developed through Creai+it.",
    "Creai+it에서 개발한 법률 문서 분석 및 판례 검색 시스템입니다."
  ],
  [
    "AI · INFORMATION RETRIEVAL",
    "AI · 정보 검색"
  ],
  [
    "Document processing, retrieval, and question answering in a practical assistant workflow.",
    "문서 처리, 검색, 질의응답을 연결한 문서 어시스턴트입니다."
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
    "Applied AI research and development as an AI-specialized enlisted service member, including a mission-aware hyperspectral image transmission framework using autoencoder compression and spectral patch prioritization.",
    "AI 개발병으로 응용 AI를 연구·개발하고 있습니다. 오토인코더 압축과 스펙트럼 패치 우선순위 선정을 이용한 임무 기반 초분광 영상 전송 프레임워크를 개발했습니다."
  ],
  [
    "Participating in technical research and discussions on hyperspectral satellite systems in collaboration with the Agency for Defense Development (ADD).",
    "국방과학연구소(ADD)와 협력해 초분광 위성 시스템 관련 기술 연구와 논의에 참여하고 있습니다."
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
    "Co-founded an AI-powered education platform organizing admissions-focused influencer content into a structured learning environment.",
    "입시 분야 인플루언서 콘텐츠를 체계적인 학습 환경으로 구성하는 AI 교육 플랫폼을 공동 창업했습니다."
  ],
  [
    "Developed AI-assisted learning features and contributed to product design and frontend development with Next.js and TypeScript.",
    "AI 학습 지원 기능을 개발하고, Next.js 및 TypeScript를 사용한 제품 설계와 프런트엔드 개발에 참여했습니다."
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
    "Developed SamoAI-InstagramTracker, an AI-powered Instagram influencer discovery and data collection application built on the SamoAI multi-agent framework.",
    "SamoAI 멀티에이전트 프레임워크를 기반으로 인스타그램 인플루언서 탐색 및 데이터 수집 도구 SamoAI-InstagramTracker를 개발했습니다."
  ],
  [
    "Contributed to maintenance of the SamoAI engine and its CLI-based agent chat interface.",
    "SamoAI 엔진과 CLI 기반 에이전트 채팅 인터페이스 유지보수에 참여했습니다."
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
    "Researched low-dose CT image quality assessment with 11,200 MOS-annotated images, training and evaluating EfficientNet, ViT, TinyViT, and ManiQA.",
    "MOS 품질 주석이 있는 CT 이미지 11,200장으로 저선량 CT 영상 품질 평가를 연구하고, EfficientNet, ViT, TinyViT, ManiQA를 학습·평가했습니다."
  ],
  [
    "Investigated CT denoising fine-tuning with an image quality assessment model as a reward signal.",
    "영상 품질 평가 모델을 보상 신호로 사용하는 CT 잡음 제거 미세조정 방법을 연구했습니다."
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
    "Led AI product development across document intelligence, legal AI, assistive technology, and generative AI. Projects included Somni, an AI-assisted narrative development system, and Miney, a legal document analysis and case-retrieval system.",
    "문서 지능, 법률 AI, 보조공학, 생성형 AI 분야의 제품 개발을 이끌었습니다. AI 서사 개발 시스템 Somni와 법률 문서 분석·판례 검색 시스템 Miney 등을 개발했습니다."
  ],
  [
    "Collaborated with Upstage on a Solar-based intelligent document processing system and participated in the 2025 AGI Agent Hackathon.",
    "Upstage와 Solar 기반 지능형 문서 처리 시스템을 개발하고 2025 AGI Agent Hackathon에 참가했습니다."
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
    "1st Prize · Interactive Media Design, Yonsei University.",
    "1등 · 연세대학교 인터랙티브 미디어 디자인."
  ],
  [
    "Looking for a CV?",
    "이력서가 필요하신가요?"
  ],
  [
    "For a current CV or more details about my work, please get in touch.",
    "최신 이력서나 자세한 경력은 이메일로 문의해주세요."
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
export function t(value){
 const text=String(value),trimmed=text.trim();
 let result=dictionaries[language].get(trimmed);
 if(result===undefined){
  if(language==='en')result=trimmed.replace(/^(\d+)개의 글$/,'$1 posts').replace(/^작성 /,'Published ').replace(/^수정 /,'Updated ');
  else result=trimmed.replace(/^(\d+) posts$/,'$1개의 글').replace(/^(\d{2}) \/ From the desk$/,'$1 / 책상에서').replace(/^Published /,'작성 ').replace(/^Updated /,'수정 ');
 }
 return text.replace(trimmed,result);
}
const sources=new WeakMap();
export function translateDOM(scope=document.body){
 // Articles retain their written language; navigation and metadata follow the UI language.
 const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(node.parentElement?.closest('script,style,pre,code,.stream-char,.article-section,.article-demo,.language-switch'))continue;
  let entry=sources.get(node);if(!entry||node.textContent!==entry.last)entry={original:node.textContent,last:node.textContent};
  const value=t(entry.original);if(value!==node.textContent)node.textContent=value;entry.last=value;sources.set(node,entry);
 }
 for(const attr of ['placeholder','aria-label'])for(const el of scope.querySelectorAll(`[${attr}]`)){const value=t(el.getAttribute(attr));if(value!==el.getAttribute(attr))el.setAttribute(attr,value);}
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
