export default {
  "title": "Attention Is All You Need",
  "summary": "Work through Q, K, V and causal masking to separate parallel training from sequential generation in the Transformer.",
  "sections": [
    {
      "id": "abstract",
      "title": "Abstract",
      "html": "<p>The Transformer performs sequence transduction around attention without recurrence or convolution. The paper reports translation quality and parallel-training benefits, followed by an application to constituency parsing.</p>"
    },
    {
      "id": "introduction",
      "title": "1. Introduction",
      "html": "<p>An RNN must compute the previous hidden state before moving to the next position. Longer sequences also create longer paths for information to travel. The Transformer reduces this sequential dependence by computing interactions with attention. The original translation model is an <strong>encoder–decoder</strong>, distinct from today’s decoder-only LLMs.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>This review starts with how one position collects information from others. Working through the calculation also separates attention weights from the output representation they produce.</p>"
    },
    {
      "id": "background",
      "title": "2. Background",
      "html": "<p>RNNs pass states along sequence order; CNNs connect distant positions through multiple layers. This section compares those paths and motivates self-attention without recurrence or convolution.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\">[2]</a></sup></p><p>Three quantities matter here: work per layer, the number of sequential operations, and the shortest path between two positions. An RNN passes information through intervening states; self-attention lets a distant position contribute directly within one layer. This shorter path motivates its use for long-range dependencies.</p>"
    },
    {
      "id": "model",
      "title": "3. Model Architecture",
      "html": "<h3>3.1 Encoder and Decoder Stacks</h3><p>Each head uses its own projections. Their outputs are concatenated and projected again. Position-wise FFNs, residual connections and layer normalization are also part of the model. The original paper uses <strong>Post-LN</strong>, placing normalization after each residual sublayer, and adds positional information to the embeddings.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"One Transformer encoder block\"><span>Input + position</span><span>Multi-head attention</span><span>Add &amp; Norm</span><span>FFN</span><span>Add &amp; Norm</span></div><p>An implementation must distinguish encoder self-attention, masked decoder self-attention and encoder–decoder cross-attention. In cross-attention, queries come from a different sequence than the keys and values.</p><h3>3.2 Attention</h3><div data-math=\"display\">\\begin{aligned}Q&amp;=XW_Q,&amp;K&amp;=XW_K,&amp;V&amp;=XW_V\\\\ A&amp;=\\operatorname{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}+M\\right),&amp;&amp;Y=AV\\end{aligned}</div><p>Q, K and V are separate linear projections of <var>X ∈ ℝ<sup>n×d</sup></var>. Each row of A gives one query’s weights over the keys. Softmax runs along the key dimension, so each row sums to one. The weighted sum of values produces an output vector.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>For example, weights <code>[0.75, 0.25]</code> applied to values <code>[2, 0]</code> and <code>[0, 4]</code> produce <code>[1.5, 1]</code>. This mixes two values; it does not select only the token with the largest weight.</p><p>For independent, unit-variance components, the variance of a dot product grows with dimension. Dividing by √d<sub>k</sub> counteracts large scores that would make softmax excessively sharp.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><h3>3.3 Position-wise Feed-Forward Networks</h3><p>The same two linear transformations and ReLU act at each position. Attention mixes positions; the FFN transforms features within each position.</p><h3>3.4 Embeddings and Softmax</h3><p>Embeddings map tokens into vectors; the output projection and softmax produce vocabulary probabilities. The paper shares embedding and output-projection weights.</p><h3>3.5 Positional Encoding</h3><p>Sinusoidal position representations are added to embeddings. Position order is not supplied automatically by the weighted averaging operation.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><h3>Shapes and masking</h3><p>For equal-length self-attention, Q and K have shape <span data-math=\"inline\">n\\times d_k</span> and V has shape <span data-math=\"inline\">n\\times d_v</span>. Scores and weights A are therefore <span data-math=\"inline\">n\\times n</span>, while Y is <span data-math=\"inline\">n\\times d_v</span>. The decoder adds this mask at future positions:</p><div data-math=\"display\">M_{ij}=\\begin{cases}0,&amp;j\\le i\\\\-\\infty,&amp;j&gt;i\\end{cases}</div><p>A negative-infinity score becomes zero probability after softmax. Encoder self-attention does not use this causal mask. Cross-attention can have a rectangular score matrix: query rows index the target sequence, while key and value rows index the source.</p><h3>Heads, FFNs and position</h3><div data-math=\"display\">\\begin{aligned}\\operatorname{head}_i&amp;=\\operatorname{Attention}(QW_i^Q,KW_i^K,VW_i^V)\\\\\\operatorname{MultiHead}(Q,K,V)&amp;=\\operatorname{Concat}(\\operatorname{head}_1,\\ldots,\\operatorname{head}_h)W^O\\\\\\operatorname{FFN}(x)&amp;=\\max(0,xW_1+b_1)W_2+b_2\\end{aligned}</div><p>Heads compute relationships in separate projection spaces. The output projection mixes their concatenated representations back into the model dimension. The base configuration uses six encoder and decoder layers, width 512, eight heads and an FFN inner width of 2,048. FFN parameters are shared across positions, rather than across different layers.</p><div data-math=\"display\">\\begin{aligned}\\operatorname{PE}(pos,2i)&amp;=\\sin\\!\\left(\\frac{pos}{10000^{2i/d_{\\rm model}}}\\right)\\\\\\operatorname{PE}(pos,2i+1)&amp;=\\cos\\!\\left(\\frac{pos}{10000^{2i/d_{\\rm model}}}\\right)\\end{aligned}</div><p>Here pos is the position and i indexes a sine–cosine pair. Multiple frequencies distinguish positions. The paper also compares learned position embeddings and finds similar results.</p>"
    },
    {
      "id": "why",
      "title": "4. Why Self-Attention",
      "html": "<p>During training, previous tokens in the target sentence are known. Shifting the targets and masking future positions lets the model compute predictions at all positions in parallel. During generation, the next token is still unknown, so ordinary autoregressive inference proceeds one token at a time.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>Attention connects distant positions directly within a layer. Its score matrix, however, has <var>n×n</var> entries. Increasing sequence length from 1,024 to 4,096 grows one head’s matrix from about one million to about 16.8 million entries: a 16-fold increase. This quadratic dependence is a recurring issue in long-context models.</p>"
    },
    {
      "id": "training",
      "title": "5. Training",
      "html": "<p>This section covers data and batching, hardware and schedules, optimization and regularization. Training uses Adam with warm-up and a decaying learning rate, dropout and label smoothing. These conditions accompany the architecture in the reported results.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><div data-math=\"display\">\\operatorname{lr}(s)=d_{\\rm model}^{-1/2}\\min\\!\\left(s^{-1/2},\\;s\\,w^{-3/2}\\right)</div><p>The step is s and the warm-up length is w; the paper uses w=4,000. The second term gives a linear increase initially, then the first term produces inverse-square-root decay. They agree at the boundary, so the schedule does not jump.</p><p>Label smoothing softens a target that would otherwise put all probability on the correct token. Translation quality and perplexity can consequently move in different directions. Reproducing the model also requires its dropout and residual configuration.</p>"
    },
    {
      "id": "results",
      "title": "6. Results",
      "html": "<p>The paper reports 28.4 BLEU on WMT 2014 English-to-German and 41.8 BLEU on English-to-French (§6). These scores belong to the paper’s translation datasets and evaluation settings.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>Sections 6.1–6.3 examine translation, model variations and constituency parsing, respectively, moving from the main task to architectural choices and another structured prediction task.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>The ablations in §6.2 vary head count, key dimension, model width and dropout. They help separate the contributions of individual design choices. BLEU comparisons also need model size, single-model versus ensemble settings, and training conditions.</p>"
    },
    {
      "id": "conclusion",
      "title": "7. Conclusion",
      "html": "<p>The conclusion summarizes sequence transduction without recurrence or convolution and points toward image, audio, video and restricted-attention extensions.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
    },
    {
      "id": "summary",
      "title": "Summary",
      "html": "<p>The Transformer reduces sequential training dependencies through attention matrices. Queries and keys determine weights used to mix values, while FFNs, position information and normalization complete the model. Parallel training does not eliminate sequential autoregressive generation.</p>"
    }
  ],
  "tags": [
    "Transformer",
    "Attention",
    "NLP"
  ],
  "sourceText": [
    {
      "title": "Paper · Attention Is All You Need",
      "detail": "§3 architecture and attention, §4 complexity, §6 translation results. arXiv v7 consulted."
    },
    {
      "title": "Author overview · Google Research",
      "detail": "Jakob Uszkoreit, 2017-08-31. Sequential computation, information flow and translation decoding."
    }
  ],
  "demos": [
    {
      "id": "demo",
      "type": "review-attention",
      "title": "Q, K, V and causal masking",
      "after": "model"
    },
    {
      "id": "position-encoding",
      "type": "review-position",
      "title": "Positional encoding frequencies",
      "after": "model"
    }
  ]
};
