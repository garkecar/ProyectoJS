// Mostrar lista de libros en el DOM
function mostrarLibrosEnLista(libros, contenedor) {
  contenedor.innerHTML = "";
  if (!libros || libros.length === 0) {
    contenedor.innerHTML =
      "<li class='list-group-item text-center'>No hay libros para mostrar.</li>";
    return;
  }

  libros.forEach((libro, index) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${libro.titulo}</strong><br>
        <small class="text-muted">
          <i class="bi bi-person"></i> ${libro.autor} | 
          <i class="bi bi-calendar"></i> ${libro.año}
        </small>
      </div>
      <span class="badge bg-primary rounded-pill">#${index + 1}</span>
    `;
    contenedor.appendChild(li);
  });
}

// Mostrar mensajes UX con SweetAlert2
function mostrarMensaje(mensaje, tipo = "info") {
  let icon = tipo;
  let title = "";

  switch (tipo) {
    case "error":
      icon = "error";
      title = "Error";
      break;
    case "success":
      icon = "success";
      title = "Éxito";
      break;
    case "info":
      icon = "info";
      title = "Información";
      break;
    case "warning":
      icon = "warning";
      title = "Advertencia";
      break;
  }

  Swal.fire({
    title: title,
    text: mensaje,
    icon: icon,
    timer: tipo === "success" ? 2000 : 3000,
    showConfirmButton: tipo === "error",
    position: "top-end",
    toast: true,
    timerProgressBar: true,
    showCloseButton: true,
  });
}

// Mostrar confirmación antes de eliminar
function confirmarEliminacion(titulo, callback) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: `Se eliminará el libro "${titulo}" de la biblioteca.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
}

// Limpiar inputs de formularios
function limpiarInputs() {
  const form = document.getElementById("formLibro");
  if (form) form.reset();

  const busqueda = document.getElementById("busqueda");
  if (busqueda) busqueda.value = "";

  const eliminar = document.getElementById("eliminar");
  if (eliminar) eliminar.value = "";
}

// Mostrar loading mientras se cargan datos
function mostrarLoading(mostrar = true) {
  if (mostrar) {
    Swal.fire({
      title: "Cargando...",
      text: "Obteniendo datos de la biblioteca",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  } else {
    Swal.close();
  }
}

// Validar formulario de agregar libro
function validarFormularioLibro(titulo, autor, año) {
  const errores = [];

  if (!titulo || titulo.length < 2) {
    errores.push("El título debe tener al menos 2 caracteres");
  }

  if (!autor || autor.length < 2) {
    errores.push("El autor debe tener al menos 2 caracteres");
  }

  const añoNum = parseInt(año);
  if (
    !año ||
    isNaN(añoNum) ||
    añoNum < 1000 ||
    añoNum > new Date().getFullYear()
  ) {
    errores.push(
      `El año debe ser un número entre 1000 y ${new Date().getFullYear()}`
    );
  }

  if (errores.length > 0) {
    mostrarMensaje(errores.join("\n"), "error");
    return false;
  }

  return true;
}

// Formatear texto para búsqueda (sin acentos, minúsculas)
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Resaltar texto en resultados de búsqueda
function resaltarTexto(texto, busqueda) {
  if (!busqueda) return texto;
  const regex = new RegExp(`(${busqueda})`, "gi");
  return texto.replace(regex, "<mark>$1</mark>");
}

// Mostrar estadísticas en tiempo real
function actualizarContadores() {
  const totalLibros = biblioteca.length;
  const contadores = document.querySelectorAll(".contador-libros");
  contadores.forEach((contador) => {
    contador.textContent = totalLibros;
  });
}

// Animación de entrada para elementos
function animarEntrada(elemento) {
  elemento.style.opacity = "0";
  elemento.style.transform = "translateY(20px)";

  setTimeout(() => {
    elemento.style.transition = "all 0.5s ease";
    elemento.style.opacity = "1";
    elemento.style.transform = "translateY(0)";
  }, 100);
}

// Función para exportar biblioteca (simulación)
function simularExportacion() {
  if (biblioteca.length === 0) {
    mostrarMensaje("No hay libros para exportar", "info");
    return;
  }

  mostrarLoading(true);

  setTimeout(() => {
    mostrarLoading(false);
    mostrarMensaje(
      `Biblioteca exportada exitosamente (${biblioteca.length} libros)`,
      "success"
    );
  }, 2000);
}

// Función para importar libros (simulación)
function simularImportacion() {
  mostrarLoading(true);

  setTimeout(() => {
    mostrarLoading(false);
    mostrarMensaje("Importación completada (simulación)", "success");
  }, 1500);
}

// Manejo de errores globales
window.addEventListener("error", function (e) {
  mostrarMensaje(
    "Ha ocurrido un error inesperado. Por favor, recarga la página.",
    "error"
  );
});

// Manejo de promesas rechazadas
window.addEventListener("unhandledrejection", function (e) {
  mostrarMensaje(
    "Error de conexión. Verifica tu conexión a internet.",
    "error"
  );
  e.preventDefault();
});
