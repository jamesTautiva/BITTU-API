const { LegalDocument } = require('../src/models');

const legalDocuments = [
  {
    title: 'Términos y Condiciones',
    content: `BITU es una plataforma de streaming musical que permite a los artistas subir y compartir su música con el mundo.

¿Qué es BITU y qué ofrece?
BITU es una plataforma digital que conecta artistas con su audiencia a través del streaming musical. Ofrecemos herramientas para subir, distribuir y promocionar contenido musical.

¿Qué puede y qué NO puede hacer el usuario?
✅ PUEDE:
- Subir música original o con derechos autorizados
- Compartir su perfil en redes sociales
- Interactuar con otros artistas y fans
- Recibir analytics sobre su contenido

❌ NO PUEDE:
- Subir contenido con derechos de autor de terceros sin permiso
- Usar la plataforma para spam o actividades ilegales
- Subir contenido que viole derechos de propiedad intelectual
- Intentar vulnerar la seguridad de la plataforma

Uso permitido del contenido
El contenido subido permanece propiedad del artista, pero BITU obtiene una licencia no exclusiva para distribuirlo en la plataforma.

Suspensión / eliminación de cuentas
BITU se reserva el derecho de suspender o eliminar cuentas que violen estos términos sin previo aviso.

Limitación de responsabilidad
BITU no es responsable del contenido subido por los usuarios ni de infracciones de derechos de autor.

Jurisdicción
Este acuerdo se rige por las leyes de Colombia. Cualquier disputa se resolverá bajo la jurisdicción colombiana.`,
    type: 'terms',
    version: '1.0',
    is_active: true
  },
  {
    title: 'Política de Privacidad',
    content: `En BITU nos comprometemos con la protección de sus datos personales conforme a la Ley 1581 de 2012 de Colombia.

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
    type: 'terms',
    version: '1.0',
    is_active: true
  },
  {
    title: 'Licencia de Contenido Musical',
    content: `Esta licencia aplica exclusivamente a artistas que suben contenido musical a BITU.

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
    type: 'artist_contract',
    version: '1.0',
    is_active: true
  },
  {
    title: 'Declaración de Derechos de Autor',
    content: `Declaración bajo juramento sobre derechos de autor y propiedad intelectual.

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
    type: 'copyright',
    version: '1.0',
    is_active: true
  }
];

async function seedLegalDocuments() {
  try {
    console.log('Seeding legal documents...');
    
    for (const doc of legalDocuments) {
      const [document, created] = await LegalDocument.findOrCreate({
        where: { type: doc.type },
        defaults: doc
      });
      
      if (created) {
        console.log(`✅ Created: ${doc.title}`);
      } else {
        console.log(`⚠️  Already exists: ${doc.title}`);
        // Update existing document
        await document.update(doc);
        console.log(`🔄 Updated: ${doc.title}`);
      }
    }
    
    console.log('✅ Legal documents seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding legal documents:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedLegalDocuments().then(() => {
    process.exit(0);
  });
}

module.exports = { seedLegalDocuments };
