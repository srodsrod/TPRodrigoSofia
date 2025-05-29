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
