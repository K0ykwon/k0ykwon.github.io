export default {
  "title": "[BOJ / Python] 17467: N! mod P (2)",
  "summary": "Use Wilson’s theorem to compute the shorter of N! and (P − N − 1)!, then recover N! with a modular inverse when using the tail.",
  "demoTitle": "Comparing factorial intervals",
  "sections": [
    {
      "id": "problem",
      "title": "1. Choose the shorter interval",
      "html": "<p>Given a prime <var>P</var> and <var>0 ≤ N &lt; P</var>, compute <var>N! mod P</var>. Reducing modulo P after each multiplication avoids storing huge integers, but direct computation still takes N iterations.</p><p>For <var>N = P − 1</var>, a prime-number identity gives the answer without nearly P multiplications. Compute only the shorter of <strong>N and P − N − 1</strong>.</p>"
    },
    {
      "id": "idea",
      "title": "2. Wilson’s theorem and the modular inverse",
      "html": "<p>For a prime P, Wilson’s theorem states:</p><div class=\"article-formula\">(P − 1)! ≡ −1 &nbsp;(mod P)</div><p>Set <var>L = P − N − 1</var> and separate the product:</p><div class=\"article-formula\">N! · (N + 1)(N + 2)⋯(P − 1) ≡ −1 &nbsp;(mod P)</div><p>The tail factors are congruent to <var>−L, …, −2, −1</var>, so their product is <var>(−1)<sup>L</sup> · L!</var>.</p><div class=\"article-formula\">N! ≡ (−1)<sup>L+1</sup> · (L!)<sup>−1</sup> &nbsp;(mod P)</div><p>L! has no factor divisible by P, so its inverse exists. Fermat’s little theorem gives <code>pow(factorial, P - 2, P)</code>. The sign is positive for odd L and negative for even L.</p>"
    },
    {
      "id": "implementation",
      "title": "3. Implementation and boundary cases",
      "html": "<p>Multiply <code>min(N, L)</code> factors. Return that product directly for the forward interval, or apply the inverse and sign for the tail. Both branches share the factorial loop.</p><ul><li><var>N = 0</var>: the empty product is <var>0! = 1</var>.</li><li><var>N = P − 1</var>: <var>L = 0</var>, giving <var>−1 mod P</var>.</li><li>With a positive modulus, Python’s <code>%</code> already returns a value in <var>0 … P − 1</var>, so no additional correction by P is needed after applying a negative sign.</li></ul>"
    },
    {
      "id": "complexity",
      "title": "4. Complexity",
      "html": "<p>Time is <strong>O(min(N, P − N − 1) + log P)</strong> and extra space is <strong>O(1)</strong>. The logarithmic inverse term applies to the tail branch. Runtime depends on the shorter interval actually multiplied, not simply on P.</p><p>For input <code>999999936 999999937</code>, the tail length is zero and the result is <code>999999936</code>, without traversing a large factorial.</p>"
    }
  ],
  "tags": [
    "Number theory",
    "Modular arithmetic",
    "Wilson’s theorem"
  ]
};
