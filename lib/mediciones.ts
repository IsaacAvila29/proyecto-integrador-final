import { busquedaInterpolacion } from "./busqueda";

export const TAMANOS = [1_000, 10_000, 100_000];

const BUSQUEDAS_POR_RONDA = 500;
// performance.now() tiene resolución gruesa en el navegador: se repite hasta
// acumular este tiempo para que el promedio no salga en cero.
const TIEMPO_MINIMO_MS = 10;

export interface Medicion {
  usuarios: number;
  distribucion: "Parejos" | "Desiguales";
  estimacionesPromedio: number;
  estimacionesMaximas: number;
  microsegundosPromedio: number;
}

/** Saltos al azar pequeños entre ids. La semilla fija hace repetible la medición. */
function idsParejos(n: number) {
  let semilla = 42;
  let id = 0;
  return Array.from({ length: n }, () => {
    semilla = (semilla * 48271) % 2147483647;
    id += 1 + (semilla % 20);
    return { id };
  });
}

/** Crecimiento exponencial: se duplica cada n/52 usuarios sin rebasar 2^53. */
function idsDesiguales(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + Math.floor(2 ** ((52 * i) / (n - 1))),
  }));
}

function medir(
  lista: readonly { id: number }[],
  distribucion: Medicion["distribucion"],
): Medicion {
  const objetivos = Array.from(
    { length: BUSQUEDAS_POR_RONDA },
    (_, k) => lista[Math.floor((k * lista.length) / BUSQUEDAS_POR_RONDA)].id,
  );

  let estimaciones = 0;
  let maximas = 0;
  let rondas = 0;
  const inicio = performance.now();
  let transcurrido = 0;

  do {
    for (const objetivo of objetivos) {
      const resultado = busquedaInterpolacion(lista, objetivo);
      estimaciones += resultado.estimaciones;
      if (resultado.estimaciones > maximas) maximas = resultado.estimaciones;
    }
    rondas++;
    transcurrido = performance.now() - inicio;
  } while (transcurrido < TIEMPO_MINIMO_MS);

  const busquedas = rondas * BUSQUEDAS_POR_RONDA;
  return {
    usuarios: lista.length,
    distribucion,
    estimacionesPromedio: estimaciones / busquedas,
    estimacionesMaximas: maximas,
    microsegundosPromedio: (transcurrido * 1000) / busquedas,
  };
}

export function medirTodo(): Medicion[] {
  return TAMANOS.flatMap((n) => [
    medir(idsParejos(n), "Parejos"),
    medir(idsDesiguales(n), "Desiguales"),
  ]);
}
