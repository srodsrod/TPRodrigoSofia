const productos = [
  { nombre: "Anillo Bellagio", tipo: "anillos", precio: 6500, imagen: "https://placehold.co/300x300?text=Bellagio" },
  { nombre: "Anillo Cortina", tipo: "anillos", precio: 7200, imagen: "https://placehold.co/300x300?text=Cortina" },
  { nombre: "Anillo Lucca", tipo: "anillos", precio: 5800, imagen: "https://placehold.co/300x300?text=Lucca" },
  
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

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

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
          <div class="d-flex justify-content-center align-items-center gap-2 mt-3">
            <input type="number" min="1" value="1" class="form-control cantidad-input" id="cantidad-${p.nombre.replace(/\s+/g, '')}" style="width: 60px;">
            <button class="btn btn-lindo" onclick="agregarAlCarrito('${p.nombre}')">Agregar</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
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

//const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
//if (carritoGuardado.length > 0) {
//  mostrarMiniCarrito();
//}


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

