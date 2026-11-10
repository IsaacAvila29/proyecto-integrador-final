export function busquedaBinaria(arr: number[], objetivo: number): number {
  let izquierda = 0;
  let derecha = arr.length - 1;

  while (izquierda <= derecha) {
    const medio = Math.floor((izquierda + derecha) / 2);

    if (arr[medio] === objetivo) {
      return medio; // Retorna el índice donde se encontró
    } else if (arr[medio] < objetivo) {
      izquierda = medio + 1; // Busca en la mitad derecha
    } else {
      derecha = medio - 1; // Busca en la mitad izquierda
    }
  }

  return -1; // No encontrado
}
