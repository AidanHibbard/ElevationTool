<script setup lang='ts'>
import { useAppStore } from '@/stores';

const store = useAppStore();
</script>

<template>
  <div class="info-container">
    <v-chip-group>
      <v-chip>Distance: {{ store.distance.toFixed(2) }} {{ store.conversion }}</v-chip>
      <v-chip>Grade: {{ store.grade }}% avg</v-chip>
      <v-chip>Elevation Change: {{ store.elevationChange }} {{ store.conversion === 'MI' ? 'feet' : 'meters' }}</v-chip>
    </v-chip-group>
  </div>
</template>
