# Pinrest API (Backend)

Pinterest-like application backend built with NestJS, Prisma, and MySQL/MariaDB.

## Tech Stack

- **Framework**: NestJS
- **Database**: MySQL / MariaDB (Galera Cluster compatible)
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MySQL 8.0+ or MariaDB 10.5+

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

## Database Setup

### 1. Create Database and User

Connect to MySQL/MariaDB as root:

```bash
sudo mysql -p
```

Run the following SQL commands:

```sql
CREATE DATABASE pinrest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pinrest_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON pinrest_db.* TO 'pinrest_user'@'%';
FLUSH PRIVILEGES;
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://pinrest_user:your_password@localhost:3306/pinrest_db"
JWT_SECRET="your-super-secret-jwt-key"
```

**For Galera MariaDB Cluster:**

```env
DATABASE_URL="mysql://pinrest_user:your_password@galera-lb:3306/pinrest_db"
```

### 3. Push Schema to Database

```bash
npx prisma db push
```

## Running the Application

```bash
# Development mode (with hot-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3000`

## API Documentation

Swagger documentation is available at: `http://localhost:3000/docs`

## Available Scripts

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `npm run start`      | Start the application             |
| `npm run start:dev`  | Start in watch mode (development) |
| `npm run start:prod` | Start in production mode          |
| `npm run build`      | Build the application             |
| `npm run lint`       | Run ESLint                        |
| `npm run format`     | Format code with Prettier         |
| `npm run test`       | Run unit tests                    |
| `npm run test:e2e`   | Run end-to-end tests              |

## Prisma Commands

| Command                  | Description                 |
| ------------------------ | --------------------------- |
| `npx prisma generate`    | Generate Prisma Client      |
| `npx prisma db push`     | Push schema to database     |
| `npx prisma studio`      | Open Prisma Studio (GUI)    |
| `npx prisma migrate dev` | Create and apply migrations |

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Users

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update current user profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/pins` - Get user's pins

### Pins

- `GET /api/pins` - Get all pins
- `POST /api/pins` - Create a new pin
- `GET /api/pins/search` - Search pins
- `GET /api/pins/:id` - Get pin by ID
- `PATCH /api/pins/:id` - Update pin
- `DELETE /api/pins/:id` - Delete pin
- `POST /api/pins/:id/like` - Like/unlike pin
- `POST /api/pins/:id/save` - Save pin to board

### Boards

- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create a new board
- `GET /api/boards/:id` - Get board by ID
- `PATCH /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

## Project Structure

```
pinrest/
├── prisma/
│   └── schema.prisma    # Database schema (MySQL)
├── src/
│   ├── auth/            # Authentication module
│   ├── boards/          # Boards module
│   ├── pins/            # Pins module
│   ├── prisma/          # Prisma service
│   ├── users/           # Users module
│   ├── app.module.ts    # Main application module
│   └── main.ts          # Application entry point
├── uploads/             # Uploaded files directory
└── package.json
```

## Galera MariaDB Cluster Notes

For production with Galera cluster:

1. **InnoDB Required** - Prisma uses InnoDB by default ✓
2. **Primary Keys** - All tables have `@id` ✓
3. **Auto-increment** - Uses standard auto-increment ✓
4. **Connection** - Point to load balancer or any cluster node

## License

This project is private and unlicensed.
