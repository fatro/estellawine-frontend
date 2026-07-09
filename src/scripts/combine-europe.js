import fs from 'fs';
import path from 'path';

const FRONTEND_DIR = '/Users/tarnpure/WWW/FATRONIX/estellawine-frontend';
const CACHE_DIR = '/Users/tarnpure/.gemini/antigravity/brain/a137258d-e386-4a12-8964-554bf5e45b2f/scratch/geo-cache';

const SOURCES = {
  countries: 'https://raw.githubusercontent.com/datasets/geo-boundaries/master/data/ne_50m_admin_0_countries.geojson',
  franceRegions: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson',
  italyRegions: 'https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson'
};

async function fetchAndCache(url) {
  let filename = path.basename(url);
  if (filename === 'ne_50m_admin_0_countries.geojson') {
    filename = 'ne_50m_countries.geojson';
  } else if (filename === 'regions-version-simplifiee.geojson') {
    filename = 'france_regions.geojson';
  }
  const filepath = path.join(CACHE_DIR, filename);
  if (fs.existsSync(filepath)) {
    console.log(`  ✓ Cached: ${filename}`);
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  }
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  const text = await resp.text();
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(filepath, text);
  return JSON.parse(text);
}

// ── Mercator projection ──
function mercator(lon, lat) {
  const lonRad = (lon * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  return [lonRad, Math.log(Math.tan(Math.PI / 4 + latRad / 2))];
}

// ── GeoJSON → SVG path string ──
function ringToPath(ring, projectFn) {
  let d = '';
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = projectFn(ring[i][0], ring[i][1]);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return d + 'Z';
}

function geometryToPath(geometry, projectFn) {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates.map(ring => ringToPath(ring, projectFn)).join('');
  } else if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates
      .map(poly => poly.map(ring => ringToPath(ring, projectFn)).join(''))
      .join('');
  }
  return '';
}

const FRANCE_OVERSEAS = [
  'Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte',
  'Saint-Pierre-et-Miquelon', 'Saint-Barthélemy', 'Saint-Martin',
  'Wallis-et-Futuna', 'Polynésie française', 'Nouvelle-Calédonie',
];

const FRANCE_WINE_MAP = {
  'Grand Est': 'Champagne',
  'Nouvelle-Aquitaine': 'Bordeaux',
  'Pays de la Loire': 'Loire',
};

const ITALY_WINE_MAP = {
  'Piemonte': 'Piedmont',
  'Toscana': 'Tuscany',
  'Veneto': 'Veneto',
  'Friuli-Venezia Giulia': 'Friuli Venezia Giulia',
  'Friuli Venezia Giulia': 'Friuli Venezia Giulia',
  'Sicilia': 'Sicily',
};

