const questions = [
  {
    question: 'When you imagine the future, what energizes you most?',
    answers: [
      { text: 'Designing meaningful tools for people', value: 'creation', label: 'Design systems' },
      { text: 'Mapping new possibilities and patterns', value: 'vision', label: 'Pattern mapping' },
      { text: 'Building resilient communities', value: 'care', label: 'Human-centered' },
      { text: 'Exploring the edges of technology', value: 'innovation', label: 'Tech frontier' }
    ]
  },
  {
    question: 'Which environment feels like a natural creative habitat?',
    answers: [
      { text: 'A collaborative studio full of prototypes', value: 'creation', label: 'Cohort studio' },
      { text: 'A quiet digital observatory overlooking data', value: 'vision', label: 'Remote observatory' },
      { text: 'A community lab that blends art and care', value: 'care', label: 'Community lab' },
      { text: 'A vast, fast-moving network of experiments', value: 'innovation', label: 'Experimental grid' }
    ]
  },
  {
    question: 'What kind of contribution feels most rewarding?',
    answers: [
      { text: 'Making things that reshape culture', value: 'creation', label: 'Cultural maker' },
      { text: 'Finding hidden insight in complex systems', value: 'vision', label: 'Systems thinker' },
      { text: 'Helping people feel seen and supported', value: 'care', label: 'Support architect' },
      { text: 'Launching the unexpected into the world', value: 'innovation', label: 'Future pioneer' }
    ]
  },
  {
    question: 'How do you make decisions when uncertainty rises?',
    answers: [
      { text: 'Prototype quickly and learn in motion', value: 'creation', label: 'Prototype first' },
      { text: 'Gather patterns and interpret the signal', value: 'vision', label: 'Read the pattern' },
      { text: 'Consider the human impact before moving', value: 'care', label: 'Human lens' },
      { text: 'Exploit chance to discover a breakthrough', value: 'innovation', label: 'Take the leap' }
    ]
  },
  {
    question: 'What kind of future story excites you most?',
    answers: [
      { text: 'New artistic movements and expressive tech', value: 'creation', label: 'Artic tech' },
      { text: 'Cities driven by intelligence and insight', value: 'vision', label: 'Cognitive city' },
      { text: 'A humane future with stronger care networks', value: 'care', label: 'Human first' },
      { text: 'Rapid expansion beyond today’s limits', value: 'innovation', label: 'New frontier' }
    ]
  },
  {
    question: 'Where do you tend to lead?',
    answers: [
      { text: 'At the creative edge of a team', value: 'creation', label: 'Creative lead' },
      { text: 'At the strategic threshold of discovery', value: 'vision', label: 'Strategy lead' },
      { text: 'At the center of relationships and trust', value: 'care', label: 'Care lead' },
      { text: 'At the frontier of innovation and risk', value: 'innovation', label: 'Breakthrough lead' }
    ]
  },
  {
    question: 'Which rhythm best matches your creative flow?',
    answers: [
      { text: 'Iterating with instinct and material experiments', value: 'creation', label: 'Iteration loop' },
      { text: 'Researching, comparing, and refining systems', value: 'vision', label: 'Insight loop' },
      { text: 'Listening, responding, and strengthening trust', value: 'care', label: 'Care loop' },
      { text: 'Pushing beyond the norm at full speed', value: 'innovation', label: 'Momentum loop' }
    ]
  },
  {
    question: 'If your future self had a signature, what would it be?',
    answers: [
      { text: 'A visionary medium blending art and technology', value: 'creation', label: 'Expressive systems' },
      { text: 'An analytical lens for future strategy', value: 'vision', label: 'Strategic clarity' },
      { text: 'A compassionate platform for collective connection', value: 'care', label: 'Collective care' },
      { text: 'A breakthrough engine of ambition and velocity', value: 'innovation', label: 'Velocity engine' }
    ]
  }
];

const profiles = {
  creation: {
    title: 'The Aesthetic Architect',
    summary: 'You build worlds where culture, emotion, and technology converge into something beautifully expressive.',
    strengths: ['Immersive design thinking', 'Story-driven systems', 'High creative velocity', 'Cross-disciplinary synthesis'],
    futures: ['Cultural innovation labs', 'Design-led AI experiences', 'New media ecosystems'],
    description: 'Your creative DNA thrives on sensation, meaning, and atmosphere. You turn abstract signals into living futures, shaping how people feel before they fully understand why.'
  },
  vision: {
    title: 'The Pattern Oracle',
    summary: 'You perceive future systems before others can name them, translating complexity into elegant direction.',
    strengths: ['Strategic foresight', 'Systems thinking', 'Pattern recognition', 'Clear synthesis'],
    futures: ['Future strategy studios', 'Urban intelligence platforms', 'Policy-creative labs'],
    description: 'Your profile leans toward insight and coherence. You detect signal in chaos, move from noise to narrative, and help organizations adapt before the future becomes obvious.'
  },
  care: {
    title: 'The Human Circuit',
    summary: 'You design futures that feel trusted, humane, and alive—a future where collective well-being is the primary technology.',
    strengths: ['Empathy-driven design', 'Community resonance', 'Trust building', 'Inclusive systems'],
    futures: ['Care technology networks', 'Human-centered public systems', 'Community intelligence hubs'],
    description: 'Your future direction is grounded in belonging. You build pathways that allow communities to thrive while technology remains a servant to human meaning.'
  },
  innovation: {
    title: 'The Frontier Signal',
    summary: 'You are drawn toward movement, invention, and the adrenaline of a new world becoming visible.',
    strengths: ['Risk tolerance', 'Breakthrough thinking', 'Momentum', 'Prototype-driven action'],
    futures: ['Experimental orbit labs', 'Autonomous infrastructure', 'Next-signal startups'],
    description: 'Your energy pushes beyond the familiar. You thrive in early-stage possibility, where ambiguity becomes fuel and invention becomes identity.'
  }
};

