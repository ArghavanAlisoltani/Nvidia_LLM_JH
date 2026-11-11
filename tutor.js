/* Socratic Tutor - Interactive adaptive tutoring for Protein Language Models */

const TUTOR_CURRICULUM = [
  // Phase 1: Amino Acid Sequences (Questions 1-3)
  {
    id: "seq-1",
    phase: "sequences",
    concept: "Amino acid sequences as protein language",
    question: "Imagine you're explaining to a friend what a protein sequence like 'MALWMRLLPLL' means. How would you describe it in your own words?",
    expectedKeywords: ["amino acid", "letter", "code", "chain", "sequence", "residue", "order"],
    misconceptions: [
      { pattern: /atom|element/, hint: "The letters don't represent individual atoms — each letter stands for a whole amino acid (like Alanine, Leucine). Think of it as a 20-letter alphabet." },
      { pattern: /3d|structure|fold/, hint: "The sequence is just the linear order (primary structure). The 3D folding comes later — sequence determines structure, but they're not the same thing." },
      { pattern: /dna|gene|rna/, hint: "DNA codes for the sequence, but the protein sequence itself is the protein's primary structure — the chain of amino acids." }
    ],
    followUp: "Great! Now, why do you think the ORDER of these letters matters so much?",
    difficulty: 1
  },
  {
    id: "seq-2",
    phase: "sequences",
    concept: "Sequence order determines structure and function",
    question: "Why does the order of amino acids matter? What would happen if you scrambled the sequence 'MALWMRLLPLL' randomly?",
    expectedKeywords: ["fold", "structure", "function", "shape", "interaction", "hydrophobic", "position"],
    misconceptions: [
      { pattern: /same|doesn't matter|identical/, hint: "Actually, order is everything! Scrambling changes which amino acids are next to each other, which completely changes how the protein folds." },
      { pattern: /composition|count|percentage/, hint: "Composition (how many of each amino acid) matters, but two proteins with identical composition can have totally different structures if the order differs." }
    ],
    followUp: "Exactly — the sequence encodes the folding instructions. Now, if two proteins have 80% identical sequences, what would you predict about them?",
    difficulty: 2
  },
  {
    id: "seq-3",
    phase: "sequences",
    concept: "Sequence similarity implies structural/functional similarity",
    question: "Two proteins share 80% sequence identity. What does this tell you about their 3D structures and functions? What are you NOT sure about?",
    expectedKeywords: ["similar", "homolog", "ancestor", "structure", "function", "conserved", "divergent"],
    misconceptions: [
      { pattern: /identical|same|exact/, hint: "80% identical means 20% different — those differences can change binding specificity, regulation, or stability. They're likely homologs but not identical." },
      { pattern: /no relation|unrelated/, hint: "80% is very high! Random proteins share ~5-10%. This strongly suggests common ancestry (homology)." }
    ],
    followUp: "Perfect — high sequence similarity usually means similar structure and often similar function. Now let's talk about how computers understand these sequences...",
    difficulty: 2
  },

  // Phase 2: Protein Embeddings (Questions 4-6)
  {
    id: "emb-1",
    phase: "embeddings",
    concept: "Why one-hot encoding is insufficient",
    question: "Computers need numbers, not letters. The simplest approach is 'one-hot encoding' — a vector of 20 zeros with a single 1 for each amino acid. What's the problem with this for machine learning?",
    expectedKeywords: ["sparse", "similar", "distance", "learn", "relationship", "context", "chemical"],
    misconceptions: [
      { pattern: /fine|works|okay/, hint: "One-hot treats Leucine and Isoleucine as completely different (distance = √2), even though they're nearly identical chemically. The model learns nothing about biochemical similarity." },
      { pattern: /dimension|size|big/, hint: "The dimension (20) isn't the main problem — it's that all amino acids are equidistant. The model can't generalize from seeing Leucine to understanding Isoleucine." }
    ],
    followUp: "Exactly — one-hot loses all chemical intuition. So how do learned embeddings solve this?",
    difficulty: 2
  },
  {
    id: "emb-2",
    phase: "embeddings",
    concept: "Learned embeddings capture biochemical similarity",
    question: "Protein language models (like ESM, ProtBERT) learn 'embeddings' — dense vectors of ~320-4096 numbers per amino acid. Why are these better than one-hot?",
    expectedKeywords: ["dense", "similar", "close", "vector", "space", "context", "learn", "hydrophobic", "charge"],
    misconceptions: [
      { pattern: /compress|smaller|dimension/, hint: "It's not just about size — it's that similar amino acids end up CLOSE in vector space. The model learns this from seeing millions of real proteins." },
      { pattern: /random|arbitrary/, hint: "The positions aren't random! Leucine and Isoleucine have similar vectors because they appear in similar sequence contexts (hydrophobic cores)." }
    ],
    followUp: "Right! The model learns 'Leucine appears in contexts similar to Isoleucine' → their vectors become neighbors. Now, a protein gives us MANY vectors (one per position). How do we get ONE vector for the whole protein?",
    difficulty: 2
  },
  {
    id: "emb-3",
    phase: "embeddings",
    concept: "Per-residue to per-protein embeddings",
    question: "A 100-amino-acid protein gives us 100 vectors (each ~1280-dim). We need ONE vector for the whole protein. How would you combine them?",
    expectedKeywords: ["average", "mean", "pool", "sum", "combine", "represent"],
    misconceptions: [
      { pattern: /first|start|beginning/, hint: "Using just the first amino acid loses all the rest of the sequence! We need information from the entire chain." },
      { pattern: /concatenate|join|long/, hint: "Concatenating makes a huge vector (128,000 dim) that varies with sequence length. We want a FIXED-size summary regardless of length." }
    ],
    followUp: "Mean pooling (averaging) is the most common approach — it gives a fixed-size summary. But what does this averaged vector actually MEAN?",
    difficulty: 3
  },

  // Phase 3: Mean Pooling (Questions 7-8)
  {
    id: "pool-1",
    phase: "pooling",
    concept: "Mean pooling creates protein-level representation",
    question: "When we average all per-position embeddings (mean pooling), what does the resulting vector represent? What information might we lose?",
    expectedKeywords: ["summary", "overall", "global", "protein", "lose", "position", "order", "local"],
    misconceptions: [
      { pattern: /nothing|everything|all/, hint: "We lose positional information — the average doesn't know if a motif was at the start, middle, or end. But we gain a length-invariant summary of the protein's overall biochemical character." },
      { pattern: /sequence|order/, hint: "Correct — mean pooling discards sequence order! That's why some tasks use attention-based pooling or CLS tokens instead." }
    ],
    followUp: "Great insight — we trade positional detail for a compact global summary. Now, how do we COMPARE two of these protein vectors?",
    difficulty: 3
  },
  {
    id: "pool-2",
    phase: "pooling",
    concept: "Alternative pooling strategies",
    question: "Besides averaging, what are other ways to get a single protein vector from per-position embeddings? When might each be useful?",
    expectedKeywords: ["max", "cls", "attention", "weighted", "token", "special"],
    misconceptions: [
      { pattern: /only|just|one way/, hint: "There are several! Max pooling captures strongest signals. CLS token (like BERT) learns to attend to the whole sequence. Attention pooling learns what's important." }
    ],
    followUp: "Excellent — different pooling captures different aspects. Now for the final piece: comparing proteins...",
    difficulty: 3
  },

  // Phase 4: Cosine Similarity (Questions 9-12)
  {
    id: "sim-1",
    phase: "similarity",
    concept: "Cosine similarity measures angular similarity",
    question: "We have two protein embedding vectors. To compare them, we use cosine similarity. In your own words, what does cosine similarity measure?",
    expectedKeywords: ["angle", "direction", "cosine", "magnitude", "length", "normalized"],
    misconceptions: [
      { pattern: /distance|euclidean|magnitude|length/, hint: "Cosine similarity IGNORES magnitude — it only cares about the ANGLE between vectors. Two vectors pointing the same way have similarity 1, even if one is 10x longer." },
      { pattern: /dot product/, hint: "Dot product is part of the formula, but cosine NORMALIZES by length. That's the key difference!" }
    ],
    followUp: "Perfect — it's the cosine of the angle. 1 = same direction, 0 = orthogonal, -1 = opposite. Why is this better than Euclidean distance for embeddings?",
    difficulty: 3
  },
  {
    id: "sim-2",
    phase: "similarity",
    concept: "Why cosine over Euclidean distance",
    question: "Why do protein language models prefer cosine similarity over Euclidean distance for comparing embeddings?",
    expectedKeywords: ["scale", "invariant", "dimension", "high", "normalized", "curse", "magnitude"],
    misconceptions: [
      { pattern: /easy|simple|intuitive/, hint: "Euclidean distance is intuitive in 2D/3D, but in 1280 dimensions, all distances become similar (curse of dimensionality). Cosine stays discriminative." },
      { pattern: /magnitude|length.*important/, hint: "In trained embeddings, magnitude often reflects sequence length or training artifacts, not biology. Cosine removes this confound." }
    ],
    followUp: "Exactly — scale invariance and high-dimensional behavior make cosine ideal. Now, how do you interpret the actual numbers?",
    difficulty: 3
  },
  {
    id: "sim-3",
    phase: "similarity",
    concept: "Interpreting cosine similarity scores",
    question: "You compute cosine similarity between two protein embeddings and get 0.72. What does this mean biologically? What follow-up questions would you ask?",
    expectedKeywords: ["homolog", "family", "fold", "function", "threshold", "calibrate", "model", "significant"],
    misconceptions: [
      { pattern: /72%|seventy/, hint: "It's NOT 72% sequence identity! Cosine similarity of 0.72 suggests same fold/family, but sequence identity could be 20-40%. Always calibrate thresholds for your specific model." },
      { pattern: /identical|same protein/, hint: "0.72 is moderate-high, not 'identical'. Identical proteins would be ~0.98+. This suggests homology but possible functional divergence." }
    ],
    followUp: "Excellent — you're thinking like a computational biologist! Remember: thresholds depend on the model, embedding dimension, and your task. Last question...",
    difficulty: 4
  },
  {
    id: "sim-4",
    phase: "similarity",
    concept: "Practical application and caveats",
    question: "You're using ESM-2 embeddings to find homologs of a new protein. You get hits with cosine similarities of 0.45, 0.68, and 0.89. How do you prioritize? What caveats apply?",
    expectedKeywords: ["threshold", "calibrate", "validate", "function", "structure", "experiment", "false", "positive"],
    misconceptions: [
      { pattern: /0.89.*best|highest.*true/, hint: "0.89 is promising but could be a false positive (e.g., same domain family, different function). 0.45 might be remote homology worth checking structurally." },
      { pattern: /ignore|discard.*0.45/, hint: "Don't automatically discard 0.45! Remote homologs can have low cosine similarity but detectable structural similarity. Always validate experimentally." }
    ],
    followUp: "",
    difficulty: 4
  }
];

// Tutor state
let tutorState = {
  currentQuestionIndex: 0,
  conversation: [],
  studentProfile: {
    strengths: [],
    weaknesses: [],
    misconceptions: []
  },
  sessionStartTime: Date.now()
};

const PHASE_NAMES = {
  sequences: "Amino Acid Sequences",
  embeddings: "Protein Embeddings",
  pooling: "Mean Pooling",
  similarity: "Cosine Similarity"
};

const PHASE_COLORS = {
  sequences: "#2563eb",
  embeddings: "#059669",
  pooling: "#ea580c",
  similarity: "#7c3aed"
};

// DOM Elements
const welcomeCard = document.getElementById('welcome-card');
const tutoringCard = document.getElementById('tutoring-card');
const summaryCard = document.getElementById('summary-card');
const startBtn = document.getElementById('start-tutoring');
const restartBtn = document.getElementById('restart-btn');
const conversationDiv = document.getElementById('conversation');
const studentInput = document.getElementById('student-input');
const submitBtn = document.getElementById('submit-btn');
const inputArea = document.getElementById('input-area');
const typingIndicator = document.getElementById('typing-indicator');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const sessionSummary = document.getElementById('session-summary');

document.addEventListener('DOMContentLoaded', initTutor);

function initTutor() {
  startBtn.addEventListener('click', startSession);
  restartBtn.addEventListener('click', restartSession);
  studentInput.addEventListener('input', () => {
    submitBtn.disabled = !studentInput.value.trim();
  });
  studentInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (!submitBtn.disabled) submitAnswer();
    }
  });
  submitBtn.addEventListener('click', submitAnswer);
}

