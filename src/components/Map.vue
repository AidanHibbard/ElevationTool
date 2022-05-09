<template>
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
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
export default {
    name: 'Map',
    computed: { 
        ...mapState({
        center: (state) => state.center,
        selected: (state) => state.selectMarker,
        markers: (state) => state.markers,
        path: (state) => state.currentPath,
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

</style>