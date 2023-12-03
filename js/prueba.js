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
        {
          cards: ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E'],
          flipTime: 600
        },
        {
          cards: ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'],
          flipTime: 500
        }
        // Puedes añadir más niveles con más cartas aquí
      ];
  
    let currentLevel = 0;
    let cards = levels[currentLevel].cards;
    let openedCards = [];
    let canFlip = true;
    let movesCount = 0;
  
    // Función startGame() para validar el nombre de usuario antes de comenzar el juego
    function startGame() {
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
      
        if (username === '') {
          alert('Por favor, ingrese un nombre de usuario antes de comenzar el juego.');
        } else {
          document.querySelector('.username').textContent = username; // Mostrar el nombre de usuario
      
          createBoard(); // Agregar esta línea para iniciar el juego
        }
      }
      
  
    // Función para mezclar el array de cartas
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
  
    // Función para crear el tablero de juego
    function createBoard() {
      gameContainer.innerHTML = ''; // Limpiar el contenido actual del contenedor
    
      shuffle(cards);
      cards.forEach(function (card) {
        const div = document.createElement('div');
        div.textContent = card;
        div.classList.add('card');
        div.setAttribute('data-card', card);
        gameContainer.appendChild(div);
      });
    }
  
    // Función que maneja el clic en las cartas
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
  
    // Resto del código relacionado con la lógica del juego
  // Función para verificar si las cartas coinciden
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
      setTimeout(loadNextLevel, 1000);
    }
  }
  
// Declarar una variable para almacenar los puntajes
let totalScore = 0;

function advanceToNextLevel() {
  // Incrementar el nivel actual
  currentLevel++;

  if (currentLevel < levels.length) {
    // Calcular el tiempo restante y movimientos
    const timeLeft = 120; // Ejemplo de tiempo restante (en segundos)
    const baseScore = 1000; // Puntaje base por completar el nivel
    const timePenalty = (120 - timeLeft) * (currentLevel + 1); // Penalización por tiempo (ajusta según tu lógica)
    const movesPenalty = movesCount * 3; // Penalización por movimientos

    // Calcular puntaje total
    const timeScore = Math.max(baseScore - timePenalty, 0);
    const movesScore = Math.max(baseScore - movesPenalty, 0);

    const levelScore = Math.floor((timeScore + movesScore) / 2); // Puntaje del nivel

    // Sumar el puntaje del nivel al puntaje total
    totalScore += levelScore;

    // Mostrar el puntaje actual en el HTML
    document.querySelector('.score').textContent = totalScore;

    // Guardar el puntaje total en el localStorage con el nombre de usuario
    const username = document.querySelector('.username').textContent;
    const userScore = { username, score: totalScore };
    saveHighScore(userScore);

    // Reiniciar el contador de movimientos para el siguiente nivel
    movesCount = 0;

    // Cargar el siguiente nivel
    cards = levels[currentLevel].cards;
    createBoard();
  } else {
    showWinMessage();
  }
}

// Función para guardar el puntaje en el localStorage
function saveHighScore(userScore) {
  let highScores = loadHighScores();

  // Agregar el nuevo puntaje al array de highscores
  highScores.push(userScore);

  // Ordenar los highscores de mayor a menor
  highScores.sort((a, b) => b.score - a.score);

  // Mantener solo los 10 mejores puntajes
  highScores = highScores.slice(0, 10);

  // Guardar los highscores actualizados en el localStorage
  localStorage.setItem('highScores', JSON.stringify(highScores));

  // Mostrar los highscores actualizados
  showScores(highScores);
}

// Función para cargar los highscores desde el localStorage
function loadHighScores() {
  const highScores = localStorage.getItem('highScores');

  if (highScores) {
    return JSON.parse(highScores);
  } else {
    return [];
  }
}

  });
  