<template>
    <div id="grade_info">
        {{ distance }} {{ conversion[0] }}
        <br />
        {{ change }} {{ conversion[1] }} Change
        <br />
        <span id="grade"></span>
        <div id="key">
            Legend:
            <span :style="{ backgroundColor: '#b2c4b9' }">1%</span>
            <span :style="{ backgroundColor: '#12b5cb' }">3%</span>
            <span :style="{ backgroundColor: '#34a853' }">6%</span>
            <span :style="{ backgroundColor: '#ea4335' }">9%</span>
            <span :style="{ backgroundColor: '#000000', color: 'white' }">{{"> 9%"}}</span>
        </div>
        </div>
        <div>
        <span v-if="markers.length > 1">Click along the chart line to drop a pin</span>
        <span v-if="markers.length <= 1">Drop a couple pins to get started</span>
        <GChart 
            v-if="markers.length > 1"
            type="LineChart" 
            :data="results" 
            :options="chartOptions" 
            :events="chartEvents"
            ref="gChart"
        />
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'RouteInfo',
    data () {
        return {
            chartOptions: {
                chart: {
                    title: 'Elevation change',
                    subtitles: 'Samples, Elevation',
                }
            },
            chartEvents: {
                select: () => {
                    const chart = this.$refs.gChart.chartObject;
                    const event = chart.getSelection();
                    // If click is outside of line
                    // Empty event breaks chart
                    if (!event[0]) { return; };
                    this.ChartMarker(event[0].row);
                },
            }
        };
    },
    methods: {
        ...mapMutations([
            'ChartMarker',
        ]),
    },
    computed: {
        ...mapState({
            distance: (state) => state.distance,
            conversion: (state) => state.conversion,
            results: (state) => state.currentResults,
            markers: (state) => state.markers,
            change: (state) => state.change
        })
    }
}
</script>

<style>

</style>