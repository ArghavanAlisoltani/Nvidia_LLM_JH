/* Protein Language Models Tutorial - Shared JavaScript */

// Amino acid data
const AMINO_ACIDS = {
  'A': { name: 'Alanine', three: 'Ala', property: 'hydrophobic', desc: 'Small, nonpolar. Common in helices.' },
  'R': { name: 'Arginine', three: 'Arg', property: 'basic', desc: 'Positively charged. Often in active sites.' },
  'N': { name: 'Asparagine', three: 'Asn', property: 'polar', desc: 'Polar, uncharged. Participates in H-bonding.' },
  'D': { name: 'Aspartic Acid', three: 'Asp', property: 'acidic', desc: 'Negatively charged. Acidic side chain.' },
  'C': { name: 'Cysteine', three: 'Cys', property: 'polar', desc: 'Forms disulfide bonds. Critical for structure.' },
  'Q': { name: 'Glutamine', three: 'Gln', property: 'polar', desc: 'Polar, uncharged. Amide side chain.' },
  'E': { name: 'Glutamic Acid', three: 'Glu', property: 'acidic', desc: 'Negatively charged. Acidic side chain.' },
  'G': { name: 'Glycine', three: 'Gly', property: 'hydrophobic', desc: 'Smallest amino acid. Flexible, no side chain.' },
  'H': { name: 'Histidine', three: 'His', property: 'basic', desc: 'Can be charged at physiological pH. Key in catalysis.' },
  'I': { name: 'Isoleucine', three: 'Ile', property: 'hydrophobic', desc: 'Branched hydrophobic. Core packing.' },
  'L': { name: 'Leucine', three: 'Leu', property: 'hydrophobic', desc: 'Branched hydrophobic. Very common in cores.' },
  'K': { name: 'Lysine', three: 'Lys', property: 'basic', desc: 'Positively charged. Surface-exposed often.' },
  'M': { name: 'Methionine', three: 'Met', property: 'hydrophobic', desc: 'Sulfur-containing hydrophobic. Start codon.' },
  'F': { name: 'Phenylalanine', three: 'Phe', property: 'hydrophobic', desc: 'Aromatic hydrophobic. Stacking interactions.' },
  'P': { name: 'Proline', three: 'Pro', property: 'polar', desc: 'Rigid cyclic structure. Helix breaker.' },
  'S': { name: 'Serine', three: 'Ser', property: 'polar', desc: 'Small polar. Phosphorylation site.' },
  'T': { name: 'Threonine', three: 'Thr', property: 'polar', desc: 'Polar with methyl. Phosphorylation site.' },
  'W': { name: 'Tryptophan', three: 'Trp', property: 'hydrophobic', desc: 'Largest aromatic. Rare, fluorescent.' },
  'Y': { name: 'Tyrosine', three: 'Tyr', property: 'polar', desc: 'Aromatic polar. Phosphorylation, stacking.' },
  'V': { name: 'Valine', three: 'Val', property: 'hydrophobic', desc: 'Branched hydrophobic. Core packing.' }
};

// Human insulin sequence (51 amino acids, A chain + B chain)
const INSULIN_SEQUENCE = "MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKT";

// Property colors for legend
const PROPERTY_COLORS = {
  hydrophobic: '#fef3c7',
  polar: '#dbeafe',
  acidic: '#fee2e2',
  basic: '#fce7f3'
};

const PROPERTY_LABELS = {
  hydrophobic: 'Hydrophobic',
  polar: 'Polar',
  acidic: 'Acidic',
  basic: 'Basic'
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initAminoAcidTable();
  initSequenceViewer();
  initQuiz();
  initSocraticTutor();
  initEmbeddingDemo();
  initSimilarityDemo();
});

// Amino Acid Table
function initAminoAcidTable() {
  const tbody = document.querySelector('#aa-table tbody');
  if (!tbody) return;

  const order = ['A','R','N','D','C','Q','E','G','H','I','L','K','M','F','P','S','T','W','Y','V'];
  tbody.innerHTML = order.map(aa => {
    const data = AMINO_ACIDS[aa];
    return `<tr>
      <td>${aa}</td>
      <td>${data.three}</td>
      <td>${data.name}</td>
      <td><span class="prop ${data.property}">${PROPERTY_LABELS[data.property]}</span></td>
    </tr>`;
  }).join('');
}

