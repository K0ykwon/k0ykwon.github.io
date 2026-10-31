export default {
  "summary": "열과 두 방향의 대각선을 비트마스크로 관리한다. 행마다 놓을 수 있는 칸만 탐색해 N개의 퀸을 배치하는 경우의 수를 센다.",
  "sections": [
    {
      "id": "problem",
      "title": "1. 한 행에 퀸 하나씩",
      "html": "<p><var>N × N</var> 체스판에 퀸 <var>N</var>개를 서로 공격하지 않게 놓는 방법의 수를 센다. 같은 행에 둘 수 없으므로, <strong>현재 행에서 퀸 하나를 고른 뒤 다음 행으로 내려가는 탐색</strong>으로 경우의 수를 센다.</p><p>이미 놓인 퀸과 열 또는 대각선을 공유하는 칸은 제외한다. 다음 행에 가능한 칸이 없다면 그 분기는 더 탐색하지 않는다.</p>"
    },
    {
      "id": "idea",
      "title": "2. 열과 대각선 마스크",
      "html": "<p>한 비트가 한 열을 나타내도록 두고, 세 마스크를 관리한다.</p><table><thead><tr><th>마스크</th><th>현재 행에서의 의미</th></tr></thead><tbody><tr><td>columns</td><td>이미 퀸이 사용한 열</td></tr><tr><td>diagonal_left</td><td>한 방향 대각선으로 공격받는 열</td></tr><tr><td>diagonal_right</td><td>반대 방향 대각선으로 공격받는 열</td></tr></tbody></table><div class=\"article-formula\">available = full &amp; ~(columns | diagonal_left | diagonal_right)</div><p><code>full = (1 &lt;&lt; N) - 1</code>은 체스판 너비만큼 1인 마스크다. 파이썬의 비트 반전 <code>~</code>은 보드 바깥 비트까지 포함하므로, 마지막에 반드시 <code>full</code>과 AND 연산을 한다.</p>"
    },
    {
      "id": "transition",
      "title": "3. 비트 하나를 꺼내 다음 행으로",
      "html": "<p><code>available &amp; -available</code>은 켜진 비트 중 가장 낮은 위치의 하나만 남긴다. 그 칸에 퀸을 놓고 <code>available ^= bit</code>로 후보에서 지운다.</p><p>다음 행으로 내려갈 때 열 마스크는 유지한다. 대각선 공격은 비트 위치가 하나 커지는 방향으로 <code>&lt;&lt; 1</code>, 하나 작아지는 방향으로 <code>&gt;&gt; 1</code> 이동한다. <code>diagonal_left</code>와 <code>diagonal_right</code>는 이 비트 이동 방향에 맞춘 이름이다.</p><p>현재 행이 <var>N</var>이 되었다면 모든 행에 퀸을 놓았으므로 1을 반환한다. 각 분기의 반환값을 더하면 전체 해의 수가 된다.</p>"
    },
    {
      "id": "complexity",
      "title": "4. 가지치기와 계산량",
      "html": "<p>열 중복을 제거한 탐색의 거친 시간 상한은 <strong>O(N!)</strong>이고, 대각선 검사로 실제 탐색 분기를 더 줄인다. 재귀 깊이는 <var>N</var>이므로 추가 스택 공간은 <strong>O(N)</strong>이다. 이 문제의 작은 보드 범위에서는 각 마스크를 정수 하나로 관리한다.</p><p><var>N = 1</var>은 1가지, <var>N = 2, 3</var>은 0가지다. 예시인 <var>N = 8</var>에서는 92가지를 얻는다.</p>"
    }
  ],
  "demoTitle": "행별 퀸 배치"
};
