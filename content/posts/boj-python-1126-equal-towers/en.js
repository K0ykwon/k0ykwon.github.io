export default {
  "title": "[BOJ / Python] 1126: Equal Towers",
  "summary": "Use the height difference as the DP state. Among states with the same difference, retain the maximum height of the taller tower.",
  "demoTitle": "DP states after each block",
  "sections": [
    {
      "id": "problem",
      "title": "1. From exhaustive search to DP",
      "html": "<p>Each block can go on the taller tower, on the shorter tower, or remain unused. With up to 50 blocks, enumerating all <var>3<sup>N</sup></var> choices is impractical.</p><p>If the two current heights match, the remaining blocks permit the same future outcomes. Instead of storing both heights as a state key, merge states with the same height difference.</p>"
    },
    {
      "id": "idea",
      "title": "2. Keep the tallest state for each difference",
      "html": "<div class=\"article-formula\">states[d] = maximum taller-tower height achievable with difference d</div><p>For taller height a and difference d, the shorter height is a − d. If two states have the same difference, applying the same future choices produces the same change in difference and the same increment in the taller height. The state with larger a can therefore give the better result.</p><p>For example, (8, 5) and (6, 3) both have difference 3. If the remaining blocks can close that gap, the first state produces towers that are two units taller.</p>"
    },
    {
      "id": "transitions",
      "title": "3. Three choices for one block",
      "html": "<p>For a block of height h:</p><table><thead><tr><th>Choice</th><th>New difference</th><th>New taller height</th></tr></thead><tbody><tr><td>Skip</td><td>d</td><td>a</td></tr><tr><td>Add to taller tower</td><td>d + h</td><td>a + h</td></tr><tr><td>Add to shorter tower</td><td>|d − h|</td><td>a + max(h − d, 0)</td></tr></tbody></table><p>The last choice may reverse which tower is taller. If <var>h ≤ d</var>, the old taller height stays unchanged. If <var>h &gt; d</var>, the other tower becomes taller by <var>h − d</var>.</p><p>Start with <code>next_states = states.copy()</code> for skipping, then update the other two choices. Iterate only over the previous dictionary so that the same block cannot be reused.</p>"
    },
    {
      "id": "complexity",
      "title": "4. Height bound and final answer",
      "html": "<p>If the total block height is S, each final tower is at most <var>⌊S/2⌋</var>. The taller height never decreases as blocks are added, so discard states exceeding this bound. Sorting processes small blocks first; it is not required for correctness.</p><p>Return the height at difference zero. If it is zero, no two nonempty equal towers exist, so return −1. The upper bound is <strong>O(N·S)</strong> time and <strong>O(S)</strong> space; the dictionary stores only reachable states.</p>"
    }
  ],
  "tags": [
    "DP",
    "State compression",
    "Optimization"
  ]
};
