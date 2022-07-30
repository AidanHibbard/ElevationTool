<template>
  <div id="container">
    <ErrorBanner v-if="error" />
    <GMapMap
        :center="center"
        :zoom="15"
        map-type-id="terrain"
        style="width: 100vw;"
        @click="addMarker"
        ref="mapRef"
    >
      <GMapMarker
        v-if="selectMarker"
        :position="selectMarker"
        :draggable="false"
        :clickable="true"
        @click="selectMarker = false"
      />
      <GMapMarker
        v-for="(m, index) in markers"
        :label="String(index + 1)"
        :key="index"
        :position="m"
        :draggable="false"
        :clickable="true"
        @click="deleteMarker(index)"
      />
      <GMapPolyline
        v-if="markers.length > 1"
        :path="currentPath"
        :editable="false"
        ref="polyline"
      />
    </GMapMap>
    <div id="grade_info">
      <span id="info">0</span> Miles
      <br />
      <span id="rise"> 0 ft Elevation change</span>
      <br />
      <span id="grade"></span>
    </div>
    <Legend />
    <div>
      <span v-if="markers.length > 1">Click along the chart line to drop a pin</span>
      <span v-if="markers.length <= 1">Drop a couple pins to get started</span>
      <GChart 
        v-if="markers.length > 1"
        type="LineChart" 
        :data="currentResults" 
        :options="chartOptions" 
        :events="chartEvents"
        ref="gChart"
      />
    </div>
  </div>
</template>

<script>
import ErrorBanner from '@/components/ErrorBanner.vue';
import Legend from '@/components/Legend.vue';
import { computeDistance, createTable } from '@/utils';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'ElevationTool',
  components: {
    Legend,
    ErrorBanner
  },
  data () {
    return {
      selectMarker: false,
      locs: null,
      currentResults: [],
      currentPath: [],
      chartOptions: {
        chart: {
          title: 'Elevation change',
          subtitles: 'Samples, Elevation',
        }
      },
      chartEvents: {
        select: () => {
          this.chartMarker();
        },
      }
    };
  },
  computed: {
    ...mapState({
      center: (state) => state.center,
      markers: (state) => state.markers,
      transitMode: (state) => state.transitMode,
      error: (state) => state.error,
    })
  },
  watch: {
    markers: {
      handler() {
        this.createRoute();
      },
      deep: true
    },
    transitMode() {
      this.createRoute();
    }
  },
  methods: {
    ...mapMutations([
      'addMarker',
      'deleteMarker',
      'toggleError'
    ]),
    chartMarker: function () {
      const chart = this.$refs.gChart.chartObject;
      const event = chart.getSelection();
      // Clicking out of bounds sends undefined 
      // Which unfortunetly breaks the chart
      if (!event[0]) { return; };
      // This should be revisited
      // Creating a second locs array seems cumbersome
      // Maybe it's the right way to do things
      this.selectMarker = this.locs[event[0].row];
    },
    createRoute: function () {
      if (this.markers.length <= 1) { 
        document.getElementById('info').innerHTML = `0`;
        document.getElementById('grade').innerHTML = `0% grade avg`;
        document.getElementById('rise').innerHTML = `0 ft elevation change`;
        document.getElementById('grade').innerHTML = `0% grade avg`;
        this.currentPath = [];
        this.selectMarker = false;
      } else {
        const 
          directionsService = new window.google.maps.DirectionsService,
          elevationService = new window.google.maps.ElevationService;
        // There has to be a one liner way to filter this
        let waypoints = [];
        if (this.markers.length > 2) {
          for (let i=1; i < (this.markers.length - 1); i++) {
            waypoints.push({ location: { lat: this.markers[i].lat(), lng: this.markers[i].lng() }})
          };
        };
        directionsService.route({
          origin: this.markers[0],
          waypoints: waypoints,
          destination: this.markers[this.markers.length - 1],
          travelMode: this.transitMode
        },
        (response) => {
          if (response.status !== "OK") {
            this.toggleError(true);
            console.error(`No route found with transit mode: ${this.transitMode}`);
          } else {
            this.toggleError(false);
            this.currentPath = window.google.maps.geometry.encoding.decodePath(
              response.routes[0].overview_polyline
            );
            document.getElementById('info').innerHTML = computeDistance(response.routes[0])
            elevationService.getElevationAlongPath({
              path: response.routes[0].overview_path,
              samples: 256
            }, (results) => {
              const etl = createTable(results);          
              this.currentResults = etl.dataTable;
              this.locs = etl.locs;
            });
          }
        });
      };
    },
  },
};
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

