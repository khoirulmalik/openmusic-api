# OpenMusic API v3

Submission project for **Belajar Fundamental Aplikasi Back-End** (Back-End Fundamental) class at Dicoding Indonesia. This OpenMusic API is built using Hapi.js with comprehensive features including authentication, file upload, caching, and message queue integration.

## Submission Criteria

This project fulfills all Dicoding Back-End Fundamental submission requirements across 3 versions:

### Version 1 ✅
- **Albums Management**: CRUD operations for albums
- **Songs Management**: CRUD operations for songs with album relationship
- **Data Validation**: Request payload validation using Joi
- **Error Handling**: Proper HTTP error responses
- **PostgreSQL Database**: Persistent data storage
- **Album Details**: Display songs list in album details

### Version 2 ✅
- **User Registration & Authentication**: JWT-based authentication system
- **Playlists Management**: Create and manage music playlists
- **Playlist Songs**: Add and remove songs from playlists
- **Authorization**: Owner-based access control for playlists
- **Database Normalization**: Many-to-many relationship implementation
- **Activities Logging**: Track playlist activities

### Version 3 ✅
- **Album Cover Upload**: Image upload with local storage
- **Album Likes**: Like/unlike album functionality
- **Server-Side Caching**: Redis caching for album likes
- **Message Queue**: RabbitMQ integration for playlist export
- **Playlist Export**: Asynchronous export to JSON via email
- **Consumer Service**: Separate consumer for processing queue messages

## Tech Stack

### Main API Server
- **Framework**: Hapi.js
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT (@hapi/jwt)
- **Caching**: Redis (node-redis)
- **Message Queue**: RabbitMQ (amqplib)
- **File Upload**: Hapi plugin for multipart/form-data
- **Validation**: Joi schema validation
- **ID Generator**: nanoid
- **Migration Tool**: node-pg-migrate

### Consumer Service
- **Runtime**: Node.js
- **Message Queue**: RabbitMQ (amqplib)
- **Email Service**: Nodemailer
- **Message Processing**: Asynchronous worker

## Project Structure

```
.
├── openmusic-api-v3/          # Main API Server
│   ├── src/
│   │   ├── api/               # HTTP Endpoints
│   │   │   ├── albums/        # Album management
│   │   │   ├── songs/         # Song management
│   │   │   ├── users/         # User registration
│   │   │   ├── auth/          # Authentication (login/logout)
│   │   │   ├── playlists/     # Playlist management
│   │   │   ├── likes/         # Album likes
│   │   │   ├── exports/       # Playlist export to queue
│   │   │   └── uploads/       # File upload handler
│   │   ├── services/
│   │   │   └── postgres/      # Database services
│   │   │       ├── AlbumsService.js
│   │   │       ├── SongsService.js
│   │   │       ├── UsersService.js
│   │   │       ├── AuthenticationsService.js
│   │   │       ├── PlaylistsService.js
│   │   │       ├── LikesService.js
│   │   │       └── CacheService.js (Redis)
│   │   │   ├── rabbitmq/      # Message queue
│   │   │   │   └── ProducerService.js
│   │   │   └── storage/       # File storage
│   │   │       └── StorageService.js
│   │   ├── validator/         # Joi schemas
│   │   ├── exceptions/        # Custom errors
│   │   ├── tokenize/          # JWT manager
│   │   ├── middleware/        # Auth middleware
│   │   └── server.js          # Server entry point
│   └── migrations/            # Database migrations
│
└── openmusic-consumer/        # Queue Consumer Service
    ├── src/
    │   └── consumer.js        # RabbitMQ consumer
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Redis Server
- RabbitMQ Server

### 1. Clone the repository
```bash
git clone <repository-url>
cd openmusic-api-v3
```

### 2. Install dependencies

**Main API:**
```bash
cd openmusic-api-v3
npm install
```

**Consumer Service:**
```bash
cd openmusic-consumer
npm install
```

### 3. Set up environment variables

**Main API (openmusic-api-v3/.env):**
```env
# Server Configuration
HOST=localhost
PORT=5000

# PostgreSQL Database
PGUSER=your_db_user
PGHOST=localhost
PGPASSWORD=your_db_password
PGDATABASE=openmusic
PGPORT=5432

# JWT Token
ACCESS_TOKEN_KEY=your_secret_access_token_key
REFRESH_TOKEN_KEY=your_secret_refresh_token_key
ACCESS_TOKEN_AGE=1800

# Redis Cache
REDIS_SERVER=localhost

