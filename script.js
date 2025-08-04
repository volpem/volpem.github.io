// Sincronizar sliders y cajas de texto en columna de parámetros
document.addEventListener('DOMContentLoaded', function() {
  const paramSliders = [
    {slider: 'pared_slider', input: 'pared'},
    {slider: 'alturaCapa_slider', input: 'alturaCapa'},
    {slider: 'camaX_slider', input: 'camaX'},
    {slider: 'camaY_slider', input: 'camaY'},
    {slider: 'tempExtrusor_slider', input: 'tempExtrusor'},
    {slider: 'tempCama_slider', input: 'tempCama'},
    {slider: 'flujo_slider', input: 'flujo'},
    {slider: 'flujoMax_slider', input: 'flujoMax'},
    {slider: 'fanCapa_slider', input: 'fanCapa'},
    {slider: 'vueltasTranslacion_slider', input: 'vueltasTranslacion'},
    {slider: 'moduloDesfase_slider', input: 'moduloDesfase'},
    {slider: 'diametroGiro_slider', input: 'diametroGiro'}
  ];
  paramSliders.forEach(({slider, input}) => {
    const s = document.getElementById(slider);
    const i = document.getElementById(input);
    if (s && i) {
      s.addEventListener('input', function() {
        i.value = s.value;
      });
      i.addEventListener('input', function() {
        let v = parseFloat(i.value);
        if (!isNaN(v)) {
          if (v < parseFloat(s.min)) v = parseFloat(s.min);
          if (v > parseFloat(s.max)) v = parseFloat(s.max);
          s.value = v;
          i.value = v;
        }
      });
    }
  });
});
// Sincronizar sliders horizontales y valores editables
document.addEventListener('DOMContentLoaded', function() {
  for (let i = 0; i <= 4; i++) {
    const slider = document.getElementById('perfil' + i);
    const input = document.getElementById('perfil' + i + '_val');
    if (slider && input) {
      slider.addEventListener('input', function() {
        input.value = slider.value;
      });
      input.addEventListener('input', function() {
        let v = parseInt(input.value, 10);
        if (!isNaN(v)) {
          if (v < parseInt(slider.min, 10)) v = parseInt(slider.min, 10);
          if (v > parseInt(slider.max, 10)) v = parseInt(slider.max, 10);
          slider.value = v;
          input.value = v;
        }
      });
    }
  }
});
// Sincronizar slider vertical y valor editable
document.addEventListener('DOMContentLoaded', function() {
  var slider = document.getElementById('alturaSlider');
  var input = document.getElementById('alturaSlider_val');
  if (slider && input) {
    slider.addEventListener('input', function() {
      input.value = slider.value;
    });
    input.addEventListener('input', function() {
      let v = parseInt(input.value, 10);
      if (!isNaN(v)) {
        if (v < parseInt(slider.min, 10)) v = parseInt(slider.min, 10);
        if (v > parseInt(slider.max, 10)) v = parseInt(slider.max, 10);
        slider.value = v;
        input.value = v;
      }
    });
  }
});

// --- Sliders para perfil de revolución ---
// Slider vertical de altura
const alturaSlider = document.getElementById('alturaSlider');
const alturaSliderVal = document.getElementById('alturaSlider_val');

// El valor de altura se toma solo del slider
alturaSlider.addEventListener('input', function() {
  alturaSliderVal.textContent = alturaSlider.value;
  drawPerfil();
});
// Inicializar valor
alturaSliderVal.textContent = alturaSlider.value;
const perfilSliders = [
  document.getElementById('perfil4'),
  document.getElementById('perfil3'),
  document.getElementById('perfil2'),
  document.getElementById('perfil1'),
  document.getElementById('perfil0')
];
const perfilLabels = [
  document.getElementById('perfil4_val'),
  document.getElementById('perfil3_val'),
  document.getElementById('perfil2_val'),
  document.getElementById('perfil1_val'),
  document.getElementById('perfil0_val')
];

