<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { LMap, LTileLayer, LCircleMarker, LPolyline } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { couriers, depots, parseDelay } from "../data/couriers.js";
import CourierCard from "../components/CourierCard.vue";
import OrderListItem from "../components/OrderListItem.vue";

const mapRef = ref(null);

// Panel zichtbaarheid (toggle via collapse-knop)
const panelExpanded = ref(true);

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

  // searchQuery kan null worden via clearable; defensive check
  const rawQuery = searchQuery.value;
  const q = typeof rawQuery === "string" ? rawQuery.trim().toLowerCase() : "";

  if (q) {
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
const leftPadding = computed(() => (panelExpanded.value ? 420 : 60));

watch(selectedCourier, async (courier) => {
  // Bij selectie altijd het panel uitklappen zodat de orders zichtbaar zijn
  if (courier) {
    panelExpanded.value = true;
  }
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

// Voortgangs-percentage voor de geselecteerde bezorger
const selectedProgress = computed(() => {
  if (!selectedCourier.value) return 0;
  const total = selectedCourier.value.stops.length;
  const done = selectedCourier.value.stops.filter((s) => s.done).length;
  return total > 0 ? (done / total) * 100 : 0;
});

// Vertraging-detectie + notificatie-flow
const delayMinutes = computed(() =>
  selectedCourier.value ? parseDelay(selectedCourier.value.status) : 0
);
const isDelayed = computed(() => delayMinutes.value > 0);

// Huidig adres = laatst bezorgde stop
const currentAddress = computed(() => {
  if (!selectedCourier.value) return "";
  const stops = selectedCourier.value.stops;
  const lastDoneIdx = stops.findLastIndex((s) => s.done);
  if (lastDoneIdx < 0) return "Bij depot";
  return stops[lastDoneIdx].address;
});

// Bijhouden welke ordernummers al geïnformeerd zijn (per courier reset)
const notifiedOrders = ref(new Set());
const notifyChannel = ref("sms");
const showSnackbar = ref(false);
const snackbarText = ref("");

const ordersToNotify = computed(() =>
  pendingStops.value.filter((s) => !notifiedOrders.value.has(s.orderNumber))
);

watch(selectedCourier, () => {
  notifiedOrders.value = new Set();
});

function isNotified(orderNumber) {
  return notifiedOrders.value.has(orderNumber);
}

const channelLabels = {
  email: "Email",
  sms: "SMS",
  phone: "Bellen"
};

function sendNotifications() {
  const count = ordersToNotify.value.length;
  if (!count) return;
  const next = new Set(notifiedOrders.value);
  ordersToNotify.value.forEach((s) => next.add(s.orderNumber));
  notifiedOrders.value = next;
  snackbarText.value = `${count} ${count === 1 ? "klant" : "klanten"} geïnformeerd via ${channelLabels[notifyChannel.value]}`;
  showSnackbar.value = true;
}

// Map size invalideren als het panel toggle-t (anders rendert tile-area scheef)
watch(panelExpanded, async () => {
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

    <!-- Floating panel links: header altijd zichtbaar, body uitklapbaar -->
    <v-card
      class="position-absolute d-flex flex-column"
      :style="{
        top: '16px',
        left: '16px',
        bottom: panelExpanded ? '16px' : 'auto',
        width: '390px',
        zIndex: 500
      }"
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
          :icon="panelExpanded ? 'mdi-unfold-less-horizontal' : 'mdi-unfold-more-horizontal'"
          size="small"
          variant="tonal"
          @click="panelExpanded = !panelExpanded"
        />
      </div>

      <!-- Body: switch tussen overview-list en courier-detail -->
      <template v-if="panelExpanded">
        <!-- DETAIL-VIEW: orders van geselecteerde bezorger -->
        <template v-if="selectedCourier">
          <!-- Samenvatting -->
          <div class="px-4 pb-4 flex-shrink-0">
            <div class="d-flex align-center ga-3 mb-3">
              <v-avatar color="primary" rounded="md" size="48">
                <v-icon icon="mdi-account" size="28" />
              </v-avatar>
              <div class="flex-grow-1" style="min-width: 0;">
                <div class="text-caption text-medium-emphasis">
                  ID #{{ selectedCourier.id }} · {{ selectedCourier.city }}
                </div>
                <div class="text-body-2 d-flex align-center ga-1">
                  <v-icon icon="mdi-clock-outline" size="14" />
                  {{ selectedCourier.hours }}
                </div>
              </div>
              <v-chip color="primary" size="small" class="font-weight-medium">
                {{ selectedCourier.progress }}
              </v-chip>
            </div>
            <v-progress-linear
              :model-value="selectedProgress"
              color="primary"
              height="6"
              rounded
            />
            <v-chip
              v-if="selectedCourier.status && !isDelayed"
              size="small"
              variant="tonal"
              color="success"
              prepend-icon="mdi-check-circle-outline"
              class="mt-3"
            >
              {{ selectedCourier.status }}
            </v-chip>
          </div>

          <!-- Vertraging-banner + auto-notify card -->
          <div v-if="isDelayed" class="px-4 pb-4 flex-shrink-0">
            <v-alert
              type="warning"
              variant="tonal"
              density="compact"
              class="mb-3"
            >
              <template #title>
                <span class="text-body-2 font-weight-bold">
                  {{ delayMinutes }} min te laat
                </span>
              </template>
              <div class="text-caption">
                Huidige positie: {{ currentAddress }}
              </div>
            </v-alert>

            <v-card variant="outlined" rounded="lg">
              <v-card-text class="pa-3">
                <div class="text-body-2 font-weight-medium mb-1">
                  Klanten informeren
                </div>
                <div class="text-caption text-medium-emphasis mb-3">
                  {{ ordersToNotify.length }} {{ ordersToNotify.length === 1 ? "openstaande klant" : "openstaande klanten" }}
                  krijgen een nieuwe ETA
                </div>

                <v-btn-toggle
                  v-model="notifyChannel"
                  mandatory
                  density="compact"
                  variant="outlined"
                  color="primary"
                  class="mb-3 d-flex"
                >
                  <v-btn value="email" size="small" prepend-icon="mdi-email-outline" class="flex-grow-1">
                    Email
                  </v-btn>
                  <v-btn value="sms" size="small" prepend-icon="mdi-message-text-outline" class="flex-grow-1">
                    SMS
                  </v-btn>
                  <v-btn value="phone" size="small" prepend-icon="mdi-phone-outline" class="flex-grow-1">
                    Bellen
                  </v-btn>
                </v-btn-toggle>

                <v-btn
                  color="warning"
                  variant="elevated"
                  block
                  :disabled="ordersToNotify.length === 0"
                  prepend-icon="mdi-send"
                  @click="sendNotifications"
                >
                  Verstuur {{ ordersToNotify.length }} notificaties
                </v-btn>
              </v-card-text>
            </v-card>
          </div>

          <v-divider />

          <!-- Stops-lijst -->
          <div
            class="flex-grow-1 overflow-y-auto py-2"
            style="min-height: 0;"
          >
            <v-list lines="two" class="pa-2" bg-color="transparent">
              <v-list-subheader v-if="pendingStops.length > 0">
                Nog te doen ({{ pendingStops.length }})
              </v-list-subheader>
              <OrderListItem
                v-for="(stop, i) in pendingStops"
                :key="stop.orderNumber"
                :stop="stop"
                :index="doneStops.length + i + 1"
                :delay-minutes="delayMinutes"
                :notified="isNotified(stop.orderNumber)"
              />

              <v-list-subheader v-if="doneStops.length > 0">
                Gedaan ({{ doneStops.length }})
              </v-list-subheader>
              <OrderListItem
                v-for="(stop, i) in doneStops"
                :key="stop.orderNumber"
                :stop="stop"
                :index="i + 1"
              />
            </v-list>
          </div>
        </template>

        <!-- OVERVIEW: filters + courier-lijst -->
        <template v-else>
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
        </template>
      </template>
    </v-card>

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

    <v-snackbar
      v-model="showSnackbar"
      :timeout="3500"
      color="success"
      location="bottom"
    >
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-check-circle" />
        {{ snackbarText }}
      </div>
    </v-snackbar>
  </div>
</template>
