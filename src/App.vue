<script setup>
import { ref } from "vue";

const activeMode = ref("kaart");

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

const mapPins = [
  { top: "32%", left: "45%", color: "#16a5ff" },
  { top: "34%", left: "47%", color: "#16a5ff" },
  { top: "38%", left: "44%", color: "#16a5ff" },
  { top: "40%", left: "49%", color: "#e91ec8" },
  { top: "42%", left: "47%", color: "#8b35ff" },
  { top: "58%", left: "61%", color: "#16a5ff" }
];
</script>

<template>
  <v-app>
    <v-layout class="delivery-layout">
      <v-navigation-drawer class="sidebar" permanent width="360">
        <v-toolbar density="compact" flat class="sidebar-top">
          <v-toolbar-title class="sidebar-title">Bezorgers</v-toolbar-title>
          <template #append>
            <div class="sidebar-stats">
              <v-chip
                v-for="stat in courierStats"
                :key="stat.label"
                density="comfortable"
                size="small"
                variant="outlined"
                class="mini-stat"
              >
                <v-icon :icon="stat.icon" size="14" start />
                {{ stat.value }}
              </v-chip>
            </div>
          </template>
        </v-toolbar>

        <div class="sidebar-controls">
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

        <v-list class="courier-list" lines="two" nav>
          <v-list-item
            v-for="courier in couriers"
            :key="courier.id"
            :class="{ 'courier-row--active': courier.active }"
            rounded="0"
          >
            <template #prepend>
              <v-avatar color="primary" rounded="0" size="28">
                <v-icon icon="mdi-account" size="18" />
              </v-avatar>
            </template>

            <v-list-item-title class="courier-name">
              {{ courier.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="courier-city">
              {{ courier.city }}
            </v-list-item-subtitle>

            <template #append>
              <span class="courier-id">ID: {{ courier.id }}</span>
            </template>

            <div class="courier-meta">
              <v-chip size="x-small" variant="text" class="meta-chip">
                <v-icon icon="mdi-package-variant-closed" size="13" start />
                {{ courier.progress }}
              </v-chip>
              <v-chip size="x-small" variant="text" class="meta-chip">
                <v-icon icon="mdi-clock-outline" size="13" start />
                {{ courier.hours }}
              </v-chip>
            </div>

            <v-chip
              v-if="courier.status"
              size="x-small"
              color="success"
              variant="text"
              class="courier-status"
            >
              <v-icon icon="mdi-check-circle-outline" size="13" start />
              {{ courier.status }}
            </v-chip>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="map-panel">
        <v-toolbar density="comfortable" flat class="map-header">
          <div class="map-title">
            <v-avatar color="primary" rounded="0" size="28">
              <v-icon icon="mdi-account" size="18" />
            </v-avatar>
            <span>AMP Mahmut C</span>
            <span class="map-title-id">(1742)</span>
          </div>

          <template #append>
            <v-btn-toggle
              v-model="activeMode"
              mandatory
              density="comfortable"
              variant="text"
              divided
            >
              <v-btn value="lijst" size="small">LIJST</v-btn>
              <v-btn value="kaart" size="small">KAART</v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>

        <v-sheet class="map-stage" rounded="0">
          <div class="map-controls">
            <v-btn icon="mdi-plus" size="small" variant="elevated" />
            <v-btn icon="mdi-minus" size="small" variant="elevated" />
            <v-btn icon="mdi-arrow-expand-all" size="small" variant="elevated" />
          </div>

          <v-chip size="x-small" variant="outlined" class="map-scaler">5 km</v-chip>

          <div class="map-image">
            <div
              v-for="(pin, index) in mapPins"
              :key="index"
              class="map-pin"
              :style="{ top: pin.top, left: pin.left, '--pin-color': pin.color }"
            />

            <svg class="map-route" viewBox="0 0 1000 700" preserveAspectRatio="none">
              <path
                d="M480 300 L515 360 L565 345 L620 430 L700 535"
                fill="none"
                stroke="#ff00cc"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="5"
              />
            </svg>
          </div>
        </v-sheet>
      </v-main>
    </v-layout>
  </v-app>
</template>
