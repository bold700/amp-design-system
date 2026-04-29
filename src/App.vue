<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { LMap, LTileLayer, LCircleMarker, LPolyline } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { couriers, depots } from "./data/couriers.js";
import CourierCard from "./components/CourierCard.vue";

const mapRef = ref(null);

// Panel zichtbaarheid (toggle via collapse-knop)
const panelVisible = ref(true);

// Filter / sort state
const searchQuery = ref("");
const sortBy = ref("Naam");
const depotFilter = ref("Alle depots");

// Beschikbare depot-opties
const depotOptions = computed(() => [
  "Alle depots",
  ...depots.map((d) => d.name).sort()
]);

// Bezorgers die voldoen aan zoek + filter + sort
const filteredCouriers = computed(() => {
  let list = couriers;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }

  if (depotFilter.value !== "Alle depots") {
    list = list.filter((c) => c.city === depotFilter.value);
  }

  const sorted = [...list];
  if (sortBy.value === "Naam") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "Status") {
    sorted.sort((a, b) => {
      if (!a.status && b.status) return 1;
      if (a.status && !b.status) return -1;
      return a.name.localeCompare(b.name);
    });
  } else if (sortBy.value === "Plaats") {
    sorted.sort(
      (a, b) =>
        a.city.localeCompare(b.city) || a.name.localeCompare(b.name)
    );
  }

  return sorted;
});

// Selectie via v-list v-model:selected
const selectedIds = ref([]);
const selectedCourier = computed(() =>
  selectedIds.value.length
    ? couriers.find((c) => c.id === selectedIds.value[0])
    : null
);

// Map default
const defaultCenter = [52.0314, 5.1681];
const defaultZoom = 11;

// Huidige posities (volgt filter)
const currentLocations = computed(() =>
  filteredCouriers.value.map((c) => ({
    id: c.id,
    name: c.name,
    lat: c.currentLocation[0],
    lng: c.currentLocation[1]
  }))
);

// Geselecteerde route
const doneRoute = computed(() => {
  if (!selectedCourier.value) return [];
  return selectedCourier.value.stops
    .filter((s) => s.done)
    .map((s) => [s.lat, s.lng]);
});

const pendingRoute = computed(() => {
  if (!selectedCourier.value) return [];
  const all = selectedCourier.value.stops;
  const lastDoneIdx = all.findLastIndex((s) => s.done);
  const start = lastDoneIdx >= 0 ? lastDoneIdx : 0;
  return all.slice(start).map((s) => [s.lat, s.lng]);
});

const doneStops = computed(() =>
  selectedCourier.value
    ? selectedCourier.value.stops.filter((s) => s.done)
    : []
);
const pendingStops = computed(() =>
  selectedCourier.value
    ? selectedCourier.value.stops.filter((s) => !s.done)
    : []
);

async function onMapReady() {
  await nextTick();
  mapRef.value?.leafletObject?.invalidateSize();
}

// Linker padding houdt panel-ruimte vrij. Als panel verborgen is: gewoon 60px.
const leftPadding = computed(() => (panelVisible.value ? 420 : 60));

watch(selectedCourier, async (courier) => {
  await nextTick();
  const map = mapRef.value?.leafletObject;
  if (!map) return;
  if (courier) {
    const bounds = courier.stops.map((s) => [s.lat, s.lng]);
    if (bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [60, 60],
        paddingTopLeft: [leftPadding.value, 60]
      });
    }
  } else {
    map.setView(defaultCenter, defaultZoom);
  }
});

// Map size invalideren als het panel toggle-t (anders rendert tile-area scheef)
watch(panelVisible, async () => {
  await nextTick();
  setTimeout(() => mapRef.value?.leafletObject?.invalidateSize(), 250);
});

function zoomIn() {
  mapRef.value?.leafletObject?.zoomIn();
}
function zoomOut() {
  mapRef.value?.leafletObject?.zoomOut();
}
function fitView() {
  const map = mapRef.value?.leafletObject;
  if (!map) return;
  const points = selectedCourier.value
    ? selectedCourier.value.stops.map((s) => [s.lat, s.lng])
    : currentLocations.value.map((l) => [l.lat, l.lng]);
  if (points.length) {
    map.fitBounds(points, {
      padding: [60, 60],
      paddingTopLeft: [leftPadding.value, 60]
    });
  }
}

