<script setup>
import { ref } from "vue";

defineProps({
  // Lijst van beschikbare views: [{ id, label, icon, component }]
  views: {
    type: Array,
    required: true
  },
  // ID van de actieve view (gebruik via v-model)
  modelValue: {
    type: String,
    required: true
  }
});

defineEmits(["update:modelValue"]);

const drawerOpen = ref(false);
</script>

<template>
  <v-app>
    <v-app-bar color="primary" :elevation="2" :height="56">
      <v-app-bar-nav-icon
        icon="mdi-menu"
        @click="drawerOpen = !drawerOpen"
      />
      <v-app-bar-title>OMS</v-app-bar-title>
      <template #append>
        <v-btn icon="mdi-heart-outline" variant="text" />
        <v-btn icon="mdi-magnify" variant="text" />
        <v-btn icon="mdi-dots-vertical" variant="text" />
      </template>
    </v-app-bar>

    <!-- View-selector drawer (opent via menu-knop) -->
    <v-navigation-drawer
      v-model="drawerOpen"
      temporary
      width="280"
    >
      <v-list-subheader class="text-overline mt-2">
        Use cases
      </v-list-subheader>
      <v-list nav>
        <v-list-item
          v-for="view in views"
          :key="view.id"
          :prepend-icon="view.icon"
          :title="view.label"
          :subtitle="view.subtitle"
          :active="view.id === modelValue"
          rounded="lg"
          class="mb-1"
          @click="
            $emit('update:modelValue', view.id);
            drawerOpen = false;
          "
        />
      </v-list>

      <template #append>
        <div class="pa-4 text-caption text-medium-emphasis">
          AMP Workshop · 2026-04-30
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
