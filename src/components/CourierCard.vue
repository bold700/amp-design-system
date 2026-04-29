<script setup>
import { computed } from "vue";

const props = defineProps({
  courier: {
    type: Object,
    required: true
  }
});

// Voortgang als percentage voor de progress-bar
const progressPercent = computed(() => {
  const [done, total] = props.courier.progress
    .split("/")
    .map((s) => parseInt(s, 10));
  if (!total) return 0;
  return (done / total) * 100;
});

// Status-kleur op basis van bericht-inhoud (te vroeg/te laat/leeg)
const statusColor = computed(() => {
  const s = props.courier.status?.toLowerCase() || "";
  if (s.includes("te laat")) return "warning";
  if (s.includes("te vroeg")) return "success";
  return "primary";
});

const statusIcon = computed(() => {
  const s = props.courier.status?.toLowerCase() || "";
  if (s.includes("te laat")) return "mdi-clock-alert-outline";
  return "mdi-check-circle-outline";
});
</script>

<template>
  <v-list-item
    :value="courier.id"
    rounded="lg"
    active-color="primary"
    class="mb-2 pa-3"
  >
    <template #prepend>
      <v-avatar color="primary" rounded="md" size="40">
        <v-icon icon="mdi-account" size="22" />
      </v-avatar>
    </template>

    <template #append>
      <v-chip size="x-small" variant="tonal" class="font-weight-medium">
        #{{ courier.id }}
      </v-chip>
    </template>

    <v-list-item-title class="text-body-1 font-weight-bold mb-1">
      {{ courier.name }}
    </v-list-item-title>

    <v-list-item-subtitle class="d-flex align-center ga-1 text-caption mb-2">
      <v-icon icon="mdi-map-marker-outline" size="12" />
      {{ courier.city }}
    </v-list-item-subtitle>

    <div class="d-flex flex-wrap ga-3 text-caption mb-2">
      <span class="d-inline-flex align-center ga-1">
        <v-icon icon="mdi-package-variant-closed" size="14" color="primary" />
        <span class="font-weight-medium">{{ courier.progress }}</span>
      </span>
      <span class="d-inline-flex align-center ga-1 text-medium-emphasis">
        <v-icon icon="mdi-clock-outline" size="14" />
        {{ courier.hours }}
      </span>
    </div>

    <v-progress-linear
      :model-value="progressPercent"
      color="primary"
      height="4"
      rounded
      class="mb-2"
    />

    <v-chip
      v-if="courier.status"
      size="x-small"
      :color="statusColor"
      variant="tonal"
      :prepend-icon="statusIcon"
    >
      {{ courier.status }}
    </v-chip>
  </v-list-item>
</template>
