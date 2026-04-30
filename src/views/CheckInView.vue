<script setup>
import { ref, computed } from "vue";
import { couriers } from "../data/couriers.js";

// Drie statussen, exact zoals bezorger-coördinatoren ze willen zien
const TABS = [
  { id: "niet-begonnen", label: "Nog niet begonnen", color: "warning", icon: "mdi-clock-alert-outline" },
  { id: "bezig",         label: "Bezig",             color: "info",    icon: "mdi-truck-fast-outline"  },
  { id: "klaar",         label: "Klaar",             color: "success", icon: "mdi-check-circle-outline" }
];

const activeTab = ref("niet-begonnen");
const searchQuery = ref("");
const depotFilter = ref("Alle depots");

const depotOptions = computed(() => {
  const set = new Set(couriers.map((c) => c.city));
  return ["Alle depots", ...Array.from(set).sort()];
});

// Tellingen per status (over alle bezorgers, dus onafhankelijk van filters)
const counts = computed(() => {
  const by = { "niet-begonnen": 0, bezig: 0, klaar: 0 };
  for (const c of couriers) by[c.checkInStatus]++;
  return by;
});

// Bezorgers in actieve tab, na search + depotfilter
const filtered = computed(() => {
  let list = couriers.filter((c) => c.checkInStatus === activeTab.value);

  const q = typeof searchQuery.value === "string"
    ? searchQuery.value.trim().toLowerCase()
    : "";
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

  // Sorteer logisch per tab
  const sorted = [...list];
  if (activeTab.value === "niet-begonnen") {
    // Op geplande starttijd, dan naam
    sorted.sort(
      (a, b) =>
        a.hours.localeCompare(b.hours) || a.name.localeCompare(b.name)
    );
  } else if (activeTab.value === "bezig") {
    // Op login-tijd
    sorted.sort(
      (a, b) =>
        (a.loginTime || "").localeCompare(b.loginTime || "") ||
        a.name.localeCompare(b.name)
    );
  } else {
    // Klaar: laatst uitgelogd bovenaan
    sorted.sort(
      (a, b) =>
        (b.logoutTime || "").localeCompare(a.logoutTime || "") ||
        a.name.localeCompare(b.name)
    );
  }
  return sorted;
});

