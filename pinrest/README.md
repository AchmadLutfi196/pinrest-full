# Pinrest API (Backend)

Pinterest-like application backend built with NestJS, Prisma, and SQLite.

## Tech Stack

- **Framework**: NestJS
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations (optional - if starting fresh)
npx prisma db push
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
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

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users

- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user profile
- `GET /users/:id` - Get user by ID

### Pins

- `GET /pins` - Get all pins
- `POST /pins` - Create a new pin
- `GET /pins/:id` - Get pin by ID
- `PATCH /pins/:id` - Update pin
- `DELETE /pins/:id` - Delete pin

### Boards

- `GET /boards` - Get all boards
- `POST /boards` - Create a new board
- `GET /boards/:id` - Get board by ID
- `PATCH /boards/:id` - Update board
- `DELETE /boards/:id` - Delete board

## Project Structure

```
pinrest/
├── prisma/
│   └── schema.prisma    # Database schema
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

## License

This project is private and unlicensed.
