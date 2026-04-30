<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { LMap, LTileLayer, LCircleMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { couriers, parseDelay } from "../data/couriers.js";

// Vertaling van de fleet-mockup naar AMP:
// - Performance overview = 4 KPI's afgeleid uit couriers
// - Fleet monitoring     = spotlight op één bezorger (dropdown om te wisselen)
// - Logistics map        = Leaflet met alle huidige posities, kleur per status
// - Fleet overview       = grid van bezorger-cards met search + filter chips

const STATUS_LOOKUP = {
  "niet-begonnen": { label: "Niet begonnen", color: "warning", icon: "mdi-clock-alert-outline" },
  "bezig":         { label: "Onderweg",      color: "info",    icon: "mdi-truck-fast-outline" },
  "klaar":         { label: "Klaar",         color: "success", icon: "mdi-check-circle-outline" }
};

function progressOf(c) {
  const total = c.stops.length;
  if (total === 0) return { pct: 0, done: 0, total: 0 };
  const done = c.stops.filter((s) => s.done).length;
  return { pct: Math.round((done / total) * 100), done, total };
}

function initials(name) {
  return name.replace(/^AMP\s+/, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function diffMinutes(a, b) {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}

// Synthetische "laatst bijgewerkt" — gebaseerd op id-modulo, deterministisch
function updatedAgo(c) {
  const seed = parseInt(c.id, 10);
  const mins = (seed * 7) % 18 + 1;
  return `${mins} min geleden`;
}

// -----------------------------
// KPI's (Performance overview)
// -----------------------------
const kpis = computed(() => {
  const total = couriers.length;
  const actief = couriers.filter((c) => c.checkInStatus === "bezig").length;

  let totalStops = 0, doneStops = 0;
  for (const c of couriers) { totalStops += c.stops.length; doneStops += c.stops.filter((s) => s.done).length; }
  const voltooidPct = totalStops > 0 ? Math.round((doneStops / totalStops) * 100) : 0;

  const onTime = couriers.filter((c) => parseDelay(c.status) === 0).length;
  const onTimePct = total > 0 ? Math.round((onTime / total) * 100) : 0;

  return [
    { key: "actief",   icon: "mdi-account-hard-hat-outline", label: "Bezorgers actief", value: actief,         delta: { dir: "up",   text: "+3 vs gisteren" } },
    { key: "stops",    icon: "mdi-package-variant-closed",   label: "Stops vandaag",     value: totalStops,    delta: { dir: "up",   text: "+8,1% vs vorige week" } },
    { key: "voltooid", icon: "mdi-progress-check",            label: "Voltooid",          value: `${voltooidPct}%`, delta: { dir: "up", text: "+4,2%" } },
    { key: "ontime",   icon: "mdi-timer-check-outline",       label: "On-time",           value: `${onTimePct}%`,   delta: { dir: "down", text: "-0,5%" } }
  ];
});

const lastUpdated = ref("net bijgewerkt");

// -----------------------------
// Spotlight bezorger
// -----------------------------
const spotlightId = ref(couriers[0].id);
const spotlight = computed(() => couriers.find((c) => c.id === spotlightId.value) || couriers[0]);
const spotlightOptions = computed(() =>
  couriers.map((c) => ({ value: c.id, title: `${c.name} · #${c.id}` }))
);
const spotlightProgress = computed(() => progressOf(spotlight.value));

const spotlightAddress = computed(() => {
  const stops = spotlight.value.stops;
  const lastDoneIdx = stops.findLastIndex((s) => s.done);
  if (lastDoneIdx < 0) return `Depot ${spotlight.value.city}`;
  return stops[lastDoneIdx].address;
});

const spotlightEta = computed(() => {
  const remaining = spotlight.value.stops.filter((s) => !s.done);
  if (remaining.length === 0) return "Route afgerond";
  const last = remaining[remaining.length - 1];
  return `Verwachte eindtijd ${last.eta}`;
});

// -----------------------------
// Logistics map
// -----------------------------
const mapRef = ref(null);
const defaultCenter = [52.15, 5.30];
const defaultZoom = 8;

const mapMarkers = computed(() =>
  couriers.map((c) => ({
    id: c.id,
    name: c.name,
    lat: c.currentLocation[0],
    lng: c.currentLocation[1],
    color: c.checkInStatus === "bezig" ? "#43a047"
         : c.checkInStatus === "klaar" ? "#226499"
         : "#fb8c00"
  }))
);

async function onMapReady() {
  await nextTick();
  mapRef.value?.leafletObject?.invalidateSize();
}

watch(spotlightId, async () => {
  await nextTick();
  const map = mapRef.value?.leafletObject;
  if (map) {
    const c = spotlight.value;
    map.setView([c.currentLocation[0], c.currentLocation[1]], 12, { animate: true });
  }
});

// -----------------------------
// Fleet overview grid
// -----------------------------
const search = ref("");
const filter = ref("alle");

const filterOptions = computed(() => {
  const counts = { alle: couriers.length, "niet-begonnen": 0, bezig: 0, klaar: 0 };
  for (const c of couriers) counts[c.checkInStatus]++;
  return [
    { id: "alle",          label: "Alle",          count: counts.alle },
    { id: "bezig",         label: "Onderweg",      count: counts.bezig },
    { id: "niet-begonnen", label: "Niet begonnen", count: counts["niet-begonnen"] },
    { id: "klaar",         label: "Klaar",         count: counts.klaar }
  ];
});

const filteredCouriers = computed(() => {
  let list = couriers;
  if (filter.value !== "alle") {
    list = list.filter((c) => c.checkInStatus === filter.value);
  }
  const q = (search.value || "").trim().toLowerCase();
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }
  return list;
});

// Toon eerst 12 kaarten, knop voor meer
const visibleCount = ref(12);
watch([search, filter], () => { visibleCount.value = 12; });
const visibleCouriers = computed(() => filteredCouriers.value.slice(0, visibleCount.value));
function loadMore() { visibleCount.value += 12; }

function selectCourier(c) {
  spotlightId.value = c.id;
  // Smooth scroll naar boven zodat spotlight zichtbaar is op mobiel
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Page header -->
    <div class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-4 ga-3">
      <div>
        <h1 class="text-h4 font-weight-bold">Wagenpark</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Live overzicht van bezorgers, stops en voortgang.
        </p>
      </div>
      <div class="d-flex align-center ga-2 flex-wrap">
        <v-btn variant="outlined" prepend-icon="mdi-calendar-range">Laatste 30 dagen</v-btn>
        <v-btn icon="mdi-bell-outline" variant="text" />
        <v-btn color="primary" prepend-icon="mdi-plus" variant="elevated">
          Nieuwe rit
        </v-btn>
      </div>
    </div>

    <!-- Performance overview -->
    <v-card variant="outlined" rounded="lg" class="pa-4 pa-md-5 mb-4">
      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="text-h6 font-weight-semibold">Performance overview</h2>
        <span class="text-caption text-medium-emphasis">
          <v-icon icon="mdi-clock-outline" size="14" class="mr-1" />
          {{ lastUpdated }}
        </span>
      </div>
      <v-row dense>
        <v-col v-for="k in kpis" :key="k.key" cols="6" md="3">
          <div class="kpi-tile pa-4">
            <div class="d-flex align-center ga-2">
              <v-icon :icon="k.icon" size="18" class="text-medium-emphasis" />
              <span class="text-caption text-medium-emphasis">{{ k.label }}</span>
            </div>
            <div class="d-flex align-baseline ga-2 mt-2 flex-wrap">
              <span class="text-h4 font-weight-bold">{{ k.value }}</span>
              <v-chip
                size="x-small"
                :color="k.delta.dir === 'up' ? 'success' : 'error'"
                variant="tonal"
                :prepend-icon="k.delta.dir === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'"
              >
                {{ k.delta.text }}
              </v-chip>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Twee-koloms sectie: monitoring/map links, fleet overview rechts -->
    <v-row>
      <!-- Linker kolom -->
      <v-col cols="12" lg="5">
        <!-- Fleet monitoring spotlight -->
        <v-card variant="outlined" rounded="lg" class="pa-4 mb-4">
          <div class="d-flex align-center justify-space-between mb-3 ga-2 flex-wrap">
            <h3 class="text-subtitle-1 font-weight-semibold">Live monitoring</h3>
            <v-select
              v-model="spotlightId"
              :items="spotlightOptions"
              density="compact"
              variant="outlined"
              hide-details
              style="min-width: 220px;"
            />
          </div>

          <div class="spotlight-stage rounded-lg pa-5 mb-3">
            <div class="d-flex align-center justify-space-between">
              <v-chip
                size="small"
                color="success"
                variant="tonal"
                prepend-icon="mdi-circle-medium"
                class="font-weight-medium"
              >
                Live
              </v-chip>
              <v-chip
                size="small"
                :color="STATUS_LOOKUP[spotlight.checkInStatus].color"
                variant="flat"
              >
                {{ STATUS_LOOKUP[spotlight.checkInStatus].label }}
              </v-chip>
            </div>

            <div class="d-flex justify-center align-center my-4">
              <v-icon icon="mdi-truck-cargo-container" size="96" color="primary" />
            </div>

            <div class="text-center">
              <div class="text-overline" style="line-height: 1;">{{ spotlight.id }}</div>
              <div class="text-h6 font-weight-bold mt-1">{{ spotlight.name }}</div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                <v-icon icon="mdi-map-marker-outline" size="14" class="mr-1" />
                {{ spotlightAddress }}
              </div>
            </div>
          </div>

          <div class="d-flex align-center ga-3 mb-2">
            <v-avatar color="primary" size="36">
              <span class="text-caption font-weight-bold">{{ initials(spotlight.name) }}</span>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-body-2 font-weight-medium">{{ spotlight.name }}</div>
              <div class="text-caption text-medium-emphasis">
                Bijgewerkt {{ updatedAgo(spotlight) }} · {{ spotlightEta }}
              </div>
            </div>
          </div>

          <div class="d-flex justify-space-between text-caption mb-1">
            <span class="text-medium-emphasis">Voortgang</span>
            <span class="font-weight-medium tabular-nums">
              {{ spotlightProgress.done }} / {{ spotlightProgress.total }} stops · {{ spotlightProgress.pct }}%
            </span>
          </div>
          <v-progress-linear
            :model-value="spotlightProgress.pct"
            color="primary"
            height="8"
            rounded
          />
        </v-card>

        <!-- Logistics network map -->
        <v-card variant="outlined" rounded="lg" class="pa-4">
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-subtitle-1 font-weight-semibold">Logistiek netwerk</h3>
            <v-btn icon="mdi-dots-horizontal" variant="text" size="small" />
          </div>
          <div class="map-frame rounded-lg">
            <l-map
              ref="mapRef"
              :center="defaultCenter"
              :zoom="defaultZoom"
              :options="{ zoomControl: false, attributionControl: false }"
              :use-global-leaflet="false"
              @ready="onMapReady"
            >
              <l-tile-layer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                :attribution="''"
              />
              <l-circle-marker
                v-for="m in mapMarkers"
                :key="m.id"
                :lat-lng="[m.lat, m.lng]"
                :radius="m.id === spotlight.id ? 9 : 6"
                :color="m.color"
                :fill-color="m.color"
                :fill-opacity="0.85"
                :weight="2"
              />
            </l-map>
          </div>
          <div class="d-flex flex-wrap ga-3 mt-3 text-caption">
            <div class="d-flex align-center ga-1">
              <span class="legend-dot" style="background: #43a047" />
              <span>Onderweg</span>
            </div>
            <div class="d-flex align-center ga-1">
              <span class="legend-dot" style="background: #fb8c00" />
              <span>Niet begonnen</span>
            </div>
            <div class="d-flex align-center ga-1">
              <span class="legend-dot" style="background: #226499" />
              <span>Klaar</span>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Rechter kolom: fleet overview -->
      <v-col cols="12" lg="7">
        <v-card variant="outlined" rounded="lg" class="pa-4">
          <div class="d-flex align-center justify-space-between mb-3 ga-2 flex-wrap">
            <h3 class="text-subtitle-1 font-weight-semibold">Fleet overview</h3>
            <v-text-field
              v-model="search"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
              placeholder="Zoek bezorger of ID"
              style="max-width: 260px;"
            />
          </div>

          <v-chip-group
            v-model="filter"
            mandatory
            selected-class="text-white bg-primary"
            class="mb-3"
          >
            <v-chip
              v-for="opt in filterOptions"
              :key="opt.id"
              :value="opt.id"
              variant="outlined"
              size="small"
              class="mr-1"
            >
              {{ opt.label }}
              <span class="ml-2 text-caption tabular-nums opacity-70">{{ opt.count }}</span>
            </v-chip>
          </v-chip-group>

          <v-row v-if="visibleCouriers.length > 0" dense>
            <v-col v-for="c in visibleCouriers" :key="c.id" cols="12" sm="6" xl="4">
              <v-card
                variant="outlined"
                rounded="lg"
                class="fleet-card pa-3"
                link
                @click="selectCourier(c)"
              >
                <div class="d-flex align-start justify-space-between mb-2 ga-2">
                  <div>
                    <div class="text-body-2 font-weight-semibold">{{ c.name }}</div>
                    <div class="text-caption text-medium-emphasis">ID: {{ c.id }} · {{ c.city }}</div>
                  </div>
                  <v-chip
                    size="x-small"
                    :color="STATUS_LOOKUP[c.checkInStatus].color"
                    variant="flat"
                  >
                    {{ STATUS_LOOKUP[c.checkInStatus].label }}
                  </v-chip>
                </div>

                <div class="fleet-card-art rounded-md mb-3 d-flex align-center justify-center">
                  <v-icon icon="mdi-truck-outline" size="56" color="primary" />
                </div>

                <div class="d-flex align-center ga-2 mb-2">
                  <v-avatar color="primary" size="28">
                    <span class="text-caption font-weight-bold">{{ initials(c.name) }}</span>
                  </v-avatar>
                  <div class="flex-grow-1 min-w-0">
                    <div class="text-caption font-weight-medium text-truncate">Driver</div>
                    <div class="text-caption text-medium-emphasis text-truncate">{{ c.name.replace(/^AMP\s+/, "") }}</div>
                  </div>
                  <span class="text-caption text-medium-emphasis text-no-wrap">
                    {{ updatedAgo(c) }}
                  </span>
                </div>

                <div class="d-flex justify-space-between align-center text-caption mb-1">
                  <span class="text-medium-emphasis">Load status</span>
                  <span class="font-weight-medium tabular-nums">{{ progressOf(c).pct }}%</span>
                </div>
                <v-progress-linear
                  :model-value="progressOf(c).pct"
                  :color="STATUS_LOOKUP[c.checkInStatus].color"
                  height="6"
                  rounded
                />
              </v-card>
            </v-col>
          </v-row>

          <v-empty-state
            v-else
            icon="mdi-truck-remove-outline"
            title="Geen bezorgers"
            text="Pas je filter of zoekterm aan."
            class="my-6"
          />

          <div
            v-if="filteredCouriers.length > visibleCouriers.length"
            class="d-flex justify-center mt-4"
          >
            <v-btn variant="text" @click="loadMore">
              Toon meer ({{ filteredCouriers.length - visibleCouriers.length }})
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.kpi-tile {
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  height: 100%;
}

.spotlight-stage {
  background: linear-gradient(180deg,
    rgba(var(--v-theme-primary), 0.05),
    rgba(var(--v-theme-primary), 0.01));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.fleet-card-art {
  height: 96px;
  background: rgb(var(--v-theme-surface-variant), 0.5);
  background-image: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.08),
    rgba(var(--v-theme-primary), 0.02));
}

.fleet-card {
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.fleet-card:hover {
  border-color: rgb(var(--v-theme-primary));
}

.map-frame {
  height: 320px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.map-frame :deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  background: #f0f4f8;
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
