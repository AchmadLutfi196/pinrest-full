# Pinrest Client (Frontend)

Pinterest-like application frontend built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Backend API running at `http://localhost:3000`

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode (with hot-reload)
npm run dev
```

The application will be available at: `http://localhost:5173`

> **Note**: Make sure the backend API (`pinrest`) is running at `http://localhost:3000` before starting the frontend.

## Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## Project Structure

```
pinrest-client/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # Reusable components
│   │   └── Layout/      # Layout components (Header, MainLayout)
│   ├── context/         # React context providers
│   │   └── AuthContext.tsx
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── CreatePin.tsx
│   │   ├── PinDetail.tsx
│   │   └── Profile.tsx
│   ├── services/        # API service modules
│   │   ├── api.ts       # Axios instance
│   │   ├── authService.ts
│   │   ├── pinService.ts
│   │   ├── boardService.ts
│   │   └── userService.ts
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json
```

## Features

- 🔐 User authentication (Login/Register)
- 🖼️ View and create pins
- 📁 Organize pins into boards
- 👤 User profiles
- 🔍 Browse pins by category
- 💾 Save pins to boards

## Environment Configuration

The API base URL is configured in `src/services/api.ts`. Update this if your backend runs on a different port:

```typescript
const api = axios.create({
  baseURL: "http://localhost:3000", // Change if needed
});
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory.

## License

This project is private.
