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
const btnCarrito = document.getElementById("btnCarrito");
const miniCarrito = document.getElementById("miniCarrito");

  let carritoVisible = false;

  btnCarrito.addEventListener("click", (e) => {
    e.preventDefault(); 
    carritoVisible = !carritoVisible;
    miniCarrito.style.display = carritoVisible ? "block" : "none";
  });

  document.addEventListener("click", function (e) {
    if (carritoVisible && !miniCarrito.contains(e.target) && e.target !== btnCarrito) {
      miniCarrito.style.display = "none";
      carritoVisible = false;
    }
  });


function renderCatalogo() {
  const contenedor = document.getElementById("contenedorCatalogo");
  if (!contenedor) return;

  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  const productosFiltrados = categoria
    ? productos.filter((p) => p.tipo === categoria)
    : productos;

  contenedor.innerHTML = productosFiltrados.map((p) => `
    <div class="col-md-4 fade-on-scroll">
      <div class="card h-100 shadow-sm border-0">
        <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
        <div class="card-body text-center">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text text-muted mb-1">Tipo: ${p.tipo}</p>
          <p class="fw-bold mb-2">$${p.precio}</p>
          <button class="btn btn-lindo" onclick="agregarAlCarrito('${p.nombre}')">Agregar al carrito</button>
        </div>
      </div>
    </div>
  `).join('');
}



let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
}

function agregarAlCarrito(nombre) {
  const producto = productos.find((prod) => prod.nombre === nombre);
  if (producto) {
    carrito.push(producto);
    guardarCarrito();
  }
}

function eliminarDelCarrito(i) {
  carrito.splice(i, 1);
  guardarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
}

function renderizarCarrito() {
  const contenedor = document.getElementById("carritoItems");
  const total = document.getElementById("totalCarrito");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`;
    total.textContent = "0";
    return;
  }

  carrito.forEach((prod, i) => {
    contenedor.innerHTML += `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <strong>${prod.nombre}</strong><br>
          <small>$${prod.precio}</small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${i})">❌</button>
      </div>
    `;
  });

  const sumaTotal = carrito.reduce((acc, prod) => acc + prod.precio, 0);
  total.textContent = sumaTotal;
}

renderizarCarrito();

document.getElementById("vaciarCarrito")?.addEventListener("click", vaciarCarrito);

document.getElementById("btnCarrito")?.addEventListener("click", () => {
  const miniCarrito = document.getElementById("miniCarrito");
  miniCarrito.style.display = "block";
});
