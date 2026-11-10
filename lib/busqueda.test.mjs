import assert from "node:assert/strict";
import { test } from "node:test";
import { busquedaInterpolacion } from "./busqueda.ts";

const conIds = (ids) => ids.map((id) => ({ id }));

test("lista vacía: no encuentra nada y no estima", () => {
  assert.deepEqual(busquedaInterpolacion([], 5), { indice: -1, estimaciones: 0 });
});

test("un solo usuario: lo encuentra sin dividir entre cero", () => {
  assert.deepEqual(busquedaInterpolacion(conIds([7]), 7), { indice: 0, estimaciones: 1 });
  assert.equal(busquedaInterpolacion(conIds([7]), 8).indice, -1);
  assert.equal(busquedaInterpolacion(conIds([7]), 6).indice, -1);
});

test("todos los ids iguales: no divide entre cero", () => {
  const lista = conIds([4, 4, 4, 4, 4]);
  assert.equal(lista[busquedaInterpolacion(lista, 4).indice].id, 4);
  assert.equal(busquedaInterpolacion(lista, 3).indice, -1);
  assert.equal(busquedaInterpolacion(lista, 5).indice, -1);
});

test("ids repetidos: encuentra el id y termina", () => {
  const lista = conIds([1, 2, 2, 2, 3, 3, 9, 9, 9, 10]);
  for (const objetivo of [1, 2, 3, 9, 10]) {
    assert.equal(lista[busquedaInterpolacion(lista, objetivo).indice].id, objetivo);
  }
  for (const objetivo of [0, 4, 8, 11]) {
    assert.equal(busquedaInterpolacion(lista, objetivo).indice, -1);
  }
});

test("coincide con una revisión lineal en listas al azar", () => {
  let semilla = 1;
  const azar = (tope) => {
    semilla = (semilla * 48271) % 2147483647;
    return semilla % tope;
  };

  for (let ronda = 0; ronda < 300; ronda++) {
    const lista = conIds(Array.from({ length: azar(60) }, () => azar(100)).sort((a, b) => a - b));
    for (let objetivo = -1; objetivo <= 100; objetivo++) {
      const { indice } = busquedaInterpolacion(lista, objetivo);
      if (lista.some((u) => u.id === objetivo)) {
        assert.equal(lista[indice].id, objetivo);
      } else {
        assert.equal(indice, -1);
      }
    }
  }
});

test("ids parejos consecutivos: basta una estimación", () => {
  const lista = conIds(Array.from({ length: 100_000 }, (_, i) => i + 1));
  assert.deepEqual(busquedaInterpolacion(lista, 61_803), { indice: 61_802, estimaciones: 1 });
});

test("valores que se duplican: avanza casi de uno en uno", () => {
  const lista = conIds(Array.from({ length: 50 }, (_, i) => 2 ** (i + 1)));
  const { indice, estimaciones } = busquedaInterpolacion(lista, 2 ** 40);
  assert.equal(indice, 39);
  assert.ok(estimaciones >= 30, `esperaba muchas estimaciones, hubo ${estimaciones}`);
});
