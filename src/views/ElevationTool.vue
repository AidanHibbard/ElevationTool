<template>
  <div id="container">
    <ErrorBanner v-if="error" />
    <GMapMap
        :center="center"
        :zoom="15"
        map-type-id="terrain"
        
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
        :path="polyline"
        :editable="false"
        ref="polyline"
        :options="{
          strokeColor,
        }"
      />
    </GMapMap>
    <div id="grade_info">
      <span id="info">{{ distance }}</span> {{ MiKm }}
      <br />
      <span id="elchange"> {{elchange}} {{ MiKm === 'MI' ? 'feet' : 'meters' }} Elevation change</span>
      <br />
      <span id="grade">{{grade}}% average grade</span>
      <Legend />
    </div>
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
import dark_style from '@/utils/map_styles/dark.js'
import ErrorBanner from '@/components/ErrorBanner.vue';
import Legend from '@/components/Legend.vue';
import { computeDistance, createTable, Color } from '@/utils';
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
      distance: 0,
      locs: null,
      currentResults: [],
      polyline: [],
      chartOptions: {
        chart: {
          title: 'Elevation change',
          subtitles: 'Samples, Elevation',
        },
        tooltip: { isHtml: true }
      },
      chartEvents: {
        select: () => {
          this.chartMarker();
        },
      },
    };
  },
  computed: {
    ...mapState({
      center: (state) => state.center,
      markers: (state) => state.markers,
      transitMode: (state) => state.transitMode,
      error: (state) => state.error,
      darkMode: (state) => state.darkMode,
      elchange: (state) => state.elchange,
      grade: (state) => state.grade,
      MiKm: (state) => state.MiKm,
    }),
    strokeColor() {
      return Color(this.grade);
    }
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
    },
    darkMode() {
      this.$refs.mapRef.$mapPromise.then((map) => {
        if (this.darkMode) {
          map.setOptions({
            styles: dark_style,
          });
        } else {
          map.setOptions({
            styles: [],
          });
        };
      });
    },
  },
  methods: {
    ...mapMutations([
      'addMarker',
      'deleteMarker',
      'toggleError',
      'gradeInfo'
    ]),
    chartMarker: function () {
      const event = this.$refs.gChart.chartObject.getSelection();
      // Clicking out of bounds sends an undefined event
      // Which unfortunetly breaks the chart
      if (!event[0]) { return; };
      // This should be revisited
      // Creating a second locs array seems cumbersome
      // Maybe it's the right way to do things
      this.selectMarker = this.locs[event[0].row];
    },
    createRoute: function () {
      if (this.markers.length <= 1) { 
        this.gradeInfo({
          grade: 0,
          elchange: 0
        });
        this.currentPath = [];
        this.selectMarker = false;
        this.distance = 0;
        return;
      }

      const directionsService = new window.google.maps.DirectionsService();
      const elevationService = new window.google.maps.ElevationService();
      const waypoints = this.markers.slice(1, -1).map(marker => ({
        location: {
          lat: marker.lat,
          lng: marker.lng
        }
      }));

      directionsService.route({
        origin: this.markers[0],
        waypoints: waypoints,
        destination: this.markers[this.markers.length - 1],
        travelMode: this.transitMode
      }, (response) => {
        if (response.status !== "OK") {
          this.toggleError(true);
          console.error(`No route found with transit mode: ${this.transitMode}`);
          return;
        }

        this.toggleError(false);

        const overviewPath = response.routes[0].overview_path;
        const path = overviewPath.length < 2 ? this.markers : overviewPath;

        this.polyline = window.google.maps.geometry.encoding.decodePath(
          response.routes[0].overview_polyline
        );

        this.distance = computeDistance(response.routes[0]);

        elevationService.getElevationAlongPath({
          path: path,
          samples: 256
        }, (results) => {
          const { dataTable, locs } = createTable(results);          
          this.currentResults = dataTable;
          this.locs = locs;
        });
      });
    },
  },
};
</script>

<style>
.vue-map-container {
  height: 50vh;
  width: 100vw;
}
</style>

