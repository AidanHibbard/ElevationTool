import { createStore } from 'vuex';
import { computeDistance, createTable } from '@/utils';
const store = createStore({
    state () {
        return {
            center: { lat: 45.551289, lng: 14.724260 },
            markers: [],
            distance: 0,
            change: 0,
            conversion: ['Miles','Feet'],
            selectMarker: false,
            locs: null,
            markers: [],
            currentResults: [],
            currentPath: [],
        };
    },
    mutations: {
        AddMarker: (state, marker) => {
            state.markers.push(marker);
            this.dispatch('CreateRoute');
        },
        DeleteMarker: (state, idx) => {
            state.markers.splice(idx, 1);
            this.dispatch('CreateRoute');
        },
        ChartMarker: (state, idx) => {
            state.selectMarker = state.locs[idx];
        },
        Deselect: (state) => {
            state.selectMarker = false;
        },
        SetCenter: (state, event) => {
            state.center = event.geometry.location;
        },
        Convert: (state, type) => {
            if (type === 'MI') state.conversion = [
                'Miles',
                'Feet'
            ]
            if (type === 'KM') state.conversion = [
                'Kilometers',
                'Meters'
            ]
        },
        reset: (state) => {
            state.markers = [];
            this.dispactch('CreateRoute');
            state.distance = 0;
            state.change = 0;
        }
    },
    actions: {
        CreateRoute: ({ state }) => {
            if (state.markers.length <= 1) { 
                this.commit('reset');
            } else {
                const 
                    directionsService = new window.google.maps.DirectionsService,
                    elevationService = new window.google.maps.ElevationService;
                // There has to be a one liner way to filter this
                let waypoints = [];
                if (state.markers.length > 2) {
                    for (let i=1; i < (state.markers.length - 1); i++) {
                    waypoints.push({ location: { lat: state.markers[i].lat(), lng: state.markers[i].lng() }})
                    };
                };
                directionsService.route(
                {
                    origin: state.markers[0],
                    waypoints: waypoints,
                    destination: state.markers[state.markers.length - 1],
                    travelMode: 'DRIVING'
                },
                (response) => {
                    state.currentPath = window.google.maps.geometry.encoding.decodePath(
                        response.routes[0].overview_polyline
                    );
                    computeDistance(response.routes[0])
                    elevationService.getElevationAlongPath({
                        path: response.routes[0].overview_path,
                        samples: 256
                    }, (results) => {
                        const etl = createTable(results);          
                        state.currentResults = etl.dataTable;
                        state.locs = etl.locs;
                    });
                });
            };
        }
    }
});
export default store;