// Demo-data: 80 AMP-bezorgers met realistische orderaantallen (~40 per persoon).
// Deterministisch: dezelfde data bij elke reload.

export const couriers = [
  { name: "AMP Hamza K",     id: "1754", city: "Houten",     progress: "23 / 40 Orders", hours: "08:30 - 18:21", status: "59 min te vroeg",          active: false },
  { name: "AMP Huub O",      id: "1249", city: "Onbekend",   progress: "1 / 1 Orders",   hours: "14:00 - 19:19", status: "",                         active: false },
  { name: "AMP Ismail N",    id: "1897", city: "Houten",     progress: "17 / 53 Orders", hours: "08:30 - 17:05", status: "1 uur en 32 min te vroeg", active: false },
  { name: "AMP Mahmut C",    id: "1742", city: "Houten",     progress: "38 / 38 Orders", hours: "08:30 - 18:03", status: "",                         active: true  },
  { name: "AMP Mika B",      id: "1707", city: "Houten",     progress: "25 / 36 Orders", hours: "08:30 - 18:14", status: "26 min te vroeg",          active: false },
  { name: "AMP Mehmet A",    id: "1812", city: "Houten",     progress: "31 / 42 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Yusuf D",     id: "1356", city: "Utrecht",    progress: "19 / 38 Orders", hours: "08:30 - 17:45", status: "12 min te laat",           active: false },
  { name: "AMP Tarik H",     id: "1923", city: "Houten",     progress: "40 / 40 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Bram L",      id: "1487", city: "Houten",     progress: "22 / 45 Orders", hours: "08:30 - 18:30", status: "",                         active: false },
  { name: "AMP Daan V",      id: "1601", city: "Nieuwegein", progress: "33 / 41 Orders", hours: "08:30 - 18:05", status: "8 min te vroeg",           active: false },
  { name: "AMP Tom S",       id: "1278", city: "Houten",     progress: "15 / 39 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Stijn M",     id: "1845", city: "Houten",     progress: "37 / 44 Orders", hours: "08:30 - 18:25", status: "",                         active: false },
  { name: "AMP Lars P",      id: "1392", city: "Bunnik",     progress: "28 / 36 Orders", hours: "08:30 - 17:30", status: "45 min te vroeg",          active: false },
  { name: "AMP Niek J",      id: "1556", city: "Houten",     progress: "11 / 42 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Sem K",       id: "1719", city: "Utrecht",    progress: "44 / 47 Orders", hours: "08:30 - 18:40", status: "",                         active: false },
  { name: "AMP Finn O",      id: "1234", city: "Houten",     progress: "20 / 35 Orders", hours: "08:30 - 17:55", status: "20 min te laat",           active: false },
  { name: "AMP Luuk W",      id: "1888", city: "Houten",     progress: "39 / 39 Orders", hours: "08:30 - 17:45", status: "",                         active: false },
  { name: "AMP Bas H",       id: "1467", city: "Houten",     progress: "27 / 43 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Tim R",       id: "1612", city: "IJsselstein",progress: "16 / 38 Orders", hours: "08:30 - 18:20", status: "1 uur te laat",            active: false },
  { name: "AMP Mark D",      id: "1789", city: "Houten",     progress: "32 / 40 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Ahmed B",     id: "1345", city: "Houten",     progress: "18 / 41 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Hakan T",     id: "1567", city: "Utrecht",    progress: "36 / 42 Orders", hours: "08:30 - 18:08", status: "15 min te vroeg",          active: false },
  { name: "AMP Mustafa Y",   id: "1903", city: "Houten",     progress: "24 / 44 Orders", hours: "08:30 - 18:30", status: "",                         active: false },
  { name: "AMP Omar L",      id: "1421", city: "Houten",     progress: "41 / 41 Orders", hours: "08:30 - 17:35", status: "",                         active: false },
  { name: "AMP Karim S",     id: "1654", city: "Bunnik",     progress: "29 / 37 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Bilal V",     id: "1872", city: "Houten",     progress: "21 / 39 Orders", hours: "08:30 - 18:05", status: "32 min te vroeg",          active: false },
  { name: "AMP Anwar R",     id: "1298", city: "Onbekend",   progress: "5 / 12 Orders",  hours: "12:00 - 17:00", status: "",                         active: false },
  { name: "AMP Hassan M",    id: "1745", city: "Houten",     progress: "34 / 45 Orders", hours: "08:30 - 18:35", status: "",                         active: false },
  { name: "AMP Ayoub C",     id: "1532", city: "Houten",     progress: "26 / 40 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Rachid F",    id: "1819", city: "Utrecht",    progress: "19 / 36 Orders", hours: "08:30 - 17:45", status: "8 min te laat",            active: false },
  { name: "AMP Said O",      id: "1376", city: "Houten",     progress: "42 / 42 Orders", hours: "08:30 - 17:30", status: "",                         active: false },
  { name: "AMP Younes I",    id: "1684", city: "Houten",     progress: "30 / 38 Orders", hours: "08:30 - 17:55", status: "",                         active: false },
  { name: "AMP Adil B",      id: "1957", city: "Nieuwegein", progress: "14 / 41 Orders", hours: "08:30 - 18:20", status: "",                         active: false },
  { name: "AMP Salim K",     id: "1265", city: "Houten",     progress: "37 / 43 Orders", hours: "08:30 - 18:15", status: "22 min te vroeg",          active: false },
  { name: "AMP Mehdi A",     id: "1801", city: "Houten",     progress: "23 / 39 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Ridouan N",   id: "1438", city: "Houten",     progress: "40 / 40 Orders", hours: "08:30 - 17:40", status: "",                         active: false },
  { name: "AMP Khalid M",    id: "1672", city: "Utrecht",    progress: "31 / 44 Orders", hours: "08:30 - 18:25", status: "",                         active: false },
  { name: "AMP Imran S",     id: "1845", city: "Houten",     progress: "17 / 37 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Jasper V",    id: "1593", city: "Bunnik",     progress: "35 / 42 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Wouter B",    id: "1726", city: "Houten",     progress: "28 / 40 Orders", hours: "08:30 - 18:00", status: "5 min te laat",            active: false },
  { name: "AMP Rik H",       id: "1382", city: "Houten",     progress: "44 / 44 Orders", hours: "08:30 - 17:25", status: "",                         active: false },
  { name: "AMP Gijs M",      id: "1611", city: "Houten",     progress: "20 / 38 Orders", hours: "08:30 - 17:55", status: "",                         active: false },
  { name: "AMP Maarten T",   id: "1894", city: "IJsselstein",progress: "33 / 41 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Joep K",      id: "1457", city: "Houten",     progress: "25 / 36 Orders", hours: "08:30 - 17:45", status: "18 min te vroeg",          active: false },
  { name: "AMP Sven D",      id: "1738", city: "Houten",     progress: "39 / 45 Orders", hours: "08:30 - 18:30", status: "",                         active: false },
  { name: "AMP Ruud P",      id: "1289", city: "Houten",     progress: "16 / 40 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Erik V",      id: "1567", city: "Utrecht",    progress: "32 / 42 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Marcel B",    id: "1843", city: "Houten",     progress: "27 / 39 Orders", hours: "08:30 - 18:00", status: "10 min te laat",           active: false },
  { name: "AMP Sjoerd L",    id: "1395", city: "Houten",     progress: "41 / 41 Orders", hours: "08:30 - 17:35", status: "",                         active: false },
  { name: "AMP Henk T",      id: "1672", city: "Bunnik",     progress: "22 / 38 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Piet K",      id: "1818", city: "Houten",     progress: "36 / 43 Orders", hours: "08:30 - 18:20", status: "40 min te vroeg",          active: false },
  { name: "AMP Kees R",      id: "1546", city: "Houten",     progress: "29 / 40 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Jan S",       id: "1934", city: "Onbekend",   progress: "8 / 25 Orders",  hours: "13:00 - 18:00", status: "",                         active: false },
  { name: "AMP Marco H",     id: "1276", city: "Houten",     progress: "34 / 42 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Patrick V",   id: "1648", city: "Houten",     progress: "21 / 37 Orders", hours: "08:30 - 17:45", status: "1 uur te laat",            active: false },
  { name: "AMP Levi M",      id: "1789", city: "Utrecht",    progress: "38 / 40 Orders", hours: "08:30 - 17:40", status: "",                         active: false },
  { name: "AMP Amir K",      id: "1432", city: "Houten",     progress: "26 / 41 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Sami B",      id: "1657", city: "Houten",     progress: "43 / 43 Orders", hours: "08:30 - 17:30", status: "",                         active: false },
  { name: "AMP Reza T",      id: "1873", city: "Nieuwegein", progress: "19 / 39 Orders", hours: "08:30 - 18:00", status: "",                         active: false },
  { name: "AMP Dean V",      id: "1268", city: "Houten",     progress: "31 / 38 Orders", hours: "08:30 - 17:55", status: "12 min te vroeg",          active: false },
  { name: "AMP Jordan B",    id: "1583", city: "Houten",     progress: "24 / 44 Orders", hours: "08:30 - 18:30", status: "",                         active: false },
  { name: "AMP Davey K",     id: "1796", city: "Houten",     progress: "40 / 40 Orders", hours: "08:30 - 17:40", status: "",                         active: false },
  { name: "AMP Mitchell H",  id: "1361", city: "Bunnik",     progress: "17 / 36 Orders", hours: "08:30 - 17:45", status: "",                         active: false },
  { name: "AMP Ricardo S",   id: "1924", city: "Houten",     progress: "33 / 41 Orders", hours: "08:30 - 18:05", status: "",                         active: false },
  { name: "AMP Roberto P",   id: "1487", city: "Houten",     progress: "28 / 40 Orders", hours: "08:30 - 18:00", status: "25 min te laat",           active: false },
  { name: "AMP Diego M",     id: "1712", city: "Utrecht",    progress: "39 / 42 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Anass V",     id: "1538", city: "Houten",     progress: "22 / 37 Orders", hours: "08:30 - 17:50", status: "",                         active: false },
  { name: "AMP Jamal R",     id: "1849", city: "Houten",     progress: "45 / 45 Orders", hours: "08:30 - 17:25", status: "",                         active: false },
  { name: "AMP Soufyan M",   id: "1276", city: "Houten",     progress: "30 / 39 Orders", hours: "08:30 - 18:00", status: "8 min te vroeg",           active: false },
  { name: "AMP Ilias K",     id: "1693", city: "Houten",     progress: "18 / 38 Orders", hours: "08:30 - 17:55", status: "",                         active: false },
  { name: "AMP Zakaria H",   id: "1357", city: "IJsselstein",progress: "35 / 42 Orders", hours: "08:30 - 18:15", status: "",                         active: false },
  { name: "AMP Iliass A",    id: "1862", city: "Houten",     progress: "27 / 41 Orders", hours: "08:30 - 18:05", status: "",                         active: false },
  { name: "AMP Walid M",     id: "1429", city: "Houten",     progress: "42 / 42 Orders", hours: "08:30 - 17:30", status: "",                         active: false },
  { name: "AMP Jasin K",     id: "1716", city: "Bunnik",     progress: "23 / 40 Orders", hours: "08:30 - 18:00", status: "55 min te vroeg",          active: false },
  { name: "AMP Kasper L",    id: "1583", city: "Houten",     progress: "37 / 44 Orders", hours: "08:30 - 18:25", status: "",                         active: false },
  { name: "AMP Jelle B",     id: "1948", city: "Houten",     progress: "21 / 36 Orders", hours: "08:30 - 17:45", status: "",                         active: false },
  { name: "AMP Robin K",     id: "1264", city: "Houten",     progress: "44 / 44 Orders", hours: "08:30 - 17:35", status: "",                         active: false },
  { name: "AMP Sander M",    id: "1675", city: "Utrecht",    progress: "29 / 40 Orders", hours: "08:30 - 18:00", status: "15 min te laat",           active: false },
  { name: "AMP Bart W",      id: "1893", city: "Houten",     progress: "34 / 41 Orders", hours: "08:30 - 18:10", status: "",                         active: false },
  { name: "AMP Thijs V",     id: "1438", city: "Houten",     progress: "26 / 39 Orders", hours: "08:30 - 17:55", status: "",                         active: false }
];

// Stats afgeleid van de bezorgers-array
export const courierStats = [
  { label: "Bezorgers", value: String(couriers.length), icon: "mdi-account-group" },
  {
    label: "Stops",
    value: String(
      couriers.reduce((sum, c) => {
        const total = parseInt(c.progress.split("/")[1]) || 0;
        return sum + total;
      }, 0)
    ),
    icon: "mdi-map-marker-outline"
  },
  {
    label: "Orders",
    value: String(
      couriers.reduce((sum, c) => {
        const done = parseInt(c.progress.split("/")[0]) || 0;
        return sum + done;
      }, 0)
    ),
    icon: "mdi-package-variant-closed"
  }
];
