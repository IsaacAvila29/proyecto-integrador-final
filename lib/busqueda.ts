export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  departamento: string;
  salario: number;
}

export interface ResultadoBusqueda {
  /** Posición del id en la lista, o -1 si no está. */
  indice: number;
  /** Cuántas posiciones estimó la búsqueda antes de terminar. */
  estimaciones: number;
}

/** Copia de la lista ordenada por id. Se usa una sola vez, al cargar los datos. */
export function ordenarPorId<T extends { id: number }>(lista: readonly T[]): T[] {
  return [...lista].sort((a, b) => a.id - b.id);
}

/**
 * Búsqueda por interpolación sobre una lista ordenada por id.
 *
 * Promedio O(log log n) con ids parejos, peor caso O(n), memoria O(1).
 * Si hay ids repetidos devuelve uno de ellos, no necesariamente el primero.
 */
export function busquedaInterpolacion(
  lista: readonly { id: number }[],
  objetivo: number,
): ResultadoBusqueda {
  let bajo = 0;
  let alto = lista.length - 1;
  let estimaciones = 0;

  // Fuera del rango [lista[bajo], lista[alto]] el valor ya no puede estar.
  while (bajo <= alto && objetivo >= lista[bajo].id && objetivo <= lista[alto].id) {
    estimaciones++;

    const idBajo = lista[bajo].id;
    const idAlto = lista[alto].id;

    // Todos los ids del tramo son iguales: la fórmula dividiría entre cero.
    // Y como objetivo está entre ambos, es justo ese id.
    if (idBajo === idAlto) {
      return { indice: bajo, estimaciones };
    }

    const posicion =
      bajo + Math.floor(((objetivo - idBajo) * (alto - bajo)) / (idAlto - idBajo));
    const idEstimado = lista[posicion].id;

    if (idEstimado === objetivo) {
      return { indice: posicion, estimaciones };
    }

    if (idEstimado < objetivo) {
      bajo = posicion + 1;
    } else {
      alto = posicion - 1;
    }
  }

  return { indice: -1, estimaciones };
}
