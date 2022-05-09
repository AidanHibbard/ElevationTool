<template>
  <div id="container">
    <GMapMap
        :center="center"
        :zoom="13"
        map-type-id="terrain"
        style="width: 100vw;"
        @click="AddMarker"
        ref="mapRef"
    >
      <GMapMarker
        v-if="selected"
        :position="selected"
        :draggable="false"
        :clickable="true"
        @click="Deselect"
      />
      <GMapMarker
        v-for="(m, index) in markers"
        :label="String(index + 1)"
        :key="index"
        :position="m"
        :draggable="false"
        :clickable="true"
        @click="DeleteMarker(index)"
      />
      <GMapPolyline
        v-if="markers.length > 1"
        :path="path"
        :editable="false"
        ref="polyline"
      />
    </GMapMap>
    <div id="grade_info">
      {{ distance }} {{ conversion[0] }}
      <br />
      {{ change }} {{ conversion[1] }} Change
      <br />
      <span id="grade"></span>
      <div id="key">
        Legend:
        <span :style="{ backgroundColor: '#b2c4b9' }">1%</span>
        <span :style="{ backgroundColor: '#12b5cb' }">3%</span>
        <span :style="{ backgroundColor: '#34a853' }">6%</span>
        <span :style="{ backgroundColor: '#ea4335' }">9%</span>
        <span :style="{ backgroundColor: '#000000', color: 'white' }">{{"> 9%"}}</span>
      </div>
    </div>
    <div>
      <span v-if="markers.length > 1">Click along the chart line to drop a pin</span>
      <span v-if="markers.length <= 1">Drop a couple pins to get started</span>
      <GChart 
        v-if="markers.length > 1"
        type="LineChart" 
        :data="results" 
        :options="chartOptions" 
        :events="chartEvents"
        ref="gChart"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
export default {
  name: 'ElevationTool',
  data () {
    return {
      chartOptions: {
        chart: {
          title: 'Elevation change',
          subtitles: 'Samples, Elevation',
        }
      },
      chartEvents: {
        select: () => {
          const chart = this.$refs.gChart.chartObject;
          const event = chart.getSelection();
          // If click is outside of line
          // Empty event breaks chart
          if (!event[0]) { return; };
          this.ChartMarker(event[0].row);
        },
      }
    };
  },
  computed: { 
    ...mapState({
      center: (state) => state.center,
      selected: (state) => state.selectMarker,
      markers: (state) => state.markers,
      distance: (state) => state.distance,
      conversion: (state) => state.conversion,
      path: (state) => state.currentPath,
      results: (state) => state.currentResults,
      change: (state) => state.change
    })
  },
  watch: {
    markers: {
      deep: true,
      handler() {
        if (this.markers.length <= 1) {
          this.Reset();
        } else {
          this.CreateRoute();
        };
      }
    }
  },
  methods: {
    ...mapMutations([
      'AddMarker',
      'DeleteMarker',
      'ChartMarker',
      'Reset',
      'Deselect'
    ]),
    ...mapActions([
      'CreateRoute'
    ])
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.vue-map-container {
  height: 50vh;
  width: 100vw;
}
</style>