function startSession() {
  tutorState = {
    currentQuestionIndex: 0,
    conversation: [],
    studentProfile: { strengths: [], weaknesses: [], misconceptions: [] },
    sessionStartTime: Date.now()
  };
  welcomeCard.style.display = 'none';
  summaryCard.style.display = 'none';
  tutoringCard.style.display = 'block';
  inputArea.style.display = 'block';
  askNextQuestion();
}

function restartSession() {
  summaryCard.style.display = 'none';
  welcomeCard.style.display = 'block';
  tutoringCard.style.display = 'none';
  conversationDiv.innerHTML = '';
}

function askNextQuestion() {
  if (tutorState.currentQuestionIndex >= TUTOR_CURRICULUM.length) {
    endSession();
    return;
  }

  const q = TUTOR_CURRICULUM[tutorState.currentQuestionIndex];
  updateProgress();
  showPhaseTransition(q);
  
  setTimeout(() => {
    addTutorMessage(q.question);
    showInput();
  }, 500);
}

function updateProgress() {
  const total = TUTOR_CURRICULUM.length;
  const current = tutorState.currentQuestionIndex + 1;
  const pct = (current / total) * 100;
  progressBar.style.width = `${pct}%`;
  progressText.textContent = `Question ${current} of ${total}`;
  
  // Update progress bar color based on phase
  const q = TUTOR_CURRICULUM[tutorState.currentQuestionIndex];
  progressBar.style.background = PHASE_COLORS[q.phase];
}

