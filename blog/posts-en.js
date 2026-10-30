export const ENGLISH_POSTS = {
  "attention-is-all-you-need": {
    "title": "Attention Is All You Need — Reading Context Without Recurrence",
    "summary": "Work through Q, K, V and causal masking to separate parallel training from sequential generation in the Transformer.",
    "demoTitle": "Q, K, V and causal masking",
    "sections": [
      {
        "id": "question",
        "title": "1. Must reading order determine computation order?",
        "html": "<p>An RNN must compute the previous hidden state before moving to the next position. Longer sequences also create longer paths for information to travel. The Transformer reduces this sequential dependence by computing interactions with attention. The original translation model is an <strong>encoder–decoder</strong>, distinct from today’s decoder-only LLMs.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>This review starts with how one position collects information from others. Working through the calculation also separates attention weights from the output representation they produce.</p>"
      },
      {
        "id": "attention",
        "title": "2. Queries compare keys; the weights combine values",
        "html": "<div class=\"article-formula\">Q = XW<sub>Q</sub>, K = XW<sub>K</sub>, V = XW<sub>V</sub><br>A = softmax(QKᵀ / √d<sub>k</sub>)<br>Y = AV</div><p>Q, K and V are separate linear projections of <var>X ∈ ℝ<sup>n×d</sup></var>. Each row of A gives one query’s weights over the keys. Softmax runs along the key dimension, so each row sums to one. The weighted sum of values produces an output vector.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>For example, weights <code>[0.75, 0.25]</code> applied to values <code>[2, 0]</code> and <code>[0, 4]</code> produce <code>[1.5, 1]</code>. This mixes two values; it does not select only the token with the largest weight.</p><p>For independent, unit-variance components, the variance of a dot product grows with dimension. Dividing by √d<sub>k</sub> counteracts large scores that would make softmax excessively sharp.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p>"
      },
      {
        "id": "architecture",
        "title": "3. The model contains more than attention",
        "html": "<p>Each head uses its own projections. Their outputs are concatenated and projected again. Position-wise FFNs, residual connections and layer normalization are also part of the model. The original paper uses <strong>Post-LN</strong>, placing normalization after each residual sublayer, and adds positional information to the embeddings.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"One Transformer encoder block\"><span>Input + position</span><span>Multi-head attention</span><span>Add &amp; Norm</span><span>FFN</span><span>Add &amp; Norm</span></div><p>An implementation must distinguish encoder self-attention, masked decoder self-attention and encoder–decoder cross-attention. In cross-attention, queries come from a different sequence than the keys and values.</p>"
      },
      {
        "id": "parallel",
        "title": "4. Parallel training can coexist with sequential generation",
        "html": "<p>During training, previous tokens in the target sentence are known. Shifting the targets and masking future positions lets the model compute predictions at all positions in parallel. During generation, the next token is still unknown, so ordinary autoregressive inference proceeds one token at a time.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>Attention connects distant positions directly within a layer. Its score matrix, however, has <var>n×n</var> entries. Increasing sequence length from 1,024 to 4,096 grows one head’s matrix from about one million to about 16.8 million entries: a 16-fold increase. This quadratic dependence is a recurring issue in long-context models.</p>"
      },
      {
        "id": "results",
        "title": "5. Translation results and what I take from them",
        "html": "<p>The paper reports 28.4 BLEU on WMT 2014 English-to-German and 41.8 BLEU on English-to-French (§6). These scores belong to the paper’s translation datasets and evaluation settings.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p><strong>What stands out to me is the joint redesign of information paths and computation schedules.</strong> Beyond using attention, the model moves position-wise computation out of a recurrent chain and into matrix operations. CALM takes a different next step: changing the unit an autoregressive model predicts.</p><p><a href=\"#blog/calm-continuous-autoregressive-language-models\" data-section=\"blog\" data-post=\"calm-continuous-autoregressive-language-models\">Read the CALM review →</a></p>"
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
    ]
  },
  "tinyvit": {
    "title": "TinyViT — Bringing Large-Model Pretraining to Small Models",
    "summary": "How sparse soft labels, reproducible augmentation and compact architectures work together, with accuracy and compute compared across input resolutions.",
    "demoTitle": "Reconstructing probabilities from the top entries",
    "sections": [
      {
        "id": "question",
        "title": "1. Is more data enough for a small model?",
        "html": "<p>TinyViT combines <strong>pretraining distillation</strong> with compact vision architectures. Rather than running the teacher at every student-training step, it stores teacher predictions and augmentation information in advance for reuse.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>Two costs matter here: the size of the deployed student and the repeated cost of running its large teacher. Even a small student may be unable to use a large batch when the teacher occupies most GPU memory.</p>"
      },
      {
        "id": "cache",
        "title": "2. A prediction cache must match the augmented image",
        "html": "<div class=\"review-flow\" aria-label=\"TinyViT pretraining distillation\"><span>Image + augmentation</span><span>Teacher inference</span><span>Cache sparse labels</span><span>Replay augmentation</span><span>Train student</span></div><p>A teacher’s crop and a student’s crop can differ even when they come from the same original image. The cache therefore retains the information needed to reproduce the corresponding augmentation, alongside the prediction. Equation (1) minimizes cross-entropy between the teacher’s soft label and the student output.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>Imagine a cat on the left of an image and a car on the right. If the cached prediction describes the cat crop but the student sees the car crop, the supervision is mismatched regardless of how quickly the cache loads. Augmentation replay is therefore part of the training signal’s correctness.</p>"
      },
      {
        "id": "sparse",
        "title": "3. Preserve large probabilities and share the remainder",
        "html": "<p>Instead of storing all <var>C</var> class probabilities, retain the top <var>k</var> values and their indices. Distribute the remaining probability mass uniformly among the omitted classes. This is the reconstruction rule from Equation (2).<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><div class=\"article-formula\">p̃<sub>c</sub> = p<sub>c</sub> &nbsp; (top k entries)<br>p̃<sub>c</sub> = (1 − Σ<sub>i∈top-k</sub> p<sub>i</sub>) / (C − k) &nbsp; (other entries)</div><p>Unlike a hard label, this preserves relationships among the large probabilities while approximating the small ones. It also differs from renormalizing only the top entries and setting all others to zero.</p><p>The official guide describes generating teacher outputs in parallel across epoch ranges and checking saved labels against recomputed predictions. A cache can then be reused across multiple student experiments.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"Reference 3\">[3]</a></sup></p>"
      },
      {
        "id": "architecture",
        "title": "4. Contract the architecture to fit the budget",
        "html": "<p>The model has four stages with progressively lower spatial resolution. MBConv blocks are used early and for downsampling, followed by Transformer blocks in the last three stages. Progressive contraction searches for smaller candidates under parameter-count and throughput constraints.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>When examining an implementation, spatial resolution and channel width matter alongside parameter count. Two models with the same number of layers may have very different costs depending on what they compute at the high-resolution stages.</p>"
      },
      {
        "id": "results",
        "title": "5. Higher resolution has a measurable cost",
        "html": "<p>These configurations come from the official Model Zoo. Each is pretrained on ImageNet-22k (21,841 classes), then fine-tuned on ImageNet-1k. Accuracy is ImageNet-1k top-1; MACs count multiply–accumulate operations per image.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>Model</th><th>Input</th><th>Acc@1</th><th>MACs</th></tr></thead><tbody><tr><td>TinyViT-5M</td><td>224²</td><td>80.7%</td><td>1.3G</td></tr><tr><td>TinyViT-21M</td><td>224²</td><td>84.8%</td><td>4.3G</td></tr><tr><td>TinyViT-21M-512</td><td>512²</td><td>86.5%</td><td>27.0G</td></tr></tbody></table></div><p>Raising the 21M model’s input from 224 to 512 improves accuracy by 1.7 percentage points while increasing MACs by about 6.3 times. That arithmetic does not imply an identical latency ratio: hardware and batch size also affect measured speed.</p>"
      },
      {
        "id": "takeaway",
        "title": "6. Optimize more than the deployed model",
        "html": "<p><strong>The reusable training pipeline is the idea I would take from TinyViT.</strong> Knowledge from the teacher becomes a stored supervision signal instead of something recalculated for every student. This is valuable when repeatedly comparing compact models.</p><p>For my own experiments, I would first check that teacher inputs and augmentations are reproduced correctly, then measure storage, cache-read bandwidth and student-training time. The useful comparison is the total cost of training several students, alongside the speed of an individual step.</p>"
      }
    ],
    "tags": [
      "Vision Transformer",
      "Knowledge distillation",
      "Efficient AI"
    ],
    "sourceText": [
      {
        "title": "Paper · TinyViT",
        "detail": "§3.1 fast distillation and Equation (2); §3.2 architecture."
      },
      {
        "title": "Official implementation · Microsoft Cream / TinyViT",
        "detail": "Model Zoo: pretraining data, input resolution, Acc@1 and MACs."
      },
      {
        "title": "Official teacher-logit storage guide",
        "detail": "Epoch-range cache generation, parallel saving and validation."
      }
    ]
  },
  "calm-continuous-autoregressive-language-models": {
    "title": "CALM — Predicting a Vector for a Token Chunk",
    "summary": "Connect the token-chunk autoencoder, energy-based generative head and discrete input-feedback path. Reconstruction accuracy and generation quality answer different questions.",
    "demoTitle": "Token chunks and generation steps",
    "sections": [
      {
        "id": "question",
        "title": "1. What if each step predicted more information?",
        "html": "<p>CALM here means <em>Continuous Autoregressive Language Models</em>. It generates a continuous vector representing <var>K</var> tokens, with an autoencoder connecting chunks and vectors. K=3 in Figure 1 is an illustration; the main experiments use a K=4 configuration.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>This changes the number of units to generate, rather than merely accelerating a Transformer’s matrix operations. Each step also introduces reconstruction and compression work, so K times fewer steps should not be read as a guaranteed K-fold latency improvement.</p>"
      },
      {
        "id": "autoencoder",
        "title": "2. Reconstructable does not automatically mean easy to generate",
        "html": "<div class=\"article-formula\">z<sub>i</sub> = Enc(x<sub>(i−1)K+1:iK</sub>)<br>x̂<sub>(i−1)K+1:iK</sub> = Dec(z<sub>i</sub>)</div><p>The autoencoder preserves information in a token chunk. The author’s final configuration maps K=4 tokens to a 128-dimensional vector, with token-level reconstruction accuracy above 99.9%. Variational regularization and dropout make the latent space more robust to small perturbations.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>Accurate reconstruction alone does not ensure that predicting the next vector is easy. Imagine assigning each token chunk a distant, arbitrary point: decoding the point could work perfectly, while generating an appropriate next point from context remains difficult. Reconstruction and a useful generative geometry are separate design goals.</p>"
      },
      {
        "id": "head",
        "title": "3. Generate conditional samples instead of an average vector",
        "html": "<p>MSE regression may predict an average of several plausible continuations. CALM’s head samples <var>z = G(h, ε)</var> from a context representation h and random noise ε. Its energy score uses distances to the target as well as distances between generated samples.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><div class=\"article-formula\">Basic energy loss to minimize<br>2 E‖Z − z*‖ − E‖Z − Z′‖</div><p>Z and Z′ are independent samples for the same context. The first term pulls predictions toward the observation; the second discourages collapsing every sample to the same point. Their combination distinguishes distribution learning from predicting only a conditional mean.</p><p>The official repository also includes diffusion and flow-matching training scripts. The default energy head generates a sample in one call, whereas those alternatives use iterative sampling.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"Reference 3\">[3]</a></sup></p>"
      },
      {
        "id": "loop",
        "title": "4. The predicted vector is decoded before feeding back",
        "html": "<div class=\"review-flow\" aria-label=\"CALM autoregressive feedback path\"><span>Previous token chunks</span><span>Input compression + Transformer</span><span>Noise + generative head</span><span>Next vector z</span><span>Decoder → K tokens</span></div><p>The author describes decoding a predicted vector back to tokens, then embedding and compressing those tokens as the next input. The output space is continuous, but the feedback path uses discrete tokens.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>This is more than grouping the embeddings of an existing LLM. The input unit, output head, autoencoder and training objective change together. Adding an autoencoder in front of an ordinary pretrained LLM does not produce the same system.</p>"
      },
      {
        "id": "evaluation",
        "title": "5. How is performance compared?",
        "html": "<p>The paper introduces the sample-based BrierLM metric (higher is better) and compares language-model quality against computational cost. Its autoencoder ablations also show that similar, high reconstruction accuracy can coexist with different downstream scores as latent dimension and regularization change.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>Parameter count, training FLOPs, inference FLOPs and measured throughput describe different resources. Counting steps helps explain the architecture, while final generation quality depends on learning the conditional vector distribution. The calculator below considers only step count and an assumed cost per step.</p>"
      },
      {
        "id": "connection",
        "title": "6. A connection to Nested Learning",
        "html": "<p><strong>CALM changes the unit being predicted; Nested Learning changes the timescales at which states learn.</strong> These are different design axes. One possible direction is a memory that updates over chunk-level representations. This is my follow-up idea, not an experimental result established by the two papers.</p><p>I would first keep the autoencoder fixed and test whether a rapidly adapting memory improves prediction across chunks. Measuring reconstruction accuracy, contextual prediction and decoded generation separately would help locate where any improvement occurs.</p><p><a href=\"#blog/nested-learning\" data-section=\"blog\" data-post=\"nested-learning\">Read the Nested Learning review →</a></p>"
      }
    ],
    "tags": [
      "Language modeling",
      "Latent representation",
      "Efficient AI"
    ],
    "sourceText": [
      {
        "title": "Paper · Continuous Autoregressive Language Models",
        "detail": "v1, 2025-10-31. §2 autoencoder, §3 generation, §4 BrierLM, §7 experiments and ablations."
      },
      {
        "title": "Author overview · Chenze Shao",
        "detail": "Autoencoder, energy score, discrete input feedback and computational comparisons."
      },
      {
        "title": "Official implementation · shaochenze/calm",
        "detail": "Autoencoder, Energy Transformer, evaluation, sampling and alternative-head training scripts."
      }
    ]
  },
  "nested-learning": {
    "title": "Nested Learning — From Layer Depth to Learning Timescales",
    "summary": "Read models and optimizers as learning problems with different update rates, connecting momentum, Continuum Memory Systems, self-modifying Titans and HOPE.",
    "demoTitle": "Different update periods",
    "sections": [
      {
        "id": "question",
        "title": "1. A joint view of models and learning rules",
        "html": "<p>Nested Learning (NL) represents a model as interconnected learning problems. Each has its own context flow, state, objective and update rate. A learning level is distinct from a layer index: levels organize components by what they update and how frequently they do so.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>In ordinary inference, the context used by attention keeps changing while pretrained weights stay fixed. These components belong to the same model, but retain information differently and change at different rates. NL uses that distinction as an architectural design axis.</p>"
      },
      {
        "id": "optimizer",
        "title": "2. An optimizer remembers previous inputs too",
        "html": "<div class=\"article-formula\">m<sub>t</sub> = βm<sub>t−1</sub> + (1−β)g<sub>t</sub><br>θ<sub>t+1</sub> = θ<sub>t</sub> − ηm<sub>t</sub></div><p>This is a simple normalized-momentum example. The state m retains past gradient information; a larger β extends its influence. An optimizer can therefore be read as a memory that accumulates inputs and changes later updates.</p><p>The authors use the associative-memory perspective to discuss deep optimizers with more expressive objectives and internal learning rules. The useful step is explicitly formulating how optimizer states learn, beyond simply renaming them as memory.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p>"
      },
      {
        "id": "cms",
        "title": "3. Fill the space between fast and slow memory",
        "html": "<p>A Continuum Memory System (CMS) connects MLP memories updated at different periods. In Equations (30)–(31), each block updates at times determined by its own chunk size. HOPE combines a self-modifying Titans-style sequence module with CMS.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"Two components of HOPE\"><span>Context input</span><span>Self-modifying memory<br>Sequence interactions</span><span>CMS<br>MLPs with multiple update periods</span><span>Output</span></div><p>The timeline uses illustrative periods of 1, 4 and 16 inputs. It distinguishes states updated at every input from states updated after accumulating several inputs; it does not reproduce HOPE training or memory accuracy.</p>"
      },
      {
        "id": "self-modification",
        "title": "4. What does self-modifying change?",
        "html": "<p>The Google Research overview presents Hope as a variant of Titans, adapting memory and elements involved in its updates to the context. CMS supplies multiple storage levels between immediate working context and longer-lived knowledge.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>In an implementation, I would distinguish <strong>states adapted within the current sequence</strong> from <strong>initial states and rules learned across training sequences</strong>. Writing down which parameters receive gradients from which loss makes these two uses of “update” easier to separate.</p>"
      },
      {
        "id": "results",
        "title": "5. HOPE’s language-model experiments",
        "html": "<p>The following entries are from Table 1 of the conference paper, at 1.3B parameters and 100B training tokens. Wiki is WikiText perplexity, where lower is better. Avg. summarizes the commonsense-reasoning tasks in the table.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>Model</th><th>Wiki ppl ↓</th><th>Reasoning avg. ↑</th></tr></thead><tbody><tr><td>Transformer++</td><td>18.53</td><td>52.25</td></tr><tr><td>Titans (LMM)</td><td>15.60</td><td>56.82</td></tr><tr><td>HOPE</td><td>15.11</td><td>57.23</td></tr></tbody></table></div><p>HOPE improves both selected metrics in this comparison, although rankings differ across individual tasks. The authors also describe evaluations of long-context retrieval, continual learning and knowledge incorporation.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p>"
      },
      {
        "id": "takeaway",
        "title": "6. Design representations and update rules together",
        "html": "<p><strong>The useful design question is what information stays where, and for how long.</strong> A fast module can handle recent context while slower modules reflect longer-term changes. This provides another axis besides parameter count and layer depth.</p><p>For a connection with CALM, I would first specify where chunk-level latent representations are stored, which contexts train that storage, and how often it updates. Testing prediction units and update periods separately before combining them would help distinguish their effects. This remains a follow-up experimental idea.</p><p><a href=\"#blog/calm-continuous-autoregressive-language-models\" data-section=\"blog\" data-post=\"calm-continuous-autoregressive-language-models\">Read the CALM review →</a></p>"
      }
    ],
    "tags": [
      "Continual learning",
      "Memory",
      "Optimization"
    ],
    "sourceText": [
      {
        "title": "Paper · NeurIPS 2025",
        "detail": "§2 learning levels, §3 CMS and HOPE, Table 1 language-model results."
      },
      {
        "title": "Author overview · Google Research",
        "detail": "2025-11-07. Deep optimizers, CMS, Hope and evaluation tasks."
      },
      {
        "title": "Extended manuscript · arXiv:2512.24695",
        "detail": "Extended version linked by the conference paper. Numerical results in this review use the conference version’s Table 1."
      }
    ]
  },
  "boj-python-17467-n-mod-p-2": {
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
  },
  "boj-python-2392-polygon-partition": {
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
  },
  "boj-python-1126-equal-towers": {
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
  },
  "boj-python-1799-bishops": {
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
  },
  "boj-python-9663-n-queens": {
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
  }
};
