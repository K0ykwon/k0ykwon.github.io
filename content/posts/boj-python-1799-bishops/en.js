export default {
  "title": "[BOJ / Python] 1799: Bishops",
  "summary": "Search black and white squares separately. Represent the two diagonal directions using array indices and bit positions to detect conflicts.",
  "demoTitle": "Bishop placements",
  "sections": [
    {
      "id": "problem",
      "title": "1. Bishops only conflict on diagonals",
      "html": "<p>Some board squares allow a bishop and others do not. Maximize the number placed without mutual attacks. Sharing a row or column is allowed; sharing a diagonal is not.</p><p>Using zero-based row and column indices, the two diagonal directions have constant <var>r + c</var> and <var>r − c</var>. The problem becomes selecting placements that use each diagonal at most once.</p>"
    },
    {
      "id": "idea",
      "title": "2. Split colors and index diagonals",
      "html": "<p>A bishop never changes square color. Black-square and white-square bishops cannot attack each other, so solve the two subproblems separately and add their answers. Square color is determined by <var>(r + c) mod 2</var>.</p><p>Use one diagonal number as an array index and the other as a bit position:</p><div class=\"article-formula\">index = r + c<br>bit = 1 &lt;&lt; (r − c + N − 1)</div><p>Adding N − 1 eliminates negative indices. Direct coordinate indexing avoids padding a rotated board to align its diagonal lengths.</p>"
    },
    {
      "id": "search",
      "title": "3. Place a bishop or skip the diagonal",
      "html": "<p>In <code>dfs(index, used)</code>, used records occupied diagonals in the opposite direction. At most one bishop can be placed on the current diagonal.</p><ul><li>Leave it empty and move to the next diagonal.</li><li>Choose a candidate from <code>choices[index] &amp; ~used</code>, place a bishop and continue.</li></ul><p>Unlike N-Queens, a placement is not required at every stage. The skip transition is essential. The remaining optimum depends only on (index, used), allowing memoization.</p><p>The <a href=\"#blog/boj-python-9663-n-queens\" data-section=\"blog\" data-post=\"boj-python-9663-n-queens\">N-Queens solution</a> must place one queen in every row; this search also needs to consider leaving a diagonal empty.</p>"
    },
    {
      "id": "complexity",
      "title": "4. Complexity",
      "html": "<p>For one color, let D be the number of diagonals being processed and K the number in the opposite direction. There are at most <var>D·2<sup>K</sup></var> cached states, each trying at most K squares. The bounds are <strong>O(D·K·2ᴷ)</strong> time and <strong>O(D·2ᴷ)</strong> space. Here, <var>D, K ≤ N ≤ 10</var> for each color.</p><p>A forbidden square is removed from placement candidates. It is not a wall that blocks a bishop’s attack.</p>"
    }
  ],
  "tags": [
    "Bitmask",
    "DFS",
    "Diagonals"
  ]
};
