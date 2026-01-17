# BITU API - Database Schema Diagram

```mermaid
erDiagram
    USERS {
        int id PK
        string email
        string password
        string name
        timestamp created_at
        timestamp updated_at
    }
    
    ARTISTS {
        int id PK
        int user_id FK
        string name
        text bio
        string image_url
        enum status
    }
    
    ALBUMS {
        int id PK
        int artist_id FK
        int genre_id FK
        string title
        date release_date
        string cover_image
    }
    
    SONGS {
        int id PK
        int album_id FK
        string title
        string audio_url
        timestamp created_at
        timestamp updated_at
    }
    
    MEMBERS {
        int id PK
        int artist_id FK
        string name
        string role
    }
    
    COMPOSITORES {
        int id PK
        int song_id FK
        string name
    }
    
    GENRES {
        int id PK
        string name
    }
    
    ALBUM_GENRES {
        int album_id FK
        int genre_id FK
    }
    
    PLAYLISTS {
        int id PK
        int user_id FK
        string name
        text description
        timestamp created_at
    }
    
    PLAYLIST_SONGS {
        int playlist_id FK
        int song_id FK
    }
    
    COMMENTS {
        int id PK
        int user_id FK
        int song_id FK
        int album_id FK
        text content
        timestamp created_at
    }
    
    FAVORITES {
        int user_id FK
        int song_id FK
        timestamp created_at
    }
    
    NOTIFICATIONS {
        int id PK
        int user_id FK
        string title
        text message
        boolean read
        timestamp created_at
    }
    
    PLAYBACK_LOGS {
        int id PK
        int user_id FK
        int song_id FK
        timestamp played_at
        int duration
    }
    
    LEGAL_DOCUMENTS {
        int id PK
        string title
        text content
        string version
        timestamp created_at
    }
    
    LEGAL_ACCEPTANCES {
        int id PK
        int user_id FK
        int legal_document_id FK
        timestamp accepted_at
    }
    
    TICKETS {
        int id PK
        int user_id FK
        int category_id FK
        int assigned_to FK
        string title
        text description
        enum priority
        enum status
        string ticket_number
        timestamp resolved_at
        timestamp closed_at
        timestamp created_at
        timestamp updated_at
    }
    
    TICKET_CATEGORIES {
        int id PK
        string name
        text description
        string color
        string icon
        boolean is_active
        int sort_order
        timestamp created_at
        timestamp updated_at
    }
    
    TICKET_MESSAGES {
        int id PK
        int ticket_id FK
        int user_id FK
        text message
        enum message_type
        boolean is_internal
        boolean is_edited
        timestamp edited_at
        timestamp created_at
        timestamp updated_at
    }
    
    TICKET_ATTACHMENTS {
        int id PK
        int ticket_id FK
        int message_id FK
        int user_id FK
        string filename
        string original_name
        string file_path
        int file_size
        string mime_type
        enum file_type
        boolean is_public
        int download_count
        timestamp created_at
        timestamp updated_at
    }

    %% Relationships
    USERS ||--o{ ARTISTS : "has_one"
    USERS ||--o{ PLAYLISTS : "has_many"
    USERS ||--o{ COMMENTS : "has_many"
    USERS ||--o{ FAVORITES : "has_many"
    USERS ||--o{ NOTIFICATIONS : "has_many"
    USERS ||--o{ PLAYBACK_LOGS : "has_many"
    USERS ||--o{ LEGAL_ACCEPTANCES : "has_many"
    USERS ||--o{ TICKETS : "creates"
    USERS ||--o{ TICKETS : "assigned_to"
    USERS ||--o{ TICKET_MESSAGES : "writes"
    USERS ||--o{ TICKET_ATTACHMENTS : "uploads"
    
    ARTISTS ||--o{ ALBUMS : "has_many"
    ARTISTS ||--o{ MEMBERS : "has_many"
    
    ALBUMS ||--o{ SONGS : "has_many"
    ALBUMS ||--o{ COMMENTS : "has_many"
    ALBUMS ||--o{ ALBUM_GENRES : "belongs_to_many"
    ALBUMS }o--|| GENRES : "primary_genre"
    
    SONGS ||--o{ COMMENTS : "has_many"
    SONGS ||--o{ FAVORITES : "belongs_to_many"
    SONGS ||--o{ PLAYLIST_SONGS : "belongs_to_many"
    SONGS ||--o{ PLAYBACK_LOGS : "has_many"
    SONGS ||--o{ COMPOSITORES : "has_many"
    
    GENRES ||--o{ ALBUM_GENRES : "belongs_to_many"
    
    PLAYLISTS ||--o{ PLAYLIST_SONGS : "belongs_to_many"
    
    LEGAL_DOCUMENTS ||--o{ LEGAL_ACCEPTANCES : "has_many"

    TICKET_CATEGORIES ||--o{ TICKETS : "categorizes"
    TICKETS ||--o{ TICKET_MESSAGES : "has_many"
    TICKETS ||--o{ TICKET_ATTACHMENTS : "has_many"
    TICKET_MESSAGES ||--o{ TICKET_ATTACHMENTS : "has_many"

## Tablas Nuevas Creadas

### � TICKETS
Sistema completo de gestión de tickets de soporte técnico.

**Campos:**
- `id`: Identificador único
- `user_id`: Usuario que crea el ticket
- `category_id`: Categoría del ticket
- `assigned_to`: Usuario asignado (opcional)
- `title`: Título del ticket
- `description`: Descripción detallada
- `priority`: Prioridad (low, medium, high, urgent)
- `status`: Estado (open, in_progress, pending_user, resolved, closed)
- `ticket_number`: Número único auto-generado
- `resolved_at`: Fecha de resolución
- `closed_at`: Fecha de cierre
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### 📁 TICKET_CATEGORIES
Categorías para organizar los tickets.

**Campos:**
- `id`: Identificador único
- `name`: Nombre de la categoría
- `description`: Descripción
- `color`: Color hexadecimal para UI
- `icon`: Icono representativo
- `is_active`: Si está activa
- `sort_order`: Orden de visualización

### 💬 TICKET_MESSAGES
Mensajes dentro de un ticket.

**Campos:**
- `id`: Identificador único
- `ticket_id`: Referencia al ticket
- `user_id`: Autor del mensaje
- `message`: Contenido del mensaje
- `message_type`: Tipo (text, system, internal_note)
- `is_internal`: Si es solo visible para staff
- `is_edited`: Si fue editado
- `edited_at`: Fecha de edición

### 📎 TICKET_ATTACHMENTS
Archivos adjuntos a tickets o mensajes.

**Campos:**
- `id`: Identificador único
- `ticket_id`: Referencia al ticket
- `message_id`: Referencia al mensaje (opcional)
- `user_id`: Usuario que sube el archivo
- `filename`: Nombre del archivo en servidor
- `original_name`: Nombre original
- `file_path`: Ruta del archivo
- `file_size`: Tamaño en bytes
- `mime_type`: Tipo MIME
- `file_type`: Tipo (image, document, video, audio, other)
- `is_public`: Si es público
- `download_count`: Contador de descargas

## Relaciones Principales

- **Users → Artists**: Un usuario puede ser un artista
- **Artists → Albums**: Un artista tiene muchos álbumes
- **Albums → Songs**: Un álbum tiene muchas canciones
- **Songs → Compositores**: Una canción puede tener varios compositores
- **Artists → Members**: Un artista puede tener varios miembros/integrantes

## Endpoints Disponibles

### 🎵 Music Management
#### Artists
- `POST /api/artists/create` - Crear artista
- `GET /api/artists` - Obtener todos los artistas
- `GET /api/artists/:id` - Obtener artista por ID
- `PUT /api/artists/:id` - Actualizar artista
- `DELETE /api/artists/:id` - Eliminar artista
- `PUT /api/artists/:id/status` - Cambiar estado del artista

#### Albums
- `POST /api/albums/create` - Crear álbum
- `GET /api/albums` - Obtener todos los álbumes
- `GET /api/albums/:id` - Obtener álbum por ID
- `PUT /api/albums/:id` - Actualizar álbum
- `DELETE /api/albums/:id` - Eliminar álbum

#### Songs
- `POST /api/songs/create` - Crear canción
- `GET /api/songs` - Obtener todas las canciones
- `GET /api/songs/:id` - Obtener canción por ID
- `PUT /api/songs/:id` - Actualizar canción
- `DELETE /api/songs/:id` - Eliminar canción

#### Genres
- `POST /api/genres/create` - Crear género
- `GET /api/genres` - Obtener todos los géneros
- `GET /api/genres/:id` - Obtener género por ID
- `PUT /api/genres/:id` - Actualizar género
- `DELETE /api/genres/:id` - Eliminar género

#### Album Genres
- `POST /api/album-genres/add` - Agregar género a álbum
- `DELETE /api/album-genres/remove` - Eliminar género de álbum

#### Members (Band Members)
- `POST /api/members` - Crear miembro
- `GET /api/members` - Obtener todos los miembros
- `GET /api/members/:id` - Obtener miembro por ID
- `GET /api/members/artist/:artist_id` - Obtener miembros por artista
- `PUT /api/members/:id` - Actualizar miembro
- `DELETE /api/members/:id` - Eliminar miembro

#### Compositores (Song Composers)
- `POST /api/compositors` - Crear compositor
- `GET /api/compositors` - Obtener todos los compositores
- `GET /api/compositors/:id` - Obtener compositor por ID
- `GET /api/compositors/song/:song_id` - Obtener compositores por canción
- `PUT /api/compositors/:id` - Actualizar compositor
- `DELETE /api/compositors/:id` - Eliminar compositor

### 🎧 Playlists & User Content
#### Playlists
- `POST /api/playlists/create` - Crear playlist
- `GET /api/playlists` - Obtener todas las playlists
- `GET /api/playlists/:id` - Obtener playlist por ID
- `PUT /api/playlists/:id` - Actualizar playlist
- `DELETE /api/playlists/:id` - Eliminar playlist

#### Playlist Songs
- `POST /api/playlists/:playlistId/add-song` - Agregar canción a playlist
- `DELETE /api/playlists/:playlistId/remove-song/:songId` - Eliminar canción de playlist
- `GET /api/playlists/:playlistId/songs` - Obtener canciones de playlist

#### Favorites
- `POST /api/favorites/add` - Agregar a favoritos
- `DELETE /api/favorites/remove` - Eliminar de favoritos
- `GET /api/favorites/user/:userId` - Obtener favoritos de usuario

#### Comments
- `POST /api/comments/create` - Crear comentario
- `GET /api/comments` - Obtener todos los comentarios
- `GET /api/comments/:id` - Obtener comentario por ID
- `DELETE /api/comments/:id` - Eliminar comentario

### 🎫 Ticket System
#### Tickets
- `POST /api/tickets` - Crear ticket
- `GET /api/tickets` - Obtener todos los tickets (con filtros y paginación)
- `GET /api/tickets/:id` - Obtener ticket por ID con mensajes y adjuntos
- `PUT /api/tickets/:id` - Actualizar ticket
- `DELETE /api/tickets/:id` - Eliminar ticket
- `GET /api/tickets/categories` - Obtener categorías activas
- `GET /api/tickets/user/:userId` - Obtener tickets de un usuario
- `GET /api/tickets/stats` - Obtener estadísticas de tickets

#### Ticket Messages
- `POST /api/tickets/:ticket_id/messages` - Crear mensaje
- `GET /api/tickets/:ticket_id/messages` - Obtener mensajes de un ticket
- `PUT /api/ticket-messages/:id` - Actualizar mensaje
- `DELETE /api/ticket-messages/:id` - Eliminar mensaje
- `POST /api/tickets/:ticket_id/messages/mark-read` - Marcar mensajes como leídos
- `GET /api/tickets/:ticket_id/internal-notes` - Obtener notas internas
- `POST /api/tickets/:ticket_id/internal-notes` - Agregar nota interna

### 👤 User Management
#### Authentication
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse

#### Users
- `GET /api/users/me` - Obtener perfil del usuario actual
- `PUT /api/users/me` - Actualizar perfil del usuario
- `DELETE /api/users/me` - Eliminar cuenta del usuario
- `PUT /api/users/change-password` - Cambiar contraseña

#### Notifications
- `GET /api/notifications` - Obtener notificaciones del usuario
- `PUT /api/notifications/:id/read` - Marcar notificación como leída
- `DELETE /api/notifications/:id` - Eliminar notificación

### 📊 Playback & Analytics
#### Playback Logs
- `POST /api/playback/logs` - Registrar reproducción
- `GET /api/playback/logs` - Obtener logs de reproducción del usuario
- `GET /api/playback/logs/user/:userId` - Obtener logs de reproducción por usuario

### 🗂️ File Management
#### Supabase Storage
- `POST /api/supabase/upload` - Subir archivo a Supabase
- `GET /api/supabase/url/:filename` - Obtener URL de archivo

### 🔧 System & Debug
#### Debug
- `GET /api/debug/db-status` - Verificar estado de base de datos
- `GET /api/debug/models` - Listar modelos disponibles
- `GET /api/debug/routes` - Listar rutas disponibles

## Características del Sistema de Tickets

### 🎯 Funcionalidades Principales:
- **Gestión completa de tickets** con estados y prioridades
- **Sistema de categorías** configurable con colores e iconos
- **Mensajes en tiempo real** con soporte para notas internas
- **Archivos adjuntos** con control de acceso y descargas
- **Asignación de tickets** a usuarios específicos
- **Búsqueda y filtrado** avanzado
- **Estadísticas y reportes** en tiempo real
- **Numeración automática** de tickets (TK-YYYYMMDD-####)

### 🔧 Características Técnicas:
- **Relaciones completas** entre todas las entidades
- **Índices optimizados** para rendimiento
- **Validaciones de datos** a nivel de modelo
- **Timestamps automáticos** para auditoría
- **Soft deletes** donde es aplicable
- **Cascading deletes** para integridad referencial
