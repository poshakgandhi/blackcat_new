import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function raToDegrees(raStr) {
  const parts = raStr.trim().split(':');
  if (parts.length < 3) return null;
  const h = parseFloat(parts[0]);
  const m = parseFloat(parts[1]);
  const s = parseFloat(parts[2]);
  return (h + m / 60 + s / 3600) * 15;
}

function decToDegrees(decStr) {
  const parts = decStr.trim().split(':');
  if (parts.length < 3) return null;
  const sign = parts[0].trim().startsWith('-') ? -1 : 1;
  const d = Math.abs(parseFloat(parts[0]));
  const m = parseFloat(parts[1]);
  const s = parseFloat(parts[2]);
  return sign * (d + m / 60 + s / 3600);
}

// Survey IDs
const SURVEYS = {
  xray: [
    { id: 'cxc.harvard.edu/P/cda/hips/allsky/rgb', name: 'Chandra' },
    { id: 'ESDC/P/XMM/EPIC-RGB', name: 'XMM' },
    { id: 'erosita/dr1/rate/rgb', name: 'eROSITA' }
  ],
  optical: [
    { id: 'CDS/P/PanSTARRS/DR1/color-i-r-g', name: 'Pan-STARRS' },
    { id: 'CDS/P/DESI-Legacy-Surveys/DR10/color', name: 'DESI' },
    { id: 'CDS/P/DECaPS/DR2/color', name: 'DECaPS' },
    { id: 'CDS/P/DSS2/color', name: 'DSS2' }
  ],
  ir: [
    { id: 'ESAVO/P/Spitzer/IRAC134-RGB-bright', name: 'Spitzer' },
    { id: 'CDS/P/2MASS/color', name: '2MASS' }
  ]
};

async function run() {
  const htmlPath = path.resolve(__dirname, 'public/blackcat/transients.html');
  const html = await fs.readFile(htmlPath, 'utf-8');

  const rowRegex = /<tr style=font-weight:(?:normal|bold)>([\s\S]*?)<\/tr>/gi;
  const tdRegex = /<td class="([^"]+)">([\s\S]*?)<\/td>/gi;

  let match;
  const transients = [];

  while ((match = rowRegex.exec(html)) !== null) {
    const rowHtml = match[1];
    let tdMatch;
    const tds = [];
    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      tds.push({
        className: tdMatch[1],
        content: tdMatch[2].trim()
      });
    }

    if (tds.length >= 4) {
      const idMatch = tds[0].content.match(/href="info\.php\?id=(\d+)"/i);
      const id = idMatch ? idMatch[1] : '';

      const nameMatch = tds[1].content.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
      let name = nameMatch ? nameMatch[1] : tds[1].content;
      name = name.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();

      const ra = tds[2].content;
      const dec = tds[3].content;

      transients.push({ id, name, ra, dec });
    }
  }

  console.log(`Querying coverage for ${transients.length} transients...`);
  const mapping = {};

  for (let i = 0; i < transients.length; i++) {
    const t = transients[i];
    const raDeg = raToDegrees(t.ra);
    const decDeg = decToDegrees(t.dec);
    
    if (raDeg === null || decDeg === null) {
      console.log(`Skipping transient ${t.id} (${t.name}) due to invalid coords.`);
      continue;
    }

    console.log(`[${i+1}/${transients.length}] Querying ${t.name} (RA: ${raDeg.toFixed(4)}, DEC: ${decDeg.toFixed(4)})...`);
    
    try {
      const url = `http://alasky.cds.unistra.fr/MocServer/query?RA=${raDeg}&DEC=${decDeg}&SR=0.0001&get=record&fmt=json`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
      }
      const data = await res.json();
      const coveredIds = data.map(item => item.ID);

      // Select best X-ray
      let xraySurvey = null;
      for (const s of SURVEYS.xray) {
        if (coveredIds.includes(s.id)) {
          xraySurvey = s;
          break;
        }
      }

      // Select best optical
      let opticalSurvey = null;
      for (const s of SURVEYS.optical) {
        if (coveredIds.includes(s.id)) {
          opticalSurvey = s;
          break;
        }
      }

      // Select best IR
      let irSurvey = null;
      for (const s of SURVEYS.ir) {
        if (coveredIds.includes(s.id)) {
          irSurvey = s;
          break;
        }
      }

      mapping[t.id] = {
        ra_deg: raDeg,
        dec_deg: decDeg,
        xray: xraySurvey,
        optical: opticalSurvey,
        ir: irSurvey
      };

    } catch (err) {
      console.error(`Error querying ${t.name}:`, err.message);
      // Fallback: put nulls and allow client to query dynamically
      mapping[t.id] = {
        ra_deg: raDeg,
        dec_deg: decDeg,
        xray: null,
        optical: null,
        ir: null
      };
    }

    // Polite delay
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Save the result
  const outPath = path.resolve(__dirname, 'public/blackcat/includes/precomputed.json');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`Precomputed coverage saved to ${outPath}`);
}

run();
