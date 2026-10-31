export default {
  "summary": "토큰 묶음의 autoencoder, energy score로 학습하는 생성 head, 이산 토큰을 거쳐 돌아오는 입력 경로를 연결한다. 복원 정확도와 생성 품질은 따로 읽는다.",
  "sections": [
    {
      "id": "abstract",
      "title": "Abstract",
      "html": "<p>K개 토큰을 하나의 연속 벡터로 표현해 next-token prediction을 next-vector prediction으로 바꾼다. 이를 위해 autoencoder, likelihood-free 생성·평가·샘플링 방법을 결합한다.</p>"
    },
    {
      "id": "introduction",
      "title": "1. Introduction",
      "html": "<p>여기서 CALM은 <em>Continuous Autoregressive Language Models</em>를 뜻한다. 한 번에 한 토큰을 고르는 대신 <var>K</var>개 토큰에 대응하는 연속 벡터를 생성한다. autoencoder가 이산 토큰 묶음과 벡터 사이를 연결한다. 논문 Figure 1의 K=3은 설명용 예이고, 주요 실험에는 K=4 설정이 쓰인다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>이 관점은 Transformer의 큰 행렬을 더 빨리 계산하는 것과 다르다. 생성할 단위의 수를 줄이려는 접근이다. 다만 한 단계에 추가되는 복원·압축 계산도 있으므로, 단계가 K배 줄어든다는 사실을 전체 지연시간 K배 개선으로 읽어서는 안 된다.</p>"
    },
    {
      "id": "autoencoder",
      "title": "2. Autoencoder",
      "html": "<div data-math=\"display\">\\begin{aligned}z_i&amp;=\\operatorname{Enc}(x_{(i-1)K+1:iK})\\\\\\widehat x_{(i-1)K+1:iK}&amp;=\\operatorname{Dec}(z_i)\\end{aligned}</div><p>autoencoder의 역할은 토큰 묶음의 정보를 보존하는 것이다. 저자 해설의 최종 설정은 K=4를 128차원 잠재 벡터로 옮기며, 토큰 단위 복원 정확도가 99.9%를 넘는다. 변분 정규화와 dropout으로 잠재 표현을 부드럽게 만들어, 작은 교란에도 복원 결과가 쉽게 무너지지 않도록 한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>복원이 거의 정확해도 다음 벡터를 예측하기 쉬운 공간이라고 단정할 수는 없다. 예를 들어 토큰 묶음마다 아주 멀리 떨어진 임의의 점을 부여하면, 점에서 토큰을 되찾는 것은 가능해도 문맥에 맞는 다음 점을 생성하는 문제는 어려워진다. 이 예에서 복원 성능과 생성 공간의 구조는 별개의 설계 목표다.</p><p>2.1은 복원 정확도, 2.2는 잡음에 강한 표현을 다룬다. 원 토큰을 되찾는 능력과 잠재 공간에서 안정적으로 생성할 수 있는 성질을 함께 확보하려는 설계다.</p><h3>복원과 생성에 필요한 공간</h3><div data-math=\"display\">\\mathcal L_{\\rm ae}=-\\sum_{j=1}^{K}\\log p_{\\rm dec}(x_j\\mid z)</div><p>한 chunk의 K개 위치에서 원래 토큰을 복원하는 cross-entropy다. encoder는 위치별 특징을 만든 뒤 합쳐 잠재 벡터로 압축하고, decoder는 이를 다시 K개 위치로 펼친다. 각 chunk는 주변 문맥 없이 독립적으로 압축되므로 chunk 간 의존성은 뒤의 언어 모델이 담당한다.</p><p>원문은 복원만 고려하면 K=4에서 10차원으로도 높은 정확도를 얻지만, 생성에 적합한 최종 표현에는 128차원과 변분 정규화·dropout을 사용한다. 차원을 많이 줄였다는 사실보다 예측 오차가 있는 벡터에서도 토큰이 안정적으로 복원되는지가 중요하다. dropout은 autoencoder 학습에 사용하며 이후 언어 모델 학습·추론에서는 끈다.</p>"
    },
    {
      "id": "model",
      "title": "3. Likelihood-Free Language Modeling",
      "html": "<p>다음 표현을 MSE로 회귀하면 여러 가능한 문장의 평균에 가까운 벡터가 나올 수 있다. CALM의 생성 head는 문맥 표현 <var>h</var>와 잡음 <var>ε</var>를 받아 <var>z = G(h, ε)</var>를 샘플링한다. Energy score는 정답과의 거리뿐 아니라 생성 샘플끼리의 거리도 사용한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><div data-math=\"display\">\\mathcal L_{\\rm energy}=2\\,\\mathbb E\\lVert Z-z^*\\rVert_2-\\mathbb E\\lVert Z-Z^{\\prime}\\rVert_2</div><p>Z와 Z′는 같은 문맥에서 독립적으로 뽑은 샘플이다. 첫 항은 관측된 목표에 가까워지도록 하고, 두 번째 항은 샘플이 한 점으로 뭉치는 것을 막는 방향으로 작용한다. 이 두 항을 함께 보는 것이 단일 평균 예측과의 차이다.</p><p>공식 구현에는 energy 기반 head 외에 diffusion과 flow matching용 학습 스크립트도 있다. 기본 energy head는 한 번의 생성 호출을 사용하며, 반복 샘플링을 사용하는 대안과 효율을 비교한다.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"참고문헌 3\">[3]</a></sup></p><div class=\"review-flow\" aria-label=\"CALM의 자기회귀 생성 경로\"><span>이전 토큰 묶음</span><span>입력 압축 + Transformer</span><span>잡음 + 생성 head</span><span>다음 벡터 z</span><span>Decoder → K개 토큰</span></div><p>저자 해설은 예측한 벡터를 바로 다시 넣는 대신, 토큰으로 복원한 뒤 embedding과 입력 압축을 거쳐 다음 단계에 공급하는 경로를 설명한다. 출력 공간은 연속적이지만 입력을 구성할 때는 다시 이산 토큰을 사용한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>따라서 기존 LLM의 embedding만 묶어 넣는 방식과도 다르다. 입력 단위, 출력 head, autoencoder, 학습 목적이 함께 바뀐다. 이미 학습한 일반 LLM 앞에 autoencoder 하나를 붙인다고 같은 모델이 되는 것은 아니다.</p><h3>평균 회귀와 분포 학습</h3><div data-math=\"display\">\\widetilde z_i=G_\\theta(h_{i-1},\\varepsilon),\\qquad\\varepsilon\\sim\\mathcal N(0,I)</div><p>문맥 h가 같아도 잡음이 다르면 다른 다음 벡터가 나올 수 있다. 정답이 두 개의 떨어진 군집에 놓인 상황에서 MSE로 한 점을 예측하면 두 군집 사이의 낮은 밀도 영역을 택할 수 있다. energy loss는 샘플 분포를 맞추려는 목적이므로 이 평균 문제를 다른 방식으로 다룬다.</p><p>위 energy 식은 관측 목표 하나와 지수 1을 사용한 기본형이다. 실제 학습에서는 한 문맥에서 생성 샘플 N=8개와 autoencoder posterior의 목표 샘플 M=100개를 뽑아 두 기댓값을 추정한다. 서로 다른 생성 샘플 쌍만 두 번째 항에 넣는다. 학습 중 여러 샘플을 사용하는 것과 추론 시 하나의 벡터를 단일 head 호출로 생성하는 것은 구별해야 한다.</p>"
    },
    {
      "id": "evaluation",
      "title": "4. Likelihood-Free LM Evaluation",
      "html": "<p>논문은 샘플 기반 지표인 BrierLM(높을수록 좋음)을 제안하고, 계산량 대비 언어 모델 성능을 비교한다. 또한 autoencoder ablation에서 복원 정확도가 비슷하게 높아도 잠재 차원과 정규화에 따라 downstream 점수가 달라지는 결과를 보인다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>비교를 읽을 때는 모델 파라미터 수, 학습 FLOPs, 추론 FLOPs, 실제 처리량을 구별할 필요가 있다. 단계 수 계산은 아키텍처를 이해하는 출발점이고, 최종 생성 품질은 벡터 분포를 얼마나 잘 학습했는지에 달려 있다. 아래 계산기는 단계 수와 지정한 단계당 비용의 관계만 보여준다.</p><p>4.1은 평가 원칙, 4.2는 BrierLM을 다룬다. BrierLM은 n-gram 단위의 Brier 기반 점수를 결합해 샘플만으로 비교할 수 있도록 한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>문맥에 대한 가능한 n-gram의 확률을 q라고 할 때, Brier score는 정답 확률을 높이되 모든 출력에 높은 확률을 주는 편법을 제곱합으로 억제한다. 아래 식은 <strong>점수 원리를 설명하는 기본형</strong>이며 BrierLM의 n-gram 결합식 자체를 대체하지 않는다.</p><div data-math=\"display\">S(q,y)=2q(y)-\\sum_u q(u)^2</div><p>독립 표본 U, V를 q에서 뽑으면 <span data-math=\"inline\">\\Pr(U=y)=q(y)</span>, <span data-math=\"inline\">\\Pr(U=V)=\\sum_uq(u)^2</span>이다. 따라서 명시적인 확률값 대신 표본의 정답 일치·표본 간 일치로 이 점수를 추정할 수 있다. 논문은 여러 길이의 n-gram 점수를 결합해 생성 chunk 크기가 다른 모델을 비교한다.</p>"
    },
    {
      "id": "sampling",
      "title": "5. Likelihood-Free Temperature Sampling",
      "html": "<p>확률을 직접 계산하지 않고도 P(x)<sup>1/T</sup>에 비례하도록 샘플링하는 문제를 다룬다. 5.1의 rejection 방식, 5.2의 예상 비용, 5.3의 배치 근사를 순서대로 설명한다. 배치 근사는 유한 표본에서 정확한 온도 분포와 차이가 있을 수 있으며, 배치 크기가 계산량과 근사 품질을 조절한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><div data-math=\"display\">q_T(x)=\\frac{q(x)^{1/T}}{\\sum_u q(u)^{1/T}}</div><p>T=1이면 원래 분포, 0&lt;T&lt;1이면 큰 확률에 상대적으로 더 무게를 준다. 일반적인 softmax LM에서는 logits를 나누면 되지만, CALM에서는 벡터 잡음을 작게 만드는 것만으로 복원된 토큰의 위 분포가 보장되지 않는다. 이 때문에 논문은 이산 출력 표본을 이용한 별도의 온도 조절을 설계한다.</p>"
    },
    {
      "id": "related",
      "title": "6. Related Work",
      "html": "<p>6.1–6.4는 autoencoder, likelihood-free 모델링, 평가, 온도 샘플링을 다룬다. 압축된 표현을 학습하는 일과 그 표현의 다음 분포를 생성하는 일을 구분하고, 이산 토큰 출력과 연속 생성 공간 사이의 관계를 정리한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
    },
    {
      "id": "experiments",
      "title": "7. Experiments",
      "html": "<p>7.1 학습 설정, 7.2 주요 결과, 7.3 autoencoder, 7.4 모델 구조, 7.5 온도 샘플링의 순서다. 주요 비교 축은 성능 대비 계산량이며, 잠재 차원·정규화·생성 head·입력 경로·샘플링 설정을 나눠 분석한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>Autoencoder의 토큰 복원율은 언어 모델의 문장 생성 품질과 다른 지표다. 구조 ablation은 같은 복원율이어도 latent의 규칙성이나 입력 구성에 따라 다음 벡터 학습이 달라짐을 확인한다. 비교 그림에서 한 점의 우위보다, 같은 계산 예산에서 어떤 품질을 얻는지와 여러 예산에 걸친 곡선을 함께 읽는 것이 유용하다.</p>"
    },
    {
      "id": "conclusion",
      "title": "8. Conclusion and Future Work",
      "html": "<p>한 단계의 semantic bandwidth K를 새로운 설계 축으로 정리한다. 이후 과제로 의미 구조를 갖춘 autoencoder, 생성 모델과 학습 목적, 가벼운 샘플링, 모델·데이터·K를 함께 보는 scaling을 제안한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
    },
    {
      "id": "summary",
      "title": "요약",
      "html": "<p>CALM은 K개 토큰을 대표하는 벡터를 예측한다. autoencoder, energy 기반 생성, 샘플 기반 평가와 온도 조절이 함께 바뀐다. 복원 정확도, 생성 품질, 단계 수와 실제 실행 비용을 구분해서 읽는 것이 전체 설계를 이해하는 데 도움이 된다.</p>"
    }
  ],
  "demos": [
    {
      "id": "demo",
      "type": "review-calm",
      "title": "토큰 묶음과 생성 단계 수",
      "after": "evaluation"
    },
    {
      "id": "energy-loss",
      "type": "review-energy",
      "title": "평균 예측과 두 모드 분포",
      "after": "model"
    }
  ],
  "sourceText": [
    {
      "title": "원문 · Continuous Autoregressive Language Models",
      "detail": "v1, 2025-10-31. §2 autoencoder, §3 생성, §4 BrierLM, §7 실험 및 ablation."
    },
    {
      "title": "저자 해설 · Chenze Shao",
      "detail": "Autoencoder, energy score, 이산 입력 복원 경로와 계산량 비교."
    },
    {
      "title": "공식 구현 · shaochenze/calm",
      "detail": "README의 autoencoder·Energy Transformer·평가·샘플링 구성 및 대체 head 학습 스크립트."
    }
  ]
};