const perfilTitles = ['Top', '3/4', 'Mitad', '1/4', 'Base'];

// Actualizar los subtítulos en el DOM al cargar (solo una vez)
perfilLabels.forEach((label, i) => {
  label.previousElementSibling.textContent = perfilTitles[i];
});
const perfilCanvas = document.getElementById('perfilCanvas');
const perfilCtx = perfilCanvas.getContext('2d');


function drawPerfil() {
  perfilCtx.clearRect(0, 0, perfilCanvas.width, perfilCanvas.height);
  // Parámetros de canvas
  const canvasW = perfilCanvas.width;
  const canvasH = perfilCanvas.height;
  const margen = 20;
  const cx = canvasW / 2;
  // Altura total en mm desde el slider
  const alturaTotal = parseFloat(alturaSlider.value) || 200;
  // Diámetros del perfil
  const diametros = perfilSliders.map(s => parseFloat(s.value));
  // Escala vertical: ajusta para usar todo el canvas menos márgenes
  const escalaY = (canvasH - 2 * margen) / alturaTotal;
  // Escala horizontal: ajusta para que el diámetro máximo no se salga del canvas
  const diametroMax = Math.max(...diametros);
  const escalaX = (canvasW/2 - margen) / (diametroMax/2);
  // Usar la escala mínima para que el perfil siempre quepa en el canvas
  const escala = Math.min(escalaX, escalaY);
  // Alturas en mm para cada fracción
  const alturasMM = [0, 0.25, 0.5, 0.75, 1].map(f => f * alturaTotal);
  // Alturas en px (canvas, base abajo)
  const alturas = alturasMM.map(h => canvasH - margen - h * escala);
  // Perfil derecho
  const puntosDer = diametros.map((d, i) => ({
    x: cx + (d / 2) * escala,
    y: alturas[i]
  }));
  // Perfil izquierdo (simétrico)
  const puntosIzq = diametros.map((d, i) => ({
    x: cx - (d / 2) * escala,
    y: alturas[i]
  }));

  // Cuadrícula de escala: líneas cada 10mm, etiquetas cada 50mm, siempre ocupando todo el canvas
  perfilCtx.save();
  perfilCtx.setLineDash([]); // líneas sólidas
  const gridStep = 10;
  const labelStep = 50;
  // Asegurar que se cubra toda la altura, sumando 1 para incluir la última línea
  const gridYCount = Math.ceil((canvasH - 2 * margen) / (gridStep * escala)) + 1;
  // Líneas horizontales (altura)
  for (let i = 0; i <= gridYCount; i++) {
    const mm = i * gridStep;
    const y = canvasH - margen - mm * escala;
    // Solo dibujar si la línea está dentro del área visible del canvas
    if (y >= margen - 1 && y <= canvasH - margen + 1) {
      perfilCtx.beginPath();
      perfilCtx.moveTo(margen, y);
      perfilCtx.lineTo(canvasW - margen, y);
      if (mm % labelStep === 0) {
        perfilCtx.strokeStyle = '#aaa';
        perfilCtx.lineWidth = 1.2;
      } else {
        perfilCtx.strokeStyle = '#ccc';
        perfilCtx.lineWidth = 0.5;
      }
      perfilCtx.stroke();
    }
    // Etiquetas: siempre dibujar la de 0mm en el borde inferior aunque la línea esté fuera
    if (mm % labelStep === 0) {
      perfilCtx.font = '12px Arial';
      perfilCtx.fillStyle = '#888';
      const label = `${mm}mm`;
      const labelHeight = 12; // Aproximado para Arial 12px
      let labelY = y - 4; // 4px por encima de la línea
      if (labelY - labelHeight < 0) {
        labelY = y + labelHeight + 2;
      }
      // Si es la etiqueta de 0mm, SIEMPRE dibujarla en el borde inferior
      if (mm === 0) {
        labelY = canvasH - margen - 4;
      }
      if (labelY < canvasH - margen + labelHeight && labelY > 0) {
        perfilCtx.fillText(label, 2, labelY);
      }
    }
  }
  // Líneas verticales (diámetro)
  // Calcular el rango de mm para cubrir todo el canvas, asegurando que el 0 siempre esté incluido
  const mmMin = Math.ceil(-(cx - margen) / escala / gridStep) * gridStep;
  const mmMax = Math.floor((canvasW - margen - cx) / escala / gridStep) * gridStep;
  for (let mm = mmMin; mm <= mmMax; mm += gridStep) {
    const x = cx + mm * escala;
    // Solo dibujar si la línea está dentro del área visible del canvas
    if (x >= margen - 1 && x <= canvasW - margen + 1) {
      perfilCtx.beginPath();
      perfilCtx.moveTo(x, margen);
      perfilCtx.lineTo(x, canvasH - margen);
      if (mm % labelStep === 0) {
        perfilCtx.strokeStyle = '#aaa';
        perfilCtx.lineWidth = 1.2;
      } else {
        perfilCtx.strokeStyle = '#ccc';
        perfilCtx.lineWidth = 0.5;
      }
      perfilCtx.stroke();
      // Etiquetas eje horizontal (radios)
      if (mm % labelStep === 0) {
        perfilCtx.font = '12px Arial';
        perfilCtx.fillStyle = '#888';
        let label;
        let labelWidth;
        let labelX;
        if (mm === 0) {
          label = '0';
          labelWidth = perfilCtx.measureText(label).width;
          labelX = cx - labelWidth/2;
        } else {
          label = `⌀${Math.abs(mm*2)}mm`;
          labelWidth = perfilCtx.measureText(label).width;
          labelX = x - labelWidth/2;
        }
        // Si es la etiqueta de 0, SIEMPRE dibujarla en el centro
        if (mm === 0) {
          perfilCtx.fillText(label, labelX, canvasH - 4);
        } else if (labelX + labelWidth > margen && labelX < canvasW - margen) {
          perfilCtx.fillText(label, labelX, canvasH - 4);
        }
      }
    }
  }
  perfilCtx.restore();

  // Eje vertical al centro en verde
  perfilCtx.save();
  perfilCtx.strokeStyle = '#0a0';
  perfilCtx.lineWidth = 2;
  perfilCtx.beginPath();
  perfilCtx.moveTo(cx, margen);
  perfilCtx.lineTo(cx, canvasH - margen);
  perfilCtx.stroke();
  perfilCtx.restore();

  // Eje vertical al centro
  perfilCtx.strokeStyle = '#aaa';
  perfilCtx.lineWidth = 1;
  perfilCtx.beginPath();
  perfilCtx.moveTo(cx, margen);
  perfilCtx.lineTo(cx, canvasH - margen);
  perfilCtx.stroke();

  // Función para dibujar una curva Hermite tangente en los puntos
  function drawHermite(ctx, pts) {
    ctx.strokeStyle = '#0077ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    // Calcular tangentes
    const tangentes = [];
    for (let i = 0; i < pts.length; i++) {
      if (i === 0)
        tangentes[i] = { x: (pts[1].x - pts[0].x), y: (pts[1].y - pts[0].y) };
      else if (i === pts.length - 1)
        tangentes[i] = { x: (pts[i].x - pts[i-1].x), y: (pts[i].y - pts[i-1].y) };
      else
        tangentes[i] = { x: (pts[i+1].x - pts[i-1].x)/2, y: (pts[i+1].y - pts[i-1].y)/2 };
    }
    // Hermite interpolation
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i+1];
      const m0 = tangentes[i];
      const m1 = tangentes[i+1];
      for (let t = 0; t <= 1; t += 0.05) {
        const h00 = 2*t*t*t - 3*t*t + 1;
        const h10 = t*t*t - 2*t*t + t;
        const h01 = -2*t*t*t + 3*t*t;
        const h11 = t*t*t - t*t;
        const x = h00*p0.x + h10*m0.x + h01*p1.x + h11*m1.x;
        const y = h00*p0.y + h10*m0.y + h01*p1.y + h11*m1.y;
        if (t === 0) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  // Curva derecha (Hermite)
  drawHermite(perfilCtx, puntosDer);
  // Curva izquierda (Hermite)
  drawHermite(perfilCtx, puntosIzq);
  // Dibujar puntos
  for (let i = 0; i < puntosDer.length; i++) {
    perfilCtx.beginPath();
    perfilCtx.arc(puntosDer[i].x, puntosDer[i].y, 4, 0, 2 * Math.PI);
    perfilCtx.fillStyle = '#ff6600';
    perfilCtx.fill();
    perfilCtx.strokeStyle = '#333';
    perfilCtx.stroke();
    perfilCtx.beginPath();
    perfilCtx.arc(puntosIzq[i].x, puntosIzq[i].y, 4, 0, 2 * Math.PI);
    perfilCtx.fillStyle = '#ff6600';
    perfilCtx.fill();
    perfilCtx.strokeStyle = '#333';
    perfilCtx.stroke();
  }
}

perfilSliders.forEach((slider, i) => {
  slider.addEventListener('input', function() {
    perfilLabels[i].textContent = slider.value;
    drawPerfil();
  });
});


drawPerfil();

// --- Vista superior de las dos primeras capas ---
const topViewCanvas = document.getElementById('topViewCanvas');
const topViewCtx = topViewCanvas.getContext('2d');



function drawTopView() {
  // Limpiar
  topViewCtx.clearRect(0, 0, topViewCanvas.width, topViewCanvas.height);
  // Parámetros
  const params = getParams();
  if (!validateParams(params)) return;
  const {camaX, camaY, alturaCapa, perfil, vueltasTranslacion, moduloDesfase, diametroGiro, altura} = params;
  // --- Ajuste de zoom dinámico para que la curva siempre llene el canvas ---
  const margen = 20;
  const canvasW = topViewCanvas.width;
  const canvasH = topViewCanvas.height;
  // Calcular el diámetro máximo real que puede tener la curva en las dos primeras capas
  // Muestrear todos los puntos de las dos primeras capas para encontrar el radio máximo real
  let radioMaxReal = 0;
  const pasoAngulo = 0.01;
  const subidaPorPaso = alturaCapa * pasoAngulo / (2 * Math.PI);
  for (let l = 0; l < 2; l++) {
    const zIni = l * alturaCapa;
    const zFin = (l+1) * alturaCapa;
    let angulo = 0;
    for (let z = zIni; z < zFin; z += subidaPorPaso) {
      angulo += pasoAngulo;
      // Interpolar diámetro en z
      const hReal = altura;
      const fracciones = [0, 0.25, 0.5, 0.75, 1];
      const puntos = fracciones.map((f, i) => ({ z: f * hReal, d: perfil[i] }));
      let i = 0;
      while (i < puntos.length - 1 && z > puntos[i+1].z) i++;
      const p0 = puntos[Math.max(i-1, 0)];
      const p1 = puntos[i];
      const p2 = puntos[Math.min(i+1, puntos.length-1)];
      const p3 = puntos[Math.min(i+2, puntos.length-1)];
      const t = (z - p1.z) / (p2.z - p1.z);
      function catmullRom(p0, p1, p2, p3, t) {
        return 0.5 * ((2 * p1.d) +
          (-p0.d + p2.d) * t +
          (2*p0.d - 5*p1.d + 4*p2.d - p3.d) * t * t +
          (-p0.d + 3*p1.d - 3*p2.d + p3.d) * t * t * t);
      }
      const diametroActual = catmullRom(p0, p1, p2, p3, t);
      const radio = diametroActual / 2 + diametroGiro / 2;
      if (radio > radioMaxReal) radioMaxReal = radio;
    }
  }
  // Escala para que el radio máximo real ocupe el 80% del canvas menos margen
  const maxR = 0.8 * Math.min(canvasW, canvasH) - margen;
  const escala = maxR / radioMaxReal;
  // Centro del círculo en la esquina inferior izquierda del cuadrante visible
  const cx = margen;
  const cy = canvasH - margen;
  // Dibujar cuadrícula y escala (círculo completo, SIEMPRE, aunque no haya dibujo)
  topViewCtx.save();
  const gridStep = 10; // mm
  const labelStep = 50;
  const radioMaxMM = radioMaxReal;
  for (let r = 0; r <= radioMaxMM + 50; r += gridStep) {
    const radPix = r * escala;
    topViewCtx.beginPath();
    topViewCtx.arc(cx, cy, radPix, 0, 2*Math.PI);
    topViewCtx.strokeStyle = (r % labelStep === 0) ? '#aaa' : '#ddd';
    topViewCtx.lineWidth = (r % labelStep === 0) ? 1.2 : 0.5;
    topViewCtx.stroke();
    // Etiquetas
    if (r % labelStep === 0 && r > 0) {
      topViewCtx.font = '12px Arial';
      topViewCtx.fillStyle = '#888';
      let label = `⌀${r*2}mm`;
      // Medir ancho del texto
      let labelWidth = topViewCtx.measureText(label).width;
      // Posicionar la etiqueta centrada en el ángulo -45°
      let labelX = cx + radPix * Math.cos(-Math.PI/4) - labelWidth/2;
      let labelY = cy + radPix * Math.sin(-Math.PI/4) - 4;
      // Limitar la posición para que no se salga del canvas
      labelX = Math.max(labelX, 2);
      labelX = Math.min(labelX, canvasW - labelWidth - 2);
      topViewCtx.fillText(label, labelX, labelY);
    }
  }
  // Líneas radiales
  for (let ang = 0; ang < 360; ang += 15) {
    const rad = ang * Math.PI / 180;
    const x2 = cx + (radioMaxMM + 50) * escala * Math.cos(rad);
    const y2 = cy + (radioMaxMM + 50) * escala * Math.sin(rad);
    topViewCtx.beginPath();
    topViewCtx.moveTo(cx, cy);
    topViewCtx.lineTo(x2, y2);
    topViewCtx.strokeStyle = '#ccc';
    topViewCtx.lineWidth = 0.7;
    topViewCtx.stroke();
  }
  topViewCtx.restore();

  // Capas a mostrar
  const layers = [0, 1];
  const colores = ['#0077ff88', '#ff660088'];
  // Traza exactamente como el G-code: solo las dos primeras capas, muestreando todos los puntos
  // (colores ya está declarado arriba)
  // offsetX y offsetY igual que antes
  const offsetX = cx;
  const offsetY = cy;
  for (let l = 0; l < 2; l++) {
    const color = colores[l];
    const zIni = l * alturaCapa;
    const zFin = (l+1) * alturaCapa;
    let angulo = 0;
    let first = true;
    topViewCtx.save();
    topViewCtx.strokeStyle = color;
    topViewCtx.lineWidth = 2;
    topViewCtx.beginPath();
    for (let z = zIni; z < zFin; z += subidaPorPaso) {
      angulo += pasoAngulo;
      // Interpolar diámetro en z
      const hReal = altura;
      const fracciones = [0, 0.25, 0.5, 0.75, 1];
      const puntos = fracciones.map((f, i) => ({ z: f * hReal, d: perfil[i] }));
      let i = 0;
      while (i < puntos.length - 1 && z > puntos[i+1].z) i++;
      const p0 = puntos[Math.max(i-1, 0)];
      const p1 = puntos[i];
      const p2 = puntos[Math.min(i+1, puntos.length-1)];
      const p3 = puntos[Math.min(i+2, puntos.length-1)];
      const t = (z - p1.z) / (p2.z - p1.z);
      function catmullRom(p0, p1, p2, p3, t) {
        return 0.5 * ((2 * p1.d) +
          (-p0.d + p2.d) * t +
          (2*p0.d - 5*p1.d + 4*p2.d - p3.d) * t * t +
          (-p0.d + 3*p1.d - 3*p2.d + p3.d) * t * t * t);
      }
      const diametroActual = catmullRom(p0, p1, p2, p3, t);
      const radio = diametroActual / 2;
      const radioGiro = diametroGiro / 2;
      // Centro helicoidal
      const cxH = offsetX + Math.cos(angulo) * radio * escala;
      const cyH = offsetY + Math.sin(angulo) * radio * escala;
      // Progreso dentro de la capa (0 a 1)
      const zRel = (z % alturaCapa) / alturaCapa;
      // Número de vuelta actual en la capa (sentido invertido)
      const vueltaActual = -vueltasTranslacion * zRel;
      // Ángulo base de la vuelta actual + desfase interpolado entre capas
      let phase = vueltaActual * 2 * Math.PI;
      if (moduloDesfase !== 0) {
        const desfasePrev = (moduloDesfase / vueltasTranslacion) * 2 * Math.PI * (l - 1);
        const desfaseCurr = (moduloDesfase / vueltasTranslacion) * 2 * Math.PI * l;
        const desfaseInterp = desfasePrev + (desfaseCurr - desfasePrev) * zRel;
        phase += desfaseInterp;
      }
      // Posición final: círculo alrededor del centro helicoidal
      const x = cxH + Math.cos(phase) * radioGiro * escala;
      const y = cyH + Math.sin(phase) * radioGiro * escala;
      if (first) { topViewCtx.moveTo(x, y); first = false; }
      else topViewCtx.lineTo(x, y);
    }
    topViewCtx.stroke();
    topViewCtx.restore();
  }
  // Dibujar origen
  topViewCtx.save();
  topViewCtx.beginPath();
  topViewCtx.arc(cx, cy, 3, 0, 2 * Math.PI);
  topViewCtx.fillStyle = '#222';
  topViewCtx.fill();
  topViewCtx.restore();
}

// Redibujar vista superior cuando cambian parámetros
function updateAll() {
  drawPerfil();
  drawTopView();
}

// Listeners para sliders y entradas
perfilSliders.forEach((slider, i) => {
  slider.addEventListener('input', function() {
    perfilLabels[i].textContent = slider.value;
    updateAll();
  });
});
alturaSlider.addEventListener('input', updateAll);
['pared','alturaCapa','camaX','camaY','tempExtrusor','tempCama','flujo','flujoMax','fanCapa','vueltasTranslacion','moduloDesfase','diametroGiro'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateAll);
});

