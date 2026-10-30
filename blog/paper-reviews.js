export const PAPER_REVIEWS = [
  {
    "id": "attention-is-all-you-need",
    "slug": "attention-is-all-you-need",
    "kind": "review",
    "title": "Attention Is All You Need",
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
        "id": "abstract",
        "title": "Abstract",
        "html": "<p>반복이나 합성곱 없이 attention을 중심으로 sequence transduction을 구성한다. 번역 과제에서의 성능과 병렬 학습의 이점을 보고하고, parsing으로 적용 범위를 확인한다.</p>"
      },
      {
        "id": "introduction",
        "title": "1. Introduction",
        "html": "<p>RNN은 앞선 은닉 상태를 계산해야 다음 위치로 진행할 수 있다. 문장이 길어지면 위치 사이의 정보 전달 경로도 길어진다. Transformer는 위치 간 상호작용을 attention으로 계산해 이 순차 의존성을 줄인 번역 모델이다. 원래 모델은 <strong>encoder–decoder</strong>이며, 오늘날의 decoder-only LLM과 구분해서 읽는 편이 좋다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>이 글에서는 한 위치의 출력이 어떻게 다른 위치의 정보를 모으는지부터 계산한다. 수식을 실제로 계산해 보면 attention의 가중치와 최종 표현이 서로 다른 대상이라는 점도 드러난다.</p>"
      },
      {
        "id": "background",
        "title": "2. Background",
        "html": "<p>RNN은 위치 순서에 따라 상태를 전달하고, CNN은 여러 층을 거쳐 먼 위치를 연결한다. 이 절은 두 방식의 계산 경로를 비교하며, 반복이나 합성곱 없이 위치들을 연결하는 self-attention으로 이어진다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\">[2]</a></sup></p>"
      },
      {
        "id": "model",
        "title": "3. Model Architecture",
        "html": "<h3>3.1 Encoder and Decoder Stacks</h3><p>각 head는 서로 다른 투영을 사용하고, 결과를 이어 붙여 다시 투영한다. 위치별 FFN, residual connection, layer normalization도 함께 사용한다. 원 논문은 sublayer 뒤에 정규화를 두는 <strong>Post-LN</strong> 구조이며, 위치 정보는 입력 embedding에 더한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"Transformer encoder의 한 블록\"><span>입력 + 위치</span><span>Multi-head attention</span><span>Add &amp; Norm</span><span>FFN</span><span>Add &amp; Norm</span></div><p>원문을 코드로 옮길 때는 세 개의 attention을 구별해야 한다. encoder self-attention, decoder의 masked self-attention, decoder가 encoder 출력을 참조하는 cross-attention이다. cross-attention에서는 query의 출처와 key·value의 출처가 다르다.</p><h3>3.2 Attention</h3><div class=\"article-formula\">Q = XW<sub>Q</sub>, K = XW<sub>K</sub>, V = XW<sub>V</sub><br>A = softmax(QKᵀ / √d<sub>k</sub>)<br>Y = AV</div><p>입력 <var>X ∈ ℝ<sup>n×d</sup></var>에서 Q, K, V를 각각 선형 투영한다. <var>A</var>의 한 행은 한 query가 각 key에 부여하는 가중치다. softmax는 key 방향으로 적용하므로 행의 합은 1이며, 그 가중치로 value를 합쳐 출력 벡터를 만든다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>작은 계산 예를 들면, 가중치가 <code>[0.75, 0.25]</code>이고 value가 각각 <code>[2, 0]</code>, <code>[0, 4]</code>일 때 출력은 <code>[1.5, 1]</code>이다. 이 출력은 두 value의 혼합이지, 가장 큰 가중치를 받은 토큰 하나를 선택한 결과가 아니다.</p><p>독립이고 분산이 1인 성분들의 내적은 차원이 커질수록 분산도 커진다. √d<sub>k</sub>로 나누는 것은 큰 내적이 softmax를 지나치게 뾰족하게 만드는 현상을 완화하기 위한 스케일 조정이다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><h3>3.3 Position-wise Feed-Forward Networks</h3><p>FFN은 각 위치에 같은 두 선형 변환과 ReLU를 적용한다. attention이 위치 사이의 정보를 섞는다면 FFN은 각 위치의 특징을 변환한다.</p><h3>3.4 Embeddings and Softmax</h3><p>입출력 토큰을 벡터로 바꾸고, decoder 출력을 어휘 확률로 변환한다. 원문은 embedding과 출력 투영의 가중치를 공유한다.</p><h3>3.5 Positional Encoding</h3><p>순서를 구별하도록 사인·코사인 기반 위치 표현을 embedding에 더한다. attention의 가중합만으로는 위치 순서가 자동으로 주어지지 않는다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "why",
        "title": "4. Why Self-Attention",
        "html": "<p>학습 때는 정답 문장의 이전 토큰을 알고 있다. 입력을 한 칸 이동시키고 미래 위치를 마스킹하면 모든 위치의 예측을 한 번의 행렬 연산으로 계산할 수 있다. 생성 때는 아직 다음 토큰을 모르므로, 기본적인 자기회귀 추론은 계속 한 토큰씩 진행한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>단어 두 개가 멀리 떨어져 있어도 한 attention 층에서 직접 연결되는 것은 장점이다. 반면 <var>n</var>개 토큰에 대한 점수 행렬은 <var>n×n</var>이다. 예를 들어 길이를 1,024에서 4,096으로 늘리면 head 하나의 점수 원소는 약 100만 개에서 약 1,678만 개로 16배 늘어난다. 길이에 대한 이차 비용은 이후 긴 문맥 모델을 읽을 때 다시 등장하는 문제다.</p>"
      },
      {
        "id": "training",
        "title": "5. Training",
        "html": "<p>이 절은 학습 데이터와 배칭, 하드웨어·일정, optimizer, regularization을 설명한다. Adam의 학습률을 warm-up 후 감소시키고, dropout과 label smoothing을 사용한다. 구조뿐 아니라 학습 조건도 번역 성능의 일부다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "results",
        "title": "6. Results",
        "html": "<p>원 논문은 WMT 2014 영어→독일어에서 28.4 BLEU, 영어→프랑스어에서 41.8 BLEU를 보고했다(§6). 이 수치는 해당 번역 데이터와 평가 설정에서의 결과다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>6.1은 번역 성능, 6.2는 모델 구성 변경, 6.3은 constituency parsing을 다룬다. 즉 attention 기반 번역 모델의 결과에 이어 다른 구조 설정과 과제로 적용 범위를 확인한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "conclusion",
        "title": "7. Conclusion",
        "html": "<p>반복·합성곱 없는 sequence transduction을 정리하고, 이미지·오디오·비디오 및 제한된 attention 범위로의 확장을 후속 방향으로 제시한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "summary",
        "title": "요약",
        "html": "<p>Transformer는 위치 간 정보 전달을 attention 행렬로 계산해 학습의 순차 의존성을 줄인다. Q·K로 구한 가중치는 V를 섞으며, FFN·위치 표현·정규화가 함께 모델을 구성한다. 학습의 병렬화가 자기회귀 생성의 순차성까지 없애는 것은 아니다.</p>"
      }
    ],
    "demoAfter": "model"
  },
  {
    "id": "tinyvit",
    "slug": "tinyvit",
    "kind": "review",
    "title": "TinyViT: Fast Pretraining Distillation for Small Vision Transformers",
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
        "id": "abstract",
        "title": "Abstract",
        "html": "<p>경량 비전 Transformer와 빠른 사전학습 증류를 함께 제안한다. 큰 교사의 예측을 희소하게 저장해 학생 학습에서 재사용하고, 작은 모델이 대규모 사전학습 데이터의 이득을 얻도록 한다.</p>"
      },
      {
        "id": "introduction",
        "title": "1. Introduction",
        "html": "<p>TinyViT는 큰 비전 모델의 지식을 작은 모델로 전달하는 <strong>사전학습 증류</strong>와 경량 아키텍처를 함께 제안한다. 교사를 매 학습 단계마다 실행하는 대신, 교사의 예측과 증강 정보를 미리 저장해 학생 학습 때 재사용한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>여기서 줄이려는 비용은 두 가지다. 배포할 모델의 크기와, 그 작은 모델을 학습시키기 위해 큰 교사를 계속 실행하는 비용이다. 학생이 작아도 교사가 GPU 메모리를 차지하면 배치 크기를 충분히 키우기 어렵다.</p>"
      },
      {
        "id": "related",
        "title": "2. Related Work",
        "html": "<p>대규모 사전학습·소형 ViT·지식 증류를 연결한다. 이미 학습된 큰 모델의 지식을 작은 모델에 전달하는 위치를 설명하고, 양자화·가지치기와도 함께 사용할 수 있는 접근으로 구분한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "method",
        "title": "3. TinyViT",
        "html": "<h3>3.1 Fast Pretraining Distillation</h3><div class=\"review-flow\" aria-label=\"TinyViT 사전학습 증류\"><span>이미지 + 증강 설정</span><span>교사 추론</span><span>희소 soft label 저장</span><span>같은 증강 재현</span><span>학생 학습</span></div><p>교사가 본 crop과 학생이 본 crop이 다르면 동일한 원본 이미지라도 학습 목표가 어긋날 수 있다. 따라서 캐시는 이미지별 예측뿐 아니라 해당 증강을 재현할 정보도 포함한다. 논문의 식 (1)은 교사 soft label과 학생 출력 사이의 cross-entropy를 최소화한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>예를 들어 원본 왼쪽에 고양이, 오른쪽에 자동차가 있다고 하자. 교사 캐시는 고양이 crop의 확률인데 학생은 자동차 crop을 보게 한다면, 캐시를 읽는 속도와 무관하게 잘못 대응된 감독 신호를 준다. 이 예는 증강 재현을 단순한 난수 관리로만 볼 수 없는 이유다.</p><p>전체 <var>C</var>개 클래스 확률을 모두 저장하는 대신 상위 <var>k</var>개의 값과 인덱스를 남긴다. 저장하지 않은 클래스에는 남은 확률 질량을 균등하게 배분한다. 아래는 논문 식 (2)의 복원 규칙이다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"article-formula\">p̃<sub>c</sub> = p<sub>c</sub> &nbsp; (상위 k개)<br>p̃<sub>c</sub> = (1 − Σ<sub>i∈top-k</sub> p<sub>i</sub>) / (C − k) &nbsp; (나머지)</div><p>정답 클래스 하나만 남기는 hard label과 다르다. 큰 확률들 사이의 상대적인 관계를 보존하되 작은 확률의 세부 차이를 근사한다. 상위 확률만 다시 정규화하고 나머지를 0으로 만드는 방식도 위 식과 다르다.</p><p>공식 저장 안내는 epoch 구간을 나누어 교사 출력을 병렬 생성하고, 저장된 label이 다시 계산한 출력과 맞는지 검사하는 절차를 제공한다. 여러 학생을 실험한다면 교사 캐시를 한 번 만든 뒤 재사용할 수 있다.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"참고문헌 3\">[3]</a></sup></p><h3>3.2 Model Architectures</h3><p>모델은 해상도를 점차 줄이는 4개 stage로 구성된다. 앞부분과 downsampling에는 MBConv를 쓰고, 뒤의 세 stage에는 Transformer 블록을 둔다. 큰 모델에서 시작해 파라미터 수와 처리량 제약을 만족하는 후보로 점진적으로 축소한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>구현을 검토할 때는 파라미터 수만 보지 않고 feature map의 공간 크기와 채널 폭을 함께 봐야 한다. 같은 층 수라도 앞쪽의 높은 해상도에서 어떤 연산을 하는지에 따라 실제 비용이 달라진다.</p>"
      },
      {
        "id": "analysis",
        "title": "4. Analysis and Discussions",
        "html": "<p>작은 모델이 대규모 데이터의 이득을 충분히 얻지 못하는 이유를 hard sample과 class relationship 관점에서 분석한다. 원본 데이터 사전학습, 어려운 표본을 제거한 데이터, 교사의 soft label을 이용한 사전학습을 비교해 데이터 양과 감독 신호의 질을 구분한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "experiments",
        "title": "5. Experiments",
        "html": "<p>5.1은 구현 조건, 5.2는 ablation, 5.3은 ImageNet, 5.4는 transfer learning 결과다. 캐시와 구조 설계의 효과를 분리한 뒤 이미지 분류와 전이 과제를 평가한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>아래는 공식 Model Zoo에서 고른 설정이다. 모두 ImageNet-22k(21,841개 클래스) 사전학습 뒤 ImageNet-1k로 미세조정한 모델이다. 정확도는 ImageNet-1k top-1, MACs는 입력 1장 기준의 multiply–accumulate 수다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>모델</th><th>입력</th><th>Acc@1</th><th>MACs</th></tr></thead><tbody><tr><td>TinyViT-5M</td><td>224²</td><td>80.7%</td><td>1.3G</td></tr><tr><td>TinyViT-21M</td><td>224²</td><td>84.8%</td><td>4.3G</td></tr><tr><td>TinyViT-21M-512</td><td>512²</td><td>86.5%</td><td>27.0G</td></tr></tbody></table></div><p>21M 모델의 해상도를 224에서 512로 높이면 정확도는 1.7%p 높아지지만 MACs는 약 6.3배다. 이는 위 숫자로 계산한 비교이며, 실제 지연시간의 배수와 같지는 않다. 처리 장치와 배치 크기까지 맞춰야 속도 차이를 판단할 수 있다.</p>"
      },
      {
        "id": "conclusions",
        "title": "6. Conclusions",
        "html": "<p>작은 비전 모델도 큰 모델의 지식과 대규모 사전학습을 활용할 수 있음을 정리한다. 빠른 증류 파이프라인과 제약에 맞춘 모델 축소가 함께 제안의 결과를 만든다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "summary",
        "title": "요약",
        "html": "<p>TinyViT는 배포할 모델뿐 아니라 학생 학습의 비용을 줄인다. 교사 확률과 증강 정보를 저장해 재사용하고, 상위 확률과 나머지 질량으로 감독 신호를 복원한다. 모델 크기·입력 해상도·학습 파이프라인을 함께 비교해야 한다.</p>"
      }
    ],
    "demoAfter": "method"
  },
  {
    "id": "calm-continuous-autoregressive-language-models",
    "slug": "calm-continuous-autoregressive-language-models",
    "kind": "review",
    "title": "Continuous Autoregressive Language Models",
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
        "html": "<div class=\"article-formula\">z<sub>i</sub> = Enc(x<sub>(i−1)K+1:iK</sub>)<br>x̂<sub>(i−1)K+1:iK</sub> = Dec(z<sub>i</sub>)</div><p>autoencoder의 역할은 토큰 묶음의 정보를 보존하는 것이다. 저자 해설의 최종 설정은 K=4를 128차원 잠재 벡터로 옮기며, 토큰 단위 복원 정확도가 99.9%를 넘는다. 변분 정규화와 dropout으로 잠재 표현을 부드럽게 만들어, 작은 교란에도 복원 결과가 쉽게 무너지지 않도록 한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>복원이 거의 정확해도 다음 벡터를 예측하기 쉬운 공간이라고 단정할 수는 없다. 예를 들어 토큰 묶음마다 아주 멀리 떨어진 임의의 점을 부여하면, 점에서 토큰을 되찾는 것은 가능해도 문맥에 맞는 다음 점을 생성하는 문제는 어려워진다. 이 예에서 복원 성능과 생성 공간의 구조는 별개의 설계 목표다.</p><p>2.1은 복원 정확도, 2.2는 잡음에 강한 표현을 다룬다. 원 토큰을 되찾는 능력과 잠재 공간에서 안정적으로 생성할 수 있는 성질을 함께 확보하려는 설계다.</p>"
      },
      {
        "id": "model",
        "title": "3. Likelihood-Free Language Modeling",
        "html": "<p>다음 표현을 MSE로 회귀하면 여러 가능한 문장의 평균에 가까운 벡터가 나올 수 있다. CALM의 생성 head는 문맥 표현 <var>h</var>와 잡음 <var>ε</var>를 받아 <var>z = G(h, ε)</var>를 샘플링한다. Energy score는 정답과의 거리뿐 아니라 생성 샘플끼리의 거리도 사용한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><div class=\"article-formula\">최소화할 energy loss의 기본형<br>2 E‖Z − z*‖ − E‖Z − Z′‖</div><p>Z와 Z′는 같은 문맥에서 독립적으로 뽑은 샘플이다. 첫 항은 관측된 목표에 가까워지도록 하고, 두 번째 항은 샘플이 한 점으로 뭉치는 것을 막는 방향으로 작용한다. 이 두 항을 함께 보는 것이 단일 평균 예측과의 차이다.</p><p>공식 구현에는 energy 기반 head 외에 diffusion과 flow matching용 학습 스크립트도 있다. 기본 energy head는 한 번의 생성 호출을 사용하며, 반복 샘플링을 사용하는 대안과 효율을 비교한다.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"참고문헌 3\">[3]</a></sup></p><div class=\"review-flow\" aria-label=\"CALM의 자기회귀 생성 경로\"><span>이전 토큰 묶음</span><span>입력 압축 + Transformer</span><span>잡음 + 생성 head</span><span>다음 벡터 z</span><span>Decoder → K개 토큰</span></div><p>저자 해설은 예측한 벡터를 바로 다시 넣는 대신, 토큰으로 복원한 뒤 embedding과 입력 압축을 거쳐 다음 단계에 공급하는 경로를 설명한다. 출력 공간은 연속적이지만 입력을 구성할 때는 다시 이산 토큰을 사용한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>따라서 기존 LLM의 embedding만 묶어 넣는 방식과도 다르다. 입력 단위, 출력 head, autoencoder, 학습 목적이 함께 바뀐다. 이미 학습한 일반 LLM 앞에 autoencoder 하나를 붙인다고 같은 모델이 되는 것은 아니다.</p>"
      },
      {
        "id": "evaluation",
        "title": "4. Likelihood-Free LM Evaluation",
        "html": "<p>논문은 샘플 기반 지표인 BrierLM(높을수록 좋음)을 제안하고, 계산량 대비 언어 모델 성능을 비교한다. 또한 autoencoder ablation에서 복원 정확도가 비슷하게 높아도 잠재 차원과 정규화에 따라 downstream 점수가 달라지는 결과를 보인다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>비교를 읽을 때는 모델 파라미터 수, 학습 FLOPs, 추론 FLOPs, 실제 처리량을 구별할 필요가 있다. 단계 수 계산은 아키텍처를 이해하는 출발점이고, 최종 생성 품질은 벡터 분포를 얼마나 잘 학습했는지에 달려 있다. 아래 계산기는 단계 수와 지정한 단계당 비용의 관계만 보여준다.</p><p>4.1은 평가 원칙, 4.2는 BrierLM을 다룬다. BrierLM은 n-gram 단위의 Brier 기반 점수를 결합해 샘플만으로 비교할 수 있도록 한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "sampling",
        "title": "5. Likelihood-Free Temperature Sampling",
        "html": "<p>확률을 직접 계산하지 않고도 P(x)<sup>1/T</sup>에 비례하도록 샘플링하는 문제를 다룬다. 5.1의 rejection 방식, 5.2의 예상 비용, 5.3의 배치 근사를 순서대로 설명한다. 배치 근사는 유한 표본에서 정확한 온도 분포와 차이가 있을 수 있으며, 배치 크기가 계산량과 근사 품질을 조절한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "related",
        "title": "6. Related Work",
        "html": "<p>6.1–6.4는 autoencoder, likelihood-free 모델링, 평가, 온도 샘플링을 다룬다. 압축된 표현을 학습하는 일과 그 표현의 다음 분포를 생성하는 일을 구분하고, 이산 토큰 출력과 연속 생성 공간 사이의 관계를 정리한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "experiments",
        "title": "7. Experiments",
        "html": "<p>7.1 학습 설정, 7.2 주요 결과, 7.3 autoencoder, 7.4 모델 구조, 7.5 온도 샘플링의 순서다. 주요 비교 축은 성능 대비 계산량이며, 잠재 차원·정규화·생성 head·입력 경로·샘플링 설정을 나눠 분석한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
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
    "demoAfter": "model"
  },
  {
    "id": "nested-learning",
    "slug": "nested-learning",
    "kind": "review",
    "title": "Nested Learning: The Illusion of Deep Learning Architectures",
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
        "html": "<h3>2.1 Associative Memory</h3><p>입력과 연관된 출력을 저장·회상하는 메모리로 학습을 표현한다.</p><h3>2.2 Nested Optimization Problems</h3><p>서로 다른 context flow와 갱신 속도를 가진 최적화 문제를 수준으로 조직한다. 단순히 층을 더 쌓는 것과 구별되는 설계 축이다.</p><h3>2.3 Optimizers as Learning Modules</h3><div class=\"article-formula\">m<sub>t</sub> = βm<sub>t−1</sub> + (1−β)g<sub>t</sub><br>θ<sub>t+1</sub> = θ<sub>t</sub> − ηm<sub>t</sub></div><p>위 식은 정규화한 momentum의 간단한 예다. m은 이전 gradient 정보를 담는 상태이며, β가 크면 과거의 영향이 오래 남는다. 이처럼 optimizer도 입력을 누적해 이후 업데이트에 영향을 주는 기억 장치로 읽을 수 있다.</p><p>저자들은 이 관점에서 optimizer를 associative memory로 다루고, 더 표현력 있는 목적과 내부 학습 규칙을 갖는 deep optimizer를 논의한다. 단순히 기존 optimizer의 이름을 메모리로 바꾼 것보다, 그 내부 상태를 학습 문제로 명시한다는 점이 중요하다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p>"
      },
      {
        "id": "hope",
        "title": "3. HOPE: A Self-Referential Learning Module with Continuum Memory",
        "html": "<p>Continuum Memory System(CMS)은 서로 다른 주기로 갱신되는 MLP 메모리들을 연결한다. 논문 식 (30)–(31)에서 각 블록은 자체 chunk 크기에 맞는 시점에 업데이트된다. HOPE는 self-modifying Titans 계열의 시퀀스 모듈과 CMS를 결합한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"HOPE의 두 구성 요소\"><span>문맥 입력</span><span>Self-modifying memory<br>시퀀스 상호작용</span><span>CMS<br>여러 갱신 주기의 MLP</span><span>출력</span></div><p>아래 그림에서는 1·4·16이라는 예시 주기를 사용한다. 매 입력마다 바뀌는 상태와 여러 입력을 묶은 뒤 바뀌는 상태를 구분하는 모형이며, HOPE의 학습이나 기억 성능을 재현한 실험은 아니다.</p><p>Google Research의 해설은 Hope를 Titans의 변형으로 소개하며, 문맥에 따라 메모리와 그 업데이트를 구성하는 요소가 적응하는 과정을 설명한다. CMS는 작업 문맥과 오래 유지되는 지식 사이에 여러 갱신 속도의 저장 계층을 둔다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>이때 구현에서 구분하고 싶은 것은 <strong>현재 시퀀스 안에서 적응하는 상태</strong>와 <strong>여러 학습 시퀀스에 걸쳐 학습되는 초기 상태 및 규칙</strong>이다. 어느 파라미터에 어느 손실의 gradient가 흐르는지 적어 보면, 같은 “업데이트”라는 단어로 묶이던 두 과정이 분리된다.</p>"
      },
      {
        "id": "experiments",
        "title": "4. Experiments",
        "html": "<p>학회판 Table 1의 1.3B 파라미터·100B 학습 토큰 조건에서 일부 결과를 추렸다. Wiki는 WikiText perplexity이며 낮을수록 좋다. Avg.는 표에 정리된 상식 추론 과제들의 평균이다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>모델</th><th>Wiki ppl ↓</th><th>추론 평균 ↑</th></tr></thead><tbody><tr><td>Transformer++</td><td>18.53</td><td>52.25</td></tr><tr><td>Titans (LMM)</td><td>15.60</td><td>56.82</td></tr><tr><td>HOPE</td><td>15.11</td><td>57.23</td></tr></tbody></table></div><p>이 비교에서는 HOPE가 두 지표 모두 개선됐다. 다만 표의 개별 과제마다 순위는 같지 않다. 저자 해설은 언어 모델링 외에도 긴 문맥 검색, 지속 학습, 지식 편입을 평가한 맥락을 소개한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p>"
      },
      {
        "id": "summary",
        "title": "요약",
        "html": "<p>Nested Learning은 모델과 학습 규칙을 함께 기술하고, 각 상태가 어떤 입력을 얼마나 오래 압축하는지 묻는다. HOPE는 self-modifying 시퀀스 메모리와 여러 갱신 주기의 CMS를 결합한 구체적인 모델이다. 이 관점은 층 수와 별개로 학습의 시간 척도를 설계할 수 있게 한다.</p>"
      }
    ],
    "demoAfter": "hope"
  },
  {
    "id": "cv-qaoa-continuous-problems",
    "slug": "cv-qaoa-continuous-problems",
    "kind": "review",
    "title": "A Quantum Approximate Optimization Algorithm for continuous problems",
    "category": "Paper review",
    "subcategory": "Quantum optimization",
    "tags": [
      "CV-QAOA",
      "Quantum optimization",
      "Continuous variables"
    ],
    "summary": "CV-QAOA의 원 제안 논문을 본문 절 순서대로 읽는다. 비용·운동 에너지 진화, 제약과 이산 문제의 표현, 복잡도 및 수치 예제를 설명한다.",
    "published": "2026-10-30",
    "updated": "2026-10-30",
    "paper": {
      "title": "A Quantum Approximate Optimization Algorithm for continuous problems",
      "authors": "Guillaume Verdon, Juan Miguel Arrazola, Kamil Brádler, Nathan Killoran",
      "year": 2019,
      "venue": "arXiv:1902.00409"
    },
    "sources": [
      {
        "title": "원문 · arXiv:1902.00409",
        "url": "https://arxiv.org/abs/1902.00409",
        "detail": "2019년 원 제안. 번호 없는 본문 절의 순서를 따르며, 식 (1)–(4)의 표기를 사용한다."
      }
    ],
    "sections": [
      {
        "id": "abstract",
        "title": "Abstract",
        "html": "<p>목적함수를 potential로 표현하고 cost와 mixer 진화를 교대로 적용하는 연속 최적화를 제안한다. 중첩에서의 gradient descent 해석, 문제 표현의 확장, 복잡도 관계와 수치 예제를 제시한다.</p>"
      },
      {
        "id": "introduction",
        "title": "Introduction",
        "html": "<p>목적함수를 위치의 비용 에너지로 표현하고, 서로 교환하지 않는 cost와 mixer 진화를 번갈아 적용하는 연속 최적화 알고리즘을 제안한다.</p><sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup>"
      },
      {
        "id": "algorithm",
        "title": "Quantum algorithm",
        "html": "<p>원문의 표기를 따라 η는 cost 진화, γ는 mixer 진화의 계수로 쓴다. ℏ=1에서 아래 두 변환을 합치면 위치가 gradient와 기존 운동량의 영향을 함께 받는다.</p><div class=\"article-formula\">H<sub>C</sub> = f(x̂), H<sub>M</sub> = p̂²/2<br>U(η,γ) = exp(−iγH<sub>M</sub>) exp(−iηH<sub>C</sub>)<br>p̂ → p̂ − η∇f(x̂)<br>x̂ → x̂ + γp̂ − γη∇f(x̂)</div><sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup><p>비용 진화 직후에는 ψ′(x)=exp(−iηf(x))ψ(x)이므로 |ψ′(x)|²=|ψ(x)|²다. 밀도는 같지만 위상이 달라진다. 이후 mixer가 서로 다른 위치의 진폭을 간섭시키므로, 비용 진화의 효과가 다음 위치 분포에 나타날 수 있다.</p><p>예를 들어 f(x)=x²/2라면 위 식에 ∇f(x)=x를 대입해 x̂ → (1−γη)x̂+γp̂를 얻는다. 이는 식을 이해하기 위한 대수적 예이며 수치 최적화 결과가 아니다.</p>"
      },
      {
        "id": "constraints",
        "title": "Constrained Optimization",
        "html": "<p>제약 위반에 비용을 주는 potential을 목적함수에 더한다. 허용 영역과 위반 영역의 에너지 차이로 탐색을 유도한다.</p><sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup><p>등식 제약의 간단한 예로 λ(g(x)−c)²를 더하면 g(x)=c에서 추가 비용이 0이고, 제약을 벗어날수록 커진다. λ는 제약과 원래 목적 사이의 비중을 조절한다.</p>"
      },
      {
        "id": "discrete",
        "title": "Encoding discrete optimization problems",
        "html": "<p>연속 변수에 이산 선택을 대응시키는 함수와 potential을 사용해 이산 목적함수도 표현한다.</p><sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup>"
      },
      {
        "id": "complexity",
        "title": "Complexity",
        "html": "<p>연속 공간의 Grover search와 CV-IQP 회로를 포함할 수 있는 변형을 논의한다. 이는 회로족의 관계에 대한 결과이며 모든 목적함수의 최적화 속도를 보장하지는 않는다.</p><sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup>"
      },
      {
        "id": "examples",
        "title": "Numerical examples",
        "html": "<p>2차원 Styblinski–Tang 함수를 수치적으로 최적화한다. 초기 상태는 momentum-squeezed 상태이며, 최종 측정 표본을 이용해 낮은 함수값을 찾는다.</p><sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup><p>원문에서 1,000개 표본의 최선 함수값은 −78.33216이며, 비교한 전역 최솟값은 약 −78.3323이다.</p>"
      },
      {
        "id": "conclusion",
        "title": "Conclusion",
        "html": "<p>중첩 상태에서의 gradient descent라는 해석과 제약·이산 문제로의 확장을 정리한다.</p><sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup>"
      },
      {
        "id": "summary",
        "title": "요약",
        "html": "<p>Cost 진화는 위치별 위상을 바꾸고 운동량을 gradient 방향으로 이동시킨다. Kinetic mixer는 운동량을 위치 변화로 연결한다. 따라서 중간 상태의 확률밀도뿐 아니라 위상도 다음 진화에 영향을 준다.</p>"
      }
    ]
  }
];
