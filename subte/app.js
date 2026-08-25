// Mapa en vivo de los subtes de Buenos Aires.
//
// La API entrega, por línea y sentido, el próximo arribo estimado en cada
// estación (cuantizado a 60 s). Cada tren aparece como un "mínimo local" en ese
// perfil: la estación cuyo próximo arribo es más inminente que el de la anterior.
// El array de Estaciones viene en orden de viaje; la última es la cabecera destino.
'use strict';

const FEED_MS = 15000;   // cada cuánto pedir datos nuevos
const TICK_MS = 1000;    // cada cuánto recalcular posiciones
const SEG_DEFAULT = 120; // segundos típicos entre estaciones (viaje + parada)
const STALE_S = 240;     // descartar arribos que quedaron muy atrás
const AGE_WARN = 300;    // desde acá avisamos que los datos vienen atrasados
const AGE_DEAD = 900;    // desde acá no mostramos trenes: no hay servicio en vivo
const LABEL_ZOOM = 15;   // zoom a partir del cual se ven los nombres de estación

// En localhost usamos el servidor propio (server.js); publicado como página
// estática (GitHub Pages) vamos a la API de Andén a través de un proxy CORS.
const IS_LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);
const UPSTREAM = 'https://anden.app/api/ba?ep=';
const CORS_PROXIES = [
  (u) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
  (u) => 'https://corsproxy.io/?url=' + encodeURIComponent(u),
];

async function apiFetch(ep) {
  if (IS_LOCAL) {
    const r = await fetch(ep === 'subte' ? '/api/subte' : '/api/alerts');
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }
  let lastErr;
  for (const wrap of CORS_PROXIES) {
    try {
      const r = await fetch(wrap(UPSTREAM + ep), { cache: 'no-store' });
      if (r.ok) return await r.json();
      lastErr = new Error(r.status);
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('sin conexión');
}

// --- nombres de estación ------------------------------------------------
// La API escribe los nombres de forma inconsistente ("Carlos Pelegrini" con una
// sola L, "Moreno" por "José M. Moreno", "Santa Fe" por "Santa Fe - Carlos
// Jáuregui"), así que el emparejamiento va en tres pasadas de menor a mayor
// tolerancia. Sin esto se pierden estaciones y los trenes quedan mal ubicados.

const FILLER = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'av', 'avda',
  'avenida', 'gral', 'general', 'pza', 'plaza', 'dr', 'pte', 'presidente',
  'estacion', 'mtro', 'ministro', 'don']);

