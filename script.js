class Libro {
  constructor(titulo, autor, año) {
    this.titulo = titulo;
    this.autor = autor;
    this.año = año;
  }
}

let biblioteca = JSON.parse(localStorage.getItem("biblioteca")) || [];

const form = document.getElementById("formLibro");
const listaLibros = document.getElementById("listaLibros");
const btnMostrarTodos = document.getElementById("btnMostrarTodos");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const año = document.getElementById("anio").value.trim();

  if (titulo && autor && año) {
    const nuevoLibro = new Libro(titulo, autor, año);
    biblioteca.push(nuevoLibro);
    guardarYMostrar();
    form.reset();
  }
});

function mostrarLibros() {
  listaLibros.innerHTML = "";

  if (biblioteca.length === 0) {
    listaLibros.innerHTML = "<li>No hay libros guardados.</li>";
  } else {
    biblioteca.forEach((libro) => {
      const li = document.createElement("li");
      li.textContent = `${libro.titulo} - ${libro.autor} (${libro.año})`;
      listaLibros.appendChild(li);
    });
  }

  document.getElementById("busqueda").value = "";
  document.getElementById("eliminar").value = "";

  btnMostrarTodos.style.display = "none";
}

biblioteca.forEach((libro) => {
  const li = document.createElement("li");
  li.textContent = `${libro.titulo} - ${libro.autor} (${libro.año})`;
  listaLibros.appendChild(li);
});
btnMostrarTodos.style.display = "none";

function buscarLibro() {
  const tituloBuscado = document
    .getElementById("busqueda")
    .value.trim()
    .toLowerCase();
  if (!tituloBuscado) return;

  const resultados = biblioteca.filter((libro) =>
    libro.titulo.toLowerCase().includes(tituloBuscado)
  );

  listaLibros.innerHTML = "";

  if (resultados.length === 0) {
    listaLibros.innerHTML = "<li>No se encontraron libros con ese título.</li>";
  } else {
    resultados.forEach((libro) => {
      const li = document.createElement("li");
      li.textContent = `${libro.titulo} - ${libro.autor} (${libro.año})`;
      listaLibros.appendChild(li);
    });
  }
  btnMostrarTodos.style.display = "flex";
}

function eliminarLibro() {
  const titulo = document.getElementById("eliminar").value.trim().toLowerCase();
  if (!titulo) return;

  const index = biblioteca.findIndex((l) => l.titulo.toLowerCase() === titulo);

  if (index !== -1) {
    biblioteca.splice(index, 1);
    guardarYMostrar();
  } else {
    listaLibros.innerHTML = `<li>No se encontró el libro para eliminar.</li>`;
    btnMostrarTodos.style.display = "flex";
  }
}

function guardarYMostrar() {
  localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
  mostrarLibros();
}

function ordenarPorTitulo() {
  if (biblioteca.length === 0) {
    listaLibros.innerHTML = "<li>No hay libros para ordenar.</li>";
    return;
  }

  biblioteca.sort((a, b) => {
    const tituloA = a.titulo.toLowerCase();
    const tituloB = b.titulo.toLowerCase();
    return tituloA.localeCompare(tituloB);
  });

  guardarYMostrar(); // Guarda ordenado en localStorage y actualiza la lista
}

document.addEventListener("DOMContentLoaded", mostrarLibros);
