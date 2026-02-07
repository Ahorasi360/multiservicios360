// lib/oa-clauses-es.js
// =====================================================
// COMPLETE SPANISH OPERATING AGREEMENT CLAUSE LIBRARY
// California LLC — Proper legal Spanish with CA statutory references
// =====================================================
//
// Architecture: When language='es', generate-oa route pulls content
// from this map instead of reading English .md files.
// Token replacement ({{company_name}} etc.) still applies.
//
// Usage:
//   import { SPANISH_CLAUSES } from '@/lib/oa-clauses-es';
//   const content = SPANISH_CLAUSES['OA_001']; // returns Spanish text

export const SPANISH_CLAUSES = {

// =====================================================
// OA_000: PREÁMBULO Y CONSIDERANDOS
// =====================================================
'OA_000': `ACUERDO OPERATIVO

ACUERDO OPERATIVO
DE
{{company_name}}
Una Compañía de Responsabilidad Limitada de California

ESTE ACUERDO OPERATIVO (este "Acuerdo") de {{company_name}}, una compañía de responsabilidad limitada de California (la "Compañía"), se celebra y entra en vigor a partir del {{effective_date}} (la "Fecha Efectiva"), por y entre {{member_names_and_clause}}.

CONSIDERANDOS

POR CUANTO, la Compañía fue formada como una compañía de responsabilidad limitada de California mediante la presentación de los Artículos de Organización ante el Secretario de Estado de California el {{formation_date}} de conformidad con la Ley Revisada Uniforme de Compañías de Responsabilidad Limitada de California, Título 2.6 del Código de Corporaciones de California, Secciones 17701.01 y siguientes (según se modifique de tiempo en tiempo, la "Ley");

POR CUANTO, {{member_reference_es}} desea(n) celebrar este Acuerdo para establecer los términos y condiciones que regirán la operación y administración de la Compañía, los derechos y obligaciones de {{member_reference_es}}, y asuntos relacionados;

POR CUANTO, {{member_reference_es}} desea(n) confirmar el estatus de responsabilidad limitada de {{member_reference_es}} y proporcionar la administración ordenada y operación de la Compañía; y

POR CUANTO, {{member_reference_es}} pretende(n) que este Acuerdo constituya el "acuerdo operativo" de la Compañía según se define ese término en la Sección 17701.02(s) de la Ley.

AHORA, POR LO TANTO, en consideración de los pactos y acuerdos mutuos aquí establecidos, y por otra buena y valiosa consideración, cuyo recibo y suficiencia se reconocen por este medio, las partes acuerdan lo siguiente:`,

// =====================================================
// OA_001: FORMACIÓN Y ORGANIZACIÓN
// =====================================================
'OA_001': `ARTÍCULO — FORMACIÓN Y ORGANIZACIÓN

Sección 1.1. Formación. La Compañía fue formada como una compañía de responsabilidad limitada de California mediante la presentación de los Artículos de Organización ante el Secretario de Estado de California el {{formation_date}} de conformidad con la Ley Revisada Uniforme de Compañías de Responsabilidad Limitada de California, Título 2.6 del Código de Corporaciones de California, Secciones 17701.01 y siguientes (según se modifique de tiempo en tiempo, la "Ley"). Los derechos y obligaciones de los Miembros y la administración, disolución y terminación de la Compañía se regirán por este Acuerdo y, en la medida en que no sea inconsistente con el mismo, por la Ley.

Sección 1.2. Nombre. El nombre de la Compañía es {{company_name}}. El negocio de la Compañía puede conducirse bajo ese nombre o, previa conformidad con las leyes aplicables, cualquier otro nombre que {{member_reference_es}} considere apropiado o aconsejable. {{member_reference_es}} presentará o hará que se presenten todas las declaraciones de nombre ficticio de negocio y presentaciones similares, y cualquier enmienda a las mismas, que {{member_reference_es}} considere apropiadas o aconsejables.

Sección 1.3. Oficina Principal. La oficina principal de la Compañía estará ubicada en {{principal_address}}, o en cualquier otro lugar que {{member_reference_es}} pueda designar de tiempo en tiempo. La Compañía puede mantener oficinas adicionales en cualquier otro lugar que {{member_reference_es}} considere aconsejable.

Sección 1.4. Agente Registrado. El nombre y dirección del agente inicial de la Compañía para recepción de notificaciones de proceso legal en el Estado de California es {{agent_name}}, ubicado en {{agent_address}}. {{member_reference_es}} puede, de tiempo en tiempo, cambiar el agente registrado cumpliendo con las disposiciones aplicables de la Ley y la ley aplicable.

Sección 1.5. Plazo. La Compañía continuará en existencia hasta que sea disuelta de conformidad con las disposiciones de este Acuerdo o la Ley.

Sección 1.6. Presentaciones; Agente. {{member_reference_es}} ejecutará, entregará, presentará y registrará todos los certificados, documentos y otros instrumentos que puedan ser requeridos bajo las leyes del Estado de California o cualquier otra jurisdicción en la que la Compañía conduzca o planee conducir negocios, y tomará las acciones adicionales que sean apropiadas para cumplir con todos los requisitos para la formación, continuación y operación de una compañía de responsabilidad limitada bajo las leyes de todas dichas jurisdicciones.`,

// =====================================================
// OA_002: PROPÓSITO Y PODERES
// =====================================================
'OA_002': `ARTÍCULO — PROPÓSITO Y PODERES

Sección 2.1. Propósito. El propósito de la Compañía es {{business_purpose_text_es}}; y participar en cualquiera y todas las demás actividades y transacciones legales que sean necesarias, incidentales o aconsejables para llevar a cabo el propósito anterior, incluyendo, sin limitación, celebrar cualquier sociedad, empresa conjunta u otro arreglo similar, poseer intereses en cualquier otra entidad, y hacer cualquiera y todas las cosas necesarias, convenientes o incidentales para el cumplimiento de los propósitos anteriores.

Sección 2.2. Poderes. La Compañía tendrá todos los poderes y privilegios otorgados por la Ley, por cualquier otra ley, o por este Acuerdo, junto con cualquier poder incidental a los mismos, incluyendo los poderes y privilegios que sean necesarios o convenientes para la conducción, promoción o logro del negocio, propósitos o actividades de la Compañía. No obstante lo anterior, la Compañía no participará en ninguna actividad que requiera que la Compañía se registre como una compañía de inversión bajo la Ley de Compañías de Inversión de 1940, según enmendada, o que cause que la Compañía sea clasificada como una asociación gravable como corporación para propósitos del impuesto federal sobre la renta.`,

// =====================================================
// OA_003: DEFINICIONES
// =====================================================
'OA_003': `ARTÍCULO — DEFINICIONES

Sección 3.1. Definiciones. Según se usan en este Acuerdo, los siguientes términos tendrán los significados establecidos a continuación:

(a) "Ley" significa la Ley Revisada Uniforme de Compañías de Responsabilidad Limitada de California, Título 2.6 del Código de Corporaciones de California, Secciones 17701.01 y siguientes, según se modifique de tiempo en tiempo.

(b) "Afiliado" significa, con respecto a cualquier Persona, cualquier otra Persona que, directa o indirectamente a través de uno o más intermediarios, controla, es controlada por, o está bajo control común con, dicha Persona. Para propósitos de esta definición, "control" (incluyendo los términos "controlado por" y "bajo control común con") significa la posesión, directa o indirectamente, del poder para dirigir o causar la dirección de la administración y políticas de una Persona, ya sea a través de la propiedad de valores con derecho a voto, por contrato, o de otra manera.

(c) "Acuerdo" o "Acuerdo Operativo" significa este Acuerdo Operativo de {{company_name}}, según se ejecutó originalmente y según se enmiende, modifique, complemente o reformule de tiempo en tiempo de conformidad con los términos del mismo.

(d) "Artículos de Organización" significa los Artículos de Organización de la Compañía según se presentaron ante el Secretario de Estado de California, según se enmienden de tiempo en tiempo.

(e) "Bancarrota" significa, con respecto a cualquier Persona, la ocurrencia de cualquiera de los siguientes: (i) la presentación por dicha Persona de una petición voluntaria buscando liquidación, reorganización, arreglo o reajuste de deudas bajo cualquier ley federal o estatal de bancarrota, insolvencia o alivio de deudores; (ii) la entrada de una orden de alivio contra dicha Persona en cualquier procedimiento involuntario bajo dicha ley que permanezca en efecto por sesenta (60) días; (iii) el nombramiento de un síndico, fiduciario, custodio u oficial similar para toda o sustancialmente toda la propiedad de dicha Persona; o (iv) la realización por dicha Persona de una cesión general en beneficio de los acreedores.

(f) "Cuenta de Capital" significa, con respecto a cada Miembro, la cuenta de capital mantenida para dicho Miembro de conformidad con este Acuerdo.

(g) "Contribución de Capital" significa, con respecto a cualquier Miembro, la cantidad agregada de efectivo y el Valor Bruto de Activo inicial de cualquier propiedad (que no sea efectivo) contribuida a la Compañía por dicho Miembro.

(h) "Código" significa el Código de Rentas Internas de 1986, según enmendado de tiempo en tiempo, o cualquier estatuto sucesor del mismo. La referencia a una sección específica del Código incluirá dicha sección, cualquier regulación válida promulgada bajo la misma, y cualquier disposición comparable de cualquier legislación futura que enmiende, complemente o reemplace dicha sección.

(i) "Compañía" significa {{company_name}}, una compañía de responsabilidad limitada de California.

(j) "Efectivo Distribuible" significa, a partir de cualquier fecha relevante, todo el efectivo, ingresos y fondos recibidos por la Compañía de las operaciones de la Compañía, menos la suma de los siguientes, en la medida en que sean pagados o reservados por la Compañía: (i) todos los pagos de principal e intereses sobre endeudamiento de la Compañía y todas las demás sumas pagadas o pagaderas a prestamistas; (ii) todos los gastos en efectivo incurridos incidentales a la operación normal del negocio de la Compañía; y (iii) las reservas que {{member_reference_es}} considere razonablemente necesarias para la operación adecuada del negocio de la Compañía.

(k) "Distribución" significa una transferencia de dinero u otra propiedad de la Compañía a un Miembro a cuenta del Interés Porcentual de dicho Miembro.

(l) "Año Fiscal" significa el año fiscal de la Compañía, que será el año calendario a menos que el Código o {{member_reference_es}} requiera lo contrario.

(m) "Valor Bruto de Activo" significa, con respecto a cualquier activo, la base ajustada del activo para propósitos del impuesto federal sobre la renta, excepto según se disponga de otra manera en la Regulación del Tesoro Sección 1.704-1(b)(2)(iv).

(n) "Mayoría de Interés" significa Miembros que posean más del cincuenta por ciento (50%) del total de los Intereses Porcentuales de todos los Miembros con derecho a votar sobre el asunto en cuestión.

(o) "Gerente" significa cualquier Persona designada como gerente de la Compañía de conformidad con este Acuerdo, quien no necesita ser Miembro de la Compañía.

(p) "Miembro" significa cualquier Persona que haya sido admitida como miembro de la Compañía de conformidad con este Acuerdo y la Ley y que no haya dejado de ser miembro de la Compañía.

(q) "Interés de Membresía" significa el interés completo de un Miembro en la Compañía, incluyendo el interés económico de dicho Miembro (derecho a recibir asignaciones y distribuciones), derechos de gobernanza (derecho a votar y participar en la administración), y derechos de información, en cada caso según se establece en este Acuerdo y la Ley.

(r) "Interés Porcentual" significa, con respecto a cada Miembro, el porcentaje establecido junto al nombre de dicho Miembro en el Anexo A adjunto, según se enmiende de tiempo en tiempo de conformidad con este Acuerdo.

(s) "Persona" significa cualquier individuo, sociedad, sociedad limitada, compañía de responsabilidad limitada, corporación, fideicomiso, patrimonio, asociación, o cualquier otra entidad.

(t) "Miembro de Asuntos Fiscales" o "Representante de la Sociedad" significa el Miembro designado de conformidad con este Acuerdo para servir como el representante de la sociedad de la Compañía bajo la Sección 6223 del Código (o cualquier disposición sucesora).

(u) "Transferencia" significa cualquier venta, cesión, transferencia, intercambio, donación, legado, prenda, hipoteca, gravamen, u otra disposición, ya sea voluntaria o involuntaria, por operación de ley o de otra manera.

Sección 3.2. Interpretación. A menos que el contexto requiera lo contrario: (a) el género (o falta de género) de todas las palabras usadas en este Acuerdo incluye el masculino, femenino y neutro; (b) las referencias a Artículos y Secciones se refieren a Artículos y Secciones de este Acuerdo; (c) las referencias a Anexos son a Anexos adjuntos a este Acuerdo, cada uno de los cuales se incorpora aquí por referencia; (d) "incluyendo" e "incluye" significan "incluyendo, sin limitación" e "incluye, sin limitación," respectivamente; y (e) todas las referencias a montos en dólares son a moneda de curso legal de los Estados Unidos de América.`,

// =====================================================
// OA_004: MIEMBROS (MIEMBRO ÚNICO)
// =====================================================
'OA_004': `ARTÍCULO — MIEMBRO

Sección 4.1. Miembro Único. El nombre, dirección, Contribución de Capital e Interés Porcentual del miembro único de la Compañía se establecen en el Anexo A adjunto e incorporado aquí por referencia. El miembro único será propietario del cien por ciento (100%) de los Intereses de Membresía en la Compañía.

Sección 4.2. Responsabilidad Limitada. El Miembro no será personalmente responsable de ninguna deuda, obligación o responsabilidad de la Compañía, ya sea que surja en contrato, agravio o de otra manera, únicamente por razón de ser Miembro de la Compañía. La falta de la Compañía en observar cualquier formalidad o requisito relacionado con el ejercicio de sus poderes o la administración de su negocio o asuntos no será motivo para imponer responsabilidad personal al Miembro por las responsabilidades de la Compañía.

Sección 4.3. Representaciones y Garantías. El Miembro por este medio representa y garantiza a la Compañía que: (a) el Miembro tiene la capacidad legal y autoridad para celebrar este Acuerdo y cumplir con las obligaciones del Miembro bajo el mismo; (b) este Acuerdo constituye la obligación legal, válida y vinculante del Miembro, exigible contra el Miembro de conformidad con sus términos; y (c) el Interés de Membresía del Miembro en la Compañía se adquiere únicamente con fines de inversión y no con miras a la reventa o distribución del mismo.

Sección 4.4. No Otros Miembros. A la fecha de este Acuerdo, la Compañía no tiene miembros distintos al Miembro identificado en el Anexo A. Miembros adicionales solo podrán ser admitidos a la Compañía de conformidad con las disposiciones de este Acuerdo y la Ley.`,

// =====================================================
// OA_005: MIEMBROS (MÚLTIPLES MIEMBROS)
// =====================================================
'OA_005': `ARTÍCULO — MIEMBROS

Sección 4.1. Miembros. Los nombres, direcciones, Contribuciones de Capital e Intereses Porcentuales de los Miembros de la Compañía se establecen en el Anexo A adjunto e incorporado aquí por referencia.

Sección 4.2. Responsabilidad Limitada. Ningún Miembro será personalmente responsable de ninguna deuda, obligación o responsabilidad de la Compañía, ya sea que surja en contrato, agravio o de otra manera, únicamente por razón de ser Miembro de la Compañía. La falta de la Compañía en observar cualquier formalidad o requisito relacionado con el ejercicio de sus poderes o la administración de su negocio o asuntos no será motivo para imponer responsabilidad personal a ningún Miembro por las responsabilidades de la Compañía.

Sección 4.3. Representaciones y Garantías. Cada Miembro por este medio representa y garantiza a la Compañía y a cada otro Miembro que: (a) dicho Miembro tiene la capacidad legal y autoridad para celebrar este Acuerdo y cumplir con las obligaciones de dicho Miembro bajo el mismo; (b) este Acuerdo constituye la obligación legal, válida y vinculante de dicho Miembro, exigible contra dicho Miembro de conformidad con sus términos; y (c) el Interés de Membresía de dicho Miembro en la Compañía se adquiere únicamente con fines de inversión y no con miras a la reventa o distribución del mismo.

Sección 4.4. No Otros Miembros. A la fecha de este Acuerdo, la Compañía no tiene miembros distintos a los Miembros identificados en el Anexo A. Miembros adicionales solo podrán ser admitidos a la Compañía de conformidad con las disposiciones de este Acuerdo y la Ley.`,

// =====================================================
// OA_006: CONTRIBUCIONES DE CAPITAL
// =====================================================
'OA_006': `ARTÍCULO — CONTRIBUCIONES DE CAPITAL

Sección 5.1. Contribuciones de Capital Iniciales. Cada Miembro ha realizado o realizará la Contribución de Capital inicial a la Compañía en la cantidad y forma establecida junto al nombre de dicho Miembro en el Anexo A adjunto. Las Contribuciones de Capital iniciales se realizarán en o antes de la fecha establecida en el Anexo A o, si no se establece fecha, dentro de treinta (30) días siguientes a la ejecución de este Acuerdo.

Sección 5.2. Contribuciones de Capital Adicionales. Ningún Miembro estará obligado a realizar ninguna Contribución de Capital adicional a la Compañía más allá de la Contribución de Capital inicial de dicho Miembro, excepto según pueda ser acordado unánimemente por escrito por todos los Miembros. Cualquier Contribución de Capital adicional se realizará en las cantidades, en los momentos y bajo los términos que puedan ser determinados por el consentimiento escrito unánime de los Miembros. Si se acuerdan Contribuciones de Capital adicionales, el Anexo A será enmendado para reflejar las Contribuciones de Capital ajustadas y cualquier ajuste correspondiente a los Intereses Porcentuales.

Sección 5.3. Incumplimiento de Contribución. Si algún Miembro no realiza una Contribución de Capital requerida dentro del período de tiempo especificado, los Miembros podrán, sin limitar ningún otro derecho o recurso disponible bajo este Acuerdo o la ley aplicable: (a) hacer que la Compañía adelante la cantidad de la contribución morosa como un préstamo a dicho Miembro, devengando intereses a la menor de diez por ciento (10%) anual o la tasa máxima permitida por la ley aplicable; (b) permitir que los otros Miembros contribuyan la cantidad adicional, con un ajuste correspondiente a los Intereses Porcentuales de todos los Miembros; o (c) perseguir cualquier otro recurso disponible en derecho o en equidad.

Sección 5.4. Sin Intereses sobre Contribuciones. Ningún Miembro tendrá derecho a recibir intereses sobre la Contribución de Capital de dicho Miembro excepto según se disponga expresamente de otra manera en este Acuerdo.

Sección 5.5. Devolución de Contribuciones. Excepto según se disponga de otra manera en este Acuerdo, ningún Miembro tendrá el derecho de retirar o recibir la devolución de la Contribución de Capital de dicho Miembro. Ningún Miembro tendrá prioridad sobre cualquier otro Miembro con respecto a la devolución de Contribuciones de Capital, distribuciones o asignaciones, excepto según se disponga expresamente en este Acuerdo.

Sección 5.6. Forma de Contribuciones. Las Contribuciones de Capital pueden realizarse en efectivo o, con la aprobación de los Miembros, en forma de propiedad o servicios. Cualquier Contribución de Capital no en efectivo será valorada a su valor justo de mercado a la fecha de la contribución, según lo determine de buena fe los Miembros.

Sección 5.7. Cuentas de Capital. Se establecerá y mantendrá una Cuenta de Capital individual para cada Miembro de conformidad con las disposiciones de este Acuerdo. La Cuenta de Capital de cada Miembro será: (a) acreditada con la cantidad de las Contribuciones de Capital de dicho Miembro, la parte asignable de dicho Miembro de las ganancias netas de la Compañía, y cualquier otro elemento de ingreso o ganancia asignado a dicho Miembro; y (b) debitada con la cantidad de cualquier distribución a dicho Miembro, la parte asignable de dicho Miembro de las pérdidas netas de la Compañía, y cualquier otro elemento de pérdida o deducción asignado a dicho Miembro. Las disposiciones anteriores y las demás disposiciones de este Acuerdo relacionadas con el mantenimiento de las Cuentas de Capital tienen la intención de cumplir con la Regulación del Tesoro Sección 1.704-1(b) y serán interpretadas y aplicadas de manera consistente con dicha regulación.`,

// =====================================================
// OA_007: ADMINISTRACIÓN (ADMINISTRADO POR MIEMBROS)
// =====================================================
'OA_007': `ARTÍCULO — ADMINISTRACIÓN

Sección 6.1. Administración por Miembros. La Compañía será administrada por los miembros. Excepto según se disponga expresamente de otra manera en este Acuerdo, la administración y control de la Compañía y su negocio y asuntos estarán investidos en los Miembros, actuando por una Mayoría de Interés, quienes tendrán el derecho, poder y autoridad plenos y exclusivos para administrar, controlar y operar el negocio y asuntos de la Compañía y tomar todas las decisiones que afecten dicho negocio y asuntos, incluyendo, sin limitación, el poder y autoridad para tomar cualquier acción que no esté específicamente reservada a los Miembros por otras disposiciones de este Acuerdo o por la Ley.

Sección 6.2. Autoridad de los Miembros. Sujeto a las limitaciones establecidas en este Acuerdo, cada Miembro será un agente de la Compañía para el propósito de su negocio y asuntos. El acto de cualquier Miembro, incluyendo la ejecución de cualquier instrumento a nombre de la Compañía, para aparentemente llevar a cabo en el curso ordinario del negocio de la Compañía o negocio del tipo que lleva a cabo la Compañía obligará a la Compañía, a menos que: (a) el Miembro que actúa de hecho no tenga autoridad para actuar por la Compañía en el asunto particular; y (b) la Persona con quien el Miembro está tratando tenga conocimiento del hecho de que el Miembro no tiene dicha autoridad.

Sección 6.3. Acciones que Requieren Consentimiento Unánime. No obstante la Sección 6.1, las siguientes acciones requerirán el consentimiento escrito unánime de todos los Miembros: (a) la fusión, conversión o consolidación de la Compañía con o en otra entidad; (b) la venta, arrendamiento, intercambio u otra disposición de todo o sustancialmente todos los activos de la Compañía; (c) la disolución voluntaria y liquidación de la Compañía; (d) cualquier enmienda a este Acuerdo; (e) la admisión de un nuevo Miembro a la Compañía; (f) incurrir en endeudamiento en exceso de {{debt_threshold}} en cualquier transacción individual o serie de transacciones relacionadas; (g) cualquier transacción entre la Compañía y cualquier Miembro o Afiliado de un Miembro; (h) la presentación de una petición voluntaria de bancarrota o el consentimiento a un procedimiento involuntario de bancarrota; y (i) cualquier cambio al propósito de la Compañía según se establece en este Acuerdo.

Sección 6.4. Deberes de los Miembros. Cada Miembro dedicará el tiempo y esfuerzo al negocio y asuntos de la Compañía que dicho Miembro, a su discreción razonable, considere necesario o apropiado para administrar y operar la Compañía. Nada en este Acuerdo impedirá que cualquier Miembro participe en o posea un interés en cualquier otro negocio, empresa, inversión o actividad de cualquier naturaleza y descripción, independientemente o con otros, ya sea o no que dicho negocio, empresa, inversión o actividad sea competitivo con el negocio de la Compañía.

Sección 6.5. Funcionarios. Los Miembros, actuando por una Mayoría de Interés, podrán designar a una o más Personas para servir como funcionarios de la Compañía con los títulos, autoridad y deberes que los Miembros determinen de tiempo en tiempo. Cualquier funcionario puede ser removido por los Miembros, actuando por una Mayoría de Interés, en cualquier momento, con o sin causa. La designación de un funcionario no creará, por sí misma, ningún derecho contractual a servicio o compensación continua.

Sección 6.6. Compensación. Ningún Miembro tendrá derecho a recibir ningún salario, honorario u otra compensación por servicios prestados a la Compañía en la capacidad de dicho Miembro como Miembro, excepto según pueda ser aprobado por una Mayoría de Interés. Los Miembros podrán ser reembolsados por gastos razonables de bolsillo incurridos en la conducción del negocio de la Compañía previa presentación de la documentación apropiada.

Sección 6.7. Confianza de Terceros. Cualquier Persona que trate con la Compañía puede confiar en la autoridad de cualquier Miembro para tomar cualquier acción en nombre de la Compañía sin indagar sobre las disposiciones de este Acuerdo o el cumplimiento del mismo, independientemente de si dicha acción realmente se toma de conformidad con las disposiciones de este Acuerdo.`,

// =====================================================
// OA_008: ADMINISTRACIÓN (ADMINISTRADO POR GERENTE)
// =====================================================
'OA_008': `ARTÍCULO — ADMINISTRACIÓN

Sección 6.1. Administración por Gerente(s). La Compañía será administrada por gerente(s). Excepto según se disponga expresamente de otra manera en este Acuerdo, la administración y control de la Compañía y su negocio y asuntos estarán investidos en el(los) Gerente(s), quien(es) tendrá(n) el derecho, poder y autoridad plenos y exclusivos para administrar, controlar y operar el negocio y asuntos de la Compañía y tomar todas las decisiones que afecten dicho negocio y asuntos.

Sección 6.2. Gerente(s) Inicial(es). El(los) Gerente(s) inicial(es) de la Compañía será(n): {{manager_1_name}}, ubicado en {{manager_1_address}}.

Sección 6.3. Autoridad del(los) Gerente(s). Sujeto a las limitaciones establecidas en este Acuerdo, el(los) Gerente(s) tendrá(n) la autoridad para realizar todos los actos necesarios o convenientes para llevar a cabo el negocio de la Compañía, incluyendo, sin limitación: (a) ejecutar contratos, acuerdos e instrumentos; (b) abrir y mantener cuentas bancarias; (c) emplear y terminar empleados y contratistas; (d) iniciar, defender o resolver litigios; y (e) tomar cualquier otra acción en el curso ordinario del negocio.

Sección 6.4. Acciones que Requieren Aprobación de los Miembros. No obstante la Sección 6.3, las siguientes acciones requerirán la aprobación previa escrita de una Mayoría de Interés de los Miembros: (a) la venta, arrendamiento, intercambio u otra disposición de todo o sustancialmente todos los activos de la Compañía; (b) la fusión, conversión o consolidación de la Compañía; (c) la admisión de nuevos Miembros; (d) cualquier enmienda a este Acuerdo; (e) incurrir en endeudamiento en exceso de {{debt_threshold}}; (f) cualquier transacción con un Afiliado del Gerente; y (g) la disolución voluntaria de la Compañía.

Sección 6.5. Remoción del Gerente. Cualquier Gerente puede ser removido con o sin causa por el voto de una Mayoría de Interés de los Miembros. El Gerente removido tendrá derecho a recibir cualquier compensación devengada hasta la fecha de remoción.

Sección 6.6. Compensación del Gerente. El(los) Gerente(s) tendrá(n) derecho a recibir una compensación razonable por los servicios prestados según lo determinen los Miembros. Los Gerentes serán reembolsados por gastos razonables de bolsillo incurridos en la conducción del negocio de la Compañía.

Sección 6.7. Deberes del Gerente. El(los) Gerente(s) ejercerá(n) sus deberes de buena fe y con el grado de cuidado que una persona ordinariamente prudente en una posición similar ejercería bajo circunstancias similares. Nada en este Acuerdo eliminará o limitará la responsabilidad de un Gerente por cualquier acto u omisión que constituya fraude, conducta dolosa intencional, negligencia grave o violación intencional de la ley.`,

// =====================================================
// OA_009: VOTACIÓN Y REUNIONES
// =====================================================
'OA_009': `ARTÍCULO — VOTACIÓN Y REUNIONES

Sección 7.1. Poder de Voto. Cada Miembro tendrá derecho a votar sobre los asuntos sometidos a votación de los Miembros en proporción al Interés Porcentual de dicho Miembro. Excepto según se disponga de otra manera en este Acuerdo, todas las decisiones que requieran la aprobación de los Miembros se tomarán por una Mayoría de Interés.

Sección 7.2. Reuniones. Las reuniones de los Miembros pueden ser convocadas por cualquier Miembro que posea al menos veinte por ciento (20%) de los Intereses Porcentuales totales. La notificación de cualquier reunión deberá ser entregada a todos los Miembros con al menos diez (10) días de anticipación, especificando la fecha, hora, lugar y propósito de la reunión.

Sección 7.3. Quórum. La presencia, en persona o por representante, de Miembros que posean una Mayoría de Interés constituirá un quórum para la transacción de negocios en cualquier reunión de los Miembros.

Sección 7.4. Acción sin Reunión. Cualquier acción que pueda tomarse en una reunión de los Miembros puede tomarse sin reunión si el consentimiento por escrito que establezca la acción a tomar es firmado por Miembros que posean no menos que el porcentaje mínimo de Intereses Porcentuales que se requeriría para autorizar dicha acción en una reunión en la que todos los Miembros con derecho a voto estuvieran presentes y votaran.

Sección 7.5. Participación por Medios Electrónicos. Los Miembros pueden participar en cualquier reunión de los Miembros por medio de conferencia telefónica u otro equipo de comunicaciones a través del cual todas las personas participantes en la reunión puedan escucharse mutuamente. Dicha participación constituirá presencia en persona en la reunión.`,

// =====================================================
// OA_010: ASIGNACIONES DE GANANCIAS Y PÉRDIDAS
// =====================================================
'OA_010': `ARTÍCULO — ASIGNACIONES DE GANANCIAS Y PÉRDIDAS

Sección 8.1. Ganancias y Pérdidas Netas. Excepto según se disponga de otra manera en este Acuerdo, para cada Año Fiscal (o porción del mismo), las ganancias y pérdidas netas de la Compañía (y, en la medida necesaria, elementos individuales de ingreso, ganancia, pérdida, deducción y crédito) serán asignados entre los Miembros en proporción a sus respectivos Intereses Porcentuales.

Sección 8.2. Asignaciones Regulatorias. Las siguientes asignaciones especiales se realizarán en el siguiente orden de prioridad:

(a) Cargo por Ganancia Mínima. No obstante cualquier otra disposición de este Acuerdo, si hay una disminución neta en la ganancia mínima de la Compañía (según se define en la Regulación del Tesoro Sección 1.704-2(b)(2)) durante cualquier Año Fiscal, cada Miembro recibirá una asignación especial de elementos de ingreso y ganancia de la Compañía para dicho Año Fiscal (y, si es necesario, Años Fiscales subsiguientes) por una cantidad igual a la parte de dicho Miembro de la disminución neta en la ganancia mínima de la Compañía, determinada de conformidad con la Regulación del Tesoro Sección 1.704-2(g).

(b) Cargo por Ganancia Mínima del Miembro. No obstante cualquier otra disposición de este Acuerdo (excepto la Sección 8.2(a)), si hay una disminución neta en la ganancia mínima del Miembro atribuible a una deuda sin recurso del Miembro durante cualquier Año Fiscal, cada Miembro que tenga una parte de la ganancia mínima del Miembro atribuible a dicha deuda sin recurso del Miembro recibirá una asignación especial de elementos de ingreso y ganancia de la Compañía.

(c) Compensación de Ingreso Calificado. Si algún Miembro recibe inesperadamente cualquier ajuste, asignación o distribución descrita en la Regulación del Tesoro Sección 1.704-1(b)(2)(ii)(d)(4), (5) o (6) que cause o aumente un saldo deficitario en la Cuenta de Capital de dicho Miembro, elementos de ingreso y ganancia de la Compañía serán especialmente asignados a dicho Miembro en una cantidad y manera suficiente para eliminar dicho saldo deficitario lo más rápido posible.

(d) Deducciones Sin Recurso. Las deducciones sin recurso para cualquier Año Fiscal serán asignadas entre los Miembros en proporción a sus Intereses Porcentuales.

(e) Deducciones Sin Recurso del Miembro. Cualquier deducción sin recurso del Miembro para cualquier Año Fiscal será asignada al Miembro que soporte el riesgo económico de pérdida con respecto a la deuda sin recurso del Miembro a la que dichas deducciones sean atribuibles.

Sección 8.3. Asignaciones Fiscales. Para propósitos del impuesto federal, estatal y local sobre la renta, cada elemento de ingreso, ganancia, pérdida, deducción y crédito de la Compañía será asignado entre los Miembros de la misma manera en que los elementos correspondientes son asignados para propósitos de la Cuenta de Capital bajo este Acuerdo, excepto según lo requiera de otra manera la Sección 704(c) del Código o la Regulación del Tesoro Sección 1.704-1(b)(4).

Sección 8.4. Asignaciones en caso de Transferencia. Si algún Interés de Membresía es Transferido durante un Año Fiscal, las ganancias y pérdidas netas atribuibles a dicho Interés de Membresía para dicho Año Fiscal serán asignadas entre el cedente y el cesionario usando cualquier método permitido bajo la Sección 706(d) del Código según lo determine {{member_reference_es}}.`,

// =====================================================
// OA_011: DISTRIBUCIONES
// =====================================================
'OA_011': `ARTÍCULO — DISTRIBUCIONES

Sección 9.1. Distribuciones de Efectivo Distribuible. Sujeto a las limitaciones establecidas en este Acuerdo y la ley aplicable, {{member_reference_es}} podrá, a su sola discreción, hacer que la Compañía distribuya Efectivo Distribuible a los Miembros de tiempo en tiempo según {{member_reference_es}} determine. Dichas distribuciones se realizarán a los Miembros en proporción a sus respectivos Intereses Porcentuales a menos que se acuerde de otra manera por escrito por todos los Miembros.

Sección 9.2. Distribuciones Fiscales. En la medida en que la Compañía tenga Efectivo Distribuible disponible, {{member_reference_es}} hará esfuerzos comercialmente razonables para hacer que la Compañía distribuya a cada Miembro, no menos de quince (15) días antes de la fecha de vencimiento de los pagos estimados de impuestos y la fecha de vencimiento de las declaraciones anuales de impuestos, una cantidad al menos igual a la obligación tributaria estimada de dicho Miembro que surja del ingreso de la Compañía asignado a dicho Miembro para el período aplicable.

Sección 9.3. Limitaciones en las Distribuciones. Ninguna distribución se realizará a ningún Miembro si, después de dar efecto a dicha distribución: (a) la Compañía no pudiera pagar sus deudas a medida que venzan en el curso ordinario de las actividades de la Compañía; o (b) los activos totales de la Compañía serían menores que la suma de sus pasivos totales más la cantidad que se necesitaría, si la Compañía fuera disuelta y liquidada en el momento de la distribución, para satisfacer los derechos preferenciales de otros Miembros en la disolución y liquidación.

Sección 9.4. Sin Derecho a Exigir Distribuciones. Ningún Miembro tendrá el derecho de exigir o recibir ninguna distribución de la Compañía en ninguna forma distinta al efectivo excepto según se disponga expresamente de otra manera en este Acuerdo.

Sección 9.5. Distribuciones en Especie. {{member_reference_es}} podrá realizar distribuciones en especie. Cualquier propiedad distribuida en especie será valorada a su valor justo de mercado a la fecha de distribución, según lo determine de buena fe {{member_reference_es}}.

Sección 9.6. Retención. La Compañía está autorizada a retener de las distribuciones, o con respecto a las asignaciones, a los Miembros y a pagar a cualquier gobierno federal, estatal o local las cantidades requeridas a ser retenidas de conformidad con el Código o cualquier disposición de cualquier otra ley federal, estatal o local.`,

// =====================================================
// OA_012: ASUNTOS FISCALES
// =====================================================
'OA_012': `ARTÍCULO — ASUNTOS FISCALES

Sección 10.1. Clasificación Fiscal. Los Miembros pretenden que la Compañía sea tratada como {{tax_classification_text_es}} para propósitos del impuesto federal y estatal sobre la renta. Los Miembros no tomarán ninguna acción ni realizarán ninguna elección que cause que la Compañía sea clasificada de manera distinta a la prevista sin el consentimiento escrito unánime de todos los Miembros.

Sección 10.2. Declaraciones de Impuestos. {{member_reference_es}} hará que se preparen y presenten oportunamente todas las declaraciones de impuestos que la Compañía esté obligada a presentar, incluyendo declaraciones federales, estatales y locales. {{member_reference_es}} proporcionará a cada Miembro una copia de cada declaración, o un Anexo K-1 (o información equivalente), dentro de setenta y cinco (75) días después del cierre de cada Año Fiscal, o tan pronto como sea razonablemente practicable.

Sección 10.3. Representante de la Sociedad. {{tax_matters_member_name}} es por este medio designado como el Representante de la Sociedad (según se define en la Sección 6223 del Código, según enmendada por la Ley de Presupuesto Bipartidista de 2015) de la Compañía. El Representante de la Sociedad tendrá todos los derechos y la autoridad otorgados a un representante de la sociedad bajo el Código y las Regulaciones del Tesoro.

Sección 10.4. Elecciones Fiscales. {{member_reference_es}} realizará las siguientes elecciones en las declaraciones de impuestos apropiadas: (a) Adoptar el año calendario como el Año Fiscal de la Compañía, a menos que el Código requiera lo contrario; (b) Adoptar el método de contabilidad que {{member_reference_es}} determine sea más ventajoso para la Compañía y los Miembros; (c) Si hay una distribución de propiedad de la Compañía descrita en la Sección 734 del Código, o si hay una Transferencia de un Interés de Membresía descrita en la Sección 743 del Código, previa solicitud escrita de cualquier Miembro, elegir, de conformidad con la Sección 754 del Código, ajustar la base de la propiedad de la Compañía; y (d) Realizar cualquier otra elección que {{member_reference_es}} considere apropiada y en el mejor interés de los Miembros.

Sección 10.5. Gastos de Asuntos Fiscales. La Compañía pagará y será responsable de todos los costos y gastos razonables de terceros incurridos en conexión con cualquier auditoría fiscal, investigación, acuerdo o litigio relacionado con los asuntos fiscales de la Compañía.`,

// =====================================================
// OA_013: RESTRICCIONES DE TRANSFERENCIA
// =====================================================
'OA_013': `ARTÍCULO — RESTRICCIONES DE TRANSFERENCIA

Sección 11.1. Restricciones Generales. Ningún Miembro podrá Transferir todo o parte de su Interés de Membresía excepto de conformidad con los términos y condiciones de este Artículo. Cualquier Transferencia o intento de Transferencia en violación de este Artículo será nula y sin efecto.

Sección 11.2. Transferencias Permitidas. Un Miembro podrá Transferir todo o parte de su Interés de Membresía a: (a) otro Miembro; (b) un fideicomiso revocable establecido únicamente para el beneficio del Miembro que transfiere o los miembros de la familia inmediata del Miembro que transfiere; o (c) una entidad que sea totalmente propiedad del Miembro que transfiere; en cada caso sin requerir el consentimiento de los otros Miembros, siempre que el cesionario ejecute un acuerdo de adhesión en forma y sustancia aceptable para los Miembros.

Sección 11.3. Consentimiento Requerido. Excepto por las Transferencias Permitidas descritas en la Sección 11.2, ninguna Transferencia de cualquier Interés de Membresía será válida a menos que sea aprobada por el consentimiento escrito de una Mayoría de Interés de los Miembros no transferentes, cuyo consentimiento podrá ser retenido a la sola y absoluta discreción de dichos Miembros.`,

// =====================================================
// OA_014: DERECHO DE PREFERENCIA
// =====================================================
'OA_014': `ARTÍCULO — DERECHO DE PREFERENCIA

Sección 12.1. Aviso de Transferencia Propuesta. Antes de cualquier Transferencia de un Interés de Membresía (que no sea una Transferencia Permitida), el Miembro que desee transferir (el "Miembro Cedente") deberá entregar un aviso escrito (el "Aviso de Transferencia") a la Compañía y a cada otro Miembro, indicando: (a) la identidad del cesionario propuesto; (b) los términos y condiciones de la Transferencia propuesta; (c) el precio propuesto; y (d) cualquier otra información material.

Sección 12.2. Derecho de Preferencia. Dentro de treinta (30) días después de recibir el Aviso de Transferencia, cada Miembro no transferente tendrá la opción de comprar todo o parte del Interés de Membresía ofrecido en los mismos términos y condiciones establecidos en el Aviso de Transferencia. Si más de un Miembro desea ejercer este derecho, el Interés de Membresía ofrecido será asignado entre los Miembros que ejercen el derecho en proporción a sus respectivos Intereses Porcentuales.

Sección 12.3. Cierre. Si el derecho de preferencia es ejercido, el cierre de la compra se realizará dentro de sesenta (60) días después de la fecha en que se entregó el aviso de ejercicio.`,

// =====================================================
// OA_015: ADMISIÓN DE NUEVOS MIEMBROS
// =====================================================
'OA_015': `ARTÍCULO — ADMISIÓN DE NUEVOS MIEMBROS

Sección 13.1. Requisitos de Admisión. Una Persona solo podrá ser admitida como nuevo Miembro de la Compañía previa satisfacción de todas las siguientes condiciones: (a) El consentimiento escrito unánime de todos los Miembros existentes para dicha admisión; (b) La ejecución y entrega por dicha Persona de una contraparte de este Acuerdo o un acuerdo de adhesión en forma y sustancia aceptable para los Miembros, mediante el cual dicha Persona acepta estar obligada por todos los términos y disposiciones de este Acuerdo como si fuera una parte original del mismo; (c) El pago por dicha Persona de la Contribución de Capital que los Miembros existentes determinen unánimemente; (d) La entrega por dicha Persona a la Compañía de toda la información y documentación razonablemente solicitada por los Miembros para propósitos de cumplimiento con las leyes aplicables, incluyendo leyes contra el lavado de dinero; y (e) Cumplimiento con todas las leyes federales y estatales de valores aplicables.

Sección 13.2. Ajuste de Intereses. Al momento de la admisión de un nuevo Miembro, el Anexo A será enmendado para reflejar el nombre, dirección, Contribución de Capital e Interés Porcentual del nuevo Miembro, y los Intereses Porcentuales de los Miembros existentes serán ajustados según lo acordado por el consentimiento escrito unánime de todos los Miembros (incluyendo el nuevo Miembro).

Sección 13.3. Sin Derechos de Terceros. Nada en este Artículo se considerará que crea algún derecho en alguna Persona para ser admitida como Miembro de la Compañía. La decisión de admitir a un nuevo Miembro estará a la sola y absoluta discreción de los Miembros existentes.`,

// =====================================================
// OA_016: RETIRO DE MIEMBROS
// =====================================================
'OA_016': `ARTÍCULO — RETIRO DE MIEMBROS

Sección 14.1. Retiro Voluntario. Ningún Miembro podrá retirarse voluntariamente de la Compañía sin el consentimiento escrito previo de una Mayoría de Interés de los Miembros restantes. Cualquier Miembro que se retire en violación de esta Sección será responsable ante la Compañía y los Miembros restantes por cualquier daño causado por dicho retiro.

Sección 14.2. Efectos del Retiro. Al retiro de un Miembro de conformidad con esta Sección, el Miembro que se retira tendrá derecho a recibir el valor justo de mercado de su Interés de Membresía, pagadero dentro de un plazo razonable según lo determinen los Miembros restantes. El valor justo de mercado será determinado por acuerdo mutuo o, si las partes no pueden llegar a un acuerdo, por un tasador independiente.`,

// =====================================================
// OA_017: DISOLUCIÓN Y LIQUIDACIÓN
// =====================================================
'OA_017': `ARTÍCULO — DISOLUCIÓN Y LIQUIDACIÓN

Sección 15.1. Eventos de Disolución. La Compañía será disuelta al ocurrir el primero de los siguientes eventos: (a) El consentimiento escrito unánime de todos los Miembros para disolver la Compañía; (b) La entrada de un decreto de disolución judicial bajo la Sección 17707.03 de la Ley; (c) La ocurrencia de cualquier evento que haga ilegal la continuación del negocio de la Compañía; o (d) Cualquier otro evento especificado en los Artículos de Organización o requerido por la Ley como causa de disolución.

La muerte, Bancarrota, disolución o retiro de cualquier Miembro no causará, por sí misma, la disolución de la Compañía, y la Compañía continuará en existencia después de cualquier dicho evento.

Sección 15.2. Liquidación. Al disolverse la Compañía, {{member_reference_es}} (o, si no hay {{member_reference_es}}, un agente liquidador designado por una Mayoría de Interés de los Miembros) liquidará los asuntos de la Compañía. La liquidación incluirá: (a) la liquidación ordenada de los activos de la Compañía; (b) la aplicación y distribución del producto de los mismos; y (c) la presentación de un Certificado de Cancelación ante el Secretario de Estado de California.

Sección 15.3. Orden de Distribución. Al liquidarse la Compañía, los activos de la Compañía serán distribuidos en el siguiente orden de prioridad: (a) Primero, a los acreedores de la Compañía (incluyendo Miembros que sean acreedores) en satisfacción de las responsabilidades de la Compañía; (b) Segundo, al establecimiento de cualquier reserva que {{member_reference_es}} o el agente liquidador considere razonablemente necesaria para cualquier responsabilidad contingente o imprevista; (c) Tercero, a los Miembros en proporción a y en la medida de los saldos positivos en sus respectivas Cuentas de Capital; y (d) Cuarto, el saldo, si lo hay, a los Miembros en proporción a sus respectivos Intereses Porcentuales.

Sección 15.4. Sin Obligación de Restaurar Déficit. Ningún Miembro estará obligado a restaurar un saldo deficitario en la Cuenta de Capital de dicho Miembro al disolverse la Compañía.

Sección 15.5. Tiempo Razonable para Liquidación. Se permitirá un tiempo razonable para la liquidación ordenada del negocio y asuntos de la Compañía y la liquidación de sus activos con el fin de minimizar cualquier pérdida resultante de dicha liquidación.`,

// =====================================================
// OA_018: INDEMNIZACIÓN
// =====================================================
'OA_018': `ARTÍCULO — INDEMNIZACIÓN

Sección 16.1. Indemnización. En la máxima medida permitida por la Ley y otra ley aplicable, la Compañía indemnizará, defenderá y mantendrá indemne a cada Miembro, cada Gerente (si lo hay), y cada funcionario, empleado y agente de la Compañía (cada uno, una "Persona Indemnizada") de y contra cualesquiera y todas las pérdidas, reclamaciones, daños, responsabilidades, gastos (incluyendo honorarios razonables de abogados y costos de investigación y defensa), sentencias, multas, acuerdos y otras cantidades (colectivamente, "Pérdidas") que surjan de o en conexión con cualquier reclamación, demanda, acción, juicio o procedimiento en el que dicha Persona Indemnizada pueda estar involucrada, o amenazada de estar involucrada, como parte o de otra manera por razón del estatus de dicha Persona Indemnizada como Miembro, Gerente, funcionario, empleado o agente de la Compañía; siempre y cuando, sin embargo, que ninguna Persona Indemnizada tendrá derecho a indemnización en la medida en que dichas Pérdidas resultaron del fraude, conducta dolosa intencional, negligencia grave o violación intencional de la ley de dicha Persona Indemnizada.

Sección 16.2. Anticipo de Gastos. La Compañía pagará los gastos (incluyendo honorarios razonables de abogados) incurridos por una Persona Indemnizada en la defensa de cualquier procedimiento antes de su disposición final; siempre y cuando que el pago de gastos por adelantado se realizará solo previa recepción de un compromiso por parte de la Persona Indemnizada de reembolsar todas las cantidades adelantadas si se determina finalmente que dicha Persona Indemnizada no tiene derecho a ser indemnizada bajo este Artículo.

Sección 16.3. Seguros. {{member_reference_es}} podrá hacer que la Compañía compre y mantenga seguros, a cargo de la Compañía, para proteger a la Compañía y a cualquier Persona Indemnizada contra cualesquiera Pérdidas, ya sea o no que la Compañía tendría el poder de indemnizar a dicha Persona Indemnizada contra dichas Pérdidas bajo las disposiciones de este Artículo.`,

// =====================================================
// OA_019: LIMITACIÓN DE RESPONSABILIDAD
// =====================================================
'OA_019': `ARTÍCULO — LIMITACIÓN DE RESPONSABILIDAD

Sección 17.1. Eliminación de Responsabilidad. En la máxima medida permitida por la Ley y otra ley aplicable, ningún Miembro, Gerente, funcionario, empleado o agente de la Compañía será responsable ante la Compañía o cualquier otro Miembro por cualquier decisión tomada o acción realizada de buena fe y de conformidad con los términos de este Acuerdo. Ningún Miembro, Gerente, funcionario, empleado o agente de la Compañía será responsable ante la Compañía o cualquier otro Miembro por cualquier error de juicio o por cualquier acto u omisión, excepto por fraude, conducta dolosa intencional, negligencia grave o violación intencional de la ley.

Sección 17.2. Deber de Cuidado. Cada Miembro y Gerente ejercerá sus deberes y responsabilidades bajo este Acuerdo de buena fe, de una manera que dicho Miembro o Gerente razonablemente crea que es en el mejor interés de la Compañía, y con el cuidado que una persona ordinariamente prudente en una posición similar ejercería bajo circunstancias similares.`,

// =====================================================
// OA_020: LIBROS Y REGISTROS
// =====================================================
'OA_020': `ARTÍCULO — LIBROS Y REGISTROS

Sección 18.1. Libros y Registros. {{member_reference_es}} mantendrá, o hará que se mantengan, en la oficina principal de la Compañía, libros y registros completos y precisos de la Compañía, incluyendo: (a) una lista actualizada del nombre completo y última dirección conocida de cada Miembro; (b) copias de los Artículos de Organización, este Acuerdo, y todas las enmiendas a los mismos; (c) copias de las declaraciones de impuestos federales, estatales y locales de la Compañía de los tres (3) Años Fiscales más recientes; (d) los estados financieros de la Compañía de los tres (3) Años Fiscales más recientes; y (e) los libros y registros de la Compañía según se relacionen con los asuntos internos de la Compañía del actual y los cuatro (4) Años Fiscales anteriores.

Sección 18.2. Derechos de Inspección. Cada Miembro tendrá el derecho, previa solicitud escrita razonable y a cargo de dicho Miembro, de inspeccionar y copiar los libros y registros de la Compañía durante el horario normal de negocios. {{member_reference_es}} podrá imponer restricciones razonables a dichos derechos de inspección para proteger la información confidencial o propietaria de la Compañía.

Sección 18.3. Informes Financieros. Dentro de noventa (90) días después del cierre de cada Año Fiscal, {{member_reference_es}} proporcionará a cada Miembro: (a) un balance general al cierre de dicho Año Fiscal; (b) un estado de ingresos y gastos para dicho Año Fiscal; (c) un estado de la Cuenta de Capital de cada Miembro al cierre de dicho Año Fiscal; y (d) cualquier otra información que sea necesaria para la preparación de las declaraciones de impuestos federales, estatales y locales de cada Miembro.

Sección 18.4. Cuentas Bancarias. {{member_reference_es}} abrirá y mantendrá una o más cuentas bancarias a nombre de la Compañía en una o más instituciones financieras. Todos los fondos de la Compañía serán depositados en dichas cuentas, y ningún otro fondo será mezclado con los mismos. Los retiros de dichas cuentas solo serán realizados por Personas autorizadas por {{member_reference_es}}. Los fondos de la Compañía no serán mezclados con los fondos personales de ningún Miembro.`,

// =====================================================
// OA_021: CONFIDENCIALIDAD
// =====================================================
'OA_021': `ARTÍCULO — CONFIDENCIALIDAD

Sección 19.1. Información Confidencial. Cada Miembro reconoce que, en el curso de su participación en la Compañía, puede tener acceso a información confidencial y propietaria de la Compañía ("Información Confidencial"). La Información Confidencial incluye, sin limitación: secretos comerciales, listas de clientes, información financiera, planes de negocios, estrategias de marketing, y cualquier otra información que no esté generalmente disponible al público.

Sección 19.2. Obligaciones de No Divulgación. Cada Miembro acuerda: (a) mantener toda la Información Confidencial en estricta confidencialidad; (b) no divulgar ninguna Información Confidencial a ninguna Persona que no sea otro Miembro o un funcionario, empleado o agente de la Compañía que tenga la necesidad legítima de conocer dicha información; y (c) no usar ninguna Información Confidencial para ningún propósito distinto al negocio de la Compañía.

Sección 19.3. Vigencia. Las obligaciones de confidencialidad de cada Miembro bajo este Artículo sobrevivirán la terminación del Interés de Membresía de dicho Miembro y la disolución de la Compañía por un período de tres (3) años.`,

// =====================================================
// OA_022: NO COMPETENCIA
// =====================================================
'OA_022': `ARTÍCULO — NO COMPETENCIA

Sección 20.1. Pacto de No Competencia. Durante el período en que un Miembro sea miembro de la Compañía y por un período de un (1) año posterior a la fecha en que dicho Miembro deje de ser miembro, dicho Miembro no podrá, directa o indirectamente: (a) participar en cualquier negocio que sea sustancialmente similar o competitivo con el negocio de la Compañía dentro del Condado de {{venue_county}}, California; (b) solicitar a cualquier cliente, vendedor o proveedor de la Compañía; o (c) solicitar a cualquier empleado o contratista de la Compañía.

Sección 20.2. Razonabilidad. Cada Miembro reconoce que las restricciones establecidas en este Artículo son razonables en alcance, duración y área geográfica, y son necesarias para proteger los intereses legítimos de la Compañía.

Sección 20.3. Recursos. En caso de violación de este Artículo, la Compañía tendrá derecho a obtener medidas cautelares además de cualquier otro recurso disponible en derecho o en equidad.`,

// =====================================================
// OA_023: RESOLUCIÓN DE DISPUTAS
// =====================================================
'OA_023': `ARTÍCULO — RESOLUCIÓN DE DISPUTAS

Sección 21.1. Mediación. Cualquier disputa, controversia o reclamación que surja de o se relacione con este Acuerdo será primero sometida a mediación de conformidad con las Reglas de Mediación Comercial de la Asociación Americana de Arbitraje. La mediación se llevará a cabo en el Condado de {{mediation_county}}, California.

Sección 21.2. Arbitraje. Si la mediación no resuelve la disputa dentro de sesenta (60) días después del inicio de la mediación, la disputa será resuelta por arbitraje vinculante de conformidad con las Reglas de Arbitraje Comercial de la Asociación Americana de Arbitraje. El arbitraje se llevará a cabo en el Condado de {{arbitration_county}}, California, ante un solo árbitro.

Sección 21.3. Laudo. El laudo del árbitro será definitivo y vinculante para todas las partes y podrá ser confirmado y ejecutado en cualquier tribunal de jurisdicción competente.

Sección 21.4. Honorarios de Abogados. En cualquier mediación, arbitraje o procedimiento judicial bajo este Artículo, la parte prevaleciente tendrá derecho a recuperar de la parte no prevaleciente sus honorarios razonables de abogados, costos y gastos.`,

// =====================================================
// OA_024: COMPRAVENTA / DISPOSICIONES DE COMPRA
// =====================================================
'OA_024': `ARTÍCULO — DISPOSICIONES DE COMPRAVENTA

Sección 22.1. Eventos Desencadenantes. Al ocurrir cualquiera de los siguientes eventos con respecto a cualquier Miembro (un "Evento Desencadenante"), se aplicarán las disposiciones de compraventa de este Artículo: (a) muerte del Miembro; (b) incapacidad permanente del Miembro; (c) Bancarrota del Miembro; (d) retiro o expulsión del Miembro; o (e) la violación material de este Acuerdo por parte del Miembro.

Sección 22.2. Opción de Compra. Al ocurrir un Evento Desencadenante, los Miembros restantes tendrán la opción, ejercitable dentro de noventa (90) días, de comprar todo el Interés de Membresía del Miembro afectado al valor justo de mercado.

Sección 22.3. Determinación del Valor. El valor justo de mercado será determinado por acuerdo mutuo de las partes o, si no pueden acordar dentro de treinta (30) días, por un tasador independiente seleccionado por los Miembros. El costo de la tasación será compartido equitativamente.

Sección 22.4. Términos de Pago. A menos que se acuerde de otra manera, el precio de compra será pagado de la siguiente manera: (a) un pago inicial del veinticinco por ciento (25%) al cierre; y (b) el saldo en pagos mensuales iguales durante un período de tres (3) años, con interés a la tasa federal aplicable.`,

// =====================================================
// OA_025: MUERTE E INCAPACIDAD
// =====================================================
'OA_025': `ARTÍCULO — MUERTE O INCAPACIDAD DE UN MIEMBRO

Sección 22.1. Muerte de un Miembro. A la muerte de un Miembro (el "Miembro Fallecido"), la Compañía no se disolverá, y el negocio de la Compañía continuará sin interrupción. El Interés de Membresía del Miembro Fallecido pasará al patrimonio, herederos o beneficiarios designados del Miembro Fallecido (colectivamente, el "Sucesor") de conformidad con el testamento, fideicomiso o leyes de intestado aplicables del Miembro Fallecido. El Sucesor tendrá derecho a recibir la parte del Miembro Fallecido de asignaciones y distribuciones de la Compañía pero no será admitido como Miembro de la Compañía con derechos de gobernanza y voto a menos y hasta que: (a) el Sucesor satisfaga los requisitos para la admisión de nuevos Miembros establecidos en este Acuerdo; y (b) una Mayoría de Interés de los Miembros restantes consienta por escrito a dicha admisión.

Sección 22.2. Derechos del Sucesor Pendiente de Admisión. Hasta que un Sucesor sea admitido como Miembro, el Sucesor será tratado como un cesionario del interés económico del Miembro Fallecido únicamente. El Sucesor no tendrá derecho a participar en la administración o asuntos de la Compañía, no tendrá derecho a votar sobre ningún asunto, y no tendrá derecho a acceder a Información Confidencial más allá de lo requerido por la Ley.

Sección 22.3. Incapacidad de un Miembro. En caso de que un Miembro quede permanentemente incapacitado (significando la incapacidad, debido a impedimento físico o mental, de administrar los asuntos personales de dicho Miembro por un período continuo de noventa (90) días, según lo certifique un médico licenciado), el tutor, curador u otro representante legal de dicho Miembro tendrá los derechos de un cesionario del interés económico de dicho Miembro.

Sección 22.4. Opción de Compra. A la muerte o incapacidad permanente de un Miembro, los Miembros restantes tendrán la opción, ejercitable dentro de noventa (90) días, de comprar todo el Interés de Membresía del Miembro Fallecido o incapacitado al valor justo de mercado.`,

// =====================================================
// OA_026: SEGUROS
// =====================================================
'OA_026': `ARTÍCULO — SEGUROS

Sección 23.1. Seguro de Responsabilidad General. La Compañía mantendrá un seguro de responsabilidad general comercial con límites de cobertura que {{member_reference_es}} considere razonablemente adecuados para la naturaleza del negocio de la Compañía.

Sección 23.2. Seguro de Persona Clave. {{member_reference_es}} podrá hacer que la Compañía obtenga y mantenga seguros de vida sobre la vida de cualquier Miembro o Gerente clave, siendo la Compañía la propietaria y beneficiaria de dichas pólizas. Los fondos recibidos de dichas pólizas podrán ser utilizados para financiar la compra del Interés de Membresía del Miembro fallecido.

Sección 23.3. Costos del Seguro. Todos los costos y primas de seguro serán gastos operativos de la Compañía.`,

// =====================================================
// OA_027: PROPIEDAD INTELECTUAL
// =====================================================
'OA_027': `ARTÍCULO — PROPIEDAD INTELECTUAL

Sección 24.1. Propiedad de la Compañía. Toda la propiedad intelectual creada por o en nombre de la Compañía, incluyendo, sin limitación, patentes, marcas registradas, derechos de autor, secretos comerciales, invenciones, obras de autoría, software y otros derechos de propiedad intelectual, será propiedad exclusiva de la Compañía.

Sección 24.2. Cesión de Derechos. Cada Miembro por este medio cede y transfiere a la Compañía todos los derechos, título e interés en y a cualquier propiedad intelectual creada por dicho Miembro en el curso de la conducción del negocio de la Compañía.

Sección 24.3. Propiedad Intelectual Preexistente. La propiedad intelectual que pertenezca a un Miembro antes de la formación de la Compañía o que sea creada por un Miembro fuera del curso del negocio de la Compañía seguirá siendo propiedad de dicho Miembro. Si dicho Miembro desea otorgar a la Compañía una licencia para usar dicha propiedad intelectual preexistente, los términos de dicha licencia serán establecidos en un acuerdo separado por escrito.`,

// =====================================================
// OA_028: RESOLUCIÓN DE EMPATES
// =====================================================
'OA_028': `ARTÍCULO — RESOLUCIÓN DE EMPATES

Sección 25.1. Procedimiento de Empate. En caso de que los Miembros no puedan llegar a un acuerdo sobre cualquier asunto que requiera la aprobación de los Miembros (un "Empate"), se aplicará el siguiente procedimiento: (a) Los Miembros intentarán de buena fe resolver el Empate mediante negociación directa por un período de quince (15) días; (b) Si el Empate no se resuelve, los Miembros someterán el asunto a un mediador mutuamente aceptable; (c) Si la mediación no resuelve el Empate dentro de treinta (30) días, cualquier Miembro podrá iniciar el Procedimiento de Compra de Empate descrito a continuación.

Sección 25.2. Procedimiento de Compra de Empate. Cualquier Miembro (el "Miembro Iniciador") podrá entregar un aviso escrito a los otros Miembros especificando un precio por la totalidad del Interés de Membresía del Miembro Iniciador. Los Miembros receptores tendrán treinta (30) días para elegir: (a) comprar el Interés de Membresía del Miembro Iniciador al precio especificado; o (b) vender su propio Interés de Membresía al Miembro Iniciador al mismo precio (ajustado proporcionalmente por Interés Porcentual).

Sección 25.3. Cierre Obligatorio. Una vez realizada la elección, el cierre se completará dentro de sesenta (60) días.`,

// =====================================================
// OA_029: CONSENTIMIENTO CONYUGAL
// =====================================================
'OA_029': `ARTÍCULO — CONSENTIMIENTO CONYUGAL

Sección 26.1. Consentimiento Conyugal. El cónyuge de cada Miembro, al firmar a continuación, reconoce que ha leído y comprende este Acuerdo y acepta estar obligado por sus términos con respecto a cualquier interés de propiedad comunitaria que dicho cónyuge pueda tener en el Interés de Membresía de dicho Miembro. Dicho cónyuge renuncia a cualquier derecho de propiedad comunitaria que pueda tener sobre el Interés de Membresía, excepto el derecho a recibir distribuciones.

CONSENTIMIENTO CONYUGAL:

___________________________________
{{spouse_name}}
Cónyuge de {{member_name_requiring_consent}}
Fecha: _______________`,

// =====================================================
// OA_030: ENMIENDA
// =====================================================
'OA_030': `ARTÍCULO — ENMIENDA

Sección 27.1. Enmienda. Este Acuerdo solo podrá ser enmendado, modificado o complementado por un instrumento escrito ejecutado por {{amendment_threshold}}. Ningún acuerdo oral, curso de conducta o curso de ejecución será efectivo para enmendar, modificar o complementar este Acuerdo. Cualquier enmienda a este Acuerdo será vinculante para todos los Miembros, sus herederos, sucesores y cesionarios.

Sección 27.2. Enmiendas al Anexo A. No obstante la Sección 27.1, el Anexo A podrá ser enmendado por {{member_reference_es}} sin el consentimiento de los Miembros para reflejar: (a) cualquier Transferencia de Intereses de Membresía realizada de conformidad con este Acuerdo; (b) la admisión de nuevos Miembros de conformidad con este Acuerdo; (c) el retiro, renuncia o remoción de Miembros de conformidad con este Acuerdo; y (d) cualquier cambio en las direcciones o información de contacto de los Miembros.

Sección 27.3. Sin Menoscabo sin Consentimiento. No obstante la Sección 27.1, ninguna enmienda podrá: (a) modificar la responsabilidad limitada de cualquier Miembro; (b) alterar el Interés Porcentual o los derechos económicos de cualquier Miembro sin el consentimiento escrito previo de dicho Miembro; o (c) aumentar las obligaciones de cualquier Miembro de realizar Contribuciones de Capital sin el consentimiento escrito previo de dicho Miembro.`,

// =====================================================
// OA_031: ACUERDO COMPLETO
// =====================================================
'OA_031': `ARTÍCULO — ACUERDO COMPLETO

Sección 28.1. Acuerdo Completo. Este Acuerdo, junto con todos los Anexos y Exhibiciones adjuntos, constituye el acuerdo completo entre los Miembros con respecto a la materia del mismo y reemplaza todas las negociaciones, representaciones, garantías, compromisos, ofertas, contratos y escritos previos de cualquier tipo, ya sean escritos u orales, relacionados con la materia de este Acuerdo. Ningún Miembro ha confiado en ninguna declaración, representación, garantía o acuerdo de cualquier otro Miembro o cualquier otra Persona, excepto los expresamente establecidos en este Acuerdo.

Sección 28.2. Sin Beneficiarios Terceros. Nada en este Acuerdo, ya sea expreso o implícito, tiene la intención de conferir ningún derecho o recurso bajo o por razón de este Acuerdo a ninguna Persona que no sea los Miembros y sus respectivos herederos, ejecutores, administradores, representantes personales, sucesores y cesionarios permitidos.`,

// =====================================================
// OA_032: LEY APLICABLE
// =====================================================
'OA_032': `ARTÍCULO — LEY APLICABLE Y JURISDICCIÓN

Sección 29.1. Ley Aplicable. Este Acuerdo se regirá por, e interpretará y aplicará de conformidad con, las leyes del Estado de California, incluyendo la Ley, sin dar efecto a ninguna regla o disposición de elección de ley o conflicto de leyes (ya sea del Estado de California o de cualquier otra jurisdicción) que causaría la aplicación de las leyes de cualquier jurisdicción distinta al Estado de California.

Sección 29.2. Jurisdicción y Sede. Sujeto a las disposiciones de resolución de disputas establecidas en este Acuerdo, cada Miembro se somete irrevocablemente a la jurisdicción exclusiva de los tribunales estatales y federales ubicados en el Condado de {{venue_county}}, Estado de California, para el propósito de cualquier demanda, acción u otro procedimiento judicial que surja de o se relacione con este Acuerdo.

Sección 29.3. Renuncia al Juicio por Jurado. EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE, CADA MIEMBRO POR ESTE MEDIO RENUNCIA IRREVOCABLE E INCONDICIONALMENTE AL DERECHO A UN JUICIO POR JURADO EN CUALQUIER ACCIÓN, DEMANDA, PROCEDIMIENTO O CONTRADEMANDA QUE SURJA DE O SE RELACIONE CON ESTE ACUERDO O LAS TRANSACCIONES CONTEMPLADAS POR EL MISMO.`,

// =====================================================
// OA_033: DIVISIBILIDAD
// =====================================================
'OA_033': `ARTÍCULO — DIVISIBILIDAD

Sección 30.1. Divisibilidad. Si cualquier disposición de este Acuerdo o su aplicación a cualquier Persona o circunstancia es declarada inválida, ilegal o inaplicable en cualquier medida por un tribunal de jurisdicción competente, el resto de este Acuerdo y la aplicación de dicha disposición a otras Personas o circunstancias no se verán afectados por ello y se aplicarán en la mayor medida permitida por la ley.

Sección 30.2. Reforma. Si cualquier disposición de este Acuerdo es declarada inválida, ilegal o inaplicable, las partes acuerdan que dicha disposición será reformada y interpretada de manera que sea válida, legal y aplicable en la máxima medida permitida por la ley aplicable, preservando lo más posible la intención original de las partes.`,

// =====================================================
// OA_034: NOTIFICACIONES
// =====================================================
'OA_034': `ARTÍCULO — NOTIFICACIONES

Sección 31.1. Notificaciones. Todas las notificaciones, solicitudes, demandas, reclamaciones y otras comunicaciones requeridas o permitidas bajo este Acuerdo serán por escrito y serán entregadas personalmente, enviadas por servicio de mensajería de entrega al día siguiente reconocido nacionalmente, enviadas por correo certificado o registrado (acuse de recibo solicitado, franqueo prepagado), o enviadas por correo electrónico a la dirección de cada Miembro según se establece en el Anexo A (o a cualquier otra dirección que dicho Miembro haya especificado mediante aviso escrito de conformidad con esta Sección).

Sección 31.2. Efectividad de las Notificaciones. Cualquier notificación dada de conformidad con esta Sección se considerará dada y recibida: (a) cuando sea entregada, si se entrega personalmente; (b) el siguiente día hábil después del envío, si se envía por servicio de mensajería reconocido nacionalmente; (c) tres (3) días hábiles después del envío por correo, si se envía por correo certificado o registrado; o (d) cuando se envíe, si se transmite por correo electrónico (siempre que el remitente no reciba una notificación automática de fallo de entrega).

Sección 31.3. Cambio de Dirección. Cualquier Miembro podrá cambiar la dirección de dicho Miembro para propósitos de recibir notificaciones dando aviso escrito de dicho cambio a la Compañía y a todos los demás Miembros de conformidad con esta Sección.`,

// =====================================================
// OA_035: COPIAS Y FIRMAS ELECTRÓNICAS
// =====================================================
'OA_035': `ARTÍCULO — COPIAS Y FIRMAS ELECTRÓNICAS

Sección 32.1. Copias. Este Acuerdo podrá ser ejecutado en cualquier número de copias, cada una de las cuales se considerará un original y todas las cuales en conjunto constituirán uno y el mismo instrumento. No será necesario que ninguna copia individual sea firmada por todas las partes del mismo, siempre que cada parte firme al menos una copia.

Sección 32.2. Firmas Electrónicas. Este Acuerdo y cualquier enmienda, complemento o modificación al mismo podrán ser ejecutados y entregados mediante firma electrónica (incluyendo cualquier firma electrónica que cumpla con la Ley Uniforme de Transacciones Electrónicas de California, Código Civil Secciones 1633.1 y siguientes, o la Ley federal ESIGN, 15 U.S.C. §§ 7001-7006) y por facsímil o transmisión electrónica (incluyendo correo electrónico en formato de documento portátil (.pdf)), y dicha firma electrónica, facsímil o transmisión electrónica será válida y vinculante para la parte que la ejecute en la misma medida que si dicha parte hubiera ejecutado una copia original de este Acuerdo.

Sección 32.3. Registros Electrónicos. Los Miembros acuerdan que este Acuerdo y cualquier notificación, consentimiento, aprobación u otra comunicación dada o realizada de conformidad con este Acuerdo pueden ser creados, entregados y almacenados en forma electrónica en la medida permitida por la ley aplicable.`,

// =====================================================
// OA_036: FUERZA MAYOR
// =====================================================
'OA_036': `ARTÍCULO — FUERZA MAYOR

Sección 33.1. Eventos de Fuerza Mayor. Ninguna parte será responsable de cualquier fallo o retraso en el cumplimiento de cualquier obligación bajo este Acuerdo (que no sea el pago de dinero) cuando y en la medida en que dicho fallo o retraso sea causado por circunstancias más allá del control razonable de dicha parte, incluyendo, sin limitación: desastres naturales, actos de Dios, epidemias, pandemias, guerra, terrorismo, insurrección, disturbios, huelgas, acciones gubernamentales, órdenes judiciales, embargos, o fallos de telecomunicaciones o servicios públicos.

Sección 33.2. Aviso y Mitigación. La parte afectada por un evento de fuerza mayor deberá: (a) dar aviso escrito oportuno a las otras partes describiendo el evento y su efecto anticipado; y (b) utilizar esfuerzos comercialmente razonables para mitigar el impacto del evento de fuerza mayor y reanudar el cumplimiento lo antes posible.`,

// =====================================================
// OA_037: RENUNCIA Y DISPOSICIONES GENERALES
// =====================================================
'OA_037': `ARTÍCULO — RENUNCIA Y DISPOSICIONES ADICIONALES

Sección 34.1. Sin Renuncia. Ningún fallo o retraso por parte de cualquier Miembro o la Compañía en ejercer cualquier derecho, poder o privilegio bajo este Acuerdo operará como una renuncia al mismo, ni ningún ejercicio individual o parcial de cualquier derecho, poder o privilegio impedirá cualquier otro o futuro ejercicio del mismo o el ejercicio de cualquier otro derecho, poder o privilegio. Los derechos y recursos proporcionados en este Acuerdo son acumulativos y no exclusivos de ningún derecho o recurso proporcionado por la ley.

Sección 34.2. Garantías Adicionales. Cada Miembro, en cualquier momento y de tiempo en tiempo, ejecutará y entregará los instrumentos, documentos y acuerdos adicionales, y tomará las acciones adicionales que sean razonablemente solicitadas por {{member_reference_es}} o cualquier otro Miembro para llevar a cabo los propósitos e intenciones de este Acuerdo.

Sección 34.3. Acreedores. Ninguna de las disposiciones de este Acuerdo será en beneficio de o exigible por cualquier acreedor de la Compañía o cualquier acreedor de cualquier Miembro, y ningún acreedor que haga un préstamo a la Compañía tendrá o adquirirá en ningún momento, como resultado de hacer el préstamo, ningún interés directo o indirecto en las ganancias, pérdidas o propiedad de la Compañía que no sea como acreedor.

Sección 34.4. Efecto Vinculante. Este Acuerdo será vinculante para y redundará en beneficio de los Miembros y sus respectivos herederos, ejecutores, administradores, representantes personales, sucesores y cesionarios permitidos.

Sección 34.5. Encabezados. Los encabezados y títulos contenidos en este Acuerdo son solo para conveniencia de referencia, no se considerarán parte de este Acuerdo, y no serán referidos en conexión con la interpretación de este Acuerdo.

Sección 34.6. Honorarios de Abogados. En caso de cualquier acción, demanda o procedimiento para hacer cumplir, interpretar o interpretar cualquier disposición de este Acuerdo, la parte prevaleciente tendrá derecho a recuperar de la parte no prevaleciente sus honorarios razonables de abogados, costos y gastos incurridos en conexión con los mismos.

Sección 34.7. El Tiempo es Esencial. El tiempo es esencial con respecto a cada una y todas las disposiciones de este Acuerdo que requieran la realización de una acción dentro de un período de tiempo especificado o en una fecha especificada.`,

// =====================================================
// OA_038: ANEXO A — MIEMBROS
// =====================================================
'OA_038': `ANEXO A
MIEMBROS, CONTRIBUCIONES DE CAPITAL E INTERESES PORCENTUALES

A la Fecha Efectiva del Acuerdo:

| Nombre del Miembro | Dirección | Contribución de Capital Inicial | Interés Porcentual |
|---|---|---|---|
| {{member_1_name}} | {{member_1_address}} | {{member_1_contribution}} | {{member_1_percentage}}% |
{{#if member_2_name}}| {{member_2_name}} | {{member_2_address}} | {{member_2_contribution}} | {{member_2_percentage}}% |
{{/if}}{{#if member_3_name}}| {{member_3_name}} | {{member_3_address}} | {{member_3_contribution}} | {{member_3_percentage}}% |
{{/if}}| TOTAL | | {{total_contributions}} | 100% |

Este Anexo A podrá ser enmendado de tiempo en tiempo de conformidad con los términos del Acuerdo Operativo para reflejar cambios en los Miembros, Contribuciones de Capital o Intereses Porcentuales.`,

// =====================================================
// OA_039: ANEXO B — GERENTES
// =====================================================
'OA_039': `ANEXO B
GERENTES

A la Fecha Efectiva del Acuerdo:

| Nombre del Gerente | Dirección | Título |
|---|---|---|
| {{manager_1_name}} | {{manager_1_address}} | Gerente |
{{#if manager_2_name}}| {{manager_2_name}} | {{manager_2_address}} | Gerente |
{{/if}}

Este Anexo B podrá ser enmendado de tiempo en tiempo de conformidad con los términos del Acuerdo Operativo para reflejar cambios en los Gerentes de la Compañía.`,

// =====================================================
// OA_040: BLOQUE DE FIRMAS
// =====================================================
'OA_040': `EJECUCIÓN

EN FE DE LO CUAL, {{member_reference_es}} abajo firmante(s) ha(n) ejecutado este Acuerdo Operativo a la Fecha Efectiva establecida anteriormente.

COMPAÑÍA:
{{company_name}}

Por: ______________________________
Nombre: {{member_1_name}}
Título: {{authorized_signer_title_es}}
Fecha: ______________________________

{{member_label_1_es}}:
______________________________
{{member_1_name}}
Fecha: ______________________________

{{#if member_2_name}}{{member_label_2_es}}:
______________________________
{{member_2_name}}
Fecha: ______________________________
{{/if}}
{{#if member_3_name}}{{member_label_3_es}}:
______________________________
{{member_3_name}}
Fecha: ______________________________
{{/if}}`

};

// =====================================================
// ADDITIONAL SPANISH TOKENS
// These supplement the English token map
// =====================================================
export const SPANISH_TOKENS = {
  '{{member_reference_es}}': null, // Set dynamically based on member count
  '{{business_purpose_text_es}}': null, // Set dynamically based on purpose
  '{{tax_classification_text_es}}': null, // Set dynamically
  '{{authorized_signer_title_es}}': null,
  '{{member_label_1_es}}': null,
  '{{member_label_2_es}}': 'MIEMBRO 2',
  '{{member_label_3_es}}': 'MIEMBRO 3',
};

// Spanish business purpose translations
export const SPANISH_PURPOSES = {
  general: 'participar en cualquiera y todas las actividades comerciales legales para las cuales una compañía de responsabilidad limitada puede ser organizada bajo la Ley Revisada Uniforme de Compañías de Responsabilidad Limitada de California',
  professional: 'proveer servicios profesionales según lo permita la ley aplicable',
  real_estate: 'adquirir, poseer, administrar, desarrollar, arrendar y disponer de bienes inmuebles e intereses en los mismos',
  consulting: 'proveer servicios de consultoría',
  ecommerce: 'conducir operaciones de comercio electrónico y negocios en línea',
  other: null // Uses business_purpose_other
};