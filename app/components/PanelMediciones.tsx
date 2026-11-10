import { useState } from "react";
import { medirTodo, type Medicion } from "@/lib/mediciones";

const PanelMediciones = () => {
  const [mediciones, setMediciones] = useState<Medicion[]>([]);

  return (
    <section>
      <h2>Comprobación</h2>
      <p>
        Mide la búsqueda con performance.now() sobre listas generadas. Con ids parejos las
        estimaciones casi no crecen; con valores muy desiguales sí.
      </p>
      <button type="button" onClick={() => setMediciones(medirTodo())}>
        Medir 1,000 / 10,000 / 100,000 usuarios
      </button>
      {mediciones.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Usuarios</th>
              <th>Ids</th>
              <th>Estimaciones (promedio)</th>
              <th>Estimaciones (máximo)</th>
              <th>Tiempo por búsqueda (µs)</th>
            </tr>
          </thead>
          <tbody>
            {mediciones.map((m) => (
              <tr key={`${m.usuarios}-${m.distribucion}`}>
                <td>{m.usuarios.toLocaleString("en-US")}</td>
                <td>{m.distribucion}</td>
                <td>{m.estimacionesPromedio.toFixed(1)}</td>
                <td>{m.estimacionesMaximas}</td>
                <td>{m.microsegundosPromedio.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default PanelMediciones;
