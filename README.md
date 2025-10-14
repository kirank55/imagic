# 🎨 himagic - Intelligent Image Optimization Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-Cloud-red?style=for-the-badge&logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare" alt="Cloudflare R2" />
</div>

<div align="center">
  <h3>🚀 Modern image optimization platform with powerful APIs and user-friendly interface</h3>
  <p>Built for developers and businesses who care about performance and user experience</p>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Installation](#️-installation)
- [⚙️ Configuration](#️-configuration)
- [🏃‍♂️ Running the Project](#️-running-the-project)
- [📁 Project Structure](#-project-structure)
- [🔧 API Documentation](#-api-documentation)
- [🖼️ Image Optimization Features](#️-image-optimization-features)
- [👤 User Management](#-user-management)
- [📄 License](#-license)

## ✨ Features

### 🎯 Core Features

- **🖼️ Real-time Image Optimization**: Transform and optimize images instantly with high-performance processing
- **📱 Modern Format Support**: Automatic conversion to AVIF, WebP, JPEG, PNG and other formats
- **⚡ Performance-First**: Built with speed and efficiency using Sharp.js and Redis caching
- **🌐 RESTful API**: Clean, documented API endpoints for seamless integration
- **👥 User Management**: Complete authentication system with secure session handling
- **📚 Image Gallery**: Upload, manage, and organize your optimized images with ease
- **☁️ Cloud Storage**: Reliable image storage with Cloudflare R2 integration
- **🎛️ Compression Control**: Adjustable quality settings for optimal file size vs quality balance

### 🔧 Technical Features

- **📦 Monorepo Architecture**: Organized with Turborepo for efficient development and scaling
- **🔒 Type Safety**: Full TypeScript implementation across the entire codebase
- **⚛️ Modern React Stack**: Next.js 15 with App Router, React 19, and server components
- **🗄️ Robust Database**: MongoDB with Mongoose ODM for data persistence
- **⚡ Redis Caching**: Session management and performance optimization
- **🎨 Modern UI**: Tailwind CSS with responsive design and FontAwesome icons
- **🔄 Hot Reload**: Development environment with Turbopack for fast iterations

## 🏗️ Architecture

The himagic platform follows a modern monorepo architecture designed for scalability and maintainability:

```
himagic/
├── apps/
│   ├── web/              # Next.js Frontend Application
│   │   ├── app/          # App Router pages and API routes
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and configurations
│   │   └── types/        # TypeScript type definitions
│   └── api/              # Express.js API Server
│       ├── routes/       # API route handlers
│       └── server.ts     # Main server file
├── packages/
│   ├── ui/               # Shared UI component library
│   ├── eslint-config/    # ESLint configurations
│   └── typescript-config/ # TypeScript configurations
└── md/                   # Documentation and guides
```

### 🛠️ Tech Stack

**Frontend (Web Application)**

- **Framework**: Next.js 15.3.0 with App Router and React 19
- **Styling**: Tailwind CSS 4.1.11 with CSS Modules
- **UI Components**: FontAwesome icons, custom component library
- **Authentication**: Custom session-based auth with secure cookie handling
- **State Management**: React hooks, Context API, and custom providers
- **Image Processing**: Client-side compression with Jimp library

**Backend (API Server)**

- **Runtime**: Node.js 18+ with Express.js framework
- **Image Processing**: Sharp.js for high-performance transformations
- **Storage**: Cloudflare R2 (S3-compatible) with AWS SDK v3
- **Database**: MongoDB Atlas with Mongoose ODM
- **Caching**: Redis (Upstash/IORedis) for sessions and performance
- **Security**: bcryptjs for password hashing, UUID for session management

**Development & DevOps**

- **Monorepo Management**: Turborepo with optimized caching
- **Package Manager**: pnpm for efficient dependency management
- **Code Quality**: ESLint, Prettier, and TypeScript strict mode
- **Build Tools**: Native ES modules, TypeScript compilation
- **Development**: Hot reload with Turbopack integration

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed and configured:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **pnpm** package manager (`npm install -g pnpm`)
- **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Redis** instance (local or [Upstash Redis](https://upstash.com/))
- **Cloudflare R2** bucket ([Setup Guide](https://developers.cloudflare.com/r2/))

### 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kirank55/imagic.git
   cd imagic
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   Create `.env.local` in the `apps/web` directory:

   ```env
   # Database
   MONGODB_URI=mongodb+srv://your-cluster/himagic

   # Redis (Session Storage)
   UPSTASH_REDIS_REST_URL=https://your-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-redis-token

   # Cloudflare R2 Storage
   R2_ACCOUNT_ID=your-account-id
   R2_ACCESS_KEY_ID=your-access-key
   R2_SECRET_ACCESS_KEY=your-secret-key
   R2_BUCKET_NAME=your-bucket-name
   R2_PUBLIC_URL=https://your-public-url

   # App Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000
   SESSION_SECRET=your-session-secret
   ```

4. **Database Setup**
   ```bash
   # The application will automatically create necessary collections
   # No manual database setup required
   ```

### 🏃‍♂️ Running the Project

**Development Mode**

```bash
# Start all applications in development mode
pnpm dev

# Or start individual applications
pnpm --filter web dev    # Frontend only (port 3000)
pnpm --filter api dev    # API server only
```

**Production Build**

```bash
# Build all applications
pnpm build

# Start production server
pnpm --filter web start
```

**Available Commands**

```bash
pnpm dev          # Start development servers
pnpm build        # Build all applications
pnpm lint         # Run ESLint across all packages
pnpm format       # Format code with Prettier
pnpm check-types  # Type checking across all packages
```

## 📁 Project Structure

### Applications

**`apps/web` - Frontend Application**

```
web/
├── app/
│   ├── api/              # API route handlers
│   │   ├── compress/     # Image compression endpoint
│   │   ├── images/       # Image management APIs
│   │   ├── login/        # Authentication endpoints
│   │   ├── profile/      # User profile APIs
│   │   └── upload-to-r2/ # R2 upload handlers
│   ├── login/            # Authentication pages
│   ├── profile/          # User dashboard
│   ├── signup/           # Registration pages
│   └── tools/            # Image tools and utilities
├── components/           # React components
│   ├── layouts/          # Layout components
│   └── ui/              # Reusable UI components
├── lib/                 # Utilities and configurations
└── types/               # TypeScript definitions
```

**`apps/api` - Backend API Server**

```
api/
├── routes/              # Express route handlers
│   └── optimize.ts      # Image optimization routes
└── server.ts           # Main Express server
```

### Shared Packages

**`packages/ui` - Component Library**

- Shared React components
- Common UI patterns and utilities
- Reusable across applications

**`packages/eslint-config` - Code Quality**

- ESLint configurations for Next.js and React
- Consistent code style across the monorepo

**`packages/typescript-config` - TypeScript Setup**

- Base TypeScript configurations
- Optimized for Next.js and React development

## 🔧 API Documentation

### Image Compression API

**POST** `/api/compress`

- **Purpose**: Compress images with quality control
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `image` (file): Image file to compress
  - `quality` (number): Compression quality (1-100, default: 80)

```javascript
const formData = new FormData();
formData.append("image", file);
formData.append("quality", "80");

const response = await fetch("/api/compress", {
  method: "POST",
  body: formData,
});
```

### User Management APIs

**POST** `/api/signup`

- **Purpose**: User registration
- **Body**: `{ email, password, confirmPassword }`

**POST** `/api/login`

- **Purpose**: User authentication
- **Body**: `{ email, password }`

**GET** `/api/profile`

- **Purpose**: Get user profile and session info

**POST** `/api/logout`

- **Purpose**: End user session

### Image Management APIs

**GET** `/api/my-images`

- **Purpose**: Retrieve user's uploaded images
- **Authentication**: Required

**POST** `/api/upload-to-r2`

- **Purpose**: Upload images to Cloudflare R2 storage
- **Content-Type**: `multipart/form-data`
- **Authentication**: Required

## 🖼️ Image Optimization Features

### Supported Operations

1. **Format Conversion**

   - JPEG, PNG, WebP, AVIF support
   - Automatic format detection
   - Optimal format recommendations

2. **Compression**

   - Quality-based compression (1-100 scale)
   - Smart compression algorithms
   - File size optimization

3. **Processing**
   - High-performance Sharp.js engine
   - Client-side preview with Jimp
   - Batch processing capabilities

### Usage Examples

**Basic Compression**

```typescript
import { Jimp } from "jimp";

const image = await Jimp.read(buffer);
const compressed = await image.getBuffer("image/jpeg", {
  quality: 80,
});
```

**R2 Upload with Processing**

```typescript
const uploadResponse = await fetch("/api/upload-to-r2", {
  method: "POST",
  body: formData,
});
```

## 👤 User Management

### Authentication System

- **Session-based Authentication**: Secure session handling with Redis storage
- **Password Security**: bcryptjs hashing with salt rounds
- **Session Management**: Automatic session cleanup and expiration
- **User Profiles**: Comprehensive user data and image management

### User Features

- **Registration**: Email-based account creation with validation
- **Login/Logout**: Secure authentication flow with session persistence
- **Profile Management**: View and manage account information
- **Image Gallery**: Personal image library with upload history
- **Dashboard**: Centralized user interface for all features

### Security Features

- **Password Hashing**: Industry-standard bcryptjs implementation
- **Session Tokens**: UUID-based session identification
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Input Validation**: Zod schema validation for all inputs

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by the himagic team</p>
  <p>
    <a href="#-table-of-contents">Back to top</a>
  </p>
</div>
```
