/* ===================================================================
   ESCENA DEL PARQUE
   Todo lo que esta relevado de la foto aerea vive aca.
   Las coordenadas estan en PIXELES de la foto (2000 x 1500), que es
   como se midieron; index.html las pasa a metros con px2m().
   Para corregir una posicion alcanza con mover el par [x, y] de abajo.
=================================================================== */
window.ESCENA = (() => {

/* --- 1. islas de hormigon: quedan planas y fijas, el terreno no las toca --- */
const islas = [
  { nombre:'Isla de juegos', poli:[
    [700,612],[707,575],[735,552],[781,540],[828,536],[874,538],[921,548],
    [966,551],[1004,560],[1032,578],[1046,604],[1040,634],[1050,662],
    [1046,696],[1024,724],[988,748],[944,764],[898,776],[852,780],
    [808,772],[770,752],[736,726],[712,692],[699,652] ] },

  { nombre:'Plaza deportiva', poli:[
    [925,862],[950,826],[990,802],[1040,792],[1090,796],[1140,812],
    [1190,840],[1240,876],[1280,916],[1305,958],[1308,1000],[1288,1036],
    [1250,1066],[1205,1092],[1160,1112],[1120,1122],[1082,1118],
    [1050,1100],[1028,1072],[1010,1040],[985,1010],[955,975],[932,935],[922,898] ] },
];

/* --- 2. caminos: polilineas con ancho, tambien planos y fijos --- */
const caminos = [
  { ancho:3.4, via:[[1046,640],[1080,600],[1106,558],[1122,516],[1130,478]] },
  { ancho:4.0, via:[[1130,478],[1140,560],[1148,650],[1150,752],[1158,800]] },
  { ancho:3.4, via:[[1000,756],[1012,784],[1016,800]] },
  { ancho:3.4, via:[[880,538],[872,492],[866,446],[872,404]] },
  { ancho:3.4, via:[[700,650],[642,664],[566,682],[500,700]] },
  { ancho:4.2, via:[[470,836],[610,818],[742,800],[880,790],[960,792]] },
  { ancho:3.4, via:[[1308,1000],[1390,998],[1480,988],[1570,974]] },
  { ancho:3.4, via:[[1150,1120],[1140,1182],[1122,1262],[1102,1342]] },
  { ancho:3.4, via:[[1052,1096],[1004,1142],[952,1202]] },
];

/* --- 3. arbolado: [x, y, tipo, radio de copa (m), altura (m)] --- */
const arboles = [
  // gran masa central
  [905,330,'copa',8,14],  [975,372,'copa',9,15],  [1030,310,'copa',7,13],
  [880,420,'copa',6,11],  [950,446,'copa',5,10],
  // entorno de la isla de juegos
  [790,470,'copa',5,9],   [735,520,'copa',4,8],   [700,590,'copa',3.5,7],
  [812,518,'copa',4,8],   [1056,520,'copa',4,8],  [1180,430,'copa',5,9],
  // palmeras
  [1200,495,'palmera',0,11], [1288,518,'palmera',0,10], [1240,560,'palmera',0,8],
  [1318,688,'palmera',0,9],  [1305,845,'palmera',0,10], [1292,958,'palmera',0,9],
  [1050,690,'palmera',0,7],  [975,692,'palmera',0,7],   [910,700,'palmera',0,6.5],
  // borde oeste
  [443,418,'conifera',4,11], [250,360,'copa',5,10], [95,430,'copa',5,10],
  [80,530,'copa',4,9],       [390,1180,'copa',6,11], [300,1232,'copa',5,10],
  // sur y este
  [1290,1270,'copa',7,12], [1420,1350,'copa',6,11], [1620,1430,'copa',6,11],
  [900,1430,'copa',6,11],  [1150,1400,'copa',5,10], [1900,470,'copa',5,10],
  [1730,90,'copa',8,13],   [1830,130,'copa',7,12],
];

/* --- 4. equipamiento: [tipo, x, y, rotacion en grados] --- */
const equipo = [
  // isla de juegos
  ['juego',      880,  622,   0],
  ['subeybaja',  748,  632,  25],
  ['subeybaja',  742,  702,  48],
  ['subeybaja', 1022,  600, -15],
  ['asiento',    800,  748,  10],
  ['asiento',    862,  762,  -5],
  ['asiento',   1030,  648,  60],
  ['asiento',    820,  548,  20],
  // plaza deportiva (gira ~22 grados, como la isla)
  ['pingpong',  1072,  862,  22],
  ['calistenia', 972,  856,  22],   // con piso de caucho
  ['calistenia',1058,  936,  22],   // con piso de caucho
  ['calistenia',1026,  986,  22],   // con piso de caucho
  ['barras',    1185,  905,  22],   // sin piso de caucho
  ['barras',    1228,  928,  22],
  ['basket',    1160, 1052,  22],
  ['posta',     1200,  960,  22],
  ['posta',     1228,  976,  22],
  ['posta',     1256,  992,  22],
];

/* ===================================================================
   GENERADORES 3D
   Piezas de pocos poligonos, en metros, con el origen a nivel de piso.
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
    blanco: std(0xdcdcd4), naranja: std(0xc9712f),
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
      new THREE.Vector3(0,0,0), new THREE.Vector3(0.25,h*0.4,0.1),
      new THREE.Vector3(0.5,h*0.75,0.2), new THREE.Vector3(0.75,h,0.3)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 8, 0.22, 6), m.tronco));
    const hojas = 8;
    for (let i = 0; i < hojas; i++){
      const a = i/hojas * Math.PI*2;
      const hoja = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3.0, 4), m.palma);
      hoja.position.set(0.75 + Math.cos(a)*1.35, h - 0.35, 0.3 + Math.sin(a)*1.35);
      hoja.rotation.set(Math.PI/2 - 0.5, 0, -a + Math.PI/2);
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
  for (let i = 0; i < 3; i++){                       // copa: 3 lobulos, no una esfera
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(r*(0.62 + i*0.13), 1),
                             i === 1 ? m.copaClara : m.copa);
    b.position.set((i-1)*r*0.42, ht + h*0.26 + i*r*0.1, (i%2 ? 1 : -1)*r*0.26);
    b.scale.y = 0.78; g.add(b);
  }
  return g;
}

/* --- juego cilindrico con toboganes --- */
function juego(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(cil(THREE, m.grisOsc, 4.6, 4.6, 0.25, 0, 0.12, 0, 24));          // base circular
  g.add(cil(THREE, m.verdeOsc, 3.3, 3.3, 0.12, 0, 0.3, 0, 24));          // anillo verde
  g.add(cil(THREE, m.gris, 2.1, 2.1, 3.3, 0, 1.65, 0, 16));              // cilindro central
  g.add(cil(THREE, m.verde, 2.0, 2.0, 0.18, 0, 2.4, 0, 16));             // plataforma alta
  g.add(cil(THREE, m.verde, 2.35, 1.9, 0.5, 0, 3.55, 0, 16));           // techo
  for (let i = 0; i < 8; i++){                                            // montantes
    const a = i/8 * Math.PI*2;
    g.add(cil(THREE, m.metal, 0.07, 0.07, 3.3, Math.cos(a)*2.3, 1.65, Math.sin(a)*2.3, 6));
  }
  [[-1, 2.45], [1, -0.6]].forEach(([s, a0]) => {                          // dos toboganes tubo
    const a = a0, r0 = 2.0, r1 = 6.6;
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(a)*r0, 2.45, Math.sin(a)*r0),
      new THREE.Vector3(Math.cos(a+0.25*s)*3.6, 2.0, Math.sin(a+0.25*s)*3.6),
      new THREE.Vector3(Math.cos(a+0.5*s)*5.2, 1.0, Math.sin(a+0.5*s)*5.2),
      new THREE.Vector3(Math.cos(a+0.7*s)*r1, 0.42, Math.sin(a+0.7*s)*r1)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 20, 0.45, 10), m.blanco));
  });
  const esc = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.09, 3.4), m.verdeOsc);  // rampa de red
  esc.position.set(2.9, 1.15, 1.9); esc.rotation.set(-0.62, -0.7, 0); g.add(esc);
  return g;
}

