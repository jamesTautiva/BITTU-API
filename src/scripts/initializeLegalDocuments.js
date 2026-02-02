const { LegalDocument } = require('../models');

const initializeLegalDocuments = async () => {
  try {
    const documents = [
      {
        type: 'terms',
        title: 'Términos y Condiciones de BITU Platform',
        content: `TÉRMINOS Y CONDICIONES - BITU PLATFORM

BITU es una plataforma de streaming musical que conecta artistas con su audiencia a través del mundo.

¿Qué es BITU y qué ofrece?
BITU es una plataforma digital que permite a los artistas subir, distribuir y monetizar su contenido musical.

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
Este acuerdo se rige por las leyes de Colombia.`,
        version: '1.0',
        is_active: true
      },
      {
        type: 'privacy_policy',
        title: 'Política de Privacidad de BITU Platform',
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
        type: 'data_consent',
        title: 'Consentimiento de Tratamiento de Datos',
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
        type: 'content_license',
        title: 'Licencia de Contenido Musical',
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
        type: 'copyright',
        title: 'Declaración de Derechos de Autor',
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
        type: 'moderation_policy',
        title: 'Política de Moderación',
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
        type: 'notifications_policy',
        title: 'Política de Notificaciones y Emails',
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

    // Create documents if they don't exist
    for (const docData of documents) {
      const [doc, created] = await LegalDocument.findOrCreate({
        where: { type: docData.type },
        defaults: docData
      });
      
      if (created) {
        console.log(`✅ Created legal document: ${doc.title}`);
      } else {
        console.log(`ℹ️  Legal document already exists: ${doc.title}`);
      }
    }

    console.log('🎯 Legal documents initialization completed');
    
  } catch (error) {
    console.error('❌ Error initializing legal documents:', error);
  }
};

module.exports = { initializeLegalDocuments };
