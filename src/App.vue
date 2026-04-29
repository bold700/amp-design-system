<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { LMap, LTileLayer, LCircleMarker, LPolyline } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { couriers, courierStats } from "./data/couriers.js";

const activeMode = ref("kaart");
const mapRef = ref(null);

// Selectie via v-list v-model:selected (array van id's)
const selectedIds = ref([]);
const selectedCourier = computed(() =>
  selectedIds.value.length
    ? couriers.find((c) => c.id === selectedIds.value[0])
    : null
);

// Map center default = Houten regio
const defaultCenter = [52.0314, 5.1681];
const defaultZoom = 11;

// Lijst van huidige posities voor de overview-modus
const currentLocations = computed(() =>
  couriers.map((c) => ({
    id: c.id,
    name: c.name,
    lat: c.currentLocation[0],
    lng: c.currentLocation[1]
  }))
);

// Voor de geselecteerde bezorger: route opgesplitst in done en pending segments
const doneRoute = computed(() => {
  if (!selectedCourier.value) return [];
  const stops = selectedCourier.value.stops.filter((s) => s.done);
  return stops.map((s) => [s.lat, s.lng]);
});

const pendingRoute = computed(() => {
  if (!selectedCourier.value) return [];
  const all = selectedCourier.value.stops;
  const lastDoneIdx = all.findLastIndex((s) => s.done);
  // Begin pending route bij laatst gedane stop zodat het visueel doorloopt
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

// Wanneer een bezorger geselecteerd wordt: kaart inzoomen op zijn route
watch(selectedCourier, async (courier) => {
  await nextTick();
  const map = mapRef.value?.leafletObject;
  if (!map) return;
  if (courier) {
    const bounds = courier.stops.map((s) => [s.lat, s.lng]);
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  } else {
    map.setView(defaultCenter, defaultZoom);
  }
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
  if (selectedCourier.value) {
    const bounds = selectedCourier.value.stops.map((s) => [s.lat, s.lng]);
    map.fitBounds(bounds, { padding: [40, 40] });
  } else {
    const bounds = currentLocations.value.map((l) => [l.lat, l.lng]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }
}

function clearSelection() {
  selectedIds.value = [];
}
</script>

<template>
  <v-app>
    <v-layout class="min-vh-100">
      <v-navigation-drawer permanent width="360" color="surface">
        <v-toolbar density="compact" flat color="surface" class="px-3">
          <v-toolbar-title class="text-subtitle-1 font-weight-bold">
            Bezorgers
          </v-toolbar-title>
          <template #append>
            <div class="d-flex ga-1">
              <v-chip
                v-for="stat in courierStats"
                :key="stat.label"
                density="comfortable"
                size="small"
                variant="outlined"
                class="text-caption"
              >
                <v-icon :icon="stat.icon" size="14" start />
                {{ stat.value }}
              </v-chip>
            </div>
          </template>
        </v-toolbar>

        <div class="d-flex flex-column ga-2 px-3 pb-3">
          <v-text-field
            density="compact"
            hide-details
            placeholder="Zoeken naar bezorgers"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />
          <v-select
            density="compact"
            hide-details
            label="Sorteren op"
            :items="['Naam', 'Status', 'Plaats']"
            model-value="Naam"
            variant="outlined"
          />
          <v-select
            density="compact"
            hide-details
            label="Depot"
            :items="['Alle depots', 'Houten', 'Utrecht', 'Bunnik']"
            model-value="Alle depots"
            variant="outlined"
          />
        </div>

        <v-divider />

        <v-list
          v-model:selected="selectedIds"
          lines="two"
          nav
          class="overflow-y-auto pa-0"
        >
          <v-list-item
            v-for="courier in couriers"
            :key="courier.id"
            :value="courier.id"
            rounded="0"
            class="border-b py-2"
          >
            <template #prepend>
              <v-avatar color="primary" rounded="0" size="28">
                <v-icon icon="mdi-account" size="18" />
              </v-avatar>
            </template>

            <v-list-item-title class="text-body-2 font-weight-medium">
              {{ courier.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ courier.city }}
            </v-list-item-subtitle>

            <template #append>
              <span class="text-caption text-medium-emphasis">
                ID: {{ courier.id }}
              </span>
            </template>

            <div class="d-flex flex-wrap ga-2 mt-1">
              <v-chip size="x-small" variant="text" prepend-icon="mdi-package-variant-closed">
                {{ courier.progress }}
              </v-chip>
              <v-chip size="x-small" variant="text" prepend-icon="mdi-clock-outline">
                {{ courier.hours }}
              </v-chip>
            </div>

            <v-chip
              v-if="courier.status"
              size="x-small"
              color="success"
              variant="text"
              prepend-icon="mdi-check-circle-outline"
              class="mt-1"
            >
              {{ courier.status }}
            </v-chip>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="bg-surface">
        <div class="d-flex flex-column" style="height: 100dvh;">
          <v-toolbar density="comfortable" flat color="surface" class="px-4 border-b">
            <div class="d-flex align-center ga-2">
              <v-avatar color="primary" rounded="0" size="28">
                <v-icon
                  :icon="selectedCourier ? 'mdi-account' : 'mdi-account-group'"
                  size="18"
                />
              </v-avatar>
              <span v-if="selectedCourier" class="text-h6 font-weight-bold">
                {{ selectedCourier.name }}
              </span>
              <span v-if="selectedCourier" class="text-medium-emphasis">
                ({{ selectedCourier.id }})
              </span>
              <span v-else class="text-h6 font-weight-bold">
                Live overzicht
              </span>
              <span v-if="!selectedCourier" class="text-medium-emphasis">
                ({{ couriers.length }} bezorgers)
              </span>

              <v-btn
                v-if="selectedCourier"
                size="small"
                variant="text"
                prepend-icon="mdi-arrow-left"
                class="ml-2"
                @click="clearSelection"
              >
                Terug
              </v-btn>
            </div>

            <template #append>
              <v-btn-toggle
                v-model="activeMode"
                mandatory
                density="comfortable"
                variant="text"
                divided
              >
                <v-btn value="lijst" size="small">Lijst</v-btn>
                <v-btn value="kaart" size="small">Kaart</v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>

          <div class="flex-grow-1 position-relative" style="min-height: 0;">
            <div class="position-absolute" style="inset: 0;">
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

                <!-- Overzicht: 80 huidige posities -->
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
                  />
                </template>

                <!-- Geselecteerde bezorger: route + stops + huidige positie -->
                <template v-else>
                  <!-- Gedane segmenten: solid primary -->
                  <l-polyline
                    :lat-lngs="doneRoute"
                    color="#226499"
                    :weight="4"
                    :opacity="0.95"
                  />

                  <!-- Nog te doen: dashed primary, halftransparant -->
                  <l-polyline
                    :lat-lngs="pendingRoute"
                    color="#226499"
                    :weight="3"
                    :opacity="0.5"
                    dash-array="6 8"
                  />

                  <!-- Gedane stops: gevuld primary -->
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

                  <!-- Nog te doen: outlined -->
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

                  <!-- Huidige positie: grotere pin -->
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

            <div
              class="position-absolute d-flex flex-column ga-2"
              style="top: 12px; left: 12px; z-index: 400;"
            >
              <v-btn icon="mdi-plus" size="small" variant="elevated" @click="zoomIn" />
              <v-btn icon="mdi-minus" size="small" variant="elevated" @click="zoomOut" />
              <v-btn icon="mdi-arrow-expand-all" size="small" variant="elevated" @click="fitView" />
            </div>

            <!-- Legenda alleen tonen bij selectie -->
            <v-card
              v-if="selectedCourier"
              class="position-absolute"
              style="bottom: 24px; right: 16px; z-index: 400;"
              variant="elevated"
              rounded="lg"
            >
              <v-card-text class="py-3 px-4">
                <div class="d-flex flex-column ga-2 text-caption">
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
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>
