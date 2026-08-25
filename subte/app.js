// Mapa en vivo de los subtes de Buenos Aires.
// La API entrega, por línea y sentido, el próximo arribo estimado en cada estación
// (cuantizado a 60 s). Cada tren aparece como un "mínimo local" en ese perfil:
// la estación donde el próximo arribo es más inminente que en las vecinas.
// El array de Estaciones viene en orden de viaje; la última es la cabecera destino.
'use strict';

const FEED_MS = 15000;   // cada cuánto pedir datos nuevos

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
const TICK_MS = 1000;    // cada cuánto recalcular posiciones
const SEG_DEFAULT = 120; // segundos típicos entre estaciones (viaje + parada)
const STALE_S = 240;     // descartar viajes cuyo último arribo quedó muy atrás

// --- utilidades ---------------------------------------------------------

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[.\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

// índice por línea: nombre normalizado -> posición en el recorrido
const lookup = {};
for (const [lineId, line] of Object.entries(SUBTE)) {
  lookup[lineId] = {};
  line.estaciones.forEach((st, i) => {
    for (const k of st.keys) lookup[lineId][k] = i;
  });
}

// --- mapa ---------------------------------------------------------------

const map = L.map('map', { zoomControl: false }).setView([-34.615, -58.42], 13);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap · © CARTO',
  maxZoom: 19,
}).addTo(map);

const lineLayers = {};
for (const [lineId, line] of Object.entries(SUBTE)) {
  const group = L.layerGroup().addTo(map);
  const coords = line.estaciones.map((s) => [s.lat, s.lng]);
  L.polyline(coords, { color: line.color, weight: 4, opacity: 0.75 }).addTo(group);
  for (const st of line.estaciones) {
    L.circleMarker([st.lat, st.lng], {
      radius: 3.5, color: line.color, weight: 1.5, fillColor: '#14161a', fillOpacity: 1,
    }).bindTooltip(`${st.name} · Línea ${line.letra}`, { className: 'subte-tip' }).addTo(group);
  }
  lineLayers[lineId] = { group, trains: new Map(), visible: true };
}

// --- estado del feed ----------------------------------------------------

let feed = null;       // último JSON recibido
let feedClock = null;  // { serverTs, receivedAt } para estimar "ahora" del lado del servidor
const statusEl = document.getElementById('status');

function nowServer() {
  if (!feedClock) return Date.now() / 1000;
  return feedClock.serverTs + (Date.now() - feedClock.receivedAt) / 1000;
}

async function fetchFeed() {
  try {
    const data = await apiFetch('subte');
    if (!data || !Array.isArray(data.Entity)) throw new Error('formato');
    feed = data;
    feedClock = { serverTs: data.Header?.timestamp || Date.now() / 1000, receivedAt: Date.now() };
    statusEl.textContent = `Actualizado ${new Date().toLocaleTimeString('es-AR')} · datos: Transporte BA`;
  } catch (e) {
    statusEl.textContent = 'Sin conexión con la API, reintentando…';
  }
}

// --- posición estimada de cada tren ------------------------------------

function trainPositions() {
  const out = [];
  if (!feed) return out;
  const now = nowServer();

  for (const ent of feed.Entity) {
    const lin = ent.Linea;
    if (!lin) continue;
    const lineId = lin.Route_Id;
    const line = SUBTE[lineId];
    if (!line) continue;

    // estaciones del recorrido (en orden de viaje) que pudimos ubicar en el mapa
    const stops = [];
    for (const e of lin.Estaciones || []) {
      const idx = lookup[lineId][norm(e.stop_name)];
      if (idx === undefined || !e.arrival?.time) continue;
      stops.push({ idx, name: line.estaciones[idx].name, eta: e.arrival.time - now });
    }
    if (stops.length < 2) continue;

    const destName = stops[stops.length - 1].name;

    // Un tren = cada punto donde el perfil de arribos "cae": la estación k tiene
    // un arribo más próximo que la anterior, o sea hay un tren justo antes de k.
    for (let k = 0; k < stops.length; k++) {
      const isStart = k === 0 || stops[k].eta < stops[k - 1].eta;
      if (!isStart) continue;
      const eta = stops[k].eta;
      if (eta < -STALE_S) continue;           // dato viejo
      if (k === 0 && eta > 150) continue;     // en cabecera: solo si está por salir
      if (eta > 360) continue;                // demasiado lejos para ubicarlo

      const nextSt = line.estaciones[stops[k].idx];
      let pos, from;
      if (k === 0) {
        pos = [nextSt.lat, nextSt.lng];
        const after = line.estaciones[stops[1].idx];
        from = [2 * nextSt.lat - after.lat, 2 * nextSt.lng - after.lng]; // apunta hacia adelante
      } else {
        const prevSt = line.estaciones[stops[k - 1].idx];
        const frac = clamp(1 - eta / SEG_DEFAULT, 0, 1);
        pos = [lerp(prevSt.lat, nextSt.lat, frac), lerp(prevSt.lng, nextSt.lng, frac)];
        from = [prevSt.lat, prevSt.lng];
      }

      // rumbo en grados (0 = norte, sentido horario) para la flecha del marcador
      const dy = nextSt.lat - from[0];
      const dx = (nextSt.lng - from[1]) * Math.cos(nextSt.lat * Math.PI / 180);
      const bearing = Math.round(Math.atan2(dx, dy) * 180 / Math.PI);

      out.push({
        id: `${lineId}_${lin.Direction_ID}_${k}`, lineId, line, pos, bearing,
        destName, nextName: stops[k].name, etaS: Math.max(0, Math.round(eta)),
      });
    }
  }
  return out;
}