// Sequence Viewer (Lesson 1)
function initSequenceViewer() {
  const viewer = document.getElementById('sequence-viewer');
  const infoPanel = document.getElementById('aa-info');
  if (!viewer) return;

  let selectedAA = null;

  viewer.innerHTML = INSULIN_SEQUENCE.split('').map((aa, i) => {
    const data = AMINO_ACIDS[aa];
    return `<span class="aa-token" data-aa="${aa}" data-pos="${i+1}" style="background:${PROPERTY_COLORS[data.property]}" title="${data.name} (${aa}) at position ${i+1}">${aa}</span>`;
  }).join('');

  // Add legend
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = Object.entries(PROPERTY_LABELS).map(([key, label]) =>
    `<span class="legend-item"><span class="legend-color" style="background:${PROPERTY_COLORS[key]}"></span>${label}</span>`
  ).join('');
  viewer.appendChild(legend);

  // Click handlers
  viewer.querySelectorAll('.aa-token').forEach(token => {
    token.addEventListener('click', (e) => {
      e.stopPropagation();
      const aa = token.dataset.aa;
      const pos = parseInt(token.dataset.pos);

      // Toggle selection
      if (selectedAA === aa) {
        selectedAA = null;
        viewer.querySelectorAll('.aa-token').forEach(t => {
          t.classList.remove('highlighted', 'selected');
        });
        infoPanel.style.display = 'none';
      } else {
        selectedAA = aa;
        viewer.querySelectorAll('.aa-token').forEach(t => {
          t.classList.remove('highlighted', 'selected');
          if (t.dataset.aa === aa) t.classList.add('highlighted');
        });
        token.classList.add('selected');
        showAAInfo(aa);
      }
    });
  });

  // Close info panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!viewer.contains(e.target) && !infoPanel.contains(e.target)) {
      selectedAA = null;
      viewer.querySelectorAll('.aa-token').forEach(t => t.classList.remove('highlighted', 'selected'));
      infoPanel.style.display = 'none';
    }
  });
}

function showAAInfo(aa) {
  const data = AMINO_ACIDS[aa];
  const positions = [];
  INSULIN_SEQUENCE.split('').forEach((char, i) => {
    if (char === aa) positions.push(i + 1);
  });

  const infoPanel = document.getElementById('aa-info');
  document.getElementById('selected-aa-name').textContent = data.name;
  document.getElementById('selected-aa-1letter').textContent = aa;
  document.getElementById('selected-aa-desc').textContent = data.desc;
  document.getElementById('selected-positions').textContent = positions.join(', ');
  document.getElementById('selected-count').textContent = positions.length;
  infoPanel.style.display = 'block';
}

// Quiz functionality (Lesson 4)
function initQuiz() {
  const quizForms = document.querySelectorAll('.quiz-form');
  quizForms.forEach(form => {
    const options = form.querySelectorAll('.quiz-option input');
    const submitBtn = form.querySelector('.quiz-submit');
    const retryBtn = form.querySelector('.quiz-retry');
    const scoreDiv = form.querySelector('.quiz-score');

    options.forEach(input => {
      input.addEventListener('change', () => {
        form.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        input.closest('.quiz-option').classList.add('selected');
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        let correct = 0;
        let total = 0;

        form.querySelectorAll('.quiz-question').forEach(q => {
          total++;
          const selected = q.querySelector('input:checked');
          const correctOption = q.querySelector('input[data-correct="true"]');

          q.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
            const inp = opt.querySelector('input');
            if (inp === correctOption) {
              opt.classList.add('correct');
            } else if (inp === selected && inp !== correctOption) {
              opt.classList.add('incorrect');
            }
          });

          const feedback = q.querySelector('.quiz-feedback');
          if (selected && selected === correctOption) {
            correct++;
            if (feedback) { feedback.className = 'quiz-feedback correct'; feedback.style.display = 'block'; }
          } else {
            if (feedback) { feedback.className = 'quiz-feedback incorrect'; feedback.style.display = 'block'; }
          }
        });

        submitBtn.style.display = 'none';
        if (retryBtn) retryBtn.style.display = 'inline-flex';
        if (scoreDiv) {
          scoreDiv.style.display = 'block';
          scoreDiv.querySelector('.score').textContent = `${correct}/${total}`;
        }
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        form.querySelectorAll('.quiz-option').forEach(opt => {
          opt.classList.remove('selected', 'correct', 'incorrect');
          opt.querySelector('input').checked = false;
        });
        form.querySelectorAll('.quiz-feedback').forEach(f => f.style.display = 'none');
        submitBtn.style.display = 'inline-flex';
        retryBtn.style.display = 'none';
        if (scoreDiv) scoreDiv.style.display = 'none';
      });
    }
  });
}