function norm(s) {
  return String(s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function words(s) {
  return norm(s).split(' ').filter(Boolean);
}

// Clave compacta: sin palabras de relleno, sin espacios y con letras repetidas
// colapsadas, para que "Pelegrini" y "Pellegrini" caigan en la misma clave.
function compact(s) {
  const w = words(s).filter((t) => !FILLER.has(t));
  return (w.length ? w : words(s)).join('').replace(/(.)\1+/g, '$1');
}

const index = {}; // lineId -> { exact, comp, list }
for (const [lineId, line] of Object.entries(SUBTE)) {
  const exact = new Map(), comp = new Map(), dupes = new Set();
  line.estaciones.forEach((st, i) => {
    for (const alias of st.aliases) {
      exact.set(norm(alias), i);
      const c = compact(alias);
      if (comp.has(c) && comp.get(c) !== i) dupes.add(c); else comp.set(c, i);
    }
  });
  for (const d of dupes) comp.delete(d); // clave ambigua: mejor no usarla
  index[lineId] = {
    exact, comp,
    list: line.estaciones.map((st) => st.aliases.map(words)),
  };
}

const resolveCache = new Map();
function resolveStation(lineId, apiName) {
  const key = lineId + '|' + apiName;
  if (resolveCache.has(key)) return resolveCache.get(key);
  const ix = index[lineId];
  let hit = -1;
  if (ix) {
    const n = norm(apiName);
    if (ix.exact.has(n)) hit = ix.exact.get(n);
    if (hit < 0) {
      const c = compact(apiName);
      if (ix.comp.has(c)) hit = ix.comp.get(c);
    }
    if (hit < 0) {
      // último recurso: que los tokens de un nombre estén contenidos en el otro
      // ("Santa Fe" ⊂ "Santa Fe - Carlos Jáuregui"). Sólo si el ganador es único.
      const w = words(apiName).filter((t) => !FILLER.has(t));
      const found = [];
      ix.list.forEach((aliasWords, i) => {
        const ok = aliasWords.some((aw) => {
          const a = aw.filter((t) => !FILLER.has(t));
          if (!a.length || !w.length) return false;
          return a.every((t) => w.includes(t)) || w.every((t) => a.includes(t));
        });
        if (ok) found.push(i);
      });
      if (found.length === 1) hit = found[0];
    }
  }
  if (hit < 0) console.warn('[subte] estación sin ubicar:', lineId, apiName);
  resolveCache.set(key, hit);
  return hit;
}

// --- utilidades ---------------------------------------------------------

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const darkText = (color) => color.toLowerCase() === '#ffd200';

function etaText(s) {
  if (s <= 20) return 'llegando';
  if (s < 90) return `${Math.round(s)} s`;
  return `${Math.round(s / 60)} min`;
}

// --- mapa ---------------------------------------------------------------

const TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
};

let theme = localStorage.getItem('subte-theme') || 'dark';
document.body.classList.toggle('light', theme === 'light');

const map = L.map('map', { zoomControl: false, attributionControl: false })
  .setView([-34.607, -58.425], 13);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.control.attribution({ position: 'bottomleft', prefix: false })
  .addAttribution('© OpenStreetMap · © CARTO').addTo(map);

let tileLayer = L.tileLayer(TILES[theme], { maxZoom: 19 }).addTo(map);

function setTheme(next) {
  theme = next;
  localStorage.setItem('subte-theme', theme);
  document.body.classList.toggle('light', theme === 'light');
  map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(TILES[theme], { maxZoom: 19 }).addTo(map);
  tileLayer.bringToBack();
}

// Trazado de las líneas, al estilo del mapa oficial: una banda de color ancha
// con contorno debajo, y las estaciones como círculos blancos chicos que
// quedan dentro de la banda. El grosor acompaña al zoom para mantener la
// proporción del mapa impreso en cualquier acercamiento.
const lineLayers = {};
const stationMarkers = {};
const trazos = [];
const estacionCirculos = [];

const GROSOR = { 10: 7, 11: 9, 12: 13, 13: 18, 14: 24, 15: 30, 16: 36 };

function grosorActual() {
  const z = clamp(map.getZoom(), 10, 16);
  return GROSOR[Math.round(z)] || 18;
}

function restyleForZoom() {
  const w = grosorActual();
  for (const { casing, band } of trazos) {
    band.setStyle({ weight: w });
    casing.setStyle({ weight: w + Math.max(4, w * 0.28) });
  }
  // el círculo de estación entra dentro de la banda, pero bien visible
  const r = Math.max(3.2, w * 0.34);
  for (const m of estacionCirculos) m.setStyle({ radius: r, weight: Math.max(1.6, w * 0.12) });
  document.getElementById('map').style.setProperty('--luz', Math.max(11, w * 0.72) + 'px');
}

for (const [lineId, line] of Object.entries(SUBTE)) {
  const group = L.layerGroup().addTo(map);
  const coords = line.estaciones.map((s) => [s.lat, s.lng]);
  const style = { lineJoin: 'round', lineCap: 'round' };
  const casing = L.polyline(coords, { ...style, className: 'line-casing', opacity: 1 }).addTo(group);
  const band = L.polyline(coords, { ...style, color: line.color, opacity: 1 }).addTo(group);
  trazos.push({ casing, band });

  stationMarkers[lineId] = line.estaciones.map((st, i) => {
    const m = L.circleMarker([st.lat, st.lng], {
      className: 'station', color: line.color,
      fillOpacity: 1, bubblingMouseEvents: false,
    }).addTo(group);
    estacionCirculos.push(m);
    m.bindTooltip(st.name, { permanent: true, direction: 'right', className: 'st-label', offset: [7, 0] });
    m.bindPopup('', { className: 'st-popup', maxWidth: 300, autoPanPadding: [30, 30] });
    m.on('click', () => { openStation = { lineId, idx: i }; refreshPopup(m, lineId, i); });
    m.on('popupclose', () => { if (openStation && openStation.idx === i) openStation = null; });
    return m;
  });

  lineLayers[lineId] = { group, trains: new Map(), visible: true };
}

function applyLabelZoom() {
  document.getElementById('map').classList.toggle('labels', map.getZoom() >= LABEL_ZOOM);
}
map.on('zoomend', () => { applyLabelZoom(); restyleForZoom(); });
applyLabelZoom();
restyleForZoom();

// --- estado del feed ----------------------------------------------------

let feed = null;        // último JSON recibido
let feedClock = null;   // { serverTs, receivedAt } para reconstruir el "ahora" del feed
let profiles = null;    // feed traducido a índices de estación (se recalcula por feed)
let openStation = null; // { lineId, idx } de la estación con el popup abierto

const statusEl = document.getElementById('status');
const noticeEl = document.getElementById('notice');

// "Ahora" según el feed: su marca de tiempo más lo transcurrido desde que llegó.
function nowFeed() {
  if (!feedClock) return Date.now() / 1000;
  return feedClock.serverTs + (Date.now() - feedClock.receivedAt) / 1000;
}

// Cuán viejos son los datos, en segundos de reloj real.
function feedAge() {
  if (!feedClock) return Infinity;
  return Date.now() / 1000 - feedClock.serverTs;
}

// Traduce cada Entity a un perfil ordenado de {idx, eta} sobre nuestro recorrido.
function buildProfiles() {
  profiles = [];
  if (!feed) return;
  for (const ent of feed.Entity || []) {
    const lin = ent.Linea;
    if (!lin || !SUBTE[lin.Route_Id]) continue;
    const line = SUBTE[lin.Route_Id];
    const porIdx = new Map();
    for (const e of lin.Estaciones || []) {
      const idx = resolveStation(lin.Route_Id, e.stop_name);
      if (idx < 0 || !e.arrival?.time) continue;
      porIdx.set(idx, { idx, name: line.estaciones[idx].name, at: e.arrival.time });
    }
    const stops = [...porIdx.values()];
    if (stops.length < 2) continue;

    // El sentido de marcha se deduce por mayoría del orden en que vino el array
    // y después reordenamos por recorrido real: la API a veces manda estaciones
    // fuera de lugar, y siempre omite alguna (en la A saltea Alberti o Pasco).
    let asc = 0;
    for (let i = 1; i < stops.length; i++) asc += stops[i].idx > stops[i - 1].idx ? 1 : -1;
    const step = asc < 0 ? -1 : 1;
    stops.sort((a, b) => step * (a.idx - b.idx));

    // tiempo típico entre estaciones, según el propio perfil
    const diffs = [];
    for (let i = 1; i < stops.length; i++) {
      const d = stops[i].at - stops[i - 1].at;
      if (d > 20 && d < 400) diffs.push(d);
    }
    diffs.sort((a, b) => a - b);
    const seg = diffs.length ? diffs[Math.floor(diffs.length / 2)] : SEG_DEFAULT;

    profiles.push({
      lineId: lin.Route_Id, dir: lin.Direction_ID, line, stops, seg,
      destName: stops[stops.length - 1].name,
    });
  }
}

async function fetchFeed() {
  try {
    const data = await apiFetch('subte');
    if (!data || !Array.isArray(data.Entity)) throw new Error('formato');
    feed = data;
    feedClock = { serverTs: data.Header?.timestamp || Date.now() / 1000, receivedAt: Date.now() };
    resolveCache.clear();
    buildProfiles();
  } catch (e) {
    if (!feed) statusEl.textContent = 'Sin conexión con la API, reintentando…';
  }
}

// --- posición estimada de cada tren ------------------------------------

// Punto sobre el trazado de la línea a una fracción del camino entre dos
// estaciones, pasando por todas las intermedias. Es lo que mantiene la luz
// dentro del riel aunque el feed omita estaciones del medio.
function alongRoute(line, fromIdx, toIdx, frac) {
  const paso = toIdx >= fromIdx ? 1 : -1;
  const pts = [];
  for (let i = fromIdx; ; i += paso) {
    pts.push(line.estaciones[i]);
    if (i === toIdx) break;
  }
  if (pts.length < 2) {
    return { pos: [pts[0].lat, pts[0].lng], bearing: 0 };
  }

  const cos = Math.cos(pts[0].lat * Math.PI / 180);
  const largo = (a, b) => Math.hypot((b.lng - a.lng) * cos, b.lat - a.lat);
  const tramos = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = largo(pts[i - 1], pts[i]);
    tramos.push(d); total += d;
  }

  let objetivo = total * clamp(frac, 0, 1), acum = 0;
  for (let i = 0; i < tramos.length; i++) {
    if (acum + tramos[i] >= objetivo || i === tramos.length - 1) {
      const t = tramos[i] > 0 ? clamp((objetivo - acum) / tramos[i], 0, 1) : 0;
      const a = pts[i], b = pts[i + 1];
      const dy = b.lat - a.lat, dx = (b.lng - a.lng) * cos;
      return {
        pos: [lerp(a.lat, b.lat, t), lerp(a.lng, b.lng, t)],
        bearing: Math.round(Math.atan2(dx, dy) * 180 / Math.PI),
      };
    }
    acum += tramos[i];
  }
}

