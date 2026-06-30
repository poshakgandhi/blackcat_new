async function search(query) {
  try {
    const url = `http://alasky.cds.unistra.fr/MocServer/query?expr=ID=*${encodeURIComponent(query)}*&get=record&fmt=json`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed for query: ${query}, status: ${res.status}`);
      return;
    }
    const data = await res.json();
    console.log(`\n=== Matches for "${query}" ===`);
    data.forEach(item => {
      console.log(`HiPS ID: ${item.ID} | Title: ${item.obs_title || item.title || ''}`);
    });
  } catch (e) {
    console.error(`Error searching for ${query}:`, e);
  }
}

async function run() {
  await search('erosita');
}

run();
