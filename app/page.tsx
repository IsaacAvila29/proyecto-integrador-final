"use client";

import { useState, type SubmitEvent } from "react";
import datos from "@/data/usuarios.json";
import { busquedaInterpolacion, ordenarPorId, type Usuario } from "@/lib/busqueda";
import PanelMediciones from "./components/PanelMediciones";
import TarjetaUsuario from "./components/TarjetaUsuario";

interface Resultado {
  idBuscado: number;
  usuario: Usuario | null;
  estimaciones: number;
}

const Page = () => {
  // El inicializador corre una sola vez: la lista se ordena al cargarla.
  const [usuarios] = useState<Usuario[]>(() => ordenarPorId(datos));
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState("");

  const buscar = (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const id = Number(texto);
    if (texto.trim() === "" || !Number.isSafeInteger(id)) {
      setError("Escribe un id numérico entero.");
      setResultado(null);
      return;
    }

    const { indice, estimaciones } = busquedaInterpolacion(usuarios, id);
    setError("");
    setResultado({
      idBuscado: id,
      usuario: indice === -1 ? null : usuarios[indice],
      estimaciones,
    });
  };

  return (
    <>
      <header>
        <h1>Búsqueda por interpolación</h1>
        <p>
          {usuarios.length.toLocaleString("en-US")} usuarios, ids del {usuarios[0].id} al{" "}
          {usuarios[usuarios.length - 1].id}
        </p>
      </header>

      <main>
        <section>
          <h2>Buscar usuario</h2>
          <form onSubmit={buscar} noValidate>
            <label htmlFor="id-usuario">Id del usuario:</label>
            <input
              id="id-usuario"
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
              inputMode="numeric"
              autoComplete="off"
            />
            <button type="submit">Buscar</button>
          </form>

          {error && <p role="alert">{error}</p>}

          {resultado?.usuario && (
            <TarjetaUsuario usuario={resultado.usuario} estimaciones={resultado.estimaciones} />
          )}
          {resultado && !resultado.usuario && (
            <article>
              No hay ningún usuario con id {resultado.idBuscado} ({resultado.estimaciones}{" "}
              {resultado.estimaciones === 1 ? "estimación" : "estimaciones"}).
            </article>
          )}
        </section>

        <PanelMediciones />
      </main>
    </>
  );
};

export default Page;
