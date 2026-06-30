import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const jsonPath = path.resolve(__dirname, 'public/blackcat/includes/precomputed.json');
  const jsonContent = await fs.readFile(jsonPath, 'utf-8');
  
  const jsContent = `/**
 * BlackCAT Transients Table Aladin Cutouts Extension
 * Generates and displays X-ray, Optical, and IR cutouts using the CDS hips2fits service.
 * Dynamic fallback priority logic:
 *   - X-ray: Chandra -> XMM -> eROSITA -> None
 *   - Optical: Pan-STARRS -> DESI -> DECaPS -> DSS2
 *   - IR: Spitzer -> 2MASS
 */

(function() {
  // 1. Embedded Precomputed Survey Coverage for the 73 current transients
  const PRECOMPUTED_COVERAGE = ${jsonContent.trim()};

  // 2. Constants & Survey Configurations
  const SURVEY_PRIORITIES = {
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

  const CUTOUT_FOV = 0.025; // 1.5 arcminutes (1.5 / 60 degrees)
  const CUTOUT_SIZE = 300; // 300x300px image resolution (used for popup, scaled down for thumbnail)

  // 3. Dynamic Styles Injector
  function injectStyles() {
    const css = \`
      .column-sky-list {
        width: 14%;
        min-width: 200px;
        text-align: center;
        vertical-align: middle !important;
      }
      .sky-thumbnails-container {
        display: flex;
        gap: 6px;
        justify-content: center;
        align-items: center;
        margin: 4px 0;
      }
      .sky-thumbnail-wrapper {
        position: relative;
        width: 60px;
        height: 60px;
        box-sizing: border-box;
      }
      .sky-thumbnail {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid rgba(0,0,0,0.1);
        background: #f7f7f7;
        cursor: pointer;
        display: block;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
        box-sizing: border-box;
      }
      .sky-thumbnail:hover {
        transform: scale(1.12);
        border-color: #337ab7;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10;
      }
      .sky-thumbnail.na {
        background: #f0f0f0;
        border: 1px dashed rgba(0,0,0,0.15);
        color: #777;
        font-size: 10px;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 1.2;
        cursor: default;
        border-radius: 6px;
      }
      .sky-thumbnail.na span {
        font-size: 8px;
        color: #aaa;
        font-weight: normal;
        margin-top: 2px;
      }
      /* Hover Popup Styling (Light Theme) */
      #sky-popup {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.45);
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 1px 8px rgba(0, 0, 0, 0.06);
        width: 324px; /* 300px image + padding */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        box-sizing: border-box;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #sky-popup.visible {
        opacity: 1;
        transform: scale(1);
      }
      .sky-popup-title {
        font-size: 14px;
        font-weight: bold;
        color: #222;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sky-popup-subtitle {
        font-size: 11px;
        color: #337ab7;
        font-weight: 600;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .sky-popup-image {
        width: 300px;
        height: 300px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid rgba(0,0,0,0.08);
        background: #eee;
        display: block;
      }
      .sky-popup-coords {
        font-size: 9px;
        color: #777;
        margin-top: 6px;
        text-align: right;
      }
    \`;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // 4. Helper Coordinates Converters
  function raToDegrees(raStr) {
    if (!raStr) return null;
    const parts = raStr.trim().split(':');
    if (parts.length < 3) return null;
    const h = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    if (isNaN(h) || isNaN(m) || isNaN(s)) return null;
    return (h + m / 60 + s / 3600) * 15;
  }

  function decToDegrees(decStr) {
    if (!decStr) return null;
    const parts = decStr.trim().split(':');
    if (parts.length < 3) return null;
    const sign = parts[0].trim().startsWith('-') ? -1 : 1;
    const d = Math.abs(parseFloat(parts[0]));
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    if (isNaN(d) || isNaN(m) || isNaN(s)) return null;
    return sign * (d + m / 60 + s / 3600);
  }

  // 5. Dynamic MOC Query for New Transients
  async function queryMocServer(ra, dec) {
    const url = \`https://alasky.cds.unistra.fr/MocServer/query?RA=\${ra}&DEC=\${dec}&SR=0.0001&get=record&fmt=json\`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const coveredIds = data.map(item => item.ID);

      // Resolve best X-ray
      let xray = null;
      for (const s of SURVEY_PRIORITIES.xray) {
        if (coveredIds.includes(s.id)) {
          xray = s;
          break;
        }
      }

      // Resolve best optical
      let optical = null;
      for (const s of SURVEY_PRIORITIES.optical) {
        if (coveredIds.includes(s.id)) {
          optical = s;
          break;
        }
      }

      // Resolve best IR
      let ir = null;
      for (const s of SURVEY_PRIORITIES.ir) {
        if (coveredIds.includes(s.id)) {
          ir = s;
          break;
        }
      }

      return { xray, optical, ir };
    } catch (e) {
      console.error("MocServer query failed:", e);
      return null;
    }
  }

  // 6. Generate Cutout URL
  function getCutoutUrl(surveyId, ra, dec) {
    return \`https://alasky.cds.unistra.fr/hips-image-services/hips2fits?hips=\${encodeURIComponent(surveyId)}&ra=\${ra}&dec=\${dec}&fov=\${CUTOUT_FOV}&width=\${CUTOUT_SIZE}&height=\${CUTOUT_SIZE}&format=jpg\`;
  }

  // 7. Setup Hover Tooltip Elements
  let popupEl, popupTitle, popupSubtitle, popupImage, popupCoords;

  function initPopup() {
    popupEl = document.createElement('div');
    popupEl.id = 'sky-popup';

    popupTitle = document.createElement('div');
    popupTitle.className = 'sky-popup-title';
    popupEl.appendChild(popupTitle);

    popupSubtitle = document.createElement('div');
    popupSubtitle.className = 'sky-popup-subtitle';
    popupEl.appendChild(popupSubtitle);

    popupImage = document.createElement('img');
    popupImage.className = 'sky-popup-image';
    popupEl.appendChild(popupImage);

    popupCoords = document.createElement('div');
    popupCoords.className = 'sky-popup-coords';
    popupEl.appendChild(popupCoords);

    document.body.appendChild(popupEl);
  }

  function showPopup(thumbnail, transientName, surveyName, surveyType, imgUrl, raText, decText) {
    if (!popupEl) initPopup();

    popupTitle.textContent = transientName;
    popupSubtitle.textContent = \`\${surveyType}: \${surveyName}\`;
    popupImage.src = imgUrl;
    popupCoords.textContent = \`RA: \${raText} | DEC: \${decText} (1.5' FOV)\`;

    popupEl.classList.add('visible');
  }

  function movePopup(e) {
    if (!popupEl) return;
    let left = e.clientX + 15;
    let top = e.clientY + 15;
    const popupWidth = 324;
    const popupHeight = 360;

    // Boundary check so it stays inside the viewport using clientX/clientY
    if (left + popupWidth > window.innerWidth) {
      left = e.clientX - popupWidth - 15;
    }
    if (top + popupHeight > window.innerHeight) {
      top = e.clientY - popupHeight - 15;
    }

    popupEl.style.left = left + 'px';
    popupEl.style.top = top + 'px';
  }

  function hidePopup() {
    if (!popupEl) return;
    popupEl.classList.remove('visible');
    // Polite cleanup to avoid flash of wrong image on next show
    setTimeout(() => {
      if (!popupEl.classList.contains('visible')) {
        popupImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      }
    }, 150);
  }

  // 8. Process and Render Cell Contents
  function renderCell(cell, xraySurvey, opticalSurvey, irSurvey, raDeg, decDeg, raText, decText, transientName) {
    const container = document.createElement('div');
    container.className = 'sky-thumbnails-container';

    // (1) X-ray Thumbnail
    const xrayWrap = document.createElement('div');
    xrayWrap.className = 'sky-thumbnail-wrapper';
    if (xraySurvey) {
      const imgUrl = getCutoutUrl(xraySurvey.id, raDeg, decDeg);
      const img = document.createElement('img');
      img.className = 'sky-thumbnail';
      img.src = imgUrl;
      img.loading = 'lazy';
      img.alt = \`X-ray (\${xraySurvey.name})\`;
      img.title = \`X-ray: \${xraySurvey.name}\`;

      img.addEventListener('mouseover', (e) => {
        showPopup(img, transientName, xraySurvey.name, 'X-ray (0.2-10 keV)', imgUrl, raText, decText);
        movePopup(e);
      });
      img.addEventListener('mousemove', movePopup);
      img.addEventListener('mouseout', hidePopup);
      img.onerror = () => {
        const na = document.createElement('div');
        na.className = 'sky-thumbnail na';
        na.innerHTML = 'X-ray<br><span>N/A</span>';
        na.title = \`Failed to load X-ray (\${xraySurvey.name}) cutout\`;
        if (img.parentNode) {
          img.parentNode.replaceChild(na, img);
        }
      };
      xrayWrap.appendChild(img);
    } else {
      const na = document.createElement('div');
      na.className = 'sky-thumbnail na';
      na.innerHTML = 'X-ray<br><span>N/A</span>';
      na.title = 'No X-ray coverage available';
      xrayWrap.appendChild(na);
    }
    container.appendChild(xrayWrap);

    // (2) Optical Thumbnail
    const optWrap = document.createElement('div');
    optWrap.className = 'sky-thumbnail-wrapper';
    if (opticalSurvey) {
      const imgUrl = getCutoutUrl(opticalSurvey.id, raDeg, decDeg);
      const img = document.createElement('img');
      img.className = 'sky-thumbnail';
      img.src = imgUrl;
      img.loading = 'lazy';
      img.alt = \`Optical (\${opticalSurvey.name})\`;
      img.title = \`Optical: \${opticalSurvey.name}\`;

      img.addEventListener('mouseover', (e) => {
        showPopup(img, transientName, opticalSurvey.name, 'Optical color view', imgUrl, raText, decText);
        movePopup(e);
      });
      img.addEventListener('mousemove', movePopup);
      img.addEventListener('mouseout', hidePopup);
      img.onerror = () => {
        const na = document.createElement('div');
        na.className = 'sky-thumbnail na';
        na.innerHTML = 'Optical<br><span>N/A</span>';
        na.title = \`Failed to load Optical (\${opticalSurvey.name}) cutout\`;
        if (img.parentNode) {
          img.parentNode.replaceChild(na, img);
        }
      };
      optWrap.appendChild(img);
    } else {
      const na = document.createElement('div');
      na.className = 'sky-thumbnail na';
      na.innerHTML = 'Optical<br><span>N/A</span>';
      na.title = 'No optical coverage available';
      optWrap.appendChild(na);
    }
    container.appendChild(optWrap);

    // (3) IR Thumbnail
    const irWrap = document.createElement('div');
    irWrap.className = 'sky-thumbnail-wrapper';
    if (irSurvey) {
      const imgUrl = getCutoutUrl(irSurvey.id, raDeg, decDeg);
      const img = document.createElement('img');
      img.className = 'sky-thumbnail';
      img.src = imgUrl;
      img.loading = 'lazy';
      img.alt = \`IR (\${irSurvey.name})\`;
      img.title = \`IR: \${irSurvey.name}\`;

      img.addEventListener('mouseover', (e) => {
        showPopup(img, transientName, irSurvey.name, 'Infrared view', imgUrl, raText, decText);
        movePopup(e);
      });
      img.addEventListener('mousemove', movePopup);
      img.addEventListener('mouseout', hidePopup);
      img.onerror = () => {
        const na = document.createElement('div');
        na.className = 'sky-thumbnail na';
        na.innerHTML = 'IR<br><span>N/A</span>';
        na.title = \`Failed to load IR (\${irSurvey.name}) cutout\`;
        if (img.parentNode) {
          img.parentNode.replaceChild(na, img);
        }
      };
      irWrap.appendChild(img);
    } else {
      const na = document.createElement('div');
      na.className = 'sky-thumbnail na';
      na.innerHTML = 'IR<br><span>N/A</span>';
      na.title = 'No infrared coverage available';
      irWrap.appendChild(na);
    }
    container.appendChild(irWrap);

    cell.innerHTML = '';
    cell.appendChild(container);
  }

  // 9. Main Setup Orchestration
  function init() {
    injectStyles();

    const table = document.getElementById("myTable2");
    if (!table) {
      console.warn("BlackCAT Cutouts: Table '#myTable2' not found.");
      return;
    }

    // Insert Header column
    const headerRow = table.querySelector("thead tr");
    if (headerRow) {
      const th = document.createElement('th');
      th.className = 'column-sky-list';
      th.innerHTML = 'Sky View<br><small>[X-ray / Opt / IR]</small>';
      headerRow.appendChild(th);
    }

    // Process Rows
    const tbodyRows = table.querySelectorAll("tbody tr");
    tbodyRows.forEach(row => {
      const tds = row.querySelectorAll("td");
      if (tds.length < 4) return;

      // Extract ID from the first column link
      const idLink = tds[0].querySelector("a");
      const idStr = idLink ? idLink.textContent.trim() : "";
      
      // Extract Name
      const nameLink = tds[1].querySelector("a");
      let transientName = nameLink ? nameLink.textContent.trim() : tds[1].textContent.trim();
      transientName = transientName.replace(/\\s+/g, ' ');

      // Extract Coordinates (text format)
      const raText = tds[2].textContent.trim();
      const decText = tds[3].textContent.trim();

      // Create new TD column cell at the end
      const cell = document.createElement('td');
      cell.className = 'column-sky-list';
      row.appendChild(cell);

      // Get decimal coordinates
      const raDeg = raToDegrees(raText);
      const decDeg = decToDegrees(decText);

      if (raDeg === null || decDeg === null) {
        cell.innerHTML = '<span style="color:#aaa; font-size:10px;">Invalid Coord</span>';
        return;
      }

      // Check precomputed database first
      const precomputed = PRECOMPUTED_COVERAGE[idStr];
      if (precomputed) {
        renderCell(cell, precomputed.xray, precomputed.optical, precomputed.ir, raDeg, decDeg, raText, decText, transientName);
      } else {
        // Fallback for newly added objects: query MOC Server dynamically
        cell.innerHTML = '<span style="color:#888; font-size:10px;">Loading coverage...</span>';
        queryMocServer(raDeg, decDeg).then(result => {
          if (result) {
            renderCell(cell, result.xray, result.optical, result.ir, raDeg, decDeg, raText, decText, transientName);
          } else {
            // Default fallback is to use DSS2 and 2MASS if MocServer fails
            renderCell(cell, null, { id: 'CDS/P/DSS2/color', name: 'DSS2' }, { id: 'CDS/P/2MASS/color', name: '2MASS' }, raDeg, decDeg, raText, decText, transientName);
          }
        });
      }
    });
  }

  // Run on page ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;
  
  const outPath = path.resolve(__dirname, 'public/blackcat/includes/cutouts.js');
  await fs.writeFile(outPath, jsContent, 'utf-8');
  console.log(`Generated: ${outPath}`);
}

run();
