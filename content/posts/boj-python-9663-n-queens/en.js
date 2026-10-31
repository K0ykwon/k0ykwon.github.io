export default {
  "title": "[BOJ / Python] 9663: N-Queens",
  "summary": "Track columns and both diagonal directions with bitmasks. Search only available positions in each row to count placements of N non-attacking queens.",
  "demoTitle": "Placing queens row by row",
  "sections": [
    {
      "id": "problem",
      "title": "1. One queen in every row",
      "html": "<p>Count placements of N queens on an <var>N × N</var> board without mutual attacks. Two queens cannot share a row, so choose one square in the current row and recurse into the next.</p><p>Exclude columns and diagonals already attacked by placed queens. If no square remains in the next row, stop exploring that branch.</p>"
    },
    {
      "id": "idea",
      "title": "2. Column and diagonal masks",
      "html": "<p>One bit represents one column. Maintain three masks:</p><table><thead><tr><th>Mask</th><th>Meaning in the current row</th></tr></thead><tbody><tr><td>columns</td><td>Columns already occupied by queens</td></tr><tr><td>diagonal_left</td><td>Columns attacked along one diagonal direction</td></tr><tr><td>diagonal_right</td><td>Columns attacked along the opposite direction</td></tr></tbody></table><div class=\"article-formula\">available = full &amp; ~(columns | diagonal_left | diagonal_right)</div><p><code>full = (1 &lt;&lt; N) - 1</code> contains exactly N set bits. Python’s <code>~</code> also flips bits outside the board, so AND the result with full.</p>"
    },
    {
      "id": "transition",
      "title": "3. Extract a bit and move to the next row",
      "html": "<p><code>available &amp; -available</code> isolates the lowest set bit. Place a queen there, then remove the candidate with <code>available ^= bit</code>.</p><p>The occupied-column mask carries forward. Moving down one row shifts diagonal attacks by one bit: <code>&lt;&lt; 1</code> in one direction and <code>&gt;&gt; 1</code> in the other. The names diagonal_left and diagonal_right refer to those bit-shift directions.</p><p>Reaching row N means every row contains a queen, so return 1. Summing across branches gives the total solution count.</p>"
    },
    {
      "id": "complexity",
      "title": "4. Pruning and complexity",
      "html": "<p>A coarse upper bound after excluding duplicate columns is <strong>O(N!)</strong>; diagonal checks prune further branches. The recursion depth is N, giving <strong>O(N)</strong> extra stack space. In this problem’s small-board range, each mask fits in one ordinary integer representation.</p><p>N=1 has one solution; N=2 and N=3 have none. For N=8, the answer is 92.</p>"
    }
  ],
  "tags": [
    "Bitmask",
    "Backtracking",
    "DFS"
  ]
};
