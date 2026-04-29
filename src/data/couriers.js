// Demo-data: 80 AMP-bezorgers met realistische orderaantallen (~40 per persoon).
// Deterministisch: dezelfde data bij elke reload.
//
// Per bezorger:
//   - depot: lat/lng van de start-stad
//   - stops: array met alle stops in volgorde, elk met { lat, lng, done }
//   - currentLocation: huidige positie (laatst gedane stop, of depot bij 0%)

// Drie hoofd-depots van AMP. Onbekend = courier zonder vaste depot.
const cityCoords = {
  Houten:     [52.0314, 5.1681],
  Utrecht:    [52.0907, 5.1214],
  Nieuwegein: [52.0297, 5.0908],
  Onbekend:   [52.0314, 5.1681]
};

// Pool van Nederlandse straatnamen voor adres-generatie
const streets = [
  "Hoofdstraat", "Dorpsstraat", "Kerkstraat", "Schoolstraat",
  "Wilhelminalaan", "Beatrixlaan", "Julianaweg", "Stationsweg",
  "Molenstraat", "Bakkerstraat", "Lange Straat", "Korte Straat",
  "Marktplein", "Singel", "Brink", "Nieuwstraat",
  "Oosterhof", "Westwal", "Houtensepad", "Vlierhof",
  "Kastanjelaan", "Eikenlaan", "Berkenweg", "Lindelaan"
];

