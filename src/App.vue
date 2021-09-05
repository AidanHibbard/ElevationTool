<template>
  <div id="app">
    <GmapAutocomplete
      @place_changed='setPlace'
      :options="{fields:['geometry', 'address_components']}"
    />
    <GmapMap
    :zoom="10"
    :center="MapCenter"
    style="width: 100%; height: 500px;"
    @click="addMarker"
    >
      <GmapMarker
        v-for="(m, index) in markers"
        :key="index"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        :label="`${index + 1}`"
        @click="deleteMarker(index)"
      />
      <DirectionsRenderer 
        v-if="markers.length > 0" 
        :origin="markers[0].position"
        :waypoints="markers.filter((v, i) => i !== 0 && i !== markers.length -1).position"
        :destination="markers[markers.length - 1].position"
      />
      <gmap-polyline
        v-if="markers.length > 1"
        :path="$root.$data.currentPath"
        :options="{
          strokeColor: '#875ae7'
        }"
      />
    </GmapMap>
    <br />
    <div id="total_distance"></div>
    <GChart
      v-if="markers.length > 1"
      type='ColumnChart'
      :data="$root.$data.currentResults"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import DirectionsRenderer from "@/components/DirectionsRenderer";
export default {
  name: 'App',
  components: {
    DirectionsRenderer
  },
  data() {
    return {
      markers: [],
      MapCenter: { lat: 20.716455, lng: -156.250807 },
      chartOptions: {
        chart: {
          title: 'Elevation change',
          subtitles: 'Samples, Elevation'
        }
      }
    }
  },
  methods: {
    // @params place = Geo object from autocomplete
    setPlace: function(place) {
      this.MapCenter = place.geometry.location
    },
    // @params mce = Map Click Event
    addMarker: function(mce) {
      this.markers.push({ 
        position: mce.latLng,
      })
    },
    // @params i = marker index
    deleteMarker: function(i) {
      this.markers.splice(i, 1)
    },
  }
}
</script>

<style>

</style>
