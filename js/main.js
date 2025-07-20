class Libro {
  constructor(titulo, autor, año) {
    this.titulo = titulo;
    this.autor = autor;
    this.año = parseInt(año);
  }
}

let biblioteca = [];
let seccionActual = "menu";

// Referencias DOM
const menuPrincipal = document.getElementById("menuPrincipal");
const seccionAgregar = document.getElementById("seccionAgregar");
const seccionBuscar = document.getElementById("seccionBuscar");
const seccionEliminar = document.getElementById("seccionEliminar");
const seccionMostrar = document.getElementById("seccionMostrar");
const seccionRecomendacion = document.getElementById("seccionRecomendacion");
const seccionEstadisticas = document.getElementById("seccionEstadisticas");

const form = document.getElementById("formLibro");
const listaLibros = document.getElementById("listaLibros");
const listaResultados = document.getElementById("listaResultados");
const btnMostrarTodos = document.getElementById("btnMostrarTodos");

// Cargar datos iniciales desde JSON si localStorage está vacío
async function cargarDatosIniciales() {
  try {
    const datosLS = localStorage.getItem("biblioteca");
    if (datosLS) {
      biblioteca = JSON.parse(datosLS);
    } else {
      const response = await fetch("data/libros.json");
      if (!response.ok) throw new Error("No se pudo cargar la base de datos.");
      const librosData = await response.json();
      biblioteca = librosData.map(
        (libro) => new Libro(libro.titulo, libro.autor, libro.año)
      );
      localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
    }
    mostrarMensaje("Biblioteca cargada correctamente", "success");
  } catch (error) {
    mostrarMensaje("Error al cargar los libros: " + error.message, "error");
    biblioteca = [];
  }
}

// Navegación entre secciones
function mostrarSeccion(seccion) {
  const secciones = [
    menuPrincipal,
    seccionAgregar,
    seccionBuscar,
    seccionEliminar,
    seccionMostrar,
    seccionRecomendacion,
    seccionEstadisticas,
  ];
  secciones.forEach((s) => {
    s.style.display = "none";
    s.classList.remove("activa");
  });

  switch (seccion) {
    case "menu":
      menuPrincipal.style.display = "block";
      menuPrincipal.classList.add("activo");
      break;
    case "agregar":
      seccionAgregar.style.display = "block";
      seccionAgregar.classList.add("activa");
      break;
    case "buscar":
      seccionBuscar.style.display = "block";
      seccionBuscar.classList.add("activa");
      break;
    case "eliminar":
      seccionEliminar.style.display = "block";
      seccionEliminar.classList.add("activa");
      break;
    case "mostrar":
      seccionMostrar.style.display = "block";
      seccionMostrar.classList.add("activa");
      mostrarBibliotecaCompleta();
      break;
    case "recomendacion":
      seccionRecomendacion.style.display = "block";
      seccionRecomendacion.classList.add("activa");
      mostrarRecomendacion();
      break;
    case "estadisticas":
      seccionEstadisticas.style.display = "block";
      seccionEstadisticas.classList.add("activa");
      mostrarEstadisticas();
      break;
  }
  seccionActual = seccion;
}

// Guardar en localStorage
function guardarEnLocalStorage() {
  localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
}

// Agregar libro
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const año = document.getElementById("anio").value.trim();

  if (titulo && autor && año) {
    const existe = biblioteca.some(
      (libro) =>
        libro.titulo.trim().toLowerCase() === titulo.toLowerCase() &&
        libro.autor.trim().toLowerCase() === autor.toLowerCase() &&
        String(libro.año) === String(año)
    );
    if (existe) {
      mostrarMensaje(
        "Ya existe un libro con ese título, autor y año.",
        "error"
      );
      return;
    }

    const nuevoLibro = new Libro(titulo, autor, año);
    biblioteca.push(nuevoLibro);
    guardarEnLocalStorage();
    mostrarMensaje("Libro agregado correctamente.", "success");
    limpiarInputs();
  } else {
    mostrarMensaje("Completa todos los campos.", "error");
  }
});

// Buscar libro
document.getElementById("btnBuscar").addEventListener("click", function () {
  const tituloBuscado = document
    .getElementById("busqueda")
    .value.trim()
    .toLowerCase();
  if (!tituloBuscado) {
    mostrarMensaje("Ingresa un título para buscar.", "error");
    return;
  }
  const resultados = biblioteca.filter((libro) =>
    libro.titulo.toLowerCase().includes(tituloBuscado)
  );
  mostrarLibrosEnLista(resultados, listaResultados);
  btnMostrarTodos.style.display = "block";
  if (resultados.length === 0) {
    mostrarMensaje("No se encontraron libros con ese título.", "info");
  } else {
    mostrarMensaje(`Se encontraron ${resultados.length} libro(s).`, "success");
  }
});

