# 🎵 MSV2 Music Library

<div align="center">

![MSV2 Logo](https://img.shields.io/badge/MSV2-Music%20Library-blue)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, full-featured music library application with 3D visualization, AI-powered recommendations, and an intuitive interface.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-brightgreen)](https://msv2-music.vercel.app)
[![Documentation](https://img.shields.io/badge/Docs-API_Reference-blue)](https://docs.msv2-music.com)

</div>

## ✨ Features

### 🎵 **Music Library Management**

- **Browse & Discover**: Intuitive navigation through artists, albums, and tracks
- **Natural Language Queries**: Browse library with prompts !
- **Personal Library**: Save favorites, create playlists, build collections
- **3D Visualization**: Explore your music in interactive 3D space
- **AI Recommendations**: Personalized track suggestions

### 🎨 **Modern UI/UX**

- **Responsive Design**: Beautiful interface across all devices
- **Multiple Themes**: Dark, Light, Nord, Obsidian, and Vaporwave themes
- **Real-time Updates**: Live updates for playlists and favorites

### 🚀 **Key Features**

- **JWT Authentication**: Secure login with refresh tokens
- **Built-in Audio Player**: Full-featured music player with playlist support
- **Smart Recommendations**: AI-powered track suggestions
- **3D Music Explorer**: Visualize your library in 3D space
- **Playlist Management**: Create, edit, and share playlists
- **Favorites System**: Save and organize favorite tracks

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **3D Visualization**: Three.js + React Three Fiber
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v7
- **Build Tool**: Vite

### Backend Stack

- **API**: FastAPI (Python) with async PostgreSQL
- **Database**: PostgreSQL with pgvector for embeddings
- **Storage**: MinIO for audio file storage
- **Authentication**: JWT with refresh tokens
- **Deployment**: Docker + Kubernetes ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+ (for backend)
- PostgreSQL 14+
- Docker (optional)

### Installation

1. **Clone and install:**

```bash
git clone https://github.com/yourusername/msv2-music.git
cd msv2-music
npm install
```

```
http://localhost:5173
```

## 📁 Project Structure

```
msv2-music/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-based components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API clients & utilities
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript definitions
│   └── public/            # Static assets
├── backend/                # FastAPI backend
│   ├── api/               # API endpoints
│   ├── core/              # Core functionality
│   ├── models/            # Database models
│   └── services/          # Business logic
└── docker/                # Docker configuration
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: msv2-frontend
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: msv2-frontend
          image: msv2-frontend:latest
          ports:
            - containerPort: 3000
```

## 📚 API Documentation

### Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Library Endpoints

```http
GET    /api/library/artists
GET    /api/library/artists/{id}/albums
GET    /api/library/search?q=query
POST   /api/favorites
GET    /api/playlists
```

### 3D Visualization

```http
GET    /api/visualization/points
GET    /api/visualization/clusters
POST   /api/visualization/search
```

## 🧪 Development

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build
```

## 🎨 Theming System

The app supports multiple themes:

- **Dark/Light Mode**: Automatic system detection
- **Nord Theme**: Cool blue theme
- **Obsidian**: Dark theme with purple accents
- **Vaporwave**: Retro 80s aesthetic
- **Custom Themes**: Create your own!
