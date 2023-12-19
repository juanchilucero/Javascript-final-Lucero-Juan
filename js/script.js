const niveles = [
  { parejas: 5, imagenes: ['../imgs/anana.png', '../imgs/banana.png', '../imgs/cereza.png', '../imgs/coco.png', '../imgs/durazno.png'] },
  { parejas: 8, imagenes: ['../imgs/frutilla.png', '../imgs/kiwi.png', '../imgs/manzana.png'] },
  { parejas: 12, imagenes: ['../imgs/naranja.png', '../imgs/pera.png', '../imgs/sandia.png', '../imgs/uva.png'] }
];

niveles[1].imagenes = [...niveles[0].imagenes, ...niveles[1].imagenes];
niveles[2].imagenes = [...niveles[1].imagenes, ...niveles[2].imagenes];


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

const mostrarMensaje = (mensaje) => {
  infoJuego.innerHTML = '';
  const parrafo = document.createElement('p');
  parrafo.innerHTML = mensaje;
  infoJuego.appendChild(parrafo);
};

const mezclar = (array) => {
  let currentIndex = array.length;

  while (currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex--);
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};


const crearTablero = () => {
  cartasCoincidentes = [];
  tiempoInicio = Date.now();

  const nivel = niveles[nivelActual];
  const imagenesParaNivel = nivel.imagenes.slice(0, nivel.parejas);
  const imagenesDuplicadas = [...imagenesParaNivel, ...imagenesParaNivel];
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
};


const voltearCarta = function() {
  if (cartasVolteadas.length < 2 && !this.classList.contains('volteada')) {
    this.classList.add('volteada');
    cartasVolteadas.push(this);

    if (cartasVolteadas.length === 2) {
      setTimeout(verificarCoincidencia, 1000);
    }
  }
};

const guardarPuntaje = (nombreUsuario, puntaje) => {
  let puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
  puntajes.push({ nombre: nombreUsuario, puntaje });
  puntajes.sort((a, b) => b.puntaje - a.puntaje);
  puntajes = puntajes.slice(0, 10);

  localStorage.setItem('puntajes', JSON.stringify(puntajes));
};


const mostrarMejoresPuntuaciones = () => {
  const puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
  const mejoresPuntuacionesDiv = document.querySelector('.mejoresPuntuaciones');

  mejoresPuntuacionesDiv.innerHTML = '';

  puntajes.forEach((puntaje, index) => {
    const parrafo = document.createElement('p');
    parrafo.textContent = `${index + 1}. ${puntaje.nombre}: ${puntaje.puntaje}`;
    mejoresPuntuacionesDiv.appendChild(parrafo);
  });
};

// Evento que se activa cuando el DOM se carga completamente
document.addEventListener('DOMContentLoaded', mostrarMejoresPuntuaciones);



// verificacion coincidencia
const verificarCoincidencia = () => {
  const [carta1, carta2] = cartasVolteadas;
  const imagen1 = carta1.querySelector('.contenido-carta').src;
  const imagen2 = carta2.querySelector('.contenido-carta').src;

  if (imagen1 === imagen2) {
    cartasCoincidentes.push(carta1, carta2);
    [carta1, carta2].forEach(carta => carta.removeEventListener('click', voltearCarta));
  } else {
    [carta1, carta2].forEach(carta => carta.classList.remove('volteada'));
  }

  cartasVolteadas = [];

  if (cartasCoincidentes.length === niveles[nivelActual].parejas * 2) {
    setTimeout(() => {
      if (nivelActual < niveles.length - 1) {
        nivelActual++;
        tiempoFinal = Date.now();
        const tiempoTranscurrido = tiempoFinal - tiempoInicio;
        const tiempoPenalizacion = Math.floor(tiempoTranscurrido / 1000) * 2;
        const puntuacionNivel = puntosBase - tiempoPenalizacion;
        puntuacionTotal += puntuacionNivel;

        const mensaje = `¡Pasaste al siguiente nivel!<br>Tu puntuación actual es: ${puntuacionNivel}<br>Tu puntuación total hasta el momento es: ${puntuacionTotal}`;
        mostrarMensaje(mensaje);

        cartas = [];
        cartasVolteadas = [];
        cartasCoincidentes = [];

        crearTablero();
      } else {
        const mensajeFinal = `¡Has completado todos los niveles! ¡Has ganado!<br>Tu puntuación final es: ${puntuacionTotal}`;
        mostrarMensaje(mensajeFinal);
        guardarPuntaje(nombreUsuario, puntuacionTotal);
        mostrarMejoresPuntuaciones();
      }
    }, 500);
  }
};


const iniciarJuego = () => {
  nombreUsuario = document.getElementById('username').value.trim();
  if (nombreUsuario) {
    const ingresoNombre = document.getElementById('ingreso-nombre');
    ingresoNombre.style.display = 'none';

    const tableroJuego = document.getElementById('tablero-juego');
    tableroJuego.innerHTML = '';

    document.getElementById('tablero-juego').classList.add('mostrar');
    mostrarMensaje('¡Bienvenido al juego!');
    
    crearTablero();
  } else {
    mostrarMensaje('Por favor ingresa tu nombre para comenzar el juego.');
  }
};



