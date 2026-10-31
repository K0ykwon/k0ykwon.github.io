export default {
  "summary": "모델을 줄이는 일과 사전학습 비용을 줄이는 일을 함께 다룬다. sparse soft label, 데이터 증강 재현, 해상도에 따른 정확도·연산량 변화를 정리한다.",
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
      "html": "<p>대규모 사전학습·소형 ViT·지식 증류를 연결한다. 이미 학습된 큰 모델의 지식을 작은 모델에 전달하는 위치를 설명하고, 양자화·가지치기와도 함께 사용할 수 있는 접근으로 구분한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>일반적인 압축은 학습이 끝난 모델의 가중치나 연산을 줄일 수 있다. 이 논문에서는 작은 학생의 사전학습 자체를 개선하며, 교사의 출력이 정답 클래스 외에 어떤 클래스와 혼동하는지도 전달한다. 따라서 작은 구조의 효율과 soft label의 정보량을 나눠 살펴보는 것이 비교에 도움이 된다.</p>"
    },
    {
      "id": "method",
      "title": "3. TinyViT",
      "html": "<h3>3.1 Fast Pretraining Distillation</h3><div class=\"review-flow\" aria-label=\"TinyViT 사전학습 증류\"><span>이미지 + 증강 설정</span><span>교사 추론</span><span>희소 soft label 저장</span><span>같은 증강 재현</span><span>학생 학습</span></div><p>교사가 본 crop과 학생이 본 crop이 다르면 동일한 원본 이미지라도 학습 목표가 어긋날 수 있다. 따라서 캐시는 이미지별 예측뿐 아니라 해당 증강을 재현할 정보도 포함한다. 논문의 식 (1)은 교사 soft label과 학생 출력 사이의 cross-entropy를 최소화한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>예를 들어 원본 왼쪽에 고양이, 오른쪽에 자동차가 있다고 하자. 교사 캐시는 고양이 crop의 확률인데 학생은 자동차 crop을 보게 한다면, 캐시를 읽는 속도와 무관하게 잘못 대응된 감독 신호를 준다. 이 예는 증강 재현을 단순한 난수 관리로만 볼 수 없는 이유다.</p><p>전체 <var>C</var>개 클래스 확률을 모두 저장하는 대신 상위 <var>k</var>개의 값과 인덱스를 남긴다. 저장하지 않은 클래스에는 남은 확률 질량을 균등하게 배분한다. 아래는 논문 식 (2)의 복원 규칙이다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div data-math=\"display\">\\widetilde p_c=\\begin{cases}p_c,&amp;c\\in\\mathcal K\\\\\\dfrac{1-\\sum_{i\\in\\mathcal K}p_i}{C-k},&amp;c\\notin\\mathcal K\\end{cases}\\qquad (k&lt;C)</div><p>정답 클래스 하나만 남기는 hard label과 다르다. 큰 확률들 사이의 상대적인 관계를 보존하되 작은 확률의 세부 차이를 근사한다. 상위 확률만 다시 정규화하고 나머지를 0으로 만드는 방식도 위 식과 다르다.</p><p>공식 저장 안내는 epoch 구간을 나누어 교사 출력을 병렬 생성하고, 저장된 label이 다시 계산한 출력과 맞는지 검사하는 절차를 제공한다. 여러 학생을 실험한다면 교사 캐시를 한 번 만든 뒤 재사용할 수 있다.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"참고문헌 3\">[3]</a></sup></p><h3>3.2 Model Architectures</h3><p>모델은 해상도를 점차 줄이는 4개 stage로 구성된다. 앞부분과 downsampling에는 MBConv를 쓰고, 뒤의 세 stage에는 Transformer 블록을 둔다. 큰 모델에서 시작해 파라미터 수와 처리량 제약을 만족하는 후보로 점진적으로 축소한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>구현을 검토할 때는 파라미터 수만 보지 않고 feature map의 공간 크기와 채널 폭을 함께 봐야 한다. 같은 층 수라도 앞쪽의 높은 해상도에서 어떤 연산을 하는지에 따라 실제 비용이 달라진다.</p><h3>증류 손실과 캐시의 의미</h3><div data-math=\"display\">\\mathcal L_{\\rm distill}(x)=-\\sum_{c=1}^{C}\\widetilde p_c(a(x))\\log q_c(a(x))</div><p>a는 캐시와 함께 재현하는 증강, <span data-math=\"inline\">\\widetilde p</span>는 복원한 교사 확률, q는 학생 확률이다. 교사 분포를 고정한 경우 이 cross-entropy를 줄이는 것은 교사에서 학생으로의 KL divergence를 줄이는 것과 같은 최적점을 갖는다. 교사 entropy 항은 학생 파라미터에 의존하지 않기 때문이다.</p><p>예시로 C=5에서 상위 두 확률이 0.60, 0.25라면 나머지 세 클래스는 각각 0.05가 된다. 합은 여전히 1이다. k=C에서는 분모가 0인 공식을 쓰지 않고 전체 분포를 그대로 저장한다. 희소화는 교사의 작은 확률 차이를 잃는 대신 저장·전송 비용을 낮추는 절충이다.</p><p>캐시를 만들 때의 교사 계산은 여전히 필요하다. 학생 학습에서 교사를 제거하는 이득과 전체 실험의 총비용은 구별해야 한다. 또한 window attention의 실제 속도는 해상도, window 크기, 실행 장치와 구현의 영향을 함께 받는다.</p>"
    },
    {
      "id": "analysis",
      "title": "4. Analysis and Discussions",
      "html": "<p>작은 모델이 대규모 데이터의 이득을 충분히 얻지 못하는 이유를 hard sample과 class relationship 관점에서 분석한다. 원본 데이터 사전학습, 어려운 표본을 제거한 데이터, 교사의 soft label을 이용한 사전학습을 비교해 데이터 양과 감독 신호의 질을 구분한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>Hard label은 가까운 두 클래스도 정답·오답으로만 나눈다. soft label은 비슷한 클래스에 얼마만큼 확률을 줄지 표현할 수 있어 작은 모델에 더 부드러운 목표를 준다. 다만 이 설명만으로 모든 어려운 표본이 불필요하다거나 soft label이 항상 유리하다고 일반화할 수는 없다. 원문은 실제 데이터와 교사를 고정한 비교로 이 가설을 검토한다.</p>"
    },
    {
      "id": "experiments",
      "title": "5. Experiments",
      "html": "<p>5.1은 구현 조건, 5.2는 ablation, 5.3은 ImageNet, 5.4는 transfer learning 결과다. 캐시와 구조 설계의 효과를 분리한 뒤 이미지 분류와 전이 과제를 평가한다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>아래는 공식 Model Zoo에서 고른 설정이다. 모두 ImageNet-22k(21,841개 클래스) 사전학습 뒤 ImageNet-1k로 미세조정한 모델이다. 정확도는 ImageNet-1k top-1, MACs는 입력 1장 기준의 multiply–accumulate 수다.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>모델</th><th>입력</th><th>Acc@1</th><th>MACs</th></tr></thead><tbody><tr><td>TinyViT-5M</td><td>224²</td><td>80.7%</td><td>1.3G</td></tr><tr><td>TinyViT-21M</td><td>224²</td><td>84.8%</td><td>4.3G</td></tr><tr><td>TinyViT-21M-512</td><td>512²</td><td>86.5%</td><td>27.0G</td></tr></tbody></table></div><p>21M 모델의 해상도를 224에서 512로 높이면 정확도는 1.7%p 높아지지만 MACs는 약 6.3배다. 이는 위 숫자로 계산한 비교이며, 실제 지연시간의 배수와 같지는 않다. 처리 장치와 배치 크기까지 맞춰야 속도 차이를 판단할 수 있다.</p><p>21M 모델의 입력을 224에서 512로 바꾸면 파라미터 수는 같아도 처리할 공간 위치가 늘어난다. 표의 정확도 상승을 추가 비용 없이 얻은 개선으로 읽으면 안 된다. 배포 설정은 정확도·MACs·메모리·실측 지연시간을 함께 비교하고, 학습법의 이득은 같은 학생 구조에서 증류 유무를 맞춰 비교하는 편이 명확하다.</p>"
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
  "demos": [
    {
      "id": "demo",
      "type": "review-distillation",
      "title": "상위 확률만 저장했을 때의 복원",
      "after": "method"
    }
  ],
  "sourceText": [
    {
      "title": "원문 · TinyViT",
      "detail": "§3.1 fast distillation 및 식 (2), §3.2 모델 구조."
    },
    {
      "title": "공식 구현 · Microsoft Cream / TinyViT",
      "detail": "README의 Model Zoo: 사전학습 데이터, 입력 해상도, Acc@1 및 MACs."
    },
    {
      "title": "공식 교사 출력 저장 안내",
      "detail": "epoch별 sparse label 저장, 분산 생성 및 캐시 검증 절차."
    }
  ]
};
