<script setup lang="ts">
import { decode } from '@/utils';
import ErrorBanner from '@/components/ErrorBanner.vue';
import ChartLegend from '@/components/ChartLegend.vue';
import { computeDistance, createTable, Color } from '@/utils';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores';

const store = useAppStore();

const state = reactive({
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
  chartEvents: null,
});

function handleMarkerDrag(idx: number, e: { latLng: { lat: () => number, lng: () => number } }) {
  const latLng = {
    lat: e.latLng.lat(),
    lng: e.latLng.lng(),
  };
  updateMarker({ idx, latLng });
  createRoute();
}

function createRoute() {
      if (this.markers.length <= 1) { 
        this.gradeInfo({
          grade: 0,
          el_change: 0
        });
        this.currentPath = [];
        this.selectMarker = false;
        this.distance = 0;
        return;
      };

      const directionsService = new window.google.maps.DirectionsService();
      const elevationService = new window.google.maps.ElevationService();
      const waypoints = this.markers.slice(1, -1).map((marker) => ({
        location: {
          lat: marker.lat,
          lng: marker.lng
        },
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
        };

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
    }


export default {
  name: 'ElevationTool',
  mounted () {
    const self = this;
    const route = useRoute();
    const store = useStore();
    if (route.params.polyline) {
      const markers = decodePolyline(route.params.polyline);
      if (markers.length > 1) {
        this.$refs.mapRef.$mapPromise.then(() => {
          store.state.center = markers[0];
          store.state.markers = markers;
        });
      };
    };

    this.chartEvents = {
      select: function () {
        self.chartMarker();
      },
    };
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
  methods: {,
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
          el_change: 0
        });
        this.currentPath = [];
        this.selectMarker = false;
        this.distance = 0;
        return;
      };

      const directionsService = new window.google.maps.DirectionsService();
      const elevationService = new window.google.maps.ElevationService();
      const waypoints = this.markers.slice(1, -1).map((marker) => ({
        location: {
          lat: marker.lat,
          lng: marker.lng
        },
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
        };

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

<template>
  <div id="container">
    <ErrorBanner v-if="store.error" />
    <GMapMap
        :center="store.center"
        :zoom="15"
        map-type-id="terrain"
        
        @click="store.addMarker"
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
        v-for="(m, idx) in store.markers"
        :label="String(idx + 1)"
        :key="idx"
        :position="m"
        :clickable="true"
        @click="store.deleteMarker(idx)"
        :draggable="true"
        @dragend="handleMarkerDrag(idx, $event)"
      />
      <GMapPolyline
        v-if="store.markers.length > 1 && locs"
        :path="locs"
        :editable="false"
        ref="polyline"
        :options="{
          strokeColor,
        }"
      />
    </GMapMap>
    <div id="grade_info">
      <span id="info">{{ store.distance }}</span> {{ store.conversion }}
      <br />
      <span id="el_change"> {{ store.elChange }} {{ store.conversion === 'MI' ? 'feet' : 'meters' }} Elevation change</span>
      <br />
      <span id="grade">{{ store.grade }}% average grade</span>
      <Legend />
    </div>
    <div>
      <span v-if="store.markers.length > 1">Click along the chart line to drop a pin</span>
      <span v-if="store.markers.length <= 1">Drop a couple pins to get started</span>
      <GChart 
        v-if="store.markers.length > 1"
        type="LineChart" 
        :data="currentResults" 
        :options="chartOptions" 
        :events="chartEvents"
        ref="gChart"
      />
    </div>
  </div>
</template>

<style scoped>
.vue-map-container {
  height: 50vh;
  width: 100vw;
}
</style>
