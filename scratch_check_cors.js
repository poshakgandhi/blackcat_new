async function checkCors() {
  const url = `https://alasky.cds.unistra.fr/hips-image-services/hips2fits?hips=CDS/P/DECaPS/DR2/color&ra=266.4168&dec=-29.0078&fov=0.05&width=100&height=100&format=jpg`;
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    console.log("Headers:");
    for (const [key, value] of res.headers.entries()) {
      console.log(`${key}: ${value}`);
    }
  } catch (e) {
    console.error("CORS check failed:", e);
  }
}

checkCors();
