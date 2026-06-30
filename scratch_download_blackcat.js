import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.astro.puc.cl/BlackCAT';
const OUT_DIR = path.resolve(__dirname, 'public/blackcat');

const assets = [
  'includes/bootstrap.min.css',
  'includes/style.css',
  'includes/aladin.min.css',
  'includes/jquery-3.6.0.min.js',
  'includes/TopButton.js',
  'includes/sortTable.js',
  'includes/font-awesome-4.7.0/css/font-awesome.min.css',
  'media/fa-arrow-circle-up-white.png'
];

async function download(url, dest) {
  const fullDest = path.join(OUT_DIR, dest);
  await fs.mkdir(path.dirname(fullDest), { recursive: true });
  
  console.log(`Downloading: ${url} -> ${dest}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: status ${res.status}`);
  }
  
  const ext = path.extname(dest).toLowerCase();
  const isBinary = ['.png', '.jpg', '.jpeg', '.gif', '.woff', '.woff2', '.ttf'].includes(ext);
  
  if (isBinary) {
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(fullDest, buffer);
  } else {
    const text = await res.text();
    await fs.writeFile(fullDest, text, 'utf-8');
  }
}

async function run() {
  try {
    // Download transients page HTML
    await download(`${BASE_URL}/transients.php`, 'transients.html');
    
    // Download assets
    for (const asset of assets) {
      try {
        await download(`${BASE_URL}/${asset}`, asset);
      } catch (err) {
        console.error(`Error downloading asset ${asset}:`, err.message);
      }
    }
    
    console.log('Done downloading BlackCAT assets!');
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

run();
