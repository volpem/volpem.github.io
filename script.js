
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

// Actualizar los subtítulos en el DOM al cargar
perfilLabels.forEach((label, i) => {
  label.previousElementSibling.textContent = perfilTitles[i];
});
// Actualizar los subtítulos en el DOM al cargar
perfilLabels.forEach((label, i) => {
  label.previousElementSibling.textContent = perfilTitles[i];
});
// Actualizar los subtítulos en el DOM al cargar
perfilLabels.forEach((label, i) => {
  label.previousElementSibling.textContent = perfilTitles[i];
});
// Actualizar los subtítulos en el DOM al cargar
perfilLabels.forEach((label, i) => {
  label.previousElementSibling.textContent = perfilTitles[i];
});
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
  const gridYCount = Math.floor((canvasH - 2 * margen) / (gridStep * escala));
  // Líneas horizontales (altura)
  for (let i = 0; i <= gridYCount; i++) {
    const mm = i * gridStep;
    const y = canvasH - margen - mm * escala;
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
    if (mm % labelStep === 0) {
      perfilCtx.font = '12px Arial';
      perfilCtx.fillStyle = '#888';
      perfilCtx.fillText(`${mm}mm`, 2, y - 2);
    }
  }
  // Líneas verticales (diámetro)
  const gridXCount = Math.floor((canvasW - 2 * margen) / (gridStep * escala));
  for (let i = -gridXCount/2; i <= gridXCount/2; i++) {
    const mm = i * gridStep;
    const x = cx + mm * escala;
    perfilCtx.beginPath();
    perfilCtx.moveTo(x, margen);
    perfilCtx.lineTo(x, canvasH - margen);
    if (mm % labelStep === 0 && mm !== 0) {
      perfilCtx.strokeStyle = '#aaa';
      perfilCtx.lineWidth = 1.2;
    } else {
      perfilCtx.strokeStyle = '#ccc';
      perfilCtx.lineWidth = 0.5;
    }
    perfilCtx.stroke();
    if (mm % labelStep === 0 && mm !== 0) {
      perfilCtx.font = '12px Arial';
      perfilCtx.fillStyle = '#888';
      perfilCtx.fillText(`${mm}mm`, x - 14, canvasH - 4);
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
    distanciaGiro: parseFloat(document.getElementById("distanciaGiro").value) || 50,
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
    // Ángulo de giro: una vuelta cada 'distanciaGiro' mm recorridos (sentido horario)
    const phase = (distanciaAcumulada / params.distanciaGiro) * 2 * Math.PI;
    const radioGiro = params.diametroGiro / 2;
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

    // Comentario de capa para PrusaSlicer
    const layer = Math.floor(z / params.alturaCapa);
    if (layer !== lastLayer) {
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
