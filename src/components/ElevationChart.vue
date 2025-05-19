<script setup lang="ts">
import { ref, onMounted, watch, defineProps, onBeforeUnmount } from 'vue'
import { Chart, type ChartConfiguration, registerables } from 'chart.js'
import { useAppStore } from '@/stores'

const store = useAppStore()

Chart.register(...registerables)

const props = defineProps<{
  labels: string[]
  data: number[]
}>()

const canvasRef = ref<HTMLCanvasElement>()

let chart: Chart<'line', number[], string> | null = null

onMounted(() => {
  if (!canvasRef.value) return

  const ctx = canvasRef.value.getContext('2d')!
  const config: ChartConfiguration<'line', number[], string> = {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: 'Elevation',
          data: props.data,
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: 'Distance' },
        },
        y: {
          title: { display: true, text: 'Elevation' },
        },
      },
      // the hover hook:
      plugins: {
        tooltip: {
          enabled: false, // disable built-in tooltip if you want custom behavior
        },
      },
      events: ['click'],
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      onClick: (event, activeElements) => {
        if (activeElements.length && (activeElements[0] && activeElements[0].index)) {
          store.setSelectMarker(store.locs[activeElements[0].index])
        }
      }
    },
  }

  chart = new Chart(ctx, config)
})

// update chart when labels or data change
watch(
  () => props.labels,
  (newLabels) => {
    if (chart) {
      chart.data.labels = newLabels
      chart.update()
    }
  },
  { immediate: true }
)

watch(
  () => props.data,
  (newData) => {
    if (chart) {
      chart.data.datasets[0].data = newData
      chart.update()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  chart?.destroy()
})
</script>

<template>
  <div style="height: 300px;">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

