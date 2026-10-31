export default {
  "summary": "윌슨의 정리를 이용해 N!과 (P − N − 1)! 중 짧은 쪽만 계산한다. 뒤쪽 구간을 고르면 모듈러 역원으로 N!을 구한다.",
  "sections": [
    {
      "id": "problem",
      "title": "1. 계산 구간 선택",
      "html": "<p>소수 <var>P</var>와 <var>0 ≤ N &lt; P</var>가 주어졌을 때 <var>N! mod P</var>를 구한다. 곱셈을 할 때마다 나머지를 취하면 큰 정수를 직접 저장할 필요는 없지만, 반복 횟수는 여전히 <var>N</var>번이다.</p><p>예를 들어 <var>N = P − 1</var>이라면 거의 <var>P</var>번 곱하는 대신, 소수의 성질을 이용해 답을 바로 알 수 있다. <strong>N과 P − N − 1 중 짧은 구간만 계산</strong>하면 된다.</p>"
    },
    {
      "id": "idea",
      "title": "2. 윌슨의 정리와 역원",
      "html": "<p>소수 <var>P</var>에 대해 윌슨의 정리는 다음과 같다.</p><div class=\"article-formula\">(P − 1)! ≡ −1 &nbsp;(mod P)</div><p><var>L = P − N − 1</var>로 두고 앞쪽과 뒤쪽을 나누면,</p><div class=\"article-formula\">N! · (N + 1)(N + 2)⋯(P − 1) ≡ −1 &nbsp;(mod P)</div><p>뒤쪽의 각 수를 <var>P</var>로 나눈 나머지로 보면 <var>−L, …, −2, −1</var>이다. 따라서 뒤쪽 곱은 <var>(−1)<sup>L</sup> · L!</var>과 같다.</p><div class=\"article-formula\">N! ≡ (−1)<sup>L+1</sup> · (L!)<sup>−1</sup> &nbsp;(mod P)</div><p><var>L! </var>에는 <var>P</var>의 배수가 없으므로 역원이 존재한다. 페르마의 소정리로 <code>pow(factorial, P - 2, P)</code>를 계산하면 된다. 마지막으로 <var>L</var>이 홀수면 부호는 +, 짝수면 −이다.</p>"
    },
    {
      "id": "implementation",
      "title": "3. 구현과 경계값",
      "html": "<p><code>min(N, L)</code>만큼만 곱하고, 앞쪽을 선택했다면 그 값을 그대로 반환한다. 뒤쪽을 선택했다면 역원과 부호를 적용한다. 두 분기에 같은 팩토리얼 반복문을 중복해서 쓸 필요가 없다.</p><ul><li><var>N = 0</var>: 빈 곱인 <var>0! = 1</var>을 반환한다.</li><li><var>N = P − 1</var>: <var>L = 0</var>이므로 답은 <var>−1 mod P</var>이다.</li><li>파이썬의 <code>%</code> 연산은 양수 모듈러에서 결과를 <var>0 … P − 1</var>로 정리하므로, 음수 부호를 적용한 뒤 별도로 <var>P</var>를 더하지 않아도 된다.</li></ul>"
    },
    {
      "id": "complexity",
      "title": "4. 계산량",
      "html": "<p>시간은 <strong>O(min(N, P − N − 1) + log P)</strong>, 추가 공간은 <strong>O(1)</strong>이다. 역원을 구하는 로그 항은 뒤쪽 구간을 선택할 때 발생한다. 실행 시간은 전체 <var>P</var>의 크기보다 실제로 곱하는 짧은 구간의 길이에 따라 결정된다.</p><p>입력 <code>999999936 999999937</code>에서는 뒤쪽 구간 길이가 0이므로, 큰 팩토리얼을 순회하지 않고 <code>999999936</code>을 얻는다.</p>"
    }
  ],
  "demoTitle": "팩토리얼 계산 구간 비교"
};
