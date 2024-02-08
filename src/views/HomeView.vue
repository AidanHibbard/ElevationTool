<script setup lang="ts">
import { decode, computeDistance, createTable, darkMapStyle } from '@/utils';
import ErrorBanner from '@/components/ErrorBanner.vue';
import ChartLegend from '@/components/ChartLegend.vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores';
import { onMounted, reactive, ref, watch } from 'vue';

const store = useAppStore();

const state = reactive({
  selectMarker: false,
  distance: 0,
  locs: null,
  currentResults: [],
  polyline: [],
  currentPath: [],
});

const map = ref(null);

function handleMarkerDrag(idx: number, e: { latLng: { lat: () => number, lng: () => number } }) {
  const latLng = {
    lat: e.latLng.lat(),
    lng: e.latLng.lng(),
  };
  store.updateMarker({ idx, latLng });
  createRoute();
}

function createRoute() {
  if (store.markers.length <= 1) { 
    store.gradeInfo({
      grade: 0,
      elChange: 0
    });
    state.currentPath = [];
    state.selectMarker = false;
    state.distance = 0;
    return;
  };

  const directionsService = new (window as any).google.maps.DirectionsService();
  const elevationService = new (window as any).google.maps.ElevationService();
  const waypoints = store.markers.slice(1, -1).map((marker: Cords) => ({
    location: {
      lat: marker.lat,
      lng: marker.lng
    },
  }));

  directionsService.route({
    origin: store.markers[0],
    waypoints: waypoints,
    destination: store.markers[store.markers.length - 1],
    travelMode: store.transitMode
  }, (response: { status: string, routes: any }) => {
    if (response.status !== "OK") {
      store.toggleError(true);
      return;
    };

    store.toggleError(false);

    const overviewPath = response.routes[0].overview_path;
    const path = overviewPath.length < 2 ? store.markers : overviewPath;

    state.polyline = (window as any).google.maps.geometry.encoding.decodePath(
      response.routes[0].overview_polyline
    );
  
    state.distance = computeDistance(response.routes[0]);

    elevationService.getElevationAlongPath({
      path: path,
      samples: 256
    }, (results: any) => {
      const { dataTable, locs } = createTable(results);          
      state.currentResults = dataTable;
      state.locs = locs;
    });
  });
};

watch(() => store.markers, () => {
  createRoute();
}, { deep: true });

watch(() => store.transitMode, () => {
  createRoute();
});

watch(() => store.darkMode, async () => {
  if (map.value) {
    const mapInstance = await (map.value as any).$mapPromise;
    if (store.darkMode) {
      mapInstance.setOptions({
        styles: darkMapStyle,
      });
    } else {
      mapInstance.setOptions({
        styles: [],
      });
    };
  };
});

onMounted(() => {
  const route = useRoute();
  if (route.params.polyline) {
    const markers = decode(route.params.polyline);
    if (markers.length > 1) {
      this.$refs.mapRef.$mapPromise.then(() => {
        store.center = markers[0];
        store.markers = markers;
      });
    };
  };
});
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
        v-if="state.selectMarker"
        :position="state.selectMarker"
        :draggable="false"
        :clickable="true"
        @click="state.selectMarker = false"
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
        v-if="store.markers.length > 1 && state.locs"
        :path="state.locs"
        :editable="false"
        ref="polyline"
        :options="{
          strokeColor: store.strokeColor,
        }"
      />
    </GMapMap>
    <div id="grade_info">
      <span id="info">{{ store.distance }}</span> {{ store.conversion }}
      <br />
      <span id="el_change"> {{ store.elevationChange }} {{ store.conversion === 'MI' ? 'feet' : 'meters' }} Elevation change</span>
      <br />
      <span id="grade">{{ store.grade }}% average grade</span>
      <ChartLegend />
    </div>
    <div>
      <span v-if="store.markers.length > 1">Click along the chart line to drop a pin</span>
      <span v-if="store.markers.length <= 1">Drop a couple pins to get started</span>
    </div>
  </div>
</template>

<style scoped>
.vue-map-container {
  height: 50vh;
  width: 100vw;
}
</style>
