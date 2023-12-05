const niveles = [
  { parejas: 5, imagenes: ['../imgs/anana.png', '../imgs/banana.png', '../imgs/cereza.png', '../imgs/coco.png', '../imgs/durazno.png'] },
  { parejas: 8, imagenes: ['../imgs/anana.png', '../imgs/banana.png', '../imgs/cereza.png', '../imgs/coco.png', '../imgs/durazno.png', '../imgs/frutilla.png', '../imgs/kiwi.png', '../imgs/manzana.png'] },
  { parejas: 12, imagenes: ['../imgs/anana.png', '../imgs/banana.png', '../imgs/cereza.png', '../imgs/coco.png', '../imgs/durazno.png', '../imgs/frutilla.png', '../imgs/kiwi.png', '../imgs/manzana.png', '../imgs/naranja.png', '../imgs/pera.png', '../imgs/sandia.png', '../imgs/uva.png'] }
];

let nivelActual = 0;
let cartas = [];
let cartasVolteadas = [];
let cartasCoincidentes = [];

function mezclar(array) {
  let currentIndex = array.length, temp, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
}

function crearTablero() {
  const nivel = niveles[nivelActual];
  const imagenesParaNivel = nivel.imagenes.slice(0, nivel.parejas);
  const imagenesDuplicadas = imagenesParaNivel.concat(imagenesParaNivel);
  cartas = mezclar(imagenesDuplicadas);

  const tablero = document.getElementById('tablero-juego');
  tablero.innerHTML = '';

  cartas.forEach((imagen, index) => {
    const carta = document.createElement('div');
    carta.classList.add('carta');

    const contenidoCarta = document.createElement('img');
    contenidoCarta.classList.add('contenido-carta');
    contenidoCarta.src = imagen;
    contenidoCarta.alt = 'Imagen de la carta';
    carta.appendChild(contenidoCarta);

    carta.addEventListener('click', voltearCarta);
    tablero.appendChild(carta);
  });
}

function voltearCarta() {
  if (cartasVolteadas.length < 2 && !this.classList.contains('volteada')) {
    this.classList.add('volteada');
    cartasVolteadas.push(this);

    if (cartasVolteadas.length === 2) {
      setTimeout(verificarCoincidencia, 1000);
    }
  }
}

function verificarCoincidencia() {
  const [carta1, carta2] = cartasVolteadas;
  const imagen1 = carta1.querySelector('.contenido-carta').src;
  const imagen2 = carta2.querySelector('.contenido-carta').src;

  if (imagen1 === imagen2) {
    cartasCoincidentes.push(carta1, carta2);
    carta1.removeEventListener('click', voltearCarta);
    carta2.removeEventListener('click', voltearCarta);
  } else {
    carta1.classList.remove('volteada');
    carta2.classList.remove('volteada');
  }

  cartasVolteadas = [];

  if (cartasCoincidentes.length === cartas.length) {
    setTimeout(() => {
      if (nivelActual < niveles.length - 1) {
        nivelActual++;
        alert('¡Pasaste al siguiente nivel!');
        crearTablero();
      } else {
        alert('¡Has completado todos los niveles! ¡Has ganado!');
      }
    }, 500);
  }
}
function iniciarJuego() {
  const nombreUsuario = document.getElementById('username').value;
  if (nombreUsuario.trim() !== '') {
    // Ocultar el ingreso de nombre
    document.getElementById('ingreso-nombre').style.display = 'none';

    // Mostrar el juego cambiando la clase
    document.getElementById('tablero-juego').classList.add('mostrar');
    
    // Aquí puedes comenzar tu juego o realizar acciones adicionales
    crearTablero();
  } else {
    alert('Por favor ingresa tu nombre para comenzar el juego.');
  }
}



