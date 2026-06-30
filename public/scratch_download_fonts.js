import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.astro.puc.cl/BlackCAT';
const OUT_DIR = path.resolve(__dirname, 'blackcat/includes/font-awesome-4.7.0/fonts');

const fontFiles = [
  'fontawesome-webfont.eot',
  'fontawesome-webfont.svg',
  'fontawesome-webfont.ttf',
  'fontawesome-webfont.woff',
  'fontawesome-webfont.woff2',
  'FontAwesome.otf'
];

async function download(url, dest) {
  const fullDest = path.join(OUT_DIR, dest);
  await fs.mkdir(path.dirname(fullDest), { recursive: true });
  
  console.log(`Downloading: ${url} -> ${dest}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: status ${res.status}`);
  }
  
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(fullDest, buffer);
}

async function run() {
  for (const font of fontFiles) {
    const url = `${BASE_URL}/includes/font-awesome-4.7.0/fonts/${font}`;
    try {
      await download(url, font);
    } catch (err) {
      console.error(`Error downloading font ${font}:`, err.message);
    }
  }
  console.log('Fonts download process complete!');
}

run();
