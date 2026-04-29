<script setup>
import { ref } from "vue";
import { LMap, LTileLayer, LCircleMarker, LPolyline } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

const activeMode = ref("kaart");
const mapRef = ref(null);

const courierStats = [
  { label: "Bezorgers", value: "119", icon: "mdi-account-group" },
  { label: "Stops", value: "4917", icon: "mdi-map-marker-outline" },
  { label: "Orders", value: "3395", icon: "mdi-package-variant-closed" }
];

const couriers = [
  {
    name: "AMP Hamza K",
    id: "1754",
    city: "Houten",
    progress: "23 / 40 Orders",
    hours: "08:30 - 18:21",
    status: "59 min te vroeg",
    active: false
  },
  {
    name: "AMP Huub O",
    id: "1249",
    city: "Onbekend",
    progress: "1 / 1 Orders",
    hours: "14:00 - 19:19",
    status: "",
    active: false
  },
  {
    name: "AMP Ismail N",
    id: "1897",
    city: "Houten",
    progress: "17 / 53 Orders",
    hours: "08:30 - 17:05",
    status: "1 uur en 32 min te vroeg",
    active: false
  },
  {
    name: "AMP Mahmut C",
    id: "1742",
    city: "Houten",
    progress: "38 / 38 Orders",
    hours: "08:30 - 18:03",
    status: "",
    active: true
  },
  {
    name: "AMP Mika B",
    id: "1707",
    city: "Houten",
    progress: "25 / 36 Orders",
    hours: "08:30 - 18:14",
    status: "26 min te vroeg",
    active: false
  }
];

const mapCenter = ref([52.0314, 5.1681]); // Houten, NL
const mapZoom = ref(11);

// Stops voor de actieve bezorger (AMP Mahmut C) — rond Houten
const stops = [
  { lat: 52.0314, lng: 5.1681, color: "#16a5ff" }, // Houten centrum
  { lat: 52.0407, lng: 5.1521, color: "#16a5ff" }, // Houten west
  { lat: 52.0214, lng: 5.1839, color: "#16a5ff" }, // Houten oost
  { lat: 52.0102, lng: 5.1421, color: "#e91ec8" }, // Nieuwegein
  { lat: 52.0539, lng: 5.2042, color: "#8b35ff" }, // Bunnik
  { lat: 52.0907, lng: 5.1214, color: "#16a5ff" }  // Utrecht
];

// Route-pad: zelfde punten in de juiste volgorde
const routePath = stops.map((s) => [s.lat, s.lng]);

function zoomIn() {
  mapRef.value?.leafletObject?.zoomIn();
}
function zoomOut() {
  mapRef.value?.leafletObject?.zoomOut();
}
function fitRoute() {
  mapRef.value?.leafletObject?.fitBounds(routePath, { padding: [40, 40] });
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
            :items="['Alle depots', 'Houten', 'Amsterdam']"
            model-value="Alle depots"
            variant="outlined"
          />
        </div>

        <v-divider />

        <v-list lines="two" nav class="overflow-y-auto pa-0">
          <v-list-item
            v-for="courier in couriers"
            :key="courier.id"
            :active="courier.active"
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
                <v-icon icon="mdi-account" size="18" />
              </v-avatar>
              <span class="text-h6 font-weight-bold">AMP Mahmut C</span>
              <span class="text-medium-emphasis">(1742)</span>
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

          <div class="flex-grow-1 position-relative">
            <l-map
              ref="mapRef"
              :center="mapCenter"
              :zoom="mapZoom"
              :options="{ zoomControl: false, attributionControl: true }"
              style="height: 100%; width: 100%; z-index: 0;"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              <l-polyline
                :lat-lngs="routePath"
                color="#ff00cc"
                :weight="5"
                :opacity="0.9"
              />

              <l-circle-marker
                v-for="(stop, index) in stops"
                :key="index"
                :lat-lng="[stop.lat, stop.lng]"
                :radius="8"
                :color="'#ffffff'"
                :weight="2"
                :fill-color="stop.color"
                :fill-opacity="1"
              />
            </l-map>

            <div
              class="position-absolute d-flex flex-column ga-2"
              style="top: 12px; left: 12px; z-index: 400;"
            >
              <v-btn icon="mdi-plus" size="small" variant="elevated" @click="zoomIn" />
              <v-btn icon="mdi-minus" size="small" variant="elevated" @click="zoomOut" />
              <v-btn icon="mdi-arrow-expand-all" size="small" variant="elevated" @click="fitRoute" />
            </div>
          </div>
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>
