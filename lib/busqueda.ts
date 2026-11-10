// Búsqueda por interpolación. La lista debe estar ordenada por id.
export function busquedaInterpolacion(lista: { id: number }[], objetivo: number) {
  let bajo = 0;
  let alto = lista.length - 1;
  let estimaciones = 0;

  while (bajo <= alto && objetivo >= lista[bajo].id && objetivo <= lista[alto].id) {
    estimaciones++;

    // Si los dos extremos son iguales, la fórmula dividiría entre cero.
    if (lista[bajo].id === lista[alto].id) {
      return { indice: bajo, estimaciones };
    }

    // Estima la posición según qué tan cerca está el objetivo de cada extremo.
    const posicion =
      bajo +
      Math.floor(((objetivo - lista[bajo].id) * (alto - bajo)) / (lista[alto].id - lista[bajo].id));

    if (lista[posicion].id === objetivo) {
      return { indice: posicion, estimaciones };
    }

    if (lista[posicion].id < objetivo) {
      bajo = posicion + 1;
    } else {
      alto = posicion - 1;
    }
  }

  return { indice: -1, estimaciones };
}
