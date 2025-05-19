<script setup lang="ts">
import { decode, computeDistance, createTable, darkMapStyle } from '@/utils';
import ErrorBanner from '@/components/ErrorBanner.vue';
import RouteInfo from '@/components/RouteInfo.vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores';
import { onMounted, reactive, ref, watch } from 'vue';

interface State {
  selectMarker: boolean | Cords;
  distance: number;
  locs: null | Cords[];
  currentResults: any[];
  polyline: any;
  currentPath: any;
};

const store = useAppStore();

const state: State = reactive({
  selectMarker: false,
  distance: 0,
  polyline: [],
  currentPath: [],
});

const map = ref(null);

const handleMarkerDrag = (idx: number, e: { latLng: { lat: () => number, lng: () => number } }) => {
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
      elevationChange: 0
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
      store.currentResults = dataTable;
      store.locs = locs;
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

onMounted(async () => {
  const route = useRoute();
  console.log("POLYLINE", route)
  if (route.params.polyline) {
    const mapInstance = await (map.value as any).$mapPromise;
    const markers = decode(route.params.polyline as string);
    if (markers.length > 1) {
      (mapInstance as any).$mapPromise.then(() => {
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
        v-if="store.selectMarker"
        :position="store.selectMarker"
        :draggable="false"
        :clickable="true"
        @click="store.selectMarker = null"
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
        v-if="store.markers.length > 1 && store.locs.length > 1"
        :path="store.locs"
        :editable="false"
        ref="polyline"
        :options="{
          strokeColor: store.strokeColor,
        }"
      />
    </GMapMap>
    <RouteInfo v-if="store.markers.length > 1" />
  </div>
</template>

<style scoped>
.vue-map-container {
  height: 50vh;
  width: 100vw;
}
</style>