function showPhaseTransition(q) {
  if (tutorState.currentQuestionIndex === 0) return;
  
  const prevQ = TUTOR_CURRICULUM[tutorState.currentQuestionIndex - 1];
  if (prevQ.phase !== q.phase) {
    const phaseDiv = document.createElement('div');
    phaseDiv.className = 'phase-transition';
    phaseDiv.style.cssText = `
      text-align: center; padding: 16px; margin: 16px 0;
      background: ${PHASE_COLORS[q.phase]}15; border-radius: 12px;
      border: 2px solid ${PHASE_COLORS[q.phase]};
    `;
    phaseDiv.innerHTML = `
      <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: ${PHASE_COLORS[q.phase]}; font-weight: 600; margin-bottom: 4px;">
        New Topic: ${PHASE_NAMES[q.phase]}
      </div>
      <div style="color: var(--text);">${q.concept}</div>
    `;
    conversationDiv.appendChild(phaseDiv);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
  }
}

function addTutorMessage(text, isFollowUp = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'tutor-message-bubble';
  msgDiv.style.cssText = `
    display: flex; gap: 10px; margin: 16px 0; animation: fadeIn 0.3s ease;
    max-width: 90%;
  `;
  msgDiv.innerHTML = `
    <div class="tutor-avatar" style="flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #7c3aed); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">🤖</div>
    <div class="tutor-text" style="background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 12px 16px; flex: 1;">
      ${text}
    </div>
  `;
  conversationDiv.appendChild(msgDiv);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function addStudentMessage(text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'student-message-bubble';
  msgDiv.style.cssText = `
    display: flex; gap: 10px; margin: 16px 0; justify-content: flex-end; animation: fadeIn 0.3s ease;
    max-width: 90%;
  `;
  msgDiv.innerHTML = `
    <div class="student-text" style="background: var(--primary); color: white; border-radius: 16px; padding: 12px 16px; flex: 1; text-align: right;">
      ${escapeHtml(text)}
    </div>
    <div class="student-avatar" style="flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">👤</div>
  `;
  conversationDiv.appendChild(msgDiv);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

function showInput() {
  inputArea.style.display = 'block';
  studentInput.focus();
  submitBtn.disabled = !studentInput.value.trim();
}

function hideInput() {
  inputArea.style.display = 'none';
  studentInput.value = '';
  submitBtn.disabled = true;
}

async function submitAnswer() {
  const answer = studentInput.value.trim();
  if (!answer) return;

  hideInput();
  addStudentMessage(answer);
  showTypingIndicator();

  // Simulate thinking time
  await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
  hideTypingIndicator();

  const q = TUTOR_CURRICULUM[tutorState.currentQuestionIndex];
  const evaluation = evaluateAnswer(q, answer);
  
  // Record in conversation history
  tutorState.conversation.push({
    questionId: q.id,
    question: q.question,
    answer: answer,
    evaluation: evaluation
  });

  // Update student profile
  updateStudentProfile(q, evaluation);

  // Respond based on evaluation
  if (evaluation.level === 'correct') {
    handleCorrectAnswer(q, evaluation);
  } else if (evaluation.level === 'partial') {
    handlePartialAnswer(q, evaluation);
  } else {
    handleIncorrectAnswer(q, evaluation);
  }

  tutorState.currentQuestionIndex++;
  
  // Continue to next question after delay
  setTimeout(() => {
    if (tutorState.currentQuestionIndex < TUTOR_CURRICULUM.length) {
      askNextQuestion();
    } else {
      endSession();
    }
  }, evaluation.level === 'correct' ? 1500 : 2000);
}

function evaluateAnswer(q, answer) {
  const lowerAnswer = answer.toLowerCase();
  
  // Check for misconceptions first
  for (const misconception of q.misconceptions) {
    if (misconception.pattern.test(lowerAnswer)) {
      return {
        level: 'misconception',
        matchedMisconception: misconception,
        keywordsFound: []
      };
    }
  }

  // Count expected keywords
  let keywordsFound = 0;
  const foundKeywords = [];
  for (const kw of q.expectedKeywords) {
    if (lowerAnswer.includes(kw.toLowerCase())) {
      keywordsFound++;
      foundKeywords.push(kw);
    }
  }

  // Determine level
  let level;
  if (keywordsFound >= Math.max(2, q.expectedKeywords.length * 0.3)) {
    level = 'correct';
  } else if (keywordsFound >= 1 || answer.length > 30) {
    level = 'partial';
  } else {
    level = 'incorrect';
  }

  return { level, keywordsFound, foundKeywords };
}

function updateStudentProfile(q, evaluation) {
  if (evaluation.level === 'correct') {
    if (!tutorState.studentProfile.strengths.includes(q.phase)) {
      tutorState.studentProfile.strengths.push(q.phase);
    }
  } else if (evaluation.level === 'misconception') {
    if (!tutorState.studentProfile.misconceptions.includes(q.phase)) {
      tutorState.studentProfile.misconceptions.push(q.phase);
    }
  } else {
    if (!tutorState.studentProfile.weaknesses.includes(q.phase)) {
      tutorState.studentProfile.weaknesses.push(q.phase);
    }
  }
}

function handleCorrectAnswer(q, evaluation) {
  let response = "🎯 **Excellent!** You've grasped the key idea.";
  
  if (evaluation.foundKeywords.length > 0) {
    response += ` I noticed you mentioned: ${evaluation.foundKeywords.join(', ')}.`;
  }
  
  if (q.followUp) {
    response += `\n\n${q.followUp}`;
  } else {
    response += "\n\nLet's move on to the next concept.";
  }
  
  addTutorMessage(response, true);
}

function handlePartialAnswer(q, evaluation) {
  let response = "🤔 **Good start!** You're on the right track.";
  
  if (evaluation.foundKeywords.length > 0) {
    response += ` You mentioned ${evaluation.foundKeywords.join(', ')} — that's relevant.`;
  }
  
  // Provide a targeted hint
  const hint = generateHint(q, evaluation);
  response += `\n\n💡 **Hint:** ${hint}`;
  response += `\n\nTake another moment to think, then we'll continue.`;
  
  addTutorMessage(response, true);
}

function handleIncorrectAnswer(q, evaluation) {
  const misconception = evaluation.matchedMisconception;
  
  let response = "🤷 **Not quite — but that's how we learn!** ";
  
  if (misconception) {
    response += misconception.hint;
  } else {
    response += "Let me guide you toward the key insight.";
    const hint = generateHint(q, evaluation);
    response += `\n\n💡 **Hint:** ${hint}`;
  }
  
  response += "\n\nNo worries — this is a tricky concept. Let's keep going and it will click.";
  
  addTutorMessage(response, true);
}

function generateHint(q, evaluation) {
  const hints = {
    'seq-1': "Think of it like a sentence — each letter is a 'word' (amino acid), and the order creates meaning.",
    'seq-2': "What determines how a protein folds? The chemical interactions between neighbors in the chain.",
    'seq-3': "80% identity is very high (random is ~5-10%). Think: common ancestor, similar fold, but maybe different details.",
    'emb-1': "In one-hot, Leucine and Isoleucine are maximally different. But chemically they're nearly twins. The model can't generalize.",
    'emb-2': "The model reads millions of proteins. It learns 'Leucine appears where Isoleucine appears' → their vectors become neighbors.",
    'emb-3': "We have 100 vectors of 1280 dims each. We want ONE vector of 1280 dims. What math operation preserves dimension?",
    'pool-1': "Averaging gives a global summary but loses WHERE things happened. Like averaging all pixels in an image.",
    'pool-2': "Max pooling = strongest signal. CLS token = learned summary. Attention pooling = learned importance weighting.",
    'sim-1': "Cosine of the angle between vectors. Ignores length. Two vectors pointing same way = 1, even if different magnitudes.",
    'sim-2': "In 1280 dimensions, Euclidean distances all become similar. Cosine stays meaningful. Also: magnitude ≠ biology.",
    'sim-3': "0.72 = likely same fold/family. NOT 72% sequence identity. Thresholds vary by model — always calibrate!",
    'sim-4': "Don't just take the highest. 0.89 could be same domain, different function. 0.45 could be remote homology. Validate experimentally."
  };
  return hints[q.id] || "Think about the core concept we're exploring. What's the key relationship?";
}

function endSession() {
  hideInput();
  tutoringCard.style.display = 'none';
  summaryCard.style.display = 'block';
  
  const duration = Math.round((Date.now() - tutorState.sessionStartTime) / 1000 / 60);
  const correct = tutorState.conversation.filter(c => c.evaluation.level === 'correct').length;
  const partial = tutorState.conversation.filter(c => c.evaluation.level === 'partial').length;
  const misconceptions = tutorState.conversation.filter(c => c.evaluation.level === 'misconception').length;
  
  let summaryHtml = `
    <div class="summary-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin: 24px 0;">
      <div class="stat" style="text-align: center; padding: 16px; background: var(--bg); border-radius: 12px;">
        <div style="font-size: 2.5rem; font-weight: 700; color: var(--secondary);">${correct}</div>
        <div style="color: var(--text-muted);">Solid Understanding</div>
      </div>
      <div class="stat" style="text-align: center; padding: 16px; background: var(--bg); border-radius: 12px;">
        <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">${partial}</div>
        <div style="color: var(--text-muted);">Developing</div>
      </div>
      <div class="stat" style="text-align: center; padding: 16px; background: var(--bg); border-radius: 12px;">
        <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary);">${misconceptions}</div>
        <div style="color: var(--text-muted);">Misconceptions Addressed</div>
      </div>
      <div class="stat" style="text-align: center; padding: 16px; background: var(--bg); border-radius: 12px;">
        <div style="font-size: 2.5rem; font-weight: 700; color: var(--text);">${duration} min</div>
        <div style="color: var(--text-muted);">Session Time</div>
      </div>
    </div>
  `;
  
  // Strengths
  if (tutorState.studentProfile.strengths.length > 0) {
    summaryHtml += `
      <div style="margin: 24px 0;">
        <h4 style="color: var(--secondary); margin-bottom: 12px;">✅ Strengths</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${tutorState.studentProfile.strengths.map(s => `<span style="background: var(--secondary-light); color: var(--secondary); padding: 6px 12px; border-radius: 999px; font-size: 0.875rem; font-weight: 500;">${PHASE_NAMES[s]}</span>`).join('')}
        </div>
      </div>
    `;
  }
  
  // Areas to review
  const toReview = [...new Set([...tutorState.studentProfile.weaknesses, ...tutorState.studentProfile.misconceptions])];
  if (toReview.length > 0) {
    summaryHtml += `
      <div style="margin: 24px 0;">
        <h4 style="color: var(--accent); margin-bottom: 12px;">📚 Review These Topics</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${toReview.map(s => `<span style="background: var(--accent-light); color: var(--accent); padding: 6px 12px; border-radius: 999px; font-size: 0.875rem; font-weight: 500;">${PHASE_NAMES[s]}</span>`).join('')}
        </div>
        <p style="margin-top: 12px; font-size: 0.875rem; color: var(--text-muted);">Click the lesson links below to review, or try the quiz to test your knowledge!</p>
      </div>
    `;
  }
  
  // Conversation highlights
  summaryHtml += `
    <details style="margin-top: 24px;">
      <summary style="cursor: pointer; font-weight: 600; color: var(--primary);">View Full Conversation</summary>
      <div style="margin-top: 16px; max-height: 300px; overflow-y: auto;">
  `;
  
  tutorState.conversation.forEach((c, i) => {
    const levelColors = { correct: 'var(--secondary)', partial: 'var(--accent)', misconception: 'var(--primary)', incorrect: 'var(--text-muted)' };
    const levelLabels = { correct: '✓', partial: '~', misconception: '⚠', incorrect: '✗' };
    summaryHtml += `
      <div style="margin-bottom: 16px; padding: 12px; background: var(--bg); border-radius: 8px;">
        <div style="font-weight: 600; margin-bottom: 8px;">Q${i+1}: ${c.question.slice(0, 80)}...</div>
        <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 8px;">Your answer: "${c.answer.slice(0, 150)}${c.answer.length > 150 ? '...' : ''}"</div>
        <div style="font-size: 0.8125rem; color: ${levelColors[c.evaluation.level]};">${levelLabels[c.evaluation.level]} ${c.evaluation.level.charAt(0).toUpperCase() + c.evaluation.level.slice(1)}</div>
      </div>
    `;
  });
  
  summaryHtml += `</div></details>`;
  
  sessionSummary.innerHTML = summaryHtml;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.typing-indicator {
  display: flex; gap: 8px; align-items: center; padding: 8px 0;
}
.typing-dots {
  display: flex; gap: 4px;
}
.typing-dots span {
  width: 8px; height: 8px; border-radius: 50%; background: var(--primary);
  animation: bounce 1.4s infinite ease-in-out both;
}
.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
.input-hints {
  display: flex; gap: 16px; margin: 8px 0; font-size: 0.8125rem; color: var(--text-muted);
}
.input-area {
  margin-top: 16px;
}
.input-area textarea {
  width: 100%; min-height: 100px; padding: 12px; border: 2px solid var(--border);
  border-radius: 12px; font-family: inherit; font-size: 1rem; resize: vertical;
  background: var(--bg-card); color: var(--text);
}
.input-area textarea:focus { outline: 3px solid var(--primary-light); border-color: var(--primary); }
.input-area button { margin-top: 12px; width: 100%; }
.phase-transition { animation: slideIn 0.4s ease; }
@keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(style);