import { createStore } from 'vuex';
const store = createStore({
    state () {
        return {
            // Map 
            center: { lat: 45.551289, lng: 14.724260 },
            markers: [],
            error: false,

            // Settings
            darkMode: false,
            MiKm: false, // MI Default
            transitMode: 'DRIVING',

            // Grade Info
            grade: 0,
            elchange: 0,

        };
    },
    mutations: {
        setCenter (state, loc) {
            state.center = loc.geometry.location;
        },
        addMarker: (state, loc) => {
            state.markers.push({
                lat: loc.latLng.lat(),
                lng: loc.latLng.lng()
            });
        },
        deleteMarker: (state, idx) => {
            state.markers.splice(idx, 1);
        },
        clearMarkers: (state) => {
            state.error = false;
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
        },
        toggleError: (state, bool) => {
            state.error = bool;
        },
        gradeinfo: (state, payload) => {
            state.grade = payload.grade;
            state.elchange = payload.elchange;
        }
    },
});
export default store;
