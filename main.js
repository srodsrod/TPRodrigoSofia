  const btnCarrito = document.getElementById("btnCarrito");
  const miniCarrito = document.getElementById("miniCarrito");

  let carritoVisible = false;

  btnCarrito.addEventListener("click", (e) => {
    e.preventDefault(); // Para que no recargue la página si es <a>
    carritoVisible = !carritoVisible;
    miniCarrito.style.display = carritoVisible ? "block" : "none";
  });

  document.addEventListener("click", function (e) {
    if (carritoVisible && !miniCarrito.contains(e.target) && e.target !== btnCarrito) {
      miniCarrito.style.display = "none";
      carritoVisible = false;
    }
  });

  // Animación estilo Apple al hacer scroll
const appleSection = document.querySelector('.apple-style');

window.addEventListener('scroll', () => {
  const sectionTop = appleSection.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (sectionTop < windowHeight - 100) {
    appleSection.classList.add('visible');
  }
});

// Mostrar cards cuando aparecen en pantalla
const fadeCards = document.querySelectorAll('.fade-on-scroll');

function mostrarCardsScroll() {
  fadeCards.forEach((card) => {
    const cardTop = card.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (cardTop < windowHeight - 50) {
      card.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', mostrarCardsScroll);


const contenedorCatalogo = document.getElementById("contenedorCatalogo");

if (contenedorCatalogo) {
  // Simulación de productos
  const productos = [
  { nombre: "Anillo Bellagio", tipo: "anillos", precio: 6500, imagen: "bellagio.jpg" },
  { nombre: "Anillo Cortina", tipo: "anillos", precio: 7200, imagen: "cortina.jpg" },
  { nombre: "Anillo Lucca", tipo: "anillos", precio: 5800, imagen: "lucca.jpg" },

  { nombre: "Collar Portofino", tipo: "collares", precio: 9800, imagen: "portofino.jpg" },
  { nombre: "Collar Ravello", tipo: "collares", precio: 8600, imagen: "ravello.jpg" },
  { nombre: "Collar Verona", tipo: "collares", precio: 10200, imagen: "verona.jpg" },

  { nombre: "Aros Siena", tipo: "aros", precio: 4300, imagen: "siena.jpg" },
  { nombre: "Aros Taormina", tipo: "aros", precio: 4800, imagen: "taormina.jpg" },
  { nombre: "Aros Ischia", tipo: "aros", precio: 5200, imagen: "ischia.jpg" },

  { nombre: "Pulsera Capri", tipo: "pulseras", precio: 6900, imagen: "capri.jpg" },
  { nombre: "Pulsera Como", tipo: "pulseras", precio: 7400, imagen: "como.jpg" },
  { nombre: "Pulsera Saluzzo", tipo: "pulseras", precio: 6100, imagen: "saluzzo.jpg" },
];

  // Obtener categoría de la URL
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria"); // puede ser null

  const productosFiltrados = categoria
    ? productos.filter((prod) => prod.tipo === categoria)
    : productos;

  // Mostrar productos
  contenedorCatalogo.innerHTML = "";

  productosFiltrados.forEach((prod) => {
    contenedorCatalogo.innerHTML += `
      <div class="col-md-4 fade-on-scroll">
        <div class="card h-100 shadow-sm border-0">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body text-center">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text text-muted mb-1">Tipo: ${prod.tipo}</p>
            <p class="fw-bold mb-2">$${prod.precio}</p>
            <button class="btn btn-lindo">Agregar al carrito</button>
          </div>
        </div>
      </div>
    `;
  });
}
