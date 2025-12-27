# Documentación del Proyecto BITU API

## 1. Visión General

**Problema que resuelve:**
BITU API resuelve la necesidad de un backend robusto y escalable para una plataforma de streaming de música. Gestiona la complejidad de las relaciones entre artistas, álbumes y canciones, así como la seguridad de los usuarios y la persistencia de datos.

**Para quién es:**
Este sistema está diseñado para desarrolladores frontend que construyen clientes web o móviles para BITU, así como para administradores de contenido que necesitan gestionar el catálogo musical.

**Tipo de Sistema:**
Es una API RESTful construida con arquitectura MVC (Modelo-Vista-Controlador) sobre Node.js.

## 2. Stack Tecnológico

-   **Lenguaje:** JavaScript (Node.js)
-   **Framework Web:** Express.js v5.2.1
-   **Base de Datos:** PostgreSQL
-   **ORM:** Sequelize v6.37.7
-   **Autenticación:** JSON Web Tokens (JWT) con `jsonwebtoken` y `bcryptjs`
-   **Almacenamiento de Archivos:** Supabase Storage
-   **Testing:** Jest, Supertest
-   **Utilidades:** Dotenv, Cors, Multer, Nodemon

## 3. Arquitectura del Proyecto

El proyecto sigue una arquitectura **MVC (Modelo-Vista-Controlador)** adaptada para una API:

-   **Modelos (`src/models`):** Definen la estructura de la base de datos y las relaciones usando Sequelize.
-   **Controladores (`src/controllers`):** Contienen la lógica de negocio y manejan las peticiones HTTP.
-   **Rutas (`src/routes`):** Definen los endpoints y mapean las URLs a los controladores correspondientes.
-   **Middleware (`src/middleware`):** Funciones que se ejecutan antes de los controladores (ej. autenticación, manejo de errores).

## 4. Estructura de Carpetas

```
BITU-API/
├── config/             # Configuración de base de datos
├── docs/               # Documentación y diagramas
├── migrations/         # Migraciones de base de datos (Sequelize)
├── seeders/            # Datos semilla para la base de datos
├── src/
│   ├── controllers/    # Lógica de negocio
│   ├── middleware/     # Middlewares (Auth, Error, Upload)
│   ├── models/         # Definiciones de modelos Sequelize
│   ├── routes/         # Definiciones de rutas API
│   ├── utils/          # Utilidades (JWT, Cliente Supabase)
│   ├── views/          # Vistas EJS (si aplica)
│   ├── app.js          # Configuración de Express
│   └── server.js       # Punto de entrada del servidor
├── tests/              # Tests unitarios e integración
├── .env                # Variables de entorno
├── package.json        # Dependencias y scripts
└── README.md           # Información general
```

## 5. Configuración del Entorno (.env)

El archivo `.env` debe contener las siguientes variables:

```env
PORT=3000
DATABASE_URL=postgres://usuario:password@host:5432/nombre_db
JWT_SECRET=secreto_para_firmar_tokens
SUPABASE_URL=url_de_tu_proyecto_supabase
SUPABASE_KEY=clave_anonima_supabase
SUPABASE_SERVICE_KEY=clave_service_role_supabase
SUPABASE_SETUP_SECRET=secreto_para_setup_inicial
NODE_ENV=development
```

## 6. Modelo de Base de Datos

El modelo de datos es relacional y gestionado por Sequelize.

**Entidades Principales:**
-   **User:** Usuarios de la plataforma (Listeners y Artists).
-   **Artist:** Perfil de artista asociado a un usuario.
-   **Album:** Colecciones de canciones.
-   **Song:** Pistas de audio individuales.
-   **Playlist:** Listas de reproducción creadas por usuarios.
-   **Genre:** Géneros musicales.

**Relaciones Clave:**
-   `User` 1:1 `Artist`
-   `Artist` 1:N `Album`
-   `Album` 1:N `Song`
-   `User` 1:N `Playlist`
-   `Playlist` N:M `Song` (Tabla pivote `PlaylistSong`)
-   `User` N:M `Song` (Tabla pivote `Favorite`)

## 7. Autenticación y Autorización

**Funcionamiento:**
Se utiliza **JWT (JSON Web Tokens)**.
1.  El usuario se loguea con email y contraseña.
2.  El servidor valida credenciales y retorna un `token`.
3.  El cliente debe enviar este token en el header `Authorization` de cada petición protegida.

**Formato del Header:**
```
Authorization: Bearer <token_jwt>
```

**Roles:**
-   `user`: Usuario estándar (puede escuchar música, crear playlists).
-   `admin`: Administrador del sistema.
-   (Implícito) `artist`: Usuario que tiene un perfil de artista asociado.

## 8. Endpoints Principales

