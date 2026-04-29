<script setup>
import { ref, computed, markRaw } from "vue";
import AppShell from "./components/AppShell.vue";
import DispatcherView from "./views/DispatcherView.vue";

// View-registry. Voor een nieuwe use case:
// 1. Maak src/views/JouwView.vue
// 2. Importeer hem hierboven
// 3. Voeg een entry toe aan deze array
//
// markRaw() voorkomt dat Vue de component-definitie reactief proxiet
// (zou onnodige overhead geven en is niet nodig).
const views = [
  {
    id: "dispatcher",
    label: "Bezorgers",
    subtitle: "Live overzicht + routes",
    icon: "mdi-truck-delivery-outline",
    component: markRaw(DispatcherView)
  }
];

const currentViewId = ref("dispatcher");

const currentView = computed(
  () => views.find((v) => v.id === currentViewId.value) ?? views[0]
);
</script>

<template>
  <AppShell v-model="currentViewId" :views="views">
    <component :is="currentView.component" />
  </AppShell>
</template>
