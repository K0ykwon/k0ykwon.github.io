export default {
  "summary": "검은 칸과 흰 칸을 따로 탐색한다. 두 방향의 대각선을 배열 인덱스와 비트 위치로 나타내 비숍의 충돌을 검사한다.",
  "sections": [
    {
      "id": "problem",
      "title": "1. 비숍은 두 종류의 대각선만 본다",
      "html": "<p>비숍을 놓을 수 있는 칸이 정해진 체스판에서, 서로 공격하지 않게 놓는 비숍 수를 최대화한다. 퀸과 달리 행·열을 공유하는 것은 괜찮고, 대각선을 공유하면 안 된다.</p><p>행과 열을 0부터 세면 한 방향 대각선은 <var>r + c</var>, 다른 방향은 <var>r − c</var>가 같다. 두 좌표를 대각선 번호로 바꾸면, <strong>각 방향 대각선을 한 번씩만 사용하는 배치 문제</strong>가 된다.</p>"
    },
    {
      "id": "idea",
      "title": "2. 색 분리와 대각선 인덱스",
      "html": "<p>비숍은 움직일 때 칸의 색이 바뀌지 않는다. 따라서 검은 칸과 흰 칸의 비숍은 서로 공격하지 않으며, 두 문제를 따로 풀어 더할 수 있다. <var>(r + c) mod 2</var>가 칸 색을 구별한다.</p><p>한쪽 대각선 번호를 배열 인덱스로, 반대쪽 대각선 번호를 비트 위치로 사용한다.</p><div class=\"article-formula\">index = r + c<br>bit = 1 &lt;&lt; (r − c + N − 1)</div><p><var>N − 1</var>을 더하는 이유는 음수 인덱스를 없애기 위해서다. 이렇게 좌표에서 직접 번호를 계산하면, 회전한 체스판의 대각선 길이에 맞춰 별도 패딩을 할 필요가 없다.</p>"
    },
    {
      "id": "search",
      "title": "3. 놓는 경우와 건너뛰는 경우",
      "html": "<p><code>dfs(index, used)</code>에서 <code>used</code>는 이미 사용한 반대 방향 대각선의 비트마스크다. 현재 대각선에서는 비숍을 최대 하나만 놓을 수 있다.</p><ul><li>아무것도 놓지 않고 다음 대각선으로 이동한다.</li><li><code>choices[index] &amp; ~used</code>에서 가능한 칸을 하나 골라 비숍을 놓고 이동한다.</li></ul><p>N-Queens처럼 매 단계 반드시 하나를 놓는 문제가 아니므로 <strong>건너뛰는 전이</strong>를 빼면 안 된다. 같은 <code>(index, used)</code>에서 남은 최댓값은 같으므로 메모이제이션으로 중복 탐색도 줄일 수 있다.</p><p><a href=\"#blog/boj-python-9663-n-queens\" data-section=\"blog\" data-post=\"boj-python-9663-n-queens\">N-Queens 풀이</a>에서는 매 행에 퀸을 반드시 하나 놓는다. 비숍은 해당 대각선을 건너뛰는 경우도 탐색해야 한다.</p>"
    },
    {
      "id": "complexity",
      "title": "4. 계산량",
      "html": "<p>한 색에 해당하는 대각선 수를 <var>D</var>, 반대 방향에서 사용 가능한 대각선 수를 <var>K</var>라 하면, 메모이제이션 상태는 최대 <var>D·2<sup>K</sup></var>개다. 상태마다 최대 <var>K</var>개의 칸을 확인하므로 시간 상한은 <strong>O(D·K·2ᴷ)</strong>, 공간은 <strong>O(D·2ᴷ)</strong>이다. 이 문제에서는 한 색당 <var>D, K ≤ N ≤ 10</var>이다.</p><p>놓을 수 없는 칸은 후보에서만 제외한다. 비숍의 공격을 막아 주는 벽처럼 취급하지는 않는다.</p>"
    }
  ],
  "demoTitle": "비숍 배치"
};
