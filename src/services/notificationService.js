const { Notification } = require('../models');

/**
 * Servicio de utilidades para notificaciones
 * Facilita la creación de notificaciones desde cualquier parte del sistema
 */
class NotificationService {
  
  /**
   * Crear una notificación para un usuario
   * @param {Object} options - Opciones de la notificación
   * @param {number} options.userId - ID del usuario
   * @param {string} options.type - Tipo de notificación
   * @param {string} options.title - Título de la notificación
   * @param {string} options.message - Mensaje de la notificación
   * @param {string} options.priority - Prioridad (low, medium, high)
   * @param {string} options.actionUrl - URL de acción opcional
   * @returns {Promise<Notification>} - Notificación creada
   */
  static async createNotification({
    userId,
    type = 'system',
    title,
    message,
    priority = 'medium',
    actionUrl = null
  }) {
    try {
      const notification = await Notification.create({
        user_id: userId,
        type,
        title,
        message,
        priority,
        action_url: actionUrl
      });
      
      console.log(`Notification created for user ${userId}: ${title}`);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Notificación de bienvenida para nuevo usuario
   * @param {number} userId - ID del usuario
   * @param {string} username - Nombre del usuario
   */
  static async sendWelcomeNotification(userId, username) {
    return this.createNotification({
      userId,
      type: 'system',
      title: '¡Bienvenido a BITU!',
      message: `Hola ${username}, bienvenido a la plataforma de música BITU. Explora tu dashboard y descubre todas las funciones disponibles.`,
      priority: 'high',
      actionUrl: '/dashboard'
    });
  }

  /**
   * Notificación de nuevo artista registrado
   * @param {number} adminUserId - ID del admin a notificar
   * @param {string} artistName - Nombre del artista
   * @param {number} artistId - ID del artista
   */
  static async sendNewArtistNotification(adminUserId, artistName, artistId) {
    return this.createNotification({
      userId: adminUserId,
      type: 'artist',
      title: 'Nuevo Artista Registrado',
      message: `El artista "${artistName}" se ha registrado en la plataforma y espera aprobación.`,
      priority: 'medium',
      actionUrl: `/artists/${artistId}`
    });
  }

  /**
   * Notificación de aprobación de artista
   * @param {number} userId - ID del usuario artista
   * @param {string} artistName - Nombre del artista
   */
  static async sendArtistApprovalNotification(userId, artistName) {
    return this.createNotification({
      userId,
      type: 'artist',
      title: '¡Artista Aprobado!',
      message: `¡Felicidades ${artistName}! Tu perfil de artista ha sido aprobado. Ya puedes empezar a subir tu música.`,
      priority: 'high',
      actionUrl: '/my-music'
    });
  }

  /**
   * Notificación de nuevo álbum
   * @param {number} userId - ID del usuario a notificar
   * @param {string} albumTitle - Título del álbum
   * @param {string} artistName - Nombre del artista
   * @param {number} albumId - ID del álbum
   */
  static async sendNewAlbumNotification(userId, albumTitle, artistName, albumId) {
    return this.createNotification({
      userId,
      type: 'album',
      title: 'Nuevo Álbum Disponible',
      message: `${artistName} ha lanzado un nuevo álbum: "${albumTitle}".`,
      priority: 'medium',
      actionUrl: `/albums/${albumId}`
    });
  }

  /**
   * Notificación de nuevo comentario
   * @param {number} userId - ID del usuario a notificar
   * @param {string} commenterName - Nombre del comentarista
   * @param {string} contentType - Tipo de contenido (song/album)
   * @param {string} contentTitle - Título del contenido
   * @param {number} contentId - ID del contenido
   */
  static async sendNewCommentNotification(userId, commenterName, contentType, contentTitle, contentId) {
    return this.createNotification({
      userId,
      type: 'comment',
      title: 'Nuevo Comentario',
      message: `${commenterName} ha comentado en tu ${contentType}: "${contentTitle}"`,
      priority: 'low',
      actionUrl: `/${contentType}s/${contentId}`
    });
  }

  /**
   * Notificación de ticket actualizado
   * @param {number} userId - ID del usuario a notificar
   * @param {number} ticketId - ID del ticket
   * @param {string} status - Nuevo estado
   */
  static async sendTicketUpdateNotification(userId, ticketId, status) {
    return this.createNotification({
      userId,
      type: 'ticket',
      title: 'Ticket Actualizado',
      message: `Tu ticket #${ticketId} ha sido actualizado a: ${status}`,
      priority: 'medium',
      actionUrl: `/tickets/${ticketId}`
    });
  }

  /**
   * Notificación de documento legal
   * @param {number} userId - ID del usuario a notificar
   * @param {string} documentType - Tipo de documento
   * @param {string} documentTitle - Título del documento
   */
  static async sendLegalDocumentNotification(userId, documentType, documentTitle) {
    return this.createNotification({
      userId,
      type: 'legal',
      title: 'Documento Legal Requerido',
      message: `Es necesario aceptar el documento "${documentTitle}" (${documentType}) para continuar usando la plataforma.`,
      priority: 'high',
      actionUrl: '/legal-documents'
    });
  }

  /**
   * Notificación de sistema general
   * @param {number} userId - ID del usuario
   * @param {string} title - Título
   * @param {string} message - Mensaje
   * @param {string} priority - Prioridad
   * @param {string} actionUrl - URL de acción
   */
  static async sendSystemNotification(userId, title, message, priority = 'medium', actionUrl = null) {
    return this.createNotification({
      userId,
      type: 'system',
      title,
      message,
      priority,
      actionUrl
    });
  }
}

module.exports = NotificationService;
