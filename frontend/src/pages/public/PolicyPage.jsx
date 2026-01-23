import SEORender from "../../layouts/SEORender";

export default function PolicyPage() {
  return (
    <>
      <SEORender
        title="Términos y Condiciones :: HerbAura Botanica"
        description="Lee los términos y condiciones de HerbAura Botanica. Información sobre compras, envíos, devoluciones y políticas de privacidad para una experiencia segura y confiable."
      />
      <section className="md:px-5 px-3 lg:px-20 pt-10 pb-20 relative bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold text-lg">Términos y Condiciones</p>
          <p>
            Bienvenido a HerbAura Botanica. Al acceder y utilizar nuestro sitio
            web, aceptas cumplir con los siguientes términos y condiciones. Por
            favor, lee atentamente esta información antes de realizar cualquier
            compra.
          </p>

          <ul className="list-decimal list-inside mt-6 space-y-4">
            <li>
              <span className="font-medium leading-tight">
                Información del Producto
              </span>
              <p className="text-gray-700 leading-tight">
                Nos esforzamos por proporcionar descripciones precisas y
                detalladas de nuestros productos. Sin embargo, no garantizamos
                que la información sea completa o libre de errores.
              </p>
            </li>
            <li>
              <span className="font-medium leading-tight">Compras y Pagos</span>
              <p className="text-gray-700 leading-tight">
                Al realizar una compra, aceptas pagar el precio total indicado
                en el momento de la compra. Nos reservamos el derecho de
                rechazar cualquier pedido por razones legítimas.
              </p>
            </li>
            <li>
              <span className="font-medium leading-tight">
                Envíos y Entregas
              </span>
              <p className="text-gray-700 leading-tight">
                Los tiempos de envío son estimados y pueden variar según la
                ubicación. No nos hacemos responsables por retrasos causados por
                terceros o circunstancias fuera de nuestro control.
              </p>
            </li>
            <li>
              <span className="font-medium leading-tight">
                Devoluciones y Reembolsos
              </span>
              <p className="text-gray-700 leading-tight">
                Aceptamos devoluciones dentro de los 30 días posteriores a la
                compra, siempre que el producto esté en su estado original. Los
                reembolsos se procesarán una vez que recibamos el producto
                devuelto.
              </p>
            </li>
            <li>
              <span className="font-medium leading-tight">Privacidad</span>
              <p className="text-gray-700 leading-tight">
                Nos comprometemos a proteger tu privacidad. Consulta nuestra
                Política de Privacidad para obtener más información sobre cómo
                recopilamos y utilizamos tus datos.
              </p>
            </li>
            <li>
              <span className="font-medium leading-tight">
                Modificaciones de los Términos
              </span>
              <p className="text-gray-700 leading-tight">
                Nos reservamos el derecho de modificar estos términos y
                condiciones en cualquier momento. Las modificaciones entrarán en
                vigor inmediatamente después de su publicación en nuestro sitio
                web.
              </p>
            </li>
            <li>
              <span className="font-medium leading-tight">Contacto</span>
              <p className="text-gray-700 leading-tight">
                Si tienes alguna pregunta o inquietud sobre estos términos y
                condiciones, no dudes en contactarnos a través de nuestro
                formulario de contacto.
              </p>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
