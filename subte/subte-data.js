// Datos de líneas y estaciones de subte (coordenadas: proyecto Andén, orden: recorrido real)
const SUBTE = {
 "LineaA": {
  "letra": "A",
  "color": "#00AEEF",
  "terminales": [
   "Plaza de Mayo",
   "San Pedrito"
  ],
  "estaciones": [
   {
    "name": "Plaza de Mayo",
    "lat": -34.608809,
    "lng": -58.370973,
    "keys": [
     "plaza de mayo"
    ]
   },
   {
    "name": "Perú",
    "lat": -34.608558,
    "lng": -58.374272,
    "keys": [
     "peru"
    ]
   },
   {
    "name": "Piedras",
    "lat": -34.608881,
    "lng": -58.379089,
    "keys": [
     "piedras"
    ]
   },
   {
    "name": "Lima",
    "lat": -34.609099,
    "lng": -58.382236,
    "keys": [
     "lima"
    ]
   },
   {
    "name": "Sáenz Peña",
    "lat": -34.609412,
    "lng": -58.386781,
    "keys": [
     "saenz pena"
    ]
   },
   {
    "name": "Congreso",
    "lat": -34.609225,
    "lng": -58.392672,
    "keys": [
     "congreso",
     "congreso pdte dr raul alfonsin"
    ]
   },
   {
    "name": "Pasco",
    "lat": -34.609645,
    "lng": -58.39843,
    "keys": [
     "pasco"
    ]
   },
   {
    "name": "Alberti",
    "lat": -34.609833,
    "lng": -58.40121,
    "keys": [
     "alberti"
    ]
   },
   {
    "name": "Plaza Miserere",
    "lat": -34.609816,
    "lng": -58.40671,
    "keys": [
     "plaza de miserere",
     "plaza miserere"
    ]
   },
   {
    "name": "Loria",
    "lat": -34.610781,
    "lng": -58.415188,
    "keys": [
     "loria"
    ]
   },
   {
    "name": "Castro Barros",
    "lat": -34.611769,
    "lng": -58.421818,
    "keys": [
     "castro barros"
    ]
   },
   {
    "name": "Río de Janeiro",
    "lat": -34.615205,
    "lng": -58.429502,
    "keys": [
     "rio de janeiro"
    ]
   },
   {
    "name": "Acoyte",
    "lat": -34.618279,
    "lng": -58.43643,
    "keys": [
     "acoyte"
    ]
   },
   {
    "name": "Primera Junta",
    "lat": -34.620404,
    "lng": -58.441179,
    "keys": [
     "primera junta"
    ]
   },
   {
    "name": "Puán",
    "lat": -34.623528,
    "lng": -58.448648,
    "keys": [
     "puan"
    ]
   },
   {
    "name": "Carabobo",
    "lat": -34.626666,
    "lng": -58.45671,
    "keys": [
     "carabobo"
    ]
   },
   {
    "name": "San José de Flores",
    "lat": -34.629086,
    "lng": -58.463541,
    "keys": [
     "san jose de flores"
    ]
   },
   {
    "name": "San Pedrito",
    "lat": -34.630706,
    "lng": -58.46964,
    "keys": [
     "san pedrito"
    ]
   }
  ]
 },
 "LineaB": {
  "letra": "B",
  "color": "#EE3124",
  "terminales": [
   "L. N. Alem",
   "J. M. de Rosas"
  ],
  "estaciones": [
   {
    "name": "Leandro N. Alem",
    "lat": -34.602989,
    "lng": -58.369934,
    "keys": [
     "leandro n alem"
    ]
   },
   {
    "name": "Florida",
    "lat": -34.603296,
    "lng": -58.375076,
    "keys": [
     "florida"
    ]
   },
   {
    "name": "Carlos Pellegrini",
    "lat": -34.603636,
    "lng": -58.380719,
    "keys": [
     "c pellegrini",
     "carlos pelegrini",
     "carlos pellegrini"
    ]
   },
   {
    "name": "Uruguay",
    "lat": -34.604093,
    "lng": -58.3873,
    "keys": [
     "uruguay"
    ]
   },
   {
    "name": "Callao",
    "lat": -34.604419,
    "lng": -58.392318,
    "keys": [
     "callao",
     "callao maestro alfredo bravo"
    ]
   },
   {
    "name": "Pasteur",
    "lat": -34.604642,
    "lng": -58.399477,
    "keys": [
     "pasteur",
     "pasteur amia"
    ]
   },
   {
    "name": "Pueyrredón",
    "lat": -34.60458,
    "lng": -58.405402,
    "keys": [
     "pueyrredon"
    ]
   },
   {
    "name": "Carlos Gardel",
    "lat": -34.604079,
    "lng": -58.411765,
    "keys": [
     "carlos gardel"
    ]
   },
   {
    "name": "Medrano",
    "lat": -34.603164,
    "lng": -58.420965,
    "keys": [
     "almagro",
     "almagro medrano",
     "medrano"
    ]
   },
   {
    "name": "Ángel Gallardo",
    "lat": -34.602162,
    "lng": -58.431276,
    "keys": [
     "angel gallardo"
    ]
   },
   {
    "name": "Malabia",
    "lat": -34.598967,
    "lng": -58.439773,
    "keys": [
     "malabia",
     "malabia osvaldo pugliese"
    ]
   },
   {
    "name": "Dorrego",
    "lat": -34.591718,
    "lng": -58.447574,
    "keys": [
     "dorrego"
    ]
   },
   {
    "name": "Federico Lacroze",
    "lat": -34.587198,
    "lng": -58.45503,
    "keys": [
     "federico lacroze"
    ]
   },
   {
    "name": "Tronador - Villa Ortúzar",
    "lat": -34.584095,
    "lng": -58.466228,
    "keys": [
     "tronador",
     "tronador villa ortuzar"
    ]
   },
   {
    "name": "De Los Incas - Parque Chas",
    "lat": -34.581249,
    "lng": -58.474241,
    "keys": [
     "de los incas",
     "de los incas parque chas",
     "de los incas pque chas"
    ]
   },
   {
    "name": "Echeverría",
    "lat": -34.577798,
    "lng": -58.481013,
    "keys": [
     "echeverria",
     "echeverria martires palotinos"
    ]
   },
   {
    "name": "Juan Manuel de Rosas",
    "lat": -34.574319,
    "lng": -58.486385,
    "keys": [
     "juan manuel de rosas",
     "juan manuel de rosas villa urquiza"
    ]
   }
  ]
 },
 "LineaC": {
  "letra": "C",
  "color": "#0072BC",
  "terminales": [
   "Constitución",
   "Retiro"
  ],
  "estaciones": [
   {
    "name": "Constitucion",
    "lat": -34.627618,
    "lng": -58.381438,
    "keys": [
     "constitucion"
    ]
   },
   {
    "name": "San Juan",
    "lat": -34.621915,
    "lng": -58.379925,
    "keys": [
     "san juan"
    ]
   },
   {
    "name": "Independencia",
    "lat": -34.618124,
    "lng": -58.380177,
    "keys": [
     "independencia"
    ]
   },
   {
    "name": "Moreno",
    "lat": -34.612616,
    "lng": -58.380448,
    "keys": [
     "moreno"
    ]
   },
   {
    "name": "Avenida de Mayo",
    "lat": -34.608982,
    "lng": -58.380615,
    "keys": [
     "av de mayo",
     "avenida de mayo"
    ]
   },
   {
    "name": "Diagonal Norte",
    "lat": -34.604843,
    "lng": -58.379534,
    "keys": [
     "diagonal norte"
    ]
   },
   {
    "name": "Lavalle",
    "lat": -34.601769,
    "lng": -58.37816,
    "keys": [
     "lavalle"
    ]
   },
   {
    "name": "General San Martin",
    "lat": -34.595057,
    "lng": -58.377823,
    "keys": [
     "general san martin",
     "san martin"
    ]
   },
   {
    "name": "Retiro",
    "lat": -34.591193,
    "lng": -58.374022,
    "keys": [
     "retiro"
    ]
   }
  ]
 },
 "LineaD": {
  "letra": "D",
  "color": "#00A650",
  "terminales": [
   "Catedral",
   "Congreso de Tucumán"
  ],
  "estaciones": [
   {
    "name": "Catedral",
    "lat": -34.607801,
    "lng": -58.37396,
    "keys": [
     "catedral"
    ]
   },
   {
    "name": "9 de Julio",
    "lat": -34.604244,
    "lng": -58.380578,
    "keys": [
     "9 de julio"
    ]
   },
   {
    "name": "Tribunales",
    "lat": -34.601586,
    "lng": -58.385146,
    "keys": [
     "tribunales",
     "tribunales teatro colon"
    ]
   },
   {
    "name": "Callao",
    "lat": -34.599639,
    "lng": -58.393129,
    "keys": [
     "callao"
    ]
   },
   {
    "name": "Facultad de Medicina",
    "lat": -34.599756,
    "lng": -58.397927,
    "keys": [
     "facultad de medicina"
    ]
   },
   {
    "name": "Pueyrredón",
    "lat": -34.594425,
    "lng": -58.402398,
    "keys": [
     "pueyrredon"
    ]
   },
   {
    "name": "Agüero",
    "lat": -34.591627,
    "lng": -58.407164,
    "keys": [
     "aguero"
    ]
   },
   {
    "name": "Bulnes",
    "lat": -34.588237,
    "lng": -58.411297,
    "keys": [
     "bulnes"
    ]
   },
   {
    "name": "Scalabrini Ortíz",
    "lat": -34.585156,
    "lng": -58.415958,
    "keys": [
     "r scalabrini ortiz",
     "scalabrini ortiz"
    ]
   },
   {
    "name": "Plaza Italia",
    "lat": -34.581411,
    "lng": -58.421198,
    "keys": [
     "plaza italia"
    ]
   },
   {
    "name": "Palermo",
    "lat": -34.578422,
    "lng": -58.425714,
    "keys": [
     "palermo"
    ]
   },
   {
    "name": "Ministro Carranza",
    "lat": -34.575178,
    "lng": -58.435015,
    "keys": [
     "ministro carranza",
     "ministro carranza miguel abuelo"
    ]
   },
   {
    "name": "Olleros",
    "lat": -34.570013,
    "lng": -58.44467,
    "keys": [
     "olleros"
    ]
   },
   {
    "name": "José Hernández",
    "lat": -34.566216,
    "lng": -58.452127,
    "keys": [
     "jose hernandez"
    ]
   },
   {
    "name": "Juramento",
    "lat": -34.56231,
    "lng": -58.45649,
    "keys": [
     "juramento"
    ]
   },
   {
    "name": "Congreso de Tucumán",
    "lat": -34.555642,
    "lng": -58.462379,
    "keys": [
     "congreso de tucuman"
    ]
   }
  ]
 },
 "LineaE": {
  "letra": "E",
  "color": "#8E44AD",
  "terminales": [
   "Retiro",
   "Plaza de los Virreyes"
  ],
  "estaciones": [
   {
    "name": "Retiro",
    "lat": -34.592177,
    "lng": -58.375725,
    "keys": [
     "retiro"
    ]
   },
   {
    "name": "Catalinas",
    "lat": -34.596623,
    "lng": -58.371669,
    "keys": [
     "catalinas"
    ]
   },
   {
    "name": "Correo Central",
    "lat": -34.603111,
    "lng": -58.370561,
    "keys": [
     "correo central"
    ]
   },
   {
    "name": "Bolivar",
    "lat": -34.609241,
    "lng": -58.373688,
    "keys": [
     "bolivar"
    ]
   },
   {
    "name": "Belgrano",
    "lat": -34.612848,
    "lng": -58.377585,
    "keys": [
     "belgrano"
    ]
   },
   {
    "name": "Independencia",
    "lat": -34.617936,
    "lng": -58.381539,
    "keys": [
     "independencia",
     "independencia beata mama antula"
    ]
   },
   {
    "name": "San José",
    "lat": -34.622338,
    "lng": -58.385152,
    "keys": [
     "san jose"
    ]
   },
   {
    "name": "Entre Ríos",
    "lat": -34.622718,
    "lng": -58.391515,
    "keys": [
     "entre rios",
     "entre rios rodolfo walsh"
    ]
   },
   {
    "name": "Pichincha",
    "lat": -34.623109,
    "lng": -58.397071,
    "keys": [
     "pichincha"
    ]
   },
   {
    "name": "Jujuy",
    "lat": -34.623865,
    "lng": -58.402939,
    "keys": [
     "jujuy"
    ]
   },
   {
    "name": "General Urquiza",
    "lat": -34.624653,
    "lng": -58.409393,
    "keys": [
     "general urquiza",
     "urquiza"
    ]
   },
   {
    "name": "Boedo",
    "lat": -34.625365,
    "lng": -58.415535,
    "keys": [
     "boedo"
    ]
   },
   {
    "name": "Av. La Plata",
    "lat": -34.627014,
    "lng": -58.426791,
    "keys": [
     "av la plata",
     "la plata"
    ]
   },
   {
    "name": "Jose Maria Moreno",
    "lat": -34.628016,
    "lng": -58.433818,
    "keys": [
     "jose maria moreno",
     "moreno"
    ]
   },
   {
    "name": "Emilio Mitre",
    "lat": -34.631041,
    "lng": -58.442172,
    "keys": [
     "emilio mitre"
    ]
   },
   {
    "name": "Medalla Milagrosa",
    "lat": -34.636388,
    "lng": -58.450279,
    "keys": [
     "medalla milagrosa"
    ]
   },
   {
    "name": "Varela",
    "lat": -34.640136,
    "lng": -58.457892,
    "keys": [
     "varela"
    ]
   },
   {
    "name": "Plaza de los Virreyes",
    "lat": -34.643311,
    "lng": -58.461652,
    "keys": [
     "plaza de los virreyes",
     "plaza de los virreyes eva peron"
    ]
   }
  ]
 },
 "LineaH": {
  "letra": "H",
  "color": "#FFD200",
  "terminales": [
   "Facultad de Derecho",
   "Hospitales"
  ],
  "estaciones": [
   {
    "name": "Facultad de Derecho",
    "lat": -34.583036,
    "lng": -58.391022,
    "keys": [
     "facultad de derecho",
     "facultad de derecho julieta lanteri"
    ]
   },
   {
    "name": "Las Heras",
    "lat": -34.587461,
    "lng": -58.397219,
    "keys": [
     "las heras"
    ]
   },
   {
    "name": "Santa Fe",
    "lat": -34.594385,
    "lng": -58.402326,
    "keys": [
     "santa fe",
     "santa fe carlos jauregui"
    ]
   },
   {
    "name": "Cordoba",
    "lat": -34.598454,
    "lng": -58.403724,
    "keys": [
     "cordoba"
    ]
   },
   {
    "name": "Corrientes",
    "lat": -34.604489,
    "lng": -58.405453,
    "keys": [
     "corrientes"
    ]
   },
   {
    "name": "Once",
    "lat": -34.608934,
    "lng": -58.406039,
    "keys": [
     "once",
     "once 30 de diciembre"
    ]
   },
   {
    "name": "Venezuela",
    "lat": -34.615241,
    "lng": -58.404734,
    "keys": [
     "venezuela"
    ]
   },
   {
    "name": "Humberto 1",
    "lat": -34.623091,
    "lng": -58.402325,
    "keys": [
     "humberto 1",
     "humberto 1°"
    ]
   },
   {
    "name": "Inclan",
    "lat": -34.629374,
    "lng": -58.400972,
    "keys": [
     "inclan",
     "inclan mezquita al ahmad"
    ]
   },
   {
    "name": "Caseros",
    "lat": -34.635749,
    "lng": -58.39893,
    "keys": [
     "caseros"
    ]
   },
   {
    "name": "Parque Patricios",
    "lat": -34.638404,
    "lng": -58.405797,
    "keys": [
     "parque patricios"
    ]
   },
   {
    "name": "Hospitales",
    "lat": -34.641267,
    "lng": -58.412387,
    "keys": [
     "hospitales",
     "hospitales ringo bonavena"
    ]
   }
  ]
 }
};
