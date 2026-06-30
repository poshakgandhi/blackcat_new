import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const htmlPath = path.resolve(__dirname, 'public/blackcat/transients.html');
  const html = await fs.readFile(htmlPath, 'utf-8');

  // Simple regex-based parsing of the HTML table
  const rowRegex = /<tr style=font-weight:(?:normal|bold)>([\s\S]*?)<\/tr>/gi;
  const tdRegex = /<td class="([^"]+)">([\s\S]*?)<\/td>/gi;

  let match;
  let parsedCount = 0;
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
      // Extract ID
      const idMatch = tds[0].content.match(/href="info\.php\?id=(\d+)"/i);
      const id = idMatch ? idMatch[1] : '';

      // Extract Name
      const nameMatch = tds[1].content.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
      let name = nameMatch ? nameMatch[1] : tds[1].content;
      name = name.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();

      // Extract RA and Dec
      const ra = tds[2].content;
      const dec = tds[3].content;

      transients.push({ id, name, ra, dec });
      parsedCount++;
    }
  }

  console.log(`Parsed ${parsedCount} transients:`);
  console.log(transients.slice(0, 5));
  console.log('...');
  console.log(transients.slice(-5));
}

run();
