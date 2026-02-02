require('dotenv').config();
const { LegalDocument } = require('../models');

// Crear documentos legales básicos para BITU
const legalDocuments = [
  {
    title: 'Términos y Condiciones',
    type: 'terms',
    content: `TÉRMINOS Y CONDICIONES - BITU PLATFORM

BITU es una plataforma de streaming musical que conecta artistas con su audiencia a través del mundo.

¿Qué es BITU y qué ofrece?
BITU es una plataforma digital que permite a los artistas subir, distribuir y monetizar su contenido musical. Ofrecemos herramientas para promoción, analytics y gestión de derechos.

¿Qué puede y qué NO puede hacer el usuario?
✅ PUEDE:
- Subir música original o con derechos autorizados
- Compartir su perfil en redes sociales
- Interactuar con otros artistas y fans
- Recibir analytics sobre su contenido

❌ NO PUEDE:
- Subir contenido con derechos de autor de terceros sin permiso
- Usar la plataforma para actividades ilegales
- Publicar contenido que viole derechos de propiedad intelectual

Uso permitido del contenido
El contenido subido permanece propiedad del artista, pero BITU obtiene una licencia no exclusiva para distribuirlo en la plataforma.

Suspensión / eliminación de cuentas
BITU se reserva el derecho de suspender o eliminar cuentas que violen estos términos sin previo aviso.

Limitación de responsabilidad
BITU no es responsable del contenido subido por los usuarios ni de infracciones de derechos de autor.

Jurisdicción
Este acuerdo se rige por las leyes de Colombia. Cualquier disputa se resolverá bajo la jurisdicción colombiana.`,
    version: '1.0',
    is_active: true
  },
  {
    title: 'Política de Privacidad',
    type: 'privacy_policy',
    content: `POLÍTICA DE PRIVACIDAD - BITU PLATFORM

En BITU nos comprometemos con la protección de sus datos personales conforme a la Ley 1581 de 2012 de Colombia.

Datos que recolectamos:
- Email y nombre de usuario para la cuenta
- Imágenes de perfil y contenido musical
- Dirección IP para fines de seguridad
- Estadísticas de uso y analytics
- Datos de pago (si aplica)

Finalidad del uso:
- Proveer y mantener el servicio de BITU
- Personalizar la experiencia del usuario
- Enviar notificaciones importantes del sistema
- Generar analytics y estadísticas
- Mejorar nuestros servicios

Almacenamiento:
Sus datos se almacenan de forma segura en servidores ubicados en Colombia y cumplen con los estándares de seguridad internacionales.

Derechos del usuario:
- Conocer, actualizar y rectificar sus datos personales
- Solicitar la eliminación de sus datos
- Revocar el consentimiento para el tratamiento de datos
- Presentar quejas ante la Superintendencia de Industria y Comercio

Contacto legal:
Para asuntos de privacidad, contáctenos en privacy@bitu.com.co`,
    version: '1.0',
    is_active: true
  },
  {
    title: 'Consentimiento de Datos',
    type: 'data_consent',
    content: `CONSENTIMIENTO DE TRATAMIENTO DE DATOS

Conforme a la Ley 1581 de 2012 de Colombia, solicito mi consentimiento libre, informado y explícito para el tratamiento de mis datos personales.

Autorizo expresamente a BITU para:
- Recopilar mis datos personales proporcionados voluntariamente
- Almacenarlos en sistemas seguros y confiables
- Utilizarlos para los fines descritos en la Política de Privacidad
- Compartirlos solo con terceros necesarios para la prestación del servicio

Entiendo que:
- El consentimiento es revocable en cualquier momento
- Tengo derecho a conocer, actualizar y rectificar mis datos
- La información será tratada con confidencialidad
- Puedo presentar quejas ante las autoridades competentes

Este consentimiento tiene vigencia indefinida mientras mantenga una cuenta activa en BITU.`,
    version: '1.0',
    is_active: true
  },
  {
    title: 'Licencia de Contenido Musical',
    type: 'content_license',
    content: `LICENCIA DE CONTENIDO MUSICAL

Esta licencia aplica exclusivamente a artistas que suben contenido musical a BITU.

Declaración de derechos:
El artista declara ser titular de los derechos del contenido o tener autorización explícita para subirlo.

Licencia otorgada a BITU:
El artista otorga a BITU una licencia no exclusiva, mundial, por el término de los derechos de autor, para:
- Reproducir el contenido en la plataforma
- Distribuir digitalmente la música
- Mostrar el contenido en perfiles y playlists
- Promocionar el artista y su música
- Realizar copias temporales para streaming

Derechos del artista:
- Mantiene la propiedad intelectual de su contenido
- Puede retirar el contenido cuando lo desee
- Recibe analytics y reportes de uso
- Puede autorizar otros usos adicionales

Restricciones:
- La licencia es no exclusiva, el artista puede usar otras plataformas
- BITU no puede vender el contenido a terceros sin autorización adicional
- El artista garantiza no infringir derechos de terceros

Esta licencia es condición necesaria para usar BITU como artista.`,
    version: '1.0',
    is_active: true
  },
  {
    title: 'Declaración de Derechos de Autor',
    type: 'copyright',
    content: `DECLARACIÓN DE DERECHOS DE AUTOR

Declaración bajo juramento sobre derechos de autor y propiedad intelectual.

Yo, el artista abajo firmante, declaro que:

1. Soy titular de los derechos de autor del contenido musical que subo a BITU, o tengo autorización explícita del titular.

2. El contenido es original y no infringe derechos de propiedad intelectual de terceros.

3. Tengo los derechos necesarios para:
- La composición musical (letra y melodía)
- La grabación (master)
- Cualquier sample o contenido de terceros debidamente autorizado

4. Asumo toda responsabilidad legal por reclamos de derechos de autor.

5. Autorizo a BITU a usar el contenido según los términos establecidos en la Licencia de Contenido Musical.

6. Entiendo que cualquier declaración falsa puede resultar en:
- Eliminación inmediata del contenido
- Suspensión permanente de mi cuenta
- Acciones legales por parte de BITU o terceros

Esta declaración se aplica a cada álbum y canción subida a la plataforma.`,
    version: '1.0',
    is_active: true
  },
  {
    title: 'Política de Moderación',
    type: 'moderation_policy',
    content: `POLÍTICA DE MODERACIÓN

BITU mantiene una política de moderación para garantizar un ambiente seguro y respetuoso para todos los usuarios.

Proceso de revisión:
- Todo el contenido subido pasa por un proceso de revisión
- Los álbumes son evaluados antes de publicarse
- El proceso puede tomar hasta 48 horas

Criterios de rechazo:
❌ Contenido NO permitido:
- Música con derechos de autor de terceros sin autorización
- Contenido que incite al odio, violencia o discriminación
- Spam, fraudes o engaños
- Contenido sexualmente explícito o inapropiado
- Violación de derechos de privacidad
- Contenido ilegal según la ley colombiana

✅ Contenido permitido:
- Música original con derechos claros
- Covers con licencia apropiada
- Remixes con autorización
- Contenido que respete los derechos de terceros

Decisión final:
BITU se reserva el derecho de:
- Rechazar contenido sin explicación detallada
- Solicitar modificaciones antes de aprobar
- Eliminar contenido posteriormente si se detectan violaciones
- Suspender cuentas con infracciones repetidas

Apelación:
Los artistas pueden apelar decisiones enviando un email a moderation@bitu.com.co`,
    version: '1.0',
    is_active: true
  },
  {
    title: 'Condiciones de Monetización',
    type: 'monetization_terms',
    content: `CONDICIONES DE MONETIZACIÓN

BITU está desarrollando opciones de monetización para artistas. Estas condiciones aplicarán cuando se activen.

Modelos de monetización potenciales:
- Donaciones directas de fans
- Publicidad compartida (revenue share)
- Venta de merchandising
- Suscripciones premium

Términos generales:
- Los pagos se realizarán mensualmente
- Mínimo de retiro: $50 USD
- BITU retendrá una comisión por transacción
- Los artistas deben proporcionar información fiscal

Revenue Share:
- BITU: 30% de los ingresos publicitarios
- Artista: 70% de los ingresos publicitarios
- Pagos procesados a través de plataformas seguras

Donaciones:
- BITU: 5% de comisión por procesamiento
- Artista: 95% del monto donado
- Sin mínimo de retiro para donaciones

Requisitos:
- Cuenta verificada
- Información bancaria válida
- Declaración fiscal actualizada
- Cumplimiento con todas las políticas de BITU

Estas condiciones pueden actualizarse. Se notificará a los artistas con 30 días de antelación.`,
    version: '1.0',
    is_active: true
  },
  {
    title: 'Política de Cookies',
    type: 'cookies_policy',
    content: `POLÍTICA DE COOKIES

BITU utiliza cookies y tecnologías similares para mejorar su experiencia en la plataforma.

¿Qué son las cookies?
Son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web.

Tipos de cookies que usamos:

🔒 Cookies esenciales:
- Mantienen su sesión activa
- Recuerdan sus preferencias
- Garantizan la seguridad del sitio

📊 Cookies de analytics:
- Recopilan información estadística
- Ayudan a entender cómo usa la plataforma
- No identifican personalmente al usuario

🎯 Cookies de personalización:
- Recuerdan sus preferencias musicales
- Mejoran las recomendaciones
- Personalizan el contenido

Terceros:
- Google Analytics para estadísticas
- Proveedores de pago seguros
- Redes sociales para integración

Gestión de cookies:
Puede configurar su navegador para:
- Rechazar todas las cookies
- Recibir notificaciones cuando se usan
- Eliminar cookies existentes

Su consentimiento:
Al continuar usando BITU, acepta el uso de cookies según esta política. Puede retirar su consentimiento en cualquier momento.

Para más información: cookies@bitu.com.co`,
    version: '1.0',
    is_active: true
  },
  {
    title: 'Política de Notificaciones y Emails',
    type: 'notifications_policy',
    content: `POLÍTICA DE NOTIFICACIONES Y EMAILS

BITU envía comunicaciones electrónicas para mantenerlo informado sobre su cuenta y nuestra plataforma.

Tipos de comunicaciones:

📧 Emails del sistema (obligatorios):
- Confirmación de registro
- Notificaciones de seguridad
- Cambios importantes en los términos
- Información sobre su cuenta
- Actualizaciones de contenido subido

🎵 Emails promocionales (opcionales):
- Novedades de BITU
- Recomendaciones musicales
- Eventos y lanzamientos
- Oportunidades para artistas

Gestión de preferencias:
Puede gestionar sus preferencias desde:
- Su perfil de usuario en BITU
- Link de "unsubscribe" en cada email
- Contactando a support@bitu.com.co

Frecuencia:
- Emails del sistema: según sea necesario
- Emails promocionales: máximo 2 por semana

Información contenida:
- Nunca solicitamos contraseñas por email
- Las comunicaciones oficiales vienen de @bitu.com.co
- Verifique siempre el remitente antes de hacer clic

Su consentimiento:
Al registrarse, acepta recibir emails del sistema. Los emails promocionales requieren consentimiento explícito.

Para dejar de recibir comunicaciones:
- Sistema: no es posible (esenciales para el servicio)
- Promocionales: puede darse de baja en cualquier momento

Contacto:
Para asuntos de comunicaciones: communications@bitu.com.co`,
    version: '1.0',
    is_active: true
  }
];

async function seedLegalDocuments() {
  try {
    console.log('🚀 Iniciando seed de documentos legales...');
    
    // Limpiar documentos existentes
    await LegalDocument.destroy({ where: {} });
    console.log('📝 Documentos existentes eliminados');
    
    // Crear nuevos documentos
    for (const doc of legalDocuments) {
      await LegalDocument.create(doc);
      console.log(`✅ Documento creado: ${doc.title} (${doc.type})`);
    }
    
    console.log('🎉 Seed de documentos legales completado exitosamente!');
    console.log(`📊 Total documentos creados: ${legalDocuments.length}`);
    
  } catch (error) {
    console.error('❌ Error en el seed de documentos legales:', error);
    process.exit(1);
  }
}

// Ejecutar el seed
if (require.main === module) {
  seedLegalDocuments().then(() => {
    process.exit(0);
  });
}

module.exports = { seedLegalDocuments };
