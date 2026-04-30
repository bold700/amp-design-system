<script setup>
import { computed, ref, nextTick } from "vue";
import { LMap, LTileLayer, LCircleMarker, LPolyline } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { couriers, parseDelay } from "../data/couriers.js";

const today = new Date().toLocaleDateString("nl-NL", {
  weekday: "long", day: "numeric", month: "long"
});

function parseProgress(p) {
  const [done, total] = p.split("/").map((s) => parseInt(s.trim(), 10) || 0);
  return { done, total };
}

function initials(name) {
  return name.replace(/^AMP\s+/, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// -----------------------------
// KPI's
// -----------------------------
const totals = computed(() => {
  let totalStops = 0, doneStops = 0, delayed = 0, onTime = 0, completed = 0, active = 0;
  for (const c of couriers) {
    const { done, total } = parseProgress(c.progress);
    totalStops += total;
    doneStops += done;
    if (c.checkInStatus === "bezig") active += 1;
    if (done >= total && total > 0) completed += 1;
    if (parseDelay(c.status) > 0) delayed += 1;
    else if (!c.status) onTime += 1;
  }
  return { totalStops, doneStops, delayed, onTime, completed, active };
});

// Synthetische "vs gisteren"-deltas, deterministisch zodat de cijfers consistent zijn
const kpis = computed(() => {
  const open = totals.value.totalStops - totals.value.doneStops;
  const omzet = Math.round(totals.value.doneStops * 34.2);
  return [
    { key: "open",    label: "Actieve bestellingen", value: open.toLocaleString("nl-NL"),
      icon: "mdi-shopping-outline", color: "info",
      delta: { dir: "up",   text: "12% sinds gisteren" } },
    { key: "bezorgd", label: "Bezorgd vandaag",      value: totals.value.doneStops.toLocaleString("nl-NL"),
      icon: "mdi-check-circle-outline", color: "success",
      delta: { dir: "up",   text: "18% sinds gisteren" } },
    { key: "online",  label: "Koeriers online",      value: `${totals.value.active}`, suffix: ` / ${couriers.length}`,
      icon: "mdi-account-multiple-outline", color: "secondary",
      delta: { dir: "up",   text: "7% sinds gisteren" } },
    { key: "omzet",   label: "Omzet vandaag",        value: `€ ${omzet.toLocaleString("nl-NL")}`,
      icon: "mdi-currency-eur", color: "success",
      delta: { dir: "up",   text: "15% sinds gisteren" } }
  ];
});

// -----------------------------
// Live map
// -----------------------------
const mapRef = ref(null);
// Centreren op midden-NL met zoom die heel NL toont
const defaultCenter = [52.15, 5.30];
const defaultZoom = 8;

const ROUTE_COLORS = ["#226499", "#fb8c00", "#43a047", "#9b59b6", "#e91e63"];

// Vijf routes uit verschillende corridors om de NL-spreiding te laten zien
const featuredRoutes = computed(() => {
  const seenRegions = new Set();
  const picks = [];
  for (const c of couriers) {
    const region = c.stops[0]?.region;
    if (!region || seenRegions.has(region)) continue;
    if (c.checkInStatus === "niet-begonnen") continue;
    seenRegions.add(region);
    picks.push(c);
    if (picks.length >= 5) break;
  }
  return picks.map((c, i) => ({
    id: c.id,
    name: c.name,
    color: ROUTE_COLORS[i % ROUTE_COLORS.length],
    path: c.stops.map((s) => [s.lat, s.lng]),
    current: c.currentLocation
  }));
});

async function onMapReady() {
  await nextTick();
  mapRef.value?.leafletObject?.invalidateSize();
}

// -----------------------------
// Top koeriers
// -----------------------------
const topCouriers = computed(() =>
  couriers
    .map((c) => {
      const { done, total } = parseProgress(c.progress);
      return {
        id: c.id, name: c.name, city: c.city, done,
        pct: total > 0 ? Math.round((done / total) * 100) : 0,
        onTime: !c.status || !c.status.toLowerCase().includes("te laat")
      };
    })
    .sort((a, b) => b.pct - a.pct || b.done - a.done)
    .slice(0, 4)
);

// -----------------------------
// Live bestellingen
// -----------------------------
const KLANTEN = [
  "Anna de Jong", "Mark van Dijk", "Lisa Bakker", "Tom Slagter", "Eva Peters",
  "Niels Visser", "Sara El Idrissi", "Pieter Mulder", "Yara Hassan", "Joris Smit"
];
const STATUS_LIVE = {
  ingepakt:  { label: "Ingepakt",   color: "warning" },
  onderweg:  { label: "Onderweg",   color: "info" },
  bezorgd:   { label: "Bezorgd",    color: "success" },
  vertraagd: { label: "Vertraagd",  color: "error" }
};

const liveOrders = computed(() => {
  const orders = [];
  // 5 orders gebaseerd op een mix van bezorgers
  const bezig = couriers.filter((c) => c.checkInStatus === "bezig");
  const samples = [
    bezig[0], bezig[2], couriers.find((c) => c.checkInStatus === "klaar"),
    couriers.find((c) => parseDelay(c.status) > 0), bezig[1]
  ].filter(Boolean).slice(0, 5);

  samples.forEach((c, i) => {
    const seed = parseInt(c.id, 10);
    const klant = KLANTEN[(seed + i) % KLANTEN.length];
    const isDelayed = parseDelay(c.status) > 0;
    const isDone = c.checkInStatus === "klaar";
    const stopIdx = isDone
      ? c.stops.length - 1
      : Math.min(c.stops.findIndex((s) => !s.done), c.stops.length - 1);
    const stop = c.stops[Math.max(0, stopIdx)];

    const status = isDelayed ? "vertraagd" : isDone ? "bezorgd" : (i === 1 ? "ingepakt" : "onderweg");
    const orderNum = stop?.orderNumber || `${c.id}-???`;
    const eta = stop?.eta || "—";
    const subtitle = status === "bezorgd" ? "Bezorgd"
                   : status === "vertraagd" ? `${parseDelay(c.status)} min laat`
                   : status === "ingepakt" ? "15 min"
                   : "5 min";

    orders.push({
      orderNum: `#${orderNum.split("-").slice(-1)[0].padStart(5, "1")}`.replace(/^#0+/, "#1"),
      klant,
      status,
      courier: c,
      eta,
      etaSubtitle: subtitle
    });
  });
  return orders;
});

// -----------------------------
// Bezorgingen over tijd (lijngrafiek)
// -----------------------------
const WEEK_LABELS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

// Deterministisch verloop, dezeWeek is hoger dan vorige
const chartSeries = computed(() => {
  const dezeWeek = [60, 180, 175, 250, 250, 310, 420];
  const vorigeWeek = [90, 145, 125, 245, 220, 290, 270];
  return { dezeWeek, vorigeWeek };
});

const chartTotals = computed(() => ({
  deze:   chartSeries.value.dezeWeek.reduce((a, b) => a + b, 0),
  vorige: chartSeries.value.vorigeWeek.reduce((a, b) => a + b, 0)
}));

const chartDeltaPct = computed(() => {
  const { deze, vorige } = chartTotals.value;
  return vorige > 0 ? Math.round(((deze - vorige) / vorige) * 100) : 0;
});

// SVG-coords voor de polylines
const chartGeom = computed(() => {
  const W = 100, H = 100; // viewBox-ratio
  const PAD_L = 8, PAD_R = 4, PAD_T = 6, PAD_B = 14;
  const max = Math.max(...chartSeries.value.dezeWeek, ...chartSeries.value.vorigeWeek);
  const yScale = (v) => PAD_T + (1 - v / max) * (H - PAD_T - PAD_B);
  const xs = WEEK_LABELS.map((_, i) =>
    PAD_L + (i / (WEEK_LABELS.length - 1)) * (W - PAD_L - PAD_R)
  );
  function pointsFor(arr) {
    return arr.map((v, i) => `${xs[i]},${yScale(v)}`).join(" ");
  }
  function pointsXY(arr) {
    return arr.map((v, i) => ({ x: xs[i], y: yScale(v) }));
  }
  return {
    W, H, xs,
    deze:   { points: pointsFor(chartSeries.value.dezeWeek),   xy: pointsXY(chartSeries.value.dezeWeek) },
    vorige: { points: pointsFor(chartSeries.value.vorigeWeek), xy: pointsXY(chartSeries.value.vorigeWeek) },
    yLabels: [
      { y: yScale(0),         label: "0" },
      { y: yScale(max * 0.25), label: Math.round(max * 0.25 / 100) * 100 },
      { y: yScale(max * 0.5),  label: Math.round(max * 0.5 / 100) * 100 },
      { y: yScale(max * 0.75), label: Math.round(max * 0.75 / 100) * 100 },
      { y: yScale(max),        label: Math.round(max / 100) * 100 }
    ]
  };
});

const chartRange = ref("Deze week");

// -----------------------------
// Recente meldingen
// -----------------------------
const meldingen = computed(() => {
  const items = [];
  // Bezorgde order
  const klaarC = couriers.find((c) => c.checkInStatus === "klaar");
  if (klaarC) {
    const order = klaarC.stops[klaarC.stops.length - 1];
    items.push({
      icon: "mdi-check-circle-outline", color: "success",
      title: `Order #${order?.orderNumber.split("-").slice(-1)[0]} is succesvol bezorgd`,
      time: "2 minuten geleden"
    });
  }
  // Vertraging
  const laatC = couriers
    .map((c) => ({ c, d: parseDelay(c.status) }))
    .filter((x) => x.d > 0)
    .sort((a, b) => b.d - a.d)[0]?.c;
  if (laatC) {
    const order = laatC.stops.find((s) => !s.done) || laatC.stops[0];
    items.push({
      icon: "mdi-alert-outline", color: "warning",
      title: `Vertraging gemeld voor order #${order?.orderNumber.split("-").slice(-1)[0]}`,
      time: "8 minuten geleden"
    });
  }
  // Nieuwe koerier online
  const nieuw = couriers.find((c) => c.checkInStatus === "bezig" && c.id !== klaarC?.id);
  if (nieuw) {
    items.push({
      icon: "mdi-account-plus-outline", color: "info",
      title: `Nieuwe koerier ${nieuw.name.replace(/^AMP\s+/, "")} is online`,
      time: "12 minuten geleden"
    });
  }
  items.push({
    icon: "mdi-flag-outline", color: "secondary",
    title: "Route optimalisatie voltooid",
    time: "18 minuten geleden"
  });
  items.push({
    icon: "mdi-chart-line", color: "info",
    title: "Dagrapport is beschikbaar",
    time: "1 uur geleden"
  });
  return items.slice(0, 5);
});

// -----------------------------
// Header acties
// -----------------------------
const refreshing = ref(false);
const snackbar = ref({ show: false, text: "", color: "success" });
function refresh() {
  refreshing.value = true;
  setTimeout(() => {
    refreshing.value = false;
    snackbar.value = { show: true, text: "Dashboard bijgewerkt", color: "success" };
  }, 800);
}
</script>

<template>
  <v-main class="bg-grey-lighten-4">
    <v-container fluid class="pa-4 pa-md-6">
      <!-- Header -->
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-4 ga-3">
        <div>
          <div class="text-caption text-medium-emphasis text-uppercase">{{ today }}</div>
          <h1 class="text-h4 font-weight-bold">Operations dashboard</h1>
          <div class="text-body-2 text-medium-emphasis">
            Live overzicht van bestellingen, koeriers en omzet.
          </div>
        </div>
        <div class="d-flex ga-2">
          <v-btn variant="outlined" prepend-icon="mdi-download-outline">Exporteer</v-btn>
          <v-btn
            color="primary" variant="elevated" prepend-icon="mdi-refresh"
            :loading="refreshing" @click="refresh"
          >
            Vernieuwen
          </v-btn>
        </div>
      </div>

      <!-- KPI cards -->
      <v-row dense>
        <v-col v-for="k in kpis" :key="k.key" cols="12" sm="6" md="3">
          <v-card variant="flat" rounded="lg" class="pa-4 h-100 kpi-card">
            <div class="d-flex align-start ga-3">
              <v-avatar :color="`${k.color}-lighten-5`" rounded="lg" size="56">
                <v-icon :icon="k.icon" :color="k.color" size="28" />
              </v-avatar>
              <div class="flex-grow-1 min-w-0">
                <div class="text-body-2 text-medium-emphasis">{{ k.label }}</div>
                <div class="d-flex align-baseline ga-1 mt-1">
                  <span class="text-h4 font-weight-bold">{{ k.value }}</span>
                  <span v-if="k.suffix" class="text-h6 text-medium-emphasis font-weight-medium">{{ k.suffix }}</span>
                </div>
                <div class="d-flex align-center ga-1 mt-1">
                  <v-icon
                    :icon="k.delta.dir === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'"
                    size="14"
                    :color="k.delta.dir === 'up' ? 'success' : 'error'"
                  />
                  <span
                    class="text-caption font-weight-medium"
                    :class="k.delta.dir === 'up' ? 'text-success' : 'text-error'"
                  >
                    {{ k.delta.text }}
                  </span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Map + Top koeriers -->
      <v-row dense class="mt-2">
        <v-col cols="12" lg="8">
          <v-card variant="flat" rounded="lg" class="pa-4">
            <div class="d-flex align-center justify-space-between mb-3 ga-2 flex-wrap">
              <div class="d-flex align-center ga-2">
                <h2 class="text-h6 font-weight-bold">Live bezorgingen</h2>
                <v-chip size="x-small" color="success" variant="tonal" prepend-icon="mdi-circle-medium">
                  Live
                </v-chip>
              </div>
              <v-btn variant="text" size="small" prepend-icon="mdi-fullscreen">
                Volledig scherm
              </v-btn>
            </div>
            <div class="map-frame rounded-lg">
              <l-map
                ref="mapRef"
                :center="defaultCenter"
                :zoom="defaultZoom"
                :options="{ zoomControl: true, attributionControl: false }"
                :use-global-leaflet="false"
                @ready="onMapReady"
              >
                <l-tile-layer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  :attribution="''"
                />
                <l-polyline
                  v-for="r in featuredRoutes"
                  :key="`p-${r.id}`"
                  :lat-lngs="r.path"
                  :color="r.color"
                  :weight="4"
                  :opacity="0.85"
                />
                <l-circle-marker
                  v-for="r in featuredRoutes"
                  :key="`m-${r.id}`"
                  :lat-lng="r.current"
                  :radius="8"
                  :color="r.color"
                  :fill-color="r.color"
                  :fill-opacity="0.95"
                  :weight="3"
                />
              </l-map>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="4">
          <v-card variant="flat" rounded="lg" class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between mb-3">
              <h2 class="text-h6 font-weight-bold">Top koeriers vandaag</h2>
              <v-btn variant="text" size="small" color="primary">Bekijk alles</v-btn>
            </div>
            <v-list density="comfortable" class="pa-0">
              <v-list-item
                v-for="(c, idx) in topCouriers"
                :key="c.id"
                class="px-0 py-2"
              >
                <template #prepend>
                  <div class="d-flex align-center ga-3">
                    <span
                      class="rank-badge"
                      :class="`rank-${idx + 1}`"
                    >{{ idx + 1 }}</span>
                    <v-avatar color="primary" size="40">
                      <span class="text-body-2 font-weight-bold">{{ initials(c.name) }}</span>
                    </v-avatar>
                  </div>
                </template>
                <v-list-item-title class="font-weight-semibold">
                  {{ c.name.replace(/^AMP\s+/, "") }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ c.done }} bezorgingen
                </v-list-item-subtitle>
                <template #append>
                  <div class="text-end">
                    <div class="text-body-1 font-weight-bold text-success">{{ c.pct }}%</div>
                    <div class="text-caption text-medium-emphasis">
                      {{ c.onTime ? "Op tijd" : "Vertraagd" }}
                    </div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <!-- Live bestellingen + Chart + Meldingen -->
      <v-row dense class="mt-2">
        <!-- Live bestellingen -->
        <v-col cols="12" lg="5">
          <v-card variant="flat" rounded="lg" class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between mb-3">
              <h2 class="text-h6 font-weight-bold">Live bestellingen</h2>
              <v-btn variant="text" size="small" color="primary">Bekijk alles</v-btn>
            </div>
            <v-table density="comfortable" hover class="orders-table">
              <thead>
                <tr>
                  <th class="text-caption text-medium-emphasis">Order</th>
                  <th class="text-caption text-medium-emphasis">Klant</th>
                  <th class="text-caption text-medium-emphasis">Status</th>
                  <th class="text-caption text-medium-emphasis">Koerier</th>
                  <th class="text-caption text-medium-emphasis">ETA</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in liveOrders" :key="o.orderNum">
                  <td class="font-weight-medium tabular-nums">{{ o.orderNum }}</td>
                  <td>{{ o.klant }}</td>
                  <td>
                    <v-chip
                      size="x-small"
                      :color="STATUS_LIVE[o.status].color"
                      variant="tonal"
                    >
                      {{ STATUS_LIVE[o.status].label }}
                    </v-chip>
                  </td>
                  <td>
                    <div class="d-flex align-center ga-2">
                      <v-avatar color="primary" size="28">
                        <span class="text-caption font-weight-bold">{{ initials(o.courier.name) }}</span>
                      </v-avatar>
                      <span class="text-body-2 text-truncate" style="max-width: 120px;">
                        {{ o.courier.name.replace(/^AMP\s+/, "") }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="text-body-2 font-weight-medium tabular-nums">{{ o.eta }}</div>
                    <div
                      class="text-caption"
                      :class="o.status === 'vertraagd' ? 'text-error' : 'text-medium-emphasis'"
                    >
                      {{ o.etaSubtitle }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>

        <!-- Bezorgingen over tijd -->
        <v-col cols="12" md="6" lg="4">
          <v-card variant="flat" rounded="lg" class="pa-4 h-100 d-flex flex-column">
            <div class="d-flex align-center justify-space-between mb-3 ga-2">
              <h2 class="text-h6 font-weight-bold">Bezorgingen over tijd</h2>
              <v-select
                v-model="chartRange"
                :items="['Deze week', 'Vorige week', 'Deze maand']"
                density="compact"
                variant="outlined"
                hide-details
                style="max-width: 140px;"
              />
            </div>

            <div class="chart-wrap flex-grow-1">
              <svg :viewBox="`0 0 ${chartGeom.W} ${chartGeom.H}`" class="chart-svg">
                <!-- Y-grid + labels -->
                <g class="chart-grid">
                  <line
                    v-for="(yl, i) in chartGeom.yLabels"
                    :key="i"
                    :x1="8" :x2="chartGeom.W - 4"
                    :y1="yl.y" :y2="yl.y"
                  />
                </g>
                <!-- Vorige week -->
                <polyline
                  :points="chartGeom.vorige.points"
                  fill="none"
                  stroke="#cbd5e1"
                  stroke-width="0.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <!-- Deze week -->
                <polyline
                  :points="chartGeom.deze.points"
                  fill="none"
                  stroke="#226499"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  v-for="(p, i) in chartGeom.deze.xy"
                  :key="`d-${i}`"
                  :cx="p.x" :cy="p.y" r="1.4"
                  fill="#226499"
                />
              </svg>
              <!-- Y-labels overlay -->
              <ul class="chart-y-labels">
                <li
                  v-for="(yl, i) in chartGeom.yLabels.slice().reverse()"
                  :key="i"
                  class="text-caption text-medium-emphasis tabular-nums"
                >{{ yl.label }}</li>
              </ul>
              <!-- X-labels -->
              <ul class="chart-x-labels">
                <li
                  v-for="(label, i) in WEEK_LABELS"
                  :key="i"
                  class="text-caption text-medium-emphasis"
                >{{ label }}</li>
              </ul>
            </div>

            <div class="d-flex justify-space-between align-end pt-3 border-top">
              <div>
                <div class="text-caption text-medium-emphasis">Totaal deze week</div>
                <div class="d-flex align-baseline ga-1">
                  <span class="text-h6 font-weight-bold tabular-nums">
                    {{ chartTotals.deze.toLocaleString("nl-NL") }}
                  </span>
                  <v-icon icon="mdi-trending-up" size="14" color="success" />
                  <span class="text-caption text-success font-weight-medium">{{ chartDeltaPct }}%</span>
                </div>
              </div>
              <div class="text-end">
                <div class="text-caption text-medium-emphasis">Totaal vorige week</div>
                <div class="text-h6 font-weight-bold tabular-nums">
                  {{ chartTotals.vorige.toLocaleString("nl-NL") }}
                </div>
              </div>
            </div>

            <div class="d-flex ga-3 mt-2 text-caption">
              <div class="d-flex align-center ga-1">
                <span class="legend-dot" style="background: #226499" /> Deze week
              </div>
              <div class="d-flex align-center ga-1">
                <span class="legend-dot" style="background: #cbd5e1" /> Vorige week
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Recente meldingen -->
        <v-col cols="12" md="6" lg="3">
          <v-card variant="flat" rounded="lg" class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between mb-3">
              <h2 class="text-h6 font-weight-bold">Recente meldingen</h2>
              <v-btn variant="text" size="small" color="primary">Bekijk alles</v-btn>
            </div>
            <v-list density="comfortable" class="pa-0">
              <v-list-item
                v-for="(m, idx) in meldingen"
                :key="idx"
                class="px-0 py-2"
              >
                <template #prepend>
                  <v-avatar :color="`${m.color}-lighten-5`" size="40">
                    <v-icon :icon="m.icon" :color="m.color" size="20" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  {{ m.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ m.time }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="2500"
      location="bottom right"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-main>
</template>

<style scoped>
.kpi-card {
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.map-frame {
  height: 380px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.map-frame :deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  background: #f0f4f8;
}

.rank-badge {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.rank-1 { background: #f59e0b; }
.rank-2 { background: #94a3b8; }
.rank-3 { background: #b45309; }
.rank-4 { background: #cbd5e1; color: #475569; }

.orders-table :deep(table) {
  border-collapse: separate;
}
.orders-table :deep(th) {
  font-weight: 500 !important;
  text-transform: none;
}

.chart-wrap {
  position: relative;
  padding-left: 32px;
  padding-bottom: 18px;
  min-height: 180px;
}
.chart-svg {
  width: 100%;
  height: 180px;
  display: block;
}
.chart-grid line {
  stroke: #e5e7eb;
  stroke-width: 0.2;
  stroke-dasharray: 0.8 0.8;
}
.chart-y-labels {
  position: absolute;
  inset: 0 auto 18px 0;
  width: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  list-style: none;
  padding: 4px 0;
  margin: 0;
}
.chart-x-labels {
  position: absolute;
  left: 32px;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0 2px;
  margin: 0;
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.font-weight-semibold {
  font-weight: 600;
}
</style>
