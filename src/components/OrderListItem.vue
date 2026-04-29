<script setup>
import { computed } from "vue";
import { shiftEta } from "../data/couriers.js";

const props = defineProps({
  stop: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  delayMinutes: {
    type: Number,
    default: 0
  },
  notified: {
    type: Boolean,
    default: false
  }
});

const newEta = computed(() => shiftEta(props.stop.eta, props.delayMinutes));
const isDelayed = computed(() => props.delayMinutes > 0 && !props.stop.done);
</script>

<template>
  <v-list-item
    rounded="lg"
    class="mb-1 px-3"
    :class="{ 'opacity-60': stop.done }"
  >
    <template #prepend>
      <v-avatar
        :color="stop.done ? 'primary' : 'surface-variant'"
        :variant="stop.done ? 'flat' : 'outlined'"
        size="36"
      >
        <v-icon
          v-if="stop.done"
          icon="mdi-check"
          size="20"
          color="white"
        />
        <span
          v-else
          class="text-body-2 font-weight-medium"
        >
          {{ index }}
        </span>
      </v-avatar>
    </template>

    <v-list-item-title class="text-body-2 font-weight-medium">
      {{ stop.address }}
    </v-list-item-title>

    <v-list-item-subtitle class="text-caption d-flex align-center ga-2 flex-wrap">
      <span>{{ stop.orderNumber }}</span>
      <v-icon icon="mdi-circle-small" size="8" />
      <v-icon icon="mdi-clock-outline" size="12" />
      <template v-if="isDelayed">
        <span class="text-decoration-line-through text-medium-emphasis">
          {{ stop.eta }}
        </span>
        <v-icon icon="mdi-arrow-right" size="10" />
        <span class="text-warning font-weight-medium">{{ newEta }}</span>
      </template>
      <template v-else>
        <span>{{ stop.eta }}</span>
      </template>
    </v-list-item-subtitle>

    <template #append>
      <v-chip
        v-if="notified"
        size="x-small"
        color="success"
        variant="tonal"
        prepend-icon="mdi-check-circle-outline"
      >
        Geïnformeerd
      </v-chip>
    </template>
  </v-list-item>
</template>