/* --- sube y baja --- */
function subeybaja(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(caja(THREE, m.grisOsc, 0.5, 0.55, 0.5, 0, 0.27, 0));
  const t = caja(THREE, m.verde, 3.4, 0.14, 0.34, 0, 0.62, 0);
  t.rotation.z = 0.24; g.add(t);
  [-1.55, 1.55].forEach((x, i) => {
    const y = 0.62 + (i ? -1 : 1) * 0.3;
    g.add(caja(THREE, m.verdeOsc, 0.42, 0.1, 0.46, x, y + 0.09, 0));
    g.add(cil(THREE, m.metal, 0.05, 0.05, 0.5, x - 0.3, y + 0.34, 0, 6));
  });
  return g;
}

/* --- asiento / banco --- */
function asiento(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(caja(THREE, m.verde, 1.9, 0.12, 0.46, 0, 0.42, 0));
  g.add(caja(THREE, m.verdeOsc, 1.9, 0.4, 0.1, 0, 0.62, -0.2));
  [-0.75, 0.75].forEach(x => g.add(caja(THREE, m.grisOsc, 0.12, 0.42, 0.42, x, 0.21, 0)));
  return g;
}

/* --- mesa de ping pong --- */
function pingpong(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(caja(THREE, m.verdeOsc, 2.74, 0.08, 1.525, 0, 0.76, 0));
  g.add(caja(THREE, m.gris, 0.05, 0.3, 1.7, 0, 0.92, 0));                // red
  [[-1.2,-0.6],[1.2,-0.6],[-1.2,0.6],[1.2,0.6]].forEach(([x,z]) =>
    g.add(caja(THREE, m.grisOsc, 0.12, 0.72, 0.12, x, 0.36, z)));
  return g;
}

