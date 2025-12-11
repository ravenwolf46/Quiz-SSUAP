import { QUIZZES } from './quizzes.js';

const state = {
  currentQuiz: null
};

const quizSelect = document.getElementById('quiz-select');
const board = document.getElementById('board');
const feedback = document.getElementById('feedback-text');
const progressBar = document.getElementById('progress-bar');
const quizTitle = document.getElementById('quiz-title');
const quizDesc = document.getElementById('quiz-desc');

const shuffleBtn = document.getElementById('shuffle');
const restartBtn = document.getElementById('restart');
const checkBtn = document.getElementById('check');

function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function formatAlt(title, step) {
  return `Illustration ${step} du scénario ${title}`;
}

function createCard(image, title) {
  const card = document.createElement('article');
  card.className = 'card';
  card.draggable = true;
  card.tabIndex = 0;
  card.dataset.step = image.step;
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `Carte étape ${image.step}`);

  card.innerHTML = `
    <div class="card__media">
      <img src="${image.src}" alt="${formatAlt(title, image.step)}" />
      <span class="card__overlay">Position : <strong class="position">1</strong></span>
      <span class="card__status" aria-hidden="true"></span>
    </div>
    <div class="card__meta">
      <span class="badge">Glisse-moi</span>
      <div class="reorder" aria-hidden="false">
        <button type="button" class="move" data-direction="-1" aria-label="Déplacer à gauche">←</button>
        <button type="button" class="move" data-direction="1" aria-label="Déplacer à droite">→</button>
      </div>
    </div>
  `;

  addDragHandlers(card);
  addKeyboardReorder(card);
  return card;
}

function addDragHandlers(card) {
  card.addEventListener('dragstart', (event) => {
    event.dataTransfer.effectAllowed = 'move';
    card.classList.add('dragging');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    updatePositions();
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveCard(card, -1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveCard(card, 1);
    }
  });
}

function addKeyboardReorder(card) {
  card.querySelectorAll('.move').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const direction = Number(event.currentTarget.dataset.direction);
      moveCard(card, direction);
      card.focus();
    });
  });
}

function moveCard(card, direction) {
  const cards = Array.from(board.children);
  const currentIndex = cards.indexOf(card);
  const targetIndex = currentIndex + direction;

  if (targetIndex < 0 || targetIndex >= cards.length) return;

  const referenceNode = direction > 0 ? cards[targetIndex].nextSibling : cards[targetIndex];
  board.insertBefore(card, referenceNode);
  updatePositions();
}

function setupBoard(quiz) {
  board.innerHTML = '';
  const shuffled = shuffle(quiz.images);
  shuffled.forEach((image) => board.appendChild(createCard(image, quiz.title)));
  updatePositions(true);
  clearStatus();
}

function clearStatus() {
  feedback.textContent = 'Commence par mélanger et organiser les cartes.';
  progressBar.style.width = '0%';
  board.querySelectorAll('.card').forEach((card) => {
    card.classList.remove('correct', 'incorrect');
  });
}

function updatePositions(initial = false) {
  Array.from(board.children).forEach((card, index) => {
    const position = card.querySelector('.position');
    position.textContent = index + 1;
    if (!initial) {
      card.classList.remove('correct', 'incorrect');
    }
  });
}

function checkOrder() {
  const cards = Array.from(board.children);
  if (!cards.length) return;

  const expected = [...cards]
    .map((card) => Number(card.dataset.step))
    .sort((a, b) => a - b);

  let correctCount = 0;

  cards.forEach((card, index) => {
    const step = Number(card.dataset.step);
    const isCorrect = step === expected[index];
    card.classList.toggle('correct', isCorrect);
    card.classList.toggle('incorrect', !isCorrect);
    if (isCorrect) correctCount += 1;
  });

  const ratio = Math.round((correctCount / cards.length) * 100);
  progressBar.style.width = `${ratio}%`;
  feedback.textContent = `${correctCount}/${cards.length} carte${cards.length > 1 ? 's' : ''} bien placée${
    correctCount > 1 ? 's' : ''
  }. ${correctCount === cards.length ? 'Bravo, ordre parfait !' : 'Continue d’ajuster les cartes.'}`;
}

function handleQuizChange(event) {
  const quizId = event.target.value;
  const quiz = QUIZZES.find((item) => item.id === quizId);
  if (quiz) {
    state.currentQuiz = quiz;
    quizTitle.textContent = quiz.title;
    quizDesc.textContent = quiz.description;
    setupBoard(quiz);
  }
}

function init() {
  QUIZZES.forEach((quiz) => {
    const option = document.createElement('option');
    option.value = quiz.id;
    option.textContent = `${quiz.title} (${quiz.images.length} cartes)`;
    quizSelect.append(option);
  });

  quizSelect.addEventListener('change', handleQuizChange);

  board.addEventListener('dragover', (event) => {
    event.preventDefault();
    const dragging = document.querySelector('.dragging');
    if (!dragging) return;

    const target = event.target.closest('.card');
    if (target && target !== dragging && board.contains(target)) {
      const cards = Array.from(board.children);
      const targetIndex = cards.indexOf(target);
      const draggingIndex = cards.indexOf(dragging);
      if (draggingIndex < targetIndex) {
        board.insertBefore(dragging, target.nextSibling);
      } else {
        board.insertBefore(dragging, target);
      }
      updatePositions();
    }
  });

  shuffleBtn.addEventListener('click', () => {
    if (state.currentQuiz) setupBoard(state.currentQuiz);
  });

  restartBtn.addEventListener('click', () => {
    if (state.currentQuiz) setupBoard(state.currentQuiz);
  });

  checkBtn.addEventListener('click', checkOrder);

  if (QUIZZES.length) {
    state.currentQuiz = QUIZZES[0];
    quizSelect.value = state.currentQuiz.id;
    quizTitle.textContent = state.currentQuiz.title;
    quizDesc.textContent = state.currentQuiz.description;
    setupBoard(state.currentQuiz);
  }
}

init();