// Ordenar libros
document.getElementById("btnOrdenar").addEventListener("click", function () {
  if (biblioteca.length === 0) {
    mostrarMensaje("No hay libros para ordenar.", "info");
    return;
  }
  biblioteca.sort((a, b) => a.titulo.localeCompare(b.titulo));
  guardarEnLocalStorage();
  mostrarLibrosEnLista(biblioteca, listaResultados);
  mostrarMensaje("Libros ordenados alfabéticamente.", "success");
});

// Eliminar libro
// Eliminar libro con manejo de duplicados
document.getElementById("btnEliminar").addEventListener("click", function () {
  const titulo = document.getElementById("eliminar").value.trim();
  if (!titulo) {
    mostrarMensaje("Ingresa el título a eliminar.", "error");
    return;
  }

  // Buscar todos los libros que coinciden con el título
  const coincidencias = biblioteca
    .filter((libro, index) =>
      libro.titulo.toLowerCase().includes(titulo.toLowerCase())
    )
    .map((libro, i, arr) => ({
      ...libro,
      indiceOriginal: biblioteca.findIndex(
        (l, idx) =>
          l.titulo === libro.titulo &&
          l.autor === libro.autor &&
          l.año === libro.año &&
          idx >=
            (i === 0
              ? 0
              : biblioteca.findIndex(
                  (prev, prevIdx) =>
                    prev.titulo === arr[i - 1].titulo &&
                    prev.autor === arr[i - 1].autor &&
                    prev.año === arr[i - 1].año
                ) + 1)
      ),
    }));

  if (coincidencias.length === 0) {
    mostrarMensaje("No se encontró ningún libro con ese título.", "error");
    return;
  }

  if (coincidencias.length === 1) {
    // Solo una coincidencia, eliminar directamente con confirmación
    const libro = coincidencias[0];
    Swal.fire({
      title: "¿Eliminar este libro?",
      html: `
        <div class="text-start">
          <strong>Título:</strong> ${libro.titulo}<br>
          <strong>Autor:</strong> ${libro.autor}<br>
          <strong>Año:</strong> ${libro.año}
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        biblioteca.splice(libro.indiceOriginal, 1);
        guardarEnLocalStorage();
        mostrarMensaje(`"${libro.titulo}" eliminado correctamente.`, "success");
        limpiarInputs();
      }
    });
  } else {
    // Múltiples coincidencias, mostrar lista para seleccionar
    mostrarListaParaEliminar(coincidencias, titulo);
  }
});

// Función para mostrar lista de libros duplicados y seleccionar cuál eliminar
function mostrarListaParaEliminar(coincidencias, tituloBuscado) {
  let opcionesHTML = "";

  coincidencias.forEach((libro, index) => {
    opcionesHTML += `
      <div class="libro-opcion mb-2 p-3 border rounded" style="cursor: pointer; transition: background-color 0.3s;" 
           onmouseover="this.style.backgroundColor='#f8f9fa'" 
           onmouseout="this.style.backgroundColor='white'"
           onclick="seleccionarLibroParaEliminar(${libro.indiceOriginal}, '${libro.titulo}', '${libro.autor}', ${libro.año})">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>${libro.titulo}</strong><br>
            <small class="text-muted">
              <i class="bi bi-person"></i> ${libro.autor} | 
              <i class="bi bi-calendar"></i> ${libro.año}
            </small>
          </div>
          <div>
            <i class="bi bi-trash text-danger"></i>
          </div>
        </div>
      </div>
    `;
  });

  Swal.fire({
    title: `Se encontraron ${coincidencias.length} libros`,
    html: `
      <p class="mb-3">Selecciona cuál libro deseas eliminar:</p>
      <div style="max-height: 400px; overflow-y: auto;">
        ${opcionesHTML}
      </div>
    `,
    width: "600px",
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
  });
}

// Función para confirmar eliminación del libro seleccionado
function seleccionarLibroParaEliminar(indice, titulo, autor, año) {
  Swal.fire({
    title: "¿Eliminar este libro?",
    html: `
      <div class="text-start">
        <strong>Título:</strong> ${titulo}<br>
        <strong>Autor:</strong> ${autor}<br>
        <strong>Año:</strong> ${año}
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      biblioteca.splice(indice, 1);
      guardarEnLocalStorage();
      mostrarMensaje(`"${titulo}" eliminado correctamente.`, "success");
      limpiarInputs();

      // Actualizar la vista si estamos en la sección mostrar
      if (seccionActual === "mostrar") {
        mostrarBibliotecaCompleta();
      }
    }
  });
}

// Mostrar todos los resultados
btnMostrarTodos.addEventListener("click", function () {
  mostrarLibrosEnLista(biblioteca, listaResultados);
  btnMostrarTodos.style.display = "none";
  limpiarInputs();
});

// Mostrar biblioteca completa
function mostrarBibliotecaCompleta() {
  mostrarLibrosEnLista(biblioteca, listaLibros);
  const contador = document.getElementById("contadorLibros");
  contador.innerHTML = `<i class="bi bi-book"></i> Total de libros en la biblioteca: <strong>${biblioteca.length}</strong>`;
}

// Mostrar recomendación aleatoria
function mostrarRecomendacion() {
  if (biblioteca.length === 0) {
    document.getElementById("libroRecomendado").innerHTML = `
      <div class="alert alert-info">
        <i class="bi bi-info-circle"></i> No hay libros en la biblioteca para recomendar.
        <br>Agrega algunos libros primero.
      </div>
    `;
    return;
  }

  const indiceAleatorio = Math.floor(Math.random() * biblioteca.length);
  const libroRecomendado = biblioteca[indiceAleatorio];

  document.getElementById("libroRecomendado").innerHTML = `
    <div class="libro-recomendado">
      <h3><i class="bi bi-star-fill"></i> ${libroRecomendado.titulo}</h3>
      <p><strong>Autor:</strong> ${libroRecomendado.autor}</p>
      <p><strong>Año:</strong> ${libroRecomendado.año}</p>
      <span class="badge bg-light text-dark">Recomendación #${
        indiceAleatorio + 1
      }</span>
    </div>
  `;
}

// Otra recomendación
document
  .getElementById("btnOtraRecomendacion")
  .addEventListener("click", mostrarRecomendacion);

// Mostrar estadísticas
function mostrarEstadisticas() {
  if (biblioteca.length === 0) {
    document.getElementById("estadisticasContenido").innerHTML = `
      <div class="col-12">
        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i> No hay libros para mostrar estadísticas.
        </div>
      </div>
    `;
    return;
  }

  const totalLibros = biblioteca.length;
  const autores = [...new Set(biblioteca.map((libro) => libro.autor))];
  const totalAutores = autores.length;
  const años = biblioteca.map((libro) => libro.año);
  const añoMasAntiguo = Math.min(...años);
  const añoMasReciente = Math.max(...años);

  const conteoAutores = {};
  biblioteca.forEach((libro) => {
    conteoAutores[libro.autor] = (conteoAutores[libro.autor] || 0) + 1;
  });
  const autorMasLibros = Object.keys(conteoAutores).reduce((a, b) =>
    conteoAutores[a] > conteoAutores[b] ? a : b
  );

  document.getElementById("estadisticasContenido").innerHTML = `
    <div class="col-md-6 col-lg-3">
      <div class="estadistica-card">
        <div class="estadistica-numero">${totalLibros}</div>
        <div class="estadistica-label">Total de Libros</div>
      </div>
    </div>
    <div class="col-md-6 col-lg-3">
      <div class="estadistica-card">
        <div class="estadistica-numero">${totalAutores}</div>
        <div class="estadistica-label">Autores Únicos</div>
      </div>
    </div>
    <div class="col-md-6 col-lg-3">
      <div class="estadistica-card">
        <div class="estadistica-numero">${añoMasAntiguo}</div>
        <div class="estadistica-label">Libro Más Antiguo</div>
      </div>
    </div>
    <div class="col-md-6 col-lg-3">
      <div class="estadistica-card">
        <div class="estadistica-numero">${añoMasReciente}</div>
        <div class="estadistica-label">Libro Más Reciente</div>
      </div>
    </div>
    <div class="col-12 mt-3">
      <div class="estadistica-card">
        <h5><i class="bi bi-person-fill"></i> Autor con más libros</h5>
        <p><strong>${autorMasLibros}</strong> (${
    conteoAutores[autorMasLibros]
  } libro${conteoAutores[autorMasLibros] > 1 ? "s" : ""})</p>
      </div>
    </div>
  `;
}

// Event listeners para navegación del menú
document
  .getElementById("btnMenuAgregar")
  .addEventListener("click", () => mostrarSeccion("agregar"));
document
  .getElementById("btnMenuBuscar")
  .addEventListener("click", () => mostrarSeccion("buscar"));
document
  .getElementById("btnMenuEliminar")
  .addEventListener("click", () => mostrarSeccion("eliminar"));
document
  .getElementById("btnMenuMostrar")
  .addEventListener("click", () => mostrarSeccion("mostrar"));
document
  .getElementById("btnMenuRecomendacion")
  .addEventListener("click", () => mostrarSeccion("recomendacion"));
document
  .getElementById("btnMenuEstadisticas")
  .addEventListener("click", () => mostrarSeccion("estadisticas"));

// Event listeners para botones "Volver"
document
  .getElementById("btnVolverAgregar")
  .addEventListener("click", () => mostrarSeccion("menu"));
document
  .getElementById("btnVolverBuscar")
  .addEventListener("click", () => mostrarSeccion("menu"));
document
  .getElementById("btnVolverEliminar")
  .addEventListener("click", () => mostrarSeccion("menu"));
document
  .getElementById("btnVolverMostrar")
  .addEventListener("click", () => mostrarSeccion("menu"));
document
  .getElementById("btnVolverRecomendacion")
  .addEventListener("click", () => mostrarSeccion("menu"));
document
  .getElementById("btnVolverEstadisticas")
  .addEventListener("click", () => mostrarSeccion("menu"));

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", function () {
  cargarDatosIniciales();
  mostrarSeccion("menu");
});