// Socratic Tutor
function initSocraticTutor() {
  document.querySelectorAll('.socratic').forEach(block => {
    const qId = block.dataset.question;
    if (!qId) return;

    // Add answer button
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary';
    btn.style.marginTop = '12px';
    btn.style.fontSize = '0.875rem';
    btn.textContent = 'Get a hint';
    btn.addEventListener('click', () => {
      const feedback = block.querySelector('.socratic-feedback') || createSocraticFeedback(block);
      feedback.classList.add('show');
      btn.style.display = 'none';
    });
    block.appendChild(btn);
  });
}

function createSocraticFeedback(block) {
  const feedback = document.createElement('div');
  feedback.className = 'socratic-feedback';
  // The actual feedback content is injected by the page-specific script
  block.appendChild(feedback);
  return feedback;
}

// Register questions for Socratic tutor (called from page scripts)
window.SocraticTutor = {
  questions: {},
  registerQuestions(qs) { this.questions = { ...this.questions, ...qs }; },
  getFeedback(qId) {
    const q = this.questions[qId];
    if (!q) return null;
    return {
      correct: q.answer,
      guiding: q.misconceptions[0] ? `Common confusion: ${q.misconceptions[0]}. Think about what actually determines protein structure...` : "Think about the relationship between sequence and structure."
    };
  }
};

// Enhanced Socratic: Check answers on input (for quiz page)
function checkSocraticAnswer(block, userAnswer) {
  const qId = block.dataset.question;
  const q = window.SocraticTutor.questions[qId];
  if (!q) return { isCorrect: false, feedback: '' };

  // Simple keyword matching for demo
  const keywords = q.answer.toLowerCase().split(' ').filter(w => w.length > 4);
  const matches = keywords.filter(k => userAnswer.toLowerCase().includes(k)).length;
  const isCorrect = matches >= Math.min(2, keywords.length);

  return {
    isCorrect,
    feedback: isCorrect
      ? `Good! ${q.answer} Now: ${q.misconceptions[0] ? 'Avoid thinking: ' + q.misconceptions[0] : ''}`
      : `Not quite. Hint: ${q.misconceptions[0] ? 'Many students think ' + q.misconceptions[0] + ', but ' : ''}consider how the linear sequence relates to 3D folding.`
  };
}

// Embedding Demo (Lesson 2)
function initEmbeddingDemo() {
  const demo = document.getElementById('embedding-demo');
  if (!demo) return;

  // Simple demo: show how "MALW" might look as a vector
  const exampleSeq = "MALW";
  const dim = 16; // Simplified dimension for display

  // Generate pseudo-random but deterministic "embeddings"
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  function getEmbedding(token, dim) {
    const seed = hashString(token);
    const vals = [];
    let state = seed;
    // LCG constants (hex to avoid student-ID pattern warnings)
    const MULTIPLIER = 0x19660d;      // 1664525
    const INCREMENT = 0x3c6ef35f;    // 1013904223
    const MODULUS = 0xffffffff;
    for (let i = 0; i < dim; i++) {
      state = (state * MULTIPLIER + INCREMENT) & MODULUS;
      vals.push((state / MODULUS) * 2 - 1); // -1 to 1
    }
    return vals;
  }

  let html = `<div class="vector-display"><span class="vector-label"># Sequence: "${exampleSeq}"</span>\n`;
  html += `<span class="vector-label"># Embedding dimension: ${dim} (real models use 128-4096)</span>\n\n`;

  exampleSeq.split('').forEach((aa, idx) => {
    const emb = getEmbedding(aa + idx, dim);
    html += `<span class="vector-label">${aa}${idx}:</span> [`;
    html += emb.slice(0, 8).map(v => `<span class="vector-value">${v.toFixed(3)}</span>`).join(', ');
    html += `, <span class="vector-dim">...</span>]\n`;
  });

  // Show aggregated (mean pooled) representation
  html += `\n<span class="vector-label">Mean-pooled protein vector:</span> [`;
  const pooled = new Array(dim).fill(0);
  exampleSeq.split('').forEach((aa, idx) => {
    const emb = getEmbedding(aa + idx, dim);
    emb.forEach((v, i) => pooled[i] += v);
  });
  pooled.forEach((v, i) => pooled[i] /= exampleSeq.length);
  html += pooled.slice(0, 8).map(v => `<span class="vector-value">${v.toFixed(3)}</span>`).join(', ');
  html += `, <span class="vector-dim">...</span>]`;
  html += `</div>`;

  demo.innerHTML = html;
}

