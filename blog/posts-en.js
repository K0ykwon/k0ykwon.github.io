export const ENGLISH_POSTS = {
  "attention-is-all-you-need": {
    "title": "Attention Is All You Need",
    "summary": "Work through Q, K, V and causal masking to separate parallel training from sequential generation in the Transformer.",
    "demoTitle": "Q, K, V and causal masking",
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
    "demoAfter": "model"
  },
  "tinyvit": {
    "title": "TinyViT: Fast Pretraining Distillation for Small Vision Transformers",
    "summary": "How sparse soft labels, reproducible augmentation and compact architectures work together, with accuracy and compute compared across input resolutions.",
    "demoTitle": "Reconstructing probabilities from the top entries",
    "sections": [
      {
        "id": "abstract",
        "title": "Abstract",
        "html": "<p>TinyViT combines compact vision transformers with fast pretraining distillation. Sparse teacher predictions are cached for student reuse, allowing small models to benefit from large-scale pretraining data.</p>"
      },
      {
        "id": "introduction",
        "title": "1. Introduction",
        "html": "<p>TinyViT combines <strong>pretraining distillation</strong> with compact vision architectures. Rather than running the teacher at every student-training step, it stores teacher predictions and augmentation information in advance for reuse.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>Two costs matter here: the size of the deployed student and the repeated cost of running its large teacher. Even a small student may be unable to use a large batch when the teacher occupies most GPU memory.</p>"
      },
      {
        "id": "related",
        "title": "2. Related Work",
        "html": "<p>The paper connects large-scale pretraining, small vision transformers and knowledge distillation. Its approach transfers pretrained teacher knowledge to small students and can complement quantization or pruning.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>Compression can reduce weights or operations after a model has been trained. TinyViT instead improves pretraining of the small student itself. Teacher probabilities convey which classes resemble one another as well as the most likely class. Architecture efficiency and the information in soft targets should therefore be examined separately.</p>"
      },
      {
        "id": "method",
        "title": "3. TinyViT",
        "html": "<h3>3.1 Fast Pretraining Distillation</h3><div class=\"review-flow\" aria-label=\"TinyViT pretraining distillation\"><span>Image + augmentation</span><span>Teacher inference</span><span>Cache sparse labels</span><span>Replay augmentation</span><span>Train student</span></div><p>A teacher’s crop and a student’s crop can differ even when they come from the same original image. The cache therefore retains the information needed to reproduce the corresponding augmentation, alongside the prediction. Equation (1) minimizes cross-entropy between the teacher’s soft label and the student output.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>Imagine a cat on the left of an image and a car on the right. If the cached prediction describes the cat crop but the student sees the car crop, the supervision is mismatched regardless of how quickly the cache loads. Augmentation replay is therefore part of the training signal’s correctness.</p><p>Instead of storing all <var>C</var> class probabilities, retain the top <var>k</var> values and their indices. Distribute the remaining probability mass uniformly among the omitted classes. This is the reconstruction rule from Equation (2).<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><div data-math=\"display\">\\widetilde p_c=\\begin{cases}p_c,&amp;c\\in\\mathcal K\\\\\\dfrac{1-\\sum_{i\\in\\mathcal K}p_i}{C-k},&amp;c\\notin\\mathcal K\\end{cases}\\qquad (k&lt;C)</div><p>Unlike a hard label, this preserves relationships among the large probabilities while approximating the small ones. It also differs from renormalizing only the top entries and setting all others to zero.</p><p>The official guide describes generating teacher outputs in parallel across epoch ranges and checking saved labels against recomputed predictions. A cache can then be reused across multiple student experiments.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"Reference 3\">[3]</a></sup></p><h3>3.2 Model Architectures</h3><p>The model has four stages with progressively lower spatial resolution. MBConv blocks are used early and for downsampling, followed by Transformer blocks in the last three stages. Progressive contraction searches for smaller candidates under parameter-count and throughput constraints.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>When examining an implementation, spatial resolution and channel width matter alongside parameter count. Two models with the same number of layers may have very different costs depending on what they compute at the high-resolution stages.</p><h3>The distillation loss and its cache</h3><div data-math=\"display\">\\mathcal L_{\\rm distill}(x)=-\\sum_{c=1}^{C}\\widetilde p_c(a(x))\\log q_c(a(x))</div><p>The augmentation a is replayed from the cache; <span data-math=\"inline\">\\widetilde p</span> is the reconstructed teacher distribution and q is the student distribution. With fixed teacher targets, this cross-entropy has the same optimum as teacher-to-student KL divergence: the teacher-entropy term does not depend on student parameters.</p><p>As an illustration, with C=5 and top probabilities 0.60 and 0.25, the remaining three classes receive 0.05 each. The distribution still sums to one. When k=C, the full distribution is stored directly rather than using a zero denominator. Sparsification trades the teacher’s fine distinctions among small probabilities for lower storage and transfer costs.</p><p>Teacher inference is still required to build the cache. Savings inside student training should be distinguished from the total cost of an experiment. Window-attention latency also depends on resolution, window size, device and implementation.</p>"
      },
      {
        "id": "analysis",
        "title": "4. Analysis and Discussions",
        "html": "<p>This section examines hard samples and class relationships as factors limiting small models. It compares pretraining on original data, a cleaned subset and teacher soft labels, separating data quantity from supervision quality.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>Hard labels treat even similar classes as simply correct or incorrect. Soft labels can encode degrees of similarity, giving a small model a less abrupt target. This does not imply that every difficult sample is unhelpful or every soft target is better. The paper tests the hypothesis through controlled comparisons within its chosen data and teacher settings.</p>"
      },
      {
        "id": "experiments",
        "title": "5. Experiments",
        "html": "<p>Sections 5.1–5.4 cover implementation, ablations, ImageNet results and transfer learning. The evaluations separate pipeline and architectural choices before considering classification and transfer tasks.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>These configurations come from the official Model Zoo. Each is pretrained on ImageNet-22k (21,841 classes), then fine-tuned on ImageNet-1k. Accuracy is ImageNet-1k top-1; MACs count multiply–accumulate operations per image.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>Model</th><th>Input</th><th>Acc@1</th><th>MACs</th></tr></thead><tbody><tr><td>TinyViT-5M</td><td>224²</td><td>80.7%</td><td>1.3G</td></tr><tr><td>TinyViT-21M</td><td>224²</td><td>84.8%</td><td>4.3G</td></tr><tr><td>TinyViT-21M-512</td><td>512²</td><td>86.5%</td><td>27.0G</td></tr></tbody></table></div><p>Raising the 21M model’s input from 224 to 512 improves accuracy by 1.7 percentage points while increasing MACs by about 6.3 times. That arithmetic does not imply an identical latency ratio: hardware and batch size also affect measured speed.</p><p>Changing the 21M model’s input from 224 to 512 leaves its parameter count unchanged but increases spatial computation. The accuracy gain is therefore accompanied by extra work. Deployment choices should consider accuracy, MACs, memory and measured latency; isolating the training method calls for comparing the same student with and without distillation.</p>"
      },
      {
        "id": "conclusions",
        "title": "6. Conclusions",
        "html": "<p>The paper concludes that small vision models can benefit from large-model knowledge and large-scale pretraining, combining fast distillation with constrained model contraction.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "summary",
        "title": "Summary",
        "html": "<p>TinyViT reduces student-training cost alongside deployment size. Teacher probabilities and augmentation information are cached for reuse; top entries and residual mass reconstruct the supervision. Model size, resolution and the training pipeline should be compared together.</p>"
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
    ],
    "demoAfter": "method"
  },
  "calm-continuous-autoregressive-language-models": {
    "title": "Continuous Autoregressive Language Models",
    "summary": "Connect the token-chunk autoencoder, energy-based generative head and discrete input-feedback path. Reconstruction accuracy and generation quality answer different questions.",
    "demoTitle": "Token chunks and generation steps",
    "sections": [
      {
        "id": "abstract",
        "title": "Abstract",
        "html": "<p>CALM represents K tokens with one continuous vector, changing next-token prediction into next-vector prediction. It combines an autoencoder with likelihood-free generation, evaluation and sampling.</p>"
      },
      {
        "id": "introduction",
        "title": "1. Introduction",
        "html": "<p>CALM here means <em>Continuous Autoregressive Language Models</em>. It generates a continuous vector representing <var>K</var> tokens, with an autoencoder connecting chunks and vectors. K=3 in Figure 1 is an illustration; the main experiments use a K=4 configuration.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>This changes the number of units to generate, rather than merely accelerating a Transformer’s matrix operations. Each step also introduces reconstruction and compression work, so K times fewer steps should not be read as a guaranteed K-fold latency improvement.</p>"
      },
      {
        "id": "autoencoder",
        "title": "2. Autoencoder",
        "html": "<div data-math=\"display\">\\begin{aligned}z_i&amp;=\\operatorname{Enc}(x_{(i-1)K+1:iK})\\\\\\widehat x_{(i-1)K+1:iK}&amp;=\\operatorname{Dec}(z_i)\\end{aligned}</div><p>The autoencoder preserves information in a token chunk. The author’s final configuration maps K=4 tokens to a 128-dimensional vector, with token-level reconstruction accuracy above 99.9%. Variational regularization and dropout make the latent space more robust to small perturbations.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>Accurate reconstruction alone does not ensure that predicting the next vector is easy. Imagine assigning each token chunk a distant, arbitrary point: decoding the point could work perfectly, while generating an appropriate next point from context remains difficult. Reconstruction and a useful generative geometry are separate design goals.</p><p>Sections 2.1 and 2.2 address high-fidelity reconstruction and robust representations: recovering tokens and creating a stable space for generation are related but separate goals.</p><h3>A space for reconstruction and generation</h3><div data-math=\"display\">\\mathcal L_{\\rm ae}=-\\sum_{j=1}^{K}\\log p_{\\rm dec}(x_j\\mid z)</div><p>This cross-entropy reconstructs the original token at each of K positions. The encoder combines position-wise features into one latent; the decoder expands it back into K positions. Chunks are compressed independently without surrounding context, leaving dependencies between chunks to the language model.</p><p>The paper can achieve high reconstruction accuracy with ten dimensions at K=4, but uses 128 dimensions, variational regularization and dropout for a robust generative representation. Reliable decoding from slightly imperfect predictions matters more than maximal compression alone. Dropout is used during autoencoder training and disabled during subsequent language-model training and inference.</p>"
      },
      {
        "id": "model",
        "title": "3. Likelihood-Free Language Modeling",
        "html": "<p>MSE regression may predict an average of several plausible continuations. CALM’s head samples <var>z = G(h, ε)</var> from a context representation h and random noise ε. Its energy score uses distances to the target as well as distances between generated samples.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><div data-math=\"display\">\\mathcal L_{\\rm energy}=2\\,\\mathbb E\\lVert Z-z^*\\rVert_2-\\mathbb E\\lVert Z-Z^{\\prime}\\rVert_2</div><p>Z and Z′ are independent samples for the same context. The first term pulls predictions toward the observation; the second discourages collapsing every sample to the same point. Their combination distinguishes distribution learning from predicting only a conditional mean.</p><p>The official repository also includes diffusion and flow-matching training scripts. The default energy head generates a sample in one call, whereas those alternatives use iterative sampling.<sup><a href=\"#SOURCE3\" data-review-ref=\"3\" aria-label=\"Reference 3\">[3]</a></sup></p><div class=\"review-flow\" aria-label=\"CALM autoregressive feedback path\"><span>Previous token chunks</span><span>Input compression + Transformer</span><span>Noise + generative head</span><span>Next vector z</span><span>Decoder → K tokens</span></div><p>The author describes decoding a predicted vector back to tokens, then embedding and compressing those tokens as the next input. The output space is continuous, but the feedback path uses discrete tokens.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>This is more than grouping the embeddings of an existing LLM. The input unit, output head, autoencoder and training objective change together. Adding an autoencoder in front of an ordinary pretrained LLM does not produce the same system.</p><h3>Point regression versus distribution learning</h3><div data-math=\"display\">\\widetilde z_i=G_\\theta(h_{i-1},\\varepsilon),\\qquad\\varepsilon\\sim\\mathcal N(0,I)</div><p>Different noise can produce different next vectors under the same context h. If valid outcomes form two separated clusters, an MSE point predictor can land between them in a low-density region. Energy loss instead aims to match a distribution of samples.</p><p>The energy expression above uses one observed target and exponent one. In training, the paper draws N=8 model samples and M=100 target samples from the autoencoder posterior to estimate the expectations. Only distinct model-sample pairs enter the second term. Multiple training samples should be distinguished from generating one vector with a single head call at inference.</p>"
      },
      {
        "id": "evaluation",
        "title": "4. Likelihood-Free LM Evaluation",
        "html": "<p>The paper introduces the sample-based BrierLM metric (higher is better) and compares language-model quality against computational cost. Its autoencoder ablations also show that similar, high reconstruction accuracy can coexist with different downstream scores as latent dimension and regularization change.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>Parameter count, training FLOPs, inference FLOPs and measured throughput describe different resources. Counting steps helps explain the architecture, while final generation quality depends on learning the conditional vector distribution. The calculator below considers only step count and an assumed cost per step.</p><p>Sections 4.1 and 4.2 cover evaluation principles and BrierLM, combining n-gram Brier-based scores for sample-based comparison.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>For a distribution q over possible n-grams under a context, the Brier score rewards probability on the observation while its squared-sum term discourages assigning high probability indiscriminately. This is a <strong>basic explanation of the scoring principle</strong>, rather than the full n-gram aggregation used by BrierLM.</p><div data-math=\"display\">S(q,y)=2q(y)-\\sum_u q(u)^2</div><p>For independent samples U and V from q, <span data-math=\"inline\">\\Pr(U=y)=q(y)</span> and <span data-math=\"inline\">\\Pr(U=V)=\\sum_uq(u)^2</span>. Matches with the observation and collisions between samples can therefore estimate the score without explicit probabilities. The paper combines n-gram scores to compare models with different chunk sizes.</p>"
      },
      {
        "id": "sampling",
        "title": "5. Likelihood-Free Temperature Sampling",
        "html": "<p>The target is a distribution proportional to P(x)<sup>1/T</sup> without explicit probability evaluation. Sections 5.1–5.3 cover rejection sampling, expected cost and a batch approximation. A finite batch can differ from the exact target; batch size controls cost and approximation quality.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><div data-math=\"display\">q_T(x)=\\frac{q(x)^{1/T}}{\\sum_u q(u)^{1/T}}</div><p>At T=1 this is the original distribution; 0&lt;T&lt;1 puts relatively more weight on likely outcomes. A softmax LM can rescale its logits, but reducing noise in CALM’s vector head does not automatically produce this distribution over decoded tokens. The paper therefore designs a separate sampling procedure based on discrete outputs.</p>"
      },
      {
        "id": "related",
        "title": "6. Related Work",
        "html": "<p>Sections 6.1–6.4 address autoencoders, likelihood-free modeling, evaluation and temperature sampling, distinguishing representation compression from generating the next conditional distribution.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "experiments",
        "title": "7. Experiments",
        "html": "<p>Sections 7.1–7.5 cover settings, main results, the autoencoder, architecture and temperature sampling. The analysis separates latent dimension, regularization, generative heads, input feedback and sampling configurations while comparing quality against compute.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>Autoencoder token reconstruction and language-generation quality are different measurements. Architectural ablations test how latent regularity and input construction affect next-vector learning even when reconstruction remains strong. Performance–compute curves are more informative than one isolated point: compare quality at a matched budget and across several budgets.</p>"
      },
      {
        "id": "conclusion",
        "title": "8. Conclusion and Future Work",
        "html": "<p>The conclusion treats semantic bandwidth K as a design axis. Future directions include semantically structured autoencoders, model and objective improvements, lighter sampling and joint scaling with model size, data and K.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p>"
      },
      {
        "id": "summary",
        "title": "Summary",
        "html": "<p>CALM predicts a vector representing K tokens. Its autoencoder, energy-based generation, sample-based evaluation and temperature control form a coordinated system. Reconstruction accuracy, generation quality, step count and runtime cost describe different parts of that system.</p>"
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
    ],
    "demoAfter": "model"
  },
  "nested-learning": {
    "title": "Nested Learning: The Illusion of Deep Learning Architectures",
    "summary": "Read models and optimizers as learning problems with different update rates, connecting momentum, Continuum Memory Systems, self-modifying Titans and HOPE.",
    "demoTitle": "Different update periods",
    "sections": [
      {
        "id": "abstract",
        "title": "Abstract",
        "html": "<p>Nested Learning represents architectures and optimizers as learning problems with distinct context flows and update rates. Deep optimizers, self-modifying Titans and CMS lead to the evaluated HOPE architecture.</p>"
      },
      {
        "id": "introduction",
        "title": "1. Introduction",
        "html": "<p>Nested Learning (NL) represents a model as interconnected learning problems. Each has its own context flow, state, objective and update rate. A learning level is distinct from a layer index: levels organize components by what they update and how frequently they do so.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>In ordinary inference, the context used by attention keeps changing while pretrained weights stay fixed. These components belong to the same model, but retain information differently and change at different rates. NL uses that distinction as an architectural design axis.</p><p>Section 1.1 gives neurophysiological motivation for multiple learning timescales. This biological connection motivates the design perspective and is separate from the model’s empirical results.</p>"
      },
      {
        "id": "nested",
        "title": "2. Nested Learning",
        "html": "<h3>2.1 Associative Memory</h3><p>Learning is represented through storing and recalling associations between inputs and outputs.</p><h3>2.2 Nested Optimization Problems</h3><p>Optimization problems with distinct context flows and update rates are organized into levels, adding a design axis beyond layer depth.</p><h3>2.3 Optimizers as Learning Modules</h3><div data-math=\"display\">\\begin{aligned}m_t&amp;=\\beta m_{t-1}+(1-\\beta)g_t\\\\\\theta_{t+1}&amp;=\\theta_t-\\eta m_t\\end{aligned}</div><p>This is a simple normalized-momentum example. The state m retains past gradient information; a larger β extends its influence. An optimizer can therefore be read as a memory that accumulates inputs and changes later updates.</p><p>The authors use the associative-memory perspective to discuss deep optimizers with more expressive objectives and internal learning rules. The useful step is explicitly formulating how optimizer states learn, beyond simply renaming them as memory.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><h3>Writing memory as an objective</h3><div data-math=\"display\">\\mathcal M^*=\\operatorname*{arg\\,min}_{\\mathcal M}\\;\\widetilde{\\mathcal L}\\bigl(\\mathcal M(K);V\\bigr)</div><p>K is a set of keys, V their associated values, and M the operator storing the mapping. Keys and values need not be tokens: gradients and intermediate features can also play those roles. The design includes both the memory representation and the error it minimizes when storing associations.</p><p>Expanding the momentum example from m₀=0 gives the expression below. It illustrates compression of past inputs into optimizer state; it is not a reproduction of the paper’s new optimizer.</p><div data-math=\"display\">m_t=(1-\\beta)\\sum_{s=1}^{t}\\beta^{t-s}g_s</div><p>Older gradients receive exponentially smaller weights, with β controlling the retention scale. Nested Learning describes this internal-state learning and the outer model’s learning in one framework, then extends the memory and update rules.</p>"
      },
      {
        "id": "hope",
        "title": "3. HOPE: A Self-Referential Learning Module with Continuum Memory",
        "html": "<p>A Continuum Memory System (CMS) connects MLP memories updated at different periods. In Equations (30)–(31), each block updates at times determined by its own chunk size. HOPE combines a self-modifying Titans-style sequence module with CMS.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><div class=\"review-flow\" aria-label=\"Two components of HOPE\"><span>Context input</span><span>Self-modifying memory<br>Sequence interactions</span><span>CMS<br>MLPs with multiple update periods</span><span>Output</span></div><p>The timeline uses illustrative periods of 1, 4 and 16 inputs. It distinguishes states updated at every input from states updated after accumulating several inputs; it does not reproduce HOPE training or memory accuracy.</p><p>The Google Research overview presents Hope as a variant of Titans, adapting memory and elements involved in its updates to the context. CMS supplies multiple storage levels between immediate working context and longer-lived knowledge.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>In an implementation, I would distinguish <strong>states adapted within the current sequence</strong> from <strong>initial states and rules learned across training sequences</strong>. Writing down which parameters receive gradients from which loss makes these two uses of “update” easier to separate.</p><h3>States with different update periods</h3><p>This simplified rule illustrates update timing, rather than replacing HOPE’s full objectives or learning rules. Block ℓ has period cℓ, and Δℓ is its change computed for a chunk.</p><div data-math=\"display\">W^{(\\ell)}_{t+1}=\\begin{cases}W^{(\\ell)}_t+\\Delta^{(\\ell)}_t,&amp;(t+1)\\bmod c_\\ell=0\\\\W^{(\\ell)}_t,&amp;\\text{otherwise}\\end{cases}</div><p>A period-four block changes at boundaries 4, 8 and 12, holding its state in between. Fast blocks can adapt to recent context while slow blocks accumulate information over longer intervals. Slow updates alone do not ensure useful long-term memory: the accumulated inputs, losses and outer training remain essential.</p>"
      },
      {
        "id": "experiments",
        "title": "4. Experiments",
        "html": "<p>The following entries are from Table 1 of the conference paper, at 1.3B parameters and 100B training tokens. Wiki is WikiText perplexity, where lower is better. Avg. summarizes the commonsense-reasoning tasks in the table.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><div class=\"review-table-wrap\"><table><thead><tr><th>Model</th><th>Wiki ppl ↓</th><th>Reasoning avg. ↑</th></tr></thead><tbody><tr><td>Transformer++</td><td>18.53</td><td>52.25</td></tr><tr><td>Titans (LMM)</td><td>15.60</td><td>56.82</td></tr><tr><td>HOPE</td><td>15.11</td><td>57.23</td></tr></tbody></table></div><p>HOPE improves both selected metrics in this comparison, although rankings differ across individual tasks. The authors also describe evaluations of long-context retrieval, continual learning and knowledge incorporation.<sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p><p>Long-context retrieval tests retention of needed information; continual-learning evaluations test whether earlier performance survives learning from new data. Average perplexity alone cannot establish either property. For a model that adapts state during inference, update computation and retained-state size matter alongside trainable parameter count.</p>"
      },
      {
        "id": "summary",
        "title": "Summary",
        "html": "<p>Nested Learning describes architectures and learning rules together, asking which context each state compresses and for how long. HOPE combines self-modifying sequence memory with a multi-rate CMS. This makes learning timescales a design axis distinct from the number of layers.</p>"
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
    ],
    "demoAfter": "hope"
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
  },
  "cv-qaoa-continuous-problems": {
    "title": "A Quantum Approximate Optimization Algorithm for continuous problems",
    "summary": "Read the original CV-QAOA proposal in its body-section order: cost and kinetic evolution, constraint and discrete encodings, complexity and numerical examples.",
    "tags": [
      "CV-QAOA",
      "Quantum optimization",
      "Continuous variables"
    ],
    "sourceText": [
      {
        "title": "Paper · arXiv:1902.00409",
        "detail": "Original 2019 proposal. Follows the unnumbered body sections and notation in Equations (1)–(4)."
      }
    ],
    "sections": [
      {
        "id": "abstract",
        "title": "Abstract",
        "html": "<p>The proposal alternates cost and mixer evolution for continuous optimization, interpreting the dynamics as gradient descent in superposition and discussing encodings, complexity relationships and numerical examples.</p>"
      },
      {
        "id": "introduction",
        "title": "Introduction",
        "html": "<p>The proposal encodes an objective as position-dependent cost energy and alternates noncommuting cost and mixer evolution for continuous optimization.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>Instead of maintaining one classical candidate x, the algorithm prepares a state with amplitudes and phases over positions. Evolution parameters aim to make low-cost locations useful measurement outcomes. Representing a wavefunction over a continuous domain is distinct from efficiently finding its global minimum.</p>"
      },
      {
        "id": "algorithm",
        "title": "Quantum algorithm",
        "html": "<p>Following the paper’s notation, η controls cost evolution and γ controls mixing. With ℏ=1, composing the transformations below shows how the position update combines the gradient and existing momentum.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><div data-math=\"display\">\\begin{aligned}\\widehat H_C&amp;=f(\\widehat{\\boldsymbol x}),&amp;\\widehat H_M&amp;=\\tfrac12\\widehat{\\boldsymbol p}^{\\,2}\\\\\\widehat U(\\eta,\\gamma)&amp;=e^{-i\\gamma\\widehat H_M}e^{-i\\eta\\widehat H_C}\\\\\\widehat{\\boldsymbol p}&amp;\\mapsto\\widehat{\\boldsymbol p}-\\eta\\nabla f(\\widehat{\\boldsymbol x})\\\\\\widehat{\\boldsymbol x}&amp;\\mapsto\\widehat{\\boldsymbol x}+\\gamma\\widehat{\\boldsymbol p}-\\gamma\\eta\\nabla f(\\widehat{\\boldsymbol x})\\end{aligned}</div><p>Immediately after cost evolution, <span data-math=\"inline\">\\psi^{\\prime}(x)=e^{-i\\eta f(x)}\\psi(x)</span>, so <span data-math=\"inline\">|\\psi^{\\prime}(x)|^2=|\\psi(x)|^2</span>. The density stays unchanged while phase changes. Mixing subsequently allows amplitudes at different positions to interfere, making that phase relevant to the next position distribution.</p><p>For <span data-math=\"inline\">f(x)=x^2/2</span>, substitute <span data-math=\"inline\">\\nabla f(x)=x</span> to obtain <span data-math=\"inline\">\\widehat x\\mapsto(1-\\gamma\\eta)\\widehat x+\\gamma\\widehat p</span>. This is an algebraic illustration, not a numerical optimization result.</p><h3>Following the operator transformation</h3><p>The arrows above denote Heisenberg-picture operator transformations, not the classical trajectory of one sample. With ℏ=1, the commutation relation and cost conjugation are:</p><div data-math=\"display\">\\begin{aligned}[\\widehat x_j,\\widehat p_k]&amp;=i\\delta_{jk}\\\\e^{i\\eta f(\\widehat{\\boldsymbol x})}\\widehat{\\boldsymbol p}\\,e^{-i\\eta f(\\widehat{\\boldsymbol x})}&amp;=\\widehat{\\boldsymbol p}-\\eta\\nabla f(\\widehat{\\boldsymbol x})\\end{aligned}</div><p>Because f and its derivatives are functions of position operators, higher commutators vanish in this conjugation. The kinetic mixer shifts position by γp. Applying cost and then mixer to the state therefore introduces the gradient into the position update. The rightmost operator acts first.</p><h3>Circuit, measurement and classical optimization</h3><div data-math=\"display\">\\begin{aligned}|\\psi_j\\rangle&amp;=e^{-i\\gamma_j\\widehat H_M}e^{-i\\eta_j\\widehat H_C}|\\psi_{j-1}\\rangle,\\quad j=1,\\ldots,P\\\\q(\\boldsymbol x)&amp;=|\\langle\\boldsymbol x|\\psi_P\\rangle|^2\\\\\\mathbb E_q[f]&amp;=\\int f(\\boldsymbol x)q(\\boldsymbol x)\\,d\\boldsymbol x\\end{aligned}</div><p>P is the number of iterations, each with its own η and γ. Position measurements produce candidates whose costs can be evaluated across repeated runs. Lower expected cost and the best value among a finite number of samples are different measurements. Comparisons need the initial state, parameter schedule and sample budget.</p><p>A known low-degree polynomial can support gate decomposition of its cost phase. A black-box function instead requires an implementation such as an oracle acting on superposed inputs. Being able to evaluate f classically does not make that quantum operation free.</p>"
      },
      {
        "id": "constraints",
        "title": "Constrained Optimization",
        "html": "<p>Constraint-violation potentials are added to the objective, using an energy difference between allowed and violating regions to guide optimization.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>For a simple equality constraint, adding <span data-math=\"inline\">\\lambda(g(x)-c)^2</span> gives zero penalty at g(x)=c and a growing penalty away from it. The coefficient λ balances constraint enforcement against the original objective.</p><div data-math=\"display\">\\begin{aligned}f_\\lambda(\\boldsymbol x)&amp;=f(\\boldsymbol x)+\\lambda\\bigl(g(\\boldsymbol x)-c\\bigr)^2\\\\\\nabla f_\\lambda&amp;=\\nabla f+2\\lambda(g-c)\\nabla g\\end{aligned}</div><p>Substituting this gradient into the update shows how constraint error affects position. Larger λ penalizes violations more strongly but creates a steeper potential. Finite penalties and circuit depth do not make every measured sample exactly feasible, so original cost and constraint residual should be checked separately.</p><p>For inequalities, the paper uses rectifier-like potentials that increase on the violating side, including smooth approximations. Constraints enter the cost landscape, unlike a dedicated mixer that stays entirely within a feasible subspace.</p>"
      },
      {
        "id": "discrete",
        "title": "Encoding discrete optimization problems",
        "html": "<p>Functions and potentials associate continuous variables with discrete choices, allowing discrete objectives to be represented.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><div data-math=\"display\">\\begin{aligned}\\tau_\\beta(x)&amp;=\\tanh(\\beta x)\\\\W_{\\omega,\\lambda}(\\boldsymbol x)&amp;=\\sum_j\\frac{\\omega^2}{2}(x_j^2-\\lambda^2)^2\\\\\\widehat H_C&amp;=f\\bigl(\\tau_\\beta(\\widehat{\\boldsymbol x})\\bigr)+W_{\\omega,\\lambda}(\\widehat{\\boldsymbol x})\\end{aligned}</div><p>The tanh function smoothly approximates the sign of position, representing a ±1 choice. The double-well potential confines each variable near two wells. The binary objective and confinement energy must be designed together. β controls sign sharpness; ω and λ control the wells and their separation. This λ plays a different role from the constraint weight in the preceding section.</p>"
      },
      {
        "id": "complexity",
        "title": "Complexity",
        "html": "<p>Variants can encode continuous-space Grover search and CV-IQP circuits. These are relationships between circuit families, not guarantees of faster optimization for every objective.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>The Grover connection uses specially chosen cost and mixer operators to express search. The CV-IQP connection concerns classical difficulty of sampling from certain circuit distributions under complexity assumptions. A hard-to-simulate distribution need not put high probability on good objective values; optimization quality needs its own analysis or experiments.</p>"
      },
      {
        "id": "examples",
        "title": "Numerical examples",
        "html": "<p>The numerical example optimizes the two-dimensional Styblinski–Tang function, starting from a momentum-squeezed state and sampling low-cost points from the final state.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>Among 1,000 sampled points, the paper reports a best value of −78.33216 against a global minimum of approximately −78.3323.</p><div data-math=\"display\">f(\\boldsymbol x)=\\frac12\\sum_{j=1}^{2}(x_j^4-16x_j^2+5x_j)</div><p>This small example has multiple wells, separating local minima from the global minimum. A momentum-squeezed initial state is broad in position, while physical implementations still require finite squeezing and approximate representations.</p><p>The reported best-of-1,000 value is neither average performance nor a success probability. A reproduction should also report the cost distribution, success rate below a stated threshold, circuit depth and simulator truncation error. This two-dimensional example alone does not establish an advantage in high dimensions.</p>"
      },
      {
        "id": "conclusion",
        "title": "Conclusion",
        "html": "<p>The conclusion brings together the gradient-descent-in-superposition interpretation and extensions to constrained and discrete problems.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\">[1]</a></sup></p><p>The contribution is a continuous-objective alternating quantum evolution and its interpretation through momentum and gradient updates. Practical assessment must account jointly for cost-unitary implementation, state preparation, parameter selection and measurement.</p>"
      },
      {
        "id": "summary",
        "title": "Summary",
        "html": "<p>Cost evolution changes position-dependent phase and shifts momentum with the gradient. Kinetic mixing turns momentum into position change. Both phase and probability density therefore matter for subsequent evolution.</p>"
      }
    ]
  }
};
