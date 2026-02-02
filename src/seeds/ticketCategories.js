const { TicketCategory } = require('../models');

const defaultCategories = [
  {
    name: 'Soporte Técnico',
    description: 'Problemas técnicos con la plataforma',
    color: '#dc3545',
    icon: '🔧',
    sort_order: 1
  },
  {
    name: 'Cuenta de Usuario',
    description: 'Issues relacionados con cuentas y perfiles',
    color: '#007bff',
    icon: '👤',
    sort_order: 2
  },
  {
    name: 'Pagos y Facturación',
    description: 'Problemas con pagos, suscripciones o facturas',
    color: '#28a745',
    icon: '💳',
    sort_order: 3
  },
  {
    name: 'Contenido Musical',
    description: 'Issues con álbumes, canciones o artistas',
    color: '#ffc107',
    icon: '🎵',
    sort_order: 4
  },
  {
    name: 'Reporte de Contenido',
    description: 'Reportes de contenido inapropiado o violaciones',
    color: '#fd7e14',
    icon: '🚨',
    sort_order: 5
  },
  {
    name: 'Sugerencias',
    description: 'Sugerencias para mejorar la plataforma',
    color: '#6f42c1',
    icon: '💡',
    sort_order: 6
  },
  {
    name: 'Bug Report',
    description: 'Reporte de errores o bugs en el sistema',
    color: '#e83e8c',
    icon: '🐛',
    sort_order: 7
  },
  {
    name: 'Otro',
    description: 'Categoría general para otros tipos de solicitudes',
    color: '#6c757d',
    icon: '📋',
    sort_order: 8
  }
];

const seedTicketCategories = async () => {
  try {
    console.log('Iniciando seed de categorías de tickets...');
    
    // Verificar si ya existen categorías
    const existingCategories = await TicketCategory.findAll();
    
    if (existingCategories.length === 0) {
      // Crear categorías por defecto
      await TicketCategory.bulkCreate(defaultCategories);
      console.log(`✅ Se crearon ${defaultCategories.length} categorías por defecto`);
    } else {
      console.log(`ℹ️  Ya existen ${existingCategories.length} categorías en la base de datos`);
      
      // Opcional: Actualizar categorías existentes
      for (const category of defaultCategories) {
        await TicketCategory.upsert({
          ...category,
          is_active: true
        }, {
          where: { name: category.name }
        });
      }
      console.log('✅ Categorías actualizadas si fue necesario');
    }
    
    // Mostrar categorías creadas
    const finalCategories = await TicketCategory.findAll({
      order: [['sort_order', 'ASC']]
    });
    
    console.log('\n📋 Categorías disponibles:');
    finalCategories.forEach(cat => {
      console.log(`  ${cat.icon} ${cat.name} (${cat.color})`);
    });
    
  } catch (error) {
    console.error('❌ Error en seed de categorías:', error);
    throw error;
  }
};

module.exports = seedTicketCategories;
