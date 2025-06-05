const productos = [
  { nombre: "Anillo Bellagio", tipo: "anillos", precio: 6500, imagen: "./IMG/bellagio.png", imagenHover: "./IMG/bellagio-hover.png" },
  { nombre: "Anillo Cortina", tipo: "anillos", precio: 7200, imagen: "./IMG/cortina.png", imagenHover: "./IMG/cortina-hover.png" },
  { nombre: "Anillo Lucca", tipo: "anillos", precio: 5800, imagen: "./IMG/lucca.png", imagenHover: "./IMG/lucca-hover.png" },

  { nombre: "Collar Portofino", tipo: "collares", precio: 9800, imagen: "./IMG/portofino.png", imagenHover: "./IMG/portofino-hover.png" },
  { nombre: "Collar Ravello", tipo: "collares", precio: 8600, imagen: "./IMG/ravello.png", imagenHover: "./IMG/ravello-hover.png" },
  { nombre: "Collar Verona", tipo: "collares", precio: 10200, imagen: "./IMG/verona.png", imagenHover: "./IMG/verona-hover.png" },

  { nombre: "Aros Siena", tipo: "aros", precio: 4300, imagen: "./IMG/siena.png", imagenHover: "./IMG/siena-hover.png" },
  { nombre: "Aros Taormina", tipo: "aros", precio: 4800, imagen: "./IMG/taormina.png", imagenHover: "./IMG/taormina-hover.png" },
  { nombre: "Aros Ischia", tipo: "aros", precio: 5200, imagen: "./IMG/ischia.png", imagenHover: "./IMG/ischia-hover.png" },

  { nombre: "Pulsera Capri", tipo: "pulseras", precio: 6900, imagen: "./IMG/capri.png", imagenHover: "./IMG/capri-hover.png" },
  { nombre: "Pulsera Como", tipo: "pulseras", precio: 7400, imagen: "./IMG/como.png", imagenHover: "./IMG/como-hover.png" },
  { nombre: "Pulsera Saluzzo", tipo: "pulseras", precio: 6100, imagen: "./IMG/saluzzo.png", imagenHover: "./IMG/saluzzo-hover.png" },
];


let carrito = JSON.parse(localStorage.getItem("carrito")) || []; //osea si no tiene nada el car. arma la lista peero vacia!!

function renderizarCarrito() {
  const contenedor = document.getElementById("carritoItems");
  const total = document.getElementById("totalCarrito");
  if (!contenedor || !total) return;

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
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${i}, 'sidebar')">❌</button>
      </div>
    `;
  });

  const sumaTotal = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  total.textContent = sumaTotal;
}

function guardarCarrito({ mostrarMini = false } = {}) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  renderizarCarritoPagina();

  if (mostrarMini && !window.location.href.includes("carrito.html")) {
    mostrarMiniCarrito();
  }
}





function agregarAlCarrito(nombre, cantidad = 1) {
  const input = document.getElementById(`cantidad-${nombre.replace(/\s+/g, '')}`);
  const cantidadElegida = input ? parseInt(input.value) : cantidad;
  if (isNaN(cantidadElegida) || cantidadElegida <= 0) return;

  const producto = productos.find(p => p.nombre === nombre);
  if (!producto) return;

  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad += cantidadElegida;
  } else {
    carrito.push({ ...producto, cantidad: cantidadElegida });
  }

  guardarCarrito({ mostrarMini: true }); // ✅ Solo desde acá mostramos el mini carrito
  if (input) input.value = 1;
}


function vaciarCarrito() {
  carrito = [];
  guardarCarrito(); // no mostramos el mini carrito
}
function eliminarDelCarrito(i, origen = "default") {
  carrito.splice(i, 1);
  guardarCarrito({ mostrarMini: origen === "catalogo" }); // solo lo abre si es desde catálogo
  // Si viene desde la sidebar, volver a pintar el miniCarrito
  if (origen === "sidebar") {
    mostrarMiniCarrito();
  }
}


function renderCatalogo() {
  const catalogoContainer = document.getElementById("catalogo");
  if (!catalogoContainer) return;

  catalogoContainer.innerHTML = "";

  const params = new URLSearchParams(window.location.search);
  const categoriaSeleccionada = params.get("categoria");

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(prod => prod.tipo === categoriaSeleccionada)
    : productos;

  productosFiltrados.forEach((prod, index) => {
    catalogoContainer.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${prod.imagen}" 
              class="card-img-top"
              alt="${prod.nombre}"
              onmouseover="this.src='${prod.imagenHover}'"
              onmouseout="this.src='${prod.imagen}'">
          <div class="card-body">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text">$${prod.precio}</p>
            <button class="btn btn-sm btn-outline-dark" onclick="agregarAlCarrito('${prod.nombre}')">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    `;
  });
}


