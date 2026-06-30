async function testCutout(hips, ra, dec) {
  const url = `https://alasky.cds.unistra.fr/hips-image-services/hips2fits?hips=${encodeURIComponent(hips)}&ra=${ra}&dec=${dec}&fov=0.05&width=100&height=100&format=jpg`;
  try {
    const res = await fetch(url);
    console.log(`HIPS: ${hips} | RA: ${ra} | DEC: ${dec}`);
    console.log(`Status: ${res.status} | Content-Type: ${res.headers.get('content-type')} | Content-Length: ${res.headers.get('content-length')}`);
    if (!res.ok) {
      const text = await res.text();
      console.log(`Error body: ${text.slice(0, 100)}`);
    } else {
      console.log("Success! Image returned.");
    }
    console.log('---');
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

async function run() {
  // Test a coordinates in DECaPS (should be in Galactic plane) and out of DECaPS
  // Sgr A*: RA = 266.4168, DEC = -29.0078
  console.log("Testing DECaPS inside:");
  await testCutout('CDS/P/DECaPS/DR2/color', 266.4168, -29.0078);

  console.log("Testing DECaPS outside (North pole, RA=0, DEC=90):");
  await testCutout('CDS/P/DECaPS/DR2/color', 0, 90);

  console.log("Testing Chandra inside:");
  await testCutout('cxc.harvard.edu/P/cda/hips/allsky/rgb', 266.4168, -29.0078);

  console.log("Testing Chandra outside (somewhere random with no Chandra coverage):");
  await testCutout('cxc.harvard.edu/P/cda/hips/allsky/rgb', 180, 0);
}

run();
