export default {
  "summary": "Q·K·V와 causal mask의 계산을 따라가며, Transformer가 학습을 병렬화한 방법과 여전히 순차적인 생성 과정을 구분한다.",
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
      "html": "<p>RNN은 위치 순서에 따라 상태를 전달하고, CNN은 여러 층을 거쳐 먼 위치를 연결한다. 이 절은 두 방식의 계산 경로를 비교하며, 반복이나 합성곱 없이 위치들을 연결하는 self-attention으로 이어진다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\">[2]</a></sup></p><p>여기서 비교할 것은 한 층의 연산량과 순차 계산 길이, 두 위치 사이의 최단 경로다. RNN에서는 먼 토큰의 정보가 여러 상태를 거쳐 전달되지만, self-attention에서는 한 층 안에서 직접 가중합에 참여한다. 이 경로의 차이가 긴 의존 관계를 학습하려는 동기와 연결된다.</p>"
    },
    {
      "id": "model",
      "title": "3. Model Architecture",
      "html": "<h3>3.1 Encoder and Decoder Stacks</h3><p>각 head는 서로 다른 투영을 사용하고, 결과를 이어 붙여 다시 투영한다. 위치별 FFN, residual connection, layer normalization도 함께 사용한다. 원 논문은 sublayer 뒤에 정규화를 두는 <strong>Post-LN</strong> 구조이며, 위치 정보는 입력 embedding에 더한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"Transformer encoder의 한 블록\"><span>입력 + 위치</span><span>Multi-head attention</span><span>Add &amp; Norm</span><span>FFN</span><span>Add &amp; Norm</span></div><p>원문을 코드로 옮길 때는 세 개의 attention을 구별해야 한다. encoder self-attention, decoder의 masked self-attention, decoder가 encoder 출력을 참조하는 cross-attention이다. cross-attention에서는 query의 출처와 key·value의 출처가 다르다.</p><h3>3.2 Attention</h3><div data-math=\"display\">\\begin{aligned}Q&amp;=XW_Q,&amp;K&amp;=XW_K,&amp;V&amp;=XW_V\\\\ A&amp;=\\operatorname{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}+M\\right),&amp;&amp;Y=AV\\end{aligned}</div><p>입력 <var>X ∈ ℝ<sup>n×d</sup></var>에서 Q, K, V를 각각 선형 투영한다. <var>A</var>의 한 행은 한 query가 각 key에 부여하는 가중치다. softmax는 key 방향으로 적용하므로 행의 합은 1이며, 그 가중치로 value를 합쳐 출력 벡터를 만든다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>작은 계산 예를 들면, 가중치가 <code>[0.75, 0.25]</code>이고 value가 각각 <code>[2, 0]</code>, <code>[0, 4]</code>일 때 출력은 <code>[1.5, 1]</code>이다. 이 출력은 두 value의 혼합이지, 가장 큰 가중치를 받은 토큰 하나를 선택한 결과가 아니다.</p><p>독립이고 분산이 1인 성분들의 내적은 차원이 커질수록 분산도 커진다. √d<sub>k</sub>로 나누는 것은 큰 내적이 softmax를 지나치게 뾰족하게 만드는 현상을 완화하기 위한 스케일 조정이다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><h3>3.3 Position-wise Feed-Forward Networks</h3><p>FFN은 각 위치에 같은 두 선형 변환과 ReLU를 적용한다. attention이 위치 사이의 정보를 섞는다면 FFN은 각 위치의 특징을 변환한다.</p><h3>3.4 Embeddings and Softmax</h3><p>입출력 토큰을 벡터로 바꾸고, decoder 출력을 어휘 확률로 변환한다. 원문은 embedding과 출력 투영의 가중치를 공유한다.</p><h3>3.5 Positional Encoding</h3><p>순서를 구별하도록 사인·코사인 기반 위치 표현을 embedding에 더한다. attention의 가중합만으로는 위치 순서가 자동으로 주어지지 않는다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><h3>행렬 크기와 마스크</h3><p>같은 길이의 self-attention에서 Q와 K는 <span data-math=\"inline\">n\\times d_k</span>, V는 <span data-math=\"inline\">n\\times d_v</span>이다. 따라서 점수와 가중치 A는 <span data-math=\"inline\">n\\times n</span>, 출력 Y는 <span data-math=\"inline\">n\\times d_v</span>이다. decoder의 미래 위치에는 다음 마스크를 더한다.</p><div data-math=\"display\">M_{ij}=\\begin{cases}0,&amp;j\\le i\\\\-\\infty,&amp;j&gt;i\\end{cases}</div><p>softmax 이전에 음의 무한대를 더한 위치의 확률은 0이 된다. encoder self-attention에는 이 causal mask를 적용하지 않는다. cross-attention에서는 Q의 행 수가 목표 문장 길이, K·V의 행 수가 원문 길이가 되어 점수 행렬이 직사각형일 수 있다.</p><h3>여러 head, FFN, 위치 표현</h3><div data-math=\"display\">\\begin{aligned}\\operatorname{head}_i&amp;=\\operatorname{Attention}(QW_i^Q,KW_i^K,VW_i^V)\\\\\\operatorname{MultiHead}(Q,K,V)&amp;=\\operatorname{Concat}(\\operatorname{head}_1,\\ldots,\\operatorname{head}_h)W^O\\\\\\operatorname{FFN}(x)&amp;=\\max(0,xW_1+b_1)W_2+b_2\\end{aligned}</div><p>여러 head는 서로 다른 투영 공간에서 관계를 계산한다. 출력 투영은 이어 붙인 표현을 다시 모델 차원으로 섞는다. 원문의 base 설정은 6개 encoder·decoder 층, 모델 차원 512, 8개 head, FFN 내부 차원 2,048이다. FFN의 가중치는 위치마다 공유되지만 서로 다른 층 사이에서 공유되는 것은 아니다.</p><div data-math=\"display\">\\begin{aligned}\\operatorname{PE}(pos,2i)&amp;=\\sin\\!\\left(\\frac{pos}{10000^{2i/d_{\\rm model}}}\\right)\\\\\\operatorname{PE}(pos,2i+1)&amp;=\\cos\\!\\left(\\frac{pos}{10000^{2i/d_{\\rm model}}}\\right)\\end{aligned}</div><p>pos는 위치, i는 사인·코사인 쌍의 인덱스다. 서로 다른 주파수의 값들을 더해 위치를 구별한다. 학습된 위치 embedding도 원문에서 비교했으며 결과는 비슷했다.</p>"
    },
    {
      "id": "why",
      "title": "4. Why Self-Attention",
      "html": "<p>학습 때는 정답 문장의 이전 토큰을 알고 있다. 입력을 한 칸 이동시키고 미래 위치를 마스킹하면 모든 위치의 예측을 한 번의 행렬 연산으로 계산할 수 있다. 생성 때는 아직 다음 토큰을 모르므로, 기본적인 자기회귀 추론은 계속 한 토큰씩 진행한다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><p>단어 두 개가 멀리 떨어져 있어도 한 attention 층에서 직접 연결되는 것은 장점이다. 반면 <var>n</var>개 토큰에 대한 점수 행렬은 <var>n×n</var>이다. 예를 들어 길이를 1,024에서 4,096으로 늘리면 head 하나의 점수 원소는 약 100만 개에서 약 1,678만 개로 16배 늘어난다. 길이에 대한 이차 비용은 이후 긴 문맥 모델을 읽을 때 다시 등장하는 문제다.</p>"
    },
    {
      "id": "training",
      "title": "5. Training",
      "html": "<p>이 절은 학습 데이터와 배칭, 하드웨어·일정, optimizer, regularization을 설명한다. Adam의 학습률을 warm-up 후 감소시키고, dropout과 label smoothing을 사용한다. 구조뿐 아니라 학습 조건도 번역 성능의 일부다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><div data-math=\"display\">\\operatorname{lr}(s)=d_{\\rm model}^{-1/2}\\min\\!\\left(s^{-1/2},\\;s\\,w^{-3/2}\\right)</div><p>s는 학습 step, w는 warm-up step이다. 원문은 w=4,000을 사용한다. 초기에는 두 번째 항이 선택되어 학습률이 선형 증가하고, 이후 첫 항에 따라 역제곱근으로 감소한다. 두 구간의 경계에서 같은 값을 갖기 때문에 학습률이 갑자기 뛰지 않는다.</p><p>Label smoothing은 정답 토큰에 모든 확률을 몰아주는 목표를 완화한다. 이는 번역 품질과 perplexity가 항상 같은 방향으로 변하지 않을 수 있는 이유이기도 하다. dropout과 residual 경로도 함께 확인해야 원문의 학습을 재현할 수 있다.</p>"
    },
    {
      "id": "results",
      "title": "6. Results",
      "html": "<p>원 논문은 WMT 2014 영어→독일어에서 28.4 BLEU, 영어→프랑스어에서 41.8 BLEU를 보고했다(§6). 이 수치는 해당 번역 데이터와 평가 설정에서의 결과다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>6.1은 번역 성능, 6.2는 모델 구성 변경, 6.3은 constituency parsing을 다룬다. 즉 attention 기반 번역 모델의 결과에 이어 다른 구조 설정과 과제로 적용 범위를 확인한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>6.2의 ablation은 head 수, key 차원, 모델 폭과 dropout 등을 바꾼다. 이 절은 attention 한 요소만으로 결과를 설명하기 어렵다는 점을 보여준다. BLEU를 비교할 때도 모델 크기와 단일 모델·앙상블 여부, 학습 조건을 함께 확인해야 한다.</p>"
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
  "demos": [
    {
      "id": "demo",
      "type": "review-attention",
      "title": "Q·K·V와 마스크 계산",
      "after": "model"
    },
    {
      "id": "position-encoding",
      "type": "review-position",
      "title": "위치 인코딩의 주파수",
      "after": "model"
    }
  ],
  "sourceText": [
    {
      "title": "원문 · Attention Is All You Need",
      "detail": "§3 구조 및 attention, §4 계산량, §6 번역 실험. arXiv v7 확인."
    },
    {
      "title": "저자 해설 · Google Research",
      "detail": "Jakob Uszkoreit, 2017-08-31. 순차 계산, attention 정보 전달과 번역 모델의 생성 경로."
    }
  ]
};
