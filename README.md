# BlackCAT transients table layout

This repository contains the source code for the BlackCAT (A Catalog of Stellar-Mass Black Holes in X-ray Binaries) transients database website.

## Features

### 1. Embedded Survey Thumbnails
Inside the first column (**Name (Counterpart)**), each transient has small inline thumbnails for three key wavelengths:
* **X-ray** (Chandra/Swift/etc.)
* **Optical** (PanSTARRS/DSS/etc.)
* **Infrared** (2MASS/etc.)

If no survey coverage is found for a specific coordinates point, a fallback **N/A** block is rendered. These states are styled purely via CSS pseudo-elements (`::before` / `::after`) to prevent the sorting engine from parsing `"N/A"` text, ensuring alphabetical and numerical sorting functions remain fully accurate.

### 2. Dual-Zoom Hover Popups
Hovering over any active survey thumbnail triggers a floating, glassmorphism-styled popup showing:
* **Wide Field (1.5' FOV)**: A wider context view of the counterpart area.
* **Zoom (20" FOV)**: A close-in high-resolution zoom centered directly on the counterpart coordinates.

The popup automatically stays within the viewport boundaries to prevent off-screen rendering.

---

## Local Testing

Modern browsers block requests to local JSON files (such as `precomputed.json`) when pages are opened directly via the `file://` protocol. To run and test the website locally, you must serve it using a local web server:

### Option A: Python (Easiest)
Navigate to the `public/blackcat` directory and run:
```bash
python3 -m http.server 8080
```
Open [http://localhost:8080/transients.html](http://localhost:8080/transients.html) in your browser.

### Option B: PHP
Navigate to the `public/blackcat` directory and run:
```bash
php -S localhost:8080
```
Open [http://localhost:8080/transients.html](http://localhost:8080/transients.html) in your browser.

### Option C: Node.js
Navigate to the `public/blackcat` directory and run:
```bash
npx http-server -p 8080
```
Open [http://localhost:8080/transients.html](http://localhost:8080/transients.html) in your browser.
