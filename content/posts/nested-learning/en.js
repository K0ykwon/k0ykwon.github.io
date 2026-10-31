export default {
  "title": "Nested Learning: The Illusion of Deep Learning Architectures",
  "summary": "Read models and optimizers as learning problems with different update rates, connecting momentum, Continuum Memory Systems, self-modifying Titans and HOPE.",
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
  "demos": [
    {
      "id": "demo",
      "type": "review-memory",
      "title": "Different update periods",
      "after": "hope"
    }
  ]
};