function trainPositions() {
  const out = [];
  // Sin datos frescos no dibujamos trenes: en su lugar las líneas quedan
  // centelleando (ver setSparks), que no miente sobre dónde está cada tren.
  if (!profiles || feedAge() > AGE_DEAD) return out;
  const now = nowFeed();

  for (const p of profiles) {
    const { stops, line, seg } = p;
    for (let k = 0; k < stops.length; k++) {
      const eta = stops[k].at - now;
      const isRunStart = k === 0 || eta < stops[k - 1].at - now;
      if (!isRunStart) continue;
      if (eta < -STALE_S) continue;        // dato viejo
      if (k === 0 && eta > seg * 1.5) continue; // en cabecera: sólo si está por salir
      if (eta > seg * 2.5) continue;       // demasiado lejos para ubicarlo

      let punto;
      if (k === 0) {
        // en cabecera: sobre la estación, ya apuntando hacia la siguiente
        punto = alongRoute(line, stops[0].idx, stops[1].idx, 0);
      } else {
        // Entre dos estaciones del feed puede faltar alguna, así que la luz
        // recorre el trazado real pasando por las intermedias, y el tiempo del
        // tramo se escala con la cantidad de estaciones que hay en el medio.
        const desde = stops[k - 1].idx, hasta = stops[k].idx;
        const saltos = Math.max(1, Math.abs(hasta - desde));
        punto = alongRoute(line, desde, hasta, clamp(1 - eta / (seg * saltos), 0, 1));
      }

      out.push({
        id: `${p.lineId}_${p.dir}_${k}`, lineId: p.lineId, line,
        pos: punto.pos, bearing: punto.bearing,
        destName: p.destName, nextName: stops[k].name, etaS: Math.max(0, Math.round(eta)),
      });
    }
  }
  return out;
}

