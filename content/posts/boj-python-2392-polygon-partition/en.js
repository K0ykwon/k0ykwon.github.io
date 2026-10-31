export default {
  "title": "[BOJ / Python] 2392: Polygon Partition",
  "summary": "Fix the face next to a base edge to avoid double counting. Combine two subproblems for triangulations and three for quadrangulations.",
  "demoTitle": "Partition counts for a fixed face",
  "sections": [
    {
      "id": "problem",
      "title": "1. Fix a base edge",
      "html": "<p>Partition a convex N-gon with non-crossing diagonals. Count partitions entirely into triangles and entirely into quadrilaterals separately. Vertices are distinguished, so rotated or reflected placements are counted separately.</p><p>Choosing arbitrary diagonals in arbitrary order can count the same partition repeatedly. Instead, fix one edge and first choose the face incident to it. Every partition then belongs to a unique case.</p>"
    },
    {
      "id": "idea",
      "title": "2. A triangle leaves two subproblems",
      "html": "<p>Let T[n] count triangulations of an n-gon. Label the base endpoints 0 and n − 1. Choosing the third vertex k leaves polygons with k + 1 and n − k vertices.</p><div class=\"article-formula\">T[n] = Σ<sub>k=1…n−2</sub> T[k + 1] · T[n − k]</div><p>Multiply independent region counts, then sum over choices of k. The base case <var>T[2] = 1</var> represents an edge with no region left to partition.</p><p>This is the Catalan recurrence: <var>T[3] = 1, T[4] = 2, T[5] = 5, T[6] = 14</var>.</p>"
    },
    {
      "id": "quadrangles",
      "title": "3. Quadrangulations and convolution",
      "html": "<p>A fixed quadrilateral leaves three subregions. If Q[m] counts partitions into m quadrilaterals, the polygon has 2m + 2 vertices:</p><div class=\"article-formula\">Q[0] = 1<br>Q[m] = Σ<sub>a+b+c=m−1</sub> Q[a] · Q[b] · Q[c]</div><p>Cache the convolution of two subproblems instead of enumerating all triples repeatedly:</p><div class=\"article-formula\">pair[s] = Σ<sub>i=0…s</sub> Q[i] · Q[s − i]<br>Q[m] = Σ<sub>s=0…m−1</sub> pair[s] · Q[m − 1 − s]</div><p>Compute Q[m] before updating pair[m], so all required values are available. An odd number of vertices cannot be partitioned entirely into quadrilaterals; its second answer is zero.</p>"
    },
    {
      "id": "complexity",
      "title": "4. Complexity and modular arithmetic",
      "html": "<p>Both counts take <strong>O(N²)</strong> time and <strong>O(N)</strong> array space. Reduce every step modulo <code>1_000_000_000</code>.</p><p>This modulus is composite. An addition-and-multiplication DP avoids the inverse-existence conditions that arise when using a closed form involving division.</p><p>For <var>N = 6</var>, there are 14 triangulations and 3 quadrangulations.</p>"
    }
  ],
  "tags": [
    "DP",
    "Combinatorics",
    "Polygon partition"
  ]
};
