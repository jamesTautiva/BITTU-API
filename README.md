# BITU API

BITU API is the backend service for the BITU music streaming platform. It provides a RESTful API for managing users, artists, albums, songs, playlists, and more.

## Vision

BITU aims to provide a seamless and engaging music streaming experience. This API serves as the core engine, handling data persistence, authentication, and business logic to support client applications (web and mobile).

## Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Sequelize
-   **Storage**: Supabase Storage (for images and audio)
-   **Authentication**: JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   PostgreSQL
-   Supabase Account (for storage)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd BITU-API
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    DATABASE_URL=postgres://user:password@localhost:5432/bitu_db
    JWT_SECRET=your_jwt_secret
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_KEY=your_supabase_service_role_key
    ```

4.  Run database migrations:
    ```bash
    npx sequelize-cli db:migrate
    ```

5.  Start the server:
    ```bash
    npm start
    ```
    For development with auto-reload:
    ```bash
    npm run dev
    ```

## Scripts

-   `npm start`: Starts the production server.
-   `npm run dev`: Starts the development server with Nodemon.
-   `npm test`: Runs tests using Jest.
-   `npm run generate:diagram`: Generates a database diagram using Mermaid CLI.

## Roadmap

-   [ ] Implement real-time notifications with WebSockets.
-   [ ] Add OAuth2 social login (Google, Facebook).
-   [ ] Improve search functionality with full-text search.
-   [ ] Implement music recommendation algorithm.
-   [ ] Add lyrics support.

## License

ISC
