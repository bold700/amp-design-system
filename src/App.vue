<script setup>
import { ref, computed, markRaw } from "vue";
import AppShell from "./components/AppShell.vue";
import DispatcherView from "./views/DispatcherView.vue";
import DashboardView from "./views/DashboardView.vue";
import CheckInView from "./views/CheckInView.vue";
import WagenparkView from "./views/WagenparkView.vue";

// View-registry. Voor een nieuwe use case:
// 1. Maak src/views/JouwView.vue
// 2. Importeer hem hierboven
// 3. Voeg een entry toe aan deze array
//
// markRaw() voorkomt dat Vue de component-definitie reactief proxiet
// (zou onnodige overhead geven en is niet nodig).
const views = [
  {
    id: "dashboard",
    label: "Dashboard",
    subtitle: "Operations overzicht",
    icon: "mdi-view-dashboard-outline",
    component: markRaw(DashboardView)
  },
  {
    id: "wagenpark",
    label: "Wagenpark",
    subtitle: "Performance + live monitoring",
    icon: "mdi-truck-outline",
    component: markRaw(WagenparkView)
  },
  {
    id: "check-in",
    label: "Check-in",
    subtitle: "Wie is begonnen, klaar of nog onderweg",
    icon: "mdi-clock-check-outline",
    component: markRaw(CheckInView)
  },
  {
    id: "dispatcher",
    label: "Bezorgers",
    subtitle: "Live overzicht + routes",
    icon: "mdi-truck-delivery-outline",
    component: markRaw(DispatcherView)
  }
];

const currentViewId = ref("dashboard");

const currentView = computed(
  () => views.find((v) => v.id === currentViewId.value) ?? views[0]
);
</script>

<template>
  <AppShell v-model="currentViewId" :views="views">
    <component :is="currentView.component" />
  </AppShell>
</template>
