# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a manga/comic viewer web application that loads and displays images from a CDN with special image processing to handle sliced/obfuscated images. The application includes a floating menu, drawer interface, and supports downloading manga as ZIP files.

## Commands

### Development Commands
```bash
# Run the application
open index.html

# Test image processing
# Open index.html in browser with ?id=<mangaId> query parameter
# Example: http://localhost:8080/index.html?id=123456

# Python analysis tools
python TestPicture/deobfuscate.py                    # Basic deobfuscation
python TestPicture/deobfuscate_correct.py           # Corrected version
python TestPicture/deobfuscate_full.py              # Full deobfuscation
python TestPicture/full_deobfuscate.py               # Complete analysis

# Git operations
git status                                           # Check repository status
git add .                                            # Stage all changes
git commit -m "message"                             # Commit changes
```

## Architecture & Structure

### Main Components
- **index.html**: Main HTML file containing the manga viewer interface, including:
  - Lazy loading and pagination system
  - Floating menu with drawer interface
  - Image processing logic using canvas
  - Download functionality for creating ZIP archives
  - MD5-based image processing parameters

- **jquery.photo-0.6-deobfuscated.js**: Deobfuscated jQuery plugin for image processing that:
  - Handles image scrambling/deobfuscation
  - Uses MD5 hashing to determine slicing parameters
  - Processes images by slicing and rearranging them
  - Works with canvas elements for image manipulation

- **decoded_image_handler.js**: Extracted image processing functions:
  - `scramble_image_for_new()`: Main image processing entry point
  - `onImageLoadedForNew()`: Handles image after load completion
  - `get_num()`: Calculates slice count using MD5 hashing

- **Python scripts** (deobfuscate.py, deobfuscate_correct.py, etc.): Tools for analyzing and deobfuscating JavaScript code, not part of the main application runtime

### Key Technologies
- Plain HTML, CSS, and JavaScript (no framework)
- jQuery for DOM manipulation
- Canvas API for image processing
- MD5 hashing for parameter generation
- JSZip library for ZIP file creation
- CDN-hosted libraries (jQuery, MD5, JSZip)

### Image Processing Logic
The application processes images by:
1. Calculating slice count using MD5 hashing of manga ID and page number
2. Slicing images vertically and rearranging them in reverse order
3. Using canvas to redraw processed images
4. Implementing lazy loading with concurrent requests

### Development Workflow
- No build system or package manager (uses CDN libraries)
- Direct file editing and testing in browser
- Python scripts are for analysis, not runtime dependencies
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
