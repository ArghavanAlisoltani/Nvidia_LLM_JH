# NVIDIA workshop Stop 3 — Evidence-based comparison of protein language models

## Research question
Across published protein language model (PLM) studies, does increasing model parameter count consistently improve downstream biological prediction? When it does not, can differences in training data, architecture, pretraining objective, pooling or representation selection, and benchmark design explain the discrepancies?

Do not presume either larger models or any specific model family wins. The goal is a critical, checkable literature synthesis, not a marketing ranking. A comparison is valid only when the task, dataset and evaluation conditions are meaningfully comparable.

## Sources and scope

Read **all accessible PLM PDFs currently in `mine/`**, prioritizing these five in order (the first three have already passed the workshop upload check):

1. `mine/ankh.pdf` — Ankh
2. `mine/esm2_esmf.pdf` — ESM-2 / ESMFold
3. `mine/prottrans.pdf` — ProtTrans
4. `mine/esm3.pdf` — ESM-3 (add from `literature_library/PLM/`)
5. `mine/progen2.pdf` — ProGen2 (add from `literature_library/PLM/`)

If available later, also include `mine/esm1b.pdf`, `mine/esmc.pdf`, `mine/saprot.pdf`, `mine/plmblast.pdf` and `mine/plmsearch.pdf`. Do **not** claim to have read these unless the actual PDF exists and is text-readable. Record missing papers and why they were excluded. Do not mix nucleotide models such as Evo 2, GenSLM or DNABERT-2 into direct protein benchmark rankings. They may be discussed separately as background.

The PDF corpus is intentionally larger than the default two-to-three-paper workshop exercise. Work in manageable batches, inspecting the relevant model-description and results pages rather than pasting long PDFs into the conversation. `prottrans.pdf` is long and may require page-by-page reading.

Use the workshop-provided tools without modifying them. Read each PDF with `python 03_lit/pages.py mine/<filename>.pdf`, or `python 03_lit/pages.py mine/<filename>.pdf <page>` for specific pages. Quotes must be copied **word for word** from the page text printed by that tool; record its exact page number. If a quoted result is in a table, use the table line exactly as printed. Write any extra code only in `results/`.

## Hypotheses to test, not assume

- **H1 (scaling):** More parameters alone do not consistently imply higher performance on comparable protein benchmarks.
- **H2 (representation and training):** Dataset curation, architecture, pretraining objective, representation layer and pooling choice help explain differences, but the papers may not isolate their causal effects.
- **H3 (benchmark validity):** Apparently contradictory scores may reflect different datasets, train/test partitions, sequence-identity filtering, task definitions, or metrics rather than model quality.

Optional extension, **only if the relevant papers exist**: assess whether PLM-based remote-homology retrieval improves over BLAST/MMseqs2/HMMER under matched evaluation conditions. Use pLM-BLAST and PLMSearch if available. Do not report a superiority claim from unmatched experiments.

## 1. Extract exact, auditable numerical evidence

Write `results/values.csv`, **one row per distinct numerical finding**, using Python's `csv` module and exactly these eleven columns in this order:

`source,page,quote,value,unit,conditions,value_std,unit_std,conversion,status,note`

