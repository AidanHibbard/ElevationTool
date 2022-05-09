<template>
  <div>
    <Map />
    <RouteInfo />
  </div>
</template>

<script>
import Map from '@/components/Map.vue';
import RouteInfo from '@/components/RouteInfo.vue';
export default {
  name: 'ElevationTool',
  components: {
    RouteInfo,
    Map
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