// --- próximos arribos en una estación, por sentido ---------------------

function stationArrivals(lineId, idx) {
  const res = [];
  if (!profiles || feedAge() > AGE_DEAD) return res;
  const now = nowFeed();

  for (const p of profiles) {
    if (p.lineId !== lineId) continue;
    const pos = p.stops.findIndex((s) => s.idx === idx);
    if (pos < 0) continue;
    const eta = p.stops[pos].at - now;
    if (eta < -60) continue;

    // El tren siguiente es el que hoy viene detrás: el arranque de recorrido
    // anterior al que atiende esta estación. Su llegada acá es estimada.
    let runStart = pos;
    while (runStart > 0 && p.stops[runStart].at >= p.stops[runStart - 1].at) runStart--;
    let prevRun = runStart - 1;
    while (prevRun > 0 && p.stops[prevRun].at >= p.stops[prevRun - 1].at) prevRun--;
    let following = null;
    if (runStart > 0 && prevRun >= 0) {
      const est = (p.stops[prevRun].at - now) + (pos - prevRun) * p.seg;
      // más allá de ~25 min la estimación acumula demasiado error: no la mostramos
      if (est > eta + 30 && est < 1500) following = est;
    }

    res.push({ destName: p.destName, etaS: Math.max(0, eta), following });
  }
  res.sort((a, b) => a.etaS - b.etaS);
  return res;
}