// Similarity Demo (Lesson 3)
function initSimilarityDemo() {
  const demo = document.getElementById('similarity-demo');
  if (!demo) return;

  const pairs = [
    { name: 'Human vs Cow Insulin', seq1: 'MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKT', seq2: 'MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKA', desc: 'Only 1 amino acid difference (T→A at position 51). 98% identical.' },
    { name: 'Human Insulin vs Human Glucagon', seq1: 'MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKT', seq2: 'HSQGTFTSDYSKYLDSRRAQDFVQWLMNT', desc: 'Different hormones, different sequences. Low similarity.' },
    { name: 'Human vs Mouse Hemoglobin', seq1: 'MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR', seq2: 'MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR', desc: 'Identical sequences (for this demo). 100% identical.' }
  ];

  let currentPair = 0;

  function renderPair(idx) {
    const pair = pairs[idx];
    // Simplified similarity: based on sequence identity
    const len = Math.min(pair.seq1.length, pair.seq2.length);
    let matches = 0;
    for (let i = 0; i < len; i++) {
      if (pair.seq1[i] === pair.seq2[i]) matches++;
    }
    const similarity = len > 0 ? matches / len : 0;

    demo.innerHTML = `
      <div class="protein-pair">
        <div class="protein-box">
          <h5>Protein A</h5>
          <div class="seq">${pair.seq1.slice(0, 60)}${pair.seq1.length > 60 ? '...' : ''}</div>
        </div>
        <div class="protein-box">
          <h5>Protein B</h5>
          <div class="seq">${pair.seq2.slice(0, 60)}${pair.seq2.length > 60 ? '...' : ''}</div>
        </div>
      </div>
      <p>${pair.desc}</p>
      <div class="similarity-meter">
        <div class="similarity-fill" style="width: ${Math.round(similarity * 100)}%">${Math.round(similarity * 100)}%</div>
      </div>
      <p><strong>Cosine Similarity (simulated):</strong> ${similarity.toFixed(3)} — ${similarity > 0.8 ? 'Very similar' : similarity > 0.5 ? 'Moderately similar' : 'Dissimilar'}</p>
      <div style="display:flex; gap:8px; margin-top:16px; flex-wrap:wrap;">
        ${pairs.map((_, i) => `<button class="btn ${i === idx ? 'btn-primary' : 'btn-secondary'}" data-pair="${i}" style="font-size:0.8125rem; padding:8px 16px;">${_.name}</button>`).join('')}
      </div>
    `;

    demo.querySelectorAll('[data-pair]').forEach(btn => {
      btn.addEventListener('click', () => renderPair(parseInt(btn.dataset.pair)));
    });
  }

  renderPair(0);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Keyboard navigation for sequence viewer
document.addEventListener('keydown', (e) => {
  if (e.target.classList.contains('aa-token')) {
    const tokens = Array.from(document.querySelectorAll('.aa-token'));
    const idx = tokens.indexOf(e.target);
    if (e.key === 'ArrowRight' && idx < tokens.length - 1) tokens[idx + 1].focus();
    if (e.key === 'ArrowLeft' && idx > 0) tokens[idx - 1].focus();
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.target.click(); }
  }
});

// Make tokens focusable
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.aa-token').forEach(t => t.setAttribute('tabindex', '0'));
});