'use client';

import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F8FAFC',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '48px'
      }}>
        {/* Back Link */}
        <Link href="/" style={{ 
          color: '#1E3A5F', 
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ← Volver al Inicio
        </Link>

        {/* Title */}
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1E3A5F',
          marginBottom: '8px'
        }}>
          Términos de Servicio
        </h1>
        
        <p style={{ color: '#6B7280', marginBottom: '24px' }}>
          Última actualización: January 2025
        </p>

        {/* Important Notice Box */}
        <div style={{
          backgroundColor: '#FEF3C7',
          border: '2px solid #F59E0B',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <p style={{ fontWeight: 'bold', color: '#92400E', margin: 0 }}>
            ⚠️ AVISO IMPORTANTE: Multi Servicios 360 NO es un bufete de abogados y NO proporciona asesoría legal. 
            Este es un servicio de preparación de documentos legales de autoayuda. 
            El uso de este sitio web NO crea una relación abogado-cliente.
          </p>
        </div>

        {/* Table of Contents */}
        <div style={{
          backgroundColor: '#F1F5F9',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1E3A5F' }}>
            Índice
          </h2>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#475569', lineHeight: '1.8' }}>
            <li>Introducción y Aceptación</li>
            <li><strong>[ADDED]</strong> Definiciones</li>
            <li>No Somos un Bufete de Abogados</li>
            <li>No Existe Relación Abogado-Cliente</li>
            <li>Servicio de Autoayuda</li>
            <li>Revisión de Abogados (Servicio Opcional)</li>
            <li>Alcance de los Servicios y Descargo de Ejecución</li>
            <li>Elegibilidad</li>
            <li><strong>[ADDED]</strong> Cuenta y Responsabilidad de Seguridad</li>
            <li><strong>[ADDED]</strong> Uso Aceptable y Conducta Prohibida</li>
            <li>Responsabilidades del Usuario</li>
            <li>Limitaciones de Nuestros Servicios</li>
            <li>Precios y Pagos</li>
            <li>Política de Reembolsos</li>
            <li>Descargo de Responsabilidad</li>
            <li>Limitación de Responsabilidad</li>
            <li>Indemnización</li>
            <li>Propiedad Intelectual</li>
            <li>Privacidad</li>
            <li>Ley Aplicable y Jurisdicción</li>
            <li>Arbitraje</li>
            <li>Cambios a estos Términos</li>
            <li>Terminación</li>
            <li>Divisibilidad</li>
            <li>Información de Contacto</li>
            <li>Reconocimiento</li>
          </ol>
        </div>

        {/* Sections */}
        <div style={{ lineHeight: '1.7', color: '#374151' }}>
          
          {/* Section 1 */}
          <Section number="1" title="Introducción y Aceptación">
            <p>
              Bienvenido a Multi Servicios 360 ("nosotros", "nuestro" o la "Compañía"). Al acceder o utilizar 
              nuestro sitio web multiservicios360.net (el "Sitio") y nuestros servicios de preparación de documentos, 
              usted acepta estar sujeto a estos Términos de Servicio ("Términos"). Si no está de acuerdo con estos 
              Términos, no utilice nuestros servicios.
            </p>
            <WarningBox>
              AVISO IMPORTANTE: MULTI SERVICIOS 360 NO ES UN BUFETE DE ABOGADOS Y NO PROPORCIONA ASESORÍA LEGAL. 
              Somos un servicio de preparación de documentos legales de autoayuda.
            </WarningBox>
          </Section>

          {/* Section 2 - [ADDED] DEFINITIONS */}
          <Section number="2" title="Definiciones" added={true}>
            <p>Para los propósitos de estos Términos de Servicio, los siguientes términos tendrán los significados indicados:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>"Plataforma"</strong> se refiere al sitio web multiservicios360.net, incluyendo todas las páginas, 
                funcionalidades, aplicaciones y servicios proporcionados a través del mismo.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>"Servicio"</strong> se refiere a los servicios de preparación de documentos legales de autoayuda 
                proporcionados por Multi Servicios 360 a través de la Plataforma, incluyendo la generación de documentos 
                basada en la información proporcionada por el Usuario.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>"Usuario"</strong> se refiere a cualquier individuo que accede o utiliza la Plataforma para 
                preparar documentos legales para su propio uso personal o familiar.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>"Socio" o "Partner"</strong> se refiere a cualquier individuo o entidad comercial que ha sido 
                aprobado por Multi Servicios 360 para acceder al portal de socios y preparar documentos en nombre de 
                sus propios clientes, sujeto a un acuerdo de socio separado.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>"Documento"</strong> se refiere a cualquier documento legal generado a través de la Plataforma, 
                incluyendo pero no limitado a Poderes Notariales Generales, Poderes Notariales Limitados, y cualquier 
                otro documento que pueda ofrecerse en el futuro.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>"Revisión de Abogado"</strong> se refiere al servicio opcional y separado mediante el cual un 
                abogado independiente licenciado revisa un Documento preparado a través de la Plataforma. Este servicio 
                es proporcionado por abogados que no son empleados de Multi Servicios 360.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>"Información Legal Autodirigida"</strong> se refiere a la información general proporcionada en 
                la Plataforma que permite a los Usuarios tomar sus propias decisiones informadas sobre el contenido de 
                sus Documentos. Esta información no constituye asesoría legal y no reemplaza la consulta con un abogado 
                licenciado.
              </li>
            </ul>
          </Section>

          {/* Section 3 */}
          <Section number="3" title="No Somos un Bufete de Abogados">
            <p style={{ fontWeight: 'bold', marginBottom: '16px' }}>
              ESTE ES UN PUNTO CRÍTICO QUE USTED DEBE ENTENDER:
            </p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Multi Servicios 360 NO es un bufete de abogados.</li>
              <li>Multi Servicios 360 NO proporciona asesoría legal.</li>
              <li>Multi Servicios 360 NO puede representarlo en ningún asunto legal.</li>
              <li>Los empleados y representantes de Multi Servicios 360 NO son abogados (a menos que se indique 
                  expresamente lo contrario en el contexto de servicios opcionales de revisión de abogados).</li>
              <li>Multi Servicios 360 NO puede proporcionar asesoramiento sobre qué documentos son apropiados 
                  para su situación específica.</li>
            </ul>
            <p style={{ marginTop: '16px' }}>
              Nosotros proporcionamos una plataforma de autoayuda para la preparación de documentos legales basada 
              únicamente en la información que usted proporciona.
            </p>
          </Section>

          {/* Section 4 */}
          <Section number="4" title="No Existe Relación Abogado-Cliente">
            <p>
              El uso de este sitio web y nuestros servicios NO crea una relación abogado-cliente entre usted y 
              Multi Servicios 360, sus empleados, contratistas o afiliados.
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li>Ninguna comunicación con Multi Servicios 360 constituye asesoría legal.</li>
              <li>La información proporcionada en este sitio web es solo para fines informativos generales.</li>
              <li>No debe confiar en ninguna información de este sitio web como sustituto del asesoramiento legal profesional.</li>
              <li>Si necesita asesoría legal, debe consultar con un abogado licenciado.</li>
            </ul>
          </Section>

          {/* Section 5 */}
          <Section number="5" title="Servicio de Autoayuda">
            <p>Multi Servicios 360 proporciona un servicio de preparación de documentos legales de autoayuda. Esto significa:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li>Usted proporciona toda la información necesaria para preparar sus documentos.</li>
              <li>Usted selecciona los poderes, opciones y disposiciones incluidos en sus documentos.</li>
              <li>Usted es responsable de la exactitud y completitud de la información que proporciona.</li>
              <li>La plataforma NO recomienda ni selecciona opciones legales por usted.</li>
              <li>Usted toma todas las decisiones sobre el contenido de sus documentos.</li>
            </ul>
            <WarningBox>
              DECLARACIÓN DE CONTROL DEL USUARIO: Usted reconoce y acepta que USTED selecciona los poderes y opciones 
              incluidos en su documento. La plataforma no recomienda ni selecciona opciones legales por usted.
            </WarningBox>
          </Section>

          {/* Section 6 */}
          <Section number="6" title="Revisión de Abogados (Servicio Opcional)">
            <p>
              Multi Servicios 360 ofrece, como servicio OPCIONAL y SEPARADO, la posibilidad de que un abogado 
              independiente revise sus documentos.
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li>La revisión de abogados es completamente opcional y no es necesaria para usar nuestros servicios básicos.</li>
              <li>Los abogados que proporcionan servicios de revisión son INDEPENDIENTES y NO son empleados de Multi Servicios 360.</li>
              <li>Los abogados son licenciados en el Estado de California.</li>
              <li>Si elige la revisión de abogados, se establecerá una relación separada entre usted y el abogado revisor.</li>
              <li>Multi Servicios 360 no controla ni supervisa el trabajo de los abogados independientes.</li>
              <li>Los honorarios por la revisión de abogados son separados y se indican claramente antes de la compra.</li>
            </ul>
            <p style={{ marginTop: '16px' }}>
              Cualquier relación abogado-cliente que resulte de la revisión de abogados es únicamente entre usted y 
              el abogado independiente, NO con Multi Servicios 360.
            </p>
            
            {/* [ADDED] Attorney Review Clarification */}
            <div style={{ 
              backgroundColor: '#EFF6FF', 
              border: '1px solid #3B82F6', 
              borderRadius: '8px', 
              padding: '16px', 
              marginTop: '16px' 
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#1E40AF' }}>
                <strong>[ADDED] ACLARACIÓN IMPORTANTE SOBRE LA REVISIÓN DE ABOGADOS:</strong> La revisión de abogados 
                es un servicio opcional que no es requerido para completar su documento. Al seleccionar la revisión de 
                abogados, usted entiende que: (1) no se forma ninguna relación abogado-cliente con Multi Servicios 360; 
                (2) los abogados revisores son contratistas independientes licenciados en California que operan bajo su 
                propia responsabilidad profesional; (3) Multi Servicios 360 no supervisa, controla ni dirige el contenido 
                de ningún consejo legal proporcionado por los abogados revisores; y (4) cualquier relación profesional 
                resultante existe exclusivamente entre usted y el abogado independiente.
              </p>
            </div>
          </Section>

          {/* Section 7 - Scope of Services + [ADDED] Execution Disclaimer */}
          <Section number="7" title="Alcance de los Servicios y Descargo de Ejecución">
            <p>
              Nuestros servicios consisten únicamente en la preparación de documentos legales basados en la información 
              que usted proporciona. La Plataforma genera documentos utilizando plantillas que cumplen con los requisitos 
              del Código de California al momento de la preparación.
            </p>
            
            {/* [ADDED] Execution & Validity Disclaimer */}
            <div style={{ 
              backgroundColor: '#FEF2F2', 
              border: '2px solid #DC2626', 
              borderRadius: '8px', 
              padding: '16px', 
              marginTop: '16px' 
            }}>
              <p style={{ fontWeight: 'bold', color: '#991B1B', marginBottom: '12px' }}>
                [ADDED] DESCARGO DE RESPONSABILIDAD SOBRE EJECUCIÓN Y VALIDEZ:
              </p>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#7F1D1D' }}>
                <li style={{ marginBottom: '8px' }}>
                  Multi Servicios 360 NO garantiza la efectividad legal de ningún documento preparado a través de 
                  la Plataforma. La efectividad legal depende de múltiples factores, incluyendo pero no limitado a 
                  la exactitud de la información proporcionada, los requisitos específicos de su jurisdicción, y 
                  la ejecución adecuada del documento.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  La ejecución adecuada de los documentos (incluyendo la notarización, firmas de testigos, y 
                  cualquier otro requisito de formalidad) es RESPONSABILIDAD EXCLUSIVA DEL USUARIO. La Plataforma 
                  proporciona instrucciones generales, pero usted es responsable de asegurar el cumplimiento con 
                  todos los requisitos aplicables.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  El incumplimiento de los requisitos de ejecución adecuados puede resultar en que el documento 
                  sea legalmente inefectivo, nulo, o impugnable. Multi Servicios 360 no será responsable de ningún 
                  daño resultante de la ejecución inadecuada de documentos.
                </li>
                <li>
                  Si tiene dudas sobre los requisitos de ejecución aplicables a su situación específica, debe 
                  consultar con un abogado licenciado antes de ejecutar el documento.
                </li>
              </ul>
            </div>
          </Section>

          {/* Section 8 - Eligibility */}
          <Section number="8" title="Elegibilidad">
            <p>Para utilizar nuestros servicios, usted debe:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li>Tener al menos 18 años de edad.</li>
              <li>Tener la capacidad legal para celebrar contratos vinculantes.</li>
              <li>No estar impedido de utilizar los servicios bajo las leyes aplicables.</li>
              <li>Proporcionar información de contacto verdadera y precisa.</li>
            </ul>
          </Section>

          {/* Section 9 - [ADDED] Account & Security */}
          <Section number="9" title="Cuenta y Responsabilidad de Seguridad" added={true}>
            <p>
              Si crea una cuenta en la Plataforma, usted es responsable de mantener la confidencialidad de sus 
              credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Credenciales de Acceso:</strong> Usted es responsable de mantener la confidencialidad de su 
                nombre de usuario, contraseña, y cualquier otra credencial de acceso. Usted acepta notificar 
                inmediatamente a Multi Servicios 360 de cualquier uso no autorizado de su cuenta o cualquier otra 
                violación de seguridad.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Responsabilidad del Socio:</strong> Si usted es un Socio aprobado, usted es responsable de 
                todas las acciones realizadas bajo su cuenta de socio, incluyendo pero no limitado a la preparación 
                de documentos, el manejo de información de clientes, y el cumplimiento con todas las leyes y 
                regulaciones aplicables. Los Socios son responsables de asegurar que sus empleados y agentes 
                cumplan con estos Términos.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Suspensión y Terminación:</strong> Multi Servicios 360 se reserva el derecho de suspender o 
                terminar su acceso a la Plataforma inmediatamente, sin previo aviso, si determinamos razonablemente que: 
                (a) usted ha violado estos Términos; (b) su cuenta ha sido comprometida; (c) su uso de la Plataforma 
                presenta un riesgo de seguridad; o (d) es requerido por ley.
              </li>
            </ul>
          </Section>

          {/* Section 10 - [ADDED] Acceptable Use / Prohibited Conduct */}
          <Section number="10" title="Uso Aceptable y Conducta Prohibida" added={true}>
            <p>
              Al utilizar la Plataforma, usted acepta no participar en ninguna de las siguientes conductas prohibidas:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Suplantación de Identidad:</strong> Hacerse pasar por otra persona o entidad, o declarar 
                falsamente o tergiversar de otra manera su afiliación con una persona o entidad.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Uso Ilegal:</strong> Utilizar la Plataforma para cualquier propósito ilegal o para preparar 
                documentos que faciliten actividades ilegales.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Declaración Falsa como Abogado:</strong> Representarse a sí mismo como abogado, o dar la 
                impresión de que usted está autorizado para ejercer la abogacía, si no posee una licencia válida 
                para ejercer en la jurisdicción aplicable.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Alteración de Descargos de Responsabilidad:</strong> Alterar, eliminar, ocultar o modificar 
                de cualquier manera los descargos de responsabilidad, avisos legales, o declaraciones de no-abogado 
                contenidos en los Documentos generados o en la Plataforma.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Ingeniería Inversa:</strong> Copiar, extraer, raspar (scraping), realizar ingeniería inversa, 
                descompilar, o intentar derivar el código fuente, las plantillas de documentos, el lenguaje legal, 
                o la lógica subyacente de la Plataforma.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Interferencia con el Servicio:</strong> Interferir o intentar interferir con el funcionamiento 
                adecuado de la Plataforma, incluyendo pero no limitado a la introducción de virus, gusanos, o cualquier 
                otro código malicioso.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Acceso No Autorizado:</strong> Intentar obtener acceso no autorizado a cualquier parte de la 
                Plataforma, otras cuentas, sistemas informáticos, o redes conectadas a la Plataforma.
              </li>
            </ul>
            <p style={{ marginTop: '16px' }}>
              La violación de estas prohibiciones puede resultar en la terminación inmediata de su acceso a la 
              Plataforma y puede dar lugar a responsabilidad civil o penal.
            </p>
          </Section>

          {/* Section 11 */}
          <Section number="11" title="Responsabilidades del Usuario">
            <p>Al utilizar nuestros servicios, usted acepta:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li>Proporcionar información veraz, precisa, actual y completa.</li>
              <li>Revisar cuidadosamente todos los documentos antes de firmarlos.</li>
              <li>Entender que usted es responsable de todas las selecciones y decisiones en sus documentos.</li>
              <li>Obtener asesoría legal independiente si tiene preguntas sobre sus derechos legales.</li>
              <li>No usar nuestros servicios para ningún propósito ilegal o no autorizado.</li>
              <li>Cumplir con todas las leyes aplicables al usar nuestros servicios.</li>
            </ul>
            <WarningBox>
              USTED ES RESPONSABLE de verificar que los documentos sean apropiados para su situación específica.
            </WarningBox>
          </Section>

          {/* Section 12 */}
          <Section number="12" title="Limitaciones de Nuestros Servicios">
            <p>Nuestros servicios tienen las siguientes limitaciones:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li>No proporcionamos asesoría legal ni recomendaciones legales.</li>
              <li>No podemos garantizar que los documentos sean apropiados para su situación específica.</li>
              <li>No podemos garantizar ningún resultado legal particular.</li>
              <li>No proporcionamos servicios de representación legal.</li>
              <li>No podemos responder preguntas que requieran juicio legal o interpretación de la ley.</li>
              <li>No somos responsables de cambios en las leyes que puedan afectar sus documentos después de su preparación.</li>
            </ul>
            <p style={{ marginTop: '16px' }}>
              Los documentos se preparan basándose en las leyes vigentes de California al momento de la preparación.
            </p>
          </Section>

          {/* Section 13 */}
          <Section number="13" title="Precios y Pagos">
            <ul style={{ paddingLeft: '20px' }}>
              <li>Todos los precios se muestran en dólares estadounidenses (USD).</li>
              <li>Los precios incluyen la preparación del documento según se describe en cada servicio.</li>
              <li>Los servicios adicionales (como revisión de abogados, coordinación notarial, o registro de condado) 
                  tienen cargos adicionales que se muestran claramente.</li>
              <li>El pago debe completarse antes de recibir los documentos finales.</li>
              <li>Aceptamos pagos mediante tarjetas de crédito y débito a través de procesadores de pago seguros.</li>
            </ul>
          </Section>

          {/* Section 14 */}
          <Section number="14" title="Política de Reembolsos">
            <ul style={{ paddingLeft: '20px' }}>
              <li>Debido a la naturaleza digital de nuestros servicios, generalmente no ofrecemos reembolsos una vez 
                  que el proceso de preparación del documento ha comenzado.</li>
              <li>Si hay un error atribuible a Multi Servicios 360, corregiremos el documento sin cargo adicional.</li>
              <li>Las solicitudes de reembolso serán evaluadas caso por caso.</li>
              <li>Para solicitar un reembolso, contáctenos dentro de los 30 días posteriores a su compra.</li>
            </ul>
          </Section>

          {/* Section 15 */}
          <Section number="15" title="Descargo de Responsabilidad">
            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>
              LOS SERVICIOS SE PROPORCIONAN "TAL CUAL" Y "SEGÚN DISPONIBILIDAD" SIN GARANTÍAS DE NINGÚN TIPO, 
              YA SEAN EXPRESAS O IMPLÍCITAS.
            </p>
            <p>MULTI SERVICIOS 360 EXPRESAMENTE RENUNCIA A TODAS LAS GARANTÍAS, INCLUYENDO, PERO NO LIMITADO A:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li>Garantías implícitas de comerciabilidad</li>
              <li>Idoneidad para un propósito particular</li>
              <li>No infracción</li>
              <li>Garantías de que los servicios serán ininterrumpidos o libres de errores</li>
              <li>Garantías de que los documentos lograrán algún resultado legal particular</li>
            </ul>
            <WarningBox>
              USTED ACEPTA QUE EL USO DE NUESTROS SERVICIOS ES BAJO SU PROPIO RIESGO.
            </WarningBox>
          </Section>

          {/* Section 16 */}
          <Section number="16" title="Limitación de Responsabilidad">
            <p style={{ fontWeight: 'bold', marginBottom: '16px' }}>
              EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE:
            </p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Multi Servicios 360, sus directores, empleados, agentes y afiliados NO serán responsables de ningún 
                  daño indirecto, incidental, especial, consecuente o punitivo.</li>
              <li>Nuestra responsabilidad total por cualquier reclamo relacionado con nuestros servicios no excederá 
                  el monto que usted pagó por el servicio específico en cuestión.</li>
              <li>Esta limitación de responsabilidad se aplica independientemente de la teoría legal bajo la cual 
                  se busque la responsabilidad.</li>
            </ul>
            <p style={{ marginTop: '16px', fontStyle: 'italic' }}>
              Algunos estados no permiten la exclusión o limitación de ciertos daños, por lo que algunas de las 
              limitaciones anteriores pueden no aplicarse a usted.
            </p>
          </Section>

          {/* Section 17 */}
          <Section number="17" title="Indemnización">
            <p>
              Usted acepta indemnizar, defender y mantener indemne a Multi Servicios 360, sus directores, empleados, 
              agentes y afiliados de y contra cualquier reclamo, responsabilidad, daño, pérdida y gasto (incluyendo 
              honorarios razonables de abogados) que surjan de:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li>Su uso de nuestros servicios</li>
              <li>Su violación de estos Términos</li>
              <li>Su violación de cualquier ley o los derechos de terceros</li>
              <li>Cualquier información inexacta o incompleta que usted proporcione</li>
            </ul>
          </Section>

          {/* Section 18 */}
          <Section number="18" title="Propiedad Intelectual">
            <ul style={{ paddingLeft: '20px' }}>
              <li>Todo el contenido del sitio web, incluyendo textos, gráficos, logotipos, iconos, imágenes y software, 
                  es propiedad de Multi Servicios 360 o sus licenciantes.</li>
              <li>No puede copiar, reproducir, distribuir o crear obras derivadas de nuestro contenido sin autorización escrita.</li>
              <li>Los documentos que preparamos para usted son de su propiedad una vez que se complete el pago.</li>
            </ul>
          </Section>

          {/* Section 19 */}
          <Section number="19" title="Privacidad">
            <p>
              Su privacidad es importante para nosotros. Nuestra recopilación y uso de su información personal se rige 
              por nuestra Política de Privacidad, que se incorpora a estos Términos por referencia. Al usar nuestros 
              servicios, usted consiente la recopilación y uso de su información como se describe en nuestra Política 
              de Privacidad.
            </p>
          </Section>

          {/* Section 20 */}
          <Section number="20" title="Ley Aplicable y Jurisdicción">
            <ul style={{ paddingLeft: '20px' }}>
              <li>Estos Términos se regirán e interpretarán de acuerdo con las leyes del Estado de California, sin dar 
                  efecto a ningún principio de conflicto de leyes.</li>
              <li>Cualquier disputa que surja de o en relación con estos Términos o nuestros servicios estará sujeta a 
                  la jurisdicción exclusiva de los tribunales estatales y federales ubicados en el Condado de Los Ángeles, 
                  California.</li>
              <li>Usted acepta someterse a la jurisdicción personal de dichos tribunales.</li>
            </ul>
          </Section>

          {/* Section 21 */}
          <Section number="21" title="Arbitraje">
            <p style={{ fontWeight: 'bold', marginBottom: '16px' }}>
              ACUERDO DE ARBITRAJE: Usted y Multi Servicios 360 acuerdan que cualquier disputa, reclamo o controversia 
              que surja de o se relacione con estos Términos o nuestros servicios se resolverá mediante arbitraje 
              vinculante, en lugar de en un tribunal.
            </p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>El arbitraje se llevará a cabo de acuerdo con las reglas de la Asociación Americana de Arbitraje (AAA).</li>
              <li>El arbitraje se llevará a cabo en Los Ángeles, California.</li>
              <li>El árbitro aplicará la ley de California.</li>
              <li>La decisión del árbitro será final y vinculante.</li>
            </ul>
            <WarningBox>
              RENUNCIA A DEMANDAS COLECTIVAS: Usted acepta que cualquier arbitraje o procedimiento se llevará a cabo 
              únicamente de forma individual, y no como parte de una acción colectiva, consolidada o representativa.
            </WarningBox>
          </Section>

          {/* Section 22 */}
          <Section number="22" title="Cambios a estos Términos">
            <ul style={{ paddingLeft: '20px' }}>
              <li>Nos reservamos el derecho de modificar estos Términos en cualquier momento.</li>
              <li>Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio web.</li>
              <li>Su uso continuado de nuestros servicios después de cualquier cambio constituye su aceptación de los 
                  nuevos Términos.</li>
              <li>Es su responsabilidad revisar estos Términos periódicamente.</li>
            </ul>
          </Section>

          {/* Section 23 */}
          <Section number="23" title="Terminación">
            <ul style={{ paddingLeft: '20px' }}>
              <li>Podemos terminar o suspender su acceso a nuestros servicios inmediatamente, sin previo aviso, por 
                  cualquier motivo.</li>
              <li>Tras la terminación, su derecho a usar nuestros servicios cesará inmediatamente.</li>
              <li>Las disposiciones de estos Términos que por su naturaleza deberían sobrevivir a la terminación, 
                  sobrevivirán.</li>
            </ul>
          </Section>

          {/* Section 24 */}
          <Section number="24" title="Divisibilidad">
            <p>
              Si alguna disposición de estos Términos se considera inválida, ilegal o inaplicable por un tribunal de 
              jurisdicción competente, dicha disposición se modificará e interpretará para lograr los objetivos de 
              dicha disposición en la mayor medida posible bajo la ley aplicable, y las disposiciones restantes 
              continuarán en pleno vigor y efecto.
            </p>
          </Section>

          {/* Section 25 */}
          <Section number="25" title="Información de Contacto">
            <p>Si tiene preguntas sobre estos Términos de Servicio, puede contactarnos:</p>
            <div style={{ 
              backgroundColor: '#F1F5F9', 
              borderRadius: '8px', 
              padding: '16px', 
              marginTop: '16px' 
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Multi Servicios 360</p>
              <p style={{ margin: '0 0 4px 0' }}>Beverly Hills, CA</p>
              <p style={{ margin: '0 0 4px 0' }}>Teléfono: 855.246.7274</p>
              <p style={{ margin: '0 0 4px 0' }}>Email: info@multiservicios360.net</p>
              <p style={{ margin: 0 }}>Horario: Lunes - Viernes, 9am - 6pm (Hora del Pacífico)</p>
            </div>
          </Section>

          {/* Section 26 */}
          <Section number="26" title="Reconocimiento">
            <p style={{ fontWeight: 'bold', marginBottom: '16px' }}>
              AL UTILIZAR NUESTROS SERVICIOS, USTED RECONOCE QUE:
            </p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Ha leído y entendido estos Términos de Servicio.</li>
              <li>Multi Servicios 360 NO es un bufete de abogados y NO proporciona asesoría legal.</li>
              <li>El uso de este sitio web NO crea una relación abogado-cliente.</li>
              <li>USTED es responsable de seleccionar las opciones y poderes en sus documentos.</li>
              <li>USTED es responsable de la ejecución adecuada de los documentos (notarización, testigos, etc.).</li>
              <li>La revisión de abogados es OPCIONAL y proporcionada por abogados INDEPENDIENTES.</li>
              <li>Acepta estar sujeto a estos Términos de Servicio.</li>
            </ul>
          </Section>

        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '48px', 
          paddingTop: '24px', 
          borderTop: '1px solid #E5E7EB',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6B7280', marginBottom: '8px' }}>¿Preguntas sobre estos términos?</p>
          <p style={{ color: '#1E3A5F', fontWeight: 'bold' }}>855.246.7274</p>
          <p style={{ color: '#1E3A5F' }}>info@multiservicios360.net</p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Section({ number, title, children, added = false }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#1E3A5F',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {number}. {title}
        {added && (
          <span style={{ 
            backgroundColor: '#10B981', 
            color: 'white', 
            fontSize: '12px', 
            padding: '2px 8px', 
            borderRadius: '4px' 
          }}>
            [ADDED]
          </span>
        )}
      </h2>
      {children}
    </div>
  );
}

function WarningBox({ children }) {
  return (
    <div style={{
      backgroundColor: '#FEF3C7',
      border: '1px solid #F59E0B',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px'
    }}>
      <p style={{ fontWeight: 'bold', color: '#92400E', margin: 0 }}>
        {children}
      </p>
    </div>
  );
}