<script setup lang='ts'>
import { useAppStore } from '@/stores';
import ElevationChart from './ElevationChart.vue';
import { computed } from 'vue';

const store = useAppStore();

const labels = computed(() =>
  store.currentResults.slice(1).map((row: any[]) => row[0])
)
const elevations = computed(() =>
  store.currentResults.slice(1).map((row: any[]) => Number(row[1]))
)

const handleHover = (idx: number) => {
  const loc = store.locs[idx]
  store.setSelectMarker(loc)
}
</script>

<template>
  <div class="info-container">
    <v-chip-group>
      <v-chip>Distance: {{ store.distance.toFixed(2) }} {{ store.conversion }}</v-chip>
      <v-chip>Grade: {{ store.grade }}% avg</v-chip>
      <v-chip>Elevation Change: {{ store.elevationChange }} {{ store.conversion === 'MI' ? 'feet' : 'meters' }}</v-chip>
    </v-chip-group>
    <ElevationChart
      v-if="store.currentResults"
      :labels="labels"
      :data="elevations"
      :onPointHover="handleHover"
    />
  </div>
</template>
