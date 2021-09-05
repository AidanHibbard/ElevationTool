import { MapElementFactory } from "vue2-google-maps";

export default MapElementFactory({
    name: "directionsRenderer",

    ctr() {
        return window.google.maps.DirectionsRenderer;
    },

    events: [],

    mappedProps: {}, 

    props: {
        origin: { type: Object },
        waypoints: { type: Array },
        destination: { type: Object },
    },
    // @Params can pass DirectionsRenderer
    afterCreate() {
        let directionsService = new window.google.maps.DirectionsService;
        let directionsDisplay = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true,
        });
        let elevationService = new window.google.maps.ElevationService;
        //let chart = document.getElementById('chart_div')
        function computeDistance(response) {
            let total = 0;
            const route = response.routes[0]
            for (let i = 0; i < route.legs.length; i++) {
                total += route.legs[i].distance.value
            }
            total = (total / 1000) / 1.609;
            document.getElementById('total_distance').innerHTML = `${total.toString().substring(0, 4)} Miles`;
        }
        function createTable(results) {
            let dataTable = []
            // Create Columns expected as [0]
            dataTable.push(['Sample', 'Elevation'])
            results.forEach((elevationSample) => {
                // Each row
                // Don't add a name to the sample since there isn't enough space
                dataTable.push(['', elevationSample.elevation])
            })
            return dataTable
        }
        this.$watch(
        () => [this.origin, this.waypoints, this.destination],
        () => {
            let { origin, waypoints, destination } = this;
            if (!origin || !destination ) return;
            directionsService.route({
                origin,
                waypoints,
                destination,
                travelMode: 'DRIVING'
            },
            (response, status) => {
                if (status !== "OK") return;
                directionsDisplay.setDirections(response);
                this.$root.$data.currentPath = window.google.maps.geometry.encoding.decodePath(
                    response.routes[0].overview_polyline
                )
                computeDistance(response)
                elevationService.getElevationAlongPath({
                    path: response.routes[0].overview_path,
                    samples: 128
                }, (results) => {
                    this.$root.$data.currentResults = createTable(results)
                })
            }
            );
        }
        );
    },
});
