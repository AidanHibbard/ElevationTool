import { createStore } from 'vuex';
const store = createStore({
    state () {
        return {
            // Map 
            center: { lat: 45.551289, lng: 14.724260 },
            markers: [],

            // Settings
            darkMode: false,
            MiKm: false, // MI Default
            transitMode: 'DRIVING',



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
        },
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
        },
        toggleSystem: (state) => {
            state.MiKm = !state.MiKm;
        },
        toggleTransit: (state, type) => {
            state.transitMode = type;
        }
    },
});
export default store;