// Inicial
updateAll();

function getParams() {
  return {
    altura: parseFloat(alturaSlider.value),
    pared: parseFloat(document.getElementById("pared").value),
    camaX: parseFloat(document.getElementById("camaX").value),
    camaY: parseFloat(document.getElementById("camaY").value),
    alturaCapa: parseFloat(document.getElementById("alturaCapa").value),
    tempExtrusor: parseInt(document.getElementById("tempExtrusor").value),
    tempCama: parseInt(document.getElementById("tempCama").value),
    flujo: parseFloat(document.getElementById("flujo").value) / 100,
    flujoMax: parseFloat(document.getElementById("flujoMax").value),
    fanCapa: parseInt(document.getElementById("fanCapa").value),
    // Guardar el diámetro en cada altura
    perfil: perfilSliders.map(s => parseFloat(s.value)),
    vueltasTranslacion: parseFloat(document.getElementById("vueltasTranslacion").value) || 1,
    moduloDesfase: parseFloat(document.getElementById("moduloDesfase").value) || 0,
    diametroGiro: parseFloat(document.getElementById("diametroGiro").value) || 5
  };
}

function validateParams(params) {
  // Validar solo los parámetros numéricos principales, no el array perfil
  const keys = [
    'altura', 'pared', 'camaX', 'camaY', 'alturaCapa',
    'tempExtrusor', 'tempCama', 'flujo'
  ];
  for (const k of keys) {
    if (!isFinite(params[k])) return false;
  }
  // Validar que todos los diámetros del perfil sean válidos y positivos
  if (!params.perfil || !Array.isArray(params.perfil)) return false;
  for (const d of params.perfil) {
    if (!isFinite(d) || d <= 0) return false;
  }
  return true;
}


