export function formatDate(timestamp) {
  // Crear un objeto Date con el valor del timestamp en milisegundos
  const date = new Date(timestamp);

  // Verificar si 'date' es una instancia válida de Date
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Obtener los componentes de la fecha
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  // Concatenar los componentes en el formato "dd/mm/yy"
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
