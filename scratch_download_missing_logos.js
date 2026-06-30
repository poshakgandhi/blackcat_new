import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.astro.puc.cl/BlackCAT';
const OUT_DIR = path.resolve(__dirname, 'public/blackcat');

const extraAssets = [
  'media/logo_anid.png',
  'media/logo_fondecyt2.png',
  'media/logo_puc2.png',
  'media/logo_iac.png',
  'media/logo_eso.jpg',
  'includes/jquery.min.js',
  'includes/bootstrap.min.js'
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
  for (const asset of extraAssets) {
    try {
      await download(`${BASE_URL}/${asset}`, asset);
    } catch (err) {
      console.error(`Error downloading ${asset}:`, err.message);
    }
  }
  console.log('Extra assets download complete!');
}

run();