function refreshPopup(marker, lineId, idx) {
  const line = SUBTE[lineId];
  const st = line.estaciones[idx];
  const arrivals = stationArrivals(lineId, idx);

  let body;
  if (!arrivals.length) {
    const why = feedAge() > AGE_DEAD
      ? 'No hay datos en vivo en este momento.'
      : `La API no está informando arribos de la línea ${line.letra} ahora.`;
    body = `<div class="pop-empty">${why}</div>`;
  } else {
    body = arrivals.map((a) => `
      <div class="pop-dir">
        <div class="pop-dest">→ ${a.destName}</div>
        <div class="pop-eta">${etaText(a.etaS)}${
          a.following ? `<span class="pop-next">· luego ~${etaText(a.following)}</span>` : ''
        }</div>
      </div>`).join('');
  }

  marker.setPopupContent(
    `<div class="pop-head" style="--c:${line.color}">
       <span class="pop-letter${darkText(line.color) ? ' dark' : ''}">${line.letra}</span>
       <span class="pop-name">${st.name}</span>
     </div>${body}`
  );
  if (!marker.isPopupOpen()) marker.openPopup();
}

// --- render -------------------------------------------------------------

// Cada tren es una luz titilante que viaja por dentro del trazo de su línea:
// un núcleo blanco que late, un anillo de radar que se expande y una flecha
// mínima adelante marcando el sentido de marcha.
function trainIcon(line, bearing, id) {
  const d = (Math.abs(hash(id)) % 24) / 10; // desfasa los pulsos entre trenes
  return L.divIcon({
    className: 'train-marker',
    iconSize: [64, 64], iconAnchor: [32, 32],
    html: `<div class="tr" style="--c:${line.color};animation-delay:${d / 2}s">
             <div class="ping" style="animation-delay:${d}s"></div>
             <div class="disc"></div>
             <div class="rot" style="transform:rotate(${bearing}deg)">
               <div class="chev"></div>
             </div>
           </div>`,
  });
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function tooltipHtml(t) {
  return `<b style="color:${t.line.color}">Línea ${t.line.letra}</b> → ${t.destName}<br>` +
         `<span class="tip-sub">Próxima: ${t.nextName} · ${etaText(t.etaS)}</span>`;
}

function render() {
  const trains = trainPositions();
  const seen = new Set();
  const counts = {};

  for (const t of trains) {
    counts[t.lineId] = (counts[t.lineId] || 0) + 1;
    if (!lineLayers[t.lineId].visible) continue;
    seen.add(t.id);
    const layer = lineLayers[t.lineId];
    let m = layer.trains.get(t.id);
    if (!m) {
      m = L.marker(t.pos, { icon: trainIcon(t.line, t.bearing, t.id), zIndexOffset: 1000 })
        .bindTooltip('', { className: 'subte-tip', direction: 'top', offset: [0, -14] })
        .addTo(layer.group);
      layer.trains.set(t.id, m);
    } else {
      m.setLatLng(t.pos);
      const rot = m.getElement()?.querySelector('.rot');
      if (rot) rot.style.transform = `rotate(${t.bearing}deg)`;
    }
    m.setTooltipContent(tooltipHtml(t));
  }

  for (const layer of Object.values(lineLayers)) {
    for (const [id, m] of layer.trains) {
      if (!seen.has(id)) { layer.group.removeLayer(m); layer.trains.delete(id); }
    }
  }

  // líneas que el feed directamente no informa (pasa seguido con la C y la H)
  const reported = new Set((profiles || []).map((p) => p.lineId));
  updateChips(counts, reported);
  updateStatus(reported);
  if (openStation) {
    const m = stationMarkers[openStation.lineId][openStation.idx];
    if (m.isPopupOpen()) refreshPopup(m, openStation.lineId, openStation.idx);
  }
}

function updateStatus(reported) {
  const age = feedAge();
  if (!feedClock) return;
  const hora = new Date(feedClock.serverTs * 1000)
    .toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

  setSparks(age > AGE_DEAD);

  if (age > AGE_DEAD) {
    statusEl.textContent = `Sin datos en vivo · última actualización ${hora}`;
    notice('sin-datos', `La API dejó de actualizar a las ${hora}. Fuera del horario de ` +
      `servicio (aprox. 5:00 a 23:00) la fuente deja de informar posiciones.`);
    mostrarModal(hora);
  } else if (age > AGE_WARN) {
    statusEl.textContent = `Datos de las ${hora} (${Math.round(age / 60)} min de atraso)`;
    notice('atraso', `Los datos vienen con ${Math.round(age / 60)} minutos de atraso.`);
  } else {
    statusEl.textContent = `En vivo · actualizado ${hora}`;
    const faltan = Object.keys(SUBTE).filter((id) => !reported.has(id));
    if (faltan.length) {
      const letras = faltan.map((id) => SUBTE[id].letra).join(', ');
      notice('sin-linea', `La API no está informando trenes de la línea ${letras} ` +
        `en este momento. El recorrido igual se muestra en el mapa.`);
    } else {
      notice(null);
    }
  }
}

// Aviso destacado la primera vez que se detecta que la fuente no actualiza.
let modalVisto = false;
function mostrarModal(hora) {
  if (modalVisto) return;
  modalVisto = true;
  document.getElementById('modal-hora').textContent = hora;
  document.getElementById('modal').hidden = false;
}
function cerrarModal() { document.getElementById('modal').hidden = true; }
document.getElementById('modal-ok').onclick = cerrarModal;
document.getElementById('modal').onclick = (e) => { if (e.target.id === 'modal') cerrarModal(); };
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });

