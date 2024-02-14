<script setup lang='ts'>
import { useAppStore } from '@/stores';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

const store = useAppStore();

const props = defineProps([
  'data',
]);
</script>

<template>
  <div class="info-container">
    <v-chip-group>
      <v-chip>Distance: {{ store.distance }} {{ store.conversion }}</v-chip>
      <v-chip>Grade: {{ store.grade }}% avg</v-chip>
      <v-chip>Elevation Change: {{ store.elevationChange }} {{ store.conversion === 'MI' ? 'feet' : 'meters' }}</v-chip>
    </v-chip-group>
    <Line
      :data="props.data"
      :options="{
        responsive: true,
        maintainAspectRatio: false
      }"
    />
  </div>
</template>

<style scoped>
</style>