# AI Foundations — internal seminar series

Fifteen interactive, self-contained web pages used as seminar material for an internal AI training
series. They build from a single artificial neuron to a pre-qualified list of AI use cases drawn from
the audience's own work.

Written for engineers who are new to machine learning. Every concept has something you can move,
break and put back together, and the calculators compute their numbers live rather than displaying
illustrations.

## Running it

**Online:** https://salvolm84.github.io/ai-training-new/

**Offline:** open `index.html` in any modern browser. No build step, no server, no internet connection
required — the pages are plain HTML, CSS and JavaScript with no external dependencies, so they work
straight from the file system and can be projected directly. This is the recommended way to present,
since it does not depend on the room's wifi.

| Key | Action |
| --- | --- |
| <kbd>N</kbd> | speaker notes on / off (hidden by default, so the same files can be handed to attendees) |
| <kbd>T</kbd> | light / dark theme |
| <kbd>←</kbd> <kbd>→</kbd> | previous / next module |

Speaker notes also appear when a page is printed to PDF.

## Contents

### Part I — Foundations (≈3 h)

| # | Module | Interactive |
| --- | --- | --- |
| 1 | What AI actually is | timeline, nesting diagram, jargon deck, classification quiz |
| 2 | The perceptron | live neuron, logic-gate challenge, the XOR wall, learning rule, gradient descent |
| 3 | From neuron to network | network builder (real backprop), forward pass, overfitting, CNN kernel, train-your-own classifier |
| 4 | How an LLM works | tokenizer, embedding space, next-token picker, attention map, context window, RAG simulator |
| 5 | The bill | training-cost calculator, scaling laws, inference at scale, datacenter zoom, API vs self-host |

### Part II — Engineering it (≈4 h)

| # | Module | Interactive |
| --- | --- | --- |
| 6 | Beyond neural networks | decision-tree splitter, ensembles, trees vs neural net, k-means, anomaly detection, Q-learning |
| 7 | Data | labelling exercise with Cohen's κ, class imbalance, leakage demo, drift simulator, cost calculator |
| 8 | Evaluation | cost-weighted thresholds, ROC and PR curves, calibration, baselines, Wilson intervals, LLM eval set |
| 9 | Agents and tool use | agent loop simulator, prompt-injection demo, permission designer, quadratic cost |
| 10 | Governance and the AI Act | risk-tier tool, timeline, data-in-prompt matrix, vendor questions |

### Part III — Applying it (≈4 h)

| # | Module | Interactive |
| --- | --- | --- |
| 11 | AI in engineering and simulation | surrogate models, sampling plans, infill optimisation, physics-informed fit, extrapolation |
| 12 | Prompting | prompt builder, rewrite gallery, decomposition exercise, troubleshooting, myth-busting |
| 13 | Human factors and adoption | automation-bias experiment, reliance curve, workflow design check |
| 14 | Limits and open questions | reliability compounding, interpretability, three positions, claim assessment |
| 15 | Capstone | use-case canvas, scorecard, next steps, portfolio grid |

`index.html` is the course hub and carries suggested shorter delivery tracks (half-day executive,
one-day engineering, two-hour general, and others).

## Structure

```
index.html                  course hub and delivery tracks
01-history.html … 15-capstone.html
assets/
├── style.css               shared design system, light and dark
└── app.js                  shared navigation, plotting and a small MLP implementation
.nojekyll                   tells GitHub Pages to serve the files as-is
```

The pages share `assets/`, so keep the whole folder together when distributing it. All paths are
relative, so the site works identically from a web server, from a local folder, or from a USB stick.

## Hosting on GitHub Pages

The repository is laid out to be served directly, with no build step:

1. **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main`, folder `/ (root)`
4. Save, and wait a minute for the first deployment

The site then appears at `https://<user>.github.io/<repo>/`. Pushing to `main` republishes it.

Note that Pages on a **private** repository requires a paid GitHub plan; on a free plan the
repository must be public, which makes the material world-readable and indexable by search engines.

## Notes on the material

Almost everything computes live: the networks really train by backpropagation, the surrogate models
really fit, the statistics are really calculated. Three things are authored rather than live and are
labelled as such on the page itself — the tokenizer in module 4.1, the next-token probabilities in
4.3, and the attention maps in 4.4.

Two sections date quickly and are sourced on the page:

- **Module 5** — energy, cost and hardware figures, current as of September 2026. The per-query and
  per-token numbers in particular move by large factors within a year.
- **Module 10** — EU AI Act tiers and application dates, reflecting the Digital AI Omnibus that
  entered into force in July 2026. This module is an engineer's orientation, not legal advice.

Check both before each delivery.

## Licence and use

Internal training material.
