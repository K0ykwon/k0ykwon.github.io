export default {
  "title": "Designing a GEO Harness: From Evidence to Measurable Visibility",
  "summary": "A harness for site analysis, evidence graphs, and content changes, with clear boundaries between sampled AI answers and real-world visibility.",
  "sections": [
    {
      "id": "question",
      "title": "The Question Behind the Dashboard",
      "html": "<p>Generative Engine Optimization (GEO) is the practice of making a site easier to discover, describe accurately, and cite in AI search answers. A single harness can take a site URL and coordinate research, content proposals, and measurement. A shared dashboard does not make its measurements interchangeable: answers sampled through an API do not reveal how often the site appeared to actual users.</p>"
    },
    {
      "id": "evidence",
      "title": "From Pages to an Evidence Graph",
      "html": "<div class=\"review-flow\"><span>Site and web sources</span><span>Claims and evidence</span><span>Question discovery</span><span>Proposed changes</span><span>Post-release observation</span></div><p>Start by extracting products, capabilities, operating conditions, claims, and sources from public pages. A question about separating speakers when they talk over each other can point to a diarization feature, overlapping-speech evaluation data, and a page describing limitations. Evidence of market demand is not evidence that a product supports a capability. For each piece of evidence, record the source URL, retrieval date, relevant passage, and review state.</p><p>A small schema is enough. Relations such as <code>Question → requires → Evidence</code> and <code>Page → answers → Question</code> help identify unanswered questions and pages that need work. A site URL is enough to generate proposals; publishing requires a separate Git or CMS integration and a review step.</p>"
    },
    {
      "id": "observations",
      "title": "Four Observation Channels",
      "html": "<ol><li><strong>Search APIs:</strong> Repeat prompts under specified model and search settings. Store retrieved sources separately from URLs cited in final answers.</li><li><strong>Product UI samples:</strong> Observe the same questions in fresh sessions. Record the product, locale, region, mode, time, and account state. These are controlled samples, not population-wide exposure.</li><li><strong>Platform reports:</strong> Keep metrics such as Search Console generative AI impressions and Bing AI citations in their native units. Coverage differs by platform.</li><li><strong>Site analytics:</strong> Measure visits and conversions from AI search. These cannot reveal impressions without a click.</li></ol><p>Start the dashboard with a channel and time window, then drill into responses, cited URLs, the corresponding page, and missing evidence. Finding a URL in retrieved sources but not in citations is a different problem from seeing mainly third-party citations.</p>"
    },
    {
      "id": "comparison",
      "title": "Keep the Comparison Set Fixed",
      "html": "<p>Separate a fixed evaluation set from a rolling list of discovered questions. Add candidates freely, but version the evaluation set whenever its membership changes. The writing agent can use the evidence graph; the measurement runner gets a neutral question and test conditions only. Otherwise the system is telling a model which brand to mention before measuring whether it mentions that brand.</p><p>Define sample citation rate as <strong>valid responses that cite at least one owned URL ÷ all valid responses</strong>. If six of 90 requests fail and 21 of the 84 valid answers cite the site, report 25% (21/84) and list six failures separately. A before-and-after change is not necessarily causal: indexing delays and model changes can move the metric too.</p>"
    },
    {
      "id": "mvp",
      "title": "A First Version Worth Building",
      "html": "<p>Start with one site and 30 fixed questions. Asking each question three times through two APIs gives 180 requests per measurement cycle. Check a few high-priority questions in the real UI and start with imports for platform reports. Prioritize by question importance and whether the evidence gap can actually be closed, not by visibility alone.</p><p>Before creating more pages, make core answers available as readable text on stable URLs, with verifiable sources, conditions, and internal links. Early GEO research reported effects of adding citations and statistics in its experimental setting; this is not a guarantee across platforms. There is also no need to assume special AI markup or an <code>llms.txt</code> file for Google Search. The objective is to reproduce <strong>which questions lack evidence, what changed, and what differences were observed</strong>, not to maximize a single number.</p>"
    }
  ],
  "sourceText": [
    {
      "title": "GEO: Generative Engine Optimization",
      "detail": "Visibility measures and experimental evidence."
    },
    {
      "title": "Google Search Central: Generative AI Optimization",
      "detail": "Official guidance on discoverability and generative AI features."
    },
    {
      "title": "OpenAI: Web Search",
      "detail": "The API format for search sources and response citations."
    },
    {
      "title": "Google Search Console: Generative AI Performance",
      "detail": "Generative AI impressions report."
    },
    {
      "title": "Bing Webmaster Tools: AI Performance",
      "detail": "Citation reporting for supported AI surfaces."
    }
  ]
};
