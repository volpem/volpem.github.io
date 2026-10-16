/* ===================================================================
   ESCENA DEL PARQUE
   Relevamiento sobre la foto aerea. Las coordenadas estan en PIXELES
   de la foto (2000 x 1500); index.html las pasa a metros con px2m().
   Para corregir una posicion alcanza con mover el par [x, y].

   OJO con los arboles: la foto es oblicua. El nadir (el punto justo
   debajo de la camara) cayo sobre la plaza deportiva, en (1128, 950),
   y la altura de vuelo es de unos 57 m. Por eso la copa de cada arbol
   aparece corrida hacia AFUERA respecto del pie del tronco, tanto mas
   cuanto mas alto el arbol y mas lejos del nadir. Los datos de abajo
   guardan la COPA, que es lo que se ve, y alPie() calcula el tronco.
   Se verifico con tres palmeras cuyo tronco es visible: el error
   queda por debajo del pixel.
=================================================================== */
window.ESCENA = (() => {

const NADIR = [1128, 950];
const H_VUELO = 57;                      // metros sobre el suelo
function alPie(px, py, h){
  const k = Math.min(h / H_VUELO, 0.9);
  return [ NADIR[0] + (px - NADIR[0])*(1-k), NADIR[1] + (py - NADIR[1])*(1-k) ];
}

/* --- 1. islas de hormigon: quedan planas y fijas --- */
const islas = [
  { nombre:'Isla de juegos', poli:[
    [690,648],[694,612],[712,572],[748,536],[790,508],[830,502],[868,512],
    [900,536],[940,548],[990,552],[1036,566],[1070,592],[1090,626],[1086,664],
    [1066,700],[1040,732],[1004,760],[962,784],[916,798],[868,804],[820,802],
    [776,790],[740,766],[712,730],[694,690] ] },

  { nombre:'Plaza deportiva', poli:[
    [932,870],[940,820],[963,790],[1010,782],[1087,776],[1150,784],[1227,806],
    [1277,842],[1323,908],[1333,956],[1323,1002],[1293,1052],[1233,1096],
    [1167,1128],[1113,1122],[1073,1100],[1040,1070],[1010,1036],[972,986],
    [943,928] ] },
];

/* --- 2. caminos: polilineas con ancho, tambien planos y fijos --- */
const caminos = [
  { ancho:3.4, via:[[1070,600],[1100,566],[1118,524],[1128,482]] },
  { ancho:4.0, via:[[1128,482],[1138,560],[1146,650],[1150,740],[1150,782]] },
  { ancho:3.4, via:[[1004,760],[1016,784],[1020,800]] },
  { ancho:3.4, via:[[850,504],[846,462],[850,420],[860,386]] },
  { ancho:3.4, via:[[692,648],[640,660],[566,678],[500,698]] },
  { ancho:4.2, via:[[470,836],[610,818],[742,800],[860,792],[940,792]] },
  { ancho:3.4, via:[[1330,990],[1400,992],[1480,984],[1570,972]] },
  { ancho:3.4, via:[[1160,1128],[1148,1186],[1128,1264],[1106,1344]] },
  { ancho:3.4, via:[[1060,1096],[1010,1142],[956,1202]] },
];

/* --- 3. arbolado: [x, y de la COPA, tipo, radio de copa (m), altura (m)] --- */
const arboles = [
  // gran masa central, al norte de la isla de juegos
  [860,290,'copa',6.5,15], [935,300,'copa',7,16],   [1000,268,'copa',6,14],
  [880,392,'copa',6,14],   [962,400,'copa',6.5,15], [1032,398,'copa',5.5,13],
  [1008,480,'copa',5,12],  [900,478,'copa',5.5,13], [800,340,'copa',5,12],
  [782,430,'copa',4.5,11],
  // palmeras al pie de la isla de juegos
  [905,685,'palmera',0,8],  [960,677,'palmera',0,8.5],
  [1013,682,'palmera',0,8], [1072,677,'palmera',0,9],
  // palmeras del cesped este
  [1204,526,'palmera',0,12], [1300,530,'palmera',0,10.5],
  [1323,711,'palmera',0,10.5], [1056,711,'palmera',0,15],
  [1296,853,'palmera',0,16],
  // borde oeste, sobre la avenida
  [443,418,'conifera',4,11], [250,360,'copa',5,10], [95,430,'copa',5,10],
  [80,530,'copa',4,9],
  // sur y este
  [390,1180,'copa',6,11],  [300,1232,'copa',5,10], [1290,1270,'copa',7,12],
  [1420,1350,'copa',6,11], [1620,1430,'copa',6,11], [900,1430,'copa',6,11],
  [1150,1400,'copa',5,10], [1900,470,'copa',5,10],
  [1730,90,'copa',8,13],   [1830,130,'copa',7,12],
];

/* --- 4. equipamiento: [tipo, x, y, rotacion en grados, parametros] --- */
const equipo = [
  // ---- isla de juegos ----
  ['juego',      888,  627,   0],
  ['subeybaja',  742,  622, -25],
  ['subeybaja',  727,  672, -22],
  ['subeybaja',  755,  716, -29],

  // ---- plaza deportiva ----
  ['pingpong',  1076,  854, -18],
  ['pingpong',  1062,  880, -26],
  // calistenia sobre paño de caucho: [ancho, largo] medidos en la foto
  ['calistenia',1057,  943, -20, [4.7, 3.7]],
  ['calistenia',1016,  992, -20, [3.9, 3.4]],
  // barras sueltas, sin piso de caucho
  ['barras',     981,  872, -20],
  ['barras',    1014,  898, -20],
  // estructura unica con tres aros, sobre el trebol amarillo
  ['basket',    1163, 1062,  20],
  // posta aerobica
  ['posta',     1200,  950,  20],
  ['posta',     1226,  964,  20],
  ['posta',     1252,  978,  20],
];

/* ===================================================================
   GENERADORES 3D - piezas de pocos poligonos, en metros
=================================================================== */
const M = {};
function mats(THREE){
  if (M.listo) return M;
  const std = (c, r=0.85) => new THREE.MeshStandardMaterial({ color:c, roughness:r, metalness:0.05 });
  Object.assign(M, {
    listo:true,
    tronco: std(0x5a4632), copa: std(0x47682c), copaClara: std(0x6d8f3a),
    palma:  std(0x55732f), conif: std(0x33502a),
    verde:  std(0x3f7d4a), verdeOsc: std(0x2c5a36),
    gris:   std(0x9a9a93), grisOsc: std(0x4a4a46),
    metal:  new THREE.MeshStandardMaterial({ color:0xb8bcb4, roughness:0.4, metalness:0.65 }),
    caucho: std(0x2b2b2b, 0.98), amarillo: std(0xd8c53a),
    blanco: std(0xdcdcd4), naranja: std(0xc9712f), azul: std(0x3c4a6b),
  });
  return M;
}
const caja = (THREE, m, x,y,z, px,py,pz, rot=0) => {
  const o = new THREE.Mesh(new THREE.BoxGeometry(x,y,z), m);
  o.position.set(px,py,pz); if (rot) o.rotation.y = rot; return o;
};
const cil = (THREE, m, r1,r2,h, px,py,pz, seg=12) => {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg), m);
  o.position.set(px,py,pz); return o;
};

