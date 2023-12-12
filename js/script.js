const niveles = [
  { parejas: 5, imagenes: ['../imgs/anana.png', '../imgs/banana.png', '../imgs/cereza.png', '../imgs/coco.png', '../imgs/durazno.png'] },
  { parejas: 8, imagenes: ['../imgs/anana.png', '../imgs/banana.png', '../imgs/cereza.png', '../imgs/coco.png', '../imgs/durazno.png', '../imgs/frutilla.png', '../imgs/kiwi.png', '../imgs/manzana.png'] },
  { parejas: 12, imagenes: ['../imgs/anana.png', '../imgs/banana.png', '../imgs/cereza.png', '../imgs/coco.png', '../imgs/durazno.png', '../imgs/frutilla.png', '../imgs/kiwi.png', '../imgs/manzana.png', '../imgs/naranja.png', '../imgs/pera.png', '../imgs/sandia.png', '../imgs/uva.png'] }
];

let nivelActual = 0;
let cartas = [];
let cartasVolteadas = [];
let cartasCoincidentes = [];
let puntosBase = 1000;
const tiempoLimite = 5 * 60 * 1000; // 5 minutos en milisegundos
let tiempoInicio, tiempoFinal;
let puntuacionTotal = 0
let nombreUsuario = '';
const infoJuego = document.querySelector('.info-juego');

function mostrarMensaje(mensaje) {
  // Limpiar contenido anterior
  infoJuego.innerHTML = '';

  // Crear un elemento de párrafo para mostrar el mensaje
  const parrafo = document.createElement('p');
  parrafo.innerHTML = mensaje;

  // Agregar el párrafo al div
  infoJuego.appendChild(parrafo);
}

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

  cartasCoincidentes = [];
  tiempoInicio = Date.now();

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


// Función para guardar el puntaje del usuario en el localStorage
function guardarPuntaje(nombreUsuario, puntaje) {
  let puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
  puntajes.push({ nombre: nombreUsuario, puntaje });
  puntajes.sort((a, b) => b.puntaje - a.puntaje); // Ordena los puntajes de mayor a menor
  puntajes = puntajes.slice(0, 10); // Solo guarda los 10 mejores puntajes

  localStorage.setItem('puntajes', JSON.stringify(puntajes));
}

// Función para mostrar los mejores puntajes en el div con la clase "mejoresPuntuaciones"
function mostrarMejoresPuntuaciones() {
  const puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
  const mejoresPuntuacionesDiv = document.querySelector('.mejoresPuntuaciones');

  // Limpia el contenido anterior antes de mostrar los puntajes
  mejoresPuntuacionesDiv.innerHTML = '';

  puntajes.forEach((puntaje, index) => {
    const parrafo = document.createElement('p');
    parrafo.textContent = `${index + 1}. ${puntaje.nombre}: ${puntaje.puntaje}`;
    mejoresPuntuacionesDiv.appendChild(parrafo);
  });
}
// Evento que se activa cuando el DOM se carga completamente
document.addEventListener('DOMContentLoaded', mostrarMejoresPuntuaciones);



// verificacion coincidencia

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

  // Verifica si todas las cartas coincidentes se han encontrado
  if (cartasCoincidentes.length === niveles[nivelActual].parejas * 2) {
    // Si todas las cartas coincidentes han sido encontradas, pasa al siguiente nivel
    setTimeout(() => {
      if (nivelActual < niveles.length - 1) {
        nivelActual++;
        tiempoFinal = Date.now();



        const tiempoTranscurrido = tiempoFinal - tiempoInicio;
        let tiempoPenalizacion = Math.floor(tiempoTranscurrido / 1000) * 2;
        const puntuacionNivel = puntosBase - tiempoPenalizacion;
        

        // Sumar la puntuación del nivel actual a la puntuación total
        puntuacionTotal += puntuacionNivel;

        const mensaje = `¡Pasaste al siguiente nivel!<br>Tu puntuación actual es: ${puntuacionNivel}<br>Tu puntuación total hasta el momento es: ${puntuacionTotal}`;
        mostrarMensaje(mensaje);
        // Restablece las variables de seguimiento de las cartas
        cartas = [];
        cartasVolteadas = [];
        cartasCoincidentes = [];

        crearTablero();
      } else {
        const mensajeFinal = `¡Has completado todos los niveles! ¡Has ganado!<br>Tu puntuación final es: ${puntuacionTotal}`;
        mostrarMensaje(mensajeFinal);

        // Guardar la puntuación total en el localStorage
        guardarPuntaje(nombreUsuario, puntuacionTotal);
        // Mostrar las mejores puntuaciones después de guardar la puntuación
        mostrarMejoresPuntuaciones();
      }
    }, 500);
  }
}



function iniciarJuego() {
  nombreUsuario = document.getElementById('username').value;
  if (nombreUsuario.trim() !== '') {
    // Ocultar el ingreso de nombre
    document.getElementById('ingreso-nombre').style.display = 'none';
    const tableroJuego = document.getElementById('tablero-juego');
    tableroJuego.innerHTML = '';
    // Mostrar el juego cambiando la clase
    document.getElementById('tablero-juego').classList.add('mostrar');
    
    // Aquí puedes comenzar tu juego o realizar acciones adicionales
    crearTablero();
  } else {
    mostrarMensaje('Por favor ingresa tu nombre para comenzar el juego.');
  }
}



