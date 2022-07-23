import { createStore } from 'vuex';
const store = createStore({
    state () {
        return {
            center: { lat: 45.551289, lng: 14.724260 },
            markers: [],
        };
    },
    mutations: {
        setCenter (state, loc) {
            state.center = loc.geometry.location;
        },
        addMarker: (state, loc) => {
            state.markers.push(loc.latLng);
        },
        deleteMarker: (state, idx) => {
            state.markers.splice(idx, 1);
        },
        clearMarkers: (state) => {
            state.markers = [];
        }
    },
});
export default store;
