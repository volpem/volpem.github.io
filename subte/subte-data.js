// Lineas y estaciones del subte de Buenos Aires.
// Nombres oficiales (mapa SBASE) + alias con las variantes que usa la API.
// Coordenadas: proyecto Anden. Orden: recorrido real de cada linea.
const SUBTE = {
 "LineaA": {
  "letra": "A",
  "color": "#00AEEF",
  "estaciones": [
   {
    "name": "Plaza de Mayo",
    "lat": -34.608809,
    "lng": -58.370973,
    "aliases": [
     "Plaza de Mayo"
    ]
   },
   {
    "name": "Perú",
    "lat": -34.608558,
    "lng": -58.374272,
    "aliases": [
     "Peru",
     "Perú"
    ]
   },
   {
    "name": "Piedras",
    "lat": -34.608881,
    "lng": -58.379089,
    "aliases": [
     "Piedras"
    ]
   },
   {
    "name": "Lima",
    "lat": -34.609099,
    "lng": -58.382236,
    "aliases": [
     "Lima"
    ]
   },
   {
    "name": "Sáenz Peña",
    "lat": -34.609412,
    "lng": -58.386781,
    "aliases": [
     "Saenz Pena",
     "Sáenz Peña"
    ]
   },
   {
    "name": "Congreso",
    "lat": -34.609225,
    "lng": -58.392672,
    "aliases": [
     "Congreso",
     "Congreso - Pdte. Dr. Raúl Alfonsín"
    ]
   },
   {
    "name": "Pasco",
    "lat": -34.609645,
    "lng": -58.39843,
    "aliases": [
     "Pasco"
    ]
   },
   {
    "name": "Alberti",
    "lat": -34.609833,
    "lng": -58.40121,
    "aliases": [
     "Alberti"
    ]
   },
   {
    "name": "Plaza Miserere",
    "lat": -34.609816,
    "lng": -58.40671,
    "aliases": [
     "Miserere",
     "Plaza Miserere",
     "Plaza de Miserere"
    ]
   },
   {
    "name": "Loria",
    "lat": -34.610781,
    "lng": -58.415188,
    "aliases": [
     "Loria"
    ]
   },
   {
    "name": "Castro Barros",
    "lat": -34.611769,
    "lng": -58.421818,
    "aliases": [
     "Castro Barros"
    ]
   },
   {
    "name": "Río de Janeiro",
    "lat": -34.615205,
    "lng": -58.429502,
    "aliases": [
     "Río de Janeiro"
    ]
   },
   {
    "name": "Acoyte",
    "lat": -34.618279,
    "lng": -58.43643,
    "aliases": [
     "Acoyte"
    ]
   },
   {
    "name": "Primera Junta",
    "lat": -34.620404,
    "lng": -58.441179,
    "aliases": [
     "Primera Junta"
    ]
   },
   {
    "name": "Puán",
    "lat": -34.623528,
    "lng": -58.448648,
    "aliases": [
     "Puán"
    ]
   },
   {
    "name": "Carabobo",
    "lat": -34.626666,
    "lng": -58.45671,
    "aliases": [
     "Carabobo"
    ]
   },
   {
    "name": "San José de Flores",
    "lat": -34.629086,
    "lng": -58.463541,
    "aliases": [
     "Flores",
     "San José de Flores"
    ]
   },
   {
    "name": "San Pedrito",
    "lat": -34.630706,
    "lng": -58.46964,
    "aliases": [
     "San Pedrito"
    ]
   }
  ]
 },
 "LineaB": {
  "letra": "B",
  "color": "#EE3124",
  "estaciones": [
   {
    "name": "Leandro N. Alem",
    "lat": -34.602989,
    "lng": -58.369934,
    "aliases": [
     "Alem",
     "L. N. Alem",
     "Leandro N. Alem"
    ]
   },
   {
    "name": "Florida",
    "lat": -34.603296,
    "lng": -58.375076,
    "aliases": [
     "Florida"
    ]
   },
   {
    "name": "Carlos Pellegrini",
    "lat": -34.603636,
    "lng": -58.380719,
    "aliases": [
     "C. Pellegrini",
     "Carlos Pelegrini",
     "Carlos Pellegrini",
     "Pellegrini"
    ]
   },
   {
    "name": "Uruguay",
    "lat": -34.604093,
    "lng": -58.3873,
    "aliases": [
     "Uruguay"
    ]
   },
   {
    "name": "Callao",
    "lat": -34.604419,
    "lng": -58.392318,
    "aliases": [
     "Callao"
    ]
   },
   {
    "name": "Pasteur - AMIA",
    "lat": -34.604642,
    "lng": -58.399477,
    "aliases": [
     "Pasteur",
     "Pasteur - AMIA",
     "Pasteur AMIA"
    ]
   },
   {
    "name": "Pueyrredón",
    "lat": -34.60458,
    "lng": -58.405402,
    "aliases": [
     "Pueyrredón"
    ]
   },
   {
    "name": "Carlos Gardel",
    "lat": -34.604079,
    "lng": -58.411765,
    "aliases": [
     "Carlos Gardel"
    ]
   },
   {
    "name": "Medrano",
    "lat": -34.603164,
    "lng": -58.420965,
    "aliases": [
     "Medrano"
    ]
   },
   {
    "name": "Ángel Gallardo",
    "lat": -34.602162,
    "lng": -58.431276,
    "aliases": [
     "Angel Gallardo",
     "Ángel Gallardo"
    ]
   },
   {
    "name": "Malabia - Osvaldo Pugliese",
    "lat": -34.598967,
    "lng": -58.439773,
    "aliases": [
     "Malabia",
     "Malabia - Osvaldo Pugliese",
     "Osvaldo Pugliese"
    ]
   },
   {
    "name": "Dorrego",
    "lat": -34.591718,
    "lng": -58.447574,
    "aliases": [
     "Dorrego"
    ]
   },
   {
    "name": "Federico Lacroze",
    "lat": -34.587198,
    "lng": -58.45503,
    "aliases": [
     "F. Lacroze",
     "Federico Lacroze",
     "Lacroze"
    ]
   },
   {
    "name": "Tronador - Villa Ortúzar",
    "lat": -34.584095,
    "lng": -58.466228,
    "aliases": [
     "Tronador",
     "Tronador - Villa Ortúzar"
    ]
   },
   {
    "name": "De los Incas - Parque Chas",
    "lat": -34.581249,
    "lng": -58.474241,
    "aliases": [
     "De Los Incas - Parque Chas",
     "De los Incas",
     "De los Incas - Parque Chas"
    ]
   },
   {
    "name": "Echeverría",
    "lat": -34.577798,
    "lng": -58.481013,
    "aliases": [
     "Echeverría"
    ]
   },
   {
    "name": "Juan Manuel de Rosas - Villa Urquiza",
    "lat": -34.574319,
    "lng": -58.486385,
    "aliases": [
     "J. M. de Rosas",
     "Juan Manuel de Rosas",
     "Juan Manuel de Rosas - Villa Urquiza",
     "Villa Urquiza"
    ]
   }
  ]
 },
 "LineaC": {
  "letra": "C",
  "color": "#0072BC",
  "estaciones": [
   {
    "name": "Retiro",
    "lat": -34.591193,
    "lng": -58.374022,
    "aliases": [
     "Retiro"
    ]
   },
   {
    "name": "General San Martín",
    "lat": -34.595057,
    "lng": -58.377823,
    "aliases": [
     "General San Martin",
     "General San Martín",
     "Gral. San Martín",
     "San Martín"
    ]
   },
   {
    "name": "Lavalle",
    "lat": -34.601769,
    "lng": -58.37816,
    "aliases": [
     "Lavalle"
    ]
   },
   {
    "name": "Diagonal Norte",
    "lat": -34.604843,
    "lng": -58.379534,
    "aliases": [
     "Diag. Norte",
     "Diagonal Norte"
    ]
   },
   {
    "name": "Avenida de Mayo",
    "lat": -34.608982,
    "lng": -58.380615,
    "aliases": [
     "Av. de Mayo",
     "Avda. de Mayo",
     "Avenida de Mayo"
    ]
   },
   {
    "name": "Moreno",
    "lat": -34.612616,
    "lng": -58.380448,
    "aliases": [
     "Moreno"
    ]
   },
   {
    "name": "Independencia",
    "lat": -34.618124,
    "lng": -58.380177,
    "aliases": [
     "Independencia"
    ]
   },
   {
    "name": "San Juan",
    "lat": -34.621915,
    "lng": -58.379925,
    "aliases": [
     "San Juan"
    ]
   },
   {
    "name": "Constitución",
    "lat": -34.627618,
    "lng": -58.381438,
    "aliases": [
     "Constitucion",
     "Constitución",
     "Plaza Constitución"
    ]
   }
  ]
 },
 "LineaD": {
  "letra": "D",
  "color": "#00A650",
  "estaciones": [
   {
    "name": "Catedral",
    "lat": -34.607801,
    "lng": -58.37396,
    "aliases": [
     "Catedral"
    ]
   },
   {
    "name": "9 de Julio",
    "lat": -34.604244,
    "lng": -58.380578,
    "aliases": [
     "9 de Julio"
    ]
   },
   {
    "name": "Tribunales - Teatro Colón",
    "lat": -34.601586,
    "lng": -58.385146,
    "aliases": [
     "Teatro Colón",
     "Tribunales",
     "Tribunales - Teatro Colón"
    ]
   },
   {
    "name": "Callao",
    "lat": -34.599639,
    "lng": -58.393129,
    "aliases": [
     "Callao"
    ]
   },
   {
    "name": "Facultad de Medicina",
    "lat": -34.599756,
    "lng": -58.397927,
    "aliases": [
     "Facultad de Medicina"
    ]
   },
   {
    "name": "Pueyrredón",
    "lat": -34.594425,
    "lng": -58.402398,
    "aliases": [
     "Pueyrredón"
    ]
   },
   {
    "name": "Agüero",
    "lat": -34.591627,
    "lng": -58.407164,
    "aliases": [
     "Aguero",
     "Agüero"
    ]
   },
   {
    "name": "Bulnes",
    "lat": -34.588237,
    "lng": -58.411297,
    "aliases": [
     "Bulnes"
    ]
   },
   {
    "name": "Scalabrini Ortiz",
    "lat": -34.585156,
    "lng": -58.415958,
    "aliases": [
     "Scalabrini Ortiz",
     "Scalabrini Ortíz"
    ]
   },
   {
    "name": "Plaza Italia",
    "lat": -34.581411,
    "lng": -58.421198,
    "aliases": [
     "Plaza Italia"
    ]
   },
   {
    "name": "Palermo",
    "lat": -34.578422,
    "lng": -58.425714,
    "aliases": [
     "Palermo"
    ]
   },
   {
    "name": "Ministro Carranza",
    "lat": -34.575178,
    "lng": -58.435015,
    "aliases": [
     "Carranza",
     "Ministro Carranza",
     "Mtro. Carranza"
    ]
   },
   {
    "name": "Olleros",
    "lat": -34.570013,
    "lng": -58.44467,
    "aliases": [
     "Olleros"
    ]
   },
   {
    "name": "José Hernández",
    "lat": -34.566216,
    "lng": -58.452127,
    "aliases": [
     "Jose Hernandez",
     "José Hernández"
    ]
   },
   {
    "name": "Juramento",
    "lat": -34.56231,
    "lng": -58.45649,
    "aliases": [
     "Juramento"
    ]
   },
   {
    "name": "Congreso de Tucumán",
    "lat": -34.555642,
    "lng": -58.462379,
    "aliases": [
     "Congreso de Tucuman",
     "Congreso de Tucumán"
    ]
   }
  ]
 },
 "LineaE": {
  "letra": "E",
  "color": "#8E44AD",
  "estaciones": [
   {
    "name": "Retiro",
    "lat": -34.592177,
    "lng": -58.375725,
    "aliases": [
     "Retiro"
    ]
   },
   {
    "name": "Catalinas",
    "lat": -34.596623,
    "lng": -58.371669,
    "aliases": [
     "Catalinas"
    ]
   },
   {
    "name": "Correo Central",
    "lat": -34.603111,
    "lng": -58.370561,
    "aliases": [
     "Correo Central"
    ]
   },
   {
    "name": "Bolívar",
    "lat": -34.609241,
    "lng": -58.373688,
    "aliases": [
     "Bolivar",
     "Bolívar"
    ]
   },
   {
    "name": "Belgrano",
    "lat": -34.612848,
    "lng": -58.377585,
    "aliases": [
     "Belgrano"
    ]
   },
   {
    "name": "Independencia",
    "lat": -34.617936,
    "lng": -58.381539,
    "aliases": [
     "Independencia"
    ]
   },
   {
    "name": "San José",
    "lat": -34.622338,
    "lng": -58.385152,
    "aliases": [
     "San Jose",
     "San José"
    ]
   },
   {
    "name": "Entre Ríos - Rodolfo Walsh",
    "lat": -34.622718,
    "lng": -58.391515,
    "aliases": [
     "Entre Ríos",
     "Entre Ríos - Rodolfo Walsh",
     "Rodolfo Walsh"
    ]
   },
   {
    "name": "Pichincha",
    "lat": -34.623109,
    "lng": -58.397071,
    "aliases": [
     "Pichincha"
    ]
   },
   {
    "name": "Jujuy",
    "lat": -34.623865,
    "lng": -58.402939,
    "aliases": [
     "Jujuy"
    ]
   },
   {
    "name": "General Urquiza",
    "lat": -34.624653,
    "lng": -58.409393,
    "aliases": [
     "General Urquiza",
     "Gral. Urquiza",
     "Urquiza"
    ]
   },
   {
    "name": "Boedo",
    "lat": -34.625365,
    "lng": -58.415535,
    "aliases": [
     "Boedo"
    ]
   },
   {
    "name": "Avenida La Plata",
    "lat": -34.627014,
    "lng": -58.426791,
    "aliases": [
     "Av. La Plata",
     "Avenida La Plata",
     "La Plata"
    ]
   },
   {
    "name": "José M. Moreno",
    "lat": -34.628016,
    "lng": -58.433818,
    "aliases": [
     "J. M. Moreno",
     "Jose Maria Moreno",
     "José M. Moreno",
     "José María Moreno",
     "Moreno"
    ]
   },
   {
    "name": "Emilio Mitre",
    "lat": -34.631041,
    "lng": -58.442172,
    "aliases": [
     "Emilio Mitre"
    ]
   },
   {
    "name": "Medalla Milagrosa",
    "lat": -34.636388,
    "lng": -58.450279,
    "aliases": [
     "Medalla Milagrosa"
    ]
   },
   {
    "name": "Varela",
    "lat": -34.640136,
    "lng": -58.457892,
    "aliases": [
     "Varela"
    ]
   },
   {
    "name": "Plaza de los Virreyes",
    "lat": -34.643311,
    "lng": -58.461652,
    "aliases": [
     "Plaza de los Virreyes",
     "Pza. de los Virreyes",
     "Virreyes"
    ]
   }
  ]
 },
 "LineaH": {
  "letra": "H",
  "color": "#FFD200",
  "estaciones": [
   {
    "name": "Facultad de Derecho",
    "lat": -34.583036,
    "lng": -58.391022,
    "aliases": [
     "Derecho",
     "Fac. de Derecho",
     "Facultad de Derecho"
    ]
   },
   {
    "name": "Las Heras",
    "lat": -34.587461,
    "lng": -58.397219,
    "aliases": [
     "Las Heras"
    ]
   },
   {
    "name": "Santa Fe - Carlos Jáuregui",
    "lat": -34.594385,
    "lng": -58.402326,
    "aliases": [
     "Carlos Jauregui",
     "Carlos Jáuregui",
     "Santa Fe",
     "Santa Fe - Carlos Jáuregui"
    ]
   },
   {
    "name": "Córdoba",
    "lat": -34.598454,
    "lng": -58.403724,
    "aliases": [
     "Cordoba",
     "Córdoba"
    ]
   },
   {
    "name": "Corrientes",
    "lat": -34.604489,
    "lng": -58.405453,
    "aliases": [
     "Corrientes"
    ]
   },
   {
    "name": "Once - 30 de Diciembre",
    "lat": -34.608934,
    "lng": -58.406039,
    "aliases": [
     "30 de Diciembre",
     "Once",
     "Once - 30 de Diciembre"
    ]
   },
   {
    "name": "Venezuela",
    "lat": -34.615241,
    "lng": -58.404734,
    "aliases": [
     "Venezuela"
    ]
   },
   {
    "name": "Humberto 1°",
    "lat": -34.623091,
    "lng": -58.402325,
    "aliases": [
     "Humberto 1",
     "Humberto 1°",
     "Humberto I",
     "Humberto Primero"
    ]
   },
   {
    "name": "Inclán",
    "lat": -34.629374,
    "lng": -58.400972,
    "aliases": [
     "Inclan",
     "Inclán",
     "Inclán - Mezquita Al Ahmad"
    ]
   },
   {
    "name": "Caseros",
    "lat": -34.635749,
    "lng": -58.39893,
    "aliases": [
     "Caseros"
    ]
   },
   {
    "name": "Parque Patricios",
    "lat": -34.638404,
    "lng": -58.405797,
    "aliases": [
     "Parque Patricios"
    ]
   },
   {
    "name": "Hospitales",
    "lat": -34.641267,
    "lng": -58.412387,
    "aliases": [
     "Hospitales"
    ]
   }
  ]
 }
};