- `source`: the exact path, e.g. `mine/ankh.pdf`. For a paper found by `03_lit/lit.py`, use `doi:<DOI>` with page `0` **only** when quoting its verified abstract.
- `page`: the page number as printed by `pages.py`, not a guessed journal page.
- `quote`: exact source text containing the reported number; no invented or reconstructed quotations.
- `value` and `unit`: the number and unit **as printed** (e.g. a model's parameter count, training corpus size, benchmark performance, inference cost).
- `conditions`: name the model/checkpoint, task, benchmark dataset, split, metric, whether larger or smaller is better, method or comparator, and other critical evaluation details whenever reported.
- `value_std`, `unit_std`, `conversion`: normalize values **only within the same kind of quantity**. For model parameter counts, choose `million parameters` as the standard unit (e.g. reported billions converted with `v * 1000`). For corpus sizes, state the denominator precisely (proteins, sequences, residues or tokens) and do not treat these as equivalent. For benchmark percentages or scores, preserve the reported metric and denominator; use `v` for an identity conversion only where meaningful. Leave `value_std` and `conversion` empty for nonconvertible values. Do not invent conversions between accuracy, F1, AUC, TM-score, contact precision, sequence identity or embedding cosine similarity.
- `status`: `ok` or `flagged`. Explain any unresolvable failed check in `note`. Never delete a finding merely to obtain a passing check.

Prioritize evidence in these categories: model/checkpoint parameter count, training-data size and source, architecture and objective, embedding or pooling strategy if tested, sequence length, matched benchmark results, baseline results, and available efficiency/memory measurements. Record qualitative methodological observations in `results/answer.md` with accurate source/page pointers. Do not fabricate a numerical row when a paper gives no relevant number.

A numerical result is **not automatically comparable** just because its metric has the same name. Explicitly distinguish within-paper comparisons, matched cross-paper comparisons, and incomparable results.

## 2. Run the independent checker

After every CSV change, run:

`python 03_lit/check_values.py`

When a row fails, reread the relevant page and correct it. Use `flagged` only if it cannot be corrected, with a precise explanation. Never alter `03_lit/pages.py`, `03_lit/check_values.py`, or `03_lit/lit.py` to make evidence pass. A PASS proves the quote/number is traceable, **not** that the comparison or interpretation is valid.

## 3. Investigate each hypothesis and challenge it

- Construct comparisons **within a single benchmark** using the same task, split, metric, and evaluation protocol wherever possible. For each comparison, state which `values.csv` rows support it.
- Separate observed associations from causal claims. Parameter count, training tokens, dataset quality, architecture, fine-tuning, pooled layer, and number of FLOPs may be confounded.
- Explicitly look for counterexamples, negative results, missing controls and data leakage risks.
- For each of H1–H3, give supporting findings, contradictory findings, and what cannot be concluded.
- Run at least **one** literature search with `python 03_lit/lit.py "<targeted PLM benchmark query>"` so its DOI validation is exercised. At most **three** searches total, because the workshop room shares a search allowance. Use the verified abstract as `doi:<DOI>` page 0 only when it contains a numerical statement with an exact quote. A search result without sufficient evidence is a lead, not a quantitative finding.

## 4. Required deliverables and stopping rule

Write `results/answer.md` with the following sections:

1. **Source coverage:** every PDF considered, which were readable, and which were unavailable.
2. **Model inventory:** checkpoint name, parameters, training data, architecture/objective, and original paper/page; mark unreported information as unknown.
3. **Evidence-backed benchmark table:** task, dataset, protocol, metric, source, reported score, and linked `values.csv` row(s). Mark unmatched comparisons as not comparable.
4. **H1–H3 assessment:** supported, contradicted, mixed or insufficient evidence, with explicit evidence rows and counterexamples.
5. **Scientific limitations:** different datasets, benchmarks, leakage controls, model sizes, pooling, compute budgets, and uncertainty in cross-study interpretation.
6. **Next experiment for microbial protein annotation:** a proposal for a controlled, fixed-query/fixed-reference benchmark with BLASTP/MMseqs2/profile-HMM and several frozen PLM layers and pooling strategies. Present it as a *proposal*, not as results.
7. **Why the search stopped:** explain what further evidence might materially change the answer.

Do not type unverified numeric claims into `results/answer.md`; every scientific number stated must be backed by a `values.csv` row that the checker has accepted or explicitly flagged. Report missing evidence rather than guessing. Keep `mine/` PDFs and the workshop's raw tools unchanged.

Finish by running `python 03_lit/check_values.py`, reporting PASS/FAIL/FLAGGED totals, and giving a short conclusion that reflects only the verified evidence.

## 5. Workshop demonstration: build a short presentation website from the verified research

After completing the evidence-checking and hypothesis loop above, build a **five-slide scientific presentation** for the NVIDIA workshop audience. The aim is to explain the research question, what the agent tested and revised, what the papers actually support, and what controlled experiment would be needed for a future microbial protein annotation study. Do this as part of the same agent task, after producing the analysis outputs.

Create a static, keyboard-navigable slideshow at **`site/plm-research/index.html`** using HTML/CSS/JavaScript with on-screen next/previous controls, readable scientific figures/tables, speaker notes (visible via a toggle), citations with links to the original publications, and a final source/evidence section. Design for a 3–5-minute live presentation. Make it attractive, responsive and accessible. Do not depend on a paid API, secret credentials, remote model endpoints, or dynamically generated responses.

Slide outline:
1. **Problem and question:** why PLM evaluation is difficult, and the specific hypothesis being tested.
2. **Evidence base:** five accessible papers, model/checkpoint overview, and essential experimental distinctions.
3. **Verified results:** a compact table or chart showing *only* metrics whose sources can be traced to `results/values.csv`; group non-comparable evaluations separately and label missing data explicitly.
4. **Agentic reasoning loop:** initial competing hypotheses → evidence → contradictory findings → revised hypotheses; distinguish evidence from inference, and state the stopping rule.
5. **Conclusion and proposed next experiment:** what the papers do and do not establish, then a clearly labeled *prospective* matched benchmark for divergent microbial proteins against BLASTP/MMseqs2/profile-HMM with frozen PLM embeddings, different layers and pooling choices.

Website requirements:
- Read `results/answer.md`, `results/hypothesis_log.md` and `results/values.csv` as the source of research claims. Create all three first if absent, retaining a backup of any prior outputs.
- Do not invent model scores, parameter counts, comparative rankings, paper quotes, positive results or new experimental outcomes. Label hypotheses and prospective experiments as such.
- Give each chart/table a link to its exact evidence row(s) and source/page reference. Exclude failed/unresolved evidence from positive claims. `FLAGGED` is *not* proof of validity.
- Avoid publishing complete PDF content, private documents, raw data, proprietary information, secrets, or extensive quotations: **`site/` may be publicly visible** through the Codespace preview or automatic GitHub Pages deployment. `mine/` and `results/` remain outside Git and must not be copied wholesale to `site/`.
- **Preserve the existing website** at `site/index.html` and its original lessons, tutor, scripts and styles. Put the presentation only under `site/plm-research/`. Add a navigation link on the homepage only if it can be done without damaging the existing lessons.
- Use relative links and static assets that work both at the Codespace port 8000 preview and under the repository's GitHub Pages project path.
- Test the slideshow navigation, missing-file handling, citations, charts and responsive layout. Run the independent checker one final time and make sure any claimed numerical results on the slides are traceable to `results/values.csv`.
- Provide the local preview path `/plm-research/` and state explicitly whether publishing occurred. Do not call `publish-site.sh` or make a manual deployment without asking the user.

Final response: report which hypothesis survived scrutiny (or that evidence is insufficient), how many distinct papers were analyzed, the independent check's PASS/FAIL/FLAGGED totals, which presentation files were created, and how to open the five slides. This task is complete only when both the scientific analysis and the slideshow have been checked.