const state = {
  currentIndex: 0,
  answers: Array(questions.length).fill(null),
  result: null
};

function getProfileKeyFromScores(scores) {
  const topKey = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return topKey;
}

function buildResult() {
  const scores = { creation: 0, vision: 0, care: 0, innovation: 0 };

  state.answers.forEach((answerValue) => {
    if (!answerValue) return;
    scores[answerValue] += 1;
  });

  const profileKey = getProfileKeyFromScores(scores);
  const profile = profiles[profileKey];
  const profileData = {
    type: profileKey,
    title: profile.title,
    summary: profile.summary,
    description: profile.description,
    strengths: profile.strengths,
    futures: profile.futures,
    timestamp: new Date().toISOString()
  };

  state.result = profileData;
  return profileData;
}

function renderQuestion() {
  const question = questions[state.currentIndex];
  const questionCard = document.getElementById('questionCard');
  const progressLabel = document.getElementById('progressLabel');
  const progressBar = document.getElementById('progressBar');
  const nextButton = document.getElementById('nextButton');
  const backButton = document.getElementById('backButton');

  if (!questionCard || !progressLabel || !progressBar || !nextButton || !backButton) return;

  const current = state.currentIndex + 1;
  const progressPercent = (current / questions.length) * 100;
  progressLabel.textContent = `${current} / ${questions.length}`;
  progressBar.style.width = `${progressPercent}%`;

  questionCard.innerHTML = `
    <p class="eyebrow">QUESTION ${current}</p>
    <h3>${question.question}</h3>
    <div class="answer-list">
      ${question.answers
        .map((answer, idx) => {
          const selected = state.answers[state.currentIndex] === answer.value;
          return `
            <button class="answer-option ${selected ? 'selected' : ''}" type="button" data-answer="${answer.value}">
              <span>${String.fromCharCode(65 + idx)}</span>
              <div>
                <strong>${answer.text}</strong>
                <small>${answer.label}</small>
              </div>
            </button>
          `;
        })
        .join('')}
    </div>
  `;

  questionCard.querySelectorAll('.answer-option').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.answer;
      state.answers[state.currentIndex] = selected;
      renderQuestion();
    });
  });

  backButton.disabled = state.currentIndex === 0;
  backButton.style.opacity = state.currentIndex === 0 ? '0.45' : '1';
  nextButton.textContent = state.currentIndex === questions.length - 1 ? 'Reveal profile' : 'Next';
  nextButton.disabled = !state.answers[state.currentIndex];
}

function renderResult() {
  const resultSection = document.getElementById('resultSection');
  const quizSection = document.getElementById('quizSection');
  const resultContent = document.getElementById('resultContent');
  if (!resultSection || !quizSection || !resultContent) return;

  const result = buildResult();
  const profile = profiles[result.type];

  resultContent.innerHTML = `
    <div class="result-card">
      <p class="eyebrow">PROFILE DETECTED</p>
      <h3>${result.title}</h3>
      <p class="profile-summary">${result.summary}</p>
      <p>${result.description}</p>
      <ul class="profile-stats">
        <li><strong>Strengths</strong><span>${profile.strengths.join(', ')}</span></li>
        <li><strong>Suggested futures</strong><span>${profile.futures.join(', ')}</span></li>
      </ul>
      <p><strong>Creative personality profile:</strong> This output is a local, playful synthesis of your responses and is not a scientific diagnosis or prediction. It is designed to help you reflect on possible creative strengths and future directions.</p>
    </div>
  `;

  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
  safeWriteStorage(STORAGE_KEYS.latestResult, result);
  showToast('Profile saved locally.', 'success');
}

function resetQuiz() {
  state.currentIndex = 0;
  state.answers = Array(questions.length).fill(null);
  state.result = null;

  const resultSection = document.getElementById('resultSection');
  const quizSection = document.getElementById('quizSection');
  if (resultSection) resultSection.classList.add('hidden');
  if (quizSection) quizSection.classList.remove('hidden');

  renderQuestion();
}

function initQuiz() {
  const nextButton = document.getElementById('nextButton');
  const backButton = document.getElementById('backButton');
  const retakeButton = document.getElementById('retakeButton');
  const saveResultButton = document.getElementById('saveResultButton');

  if (!nextButton || !backButton) return;

  nextButton.addEventListener('click', () => {
    if (state.currentIndex < questions.length - 1) {
      state.currentIndex += 1;
      renderQuestion();
      return;
    }

    renderResult();
  });

  backButton.addEventListener('click', () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderQuestion();
    }
  });

  retakeButton?.addEventListener('click', resetQuiz);

  saveResultButton?.addEventListener('click', () => {
    if (!state.result) {
      showToast('No profile result to save yet.', 'error');
      return;
    }

    const archive = safeReadStorage(STORAGE_KEYS.archive) || [];
    archive.push({
      id: Date.now(),
      type: 'identity',
      title: state.result.title,
      description: state.result.summary,
      details: state.result,
      createdAt: new Date().toISOString()
    });

    if (!safeWriteStorage(STORAGE_KEYS.archive, archive)) {
      showToast('Could not save this profile to the archive.', 'error');
      return;
    }

    showToast('Result added to Memory Archive.', 'success');
  });

  renderQuestion();
  const savedResult = safeReadStorage(STORAGE_KEYS.latestResult);
  if (savedResult) {
    state.result = savedResult;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'identity') return;
  initQuiz();
});