/* --- calistenia sobre piso de caucho --- */
function calistenia(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(caja(THREE, m.caucho, 6.2, 0.06, 3.6, 0, 0.03, 0));              // pano de caucho
  const postes = [[-2.2,-1.1],[2.2,-1.1],[-2.2,1.1],[2.2,1.1]];
  postes.forEach(([x,z]) => g.add(cil(THREE, m.metal, 0.08, 0.08, 2.5, x, 1.25, z, 8)));
  [-1.1, 1.1].forEach(z => {                                             // barras altas
    const b = cil(THREE, m.metal, 0.05, 0.05, 4.4, 0, 2.45, z, 8);
    b.rotation.z = Math.PI/2; g.add(b);
  });
  const t = cil(THREE, m.metal, 0.05, 0.05, 2.2, 0, 2.45, 0, 8);         // travesaño
  t.rotation.x = Math.PI/2; g.add(t);
  [-0.7, 0.7].forEach(x => {                                             // paralelas bajas
    const p = cil(THREE, m.metal, 0.05, 0.05, 1.9, x, 1.35, 0, 8);
    p.rotation.x = Math.PI/2; g.add(p);
  });
  return g;
}

/* --- barras sueltas, sin piso de caucho --- */
function barras(THREE){
  const m = mats(THREE), g = new THREE.Group();
  [-1.3, 1.3].forEach(x => g.add(cil(THREE, m.metal, 0.07, 0.07, 2.3, x, 1.15, 0, 8)));
  const b = cil(THREE, m.metal, 0.05, 0.05, 2.6, 0, 2.25, 0, 8);
  b.rotation.z = Math.PI/2; g.add(b);
  g.add(caja(THREE, m.grisOsc, 0.5, 0.12, 0.5, -1.3, 0.06, 0));
  g.add(caja(THREE, m.grisOsc, 0.5, 0.12, 0.5,  1.3, 0.06, 0));
  return g;
}

/* --- estructura unica con 3 aros --- */
function basket(THREE){
  const m = mats(THREE), g = new THREE.Group();
  g.add(cil(THREE, m.grisOsc, 0.7, 0.8, 0.3, 0, 0.15, 0, 12));
  g.add(cil(THREE, m.metal, 0.17, 0.2, 4.0, 0, 2.0, 0, 10));             // mastil
  for (let i = 0; i < 3; i++){                                            // tres canastos a 120
    const a = i/3 * Math.PI*2, cx = Math.cos(a), cz = Math.sin(a);
    const br = cil(THREE, m.metal, 0.07, 0.07, 1.5, cx*0.75, 3.5, cz*0.75, 6);
    br.rotation.z = Math.PI/2; br.rotation.y = -a; g.add(br);
    const tab = caja(THREE, m.blanco, 0.08, 1.05, 1.8, cx*1.5, 3.55, cz*1.5, -a);
    g.add(tab);
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.035, 6, 14), m.naranja);
    aro.position.set(cx*1.85, 3.05, cz*1.85); aro.rotation.x = Math.PI/2; g.add(aro);
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

const generadores = { juego, subeybaja, asiento, pingpong, calistenia, barras, basket, posta };

function crear(THREE, tipo, args){
  if (tipo === 'arbol') return arbol(THREE, args[0], args[1], args[2]);
  return generadores[tipo](THREE);
}

return { islas, caminos, arboles, equipo, crear };
})();