// --- render -------------------------------------------------------------

function darkText(color) { return color.toLowerCase() === '#ffd200'; }

function trainIcon(line, bearing) {
  return L.divIcon({
    className: 'train-marker',
    iconSize: [34, 34],
    html: `<div class="hdg" style="transform:rotate(${bearing}deg)"><div class="tip"></div></div>` +
          `<div class="train ${darkText(line.color) ? 'dark' : ''}" style="background:${line.color}">${line.letra}</div>`,
  });
}

function tooltipHtml(t) {
  const eta = t.etaS <= 5 ? 'en estación' : t.etaS < 90 ? `llega en ${t.etaS} s` : `llega en ${Math.round(t.etaS / 60)} min`;
  return `<b>Línea ${t.line.letra} → ${t.destName}</b><br>` +
         `Próxima: ${t.nextName} <span class="eta">(${eta})</span>`;
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
      m = L.marker(t.pos, { icon: trainIcon(t.line, t.bearing), zIndexOffset: 1000 })
        .bindTooltip('', { className: 'subte-tip', direction: 'top', offset: [0, -14] })
        .addTo(layer.group);
      layer.trains.set(t.id, m);
    } else {
      m.setLatLng(t.pos);
      const hdg = m.getElement()?.querySelector('.hdg');
      if (hdg) hdg.style.transform = `rotate(${t.bearing}deg)`;
    }
    m.setTooltipContent(tooltipHtml(t));
  }

  // sacar trenes que ya no vienen en el feed
  for (const layer of Object.values(lineLayers)) {
    for (const [id, m] of layer.trains) {
      if (!seen.has(id)) { layer.group.removeLayer(m); layer.trains.delete(id); }
    }
  }

  updateChips(counts);
}

// --- chips de líneas ----------------------------------------------------

const chipsEl = document.getElementById('chips');
const chipEls = {};
for (const [lineId, line] of Object.entries(SUBTE)) {
  const el = document.createElement('div');
  el.className = 'chip';
  el.innerHTML = `<span class="dot" style="background:${line.color};color:${darkText(line.color) ? '#14161a' : '#fff'}">${line.letra}</span><span class="n">–</span>`;
  el.title = `Mostrar/ocultar Línea ${line.letra}`;
  el.onclick = () => {
    const L2 = lineLayers[lineId];
    L2.visible = !L2.visible;
    el.classList.toggle('off', !L2.visible);
    if (L2.visible) L2.group.addTo(map); else map.removeLayer(L2.group);
  };
  chipsEl.appendChild(el);
  chipEls[lineId] = el;
}

function updateChips(counts) {
  for (const [lineId, el] of Object.entries(chipEls)) {
    el.querySelector('.n').textContent = counts[lineId] || 0;
  }
}

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
      if (text) items.push({ letra: line ? line.letra : '', text });
    }
    alertsEl.innerHTML = items.map((i) =>
      `<div class="alert-item"><b>${i.letra ? 'Línea ' + i.letra + ':' : 'Subte:'}</b><span>${i.text}</span></div>`
    ).join('');
  } catch (e) { /* silencioso */ }
}

// --- arranque -----------------------------------------------------------

fetchFeed().then(render);
fetchAlerts();
setInterval(fetchFeed, FEED_MS);
setInterval(render, TICK_MS);
setInterval(fetchAlerts, 60000);
