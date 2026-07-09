import fs from 'node:fs';
import path from 'node:path';

const DIRECTUS_URL = 'http://168.144.130.147:8055';
const ADMIN_EMAIL = 'tarnpure@gmail.com';
const ADMIN_PASSWORD = 'f2ded46ae924d429b14e24db8a5418ac';

const JSON_FILE_PATH = '/Users/tarnpure/WWW/estellawine.com/wines_extracted.json';
const IMAGES_BASE_DIR = '/Users/tarnpure/WWW/estellawine.com';

const DRY_RUN = process.env.DRY_RUN === 'true';

// Helper to determine mime type
function getMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

// 1. Authenticate with Directus
async function login() {
  console.log(`Logging in to Directus at ${DIRECTUS_URL}...`);
  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`Authentication failed: ${res.statusText} - ${await res.text()}`);
  }

  const payload = await res.json();
  console.log('Authenticated successfully!');
  return payload.data.access_token;
}

// 2. Upload file if it doesn't already exist
async function uploadFileIfNotExist(imagePath, token) {
  // If path starts with sites/default/files/, resolve it. Otherwise resolve it directly.
  const relativePath = imagePath.startsWith('sites/default/files/') ? imagePath : path.join('sites/default/files', imagePath);
  const fullPath = path.join(IMAGES_BASE_DIR, relativePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Local file not found: ${fullPath}`);
    return null;
  }

  const fileName = path.basename(fullPath);

  // Check if file already exists in Directus
  const searchUrl = `${DIRECTUS_URL}/files?filter[filename_download][_eq]=${encodeURIComponent(fileName)}`;
  const searchRes = await fetch(searchUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.data && searchData.data.length > 0) {
      console.log(`File already exists in Directus: ${fileName} -> ${searchData.data[0].id}`);
      return searchData.data[0].id;
    }
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would upload image: ${fileName}`);
    return 'dry-run-image-uuid';
  }

  // Upload new file
  console.log(`Uploading image: ${fileName}...`);
  const fileBuffer = fs.readFileSync(fullPath);
  const blob = new Blob([fileBuffer], { type: getMimeType(fileName) });
  
  const formData = new FormData();
  formData.append('file', blob, fileName);

  const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  if (!uploadRes.ok) {
    console.error(`❌ Failed to upload image: ${fileName} - ${await uploadRes.text()}`);
    return null;
  }

  const uploadData = await uploadRes.json();
  console.log(`Successfully uploaded: ${fileName} -> ID: ${uploadData.data.id}`);
  return uploadData.data.id;
}

// 3. Parse vintage year from title
function parseVintage(title) {
  const match = title.match(/\b(19\d{2}|20\d{2})\b/);
  return match ? parseInt(match[1], 10) : null;
}

// 4. Parse grape varieties
function parseGrapeVarieties(grapeVariety) {
  if (!grapeVariety) return [];
  return grapeVariety
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

// 5. Parse scores block into JSON array of { critic, score }
function parseScores(scoresText) {
  if (!scoresText) return [];
  
  const lines = scoresText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
    
  const results = [];
  const regex = /^(\d+(?:\.\d+)?)\s*(?:Points?|Glasses?|Bunches?|points?|glasses?|bunches?)?\s*(?:for\s+)?(.*)$/i;

  for (const line of lines) {
    if (line.toLowerCase() === 'not yet rated') continue;
    const match = line.match(regex);
    if (match) {
      results.push({
        critic: match[2].trim(),
        score: parseFloat(match[1])
      });
    } else {
      // Fallback: use whole line as critic with null/0 score
      results.push({
        critic: line,
        score: null
      });
    }
  }

  return results;
}

// 6. Check if wine already exists
async function wineExists(name, token) {
  const url = `${DIRECTUS_URL}/items/wines?filter[name][_eq]=${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) {
    console.error(`❌ Error checking wine existence: ${res.statusText}`);
    return false;
  }

  const data = await res.json();
  return data.data && data.data.length > 0;
}

// 7. Main import process
async function main() {
  try {
    const token = await login();

    console.log(`Reading wine records from ${JSON_FILE_PATH}...`);
    const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    const wines = JSON.parse(rawData);
    console.log(`Found ${wines.length} wines to process.`);

    let successCount = 0;
    let existCount = 0;
    let failCount = 0;

    for (let i = 0; i < wines.length; i++) {
      const w = wines[i];
      const name = w.title.trim();
      console.log(`\n[${i + 1}/${wines.length}] Processing: "${name}"...`);

      // Check if wine exists
      const exists = await wineExists(name, token);
      if (exists) {
        console.log(`Wine "${name}" already exists in Directus, skipping.`);
        existCount++;
        continue;
      }

      // Handle image upload
      let imageId = null;
      if (w.image_path) {
        imageId = await uploadFileIfNotExist(w.image_path, token);
      }

      // Parse data fields
      const vintage = parseVintage(name);
      const grapeVarieties = parseGrapeVarieties(w.grape_variety);
      const scores = parseScores(w.scores);
      const region = w.tags && w.tags.length > 0 ? w.tags[0] : 'Unknown Region';

      const payload = {
        brand: 'Estella Wine',
        name: name,
        producer: w.producer || '',
        region: region,
        vintage: vintage,
        tasting_notes: w.tasting_note || '',
        grape_varieties: grapeVarieties,
        scores: scores,
        image: imageId
      };

      if (DRY_RUN) {
        console.log(`[DRY-RUN] Would create wine:`, JSON.stringify(payload, null, 2));
        successCount++;
        continue;
      }

      // Insert wine item
      const insertRes = await fetch(`${DIRECTUS_URL}/items/wines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (insertRes.ok) {
        console.log(`✅ Successfully imported wine: "${name}"`);
        successCount++;
      } else {
        const errText = await insertRes.text();
        console.error(`❌ Failed to import wine: "${name}" - ${errText}`);
        failCount++;
      }
    }

    console.log(`\nImport summary:`);
    console.log(`- Imported: ${successCount}`);
    console.log(`- Already existed: ${existCount}`);
    console.log(`- Failed: ${failCount}`);

  } catch (error) {
    console.error('Fatal error running import:', error);
    process.exit(1);
  }
}

main();
