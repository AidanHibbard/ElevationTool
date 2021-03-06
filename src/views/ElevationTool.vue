<template>
  <div id="container">
    <GMapAutocomplete
      placeholder="Enter a place"
      @place_changed="setCenter"
    />
    <button 
      @click="clearMarkers()"
    >
      Clear Markers
    </button>
    <input type="radio" id="miles" name="mi_or_km" v-model="measurement" value="MI">
    <label for="miles">Miles</label>
    <input type="radio" id="km" name="mi_or_km" v-model="measurement" value="KM">
    <label for="km">KM</label>
    <GMapMap
        :center="center"
        :zoom="13"
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
        :data="currentResults" 
        :options="chartOptions" 
        :events="chartEvents"
        ref="gChart"
      />
    </div>
  </div>
</template>

<script>
import { computeDistance, createTable } from '@/utils';
export default {
  name: 'ElevationTool',
  data () {
    return {
      measurement: 'MI',
      selectMarker: false,
      locs: null,
      markers: [],
      currentResults: [],
      currentPath: [],
      center: { lat: 45.551289, lng: 14.724260 },
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
  methods: {
    addMarker: function (e) {
      this.markers.push(e.latLng);
      this.createRoute();
    },
    deleteMarker: function (i) {
      this.markers.splice(i, 1);
      this.createRoute();
    },
    clearMarkers: function () {
      this.markers = [];
      this.createRoute();
    },
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
    setCenter: function (e) {
      this.center = e.geometry.location;
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
        directionsService.route(
        {
          origin: this.markers[0],
          waypoints: waypoints,
          destination: this.markers[this.markers.length - 1],
          travelMode: 'DRIVING'
        },
        (response) => {
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
        });
      };
    }
  },
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

