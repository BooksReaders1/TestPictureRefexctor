# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a manga/comic viewer web application that loads and displays images from a CDN with special image processing to handle sliced/obfuscated images. The application includes a floating menu, drawer interface, and supports downloading manga as ZIP files.

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

### Common Tasks
- **Run the application**: Open index.html in a web browser
- **Test image processing**: Load a manga with query parameter `?id=<mangaId>`
- **Analyze deobfuscated code**: Use the Python deobfuscation scripts
- **Modify image processing**: Edit jquery.photo-0.6-deobfuscated.js
- **Update UI**: Modify index.html CSS and JavaScript

### Important Notes
- The application uses a maximum of 100 pages per manga by default
- Image processing relies on specific CDN image format and structure
- The floating menu can be dragged and includes download functionality
- Error handling includes retry mechanisms for failed image loads
- iOS/Safari specific download handling is implemented for ZIP files

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