function initials(name) {
  return name
    .replace(/^AMP\s+/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function plannedStart(hoursStr) {
  return hoursStr.split(" - ")[0];
}

function plannedEnd(hoursStr) {
  return hoursStr.split(" - ")[1];
}

// Verschil in minuten tussen twee HH:MM strings; positief als b later is dan a
function diffMinutes(a, b) {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}

function loginRelative(c) {
  const delta = diffMinutes(plannedStart(c.hours), c.loginTime);
  if (delta === 0) return { text: "op tijd", color: "success" };
  if (delta < 0) return { text: `${Math.abs(delta)} min vroeg`, color: "info" };
  if (delta <= 10) return { text: `${delta} min laat`, color: "warning" };
  return { text: `${delta} min laat`, color: "error" };
}

function logoutRelative(c) {
  const delta = diffMinutes(plannedEnd(c.hours), c.logoutTime);
  if (delta === 0) return { text: "op tijd", color: "success" };
  if (delta < 0) return { text: `${Math.abs(delta)} min eerder`, color: "info" };
  return { text: `${delta} min later`, color: "warning" };
}

function shiftDuration(c) {
  if (!c.loginTime || !c.logoutTime) return null;
  const mins = diffMinutes(c.loginTime, c.logoutTime);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}u ${m.toString().padStart(2, "0")}m`;
}

function progressPct(c) {
  const total = c.stops.length;
  if (total === 0) return 0;
  const done = c.stops.filter((s) => s.done).length;
  return Math.round((done / total) * 100);
}

// Snackbar voor "Bel"-actie op niet-begonnen
const snackbar = ref({ show: false, text: "" });
function callCourier(c) {
  snackbar.value = {
    show: true,
    text: `${c.name} wordt gebeld op nummer ${c.id}…`
  };
}
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Page header -->
    <div class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 ga-3">
      <div>
        <h1 class="text-h4 font-weight-bold">Check-in vandaag</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Wie is begonnen, wie nog niet, wie is al klaar.
        </p>
      </div>
      <div class="d-flex ga-2 flex-wrap">
        <v-text-field
          v-model="searchQuery"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          prepend-inner-icon="mdi-magnify"
          placeholder="Zoek bezorger of ID"
          style="min-width: 240px;"
        />
        <v-select
          v-model="depotFilter"
          :items="depotOptions"
          density="compact"
          variant="outlined"
          hide-details
          style="min-width: 180px;"
        />
      </div>
    </div>

    <!-- Stat cards -->
    <v-row class="mb-4">
      <v-col v-for="tab in TABS" :key="tab.id" cols="12" md="4">
        <v-card
          :variant="activeTab === tab.id ? 'elevated' : 'outlined'"
          :color="activeTab === tab.id ? tab.color : undefined"
          rounded="lg"
          class="pa-4"
          link
          @click="activeTab = tab.id"
        >
          <div class="d-flex align-center ga-3">
            <v-avatar
              :color="activeTab === tab.id ? 'white' : tab.color"
              size="48"
              :class="activeTab === tab.id ? 'text-' + tab.color : 'text-white'"
            >
              <v-icon :icon="tab.icon" size="28" />
            </v-avatar>
            <div>
              <div class="text-overline" style="line-height: 1;">
                {{ tab.label }}
              </div>
              <div class="text-h4 font-weight-bold mt-1">
                {{ counts[tab.id] }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card rounded="lg" variant="outlined">
      <!-- Lijst met bezorgers in deze tab -->
      <div v-if="filtered.length === 0" class="pa-8">
        <v-empty-state
          icon="mdi-account-search-outline"
          title="Geen bezorgers"
          :text="
            searchQuery || depotFilter !== 'Alle depots'
              ? 'Geen bezorgers in deze status met de huidige filters.'
              : 'Geen bezorgers in deze status.'
          "
        >
          <template
            v-if="searchQuery || depotFilter !== 'Alle depots'"
            #actions
          >
            <v-btn
              variant="text"
              @click="
                searchQuery = '';
                depotFilter = 'Alle depots';
              "
            >
              Filters wissen
            </v-btn>
          </template>
        </v-empty-state>
      </div>

      <v-list v-else lines="three" class="py-0">
        <template v-for="(c, i) in filtered" :key="c.id">
          <v-list-item class="py-3">
            <template #prepend>
              <v-avatar :color="TABS.find((t) => t.id === c.checkInStatus).color" size="48">
                <span class="text-subtitle-2 font-weight-bold">{{ initials(c.name) }}</span>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ c.name }}
              <span class="text-medium-emphasis text-body-2 ml-2">
                #{{ c.id }} · {{ c.city }}
              </span>
            </v-list-item-title>

            <v-list-item-subtitle class="mt-1">
              <!-- Niet begonnen -->
              <template v-if="c.checkInStatus === 'niet-begonnen'">
                <v-icon icon="mdi-calendar-clock" size="14" class="mr-1" />
                Geplande start <strong>{{ plannedStart(c.hours) }}</strong>
                · dienst tot {{ plannedEnd(c.hours) }}
                · {{ c.stops.length }} stops gepland
              </template>

              <!-- Bezig -->
              <template v-else-if="c.checkInStatus === 'bezig'">
                <v-icon icon="mdi-login-variant" size="14" class="mr-1" />
                Ingelogd om <strong>{{ c.loginTime }}</strong>
                <v-chip
                  size="x-small"
                  :color="loginRelative(c).color"
                  variant="tonal"
                  class="ml-2"
                >
                  {{ loginRelative(c).text }}
                </v-chip>
                <div class="d-flex align-center ga-2 mt-2" style="max-width: 480px;">
                  <v-progress-linear
                    :model-value="progressPct(c)"
                    color="info"
                    height="6"
                    rounded
                  />
                  <span class="text-caption text-medium-emphasis" style="white-space: nowrap;">
                    {{ c.progress }}
                  </span>
                </div>
              </template>

              <!-- Klaar -->
              <template v-else>
                <v-icon icon="mdi-logout-variant" size="14" class="mr-1" />
                Ingelogd <strong>{{ c.loginTime }}</strong>
                · uitgelogd <strong>{{ c.logoutTime }}</strong>
                <v-chip
                  size="x-small"
                  :color="logoutRelative(c).color"
                  variant="tonal"
                  class="ml-2"
                >
                  {{ logoutRelative(c).text }}
                </v-chip>
                <span class="text-caption text-medium-emphasis ml-2">
                  · dienst {{ shiftDuration(c) }} · {{ c.progress }}
                </span>
              </template>
            </v-list-item-subtitle>

            <template #append>
              <v-btn
                v-if="c.checkInStatus === 'niet-begonnen'"
                color="warning"
                variant="tonal"
                prepend-icon="mdi-phone-outline"
                @click="callCourier(c)"
              >
                Bel
              </v-btn>
              <v-icon
                v-else-if="c.checkInStatus === 'klaar'"
                icon="mdi-check-circle"
                color="success"
                size="28"
              />
              <v-chip
                v-else
                color="info"
                variant="tonal"
                prepend-icon="mdi-map-marker-radius-outline"
              >
                {{ progressPct(c) }}%
              </v-chip>
            </template>
          </v-list-item>
          <v-divider v-if="i < filtered.length - 1" />
        </template>
      </v-list>
    </v-card>

    <v-snackbar v-model="snackbar.show" color="info" timeout="2500" location="bottom">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Sluit</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
