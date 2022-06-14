import { createStore } from 'vuex';
import { computeDistance, createTable } from '@/utils';
const store = createStore({
    state () {
        return {
            // Center: KnK
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
            state.markers.push(marker.latLng);
        },
        DeleteMarker: (state, idx) => {
            state.markers.splice(idx, 1);
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
        ClearMarkers: (state) => {
            state.markers = [];
        },
        Reset: (state) => {
            state.distance = 0;
            state.change = 0;
            state.currentPath = [];
            state.currentResults = [];
            state.locs = null;
            state.selectMarker = false;
        }
    },
    actions: {
        CreateRoute: ({ state }) => {
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
                state.distance = computeDistance(response.routes[0])
                elevationService.getElevationAlongPath({
                    path: response.routes[0].overview_path,
                    samples: 256
                }, (results) => {
                    const etl = createTable(results);          
                    state.currentResults = etl.dataTable;
                    state.locs = etl.locs;
                    state.change = etl.elChange;
                });
            });
        }
    }
});
export default store;