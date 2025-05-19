<script setup lang="ts">
import { useAppStore } from '@/stores';
import { generatePolyline } from '@/utils';
import { ref } from 'vue';

const store = useAppStore();

const link = ref('')

async function shareHill() {
  try {
    store.encoded = generatePolyline(store.markers)
    await navigator.clipboard.writeText(window.location.href)
    alert('Copied link!');
  } catch (e: unknown) {
    alert(`Failed to create link: ${e}`);
  };
};

function saveHill() {
  const m = store.markers[0];
  link.value = `https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lng}`;
};
</script>

<template>
  <v-list>
    <v-list-item 
      two-line
      @click="store.toggleTheme()"
    >
      <v-list-item-title>
        Dark Mode 
        <v-icon v-if="store.darkMode === true">mdi-toggle-switch</v-icon>
        <v-icon v-else>mdi-toggle-switch-off</v-icon>
      </v-list-item-title>
      <v-list-item-subtitle>High contrast Map and Page</v-list-item-subtitle>
    </v-list-item>

    <v-list-item 
      two-line
      @click="store.toggleConversion(store.conversion === 'MI' ? 'KM' : 'MI')"
    >
      <v-list-item-title>
        <span
          :class="[store.conversion === 'MI' ? 'active' : '']"
        >MI </span>
        / 
        <span
          :class="[store.conversion === 'KM' ? 'active' : '']"
        >KM </span>
        <v-icon v-if="store.conversion === 'KM'">mdi-toggle-switch</v-icon>
        <v-icon v-else>mdi-toggle-switch-off</v-icon>
      </v-list-item-title>
      <v-list-item-subtitle>Swap between Metric or Imperial</v-list-item-subtitle>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-title>Transit Mode</v-list-item-title>
      <v-list-item-subtitle>Swap which travel mode to route</v-list-item-subtitle>
    </v-list-item>

    <v-list-item
      @click="store.toggleTransit('DRIVING')"
    >
      <v-list-item-title>
        DRIVING (Default) 
        <v-icon v-if="store.transitMode === 'DRIVING'">mdi-toggle-switch</v-icon>
        <v-icon v-else>mdi-toggle-switch-off</v-icon>
      </v-list-item-title>
    </v-list-item>

    <v-list-item
      @click="store.toggleTransit('BICYCLING')"
    >
      <v-list-item-title>
        BICYCLING 
        <v-icon v-if="store.transitMode === 'BICYCLING'">mdi-toggle-switch</v-icon>
        <v-icon v-else>mdi-toggle-switch-off</v-icon>
      </v-list-item-title>
    </v-list-item>

    <v-list-item
      @click="store.toggleTransit('TRANSIT')"
    >
      <v-list-item-title>
        TRANSIT 
        <v-icon v-if="store.transitMode === 'TRANSIT'">mdi-toggle-switch</v-icon>
        <v-icon v-else>mdi-toggle-switch-off</v-icon>
      </v-list-item-title>
    </v-list-item>

    <v-list-item
        @click="store.toggleTransit('WALKING')"
    >
      <v-list-item-title>
        WALKING 
        <v-icon v-if="store.transitMode === 'WALKING'">mdi-toggle-switch</v-icon>
        <v-icon v-else>mdi-toggle-switch-off</v-icon>
      </v-list-item-title>
    </v-list-item>
    <v-list-item class="links"
      v-if="store.markers.length > 1 && link"
      @click="saveHill"
    >
      <v-list-item-title>
        Save in Maps
      </v-list-item-title>
    </v-list-item>
    <a v-if="store.markers.length > 1 && link" :href="link" target="_blank" @click="saveHill">
      <v-list-item class="links">
        <v-list-item-title>
          Click to save
        </v-list-item-title>
      </v-list-item>
    </a>
    <v-list-item @click="shareHill" v-if="store.markers.length > 1">
      <v-list-item-title>
        Share Hill
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.active {
  color: #2196f3;
}
.v-icon {
  float: right;
}
.v-list-item-title {
  width: 211px;
}
</style>