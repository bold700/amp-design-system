<script setup>
defineProps({
  stop: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});
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

    <v-list-item-subtitle class="text-caption d-flex align-center ga-2">
      <span>{{ stop.orderNumber }}</span>
      <v-icon icon="mdi-circle-small" size="8" />
      <v-icon icon="mdi-clock-outline" size="12" />
      <span>{{ stop.eta }}</span>
    </v-list-item-subtitle>
  </v-list-item>
</template>
