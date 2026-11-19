export default {
  "summary": "가중치 1,023개를 바꾼 편집이 MATH-500에서 29.45%p를 올렸다. 단일 열은 모델 출력을 어떻게 바꿨고, 같은 방법이 왜 항상 통하지 않았을까?",
  "sections": [
    {
      "id": "abstract",
      "title": "Abstract",
      "html": "<p>추론 에이전트는 모델을 재학습시키지 않고도 체크포인트의 일부를 고쳐 성능을 바꿀 수 있을까? Hu 등은 Qwen3.5-0.8B와 9B에서 7개 벤치마크, 총 16개 편집 경로를 조사했다. 가장 인상적인 결과는 0.8B 수학 실험의 +29.45%p이지만, 16개 경로 중 6개에서는 원본을 유지했다. 두 결과를 같이 읽어야 이 논문이 보여 주는 가능성과 한계가 보인다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p>"
    },
    {
      "id": "introduction",
      "title": "1. Introduction",
      "html": "<p>WSP에서는 에이전트가 출력과 내부 활성값을 관찰하고, 체크포인트에 적용할 편집을 직접 제안한다. 이 논문의 질문은 숫자를 얼마나 적게 바꿀 수 있는지뿐 아니라, 탐색에 사용하지 않은 문제에서도 효과가 남는지와 다른 과제에 어떤 영향을 주는지다. 역전파 없이 편집한다는 말은 데이터나 모델 실행 없이 편집한다는 뜻이 아니다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup><sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"참고문헌 2\">[2]</a></sup></p>"
    },
    {
      "id": "protocol",
      "title": "2. Experimental Protocol",
      "html": "<p>각 탐색은 원본 체크포인트에서 시작한다. 생성 또는 정답 토큰을 입력으로 주는 분석에 최대 50회 도구 요청을 허용한다. 에이전트는 개발 데이터의 피드백으로 후보를 고르고, 개선이 불안정하면 원본을 유지할 수 있다. MATH-500은 수학 편집을 고르는 개발 데이터와 분리된다. 0.8B 수학 주 실험의 50회는 생성 요청 32회, 정답 토큰을 입력하는 분석 요청 18회였다. 도구 요청 하나가 예제 하나라는 뜻은 아니다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p>"
    },
    {
      "id": "intervention",
      "title": "3. A Single-Column Intervention",
      "html": "<p>주 실험에서는 23번 층 MLP의 down-projection에서 507번 열 하나를 수정한다. 인덱스는 0부터 센다. 에이전트가 구성한 방향을 <var>u</var>, 해당 열을 고르는 단위벡터를 <var>e</var>라 하면 편집과 출력 변화는 다음과 같다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><div data-math=\"display\">W^{\\prime}=W-u e_{507}^{\\top}</div><div data-math=\"display\">W^{\\prime}a-Wa=-a_{507}u</div><p>핵심은 가중치의 위치뿐 아니라 활성값이다. 해당 중간 채널의 값이 0이면 이 연산에서 편집 효과도 0이다. 1,024개 열 원소 중 BF16으로 저장했을 때 값이 실제로 달라진 항목은 1,023개였다. 이 숫자는 편집의 크기를 말해 줄 뿐, 수학 능력이 그 열에만 저장된다는 증거가 아니다.</p>"
    },
    {
      "id": "results",
      "title": "4. Results and Transfer",
      "html": "<p>저자 보고치에서 0.8B 수학 주 실험의 MATH-500 정확도는 8.35%에서 37.80%로 올랐다. 독립적으로 두 번 더 탐색했을 때의 개선은 +5.00%p와 +27.30%p였다. 9B 수학에서는 개발 점수가 +29.69%p였지만 평가한 후보가 MATH-500에서 97.70%에서 97.35%로 내려가 최종적으로 원본이 선택됐다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>0.8B 수학 편집본을 추가 수정 없이 평가하면 GPQA Diamond +3.03%p, IFEval +12.18%p, SciBench +20.10%p였지만 SciCode 성능은 바뀌지 않았다. 이 값들은 각 과제에 따로 최적화한 편집본의 최고 성과와 구별해야 한다.</p>"
    },
    {
      "id": "limitations",
      "title": "5. Limitations",
      "html": "<p>바뀐 값의 수는 탐색 비용의 대리 지표가 아니다. 여러 후보를 실제로 평가하는 데 비용이 들며, 같은 과제의 반복 탐색에서도 결과가 달랐다. 0.8B가 낮은 기준점에서 출발했다는 점도 중요하다. 작은 모델의 큰 개선 폭은 작은 모델이 큰 모델보다 이번 비교에서 더 높은 최종 성능을 냈다는 뜻이 아니다.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"참고문헌 1\">[1]</a></sup></p><p>특정 벤치마크에서 다른 능력도 함께 나아졌다는 결과는 보존 보장이 아니다. 편집을 평가하려면 목표 점수, 답을 끝까지 낸 비율, 비대상 과제의 손상, 탐색 예산을 따로 놓고 봐야 한다.</p>"
    },
    {
      "id": "summary",
      "title": "Summary",
      "html": "<p>이 논문의 강점은 1,023개를 바꾼 성공 사례와 함께, 반복 탐색의 편차와 원본으로 돌아간 사례를 보고했다는 점이다. 작은 편집이 큰 효과를 낼 수 있다는 것은 확인할 만한 결과지만, 다음 모델과 과제에서 어떤 편집이 통할지 예측하는 문제는 여전히 남아 있다.</p>"
    }
  ],
  "sourceText": [
    {
      "title": "Exploring Weight-Space Programming",
      "detail": "원문 v1: 2~4절, 표 2, 부록의 단일 열 편집."
    },
    {
      "title": "Weight-Space Programming",
      "detail": "연구 배경과 초기 사례를 설명한 공개 글."
    }
  ]
};