function parseTime(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(min) {
  const h = Math.floor(min / 60);
  const m = Math.floor(min) % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Parseer vertraging-string als "1 uur 32 min te laat" -> 92 minuten.
// Returned 0 als status "te vroeg" of leeg is.
export function parseDelay(status) {
  if (!status) return 0;
  const lower = status.toLowerCase();
  if (!lower.includes("te laat")) return 0;
  let total = 0;
  const hourMatch = lower.match(/(\d+)\s*uur/);
  const minMatch = lower.match(/(\d+)\s*min/);
  if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
  if (minMatch) total += parseInt(minMatch[1], 10);
  return total;
}

// Hertel een ETA-string als "09:15" met X extra minuten.
export function shiftEta(eta, deltaMin) {
  if (!deltaMin) return eta;
  return formatTime(parseTime(eta) + deltaMin);
}

// Deterministische random-walk vanaf depot.
// Elke stop ~300-700m van de vorige, zodat de route eruitziet als een echte rit.
// ETA wordt lineair gespreid over de werkuren van de bezorger.
function generateStops(courierId, depot, totalCount, doneCount, hoursStr) {
  const seed = parseInt(courierId, 10);
  const stops = [];
  let lat = depot[0];
  let lng = depot[1];

  const [startStr, endStr] = hoursStr.split(" - ");
  const startMin = parseTime(startStr);
  const endMin = parseTime(endStr);
  const stopInterval = totalCount > 0 ? (endMin - startMin) / totalCount : 0;

  for (let i = 0; i < totalCount; i++) {
    const angle = ((seed + i * 31) % 360) * (Math.PI / 180);
    const step = 0.003 + ((seed + i * 17) % 5) * 0.001;
    lat += Math.sin(angle) * step;
    lng += Math.cos(angle) * step * 1.5;

    const street = streets[(seed + i * 13) % streets.length];
    const houseNumber = ((seed + i * 7) % 198) + 1;
    const eta = formatTime(startMin + i * stopInterval);

    stops.push({
      lat,
      lng,
      done: i < doneCount,
      orderNumber: `${courierId}-${(i + 1).toString().padStart(3, "0")}`,
      address: `${street} ${houseNumber}`,
      eta
    });
  }
  return stops;
}

const rawCouriers = [
  { name: "AMP Hamza K",     id: "1100", city: "Houten",     progress: "23 / 40 Orders", hours: "08:30 - 18:21", status: "59 min te vroeg",          active: false },
  { name: "AMP Huub O",      id: "1101", city: "Onbekend",   progress: "1 / 1 Orders",   hours: "14:00 - 19:19", status: "",                         active: false },
  { name: "AMP Ismail N",    id: "1102", city: "Houten",     progress: "17 / 53 Orders", hours: "08:30 - 17:05", status: "1 uur en 32 min te vroeg", active: false },
  { name: "AMP Mahmut C",    id: "1103", city: "Houten",     progress: "38 / 38 Orders", hours: "08:30 - 18:03", status: "",                         active: true  },
  { name: "AMP Mika B",      id: "1104", city: "Houten",     progress: "25 / 36 Orders", hours: "08:30 - 18:14", status: "26 min te vroeg",          active: false },
  { name: "AMP Mehmet A",    id: "1105", city: "Houten",     progress: "31 / 42 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Yusuf D",     id: "1106", city: "Utrecht",    progress: "19 / 38 Orders", hours: "08:30 - 17:45", status: "12 min te laat",           active: false },
  { name: "AMP Tarik H",     id: "1107", city: "Houten",     progress: "40 / 40 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Bram L",      id: "1108", city: "Houten",     progress: "22 / 45 Orders", hours: "08:30 - 18:30", status: "",                         active: false },
  { name: "AMP Daan V",      id: "1109", city: "Nieuwegein", progress: "33 / 41 Orders", hours: "08:30 - 18:05", status: "8 min te vroeg",           active: false },
  { name: "AMP Tom S",       id: "1110", city: "Houten",     progress: "15 / 39 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Stijn M",     id: "1111", city: "Houten",     progress: "37 / 44 Orders", hours: "08:30 - 18:25", status: "",                         active: false },
  { name: "AMP Lars P",      id: "1112", city: "Utrecht",     progress: "28 / 36 Orders", hours: "08:30 - 17:30", status: "45 min te vroeg",          active: false },
  { name: "AMP Niek J",      id: "1113", city: "Houten",     progress: "11 / 42 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Sem K",       id: "1114", city: "Utrecht",    progress: "44 / 47 Orders", hours: "08:30 - 18:40", status: "",                         active: false },
  { name: "AMP Finn O",      id: "1115", city: "Houten",     progress: "20 / 35 Orders", hours: "08:30 - 17:55", status: "20 min te laat",           active: false },
  { name: "AMP Luuk W",      id: "1116", city: "Houten",     progress: "39 / 39 Orders", hours: "08:30 - 17:45", status: "",                         active: false },
  { name: "AMP Bas H",       id: "1117", city: "Houten",     progress: "27 / 43 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Tim R",       id: "1118", city: "Nieuwegein",progress: "16 / 38 Orders", hours: "08:30 - 18:20", status: "1 uur te laat",            active: false },
  { name: "AMP Mark D",      id: "1119", city: "Houten",     progress: "32 / 40 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Ahmed B",     id: "1120", city: "Houten",     progress: "18 / 41 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Hakan T",     id: "1121", city: "Utrecht",    progress: "36 / 42 Orders", hours: "08:30 - 18:08", status: "15 min te vroeg",          active: false },
  { name: "AMP Mustafa Y",   id: "1122", city: "Houten",     progress: "24 / 44 Orders", hours: "08:30 - 18:30", status: "",                         active: false },
  { name: "AMP Omar L",      id: "1123", city: "Houten",     progress: "41 / 41 Orders", hours: "08:30 - 17:35", status: "",                         active: false },
  { name: "AMP Karim S",     id: "1124", city: "Utrecht",     progress: "29 / 37 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Bilal V",     id: "1125", city: "Houten",     progress: "21 / 39 Orders", hours: "08:30 - 18:05", status: "32 min te vroeg",          active: false },
  { name: "AMP Anwar R",     id: "1126", city: "Onbekend",   progress: "5 / 12 Orders",  hours: "12:00 - 17:00", status: "",                         active: false },
  { name: "AMP Hassan M",    id: "1127", city: "Houten",     progress: "34 / 45 Orders", hours: "08:30 - 18:35", status: "",                         active: false },
  { name: "AMP Ayoub C",     id: "1128", city: "Houten",     progress: "26 / 40 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Rachid F",    id: "1129", city: "Utrecht",    progress: "19 / 36 Orders", hours: "08:30 - 17:45", status: "8 min te laat",            active: false },
  { name: "AMP Said O",      id: "1130", city: "Houten",     progress: "42 / 42 Orders", hours: "08:30 - 17:30", status: "",                         active: false },
  { name: "AMP Younes I",    id: "1131", city: "Houten",     progress: "30 / 38 Orders", hours: "08:30 - 17:55", status: "",                         active: false },
  { name: "AMP Adil B",      id: "1132", city: "Nieuwegein", progress: "14 / 41 Orders", hours: "08:30 - 18:20", status: "",                         active: false },
  { name: "AMP Salim K",     id: "1133", city: "Houten",     progress: "37 / 43 Orders", hours: "08:30 - 18:15", status: "22 min te vroeg",          active: false },
  { name: "AMP Mehdi A",     id: "1134", city: "Houten",     progress: "23 / 39 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Ridouan N",   id: "1135", city: "Houten",     progress: "40 / 40 Orders", hours: "08:30 - 17:40", status: "",                         active: false },
  { name: "AMP Khalid M",    id: "1136", city: "Utrecht",    progress: "31 / 44 Orders", hours: "08:30 - 18:25", status: "",                         active: false },
  { name: "AMP Imran S",     id: "1137", city: "Houten",     progress: "17 / 37 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Jasper V",    id: "1138", city: "Utrecht",     progress: "35 / 42 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Wouter B",    id: "1139", city: "Houten",     progress: "28 / 40 Orders", hours: "08:30 - 18:00", status: "5 min te laat",            active: false },
  { name: "AMP Rik H",       id: "1140", city: "Houten",     progress: "44 / 44 Orders", hours: "08:30 - 17:25", status: "",                         active: false },
  { name: "AMP Gijs M",      id: "1141", city: "Houten",     progress: "20 / 38 Orders", hours: "08:30 - 17:55", status: "",                         active: false },
  { name: "AMP Maarten T",   id: "1142", city: "Nieuwegein",progress: "33 / 41 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Joep K",      id: "1143", city: "Houten",     progress: "25 / 36 Orders", hours: "08:30 - 17:45", status: "18 min te vroeg",          active: false },
  { name: "AMP Sven D",      id: "1144", city: "Houten",     progress: "39 / 45 Orders", hours: "08:30 - 18:30", status: "",                         active: false },
  { name: "AMP Ruud P",      id: "1145", city: "Houten",     progress: "16 / 40 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Erik V",      id: "1146", city: "Utrecht",    progress: "32 / 42 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Marcel B",    id: "1147", city: "Houten",     progress: "27 / 39 Orders", hours: "08:30 - 18:00", status: "10 min te laat",           active: false },
  { name: "AMP Sjoerd L",    id: "1148", city: "Houten",     progress: "41 / 41 Orders", hours: "08:30 - 17:35", status: "",                         active: false },
  { name: "AMP Henk T",      id: "1149", city: "Utrecht",     progress: "22 / 38 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Piet K",      id: "1150", city: "Houten",     progress: "36 / 43 Orders", hours: "08:30 - 18:20", status: "40 min te vroeg",          active: false },
  { name: "AMP Kees R",      id: "1151", city: "Houten",     progress: "29 / 40 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Jan S",       id: "1152", city: "Onbekend",   progress: "8 / 25 Orders",  hours: "13:00 - 18:00", status: "",                         active: false },
  { name: "AMP Marco H",     id: "1153", city: "Houten",     progress: "34 / 42 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Patrick V",   id: "1154", city: "Houten",     progress: "21 / 37 Orders", hours: "08:30 - 17:45", status: "1 uur te laat",            active: false },
  { name: "AMP Levi M",      id: "1155", city: "Utrecht",    progress: "38 / 40 Orders", hours: "08:30 - 17:40", status: "",                         active: false },
  { name: "AMP Amir K",      id: "1156", city: "Houten",     progress: "26 / 41 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Sami B",      id: "1157", city: "Houten",     progress: "43 / 43 Orders", hours: "08:30 - 17:30", status: "",                         active: false },
  { name: "AMP Reza T",      id: "1158", city: "Nieuwegein", progress: "19 / 39 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Dean V",      id: "1159", city: "Houten",     progress: "31 / 38 Orders", hours: "08:30 - 17:55", status: "12 min te vroeg",          active: false },
  { name: "AMP Jordan B",    id: "1160", city: "Houten",     progress: "24 / 44 Orders", hours: "08:30 - 18:30", status: "",                         active: false },
  { name: "AMP Davey K",     id: "1161", city: "Houten",     progress: "40 / 40 Orders", hours: "08:30 - 17:40", status: "",                         active: false },
  { name: "AMP Mitchell H",  id: "1162", city: "Utrecht",     progress: "17 / 36 Orders", hours: "08:30 - 17:45", status: "",                         active: false },
  { name: "AMP Ricardo S",   id: "1163", city: "Houten",     progress: "33 / 41 Orders", hours: "08:30 - 18:05", status: "",                         active: false },
  { name: "AMP Roberto P",   id: "1164", city: "Houten",     progress: "28 / 40 Orders", hours: "08:30 - 18:00", status: "25 min te laat",           active: false },
  { name: "AMP Diego M",     id: "1165", city: "Utrecht",    progress: "39 / 42 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Anass V",     id: "1166", city: "Houten",     progress: "22 / 37 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Jamal R",     id: "1167", city: "Houten",     progress: "45 / 45 Orders", hours: "08:30 - 17:25", status: "",                         active: false },
  { name: "AMP Soufyan M",   id: "1168", city: "Houten",     progress: "30 / 39 Orders", hours: "08:30 - 18:00", status: "8 min te vroeg",           active: false },
  { name: "AMP Ilias K",     id: "1169", city: "Houten",     progress: "18 / 38 Orders", hours: "08:30 - 17:55", status: "",                         active: false },
  { name: "AMP Zakaria H",   id: "1170", city: "Nieuwegein",progress: "35 / 42 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Iliass A",    id: "1171", city: "Houten",     progress: "27 / 41 Orders", hours: "08:30 - 18:05", status: "",                         active: false },
  { name: "AMP Walid M",     id: "1172", city: "Houten",     progress: "42 / 42 Orders", hours: "08:30 - 17:30", status: "",                         active: false },
  { name: "AMP Jasin K",     id: "1173", city: "Utrecht",     progress: "23 / 40 Orders", hours: "08:30 - 18:00", status: "55 min te vroeg",          active: false },
  { name: "AMP Kasper L",    id: "1174", city: "Houten",     progress: "37 / 44 Orders", hours: "08:30 - 18:25", status: "",                         active: false },
  { name: "AMP Jelle B",     id: "1175", city: "Houten",     progress: "21 / 36 Orders", hours: "08:30 - 17:45", status: "",                         active: false },
  { name: "AMP Robin K",     id: "1176", city: "Houten",     progress: "44 / 44 Orders", hours: "08:30 - 17:35", status: "",                         active: false },
  { name: "AMP Sander M",    id: "1177", city: "Utrecht",    progress: "29 / 40 Orders", hours: "08:30 - 18:00", status: "15 min te laat",           active: false },
  { name: "AMP Bart W",      id: "1178", city: "Houten",     progress: "34 / 41 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Thijs V",     id: "1179", city: "Houten",     progress: "26 / 39 Orders", hours: "08:30 - 17:55", status: "",                         active: false }
];

// Verrijk elke bezorger met depot + stops + currentLocation
export const couriers = rawCouriers.map((c) => {
  const depot = cityCoords[c.city] || cityCoords.Houten;
  const total = parseInt(c.progress.split("/")[1], 10) || 0;
  const done = parseInt(c.progress.split("/")[0], 10) || 0;
  const stops = generateStops(c.id, depot, total, done, c.hours);
  const currentLocation = done > 0
    ? [stops[done - 1].lat, stops[done - 1].lng]
    : depot;
  return { ...c, depot, stops, currentLocation };
});

// Depots = unieke steden waar bezorgers vandaan komen, met coords
export const depots = Object.entries(cityCoords)
  .filter(([city]) => city !== "Onbekend")
  .map(([city, coords]) => ({
    name: city,
    lat: coords[0],
    lng: coords[1],
    courierCount: couriers.filter((c) => c.city === city).length
  }));

// Stats afgeleid van de bezorgers-array
export const courierStats = [
  { label: "Bezorgers", value: String(couriers.length), icon: "mdi-account-group" },
  {
    label: "Stops",
    value: String(
      couriers.reduce((sum, c) => sum + c.stops.length, 0)
    ),
    icon: "mdi-map-marker-outline"
  },
  {
    label: "Orders",
    value: String(
      couriers.reduce((sum, c) => sum + c.stops.filter((s) => s.done).length, 0)
    ),
    icon: "mdi-package-variant-closed"
  }
];
