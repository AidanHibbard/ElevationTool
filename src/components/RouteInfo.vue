<script setup lang='ts'>
import { useAppStore } from '@/stores';
import {
  Chart as ChartJS,
} from 'chart.js';
import { Line } from 'vue-chartjs';

const store = useAppStore();
</script>

<template>
  <div class="info-container">
    <v-chip-group>
      <v-chip>Distance: {{ store.distance }} {{ store.conversion }}</v-chip>
      <v-chip>Grade: {{ store.grade }}% avg</v-chip>
      <v-chip>Elevation Change: {{ store.elevationChange }} {{ store.conversion === 'MI' ? 'feet' : 'meters' }}</v-chip>
    </v-chip-group>
    <Line
      :data="{
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ],
      }"
      :options="{
        responsive: true,
        maintainAspectRatio: false
      }"
    />
  </div>
</template>