let noticeKind = 'init';
function notice(kind, text) {
  if (kind === noticeKind) return;
  noticeKind = kind;
  noticeEl.innerHTML = kind ? `<div class="notice">${text}</div>` : '';
}

// --- chips de líneas ----------------------------------------------------

const chipsEl = document.getElementById('chips');
const chipEls = {};
for (const [lineId, line] of Object.entries(SUBTE)) {
  const el = document.createElement('button');
  el.className = 'chip';
  el.style.setProperty('--c', line.color);
  el.innerHTML = `<span class="dot${darkText(line.color) ? ' dark' : ''}">${line.letra}</span><span class="n">–</span>`;
  el.title = `Mostrar u ocultar la línea ${line.letra}`;
  el.onclick = () => {
    const layer = lineLayers[lineId];
    layer.visible = !layer.visible;
    el.classList.toggle('off', !layer.visible);
    if (layer.visible) layer.group.addTo(map); else map.removeLayer(layer.group);
  };
  chipsEl.appendChild(el);
  chipEls[lineId] = el;
}

function updateChips(counts, reported) {
  for (const [lineId, el] of Object.entries(chipEls)) {
    const n = counts[lineId] || 0;
    const sinDatos = !reported.has(lineId);
    el.querySelector('.n').textContent = sinDatos ? '–' : n;
    el.classList.toggle('nodata', sinDatos);
    el.title = sinDatos
      ? `La API no informa trenes de la línea ${SUBTE[lineId].letra} ahora`
      : `${n} ${n === 1 ? 'tren' : 'trenes'} en la línea ${SUBTE[lineId].letra}`;
  }
}

document.getElementById('theme').onclick = () => setTheme(theme === 'dark' ? 'light' : 'dark');

// --- alertas de servicio ------------------------------------------------

const alertsEl = document.getElementById('alerts');
async function fetchAlerts() {
  try {
    const data = await apiFetch('subte-alerts');
    const items = [];
    for (const e of data.entity || []) {
      const a = e.alert;
      if (!a) continue;
      const routeId = a.informed_entity?.[0]?.route_id || '';
      const line = SUBTE[routeId];
      const text = a.header_text?.translation?.find((t) => t.language === 'es')?.text
        || a.header_text?.translation?.[0]?.text || '';
      if (text) items.push({ line, text });
    }
    alertsEl.innerHTML = items.map((i) => {
      const c = i.line ? i.line.color : '#888';
      return `<div class="alert-item"><b style="background:${c}${
        i.line && darkText(i.line.color) ? ';color:#14161a' : ''
      }">${i.line ? i.line.letra : '!'}</b><span>${i.text}</span></div>`;
    }).join('');
  } catch (e) { /* silencioso: las alertas son secundarias */ }
}

