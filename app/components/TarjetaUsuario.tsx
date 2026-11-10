import type { Usuario } from "@/lib/busqueda";

interface TarjetaUsuarioProps {
  usuario: Usuario;
  estimaciones: number;
}

const formatoSalario = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const TarjetaUsuario = ({ usuario, estimaciones }: TarjetaUsuarioProps) => {
  return (
    <article>
      <h3>
        {usuario.nombre} {usuario.apellido}
      </h3>
      <dl>
        <dt>ID</dt>
        <dd>{usuario.id}</dd>
        <dt>Departamento</dt>
        <dd>{usuario.departamento}</dd>
        <dt>Salario</dt>
        <dd>{formatoSalario.format(usuario.salario)}</dd>
      </dl>
      <p>
        Encontrado en {estimaciones} {estimaciones === 1 ? "estimación" : "estimaciones"}
      </p>
    </article>
  );
};

export default TarjetaUsuario;
