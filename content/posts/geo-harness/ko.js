export default {
  "summary": "사이트 분석부터 온톨로지와 콘텐츠 개선, 생성형 검색 노출 측정까지. 하나의 하네스로 묶되, API 표본과 실제 이용자 노출은 구분하는 설계.",
  "sections": [
    {
      "id": "question",
      "title": "The Question Behind the Dashboard",
      "html": "<p>GEO(Generative Engine Optimization)는 생성형 검색 답변에서 사이트가 발견되고, 올바르게 설명되고, 근거로 인용되도록 개선하는 작업이다. 사이트 하나를 입력받아 자료 조사, 콘텐츠 수정안, 관측을 한 하네스에서 관리할 수 있다. 다만 한 화면에 표시한다고 관측값의 의미까지 같아지는 것은 아니다. API에서 실험한 답변과 실제 서비스에서 이용자가 본 전체 노출을 같은 비율로 보고하면 안 된다.</p>"
    },
    {
      "id": "evidence",
      "title": "From Pages to an Evidence Graph",
      "html": "<div class=\"review-flow\"><span>사이트·외부 자료</span><span>주장·근거 정리</span><span>질문 생성</span><span>수정안 작성</span><span>발행 후 관측</span></div><p>첫 단계는 공개 페이지에서 서비스, 기능, 적용 조건, 주장, 출처를 뽑아 관계로 저장하는 일이다. 예를 들어 ‘겹쳐 말해도 화자를 구분하나?’라는 질문은 화자 분리 기능, 겹침 발화 평가 데이터, 한계를 설명하는 페이지에 연결한다. 외부 문서에서 해당 요구가 자주 보인다고 해서 제품이 그 기능을 지원한다는 뜻은 아니다. 주장을 뒷받침하는 자사 자료와 시장 요구를 발견한 외부 자료는 구별한다. 근거에는 URL, 가져온 날짜, 해당 문단과 검토 상태를 남긴다.</p><p>온톨로지는 고정된 스키마로 시작해도 충분하다. <code>Question → requires → Evidence</code>, <code>Page → answers → Question</code> 같은 관계만 있으면 어떤 질문에 답이 없고 어느 페이지를 보완해야 하는지 추적할 수 있다. URL만으로 수정안까지 만들 수 있지만, 실제 게시에는 별도의 Git·CMS 연결과 검토 절차가 필요하다.</p>"
    },
    {
      "id": "observations",
      "title": "Four Observation Channels",
      "html": "<ol><li><strong>검색 API:</strong> 지정한 모델과 검색 조건에서 브랜드 언급과 최종 URL 인용을 반복 측정한다. 검색 도구가 참조한 자료와 최종 응답의 인용은 따로 저장한다.</li><li><strong>서비스 화면 표본:</strong> 실제 UI에서 같은 질문을 새 대화로 확인한다. 서비스·언어·지역·모드·시각과 계정 상태를 기록한다. 이 역시 통제된 표본이며 전체 이용자 노출은 아니다.</li><li><strong>플랫폼 보고서:</strong> Search Console의 생성형 AI 노출과 Bing의 AI 인용처럼 플랫폼이 제공하는 집계다. 제공 범위와 단위가 다르므로 그대로 분리해 표시한다.</li><li><strong>사이트 유입:</strong> AI 검색에서 들어온 방문과 전환을 본다. 클릭하지 않은 노출은 여기서 관측할 수 없다.</li></ol><p>대시보드 첫 화면은 관측 채널과 기간을 고른 다음, 질문별 응답·인용 URL·대응 페이지·빠진 근거를 확인하도록 구성한다. ‘검색 소스에는 잡히지만 최종 인용이 적다’와 ‘자사 URL보다 외부 URL이 주로 인용된다’는 다른 개선 과제다.</p>"
    },
    {
      "id": "comparison",
      "title": "Keep the Comparison Set Fixed",
      "html": "<p>성과 비교용 고정 질문과 새로 발견한 후보 질문을 나눈다. 후보는 빠르게 추가하되 기준군에 편입할 때 버전을 올린다. 브랜드 소개나 정답을 쓰는 에이전트에는 온톨로지를 주지만, 측정 요청에는 중립적인 질문과 실험 조건만 준다. 그렇지 않으면 질문에 브랜드를 알려주고 브랜드 노출을 재는 셈이다.</p><p>표본 인용률은 <strong>자사 URL을 한 번 이상 인용한 정상 응답 수 ÷ 전체 정상 응답 수</strong>로 정의한다. 예를 들어 90회 요청 중 6회가 실패하고 정상 응답 84개 중 21개가 인용했다면 25% (21/84)이며, 실패 6회도 별도로 표시한다. 페이지 발행 전후에 이 값이 바뀌더라도 모델 교체나 색인 시차를 배제하지 못하면 발행의 인과 효과로 해석하지 않는다.</p>"
    },
    {
      "id": "mvp",
      "title": "A First Version Worth Building",
      "html": "<p>사이트 1개와 고정 질문 30개로 시작한다. API 두 곳에서 질문을 각각 3번 실행하면 한 주기에 180회 요청이다. 소수의 핵심 질문은 실제 UI에서 확인하고, 플랫폼 보고서는 내보낸 파일을 가져오는 것부터 시작한다. 재평가 우선순위는 노출 숫자 단독이 아니라, 질문의 중요도와 보완 가능한 근거가 있는지로 결정한다.</p><p>페이지를 늘리기 전에 핵심 답을 읽을 수 있는 텍스트와 고유 URL로 제공하고, 출처·조건·내부 링크가 맞는지 확인한다. 초기 GEO 연구의 인용·통계 추가 효과는 해당 실험의 결과이지 플랫폼 전체의 순위 보장이 아니다. Google 검색에 별도의 AI 전용 마크업이나 <code>llms.txt</code>가 필요하다고 전제할 이유도 없다. 이 설계의 목표는 한 숫자를 키우는 것이 아니라 <strong>어떤 질문에서 어떤 근거가 부족한지, 무엇을 바꿨고 어떤 차이가 관찰됐는지</strong> 재현하는 데 있다.</p>"
    }
  ],
  "sourceText": [
    {
      "title": "GEO: Generative Engine Optimization",
      "detail": "가시성 정의와 실험 근거."
    },
    {
      "title": "Google Search Central: Generative AI Optimization",
      "detail": "검색 접근성과 생성형 AI 최적화에 관한 공식 안내."
    },
    {
      "title": "OpenAI: Web Search",
      "detail": "웹 검색 결과와 응답 인용의 API 구조."
    },
    {
      "title": "Google Search Console: Generative AI Performance",
      "detail": "생성형 AI 노출 보고서."
    },
    {
      "title": "Bing Webmaster Tools: AI Performance",
      "detail": "지원 AI 서비스에서의 인용 보고서."
    }
  ]
};
