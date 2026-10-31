export default {
  "title": "Continuous Autoregressive Language Models",
  "summary": "Connect the token-chunk autoencoder, energy-based generative head and discrete input-feedback path. Reconstruction accuracy and generation quality answer different questions.",
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
  "demos": [
    {
      "id": "demo",
      "type": "review-calm",
      "title": "Token chunks and generation steps",
      "after": "evaluation"
    },
    {
      "id": "energy-loss",
      "type": "review-energy",
      "title": "Mean prediction and a two-mode distribution",
      "after": "model"
    }
  ]
};