function clearSelection() {
  selectedIds.value = [];
}

async function selectFromMap(courierId) {
  selectedIds.value = [courierId];
  await nextTick();
  // Scroll de bijbehorende card in beeld in het panel
  const el = document.querySelector(`[data-courier-id="${courierId}"]`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}
</script>

<template>
  <v-app>
    <!-- App bar boven alles: hoog-niveau navigatie -->
    <v-app-bar
      color="primary"
      :elevation="2"
      :height="56"
    >
      <v-app-bar-nav-icon icon="mdi-menu" />
      <v-app-bar-title>OMS</v-app-bar-title>
      <template #append>
        <v-btn icon="mdi-heart-outline" variant="text" />
        <v-btn icon="mdi-magnify" variant="text" />
        <v-btn icon="mdi-dots-vertical" variant="text" />
      </template>
    </v-app-bar>

    <v-main>
      <div
        class="position-relative"
        style="height: calc(100dvh - 56px); overflow: hidden;"
      >
        <!-- Map vult de hele achtergrond -->
        <div class="position-absolute" style="inset: 0; z-index: 0;">
          <l-map
            ref="mapRef"
            :center="defaultCenter"
            :zoom="defaultZoom"
            :use-global-leaflet="false"
            :options="{ zoomControl: false, attributionControl: true }"
            style="height: 100%; width: 100%;"
            @ready="onMapReady"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />

            <!-- Depots: secondary teal, altijd zichtbaar -->
            <l-circle-marker
              v-for="depot in depots"
              :key="`depot-${depot.name}`"
              :lat-lng="[depot.lat, depot.lng]"
              :radius="10"
              color="#ffffff"
              :weight="3"
              fill-color="#009688"
              :fill-opacity="1"
            />

            <!-- Overzicht: huidige posities (volgt filter) -->
            <template v-if="!selectedCourier">
              <l-circle-marker
                v-for="loc in currentLocations"
                :key="loc.id"
                :lat-lng="[loc.lat, loc.lng]"
                :radius="6"
                color="#ffffff"
                :weight="2"
                fill-color="#226499"
                :fill-opacity="1"
                :options="{ bubblingMouseEvents: false }"
                @click="selectFromMap(loc.id)"
              />
            </template>

            <!-- Geselecteerde route -->
            <template v-else>
              <l-polyline
                :lat-lngs="doneRoute"
                color="#226499"
                :weight="4"
                :opacity="0.95"
              />
              <l-polyline
                :lat-lngs="pendingRoute"
                color="#226499"
                :weight="3"
                :opacity="0.5"
                dash-array="6 8"
              />
              <l-circle-marker
                v-for="(stop, i) in doneStops"
                :key="`done-${i}`"
                :lat-lng="[stop.lat, stop.lng]"
                :radius="5"
                color="#ffffff"
                :weight="1.5"
                fill-color="#226499"
                :fill-opacity="1"
              />
              <l-circle-marker
                v-for="(stop, i) in pendingStops"
                :key="`pending-${i}`"
                :lat-lng="[stop.lat, stop.lng]"
                :radius="5"
                color="#226499"
                :weight="2"
                fill-color="#ffffff"
                :fill-opacity="1"
              />
              <l-circle-marker
                v-if="selectedCourier.currentLocation"
                :lat-lng="selectedCourier.currentLocation"
                :radius="9"
                color="#ffffff"
                :weight="3"
                fill-color="#e91ec8"
                :fill-opacity="1"
              />
            </template>
          </l-map>
        </div>

        <!-- Open-knop wanneer panel verborgen is -->
        <v-slide-x-transition>
          <v-btn
            v-if="!panelVisible"
            class="position-absolute"
            style="top: 16px; left: 16px; z-index: 500;"
            icon="mdi-menu"
            color="surface"
            :elevation="3"
            @click="panelVisible = true"
          />
        </v-slide-x-transition>

        <!-- Floating panel links -->
        <v-slide-x-transition>
          <v-card
            v-if="panelVisible"
            class="position-absolute d-flex flex-column"
            style="top: 16px; left: 16px; bottom: 16px; width: 390px; z-index: 500;"
            rounded="lg"
            :elevation="3"
          >
          <!-- Panel header -->
          <div class="d-flex align-center px-4 py-3 flex-shrink-0">
            <span class="text-h6 font-weight-medium">
              {{ selectedCourier ? selectedCourier.name : "Bezorgers" }}
            </span>
            <v-spacer />
            <v-btn
              v-if="selectedCourier"
              icon="mdi-arrow-left"
              size="small"
              variant="tonal"
              @click="clearSelection"
            />
            <v-btn
              v-else
              icon="mdi-unfold-less-vertical"
              size="small"
              variant="tonal"
              @click="panelVisible = false"
            />
          </div>

          <!-- Filter form -->
          <div class="d-flex flex-column ga-3 px-4 pb-4 flex-shrink-0">
            <v-text-field
              v-model="searchQuery"
              density="compact"
              hide-details
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
            />
            <v-select
              v-model="sortBy"
              density="compact"
              hide-details
              label="Sorteren op"
              :items="['Naam', 'Status', 'Plaats']"
              variant="outlined"
            />
            <v-select
              v-model="depotFilter"
              density="compact"
              hide-details
              label="Depot"
              :items="depotOptions"
              variant="outlined"
            />
          </div>

          <v-divider />

          <!-- Scrollable courier-lijst -->
          <div
            class="flex-grow-1 overflow-y-auto px-4 py-3"
            style="min-height: 0;"
          >
            <v-list
              v-model:selected="selectedIds"
              class="pa-0"
              bg-color="transparent"
              nav
            >
              <CourierCard
                v-for="courier in filteredCouriers"
                :key="courier.id"
                :courier="courier"
              />
            </v-list>

            <div
              v-if="filteredCouriers.length === 0"
              class="text-center py-8 text-body-2 text-medium-emphasis"
            >
              <v-icon
                icon="mdi-account-search-outline"
                size="32"
                class="mb-2 d-block mx-auto"
              />
              Geen bezorgers gevonden
            </div>
          </div>
          </v-card>
        </v-slide-x-transition>

        <!-- Map controls rechts -->
        <div
          class="position-absolute d-flex flex-column ga-2"
          style="top: 16px; right: 16px; z-index: 400;"
        >
          <v-btn icon="mdi-plus" size="small" variant="elevated" @click="zoomIn" />
          <v-btn icon="mdi-minus" size="small" variant="elevated" @click="zoomOut" />
          <v-btn icon="mdi-arrow-expand-all" size="small" variant="elevated" @click="fitView" />
        </div>

        <!-- Legenda -->
        <v-card
          class="position-absolute"
          style="bottom: 16px; right: 16px; z-index: 400;"
          variant="elevated"
          rounded="lg"
        >
          <v-card-text class="py-3 px-4">
            <div class="d-flex flex-column ga-2 text-caption">
              <div class="d-flex align-center ga-2">
                <span
                  class="d-inline-block rounded-circle"
                  style="width: 12px; height: 12px; background: #009688; border: 2px solid #fff; box-shadow: 0 0 0 1px #009688;"
                />
                Depot ({{ depots.length }})
              </div>

              <template v-if="!selectedCourier">
                <div class="d-flex align-center ga-2">
                  <span
                    class="d-inline-block rounded-circle"
                    style="width: 10px; height: 10px; background: #226499; border: 1.5px solid #fff; box-shadow: 0 0 0 1px #226499;"
                  />
                  Bezorger ({{ currentLocations.length }})
                </div>
              </template>

              <template v-else>
                <div class="d-flex align-center ga-2">
                  <span
                    class="d-inline-block rounded-circle"
                    style="width: 10px; height: 10px; background: #226499; border: 1.5px solid #fff; box-shadow: 0 0 0 1px #226499;"
                  />
                  {{ doneStops.length }} gedaan
                </div>
                <div class="d-flex align-center ga-2">
                  <span
                    class="d-inline-block rounded-circle"
                    style="width: 10px; height: 10px; background: #fff; border: 2px solid #226499;"
                  />
                  {{ pendingStops.length }} nog te doen
                </div>
                <div class="d-flex align-center ga-2">
                  <span
                    class="d-inline-block rounded-circle"
                    style="width: 12px; height: 12px; background: #e91ec8; border: 2px solid #fff; box-shadow: 0 0 0 1px #e91ec8;"
                  />
                  Huidige positie
                </div>
              </template>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>
