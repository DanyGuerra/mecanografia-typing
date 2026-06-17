# Mecanografia - Typing App

A minimalist and interactive typing application built with Next.js, React, and TypeScript. It features a clean layout in monochrome grey and charcoal tones, designed to be completely free of visual distractions.

## Features

* Interactive 3D SVG virtual keyboard that responds to physical keystrokes in real-time.
* Support for Spanish (with Ñ and accent characters) and English keyboard layouts.
* Dynamically synthesized mechanical key click sounds using the Web Audio API (no external assets required).
* Real-time metrics: words per minute (WPM), accuracy percentage, and elapsed time.
* Interactive focus overlay system to prevent browser keyboard shortcut collisions.
* Clean, modular, and performant structure optimized for static site generation.

## Requirements

* Node.js v20 or higher
* NPM or a compatible package manager

## Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser to start typing.

## Project Scripts

* `npm run dev`: Starts the local development server.
* `npm run build`: Compiles the application optimized for production deployment.
* `npm run lint`: Performs static analysis check using ESLint.
* `npm run start`: Starts the built production application server.
