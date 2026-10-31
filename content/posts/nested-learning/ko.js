export default {
  "summary": "모델과 optimizer를 서로 다른 속도로 갱신되는 학습 문제로 본다. momentum의 기억, Continuum Memory System, self-modifying Titans와 HOPE를 연결해 읽는다.",
  "sections": [
    {
      "id": "abstract",
      "title": "Abstract",
      "html": "<p>모델과 optimizer를 서로 다른 context flow와 갱신 속도를 갖는 학습 문제로 표현한다. Deep optimizer, self-modifying Titans, CMS를 연결하고 HOPE를 통해 이 설계를 평가한다.</p>"
    },
    {
      "id": "introduction",
      "title": "1. Introduction",
      "html": "<p>Nested Learning(NL)은 모델을 여러 학습 문제의 결합으로 표현한다. 각 문제는 자체 입력 흐름(context flow), 상태, 목적과 갱신 속도를 가진다. 여기서 학습의 수준(level)은 신경망의 층 번호와 다르다. 무엇을 얼마나 자주 갱신하는지에 따라 수준을 나눈다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>예를 들어 일반적인 추론에서 attention이 참조하는 문맥은 계속 바뀌지만, 사전학습된 가중치는 그대로다. 두 부분은 같은 모델 안에 있어도 정보를 보유하는 방식과 바뀌는 속도가 다르다. 이 차이를 구조 설계의 출발점으로 삼는다.</p><p>1.1은 여러 시간 척도의 학습을 설명하기 위한 신경생리학적 동기를 제시한다. 여기서의 생물학적 연결은 설계 관점이며 모델의 실험 결과와는 별도로 읽는다.</p>"
    },
    {
      "id": "nested",
      "title": "2. Nested Learning",
      "html": "<h3>2.1 Associative Memory</h3><p>입력과 연관된 출력을 저장·회상하는 메모리로 학습을 표현한다.</p><h3>2.2 Nested Optimization Problems</h3><p>서로 다른 context flow와 갱신 속도를 가진 최적화 문제를 수준으로 조직한다. 단순히 층을 더 쌓는 것과 구별되는 설계 축이다.</p><h3>2.3 Optimizers as Learning Modules</h3><div data-math=\"display\">\\begin{aligned}m_t&amp;=\\beta m_{t-1}+(1-\\beta)g_t\\\\\\theta_{t+1}&amp;=\\theta_t-\\eta m_t\\end{aligned}</div><p>위 식은 정규화한 momentum의 간단한 예다. m은 이전 gradient 정보를 담는 상태이며, β가 크면 과거의 영향이 오래 남는다. 이처럼 optimizer도 입력을 누적해 이후 업데이트에 영향을 주는 기억 장치로 읽을 수 있다.</p><p>저자들은 이 관점에서 optimizer를 associative memory로 다루고, 더 표현력 있는 목적과 내부 학습 규칙을 갖는 deep optimizer를 논의한다. 단순히 기존 optimizer의 이름을 메모리로 바꾼 것보다, 그 내부 상태를 학습 문제로 명시한다는 점이 중요하다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><h3>메모리를 목적함수로 표현하기</h3><div data-math=\"display\">\\mathcal M^*=\\operatorname*{arg\\,min}_{\\mathcal M}\\;\\widetilde{\\mathcal L}\\bigl(\\mathcal M(K);V\\bigr)</div><p>K는 기억할 key 집합, V는 대응하는 value 집합, M은 그 관계를 저장하는 연산자다. 이 표기에서 key·value는 토큰에 한정되지 않고 gradient나 중간 특징도 될 수 있다. 메모리의 표현 방식뿐 아니라 어떤 오차를 줄이며 관계를 저장하는지가 설계에 포함된다.</p><p>위 momentum 식을 m₀=0에서 풀어 쓰면 다음과 같다. 이는 원문의 새 optimizer를 재현한 식이 아니라, optimizer 상태가 과거 입력을 압축한다는 해석을 보여주는 예다.</p><div data-math=\"display\">m_t=(1-\\beta)\\sum_{s=1}^{t}\\beta^{t-s}g_s</div><p>오래된 gradient일수록 지수적으로 작은 가중치를 받는다. 이때 β는 유지할 시간 척도를 조절한다. Nested Learning은 이런 내부 상태의 학습과 바깥 모델의 학습을 같은 언어로 기술하고, 더 풍부한 메모리와 업데이트 규칙으로 확장한다.</p>"
    },
    {
      "id": "hope",
      "title": "3. HOPE: A Self-Referential Learning Module with Continuum Memory",
      "html": "<p>Continuum Memory System(CMS)은 서로 다른 주기로 갱신되는 MLP 메모리들을 연결한다. 논문 식 (30)–(31)에서 각 블록은 자체 chunk 크기에 맞는 시점에 업데이트된다. HOPE는 self-modifying Titans 계열의 시퀀스 모듈과 CMS를 결합한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"HOPE의 두 구성 요소\"><span>문맥 입력</span><span>Self-modifying memory<br>시퀀스 상호작용</span><span>CMS<br>여러 갱신 주기의 MLP</span><span>출력</span></div><p>아래 그림에서는 1·4·16이라는 예시 주기를 사용한다. 매 입력마다 바뀌는 상태와 여러 입력을 묶은 뒤 바뀌는 상태를 구분하는 모형이며, HOPE의 학습이나 기억 성능을 재현한 실험은 아니다.</p><p>Google Research의 해설은 Hope를 Titans의 변형으로 소개하며, 문맥에 따라 메모리와 그 업데이트를 구성하는 요소가 적응하는 과정을 설명한다. CMS는 작업 문맥과 오래 유지되는 지식 사이에 여러 갱신 속도의 저장 계층을 둔다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>이때 구현에서 구분하고 싶은 것은 <strong>현재 시퀀스 안에서 적응하는 상태</strong>와 <strong>여러 학습 시퀀스에 걸쳐 학습되는 초기 상태 및 규칙</strong>이다. 어느 파라미터에 어느 손실의 gradient가 흐르는지 적어 보면, 같은 “업데이트”라는 단어로 묶이던 두 과정이 분리된다.</p><h3>갱신 주기가 다른 상태</h3><p>다음은 주기 차이를 설명하기 위한 간략화된 규칙이다. 실제 HOPE의 전체 목적함수나 업데이트식을 대신하지 않는다. cℓ은 블록 ℓ의 주기이고, Δℓ은 해당 chunk에서 계산한 변화량이다.</p><div data-math=\"display\">W^{(\\ell)}_{t+1}=\\begin{cases}W^{(\\ell)}_t+\\Delta^{(\\ell)}_t,&amp;(t+1)\\bmod c_\\ell=0\\\\W^{(\\ell)}_t,&amp;\\text{otherwise}\\end{cases}</div><p>주기 4인 블록은 4·8·12번째 경계에서 바뀌고 중간에는 같은 상태를 사용한다. 빠른 블록은 최근 문맥에 적응하고 느린 블록은 더 긴 구간의 정보를 축적할 수 있다. 다만 느리게 갱신한다는 사실만으로 유용한 장기 기억이 보장되지는 않는다. 어떤 입력·손실을 축적하고, 바깥 학습이 이를 어떻게 훈련하는지도 함께 필요하다.</p>"
    },
    {
      "id": "experiments",
      "title": "4. Experiments",
      "html": "<p>학회판 Table 1의 1.3B 파라미터·100B 학습 토큰 조건에서 일부 결과를 추렸다. Wiki는 WikiText perplexity이며 낮을수록 좋다. Avg.는 표에 정리된 상식 추론 과제들의 평균이다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>모델</th><th>Wiki ppl ↓</th><th>추론 평균 ↑</th></tr></thead><tbody><tr><td>Transformer++</td><td>18.53</td><td>52.25</td></tr><tr><td>Titans (LMM)</td><td>15.60</td><td>56.82</td></tr><tr><td>HOPE</td><td>15.11</td><td>57.23</td></tr></tbody></table></div><p>이 비교에서는 HOPE가 두 지표 모두 개선됐다. 다만 표의 개별 과제마다 순위는 같지 않다. 저자 해설은 언어 모델링 외에도 긴 문맥 검색, 지속 학습, 지식 편입을 평가한 맥락을 소개한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>긴 문맥 검색에서는 필요한 정보가 남아 있는지를, 지속 학습에서는 새 데이터를 배운 뒤 이전 성능이 유지되는지를 평가한다. 이 둘은 평균 perplexity만으로 확인할 수 없다. 또한 추론 중 상태가 바뀌는 모델을 비교할 때는 학습 파라미터 수 외에 업데이트 계산량과 유지하는 상태의 크기도 함께 보아야 한다.</p>"
    },
    {
      "id": "summary",
      "title": "요약",
      "html": "<p>Nested Learning은 모델과 학습 규칙을 함께 기술하고, 각 상태가 어떤 입력을 얼마나 오래 압축하는지 묻는다. HOPE는 self-modifying 시퀀스 메모리와 여러 갱신 주기의 CMS를 결합한 구체적인 모델이다. 이 관점은 층 수와 별개로 학습의 시간 척도를 설계할 수 있게 한다.</p>"
    }
  ],
  "demos": [
    {
      "id": "demo",
      "type": "review-memory",
      "title": "서로 다른 갱신 주기",
      "after": "hope"
    }
  ],
  "sourceText": [
    {
      "title": "원문 · NeurIPS 2025",
      "detail": "§2 학습 수준, §3 CMS와 HOPE, Table 1의 언어 모델 비교."
    },
    {
      "title": "저자 해설 · Google Research",
      "detail": "2025-11-07. Deep optimizers, CMS, Hope의 역할과 평가 과제."
    },
    {
      "title": "확장 원고 · arXiv:2512.24695",
      "detail": "NeurIPS 원고가 안내하는 확장 버전. 이 리뷰의 수치는 학회판 Table 1 기준."
    }
  ]
};