document.getElementById("downloadBtn").addEventListener("click", function() {
  const params = getParams();
  if (!validateParams(params)) {
    alert("Hay parámetros inválidos. Revisá los campos.");
    return;
  }

  // Cálculos base
  const altura = params.altura;
  const pared = params.pared;
  const camaX = params.camaX;
  const camaY = params.camaY;
  const alturaCapa = params.alturaCapa;
  const tempExtrusor = params.tempExtrusor;
  const tempCama = params.tempCama;
  const flujo = params.flujo;

  const offsetX = camaX / 2;
  const offsetY = camaY / 2;
  const pasoXY = 0.5;
  const diamFilamento = 1.75;
  const areaFilamento = Math.PI * Math.pow(diamFilamento / 2, 2);
  const maxPuntos = 100000;
  const pasoAngulo = 0.01; // radianes por paso
  const subidaPorPaso = alturaCapa * pasoAngulo / (2 * Math.PI); // avance en Z por paso

  const gcode = [];
  let eTotal = 0;

  // Encabezado G-code
  gcode.push("G21 ; mm");
  gcode.push("G90 ; coordenadas absolutas");
  gcode.push("M82 ; extrusor absoluto");
  gcode.push("G92 E0");
  gcode.push("G28 ; Auto home");
  gcode.push("G29 ; Auto nivelación de cama");
  gcode.push(`M104 S${tempExtrusor}`);
  gcode.push(`M140 S${tempCama}`);
  gcode.push(`M109 S${tempExtrusor}`);
  gcode.push(`M190 S${tempCama}`);
  // Fan de capa (M106 Sxxx)
  const fanPWM = Math.round(Math.max(0, Math.min(255, params.fanCapa * 2.55)));
  let fanActivated = false;
  gcode.push("; Comienza espiral");

  // Inicialización
  let angulo = 0;
  let xPrev = offsetX + params.perfil[0] / 2;
  let yPrev = offsetY;
  const pasos = Math.ceil(altura / subidaPorPaso);

  // Interpolación de diámetro usando Catmull-Rom spline
  function interpDiametroSpline(z) {
    const perfil = params.perfil;
    const hReal = altura;
    const fracciones = [0, 0.25, 0.5, 0.75, 1];
    const puntos = fracciones.map((f, i) => ({ z: f * hReal, d: perfil[i] }));
    let i = 0;
    while (i < puntos.length - 1 && z > puntos[i+1].z) i++;
    const p0 = puntos[Math.max(i-1, 0)];
    const p1 = puntos[i];
    const p2 = puntos[Math.min(i+1, puntos.length-1)];
    const p3 = puntos[Math.min(i+2, puntos.length-1)];
    const t = (z - p1.z) / (p2.z - p1.z);
    function catmullRom(p0, p1, p2, p3, t) {
      return 0.5 * ((2 * p1.d) +
        (-p0.d + p2.d) * t +
        (2*p0.d - 5*p1.d + 4*p2.d - p3.d) * t * t +
        (-p0.d + 3*p1.d - 3*p2.d + p3.d) * t * t * t);
    }
    return catmullRom(p0, p1, p2, p3, t);
  }

  // Espiral con perfil
  let lastLayer = -1;
  let distanciaAcumulada = 0;
  for (let i = 0; i <= pasos; i++) {
    angulo += pasoAngulo;
    const z = i * subidaPorPaso;
    const diametroActual = interpDiametroSpline(z);
    const radio = diametroActual / 2;
    // Centro helicoidal
    const cx = offsetX + radio * Math.cos(angulo);
    const cy = offsetY + radio * Math.sin(angulo);
    // Calcular distancia recorrida sobre la trayectoria helicoidal
    const dxTray = cx - xPrev;
    const dyTray = cy - yPrev;
    const dxyTray = Math.sqrt(dxTray * dxTray + dyTray * dyTray);
    const distanciaTray = Math.sqrt(dxyTray * dxyTray + subidaPorPaso * subidaPorPaso);
    distanciaAcumulada += distanciaTray;
    // Ángulo de giro: vueltasTranslacion vueltas por capa (sentido invertido)
    const vueltasPorCapa = params.vueltasTranslacion;
    const moduloDesfase = params.moduloDesfase;
    const radioGiro = params.diametroGiro / 2;
    // Progreso dentro de la capa (0 a 1)
    const zRel = (z % params.alturaCapa) / params.alturaCapa;
    // Número de vuelta actual en la capa (sentido invertido)
    const vueltaActual = -vueltasPorCapa * zRel;
    // Ángulo base de la vuelta actual + desfase interpolado entre capas
    const layer = Math.floor(z / params.alturaCapa);
    let phase = vueltaActual * 2 * Math.PI;
    if (moduloDesfase !== 0) {
      // Fórmula: (moduloDesfase) × (2π / vueltasTranslacion) / 10
      const delta = moduloDesfase * 2 * Math.PI/ vueltasPorCapa / 10;
      // Interpolación suave del desfase entre capas
      const desfasePrev = delta * (layer - 1);
      const desfaseCurr = delta * layer;
      const desfaseInterp = desfasePrev + (desfaseCurr - desfasePrev) * zRel;
      phase += desfaseInterp;
    }
    // Posición final: círculo perfecto alrededor del centro helicoidal
    const x = cx + radioGiro * Math.cos(phase);
    const y = cy + radioGiro * Math.sin(phase);

    const dx = x - xPrev;
    const dy = y - yPrev;
    const dxy = Math.sqrt(dx * dx + dy * dy);
    const distancia = Math.sqrt(dxy * dxy + subidaPorPaso * subidaPorPaso);

    // Calcular velocidad máxima permitida para no superar el flujo
    let velocidad = 20; // valor base en mm/s
    if (params.pared > 0 && params.alturaCapa > 0 && params.flujo > 0) {
      velocidad = params.flujoMax / (params.pared * params.alturaCapa * params.flujo);
      if (!isFinite(velocidad) || velocidad <= 0) velocidad = 5;
    }
    const F = Math.round(velocidad * 60); // mm/min

    const volumen = params.pared * params.alturaCapa * distancia * params.flujo;
    const eStep = volumen / areaFilamento;
    eTotal += eStep;

    // Solo agregar layer change si no es la última iteración (sin trayectorias)
    if (layer !== lastLayer && i < pasos) {
      gcode.push(`;LAYER_CHANGE`);
      gcode.push(`;LAYER:${layer}`);
      lastLayer = layer;
    }
    // Activar fan solo en la primera capa por encima de 0.5mm
    if (!fanActivated && z > 0.5) {
      gcode.push(`M106 S${fanPWM} ; Fan de capa ${params.fanCapa}%`);
      fanActivated = true;
    }

    gcode.push(`G1 X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)} E${eTotal.toFixed(5)} F${F}`);

    xPrev = x;
    yPrev = y;
  }

  gcode.push("; Fin del código");
  gcode.push("M104 S0 ; Apagar extrusor");
  gcode.push("M140 S0 ; Apagar cama");
  gcode.push("M84 ; Apagar motores");

  // Descargar archivo
  try {
    const contenido = gcode.join("\n");
    const blob = new Blob([contenido], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vase_mode.gcode";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  } catch (err) {
    alert("Error al generar el archivo: " + err.message);
  }
});
