function Libro(titulo, autor, año) {
  this.titulo = titulo;
  this.autor = autor;
  this.año = año;
}

let biblioteca = [];

function iniciarBiblioteca() {
  let opcion;

  do {
    opcion = prompt(
      "BIBLIOTECA DIGITAL\n\n" +
        "1. Agregar libro\n" +
        "2. Mostrar libros\n" +
        "3. Buscar libro\n" +
        "4. Eliminar libro\n" +
        "5. Salir\n\n" +
        "Elige una opción:"
    );

    switch (opcion) {
      case "1":
        agregarLibro();
        break;
      case "2":
        mostrarLibros();
        break;
      case "3":
        buscarLibro();
        break;
      case "4":
        eliminarLibro();
        break;
      case "5":
        alert("¡Gracias por usar la Biblioteca Digital!");
        break;
      default:
        alert("Opción inválida. Intenta de nuevo.");
    }
  } while (opcion !== "5");
}

function agregarLibro() {
  const titulo = prompt("Ingrese el título del libro:");
  const autor = prompt("Ingrese el autor:");
  const anio = prompt("Ingrese el año de publicación:");

  if (titulo && autor && anio) {
    const nuevoLibro = new Libro(titulo, autor, anio);
    biblioteca.push(nuevoLibro);
    alert("Libro agregado con éxito.");
  } else {
    alert("Todos los campos son obligatorios.");
  }
}

function mostrarLibros() {
  if (biblioteca.length === 0) {
    alert("La biblioteca está vacía.");
  } else {
    let lista = "Lista de libros:\n\n";
    for (const libro of biblioteca) {
      lista += `${libro.titulo} - ${libro.autor} (${libro.año})\n`;
    }
    alert(lista);
  }
}

function buscarLibro() {
  const tituloBuscar = prompt("Ingrese el título del libro a buscar:");

  if (!tituloBuscar) {
    alert("Debes ingresar un título.");
    return;
  }

  const libro = biblioteca.find(
    (libro) => libro.titulo.toLowerCase() === tituloBuscar.toLowerCase()
  );

  if (libro) {
    alert(`Libro encontrado:\n${libro.titulo} - ${libro.autor} (${libro.año})`);
  } else {
    alert("Libro no encontrado.");
  }
}

function eliminarLibro() {
  const tituloEliminar = prompt("Ingrese el título del libro a eliminar:");

  if (!tituloEliminar) {
    alert("Debes ingresar un título.");
    return;
  }

  const index = biblioteca.findIndex(
    (libro) => libro.titulo.toLowerCase() === tituloEliminar.toLowerCase()
  );

  if (index !== -1) {
    const libroEliminado = biblioteca.splice(index, 1)[0];
    alert(`Libro eliminado: ${libroEliminado.titulo}`);
  } else {
    alert("No se encontró el libro.");
  }
}

iniciarBiblioteca();