function renderizarCarritoPagina() {
  const contenedor = document.getElementById("listaCarrito");
  const total = document.getElementById("totalCarrito");

  if (!contenedor || !total) return;

  const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];

  contenedor.innerHTML = "";

  if (carritoLocal.length === 0) {
    contenedor.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`;
    total.textContent = "0";
    return;
  }

  carritoLocal.forEach((prod, i) => {
    const subtotal = prod.precio * prod.cantidad;

    contenedor.innerHTML += `
      <div class="col-md-6 mb-3">
        <div class="card h-100 shadow-sm border-0">
          <div class="row g-0 align-items-center">
            <div class="col-4">
              <img src="${prod.imagen}" class="img-fluid rounded-start" alt="${prod.nombre}">
            </div>
            <div class="col-8">
              <div class="card-body">
                <h5 class="card-title mb-1">${prod.nombre}</h5>
                <p class="mb-1">💲 <strong>Precio unitario:</strong> $${prod.precio}</p>
                <div class="mb-2">
                  <label for="cantidad-${i}" class="form-label mb-0"><strong>Cantidad:</strong></label>
                  <input type="number" class="form-control form-control-sm" id="cantidad-${i}" min="1" value="${prod.cantidad}" onchange="actualizarCantidad(${i}, this.value)">
                </div>
                <p class="fw-bold mb-2">Subtotal: $${subtotal}</p>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${i}, 'pagina')">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  const sumaTotal = carritoLocal.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  total.textContent = sumaTotal;
}





function mostrarMiniCarrito() {
  const miniCarrito = document.getElementById("miniCarrito");
  const contenedor = document.getElementById("carritoItems");

  if (!miniCarrito || !contenedor) return;

  // ✅ FORZAMOS la carga desde localStorage
  const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];

  miniCarrito.style.display = "block";

  if (carritoLocal.length === 0) {
    contenedor.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`;
    return;
  }

  contenedor.innerHTML = carritoLocal.map((prod, i) => `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div>
        <strong>${prod.nombre}</strong><br>
        <small>${prod.cantidad} × $${prod.precio}</small>
      </div>
      <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${i}, 'sidebar')">❌</button>
    </div>
  `).join('');
}




document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
  renderizarCarritoPagina();
  renderCatalogo();


  const btnCarrito = document.getElementById("btnCarrito");
  const miniCarrito = document.getElementById("miniCarrito");

  if (btnCarrito && miniCarrito) {
    let carritoVisible = false;

    btnCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  carritoVisible = !carritoVisible;
  if (carritoVisible) {
    mostrarMiniCarrito(); // 👈 siempre actualiza contenido al abrir
    miniCarrito.style.display = "block";
  } else {
    miniCarrito.style.display = "none";
  }
});


    document.addEventListener("click", (e) => {
      if (carritoVisible && !miniCarrito.contains(e.target) && e.target !== btnCarrito) {
        miniCarrito.style.display = "none";
        carritoVisible = false;
      }
    });
  }

  const btnVaciar = document.getElementById("vaciarCarrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
  }

  const cerrarBtn = document.getElementById("cerrarMiniCarrito");
if (cerrarBtn && miniCarrito) {
  cerrarBtn.addEventListener("click", () => {
    miniCarrito.style.display = "none";
    carritoVisible = false;
  });
}


});

function cerrarMiniCarrito() {
  const miniCarrito = document.getElementById("miniCarrito");
  if (miniCarrito) {
    miniCarrito.style.display = "none";
  }
}

function actualizarCantidad(index, nuevaCantidad) {
  const cantidad = parseInt(nuevaCantidad);
  if (isNaN(cantidad) || cantidad < 1) return;

  const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carritoLocal[index]) {
    carritoLocal[index].cantidad = cantidad;
    localStorage.setItem("carrito", JSON.stringify(carritoLocal));
    renderizarCarritoPagina();

    const carritoVisible = document.getElementById("miniCarrito")?.style.display === "block";
    if (carritoVisible) {
      mostrarMiniCarrito();
    }
  }
}

function realizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío, agrega cosas para poder comprar");
    return;
  }

  alert("Compra realizada con éxito, gracias por comprar en Joyeria Excelsior");
  vaciarCarrito(); 
  window.location.href = "index.html";
}

