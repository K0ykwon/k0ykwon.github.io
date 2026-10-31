export default {
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
  ],
  "demos": [
    {
      "id": "cost-phase",
      "type": "review-phase",
      "title": "Cost evolution: density and complex amplitude",
      "after": "introduction"
    },
    {
      "id": "kinetic-mixer",
      "type": "review-mixer",
      "title": "Position distribution after mixing",
      "after": "algorithm"
    }
  ]
};
