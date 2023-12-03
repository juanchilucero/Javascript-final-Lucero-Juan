document.addEventListener('DOMContentLoaded', function () {
  const gameContainer = document.querySelector('.game-container');
  const restartButton = document.querySelector('.restart-button');
  const userInput = document.querySelector('.user-input');
  const startButton = document.getElementById('startButton');
  const usernameInput = document.getElementById('username');

  startButton.addEventListener('click', startGame);

  const levels = [
    {
      cards: ['A', 'A', 'B', 'B', 'C', 'C'],
      flipTime: 1000 // Tiempo para voltear las cartas en milisegundos
    },
    {
      cards: ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'],
      flipTime: 800
    },
    // {
    //   cards: ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E'],
    //   flipTime: 600
    // },
    // {
    //   cards: ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'],
    //   flipTime: 500
    // }
  ];

  let currentLevel = 0;
  let cards = levels[currentLevel].cards;
  let openedCards = [];
  let canFlip = true;
  let movesCount = 0;

  // Función startGame() 
  function startGame() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
  
    if (username === '') {
      alert('Por favor, ingrese un nombre de usuario antes de comenzar el juego.');
    } else {
      document.querySelector('.username').textContent = username; 
      const gameContainer = document.querySelector('.game-container');
      gameContainer.classList.remove('hidden'); 
  
      createAndShuffleBoard(); 
    }
  }

  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
  

    while (currentIndex !== 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  

  function createAndShuffleBoard() {
    gameContainer.innerHTML = '';
  
    shuffle(cards);

    cards.forEach(function (card) {
      const div = document.createElement('div');
      div.textContent = card;
      div.classList.add('card');
      div.setAttribute('data-card', card);
      gameContainer.appendChild(div);
  
      // Añadir evento a cada carta
      div.addEventListener('click', handleClick);
    });
  }
  
  // Función que maneja el clic
  function handleClick(event) {
    const currentCard = event.target;
    if (!canFlip || currentCard === gameContainer || currentCard.classList.contains('matched') || openedCards.length === 2) {
      return;
    }
  
    currentCard.classList.add('open');
    currentCard.textContent = currentCard.getAttribute('data-card');
    openedCards.push(currentCard);
  
    if (openedCards.length === 2) {
      canFlip = false;
      setTimeout(checkMatch, levels[currentLevel].flipTime);
    }
  }
// Función para verificar
function checkMatch() {
  const [card1, card2] = openedCards;
  const card1Value = card1.getAttribute('data-card');
  const card2Value = card2.getAttribute('data-card');

  if (card1Value === card2Value) {
    card1.classList.add('matched');
    card2.classList.add('matched');
  } else {
    card1.classList.remove('open');
    card2.classList.remove('open');
    card1.textContent = '';
    card2.textContent = '';
  }

  openedCards = [];
  canFlip = true;

  const allMatched = document.querySelectorAll('.card:not(.matched)').length === 0;
  if (allMatched) {
    setTimeout(advanceToNextLevel, 1000);
  }
}

//scores y nivel
let totalScore = 0;

function advanceToNextLevel() {
  currentLevel++;

  if (currentLevel < levels.length) {

    const timeLeft = 120; 
    const baseScore = 1000;
    const timePenalty = (120 - timeLeft) * (currentLevel + 1); 
    const movesPenalty = movesCount * 3;

    const timeScore = Math.max(baseScore - timePenalty, 0);
    const movesScore = Math.max(baseScore - movesPenalty, 0);

    const levelScore = Math.floor((timeScore + movesScore) / 2);


    totalScore += levelScore;


    document.querySelector('.score').textContent = totalScore;

    // guardar storage
    const username = document.querySelector('.username').textContent;
    const userScore = { username, score: totalScore };
    saveHighScore(userScore);

    // reinicio contador movimientos
    movesCount = 0;

    // Cargar nivel
    cards = levels[currentLevel].cards;
    createBoard();
  } else {
    showWinMessage("Has ganado");
  }
}

// 
// function saveHighScore(userScore) {
//   let highScores = loadHighScores();

// 
//   highScores.push(userScore);

//   // Ordenar highscores
//   highScores.sort((a, b) => b.score - a.score);

//  
//   highScores = highScores.slice(0, 10);

// 
//   localStorage.setItem('highScores', JSON.stringify(highScores));

// 
//   showScores(highScores);
// }

// cargar highscores
// function loadHighScores() {
//   const highScores = localStorage.getItem('highScores');

//   if (highScores) {
//     return JSON.parse(highScores);
//   } else {
//     return [];
//   }
// }

});
