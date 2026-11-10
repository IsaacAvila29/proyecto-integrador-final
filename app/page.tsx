"use client";

import { useState, type SubmitEvent } from "react";
import datos from "@/data/usuarios.json";
import datosNoSecuenciales from "@/data/usuarios-no-secuenciales.json";
import { busquedaInterpolacion } from "@/lib/busqueda";

// Hace varias búsquedas sobre una lista y devuelve una fila para la tabla.
function probar(tipo: string, lista: { id: number }[], busquedas: number) {
  let estimaciones = 0;
  const inicio = performance.now();

  for (let i = 0; i < busquedas; i++) {
    const objetivo = lista[Math.floor((i * lista.length) / busquedas)].id;
    estimaciones += busquedaInterpolacion(lista, objetivo).estimaciones;
  }

  const microsegundos = (performance.now() - inicio) * 1000;
  return [
    String(lista.length),
    tipo,
    (estimaciones / busquedas).toFixed(1),
    (microsegundos / busquedas).toFixed(2),
  ];
}

function medir() {
  const filas = [];

  for (const n of [1000, 10000, 100000]) {
    // Ids parejos: cada uno está poco después del anterior.
    const parejos = [];
    let id = 0;
    for (let i = 0; i < n; i++) {
      id += 1 + Math.floor(Math.random() * 20);
      parejos.push({ id });
    }

    // Ids desiguales: crecen de forma exponencial.
    const desiguales = [];
    for (let i = 0; i < n; i++) {
      desiguales.push({ id: i + Math.floor(2 ** ((52 * i) / (n - 1))) });
    }

    filas.push(probar("Parejos", parejos, 20000));
    filas.push(probar("Desiguales", desiguales, 200));
  }

  return filas;
}

export default function Page() {
  // Las listas se ordenan una sola vez, al cargarlas.
  const [secuenciales] = useState(() => [...datos].sort((a, b) => a.id - b.id));
  const [noSecuenciales] = useState(() => [...datosNoSecuenciales].sort((a, b) => a.id - b.id));
  const [listaElegida, setListaElegida] = useState("secuenciales");
  const usuarios = listaElegida === "secuenciales" ? secuenciales : noSecuenciales;

  const [texto, setTexto] = useState("");
  const [indice, setIndice] = useState(-1);
  const [mensaje, setMensaje] = useState("");
  const [filas, setFilas] = useState<string[][]>([]);

  function cambiarLista(lista: string) {
    setListaElegida(lista);
    // El resultado anterior era de la otra lista: se limpia.
    setIndice(-1);
    setMensaje("");
  }

  function buscar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();

    const id = Number(texto);
    if (texto === "" || !Number.isInteger(id)) {
      setIndice(-1);
      setMensaje("Escribe un id numérico entero.");
      return;
    }

    const resultado = busquedaInterpolacion(usuarios, id);
    setIndice(resultado.indice);
    if (resultado.indice === -1) {
      setMensaje(`No hay ningún usuario con id ${id}. Estimaciones: ${resultado.estimaciones}`);
    } else {
      setMensaje(`Estimaciones: ${resultado.estimaciones}`);
    }
  }

  return (
    <main>
      <h1>Búsqueda por interpolación</h1>

      <section>
        <h2>Buscar usuario</h2>
        <div role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={listaElegida === "secuenciales"}
            onClick={() => cambiarLista("secuenciales")}
          >
            Ids secuenciales
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={listaElegida === "no-secuenciales"}
            onClick={() => cambiarLista("no-secuenciales")}
          >
            Ids no secuenciales
          </button>
        </div>
        <p>
          {usuarios.length} usuarios, ids del {usuarios[0].id} al {usuarios[usuarios.length - 1].id}
          . Primeros ids: {usuarios[0].id}, {usuarios[1].id}, {usuarios[2].id}, {usuarios[3].id},{" "}
          {usuarios[4].id}
        </p>
        <form onSubmit={buscar} noValidate>
          <label htmlFor="id-usuario">Id del usuario:</label>
          <input
            id="id-usuario"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            autoComplete="off"
          />
          <button type="submit">Buscar</button>
        </form>

        {indice !== -1 && (
          <article>
            <h3>
              {usuarios[indice].nombre} {usuarios[indice].apellido}
            </h3>
            <p>ID: {usuarios[indice].id}</p>
            <p>Departamento: {usuarios[indice].departamento}</p>
            <p>Salario: ${usuarios[indice].salario}</p>
          </article>
        )}

        <p>{mensaje}</p>
      </section>

      <section>
        <h2>Comprobación</h2>
        <button type="button" onClick={() => setFilas(medir())}>
          Medir
        </button>

        {filas.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Usuarios</th>
                <th>Ids</th>
                <th>Estimaciones (promedio)</th>
                <th>Tiempo por búsqueda (µs)</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => (
                <tr key={i}>
                  <td>{fila[0]}</td>
                  <td>{fila[1]}</td>
                  <td>{fila[2]}</td>
                  <td>{fila[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