/* --- arboles --- */
function arbol(THREE, tipo, r, h){
  const m = mats(THREE), g = new THREE.Group();
  if (tipo === 'palmera'){
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,0,0), new THREE.Vector3(0.2,h*0.4,0.08),
      new THREE.Vector3(0.4,h*0.75,0.16), new THREE.Vector3(0.6,h,0.24)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 8, 0.22, 6), m.tronco));
    const hojas = 9, L = h * 0.30;
    for (let i = 0; i < hojas; i++){
      const a = i/hojas * Math.PI*2;
      const hoja = new THREE.Mesh(new THREE.ConeGeometry(0.45, L, 4), m.palma);
      hoja.position.set(0.6 + Math.cos(a)*L*0.42, h - L*0.16, 0.24 + Math.sin(a)*L*0.42);
      hoja.rotation.set(Math.PI/2 - 0.45, 0, -a + Math.PI/2);
      hoja.scale.set(1, 1, 0.22);
      g.add(hoja);
    }
    return g;
  }
  if (tipo === 'conifera'){
    g.add(cil(THREE, m.tronco, 0.22, 0.3, h*0.3, 0, h*0.15, 0));
    const c = new THREE.Mesh(new THREE.ConeGeometry(r, h*0.82, 9), m.conif);
    c.position.y = h*0.3 + h*0.41; g.add(c);
    return g;
  }
  r *= 0.82;
  const ht = h * 0.42;
  g.add(cil(THREE, m.tronco, 0.22, 0.38, ht, 0, ht/2, 0, 7));
  for (let i = 0; i < 3; i++){                       // copa de tres lobulos
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(r*(0.62 + i*0.13), 1),
                             i === 1 ? m.copaClara : m.copa);
    b.position.set((i-1)*r*0.42, ht + h*0.26 + i*r*0.1, (i%2 ? 1 : -1)*r*0.26);
    b.scale.y = 0.78; g.add(b);
  }
  return g;
}

