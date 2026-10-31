export default {
  "summary": "CV-QAOA의 원 제안 논문을 본문 절 순서대로 읽는다. 비용·운동 에너지 진화, 제약과 이산 문제의 표현, 복잡도 및 수치 예제를 설명한다.",
  "sections": [
    {
      "id": "abstract",
      "title": "Abstract",
      "html": "<p>목적함수를 potential로 표현하고 cost와 mixer 진화를 교대로 적용하는 연속 최적화를 제안한다. 중첩에서의 gradient descent 해석, 문제 표현의 확장, 복잡도 관계와 수치 예제를 제시한다.</p>"
    },
    {
      "id": "introduction",
      "title": "Introduction",
      "html": "<p>목적함수를 위치의 비용 에너지로 표현하고, 서로 교환하지 않는 cost와 mixer 진화를 번갈아 적용하는 연속 최적화 알고리즘을 제안한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>고전적인 변수 x의 후보 하나를 유지하는 대신 여러 위치의 진폭과 위상을 갖는 상태를 준비한다. 낮은 비용의 위치가 측정에서 더 자주 나오도록 진화 파라미터를 고르는 것이 목표다. 연속 공간의 파동함수를 표현할 수 있다는 사실과, 원하는 최솟값을 효율적으로 찾는다는 주장은 별개다.</p>"
    },
    {
      "id": "algorithm",
      "title": "Quantum algorithm",
      "html": "<p>원문의 표기를 따라 η는 cost 진화, γ는 mixer 진화의 계수로 쓴다. ℏ=1에서 아래 두 변환을 합치면 위치가 gradient와 기존 운동량의 영향을 함께 받는다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><div data-math=\"display\">\\begin{aligned}\\widehat H_C&amp;=f(\\widehat{\\boldsymbol x}),&amp;\\widehat H_M&amp;=\\tfrac12\\widehat{\\boldsymbol p}^{\\,2}\\\\\\widehat U(\\eta,\\gamma)&amp;=e^{-i\\gamma\\widehat H_M}e^{-i\\eta\\widehat H_C}\\\\\\widehat{\\boldsymbol p}&amp;\\mapsto\\widehat{\\boldsymbol p}-\\eta\\nabla f(\\widehat{\\boldsymbol x})\\\\\\widehat{\\boldsymbol x}&amp;\\mapsto\\widehat{\\boldsymbol x}+\\gamma\\widehat{\\boldsymbol p}-\\gamma\\eta\\nabla f(\\widehat{\\boldsymbol x})\\end{aligned}</div><p>비용 진화 직후에는 <span data-math=\"inline\">\\psi^{\\prime}(x)=e^{-i\\eta f(x)}\\psi(x)</span>이므로 <span data-math=\"inline\">|\\psi^{\\prime}(x)|^2=|\\psi(x)|^2</span>다. 밀도는 같지만 위상이 달라진다. 이후 mixer가 서로 다른 위치의 진폭을 간섭시키므로, 비용 진화의 효과가 다음 위치 분포에 나타날 수 있다.</p><p>예를 들어 <span data-math=\"inline\">f(x)=x^2/2</span>라면 위 식에 <span data-math=\"inline\">\\nabla f(x)=x</span>를 대입해 <span data-math=\"inline\">\\widehat x\\mapsto(1-\\gamma\\eta)\\widehat x+\\gamma\\widehat p</span>를 얻는다. 이는 식을 이해하기 위한 대수적 예이며 수치 최적화 결과가 아니다.</p><h3>연산자 변환을 따라가기</h3><p>위 화살표는 특정 표본의 고전 궤적이 아니라 Heisenberg picture의 연산자 변환이다. 기본 교환 관계와 cost conjugation은 다음과 같다. 아래 대수는 ℏ=1을 사용한다.</p><div data-math=\"display\">\\begin{aligned}[\\widehat x_j,\\widehat p_k]&amp;=i\\delta_{jk}\\\\e^{i\\eta f(\\widehat{\\boldsymbol x})}\\widehat{\\boldsymbol p}\\,e^{-i\\eta f(\\widehat{\\boldsymbol x})}&amp;=\\widehat{\\boldsymbol p}-\\eta\\nabla f(\\widehat{\\boldsymbol x})\\end{aligned}</div><p>f와 그 미분은 위치 연산자의 함수이므로 이 conjugation에서 더 높은 교환자 항이 사라진다. kinetic mixer는 위치를 γp만큼 이동시킨다. 따라서 상태에 cost를 먼저, mixer를 다음에 작용시키면 gradient 항이 위치 변화에 들어간다. 행렬곱은 오른쪽 연산자가 먼저 적용된다.</p><h3>회로, 측정, 고전 최적화</h3><div data-math=\"display\">\\begin{aligned}|\\psi_j\\rangle&amp;=e^{-i\\gamma_j\\widehat H_M}e^{-i\\eta_j\\widehat H_C}|\\psi_{j-1}\\rangle,\\quad j=1,\\ldots,P\\\\q(\\boldsymbol x)&amp;=|\\langle\\boldsymbol x|\\psi_P\\rangle|^2\\\\\\mathbb E_q[f]&amp;=\\int f(\\boldsymbol x)q(\\boldsymbol x)\\,d\\boldsymbol x\\end{aligned}</div><p>P는 반복 횟수이며 η·γ는 각 반복에 하나씩 있다. 위치 측정으로 후보를 얻고 여러 실행에서 함수값을 평가한다. 평균 비용을 낮추는 것과 소수 표본 중 최선값을 고르는 것은 서로 다른 평가다. 선택한 초기 상태, 파라미터 일정, 표본 수를 함께 명시해야 결과를 비교할 수 있다.</p><p>비용 함수가 알려진 저차 다항식이면 해당 위상 연산을 gate로 분해하는 접근을 쓸 수 있다. black-box 함수라면 중첩 입력에 작용하는 oracle 등의 구현이 필요하다. 함수값을 고전적으로 계산할 수 있다는 사실만으로 이러한 양자 연산이 무료로 주어지지는 않는다.</p>"
    },
    {
      "id": "constraints",
      "title": "Constrained Optimization",
      "html": "<p>제약 위반에 비용을 주는 potential을 목적함수에 더한다. 허용 영역과 위반 영역의 에너지 차이로 탐색을 유도한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>등식 제약의 간단한 예로 <span data-math=\"inline\">\\lambda(g(x)-c)^2</span>를 더하면 g(x)=c에서 추가 비용이 0이고, 제약을 벗어날수록 커진다. λ는 제약과 원래 목적 사이의 비중을 조절한다.</p><div data-math=\"display\">\\begin{aligned}f_\\lambda(\\boldsymbol x)&amp;=f(\\boldsymbol x)+\\lambda\\bigl(g(\\boldsymbol x)-c\\bigr)^2\\\\\\nabla f_\\lambda&amp;=\\nabla f+2\\lambda(g-c)\\nabla g\\end{aligned}</div><p>이를 gradient 항에 대입하면 제약의 오차가 위치 변화에 어떻게 반영되는지 보인다. λ를 크게 하면 위반을 강하게 벌하지만 더 가파른 potential도 만든다. 유한한 λ와 유한 회로 깊이에서 측정한 모든 표본이 제약을 정확하게 만족한다고 볼 수 없으므로 원래 함수값과 제약 잔차를 따로 확인한다.</p><p>부등식에는 위반하는 쪽에서 증가하는 rectifier 계열 potential을 사용한다. 원문은 미분 가능한 근사도 논의한다. 이 방식은 feasible 영역만 허용하는 전용 mixer와는 달리 cost landscape에 제약을 넣는 접근이다.</p>"
    },
    {
      "id": "discrete",
      "title": "Encoding discrete optimization problems",
      "html": "<p>연속 변수에 이산 선택을 대응시키는 함수와 potential을 사용해 이산 목적함수도 표현한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><div data-math=\"display\">\\begin{aligned}\\tau_\\beta(x)&amp;=\\tanh(\\beta x)\\\\W_{\\omega,\\lambda}(\\boldsymbol x)&amp;=\\sum_j\\frac{\\omega^2}{2}(x_j^2-\\lambda^2)^2\\\\\\widehat H_C&amp;=f\\bigl(\\tau_\\beta(\\widehat{\\boldsymbol x})\\bigr)+W_{\\omega,\\lambda}(\\widehat{\\boldsymbol x})\\end{aligned}</div><p>tanh는 위치의 부호를 매끄럽게 근사해 ±1 선택에 대응시킨다. double-well potential은 각 변수를 두 우물 근처에 머물도록 만든다. 이산 목적함수의 에너지와 우물에 가두는 에너지를 함께 설계하는 것이다. β는 부호 근사의 날카로움, ω와 λ는 우물의 형태·간격을 조절하며, 이 λ는 앞 절의 제약 가중치와 다른 역할이다.</p>"
    },
    {
      "id": "complexity",
      "title": "Complexity",
      "html": "<p>연속 공간의 Grover search와 CV-IQP 회로를 포함할 수 있는 변형을 논의한다. 이는 회로족의 관계에 대한 결과이며 모든 목적함수의 최적화 속도를 보장하지는 않는다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>Grover 관련 결과는 특별한 cost·mixer 선택으로 검색 알고리즘을 표현할 수 있다는 내용이다. CV-IQP 관련 결과는 특정 회로의 출력 분포를 고전적으로 모사하기 어렵다는 복잡도 가정과 연결된다. 어려운 분포를 만들 수 있다는 사실만으로 낮은 목적함수값이 높은 확률로 나온다고 결론낼 수는 없다. 최적화 품질에는 별도의 성능 분석이나 실험이 필요하다.</p>"
    },
    {
      "id": "examples",
      "title": "Numerical examples",
      "html": "<p>2차원 Styblinski–Tang 함수를 수치적으로 최적화한다. 초기 상태는 momentum-squeezed 상태이며, 최종 측정 표본을 이용해 낮은 함수값을 찾는다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>원문에서 1,000개 표본의 최선 함수값은 −78.33216이며, 비교한 전역 최솟값은 약 −78.3323이다.</p><div data-math=\"display\">f(\\boldsymbol x)=\\frac12\\sum_{j=1}^{2}(x_j^4-16x_j^2+5x_j)</div><p>각 변수에 여러 우물이 있어 지역 최솟값과 전역 최솟값을 구별할 수 있는 작은 예제다. momentum-squeezed 초기 상태는 위치 공간에서 넓게 퍼진 상태와 연결되지만, 실제 구현에는 유한 squeezing과 근사 표현이 필요하다.</p><p>보고된 best-of-1,000 값은 평균 성능이나 성공 확률을 뜻하지 않는다. 재현 실험이라면 표본별 함수값 분포, 일정 기준 이하의 성공 비율, 회로 깊이와 시뮬레이터 절단 오차도 함께 제시해야 한다. 이 2차원 예제만으로 고차원 문제에서의 우위를 결론내릴 수는 없다.</p>"
    },
    {
      "id": "conclusion",
      "title": "Conclusion",
      "html": "<p>중첩 상태에서의 gradient descent라는 해석과 제약·이산 문제로의 확장을 정리한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>원문의 기여는 연속 목적함수를 번갈아 작용하는 양자 진화로 옮기고 그 한 단계를 momentum 기반 gradient 이동으로 해석한 데 있다. 실제 적용에서는 cost 연산의 구현, 초기 상태, 파라미터 선택과 측정 비용을 하나의 알고리즘 비용으로 함께 평가해야 한다.</p>"
    },
    {
      "id": "summary",
      "title": "요약",
      "html": "<p>Cost 진화는 위치별 위상을 바꾸고 운동량을 gradient 방향으로 이동시킨다. Kinetic mixer는 운동량을 위치 변화로 연결한다. 따라서 중간 상태의 확률밀도뿐 아니라 위상도 다음 진화에 영향을 준다.</p>"
    }
  ],
  "demos": [
    {
      "id": "cost-phase",
      "type": "review-phase",
      "title": "Cost 진화: 확률밀도와 복소 진폭",
      "after": "introduction"
    },
    {
      "id": "kinetic-mixer",
      "type": "review-mixer",
      "title": "Mixer 이후 위치 분포",
      "after": "algorithm"
    }
  ],
  "sourceText": [
    {
      "title": "원문 · arXiv:1902.00409",
      "detail": "2019년 원 제안. 번호 없는 본문 절의 순서를 따르며, 식 (1)–(4)의 표기를 사용한다."
    }
  ]
};
