import {PAPER_REVIEWS} from './paper-reviews.js?v=20261030-review-math';
export const POSTS = [
  ...PAPER_REVIEWS,
  {
    "id": 17467,
    "slug": "boj-python-17467-n-mod-p-2",
    "title": "[BOJ / Python] 17467: N! mod P (2)",
    "category": "알고리즘",
    "tags": [
      "수론",
      "모듈러 연산",
      "Wilson 정리"
    ],
    "summary": "윌슨의 정리를 이용해 N!과 (P − N − 1)! 중 짧은 쪽만 계산한다. 뒤쪽 구간을 고르면 모듈러 역원으로 N!을 구한다.",
    "minutes": 5,
    "demo": "factorial",
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
    "published": "2026-04-20",
    "updated": "2026-10-30",
    "codePath": "blog/code/boj_17467.py",
    "code": "def factorial_mod_prime(n, prime):\n    tail = prime - n - 1\n    count = min(n, tail)\n    factorial = 1\n    for value in range(1, count + 1):\n        factorial = factorial * value % prime\n\n    if n <= tail:\n        return factorial\n\n    # n! = (-1)^(tail + 1) / tail!  (mod prime)\n    inverse = pow(factorial, prime - 2, prime)\n    sign = 1 if tail % 2 else -1\n    return sign * inverse % prime\n\n\nif __name__ == \"__main__\":\n    n, prime = map(int, input().split())\n    print(factorial_mod_prime(n, prime))\n",
    "subcategory": "수론",
    "demoTitle": "팩토리얼 계산 구간 비교"
  },
  {
    "id": 2392,
    "slug": "boj-python-2392-polygon-partition",
    "title": "[BOJ / Python] 2392: 다각형의 분할",
    "category": "알고리즘",
    "tags": [
      "DP",
      "조합론",
      "구간 분할"
    ],
    "summary": "기준 변에 붙은 도형을 고정해 중복을 피한다. 삼각분할은 두 부분, 사각분할은 세 부분의 경우의 수를 곱해 계산한다.",
    "minutes": 7,
    "demo": "polygon",
    "sections": [
      {
        "id": "problem",
        "title": "1. 기준 변 하나를 고정한다",
        "html": "<p>볼록한 <var>N</var>각형을 교차하지 않는 대각선으로 나눈다. 모든 조각이 삼각형인 경우와, 모든 조각이 사각형인 경우의 수를 각각 구한다. 꼭짓점의 위치를 구별하므로 회전·대칭으로 옮겨진 배치도 따로 센다.</p><p>아무 대각선이나 먼저 고르면 같은 분할을 여러 순서로 셀 수 있다. 대신 <strong>기준 변을 하나 고정하고, 그 변에 붙어 있는 도형</strong>을 먼저 고르면 각 분할을 하나의 경우로 분류할 수 있다.</p>"
      },
      {
        "id": "idea",
        "title": "2. 삼각형은 두 부분으로 나뉜다",
        "html": "<p><var>T[n]</var>을 <var>n</var>각형의 삼각분할 수라고 하자. 기준 변의 양 끝점을 0과 <var>n − 1</var>로 두고 세 번째 꼭짓점 <var>k</var>를 고르면, 나머지 영역은 <var>k + 1</var>각형과 <var>n − k</var>각형이다.</p><div class=\"article-formula\">T[n] = Σ<sub>k=1…n−2</sub> T[k + 1] · T[n − k]</div><p>두 영역의 분할은 서로 독립이므로 곱하고, 세 번째 꼭짓점 선택은 서로 다른 경우이므로 더한다. <var>T[2] = 1</var>은 실제 이각형을 그린다는 의미가 아니라, <strong>더 나눌 영역이 없는 하나의 변</strong>을 처리하는 기저 상태다.</p><p>이 점화식은 카탈란 수와 연결된다. <var>T[3] = 1, T[4] = 2, T[5] = 5, T[6] = 14</var>로 이어진다.</p>"
      },
      {
        "id": "quadrangles",
        "title": "3. 사각분할 점화식",
        "html": "<p>기준 변에 붙은 사각형을 고르면 나머지 영역은 세 부분이다. 사각형이 <var>m</var>개인 분할의 수를 <var>Q[m]</var>이라 두면 꼭짓점 수는 <var>2m + 2</var>이고,</p><div class=\"article-formula\">Q[0] = 1<br>Q[m] = Σ<sub>a+b+c=m−1</sub> Q[a] · Q[b] · Q[c]</div><p>세 인덱스를 매번 열거하는 대신, 두 부분의 합성곱을 미리 저장한다.</p><div class=\"article-formula\">pair[s] = Σ<sub>i=0…s</sub> Q[i] · Q[s − i]<br>Q[m] = Σ<sub>s=0…m−1</sub> pair[s] · Q[m − 1 − s]</div><p><code>Q[m]</code>을 먼저 구한 다음 <code>pair[m]</code>을 갱신한다. 이 순서면 필요한 이전 값이 모두 준비되어 있다. 홀수 개 꼭짓점으로는 전부 사각형인 분할을 만들 수 없으므로 두 번째 답은 0이다.</p>"
      },
      {
        "id": "complexity",
        "title": "4. 계산량과 나머지 연산",
        "html": "<p>삼각분할과 사각분할 모두 시간 <strong>O(N²)</strong>, 배열 공간 <strong>O(N)</strong>으로 계산한다. 답은 매 단계 <code>1_000_000_000</code>으로 나눈다.</p><p>이 모듈러는 소수가 아니다. 닫힌 형태의 조합 공식에서 나눗셈을 역원으로 바꾸기보다, 덧셈과 곱셈으로 이루어진 DP를 사용하면 모듈러 나눗셈의 조건을 따로 처리할 필요가 없다.</p><p><var>N = 6</var>일 때 삼각분할 14가지, 사각분할 3가지가 나온다.</p>"
      }
    ],
    "published": "2026-04-20",
    "updated": "2026-10-30",
    "codePath": "blog/code/boj_2392.py",
    "code": "MOD = 1_000_000_000\n\n\ndef polygon_partitions(n):\n    triangles = [0] * (n + 1)\n    triangles[2] = 1  # An empty subproblem along a single edge.\n    for size in range(3, n + 1):\n        triangles[size] = sum(\n            triangles[left] * triangles[size + 1 - left]\n            for left in range(2, size)\n        ) % MOD\n\n    if n % 2:\n        return triangles[n], 0\n\n    faces = (n - 2) // 2\n    quadrangles = [0] * (faces + 1)\n    pairs = [0] * (faces + 1)\n    quadrangles[0] = pairs[0] = 1\n    for count in range(1, faces + 1):\n        quadrangles[count] = sum(\n            pairs[left] * quadrangles[count - 1 - left]\n            for left in range(count)\n        ) % MOD\n        pairs[count] = sum(\n            quadrangles[left] * quadrangles[count - left]\n            for left in range(count + 1)\n        ) % MOD\n\n    return triangles[n], quadrangles[faces]\n\n\nif __name__ == \"__main__\":\n    triangular, quadrilateral = polygon_partitions(int(input()))\n    print(triangular)\n    print(quadrilateral)\n",
    "subcategory": "DP",
    "demoTitle": "기준 도형에 따른 분할 수"
  },
  {
    "id": 1126,
    "slug": "boj-python-1126-equal-towers",
    "title": "[BOJ / Python] 1126: 같은 탑",
    "category": "알고리즘",
    "tags": [
      "DP",
      "상태 압축",
      "최적화"
    ],
    "summary": "두 탑의 높이 차이를 DP 상태로 둔다. 차이가 같은 상태에서는 높은 탑의 높이가 최대인 경우만 남긴다.",
    "minutes": 6,
    "demo": "towers",
    "sections": [
      {
        "id": "problem",
        "title": "1. 탐색에서 DP로",
        "html": "<p>각 블록은 높은 쪽 탑, 낮은 쪽 탑, 또는 사용하지 않는 쪽으로 보낼 수 있다. 블록이 최대 50개이므로 이 세 선택을 전부 나열하는 <var>3<sup>N</sup></var> 탐색은 어렵다.</p><p><strong>현재 두 탑의 높이</strong>가 같으면 남은 블록으로 만들 수 있는 결과도 같다. 두 높이를 모두 저장하는 대신, <strong>높이 차이</strong>가 같은 상태끼리 합칠 수 있다.</p>"
      },
      {
        "id": "idea",
        "title": "2. 차이가 같다면 높은 쪽의 최댓값만",
        "html": "<div class=\"article-formula\">states[d] = 높이 차이가 d인 상태에서 가능한 높은 탑의 최대 높이</div><p>높은 탑이 <var>a</var>, 차이가 <var>d</var>라면 낮은 탑은 <var>a − d</var>다. 같은 차이를 가진 두 상태에서는 이후 블록을 같은 방식으로 배치했을 때 차이 변화가 같고, 높은 탑에 더해지는 높이도 같다. 따라서 <var>a</var>가 큰 상태가 더 좋은 답을 만들 수 있다.</p><p>예를 들어 높이가 (8, 5)인 상태와 (6, 3)인 상태는 둘 다 차이가 3이다. 같은 남은 블록으로 차이를 0으로 만들 수 있다면, 첫 번째 상태에서 만든 두 탑이 2만큼 더 높다.</p>"
      },
      {
        "id": "transitions",
        "title": "3. 블록 하나를 처리하는 세 선택",
        "html": "<p>높이가 <var>h</var>인 블록을 처리할 때 전이는 다음과 같다.</p><table><thead><tr><th>선택</th><th>새 차이</th><th>새 높은 탑</th></tr></thead><tbody><tr><td>사용하지 않기</td><td>d</td><td>a</td></tr><tr><td>높은 쪽에 쌓기</td><td>d + h</td><td>a + h</td></tr><tr><td>낮은 쪽에 쌓기</td><td>|d − h|</td><td>a + max(h − d, 0)</td></tr></tbody></table><p>낮은 쪽에 쌓으면 두 탑의 높낮이가 뒤바뀔 수 있다. <var>h ≤ d</var>면 낮은 탑이 아직 더 낮으므로 높은 탑은 그대로다. <var>h &gt; d</var>면 낮은 탑이 역전하면서 <var>h − d</var>만큼 더 높아진다.</p><p><code>next_states = states.copy()</code>로 블록을 사용하지 않는 경우를 먼저 담고, 나머지 두 경우를 갱신한다. 이전 단계의 사전만 순회해야 같은 블록을 여러 번 사용하는 일이 없다.</p>"
      },
      {
        "id": "complexity",
        "title": "4. 높이 제한과 정답",
        "html": "<p>전체 블록 높이의 합이 <var>S</var>라면 최종 두 탑의 높이는 <var>⌊S/2⌋</var>를 넘을 수 없다. 높은 탑의 높이는 이후에 줄어들지 않으므로 이 값을 넘는 상태는 버린다. 정렬은 작은 블록부터 상태를 합치는 처리 순서이며, 정답을 구하기 위한 필수 조건은 아니다.</p><p>차이가 0인 상태의 높이를 반환하되, 0이라면 두 탑을 비어 있지 않게 만들 수 없으므로 −1이다. 시간의 상한은 <strong>O(N·S)</strong>, 공간은 <strong>O(S)</strong>이며 실제 사전에는 도달한 상태만 저장한다.</p>"
      }
    ],
    "published": "2026-04-20",
    "updated": "2026-10-30",
    "codePath": "blog/code/boj_1126.py",
    "code": "def tallest_equal_towers(blocks):\n    limit = sum(blocks) // 2\n    states = {0: 0}  # height difference -> tallest possible higher tower\n\n    for block in sorted(blocks):\n        next_states = states.copy()  # Not using this block.\n        for difference, higher in states.items():\n            candidates = (\n                (difference + block, higher + block),\n                (abs(difference - block), higher + max(block - difference, 0)),\n            )\n            for new_difference, new_higher in candidates:\n                if new_higher <= limit:\n                    next_states[new_difference] = max(\n                        next_states.get(new_difference, -1), new_higher\n                    )\n        states = next_states\n\n    answer = states.get(0, 0)\n    return answer if answer > 0 else -1\n\n\nif __name__ == \"__main__\":\n    _ = int(input())\n    heights = list(map(int, input().split()))\n    print(tallest_equal_towers(heights))\n",
    "subcategory": "DP",
    "demoTitle": "블록별 DP 상태"
  },
  {
    "id": 1799,
    "slug": "boj-python-1799-bishops",
    "title": "[BOJ / Python] 1799: 비숍",
    "category": "알고리즘",
    "tags": [
      "비트마스크",
      "DFS",
      "대각선"
    ],
    "summary": "검은 칸과 흰 칸을 따로 탐색한다. 두 방향의 대각선을 배열 인덱스와 비트 위치로 나타내 비숍의 충돌을 검사한다.",
    "minutes": 6,
    "demo": "bishops",
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
    "published": "2026-04-20",
    "updated": "2026-10-30",
    "codePath": "blog/code/boj_1799.py",
    "code": "from functools import lru_cache\n\n\ndef max_bishops(board):\n    n = len(board)\n    diagonals = [0] * (2 * n - 1)\n    for row in range(n):\n        for column in range(n):\n            if board[row][column]:\n                diagonals[row + column] |= 1 << (row - column + n - 1)\n\n    def solve_color(choices):\n        @lru_cache(maxsize=None)\n        def dfs(index, used):\n            if index == len(choices):\n                return 0\n\n            best = dfs(index + 1, used)  # Skip this diagonal.\n            available = choices[index] & ~used\n            while available:\n                bit = available & -available\n                available ^= bit\n                best = max(best, 1 + dfs(index + 1, used | bit))\n            return best\n\n        return dfs(0, 0)\n\n    return solve_color(diagonals[::2]) + solve_color(diagonals[1::2])\n\n\nif __name__ == \"__main__\":\n    size = int(input())\n    grid = [list(map(int, input().split())) for _ in range(size)]\n    print(max_bishops(grid))\n",
    "subcategory": "비트마스크",
    "demoTitle": "비숍 배치"
  },
  {
    "id": 9663,
    "slug": "boj-python-9663-n-queens",
    "title": "[BOJ / Python] 9663: N-Queens",
    "category": "알고리즘",
    "tags": [
      "비트마스크",
      "백트래킹",
      "DFS"
    ],
    "summary": "열과 두 방향의 대각선을 비트마스크로 관리한다. 행마다 놓을 수 있는 칸만 탐색해 N개의 퀸을 배치하는 경우의 수를 센다.",
    "minutes": 5,
    "demo": "queens",
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
    "published": "2026-04-20",
    "updated": "2026-10-30",
    "codePath": "blog/code/boj_9663.py",
    "code": "def count_queens(n):\n    full = (1 << n) - 1\n\n    def dfs(row, columns, diagonal_left, diagonal_right):\n        if row == n:\n            return 1\n\n        available = full & ~(columns | diagonal_left | diagonal_right)\n        count = 0\n        while available:\n            bit = available & -available\n            available ^= bit\n            count += dfs(\n                row + 1,\n                columns | bit,\n                ((diagonal_left | bit) << 1) & full,\n                (diagonal_right | bit) >> 1,\n            )\n        return count\n\n    return dfs(0, 0, 0, 0)\n\n\nif __name__ == \"__main__\":\n    print(count_queens(int(input())))\n",
    "subcategory": "비트마스크",
    "demoTitle": "행별 퀸 배치"
  }
];