async function main() {
  console.log('Fetching geographic data...');
  const [countriesGeo, franceRegionsGeo, italyRegionsGeo] = await Promise.all([
    fetchAndCache(SOURCES.countries),
    fetchAndCache(SOURCES.franceRegions),
    fetchAndCache(SOURCES.italyRegions),
  ]);

  // ── 1. Europe Main Projection (Middle Pane: width 840, offset by +180px) ──
  const lonMin = -6.0, lonMax = 19.5;
  const latMin = 35.5, latMax = 53.8;

  const [pxMin, ] = mercator(lonMin, latMin);
  const [pxMax, ] = mercator(lonMax, latMax);
  const [, pyBottom] = mercator(0, latMin);
  const [, pyTop]    = mercator(0, latMax);
  const pw = pxMax - pxMin;
  const ph = pyTop - pyBottom;

  const VBW = 1200, VBH = 650;
  const mapWidth = 840;
  const scaleFactor = Math.min(mapWidth / pw, VBH / ph);
  const offsetX = 180 + (mapWidth - pw * scaleFactor) / 2;
  const offsetY = (VBH - ph * scaleFactor) / 2;

  function projectEurope(lon, lat) {
    const [px, py] = mercator(lon, lat);
    return [
      (px - pxMin) * scaleFactor + offsetX,
      (pyTop - py) * scaleFactor + offsetY,
    ];
  }

  // ── 2. South America Inset (Column 1 on far left: x = 0 to 180, dest: x=25, y=70, w=130, h=510) ──
  const destSA = { x: 25, y: 70, w: 130, h: 510 };
  const [saPxMin, saPyBottom] = mercator(-76.0, -56.0);
  const [saPxMax, saPyTop] = mercator(-53.0, -20.0);
  const sapw = saPxMax - saPxMin;
  const saph = saPyTop - saPyBottom;
  const saScale = Math.min(destSA.w / sapw, destSA.h / saph);
  const saOffsetX = destSA.x + (destSA.w - sapw * saScale) / 2;
  const saOffsetY = destSA.y + (destSA.h - saph * saScale) / 2;

  function projectSA(lon, lat) {
    const [px, py] = mercator(lon, lat);
    return [
      (px - saPxMin) * saScale + saOffsetX,
      (saPyTop - py) * saScale + saOffsetY
    ];
  }

  // ── 3. South Africa Inset (Column 3 Top on far right: x = 1020 to 1200, dest: x=1045, y=70, w=130, h=210) ──
  const destAfr = { x: 1045, y: 70, w: 130, h: 210 };
  const [afrPxMin, afrPyBottom] = mercator(14.0, -36.0);
  const [afrPxMax, afrPyTop] = mercator(35.0, -21.0);
  const afrpw = afrPxMax - afrPxMin;
  const afrph = afrPyTop - afrPyBottom;
  const afrScale = Math.min(destAfr.w / afrpw, destAfr.h / afrph);
  const afrOffsetX = destAfr.x + (destAfr.w - afrpw * afrScale) / 2;
  const afrOffsetY = destAfr.y + (destAfr.h - afrph * afrScale) / 2;

  function projectAfr(lon, lat) {
    const [px, py] = mercator(lon, lat);
    return [
      (px - afrPxMin) * afrScale + afrOffsetX,
      (afrPyTop - py) * afrScale + afrOffsetY
    ];
  }

  // ── 4. Oceania Inset (Column 3 Bottom on far right: x = 1020 to 1200, dest: x=1045, y=360, w=130, h=220) ──
  const destOceania = { x: 1045, y: 360, w: 130, h: 220 };
  const [ocPxMin, ocPyBottom] = mercator(112.0, -48.0);
  const [ocPxMax, ocPyTop] = mercator(180.0, -10.0);
  const ocpw = ocPxMax - ocPxMin;
  const ocph = ocPyTop - ocPyBottom;
  const ocScale = Math.min(destOceania.w / ocpw, destOceania.h / ocph);
  const ocOffsetX = destOceania.x + (destOceania.w - ocpw * ocScale) / 2;
  const ocOffsetY = destOceania.y + (destOceania.h - ocph * ocScale) / 2;

  function projectOceania(lon, lat) {
    const [px, py] = mercator(lon, lat);
    return [
      (px - ocPxMin) * ocScale + ocOffsetX,
      (ocPyTop - py) * ocScale + ocOffsetY
    ];
  }

  // ── Build SVG ──
  let svg = `<svg viewBox="0 0 ${VBW} ${VBH}" class="svg-map" id="map-europe" xmlns="http://www.w3.org/2000/svg">\n`;

  // Draw dividers
  svg += `  <!-- Inset Separators -->\n`;
  svg += `  <line x1="180" y1="20" x2="180" y2="630" stroke="rgba(155, 124, 86, 0.25)" stroke-width="1.5" stroke-dasharray="6 6" />\n`;
  svg += `  <line x1="1020" y1="20" x2="1020" y2="630" stroke="rgba(155, 124, 86, 0.25)" stroke-width="1.5" stroke-dasharray="6 6" />\n`;
  
  // South America Header (Far Left Column)
  svg += `  <text x="90" y="40" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" fill="rgba(155, 124, 86, 0.85)" text-anchor="middle" letter-spacing="1">SOUTH AMERICA</text>\n`;

  // South Africa Header (Far Right Column Top)
  svg += `  <text x="1110" y="40" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" fill="rgba(155, 124, 86, 0.85)" text-anchor="middle" letter-spacing="1">SOUTH AFRICA</text>\n`;
  svg += `  <line x1="1020" y1="310" x2="1200" y2="310" stroke="rgba(155, 124, 86, 0.2)" stroke-width="1.0" stroke-dasharray="4 4" />\n`;

  // Oceania Header (Far Right Column Bottom)
  svg += `  <text x="1110" y="335" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" fill="rgba(155, 124, 86, 0.85)" text-anchor="middle" letter-spacing="1">OCEANIA</text>\n\n`;

  // 1) Render Active European Countries (ONLY France, Italy, Spain, Germany, Austria)
  const activeEuropeanCountries = ['Spain', 'Germany', 'Austria'];

  svg += `  <!-- Europe Countries -->\n`;
  for (const feature of countriesGeo.features) {
    const name = feature.properties.ADMIN || feature.properties.NAME;
    if (name === 'France' || name === 'Italy') continue; // Handled as regions later

    if (!activeEuropeanCountries.includes(name)) continue;

    const d = geometryToPath(feature.geometry, projectEurope);
    if (!d) continue;

    svg += `  <!-- Active: ${name} -->\n`;
    svg += `  <g id="country-${name.toLowerCase()}" class="map-country-group" data-filter-country="${name}">\n`;
    svg += `    <path class="map-outline map-country-fill" aria-label="${name}" d="${d}" />\n`;
    svg += `  </g>\n\n`;
  }

  // 2) France — with region boundaries
  svg += `  <!-- France (regions) -->\n`;
  svg += `  <g id="country-france" class="map-country-group" data-filter-country="France">\n`;
  let franceCount = 0;
  for (const feature of franceRegionsGeo.features) {
    const name = feature.properties.nom || feature.properties.NAME || feature.properties.name;
    if (!name) continue;
    if (FRANCE_OVERSEAS.some(ov => name.includes(ov) || name.toLowerCase().includes(ov.toLowerCase()))) continue;
    const d = geometryToPath(feature.geometry, projectEurope);
    if (!d) continue;
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const wineRegion = FRANCE_WINE_MAP[name];
    let cls = 'map-outline map-region-line';
    let extra = '';
    if (wineRegion) {
      cls += ' map-region-path';
      extra = ` data-filter-region="${wineRegion}"`;
    }
    svg += `    <path id="fr-${id}" class="${cls}" aria-label="${name}" d="${d}"${extra} />\n`;
    franceCount++;
  }
  svg += `  </g>\n\n`;

  // 3) Italy — with region boundaries
  svg += `  <!-- Italy (regions) -->\n`;
  svg += `  <g id="country-italy" class="map-country-group" data-filter-country="Italy">\n`;
  let italyCount = 0;
  for (const feature of italyRegionsGeo.features) {
    const name = feature.properties.reg_name || feature.properties.name || feature.properties.NAME || feature.properties.NOME_REG;
    if (!name) continue;
    const d = geometryToPath(feature.geometry, projectEurope);
    if (!d) continue;
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const wineRegion = ITALY_WINE_MAP[name];
    let cls = 'map-outline map-region-line';
    let extra = '';
    if (wineRegion) {
      cls += ' map-region-path';
      extra = ` data-filter-region="${wineRegion}"`;
    }
    svg += `    <path id="it-${id}" class="${cls}" aria-label="${name}" d="${d}"${extra} />\n`;
    italyCount++;
  }
  svg += `  </g>\n\n`;

  // 4) South America Inset (Chile & Argentina side-by-side in Column 1 on Left)
  svg += `  <!-- South America Inset -->\n`;
  for (const feature of countriesGeo.features) {
    const name = feature.properties.ADMIN || feature.properties.NAME;
    if (name === 'Chile') {
      const d = geometryToPath(feature.geometry, projectSA);
      if (d) {
        svg += `  <!-- Chile -->\n`;
        svg += `  <g id="country-chile" class="map-country-group" data-filter-country="Chile">\n`;
        svg += `    <path class="map-outline map-country-fill" aria-label="Chile" d="${d}" />\n`;
        svg += `  </g>\n`;
      }
    } else if (name === 'Argentina') {
      const d = geometryToPath(feature.geometry, projectSA);
      if (d) {
        svg += `  <!-- Argentina -->\n`;
        svg += `  <g id="country-argentina" class="map-country-group" data-filter-country="Argentina">\n`;
        svg += `    <path class="map-outline map-country-fill" aria-label="Argentina" d="${d}" />\n`;
        svg += `  </g>\n`;
      }
    }
  }

  // 5) South Africa Inset (Column 3 Top)
  svg += `  <!-- South Africa Inset -->\n`;
  for (const feature of countriesGeo.features) {
    const name = feature.properties.ADMIN || feature.properties.NAME;
    if (name === 'South Africa') {
      const d = geometryToPath(feature.geometry, projectAfr);
      if (d) {
        svg += `  <g id="country-south-africa" class="map-country-group" data-filter-country="South Africa">\n`;
        svg += `    <path class="map-outline map-country-fill" aria-label="South Africa" d="${d}" />\n`;
        svg += `  </g>\n`;
      }
    }
  }

  // 6) Oceania Inset (Australia & New Zealand in Column 3 Bottom)
  svg += `  <!-- Oceania Inset -->\n`;
  for (const feature of countriesGeo.features) {
    const name = feature.properties.ADMIN || feature.properties.NAME;
    if (name === 'Australia') {
      const d = geometryToPath(feature.geometry, projectOceania);
      if (d) {
        svg += `  <!-- Australia -->\n`;
        svg += `  <g id="country-australia" class="map-country-group" data-filter-country="Australia">\n`;
        svg += `    <path class="map-outline map-country-fill" aria-label="Australia" d="${d}" />\n`;
        svg += `  </g>\n`;
      }
    } else if (name === 'New Zealand') {
      const d = geometryToPath(feature.geometry, projectOceania);
      if (d) {
        svg += `  <!-- New Zealand -->\n`;
        svg += `  <g id="country-new-zealand" class="map-country-group" data-filter-country="New Zealand">\n`;
        svg += `    <path class="map-outline map-country-fill" aria-label="New Zealand" d="${d}" />\n`;
        svg += `  </g>\n`;
      }
    }
  }

  // 7) Prominent Country Borders overlay for France and Italy
  svg += `  <!-- Country Border Overlays -->\n`;
  for (const feature of countriesGeo.features) {
    const name = feature.properties.ADMIN || feature.properties.NAME;
    if (name === 'France' || name === 'Italy') {
      const d = geometryToPath(feature.geometry, projectEurope);
      if (d) {
        svg += `  <path class="map-country-border" aria-label="${name} Outer Border" d="${d}" />\n`;
      }
    }
  }

  svg += `</svg>\n`;

  // ── Write output ──
  const outPath = path.join(FRONTEND_DIR, 'public/combined-europe.svg');
  fs.writeFileSync(outPath, svg);
  const sizeKB = (Buffer.byteLength(svg) / 1024).toFixed(1);
  console.log(`\n✓ Generated combined-europe.svg (${sizeKB} KB)`);

  // ── Print calculated pin positions ──
  const spots = {
    Champagne:      { type: 'europe', lon: 4.0, lat: 48.8 },
    Alsace:         { type: 'europe', lon: 7.3, lat: 48.3 },
    Loire:          { type: 'europe', lon: 0.7, lat: 47.4 },
    Bordeaux:       { type: 'europe', lon: -0.6, lat: 44.8 },
    Piedmont:       { type: 'europe', lon: 7.9, lat: 44.8 },
    Veneto:         { type: 'europe', lon: 11.8, lat: 45.5 },
    Friuli:         { type: 'europe', lon: 13.2, lat: 46.1 },
    Tuscany:        { type: 'europe', lon: 11.2, lat: 43.3 },
    Sicily:         { type: 'europe', lon: 14.0, lat: 37.6 },
    Germany:        { type: 'europe', lon: 10.4, lat: 50.8 },
    Austria:        { type: 'europe', lon: 14.5, lat: 47.6 },
    Spain:          { type: 'europe', lon: -3.7, lat: 40.5 },
    Chile:          { type: 'sa', lon: -71.5, lat: -34.0 },
    Argentina:      { type: 'sa', lon: -65.0, lat: -34.0 },
    'South Africa': { type: 'saf', lon: 22.0, lat: -31.0 },
    Australia:      { type: 'oceania', lon: 133.0, lat: -25.0 },
    'New Zealand':  { type: 'oceania', lon: 172.0, lat: -41.0 }
  };

  console.log('\nComputed Hotspot pin positions:');
  console.log('='.repeat(60));
  for (const [name, s] of Object.entries(spots)) {
    let x, y;
    if (s.type === 'europe') [x, y] = projectEurope(s.lon, s.lat);
    else if (s.type === 'sa') [x, y] = projectSA(s.lon, s.lat);
    else if (s.type === 'saf') [x, y] = projectAfr(s.lon, s.lat);
    else if (s.type === 'oceania') [x, y] = projectOceania(s.lon, s.lat);

    const pctLeft = (x / VBW * 100).toFixed(1);
    const pctTop = (y / VBH * 100).toFixed(1);
    console.log(`${name.padEnd(20)} left: ${pctLeft}%  top: ${pctTop}%`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