// --- destellos de carga -------------------------------------------------
// Mientras llegan los datos, las seis líneas centellean enteras: puntitos
// blancos que prenden y apagan al azar, como la torre Eiffel a la hora en punto.

// También quedan encendidos cuando la fuente no informa: en vez de un mapa
// muerto, las líneas laten solas hasta que vuelven los datos.

let sparkLayer = null;
let sparksOn = false;

function setSparks(on) {
  if (on === sparksOn) return;
  sparksOn = on;
  if (on) startSparks(); else stopSparks();
}

// Recorre la línea dando pasos de largo aleatorio. Si los destellos quedan a
// distancia pareja, la fila regular se lee como una ola que viaja; con el
// espaciado desparejo esa sensación de dirección desaparece.
function pointsAlong(coords, minM, maxM) {
  const pts = [];
  let paso = minM + Math.random() * (maxM - minM);
  for (let i = 1; i < coords.length; i++) {
    const a = L.latLng(coords[i - 1]), b = L.latLng(coords[i]);
    const largo = a.distanceTo(b);
    let rec = 0;
    while (rec + paso <= largo) {
      rec += paso;
      const t = rec / largo;
      pts.push([a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t]);
      paso = minM + Math.random() * (maxM - minM);
    }
    paso -= largo - rec; // el sobrante sigue en el tramo siguiente
  }
  return pts;
}

let sparkPaths = [];
let sparkTimer = null;

const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startSparks() {
  sparkLayer = L.layerGroup().addTo(map);
  sparkPaths = [];
  for (const line of Object.values(SUBTE)) {
    const coords = line.estaciones.map((s) => [s.lat, s.lng]);
    for (const p of pointsAlong(coords, 60, 340)) {
      const m = L.circleMarker(p, {
        className: 'spark', radius: 1.8 + Math.random() * 2.8,
        stroke: false, fillOpacity: 1, interactive: false,
      }).addTo(sparkLayer);
      if (!m._path) continue;
      m._path.style.opacity = quieto ? 0.45 : 0;
      sparkPaths.push(m._path);
    }
  }
  // Cada destello se dispara por sorteo, no por un ciclo que se repite: así
  // ninguna luz tiene ritmo propio y no se arma ningún patrón (torre Eiffel).
  if (!quieto) sparkTimer = setInterval(fireSparks, 70);
}

function fireSparks() {
  if (!sparkPaths.length) return;
  const cuantos = 3 + Math.floor(Math.random() * 8);
  for (let i = 0; i < cuantos; i++) {
    const el = sparkPaths[(Math.random() * sparkPaths.length) | 0];
    el.animate(
      [{ opacity: 0 },
       { opacity: 0.85 + Math.random() * 0.15, offset: 0.15 + Math.random() * 0.25 },
       { opacity: 0 }],
      { duration: 240 + Math.random() * 780, easing: 'ease-out' },
    );
  }
}

function stopSparks() {
  if (sparkTimer) { clearInterval(sparkTimer); sparkTimer = null; }
  if (!sparkLayer) return;
  const layer = sparkLayer;
  sparkLayer = null;
  sparkPaths = [];
  setTimeout(() => map.removeLayer(layer), 900); // deja terminar los que están prendidos
}

// --- arranque -----------------------------------------------------------

const MIN_INTRO_MS = 1600; // que el centelleo alcance a verse aunque cargue rápido

setSparks(true);
Promise.all([
  fetchFeed(),
  new Promise((r) => setTimeout(r, MIN_INTRO_MS)),
]).then(() => {
  render(); // decide solo si apagar el centelleo o dejarlo (ver setSparks)
  setInterval(fetchFeed, FEED_MS);
  setInterval(render, TICK_MS);
});

fetchAlerts();
setInterval(fetchAlerts, 60000);
