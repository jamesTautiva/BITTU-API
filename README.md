# BITTU - Ecosystem API

Backend robusto, altamente escalable y seguro diseñado para servir como el motor central de datos y servicios para todo el ecosistema BITTU (Management Cloud, Artist Portal y Aplicaciones Móviles). 

Esta infraestructura API RESTful gestiona la capa de persistencia, la autenticación unificada, la lógica de negocio multitenant, el procesamiento de archivos multimedia y la orquestación de servicios en tiempo real.

---

## Tabla de Contenidos

1. [Descripción General y Propósito](#descripción-general-y-propósito)
2. [Arquitectura del Server & Backend](#arquitectura-del-server--backend)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Módulos y Funcionalidades Específicas del Backend](#módulos-y-funcionalidades-específicas-del-backend)
5. [Flujos de Procesamiento de Datos](#flujos-de-procesamiento-de-datos)
6. [Seguridad y Políticas de Red](#seguridad-y-políticas-de-red)
7. [Stack Tecnológico](#stack-tecnológico)
8. [Configuración y Despliegue](#configuración-y-despliegue)
9. [Variables de Entorno](#variables-de-entorno)

---

## Descripción General y Propósito

**BITTU Ecosystem API** funciona como la única fuente de verdad (*Single Source of Truth*) para todas las plataformas clientes integradas. Su principal objetivo es desacoplar la lógica de negocio pesada, la gestión de bases de datos y la seguridad de las interfaces de usuario.

El servidor maneja peticiones asíncronas de alto tráfico, garantizando integridad referencial en las bases de datos, validación estricta de esquemas de entrada y tiempos de respuesta optimizados mediante técnicas de indexación y almacenamiento en caché.

---

## Arquitectura del Server & Backend

El backend se estructura siguiendo el patrón arquitectónico en capas (**Controller-Service-Repository / MVC**), lo que facilita el mantenimiento, la escalabilidad horizontal y las pruebas unitarias:

* **Capa de Enrutamiento y Controladores:** Recibe las solicitudes HTTP, aplica middleware de validación y delega la ejecución a la capa de servicio.
* **Capa de Servicios (Lógica de Negocio):** Procesa reglas complejas, cálculos de métricas, orquestación de transacciones y llamadas a servicios de terceros.
* **Capa de Persistencia y Modelado:** Interactúa directamente con bases de datos (SQL / NoSQL) mediante ORM/ODM, asegurando consultas eficientes y mapeo de datos.
* **Middleware Layer:** Gestiona la autenticación, autorización, limitación de tasa de peticiones (*Rate Limiting*), compresión y manejo centralizado de excepciones.

---

## Estructura del Proyecto

```
bittu-api/
├── src/
│   ├── config/             # Configuración de base de datos, CORS, JWT y variables
│   ├── controllers/        # Controladores de solicitudes HTTP por módulo
│   ├── middlewares/        # Middlewares de autenticación, roles, CORS y validaciones
│   ├── models/             # Esquemas y modelos de datos (Bases de datos)
│   ├── routes/             # Definición y versión de endpoints REST (/api/v1/...)
│   ├── services/           # Lógica de negocio, integración con Cloud Storage y utilidades
│   ├── utils/              # Funciones helper, formateadores de respuesta y logger
│   └── app.js              # Inicialización de la aplicación Express / Node.js
├── tests/                  # Pruebas unitarias e integración
├── .env.example            # Variables de entorno requeridas
├── package.json            # Scripts del servidor y dependencias
└── server.js               # Punto de entrada y arranque del servidor HTTP/HTTPS
```

---

## Módulos y Funcionalidades Específicas del Backend

### 1. Sistema de Autenticación, Sesiones y Seguridad (Auth Module)
* **Emisión y Verificación JWT:** Creación de Tokens de Acceso de corta duración y Refresh Tokens seguros para mantener sesiones persistentemente autenticadas.
* **Encriptación de Credenciales:** Hashing robusto de contraseñas utilizando algoritmos como Bcrypt con Salt configurable.
* **Control de Acceso Basado en Roles (RBAC):** Restricción de endpoints según los permisos del usuario (`SuperAdmin`, `Artist`, `StandardUser`, `Manager`).
* **Saneamiento de Entradas:** Prevención activa contra inyecciones SQL, NoSQL Injection y scripts maliciosos (XSS).

### 2. Gestión de Usuarios y Perfiles Artísticos (Users & Artists Module)
* **CRUD Avanzado de Usuarios:** Registro, actualización de perfil, suspensión de cuentas y recuperación de contraseña vía correo electrónico.
* **Sincronización Multidispositivo:** Mantenimiento de preferencias, listas y estados de usuario en tiempo real.
* **Perfiles de Artista:** Gestión de datos de verificación, biografías, enlaces sociales y vinculación con catálogos discográficos.

### 3. Motor de Catálogo Digital y Procesamiento Multimedia (Media Module)
* **Procesamiento de Archivos de Audio:** Recepción, validación de formatos (WAV, MP3, FLAC) y preparación de metadatos de pistas musicales.
* **Integración con Almacenamiento en la Nube:** Subida directa y generación de URLs firmadas/temporales para proveedores como Amazon S3, Cloudinary o Google Cloud Storage.
* **Estructuración de Lanzamientos:** Gestión de relaciones entre Álbumes, Singles, EPs, listas de reproducción y créditos de producción.

### 4. Motor de Analítica, Métricas y Auditoría (Analytics & Audit Module)
* **Recolección de Eventos:** Registro automático de reproducciones, descargas y navegación de usuarios.
* **Generación de Métricas:** Agregación de datos en tiempo real para suministrar gráficos estadísticos a la plataforma *BITTU Management Cloud*.
* **Auditoría de Acciones (Audit Logs):** Trazabilidad completa de operaciones administrativas (creación, edición o eliminación de registros críticos).

### 5. Gestión de Notificaciones y Comunicaciones (Services Module)
* **Envío de Correos Transaccionales:** Confirmación de registro, restablecimiento de contraseña y alertas del sistema mediante SMTP / Mailgun / SendGrid.
* **Sincronización Webhooks:** Capacidad para notificar eventos a aplicaciones cliente en tiempo real.

---

## Flujos de Procesamiento de Datos

### Flujo de Petición Autenticada y Respuesta
```
[ Cliente (Cloud / Mobile / Portal) ]
               │
               ▼  (HTTP Request + Bearer Token)
[ Middleware Rate Limit & CORS ]
               │
               ▼
[ Middleware Autenticación JWT ] ──► (Valida firma y expiración)
               │
               ▼
[ Middleware de Roles (RBAC) ] ──► (Verifica permisos del endpoint)
               │
               ▼
[ Controlador del Endpoint ]
               │
               ▼
[ Capa de Servicio ] ──► (Aplica reglas de negocio / Transacciones)
               │
               ▼
[ Capa de Datos / Base de Datos ] ──► (Consulta optimizada SQL/NoSQL)
               │
               ▼
[ Formateador de Respuesta Standard ] ──► (JSON 200 OK / 201 Created)
```

### Flujo de Carga de Activo Multimedia
```
[ Cliente ] ──► Envía FormData (Archivo + Metadatos)
     │
     ▼
[ Multer / Stream Middleware ] ──► Validaciones de peso y MIME Type
     │
     ▼
[ Service Storage Layer ] ──► Transfiere buffer a Cloud Storage
     │
     ▼
[ Base de Datos ] ──► Guarda referencia URL, Hash y Metadatos
     │
     ▼
[ Respuesta HTTP ] ──► Devuelve objeto JSON formateado del activo
```

---

## Seguridad y Políticas de Red

* **CORS Configurado:** Restricción explícita de orígenes permitidos (dominios de Management Cloud, Artist Portal y App Móvil).
* **Cabeceras HTTP Seguras:** Implementación de Helmet para ocultar detalles del servidor y proteger contra ataques comunes.
* **Rate Limiting:** Prevención de ataques de denegación de servicio (DDoS) y fuerza bruta limitando peticiones por IP en ventanas de tiempo.
* **Manejo Centralizado de Errores:** Evita la fuga de información sensible enviando respuestas de error estructuradas según el entorno (`development` vs `production`).

---

## Stack Tecnológico

* **Entorno de Ejecución:** Node.js (V8 JavaScript Engine).
* **Framework Web:** Express.js.
* **Bases de Datos:** PostgreSQL / MySQL (Relacional) o MongoDB (NoSQL) con ORM/ODM (Sequelize / Prisma / Mongoose).
* **Autenticación:** JSON Web Tokens (`jsonwebtoken`) y `bcryptjs`.
* **Manejo de Archivos:** `multer` e integraciones SDK para servicios de almacenamiento cloud.
* **Documentación de API:** Swagger / Open API 3.0 para especificación interactiva de endpoints.

---

## Configuración y Despliegue

### Requisitos Previos

* **Node.js:** Versión 18.0.0 LTS o superior.
* **Base de Datos:** Instancia local o remota de PostgreSQL/MongoDB según corresponda.
* **NPM / Yarn:** Gestor de paquetes actualizado.

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jamesTautiva/BITTU-API.git
   cd BITTU-API
   ```

2. **Instalar dependencias del servidor:**
   ```bash
   npm install
   ```

3. **Configurar el entorno:**
   ```bash
   cp .env.example .env
   ```

4. **Ejecutar migraciones / semillero de datos (si aplica):**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   El backend iniciará en `http://localhost:5000` (o el puerto configurado en el archivo `.env`).

---

## Variables de Entorno

Asegúrese de definir los siguientes parámetros dentro de su archivo `.env`:

| Variable | Descripción | Valor Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto de escucha del servidor | `5000` |
| `NODE_ENV` | Entorno de ejecución (`development`, `production`) | `development` |
| `DB_URI` | Cadena de conexión a la base de datos | `postgresql://user:pass@localhost:5432/bittu_db` |
| `JWT_SECRET` | Clave secreta para firmar Tokens de Acceso | `super_secret_key_bittu_2026` |
| `JWT_EXPIRES_IN` | Tiempo de validez del Token de Acceso | `1d` |
| `CLOUD_STORAGE_KEY` | Clave de acceso para almacenamiento en la nube | `AKIAIOSFODNN7EXAMPLE` |
| `CORS_ORIGIN` | Dominios permitidos separados por comas | `https://cloud.bittu.com,https://artist.bittu.com` |