# RabbitMQ
RABBITMQ_SERVER=amqp://localhost
```

**Consumer Service (openmusic-consumer/.env):**
```env
# RabbitMQ
RABBITMQ_SERVER=amqp://localhost

# Email Service (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ADDRESS=your_email@gmail.com
```

### 4. Create database
```bash
createdb openmusic
```

### 5. Run database migrations
```bash
cd openmusic-api-v3
npm run migrate up
```

### 6. Start Redis Server
```bash
redis-server
```

### 7. Start RabbitMQ Server
```bash
# On Linux/Mac
rabbitmq-server

# On Windows
rabbitmq-server.bat
```

## Running the Application

### Start Main API Server
```bash
cd openmusic-api-v3
npm run start
# or for development with auto-reload
npm run start:dev
```

The API will be available at `http://localhost:5000`

### Start Consumer Service
```bash
cd openmusic-consumer
npm run start
# or for development
npm run start:dev
```

## API Endpoints

### Authentication

#### Register User
```http
POST /users
Content-Type: application/json

{
  "username": "johndoe",
  "password": "secret123",
  "fullname": "John Doe"
}
```

#### Login
```http
POST /authentications
Content-Type: application/json

{
  "username": "johndoe",
  "password": "secret123"
}
```

#### Refresh Token
```http
PUT /authentications
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Logout
```http
DELETE /authentications
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Albums

#### Create Album
```http
POST /albums
Content-Type: application/json

{
  "name": "Album Title",
  "year": 2024
}
```

#### Get Album by ID
```http
GET /albums/{albumId}
```

#### Update Album
```http
PUT /albums/{albumId}
Content-Type: application/json

{
  "name": "Updated Album Title",
  "year": 2024
}
```

#### Delete Album
```http
DELETE /albums/{albumId}
```

#### Upload Album Cover
```http
POST /albums/{albumId}/covers
Content-Type: multipart/form-data
Authorization: Bearer {accessToken}

cover: [image file]
```

#### Like Album
```http
POST /albums/{albumId}/likes
Authorization: Bearer {accessToken}
```

#### Unlike Album
```http
DELETE /albums/{albumId}/likes
Authorization: Bearer {accessToken}
```

#### Get Album Likes Count
```http
GET /albums/{albumId}/likes
```
*Note: This endpoint uses Redis caching*

### Songs

#### Create Song
```http
POST /songs
Content-Type: application/json

{
  "title": "Song Title",
  "year": 2024,
  "genre": "Pop",
  "performer": "Artist Name",
  "duration": 240,
  "albumId": "album-xxx" // optional
}
```

#### Get All Songs
```http
GET /songs
GET /songs?title=search&performer=artist
```

#### Get Song by ID
```http
GET /songs/{songId}
```

#### Update Song
```http
PUT /songs/{songId}
Content-Type: application/json

{
  "title": "Updated Song Title",
  "year": 2024,
  "genre": "Rock",
  "performer": "Artist Name",
  "duration": 300
}
```

#### Delete Song
```http
DELETE /songs/{songId}
```

### Playlists

#### Create Playlist
```http
POST /playlists
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "My Favorite Songs"
}
```

#### Get User Playlists
```http
GET /playlists
Authorization: Bearer {accessToken}
```

#### Delete Playlist
```http
DELETE /playlists/{playlistId}
Authorization: Bearer {accessToken}
```

#### Add Song to Playlist
```http
POST /playlists/{playlistId}/songs
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "songId": "song-xxx"
}
```

#### Get Playlist Songs
```http
GET /playlists/{playlistId}/songs
Authorization: Bearer {accessToken}
```

#### Remove Song from Playlist
```http
DELETE /playlists/{playlistId}/songs
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "songId": "song-xxx"
}
```

#### Get Playlist Activities
```http
GET /playlists/{playlistId}/activities
Authorization: Bearer {accessToken}
```

### Exports

#### Export Playlist
```http
POST /export/playlists/{playlistId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "targetEmail": "user@example.com"
}
```
*Note: This endpoint sends message to RabbitMQ queue. The consumer service will process the export and send email asynchronously.*

## Database Schema

### Albums Table
```sql
- id (VARCHAR, PK)
- name (TEXT)
- year (INTEGER)
- cover_url (TEXT)
```

### Songs Table
```sql
- id (VARCHAR, PK)
- title (TEXT)
- year (INTEGER)
- genre (TEXT)
- performer (TEXT)
- duration (INTEGER)
- album_id (VARCHAR, FK -> albums.id)
```

### Users Table
```sql
- id (VARCHAR, PK)
- username (VARCHAR, UNIQUE)
- password (TEXT)
- fullname (TEXT)
```

