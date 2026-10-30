export const PAPER_REVIEWS = [
  {
    "id": "attention-is-all-you-need",
    "slug": "attention-is-all-you-need",
    "kind": "review",
    "title": "Attention Is All You Need — 순환 없이 문맥을 읽는 방법",
    "category": "Paper review",
    "subcategory": "Transformer",
    "tags": [
      "Transformer",
      "Attention",
      "NLP"
    ],
    "summary": "Q·K·V와 causal mask의 계산을 따라가며, Transformer가 학습을 병렬화한 방법과 여전히 순차적인 생성 과정을 구분한다.",
    "published": "2026-10-30",
    "updated": "2026-10-30",
    "paper": {
      "title": "Attention Is All You Need",
      "authors": "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin",
      "year": 2017,
      "venue": "NeurIPS 2017"
    },
    "sources": [
      {
        "title": "원문 · Attention Is All You Need",
        "url": "https://arxiv.org/abs/1706.03762",
        "detail": "§3 구조 및 attention, §4 계산량, §6 번역 실험. arXiv v7 확인."
      },
      {
        "title": "저자 해설 · Google Research",
        "url": "https://research.google/blog/transformer-a-novel-neural-network-architecture-for-language-understanding/",
        "detail": "Jakob Uszkoreit, 2017-08-31. 순차 계산, attention 정보 전달과 번역 모델의 생성 경로."
      }
    ],
    "demo": "review-attention",
    "demoTitle": "Q·K·V와 마스크 계산",
    "sections": [
      {
        "id": "question",
        "title": "1. 문장을 읽는 순서를 계산 순서로 고정해야 할까?",
        "html": "<p>RNN은 앞선 은닉 상태를 계산해야 다음 위치로 진행할 수 있다. 문장이 길어지면 위치 사이의 정보 전달 경로도 길어진다. Transformer는 위치 간 상호작용을 attention으로 계산해 이 순차 의존성을 줄인 번역 모델이다. 원래 모델은 <strong>encoder–decoder</strong>이며, 오늘날의 decoder-only LLM과 구분해서 읽는 편이 좋다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>이 글에서는 한 위치의 출력이 어떻게 다른 위치의 정보를 모으는지부터 계산한다. 수식을 실제로 계산해 보면 attention의 가중치와 최종 표현이 서로 다른 대상이라는 점도 드러난다.</p>"
      },
      {
        "id": "attention",
        "title": "2. Q는 질문, K는 비교 기준, V는 전달할 값",
        "html": "<div class=\"article-formula\">Q = XW<sub>Q</sub>, K = XW<sub>K</sub>, V = XW<sub>V</sub><br>A = softmax(QKᵀ / √d<sub>k</sub>)<br>Y = AV</div><p>입력 <var>X ∈ ℝ<sup>n×d</sup></var>에서 Q, K, V를 각각 선형 투영한다. <var>A</var>의 한 행은 한 query가 각 key에 부여하는 가중치다. softmax는 key 방향으로 적용하므로 행의 합은 1이며, 그 가중치로 value를 합쳐 출력 벡터를 만든다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>작은 계산 예를 들면, 가중치가 <code>[0.75, 0.25]</code>이고 value가 각각 <code>[2, 0]</code>, <code>[0, 4]</code>일 때 출력은 <code>[1.5, 1]</code>이다. 이 출력은 두 value의 혼합이지, 가장 큰 가중치를 받은 토큰 하나를 선택한 결과가 아니다.</p><p>독립이고 분산이 1인 성분들의 내적은 차원이 커질수록 분산도 커진다. √d<sub>k</sub>로 나누는 것은 큰 내적이 softmax를 지나치게 뾰족하게 만드는 현상을 완화하기 위한 스케일 조정이다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p>"
      },
      {
        "id": "architecture",
        "title": "3. attention만으로 끝나는 모델은 아니다",
        "html": "<p>각 head는 서로 다른 투영을 사용하고, 결과를 이어 붙여 다시 투영한다. 위치별 FFN, residual connection, layer normalization도 함께 사용한다. 원 논문은 sublayer 뒤에 정규화를 두는 <strong>Post-LN</strong> 구조이며, 위치 정보는 입력 embedding에 더한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"Transformer encoder의 한 블록\"><span>입력 + 위치</span><span>Multi-head attention</span><span>Add &amp; Norm</span><span>FFN</span><span>Add &amp; Norm</span></div><p>원문을 코드로 옮길 때는 세 개의 attention을 구별해야 한다. encoder self-attention, decoder의 masked self-attention, decoder가 encoder 출력을 참조하는 cross-attention이다. cross-attention에서는 query의 출처와 key·value의 출처가 다르다.</p>"
      },
      {
        "id": "parallel",
        "title": "4. 병렬 학습과 순차 생성은 양립한다",
        "html": "<p>학습 때는 정답 문장의 이전 토큰을 알고 있다. 입력을 한 칸 이동시키고 미래 위치를 마스킹하면 모든 위치의 예측을 한 번의 행렬 연산으로 계산할 수 있다. 생성 때는 아직 다음 토큰을 모르므로, 기본적인 자기회귀 추론은 계속 한 토큰씩 진행한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>단어 두 개가 멀리 떨어져 있어도 한 attention 층에서 직접 연결되는 것은 장점이다. 반면 <var>n</var>개 토큰에 대한 점수 행렬은 <var>n×n</var>이다. 예를 들어 길이를 1,024에서 4,096으로 늘리면 head 하나의 점수 원소는 약 100만 개에서 약 1,678만 개로 16배 늘어난다. 길이에 대한 이차 비용은 이후 긴 문맥 모델을 읽을 때 다시 등장하는 문제다.</p>"
      },
      {
        "id": "results",
        "title": "5. 번역 결과와 읽고 남은 생각",
        "html": "<p>원 논문은 WMT 2014 영어→독일어에서 28.4 BLEU, 영어→프랑스어에서 41.8 BLEU를 보고했다(§6). 이 수치는 해당 번역 데이터와 평가 설정에서의 결과다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p><strong>내가 주목한 부분은 정보를 전달하는 경로와 계산 일정을 함께 바꿨다는 점이다.</strong> attention 자체의 존재보다, 반복 상태에 묶여 있던 위치별 계산을 행렬 연산으로 옮긴 설계가 중요하게 읽힌다. 다음 논문인 CALM은 여기서 한 걸음 더 나아가, 자기회귀 모델이 한 번에 예측하는 단위 자체를 바꾼다.</p><p><a href=\"#blog/calm-continuous-autoregressive-language-models\" data-section=\"blog\" data-post=\"calm-continuous-autoregressive-language-models\">CALM 리뷰 →</a></p>"
      }
    ]
  },
  {
    "id": "tinyvit",
    "slug": "tinyvit",
    "kind": "review",
    "title": "TinyViT — 작은 모델이 큰 모델의 사전학습을 활용하는 방법",
    "category": "Paper review",
    "subcategory": "Vision Transformer",
    "tags": [
      "Vision Transformer",
      "Knowledge distillation",
      "Efficient AI"
    ],
    "summary": "모델을 줄이는 일과 사전학습 비용을 줄이는 일을 함께 다룬다. sparse soft label, 데이터 증강 재현, 해상도에 따른 정확도·연산량 변화를 정리한다.",
    "published": "2026-10-30",
    "updated": "2026-10-30",
    "paper": {
      "title": "TinyViT: Fast Pretraining Distillation for Small Vision Transformers",
      "authors": "Kan Wu, Jinnian Zhang, Houwen Peng, Mengchen Liu, Bin Xiao, Jianlong Fu, Lu Yuan",
      "year": 2022,
      "venue": "ECCV 2022"
    },
    "sources": [
      {
        "title": "원문 · TinyViT",
        "url": "https://www.ecva.net/papers/eccv_2022/papers_ECCV/papers/136810068.pdf",
        "detail": "§3.1 fast distillation 및 식 (2), §3.2 모델 구조."
      },
      {
        "title": "공식 구현 · Microsoft Cream / TinyViT",
        "url": "https://github.com/microsoft/Cream/tree/main/TinyViT",
        "detail": "README의 Model Zoo: 사전학습 데이터, 입력 해상도, Acc@1 및 MACs."
      },
      {
        "title": "공식 교사 출력 저장 안내",
        "url": "https://github.com/microsoft/Cream/blob/main/TinyViT/docs/SAVE_TEACHER_LOGITS.md",
        "detail": "epoch별 sparse label 저장, 분산 생성 및 캐시 검증 절차."
      }
    ],
    "demo": "review-distillation",
    "demoTitle": "상위 확률만 저장했을 때의 복원",
    "sections": [
      {
        "id": "question",
        "title": "1. 작은 모델에 데이터를 더 주는 것만으로 충분할까?",
        "html": "<p>TinyViT는 큰 비전 모델의 지식을 작은 모델로 전달하는 <strong>사전학습 증류</strong>와 경량 아키텍처를 함께 제안한다. 교사를 매 학습 단계마다 실행하는 대신, 교사의 예측과 증강 정보를 미리 저장해 학생 학습 때 재사용한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>여기서 줄이려는 비용은 두 가지다. 배포할 모델의 크기와, 그 작은 모델을 학습시키기 위해 큰 교사를 계속 실행하는 비용이다. 학생이 작아도 교사가 GPU 메모리를 차지하면 배치 크기를 충분히 키우기 어렵다.</p>"
      },
      {
        "id": "cache",
        "title": "2. 예측만 저장하면 증강된 이미지와 어긋난다",
        "html": "<div class=\"review-flow\" aria-label=\"TinyViT 사전학습 증류\"><span>이미지 + 증강 설정</span><span>교사 추론</span><span>희소 soft label 저장</span><span>같은 증강 재현</span><span>학생 학습</span></div><p>교사가 본 crop과 학생이 본 crop이 다르면 동일한 원본 이미지라도 학습 목표가 어긋날 수 있다. 따라서 캐시는 이미지별 예측뿐 아니라 해당 증강을 재현할 정보도 포함한다. 논문의 식 (1)은 교사 soft label과 학생 출력 사이의 cross-entropy를 최소화한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>예를 들어 원본 왼쪽에 고양이, 오른쪽에 자동차가 있다고 하자. 교사 캐시는 고양이 crop의 확률인데 학생은 자동차 crop을 보게 한다면, 캐시를 읽는 속도와 무관하게 잘못 대응된 감독 신호를 준다. 이 예는 증강 재현을 단순한 난수 관리로만 볼 수 없는 이유다.</p>"
      },
      {
        "id": "sparse",
        "title": "3. 큰 확률은 보존하고 나머지는 나눈다",
        "html": "<p>전체 <var>C</var>개 클래스 확률을 모두 저장하는 대신 상위 <var>k</var>개의 값과 인덱스를 남긴다. 저장하지 않은 클래스에는 남은 확률 질량을 균등하게 배분한다. 아래는 논문 식 (2)의 복원 규칙이다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"article-formula\">p̃<sub>c</sub> = p<sub>c</sub> &nbsp; (상위 k개)<br>p̃<sub>c</sub> = (1 − Σ<sub>i∈top-k</sub> p<sub>i</sub>) / (C − k) &nbsp; (나머지)</div><p>정답 클래스 하나만 남기는 hard label과 다르다. 큰 확률들 사이의 상대적인 관계를 보존하되 작은 확률의 세부 차이를 근사한다. 상위 확률만 다시 정규화하고 나머지를 0으로 만드는 방식도 위 식과 다르다.</p><p>공식 저장 안내는 epoch 구간을 나누어 교사 출력을 병렬 생성하고, 저장된 label이 다시 계산한 출력과 맞는지 검사하는 절차를 제공한다. 여러 학생을 실험한다면 교사 캐시를 한 번 만든 뒤 재사용할 수 있다.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"참고문헌 3\">[3]</a></sup></p>"
      },
      {
        "id": "architecture",
        "title": "4. 구조도 계산 예산에 맞춰 줄인다",
        "html": "<p>모델은 해상도를 점차 줄이는 4개 stage로 구성된다. 앞부분과 downsampling에는 MBConv를 쓰고, 뒤의 세 stage에는 Transformer 블록을 둔다. 큰 모델에서 시작해 파라미터 수와 처리량 제약을 만족하는 후보로 점진적으로 축소한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>구현을 검토할 때는 파라미터 수만 보지 않고 feature map의 공간 크기와 채널 폭을 함께 봐야 한다. 같은 층 수라도 앞쪽의 높은 해상도에서 어떤 연산을 하는지에 따라 실제 비용이 달라진다.</p>"
      },
      {
        "id": "results",
        "title": "5. 해상도를 높이는 선택에는 비용이 따른다",
        "html": "<p>아래는 공식 Model Zoo에서 고른 설정이다. 모두 ImageNet-22k(21,841개 클래스) 사전학습 뒤 ImageNet-1k로 미세조정한 모델이다. 정확도는 ImageNet-1k top-1, MACs는 입력 1장 기준의 multiply–accumulate 수다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>모델</th><th>입력</th><th>Acc@1</th><th>MACs</th></tr></thead><tbody><tr><td>TinyViT-5M</td><td>224²</td><td>80.7%</td><td>1.3G</td></tr><tr><td>TinyViT-21M</td><td>224²</td><td>84.8%</td><td>4.3G</td></tr><tr><td>TinyViT-21M-512</td><td>512²</td><td>86.5%</td><td>27.0G</td></tr></tbody></table></div><p>21M 모델의 해상도를 224에서 512로 높이면 정확도는 1.7%p 높아지지만 MACs는 약 6.3배다. 이는 위 숫자로 계산한 비교이며, 실제 지연시간의 배수와 같지는 않다. 처리 장치와 배치 크기까지 맞춰야 속도 차이를 판단할 수 있다.</p>"
      },
      {
        "id": "takeaway",
        "title": "6. 배포 모델보다 넓은 범위를 최적화한다",
        "html": "<p><strong>TinyViT에서 가져갈 만한 아이디어는 학습 파이프라인의 재사용성이다.</strong> 큰 모델의 지식을 매번 새로 계산하지 않고, 학생이 사용할 감독 신호로 저장한다. 여러 경량 모델을 반복 비교하는 상황에서는 모델 구조 개선과 별도로 의미 있는 설계다.</p><p>내 작업에 적용한다면 먼저 같은 입력·증강에 대한 교사 출력 재현을 확인하고, 그 뒤 저장 공간, 캐시 읽기 대역폭, 학생 학습 시간을 측정하겠다. 이때의 비교 대상은 단일 학습 단계의 속도뿐 아니라 여러 학생을 끝까지 학습시키는 총비용이다.</p>"
      }
    ]
  },
  {
    "id": "calm-continuous-autoregressive-language-models",
    "slug": "calm-continuous-autoregressive-language-models",
    "kind": "review",
    "title": "CALM — 한 토큰 대신 한 묶음의 벡터를 예측한다",
    "category": "Paper review",
    "subcategory": "Language modeling",
    "tags": [
      "Language modeling",
      "Latent representation",
      "Efficient AI"
    ],
    "summary": "토큰 묶음의 autoencoder, energy score로 학습하는 생성 head, 이산 토큰을 거쳐 돌아오는 입력 경로를 연결한다. 복원 정확도와 생성 품질은 따로 읽는다.",
    "published": "2026-10-30",
    "updated": "2026-10-30",
    "paper": {
      "title": "Continuous Autoregressive Language Models",
      "authors": "Chenze Shao, Darren Li, Fandong Meng, Jie Zhou",
      "year": 2025,
      "venue": "arXiv:2510.27688 · preprint"
    },
    "sources": [
      {
        "title": "원문 · Continuous Autoregressive Language Models",
        "url": "https://arxiv.org/abs/2510.27688",
        "detail": "v1, 2025-10-31. §2 autoencoder, §3 생성, §4 BrierLM, §7 실험 및 ablation."
      },
      {
        "title": "저자 해설 · Chenze Shao",
        "url": "https://shaochenze.github.io/blog/2025/CALM/",
        "detail": "Autoencoder, energy score, 이산 입력 복원 경로와 계산량 비교."
      },
      {
        "title": "공식 구현 · shaochenze/calm",
        "url": "https://github.com/shaochenze/calm",
        "detail": "README의 autoencoder·Energy Transformer·평가·샘플링 구성 및 대체 head 학습 스크립트."
      }
    ],
    "demo": "review-calm",
    "demoTitle": "토큰 묶음과 생성 단계 수",
    "sections": [
      {
        "id": "question",
        "title": "1. 더 큰 모델보다, 한 번에 더 많은 정보를 예측하면?",
        "html": "<p>여기서 CALM은 <em>Continuous Autoregressive Language Models</em>를 뜻한다. 한 번에 한 토큰을 고르는 대신 <var>K</var>개 토큰에 대응하는 연속 벡터를 생성한다. autoencoder가 이산 토큰 묶음과 벡터 사이를 연결한다. 논문 Figure 1의 K=3은 설명용 예이고, 주요 실험에는 K=4 설정이 쓰인다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>이 관점은 Transformer의 큰 행렬을 더 빨리 계산하는 것과 다르다. 생성할 단위의 수를 줄이려는 접근이다. 다만 한 단계에 추가되는 복원·압축 계산도 있으므로, 단계가 K배 줄어든다는 사실을 전체 지연시간 K배 개선으로 읽어서는 안 된다.</p>"
      },
      {
        "id": "autoencoder",
        "title": "2. 복원 가능한 표현과 생성하기 좋은 표현",
        "html": "<div class=\"article-formula\">z<sub>i</sub> = Enc(x<sub>(i−1)K+1:iK</sub>)<br>x̂<sub>(i−1)K+1:iK</sub> = Dec(z<sub>i</sub>)</div><p>autoencoder의 역할은 토큰 묶음의 정보를 보존하는 것이다. 저자 해설의 최종 설정은 K=4를 128차원 잠재 벡터로 옮기며, 토큰 단위 복원 정확도가 99.9%를 넘는다. 변분 정규화와 dropout으로 잠재 표현을 부드럽게 만들어, 작은 교란에도 복원 결과가 쉽게 무너지지 않도록 한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>복원이 거의 정확해도 다음 벡터를 예측하기 쉬운 공간이라고 단정할 수는 없다. 예를 들어 토큰 묶음마다 아주 멀리 떨어진 임의의 점을 부여하면, 점에서 토큰을 되찾는 것은 가능해도 문맥에 맞는 다음 점을 생성하는 문제는 어려워진다. 이 예에서 복원 성능과 생성 공간의 구조는 별개의 설계 목표다.</p>"
      },
      {
        "id": "head",
        "title": "3. 평균 벡터 대신 조건부 샘플을 만든다",
        "html": "<p>다음 표현을 MSE로 회귀하면 여러 가능한 문장의 평균에 가까운 벡터가 나올 수 있다. CALM의 생성 head는 문맥 표현 <var>h</var>와 잡음 <var>ε</var>를 받아 <var>z = G(h, ε)</var>를 샘플링한다. Energy score는 정답과의 거리뿐 아니라 생성 샘플끼리의 거리도 사용한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><div class=\"article-formula\">최소화할 energy loss의 기본형<br>2 E‖Z − z*‖ − E‖Z − Z′‖</div><p>Z와 Z′는 같은 문맥에서 독립적으로 뽑은 샘플이다. 첫 항은 관측된 목표에 가까워지도록 하고, 두 번째 항은 샘플이 한 점으로 뭉치는 것을 막는 방향으로 작용한다. 이 두 항을 함께 보는 것이 단일 평균 예측과의 차이다.</p><p>공식 구현에는 energy 기반 head 외에 diffusion과 flow matching용 학습 스크립트도 있다. 기본 energy head는 한 번의 생성 호출을 사용하며, 반복 샘플링을 사용하는 대안과 효율을 비교한다.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"참고문헌 3\">[3]</a></sup></p>"
      },
      {
        "id": "loop",
        "title": "4. 출력 벡터를 그대로 다음 입력으로 쓰지는 않는다",
        "html": "<div class=\"review-flow\" aria-label=\"CALM의 자기회귀 생성 경로\"><span>이전 토큰 묶음</span><span>입력 압축 + Transformer</span><span>잡음 + 생성 head</span><span>다음 벡터 z</span><span>Decoder → K개 토큰</span></div><p>저자 해설은 예측한 벡터를 바로 다시 넣는 대신, 토큰으로 복원한 뒤 embedding과 입력 압축을 거쳐 다음 단계에 공급하는 경로를 설명한다. 출력 공간은 연속적이지만 입력을 구성할 때는 다시 이산 토큰을 사용한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>따라서 기존 LLM의 embedding만 묶어 넣는 방식과도 다르다. 입력 단위, 출력 head, autoencoder, 학습 목적이 함께 바뀐다. 이미 학습한 일반 LLM 앞에 autoencoder 하나를 붙인다고 같은 모델이 되는 것은 아니다.</p>"
      },
      {
        "id": "evaluation",
        "title": "5. 무엇을 기준으로 성능을 비교했나?",
        "html": "<p>논문은 샘플 기반 지표인 BrierLM(높을수록 좋음)을 제안하고, 계산량 대비 언어 모델 성능을 비교한다. 또한 autoencoder ablation에서 복원 정확도가 비슷하게 높아도 잠재 차원과 정규화에 따라 downstream 점수가 달라지는 결과를 보인다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>비교를 읽을 때는 모델 파라미터 수, 학습 FLOPs, 추론 FLOPs, 실제 처리량을 구별할 필요가 있다. 단계 수 계산은 아키텍처를 이해하는 출발점이고, 최종 생성 품질은 벡터 분포를 얼마나 잘 학습했는지에 달려 있다. 아래 계산기는 단계 수와 지정한 단계당 비용의 관계만 보여준다.</p>"
      },
      {
        "id": "connection",
        "title": "6. Nested Learning과 연결해서 생각해 보면",
        "html": "<p><strong>CALM은 예측할 표현의 단위를, Nested Learning은 상태가 학습되는 시간 척도를 바꾼다.</strong> 서로 다른 설계 축이므로, 묶음 단위 표현을 갱신하는 메모리를 두는 방향을 생각할 수 있다. 이는 이 글의 결합 아이디어이며 두 논문의 실험 결과가 아니다.</p><p>내가 먼저 해보고 싶은 실험은 autoencoder를 고정한 상태에서, 빠르게 적응하는 메모리가 묶음 간 문맥 예측에 어떤 영향을 주는지 보는 것이다. 복원 정확도, 문맥 예측 품질, 토큰으로 되돌린 후의 생성 품질을 나눠 측정하면 변화가 어느 단계에서 생겼는지 구분할 수 있다.</p><p><a href=\"#blog/nested-learning\" data-section=\"blog\" data-post=\"nested-learning\">Nested Learning 리뷰 →</a></p>"
      }
    ]
  },
  {
    "id": "nested-learning",
    "slug": "nested-learning",
    "kind": "review",
    "title": "Nested Learning — 층의 깊이에서 학습의 시간 척도로",
    "category": "Paper review",
    "subcategory": "Continual learning",
    "tags": [
      "Continual learning",
      "Memory",
      "Optimization"
    ],
    "summary": "모델과 optimizer를 서로 다른 속도로 갱신되는 학습 문제로 본다. momentum의 기억, Continuum Memory System, self-modifying Titans와 HOPE를 연결해 읽는다.",
    "published": "2026-10-30",
    "updated": "2026-10-30",
    "paper": {
      "title": "Nested Learning: The Illusion of Deep Learning Architectures",
      "authors": "Ali Behrouz, Meisam Razaviyayn, Peilin Zhong, Vahab Mirrokni",
      "year": 2025,
      "venue": "NeurIPS 2025"
    },
    "sources": [
      {
        "title": "원문 · NeurIPS 2025",
        "url": "https://proceedings.neurips.cc/paper_files/paper/2025/file/4309616aaed8e848009bc4a7ef73b493-Paper-Conference.pdf",
        "detail": "§2 학습 수준, §3 CMS와 HOPE, Table 1의 언어 모델 비교."
      },
      {
        "title": "저자 해설 · Google Research",
        "url": "https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/",
        "detail": "2025-11-07. Deep optimizers, CMS, Hope의 역할과 평가 과제."
      },
      {
        "title": "확장 원고 · arXiv:2512.24695",
        "url": "https://arxiv.org/abs/2512.24695",
        "detail": "NeurIPS 원고가 안내하는 확장 버전. 이 리뷰의 수치는 학회판 Table 1 기준."
      }
    ],
    "demo": "review-memory",
    "demoTitle": "서로 다른 갱신 주기",
    "sections": [
      {
        "id": "question",
        "title": "1. 모델과 학습 규칙을 따로 보지 않는 관점",
        "html": "<p>Nested Learning(NL)은 모델을 여러 학습 문제의 결합으로 표현한다. 각 문제는 자체 입력 흐름(context flow), 상태, 목적과 갱신 속도를 가진다. 여기서 학습의 수준(level)은 신경망의 층 번호와 다르다. 무엇을 얼마나 자주 갱신하는지에 따라 수준을 나눈다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>예를 들어 일반적인 추론에서 attention이 참조하는 문맥은 계속 바뀌지만, 사전학습된 가중치는 그대로다. 두 부분은 같은 모델 안에 있어도 정보를 보유하는 방식과 바뀌는 속도가 다르다. 이 차이를 구조 설계의 출발점으로 삼는다.</p>"
      },
      {
        "id": "optimizer",
        "title": "2. optimizer에도 이전 입력의 기억이 있다",
        "html": "<div class=\"article-formula\">m<sub>t</sub> = βm<sub>t−1</sub> + (1−β)g<sub>t</sub><br>θ<sub>t+1</sub> = θ<sub>t</sub> − ηm<sub>t</sub></div><p>위 식은 정규화한 momentum의 간단한 예다. m은 이전 gradient 정보를 담는 상태이며, β가 크면 과거의 영향이 오래 남는다. 이처럼 optimizer도 입력을 누적해 이후 업데이트에 영향을 주는 기억 장치로 읽을 수 있다.</p><p>저자들은 이 관점에서 optimizer를 associative memory로 다루고, 더 표현력 있는 목적과 내부 학습 규칙을 갖는 deep optimizer를 논의한다. 단순히 기존 optimizer의 이름을 메모리로 바꾼 것보다, 그 내부 상태를 학습 문제로 명시한다는 점이 중요하다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p>"
      },
      {
        "id": "cms",
        "title": "3. 빠른 기억과 느린 기억 사이를 채운다",
        "html": "<p>Continuum Memory System(CMS)은 서로 다른 주기로 갱신되는 MLP 메모리들을 연결한다. 논문 식 (30)–(31)에서 각 블록은 자체 chunk 크기에 맞는 시점에 업데이트된다. HOPE는 self-modifying Titans 계열의 시퀀스 모듈과 CMS를 결합한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"HOPE의 두 구성 요소\"><span>문맥 입력</span><span>Self-modifying memory<br>시퀀스 상호작용</span><span>CMS<br>여러 갱신 주기의 MLP</span><span>출력</span></div><p>아래 그림에서는 1·4·16이라는 예시 주기를 사용한다. 매 입력마다 바뀌는 상태와 여러 입력을 묶은 뒤 바뀌는 상태를 구분하는 모형이며, HOPE의 학습이나 기억 성능을 재현한 실험은 아니다.</p>"
      },
      {
        "id": "self-modification",
        "title": "4. self-modifying은 무엇을 바꾸는가?",
        "html": "<p>Google Research의 해설은 Hope를 Titans의 변형으로 소개하며, 문맥에 따라 메모리와 그 업데이트를 구성하는 요소가 적응하는 과정을 설명한다. CMS는 작업 문맥과 오래 유지되는 지식 사이에 여러 갱신 속도의 저장 계층을 둔다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>이때 구현에서 구분하고 싶은 것은 <strong>현재 시퀀스 안에서 적응하는 상태</strong>와 <strong>여러 학습 시퀀스에 걸쳐 학습되는 초기 상태 및 규칙</strong>이다. 어느 파라미터에 어느 손실의 gradient가 흐르는지 적어 보면, 같은 “업데이트”라는 단어로 묶이던 두 과정이 분리된다.</p>"
      },
      {
        "id": "results",
        "title": "5. HOPE의 언어 모델 실험",
        "html": "<p>학회판 Table 1의 1.3B 파라미터·100B 학습 토큰 조건에서 일부 결과를 추렸다. Wiki는 WikiText perplexity이며 낮을수록 좋다. Avg.는 표에 정리된 상식 추론 과제들의 평균이다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>모델</th><th>Wiki ppl ↓</th><th>추론 평균 ↑</th></tr></thead><tbody><tr><td>Transformer++</td><td>18.53</td><td>52.25</td></tr><tr><td>Titans (LMM)</td><td>15.60</td><td>56.82</td></tr><tr><td>HOPE</td><td>15.11</td><td>57.23</td></tr></tbody></table></div><p>이 비교에서는 HOPE가 두 지표 모두 개선됐다. 다만 표의 개별 과제마다 순위는 같지 않다. 저자 해설은 언어 모델링 외에도 긴 문맥 검색, 지속 학습, 지식 편입을 평가한 맥락을 소개한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p>"
      },
      {
        "id": "takeaway",
        "title": "6. 표현과 갱신 규칙을 같이 설계한다",
        "html": "<p><strong>이 논문에서 가장 유용하게 읽은 부분은 “어떤 정보가 어디에 얼마나 오래 남는가”를 모델 구조의 질문으로 바꾼 점이다.</strong> 빠른 모듈이 최근 문맥을 처리하고 느린 모듈이 더 긴 범위의 변화를 반영하도록 설계하면, 모델 크기와 층 수 외에 조절할 수 있는 축이 생긴다.</p><p>CALM과 연결한다면 토큰 묶음의 잠재 표현을 무엇에 저장하고, 그 저장소를 어떤 문맥과 주기로 갱신할지부터 정하고 싶다. 예측 단위를 바꾸는 실험과 갱신 주기를 바꾸는 실험을 각각 수행한 뒤 결합해야 두 선택의 효과를 분리할 수 있다. 이 부분은 후속 실험 아이디어다.</p><p><a href=\"#blog/calm-continuous-autoregressive-language-models\" data-section=\"blog\" data-post=\"calm-continuous-autoregressive-language-models\">CALM 리뷰 →</a></p>"
      }
    ]
  }
];
