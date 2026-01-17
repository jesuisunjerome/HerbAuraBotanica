import SEORender from "../../layouts/SEORender";

export default function PolicyPage() {
  return (
    <>
      <SEORender
        title="Términos y Condiciones :: HerbAura Botanica"
        description="Lee los términos y condiciones de HerbAura Botanica. Información sobre compras, envíos, devoluciones y políticas de privacidad para una experiencia segura y confiable."
      />
      <div className="policy-page">
        <h1>Términos y Condiciones</h1>
        <p>
          Bienvenido a HerbAura Botanica. Al acceder y utilizar nuestro sitio
          web, aceptas cumplir con los siguientes términos y condiciones. Por
          favor, lee atentamente esta información antes de realizar cualquier
          compra.
        </p>
        <h2>1. Información del Producto</h2>
        <p>
          Nos esforzamos por proporcionar descripciones precisas y detalladas de
          nuestros productos. Sin embargo, no garantizamos que la información
          sea completa o libre de errores.
        </p>
        <h2>2. Compras y Pagos</h2>
        <p>
          Al realizar una compra, aceptas pagar el precio total indicado en el
          momento de la compra. Nos reservamos el derecho de rechazar cualquier
          pedido por razones legítimas.
        </p>
        <h2>3. Envíos y Entregas</h2>
        <p>
          Los tiempos de envío son estimados y pueden variar según la ubicación.
          No nos hacemos responsables por retrasos causados por terceros o
          circunstancias fuera de nuestro control.
        </p>
        <h2>4. Devoluciones y Reembolsos</h2>
        <p>
          Aceptamos devoluciones dentro de los 30 días posteriores a la compra,
          siempre que el producto esté en su estado original. Los reembolsos se
          procesarán una vez que recibamos el producto devuelto.
        </p>
        <h2>5. Privacidad</h2>
        <p>
          Nos comprometemos a proteger tu privacidad. Consulta nuestra Política
          de Privacidad para obtener más información sobre cómo recopilamos y
          utilizamos tus datos.
        </p>
        <h2>6. Modificaciones de los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos y condiciones en
          cualquier momento. Las modificaciones entrarán en vigor inmediatamente
          después de su publicación en nuestro sitio web.
        </p>
        <h2>7. Contacto</h2>
        <p>
          Si tienes alguna pregunta o inquietud sobre estos términos y
          condiciones, no dudes en contactarnos a través de nuestro formulario
          de contacto.
        </p>
      </div>
    </>
  );
}