### Authentications Table
```sql
- token (TEXT, PK)
```

### Playlists Table
```sql
- id (VARCHAR, PK)
- name (TEXT)
- owner (VARCHAR, FK -> users.id)
```

### Playlist Songs Table
```sql
- id (VARCHAR, PK)
- playlist_id (VARCHAR, FK -> playlists.id)
- song_id (VARCHAR, FK -> songs.id)
```

### Playlist Song Activities Table
```sql
- id (VARCHAR, PK)
- playlist_id (VARCHAR, FK -> playlists.id)
- song_id (VARCHAR, FK -> songs.id)
- user_id (VARCHAR, FK -> users.id)
- action (VARCHAR) -- 'add' or 'delete'
- time (TIMESTAMP)
```

### User Album Likes Table
```sql
- id (VARCHAR, PK)
- user_id (VARCHAR, FK -> users.id)
- album_id (VARCHAR, FK -> albums.id)
```

## Key Features Implementation

### 1. Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Token validation middleware
- Owner-based authorization for playlists

### 2. File Upload
- Album cover image upload
- Local file storage
- Image validation (size and format)
- Public URL generation

### 3. Caching Strategy
- Redis caching for album likes count
- Cache invalidation on like/unlike actions
- Response header indicating cache status

### 4. Message Queue (RabbitMQ)
- Producer service in main API
- Separate consumer service for processing
- Asynchronous playlist export
- Email notification with JSON attachment

### 5. Data Validation
- Joi schema validation for all endpoints
- Comprehensive error messages
- Type checking and constraints

### 6. Error Handling
Custom error classes:
- `ClientError` - Base for 4xx errors
- `InvariantError` - 400 Bad Request
- `AuthenticationError` - 401 Unauthorized
- `AuthorizationError` - 403 Forbidden
- `NotFoundError` - 404 Not Found

## Message Queue Flow

1. **Export Request**: User requests playlist export via API
2. **Producer**: API sends message to RabbitMQ queue
3. **Consumer**: Separate service consumes message from queue
4. **Processing**: Consumer fetches playlist data from database
5. **Email**: Consumer sends email with JSON attachment
6. **Completion**: User receives playlist data via email

## Caching Flow

1. **First Request**: Data fetched from PostgreSQL
2. **Cache Set**: Result stored in Redis with TTL
3. **Subsequent Requests**: Data served from Redis cache
4. **Cache Header**: Response includes `X-Data-Source: cache` header
5. **Cache Invalidation**: Cleared on like/unlike actions

## File Upload Flow

1. **Upload**: Client sends image via multipart/form-data
2. **Validation**: Check file type and size
3. **Storage**: Save to local `uploads/images/` directory
4. **Database**: Store file URL in albums table
5. **Response**: Return public URL to client

## Learning Outcomes

This project demonstrates proficiency in:
- ✅ RESTful API design and implementation
- ✅ JWT authentication & authorization
- ✅ Database design with relationships
- ✅ File upload and storage management
- ✅ Server-side caching with Redis
- ✅ Message queue implementation
- ✅ Asynchronous processing
- ✅ Email integration
- ✅ Microservices architecture (API + Consumer)
- ✅ Input validation and error handling
- ✅ Database migrations
- ✅ Environment configuration

## Security Best Practices

- Password hashing with bcrypt
- JWT token expiration
- Authorization checks for protected resources
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- File upload restrictions (type, size)

## Development Tools

- **ESLint**: Code quality and style enforcement
- **Nodemon**: Auto-reload during development
- **node-pg-migrate**: Database version control
- **Postman/Thunder Client**: API testing

## Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
pg_isready

# Verify credentials in .env file
```

**Redis Connection Error:**
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

**RabbitMQ Connection Error:**
```bash
# Check RabbitMQ status
rabbitmqctl status

# Verify RabbitMQ web interface
# http://localhost:15672 (guest/guest)
```

**Migration Errors:**
```bash
# Rollback last migration
npm run migrate down

# Re-run migration
npm run migrate up
```

## References

- [Dicoding - Belajar Fundamental Aplikasi Back-End](https://www.dicoding.com/academies/271)
- [Hapi.js Documentation](https://hapi.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)

## License

This project is created for educational purposes as part of Dicoding Indonesia's Back-End Fundamental class submission.

## Author

**Dicoding Student**  
Belajar Fundamental Aplikasi Back-End - Dicoding Indonesia

---

**Submission Date**: 2024  
**Class**: Belajar Fundamental Aplikasi Back-End  
**Platform**: [Dicoding Indonesia](https://www.dicoding.com/)  
**Submission Version**: 3 (Final)
