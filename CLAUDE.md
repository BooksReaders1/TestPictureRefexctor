# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
TestPictureRefactor is a Vue 3 + TypeScript refactor of the original manga/comic viewer web application. It loads and displays images from a CDN with special image processing to handle sliced/obfuscated images. The application includes a floating menu, drawer interface, and supports downloading manga as ZIP files.

## Commands

### Development Commands
```bash
# Run the application
cd frontend
npm run dev                                          # Start dev server
npm run build                                        # Build for production

# Test image processing
# Open http://localhost:5173 with ?id=<mangaId> query parameter
# Example: http://localhost:5173?id=123456

# Git operations
git status                                           # Check repository status
git add .                                            # Stage all changes
git commit -m "message"                             # Commit changes
```

## Architecture & Structure

### Main Components
- **frontend/index.html**: Main HTML file with Vue app mount point
- **frontend/src/**: Vue 3 + TypeScript source code
  - `App.vue`: Root component
  - `main.ts`: Application entry point
  - `components/`: Vue components (manga viewer, floating menu, etc.)
  - `stores/`: Pinia state management
  - `router/`: Vue Router configuration
  - `services/`: API service layer
  - `utils/`: Utility functions for image processing, MD5, etc.

### Key Technologies
- Vue 3 with Composition API
- TypeScript for type safety
- Vite as build tool
- Pinia for state management
- Vue Router for navigation
- Canvas API for image processing
- MD5 hashing for parameter generation
- JSZip library for ZIP file creation

### Image Processing Logic
The application processes images by:
1. Calculating slice count using MD5 hashing of manga ID and page number
2. Slicing images vertically and rearranging them in reverse order
3. Using canvas to redraw processed images
4. Implementing lazy loading with concurrent requests

### Development Workflow
- Use npm/yarn for dependency management
- Vite development server for hot reload
- TypeScript compilation for type safety
- Vue components for modular UI
- Pinia store for state management
- Images are loaded from CDN: `https://cdn-msp.jm18c-uoe.cc/media/photos/{mangaId}/{pageId}.webp`

### Important Notes
- The application uses a maximum of 100 pages per manga by default
- Image processing relies on specific CDN image format and structure
- The floating menu can be dragged and includes download functionality
- Error handling includes retry mechanisms for failed image loads
- iOS/Safari specific download handling is implemented for ZIP files

## API Integration

The application interfaces with JMComic (禁漫天堂) APIs:
- See `apis.md` for detailed API documentation
- APIs require authentication with time-based tokens
- Images use CDN endpoints with specific headers
- Decryption is handled client-side for scrambled images

<!-- SPECKIT START -->
Implementation plan for Vue漫画查看器重构:
- Feature specification: specs/001-vue-manga-refactor/spec.md
- Implementation plan: specs/001-vue-manga-refactor/plan.md
- Research findings: specs/001-vue-manga-refactor/research.md
- Data model: specs/001-vue-manga-refactor/data-model.md
- API contracts: specs/001-vue-manga-refactor/contracts/
- Quick start guide: specs/001-vue-manga-refactor/quickstart.md
<!-- SPECKIT END -->