/* --- juego cilindrico con dos toboganes --- */
function juego(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(cil(THREE, m.azul, 4.2, 4.2, 0.22, 0, 0.11, 0, 28));             // pano azul
  g.add(cil(THREE, m.verdeOsc, 3.0, 3.0, 0.1, 0, 0.27, 0, 24));
  g.add(cil(THREE, m.gris, 1.9, 1.9, 3.1, 0, 1.55, 0, 16));              // tambor central
  g.add(cil(THREE, m.verde, 1.8, 1.8, 0.16, 0, 2.3, 0, 16));
  g.add(cil(THREE, m.verde, 2.2, 1.8, 0.45, 0, 3.35, 0, 16));            // techo
  for (let i = 0; i < 8; i++){
    const a = i/8 * Math.PI*2;
    g.add(cil(THREE, m.metal, 0.07, 0.07, 3.1, Math.cos(a)*2.05, 1.55, Math.sin(a)*2.05, 6));
  }
  // tobogan recto al sudoeste y tobogan caracol al sudeste, como en la foto
  [[2.59, 1.0], [0.79, 2.1]].forEach(([a0, giro]) => {
    const r0 = 1.8, r1 = 5.6;
    const pts = [];
    for (let i = 0; i <= 4; i++){
      const t = i/4, a = a0 + giro*t;
      const r = r0 + (r1-r0)*t, y = 2.35 - 1.95*t*t;
      pts.push(new THREE.Vector3(Math.cos(a)*r, Math.max(y, 0.4), Math.sin(a)*r));
    }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.42, 10), m.blanco));
  });
  const esc = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.09, 3.2), m.verdeOsc);
  esc.position.set(2.5, 1.1, -1.7); esc.rotation.set(0.6, -0.5, 0); g.add(esc);
  return g;
}

/* --- sube y baja --- */
function subeybaja(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(caja(THREE, m.grisOsc, 0.5, 0.5, 0.5, 0, 0.25, 0));
  const t = caja(THREE, m.verdeOsc, 3.2, 0.14, 0.32, 0, 0.58, 0);
  t.rotation.z = 0.24; g.add(t);
  [-1.45, 1.45].forEach((x, i) => {
    const y = 0.58 + (i ? -1 : 1) * 0.35;
    g.add(caja(THREE, m.verde, 0.5, 0.1, 0.5, x, y + 0.08, 0));
    g.add(cil(THREE, m.metal, 0.05, 0.05, 0.5, x - 0.28, y + 0.33, 0, 6));
  });
  return g;
}

/* --- mesa de ping pong, medidas reglamentarias --- */
function pingpong(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(caja(THREE, m.gris, 2.74, 0.06, 1.525, 0, 0.76, 0));          // tapa clara, como en la foto
  g.add(caja(THREE, m.gris, 0.04, 0.1525, 1.83, 0, 0.84, 0));            // red
  [[-1.15,-0.6],[1.15,-0.6],[-1.15,0.6],[1.15,0.6]].forEach(([x,z]) =>
    g.add(caja(THREE, m.grisOsc, 0.1, 0.73, 0.1, x, 0.365, z)));
  return g;
}

