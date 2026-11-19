export default {
  "title": "Exploring Weight-Space Programming: Capabilities, Generalization, and Limitations",
  "summary": "An edit to 1,023 stored weights raised MATH-500 accuracy by 29.45 percentage points. How did one column change the output, and why were the results not consistent across attempts?",
  "sections": [
    {
      "id": "abstract",
      "title": "Abstract",
      "html": "<p>Can a reasoning agent improve a model by modifying a checkpoint instead of retraining it? Hu and colleagues investigate 16 editing trajectories across seven benchmarks and two Qwen3.5 model sizes, 0.8B and 9B. The standout result is a 29.45-percentage-point gain on the small model's math benchmark, but six trajectories retained the original checkpoint. These two observations frame both the promise and the limit of the method.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p>"
    },
    {
      "id": "introduction",
      "title": "1. Introduction",
      "html": "<p>In WSP, an agent inspects outputs and internal activations, then proposes a direct checkpoint edit. The study asks not only how few numbers can be changed, but whether benefits hold on unseen examples and transfer to other tasks. Editing without backpropagation does not mean editing without data or model execution.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup><sup><a href=\"#SOURCE2\" data-review-ref=\"2\" aria-label=\"Reference 2\">[2]</a></sup></p>"
    },
    {
      "id": "protocol",
      "title": "2. Experimental Protocol",
      "html": "<p>Each search starts from the unmodified checkpoint with a budget of 50 forward-tool requests for generation or teacher-forced analysis. Development feedback guides selection, including the option to keep the original weights. MATH-500 is held out from the development data used to choose the math edit. The main 0.8B math search used 32 generation requests and 18 teacher-forced analysis requests. One request need not correspond to one example.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p>"
    },
    {
      "id": "intervention",
      "title": "3. A Single-Column Intervention",
      "html": "<p>The main run edits column 507 of the layer-23 MLP down-projection, using zero-based indices. Let <var>u</var> be the direction constructed by the agent and <var>e</var> the basis vector selecting that column. The edit and resulting change in output are:<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><div data-math=\"display\">W^{\\prime}=W-u e_{507}^{\\top}</div><div data-math=\"display\">W^{\\prime}a-Wa=-a_{507}u</div><p>The effect depends on the intermediate activation as well as the location: a zero value in that channel makes the edit have no effect at this operation. After BF16 storage, 1,023 of the column's 1,024 values differed from the original. The count describes edit size, not where mathematical ability is stored.</p>"
    },
    {
      "id": "results",
      "title": "4. Results and Transfer",
      "html": "<p>The authors report an increase on MATH-500 from 8.35% to 37.80% in the main 0.8B experiment. Two independent reruns improved by 5.00 and 27.30 percentage points. For 9B math, development accuracy rose by 29.69 points, but the evaluated candidate moved from 97.70% to 97.35% on MATH-500, and the original checkpoint was ultimately retained.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>Without any further edits, the 0.8B math checkpoint gained 3.03 points on GPQA Diamond, 12.18 on IFEval, and 20.10 on SciBench; SciCode did not improve. These transfer results are distinct from the best scores of checkpoints edited specifically for each task.</p>"
    },
    {
      "id": "limitations",
      "title": "5. Limitations",
      "html": "<p>The number of altered values is not a proxy for search cost. Evaluating candidates is expensive, and repeated searches on one task gave different outcomes. The small model also starts from a low baseline. Its larger absolute gain does not imply a higher final score than the larger model in this comparison.<sup><a href=\"#SOURCE1\" data-review-ref=\"1\" aria-label=\"Reference 1\">[1]</a></sup></p><p>Gains on other benchmarks do not establish that the edit preserves the rest of a model's behavior. An evaluation should distinguish target accuracy, the fraction of answers that finish, regressions on other tasks, and the budget spent on search.</p>"
    },
    {
      "id": "summary",
      "title": "Summary",
      "html": "<p>The strongest part of this work is that it reports dispersion across reruns and cases where the original model was retained alongside the striking 1,023-value result. Small edits can have large effects; predicting which edits will work on the next model or task remains open.</p>"
    }
  ],
  "sourceText": [
    {
      "title": "Exploring Weight-Space Programming",
      "detail": "Preprint v1: Sections 2–4, Table 2, and the single-column edit in the appendix."
    },
    {
      "title": "Weight-Space Programming",
      "detail": "The original public write-up for background and early examples."
    }
  ]
};
