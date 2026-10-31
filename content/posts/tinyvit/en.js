export default {
  "title": "TinyViT: Fast Pretraining Distillation for Small Vision Transformers",
  "summary": "How sparse soft labels, reproducible augmentation and compact architectures work together, with accuracy and compute compared across input resolutions.",
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
  "demos": [
    {
      "id": "demo",
      "type": "review-distillation",
      "title": "Reconstructing probabilities from the top entries",
      "after": "method"
    }
  ]
};