/* --- calistenia sobre paño de caucho (ancho x largo medidos en la foto) --- */
function calistenia(THREE, ancho = 4.7, largo = 3.7){
  const m = mats(THREE), g = new THREE.Group();
  g.add(caja(THREE, m.caucho, ancho, 0.06, largo, 0, 0.03, 0));
  const ax = ancho/2 - 0.5, az = largo/2 - 0.5;
  [[-ax,-az],[ax,-az],[-ax,az],[ax,az]].forEach(([x,z]) =>
    g.add(cil(THREE, m.metal, 0.07, 0.07, 2.4, x, 1.2, z, 8)));
  [-az, az].forEach(z => {                                               // barras altas
    const b = cil(THREE, m.metal, 0.045, 0.045, ax*2, 0, 2.35, z, 8);
    b.rotation.z = Math.PI/2; g.add(b);
  });
  const t = cil(THREE, m.metal, 0.045, 0.045, az*2, 0, 2.35, 0, 8);
  t.rotation.x = Math.PI/2; g.add(t);
  [-0.55, 0.55].forEach(x => {                                           // paralelas bajas
    const p = cil(THREE, m.metal, 0.045, 0.045, az*1.5, x, 1.3, 0, 8);
    p.rotation.x = Math.PI/2; g.add(p);
  });
  return g;
}

/* --- barras sueltas, sin piso de caucho --- */
function barras(THREE){
  const m = mats(THREE), g = new THREE.Group();
  [-1.3, 1.3].forEach(x => g.add(cil(THREE, m.metal, 0.06, 0.06, 2.3, x, 1.15, 0, 8)));
  const b = cil(THREE, m.metal, 0.045, 0.045, 2.6, 0, 2.25, 0, 8);
  b.rotation.z = Math.PI/2; g.add(b);
  const b2 = cil(THREE, m.metal, 0.045, 0.045, 2.6, 0, 1.45, 0, 8);
  b2.rotation.z = Math.PI/2; g.add(b2);
  return g;
}

/* --- estructura unica con tres aros --- */
function basket(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(cil(THREE, m.grisOsc, 0.6, 0.7, 0.25, 0, 0.12, 0, 12));
  g.add(cil(THREE, m.metal, 0.15, 0.18, 3.9, 0, 1.95, 0, 10));
  for (let i = 0; i < 3; i++){
    const a = i/3 * Math.PI*2, cx = Math.cos(a), cz = Math.sin(a);
    const br = cil(THREE, m.metal, 0.06, 0.06, 1.3, cx*0.65, 3.45, cz*0.65, 6);
    br.rotation.z = Math.PI/2; br.rotation.y = -a; g.add(br);
    g.add(caja(THREE, m.blanco, 0.07, 1.05, 1.8, cx*1.3, 3.5, cz*1.3, -a));
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.225, 0.03, 6, 14), m.naranja);
    aro.position.set(cx*1.63, 3.05, cz*1.63); aro.rotation.x = Math.PI/2; g.add(aro);
  }
  return g;
}

/* --- estacion de posta aerobica --- */
function posta(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(caja(THREE, m.grisOsc, 0.6, 0.1, 0.6, 0, 0.05, 0));
  g.add(cil(THREE, m.amarillo, 0.07, 0.07, 1.15, 0, 0.58, 0, 8));
  const rueda = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.05, 6, 16), m.metal);
  rueda.position.set(0, 1.1, 0.16); g.add(rueda);
  const manija = cil(THREE, m.metal, 0.04, 0.04, 0.7, 0, 1.0, -0.12, 6);
  manija.rotation.z = Math.PI/2; g.add(manija);
  return g;
}

const generadores = { juego, subeybaja, pingpong, calistenia, barras, basket, posta };

function crear(THREE, tipo, args){
  if (tipo === 'arbol') return arbol(THREE, args[0], args[1], args[2]);
  return generadores[tipo](THREE, ...(args || []));
}

return { islas, caminos, arboles, equipo, crear, alPie, NADIR, H_VUELO };
})();