### Auth
-   `POST /api/auth/register`: Registro de usuario.
    -   Body: `{ username, email, password }`
-   `POST /api/auth/login`: Inicio de sesión.
    -   Body: `{ email, password }`
    -   Resp: `{ user, token }`

### Users
-   `GET /api/users/profile`: Obtener perfil del usuario autenticado (Auth requerida).
-   `PUT /api/users/profile`: Actualizar perfil (Auth requerida).

### Artists
-   `GET /api/artists`: Listar artistas.
-   `POST /api/artists`: Crear perfil de artista (Auth requerida).
-   `GET /api/artists/:id`: Detalle de artista.

### Albums
-   `GET /api/albums`: Listar álbumes.
-   `POST /api/albums`: Crear álbum (Auth requerida, rol artista).

### Songs
-   `GET /api/songs`: Listar canciones.
-   `POST /api/songs`: Subir canción (Auth requerida, rol artista).

### Playlists
-   `POST /api/playlists`: Crear playlist (Auth requerida).
-   `POST /api/playlists/:id/songs`: Agregar canción a playlist.

## 9. Flujos del Sistema

**Flujo de Registro y Login:**
1.  Usuario envía `POST /auth/register`.
2.  Backend crea usuario en DB (password hasheado).
3.  Usuario envía `POST /auth/login`.
4.  Backend valida y devuelve JWT.
5.  Cliente guarda JWT para futuras peticiones.

**Flujo de Reproducción:**
1.  Usuario autenticado solicita `GET /songs/:id`.
2.  Backend devuelve URL del archivo de audio (alojado en Supabase).
3.  Cliente reproduce el audio desde la URL.
4.  (Opcional) Se registra el evento en `PlaybackLog`.

**Flujo de Creación de Artista:**
1.  Usuario autenticado envía `POST /artists`.
2.  Backend verifica que el usuario no sea ya un artista.
3.  Se crea el registro en la tabla `Artists` vinculado al `user_id`.

## 10. Subida de Archivos (Supabase)

Se utiliza **Supabase Storage** para almacenar imágenes (avatares, portadas) y audio.

**Proceso:**
1.  El cliente envía el archivo (multipart/form-data) a un endpoint (ej. `POST /api/songs`).
2.  El middleware `upload.middleware.js` (usando Multer) intercepta el archivo.
3.  El controlador sube el archivo al bucket correspondiente en Supabase (`avatars`, `covers`, `songs`).
4.  Supabase devuelve una URL pública o firmada.
5.  El backend guarda esta URL en la base de datos (ej. campo `audio_url` en tabla `Songs`).

**Formatos y Tamaños:**
-   Imágenes: JPG, PNG (Max 5MB recomendado).
-   Audio: MP3, WAV (Max 20MB recomendado).

## 11. Manejo de Errores

El sistema utiliza un middleware centralizado (`src/middleware/error.middleware.js`).

**Estructura de Respuesta de Error:**
```json
{
  "error": "Mensaje descriptivo del error"
}
```

**Códigos HTTP Comunes:**
-   `200 OK`: Éxito.
-   `201 Created`: Recurso creado.
-   `400 Bad Request`: Datos inválidos.
-   `401 Unauthorized`: Token faltante o inválido.
-   `403 Forbidden`: Sin permisos para la acción.
-   `404 Not Found`: Recurso no encontrado.
-   `500 Internal Server Error`: Error del servidor.

## 12. Testing

Se utiliza **Jest** y **Supertest** para pruebas de integración.

**Ejemplo de Request (Test):**
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
```

## 13. Deployment (Render)

Para desplegar en **Render**:

1.  Conectar repositorio de GitHub a Render.
2.  Crear un **Web Service**.
3.  **Build Command:** `npm install`
4.  **Start Command:** `npm start`
5.  **Variables de Entorno:** Configurar todas las variables del `.env` en el panel de Render.
    -   Asegurarse de que `DATABASE_URL` apunte a la base de datos de producción (Render PostgreSQL o externa).
    -   Configurar `NODE_ENV` a `production`.
6.  **Migraciones:** Ejecutar `npx sequelize-cli db:migrate` como parte del build o manualmente desde la shell de Render.
7.  **SSL:** Render maneja SSL automáticamente.

## 14. Roadmap

-   [ ] **Fase 1:** Estabilización de API y documentación completa (Actual).
-   [ ] **Fase 2:** Implementación de WebSockets para notificaciones en tiempo real.
-   [ ] **Fase 3:** Integración de OAuth2 (Google/Facebook Login).
-   [ ] **Fase 4:** Sistema de recomendaciones basado en historial de reproducción.
-   [ ] **Fase 5:** Aplicación móvil nativa consumiendo esta API.
