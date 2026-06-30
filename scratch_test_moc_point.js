async function testMocPoint(ra, dec) {
  const url = `http://alasky.cds.unistra.fr/MocServer/query?RA=${ra}&DEC=${dec}&SR=0.0001&get=record&fmt=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed, status: ${res.status}`);
      return;
    }
    const data = await res.json();
    console.log(`\n=== Surveys at RA=${ra}, DEC=${dec} ===`);
    const ids = data.map(item => item.ID);
    console.log(`Total surveys matching: ${ids.length}`);
    
    // Check some specific surveys of interest
    const targets = [
      'cxc.harvard.edu/P/cda/hips/allsky/rgb',
      'ESDC/P/XMM/EPIC-RGB',
      'erosita/dr1/rate/rgb',
      'CDS/P/PanSTARRS/DR1/color-i-r-g',
      'CDS/P/DESI-Legacy-Surveys/DR10/color',
      'CDS/P/DECaPS/DR2/color',
      'CDS/P/DSS2/color',
      'ESAVO/P/Spitzer/IRAC134-RGB-bright',
      'CDS/P/2MASS/color'
    ];
    
    targets.forEach(t => {
      const covered = ids.includes(t);
      console.log(`Covered by ${t}: ${covered}`);
    });
  } catch (e) {
    console.error("Error querying MocServer:", e);
  }
}

async function run() {
  // Sgr A* coordinates
  await testMocPoint(266.4168, -29.0078);
  // A coordinate with no DECaPS but should have DSS2
  await testMocPoint(0, 90);
}

run();
