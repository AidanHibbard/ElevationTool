<template>
    <v-list>
        <v-list-item 
            two-line
            @click="toggleTheme"
        >
            <v-list-item-content>
                <v-list-item-title>
                    Dark Mode 
                    <v-icon v-if="darkMode === true">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
                <v-list-item-subtitle>High contrast Map and Page</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-list-item 
            two-line
            @click="toggleConversion(MiKm === 'MI' ? 'KM' : 'MI')"
        >
            <v-list-item-content>
                <v-list-item-title>
                    <span
                        :class="[MiKm === 'MI' ? 'active' : '']"
                    >MI </span>
                    / 
                    <span
                        :class="[MiKm === 'KM' ? 'active' : '']"
                    >KM </span>
                    <v-icon v-if="MiKm === 'KM'">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
                <v-list-item-subtitle>Swap between Metric or Imperial</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-list-item two-line>
            <v-list-item-content>
                <v-list-item-title>Transit Mode</v-list-item-title>
                <v-list-item-subtitle>Swap which travel mode to route</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
            @click="toggleTransit('DRIVING')"
        >
            <v-list-item-content>
                <v-list-item-title>
                    DRIVING (Default) 
                    <v-icon v-if="transitMode === 'DRIVING'">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
            @click="toggleTransit('BICYCLING')"
        >
            <v-list-item-content>
                <v-list-item-title>
                    BICYCLING 
                    <v-icon v-if="transitMode === 'BICYCLING'">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
            @click="toggleTransit('TRANSIT')"
        >
            <v-list-item-content>
                <v-list-item-title>
                    TRANSIT 
                    <v-icon v-if="transitMode === 'TRANSIT'">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
            @click="toggleTransit('WALKING')"
        >
            <v-list-item-content>
                <v-list-item-title>
                    WALKING 
                    <v-icon v-if="transitMode === 'WALKING'">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item class="links"
            v-if="this.markers.length > 1 && !generating && !link"
            @click="saveHill"
        >
            <v-list-item-title>
                Save Hill
            </v-list-item-title>
        </v-list-item>
        <v-list-item class="links"
            v-if="this.markers.length > 1 && generating && !link"
        >
            <v-list-item-title>
                Building Link...
            </v-list-item-title>
        </v-list-item>
        <a v-if="this.markers.length > 1 && !generating && link" :href="link" target="_blank" @click="saveHill">
            <v-list-item class="links">
                <v-list-item-title>
                    Click to save
                </v-list-item-title>
            </v-list-item>
        </a>

    </v-list>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'AppSettings',
    data () {
        return {
            generating: false,
            link: false,
        }
    },  
    computed: {
        ...mapState([
            'darkMode',
            'transitMode', 
            'MiKm',
            'markers'
        ]),
    },
    methods: {
        ...mapMutations([
            'toggleTheme',
            'toggleConversion',
            'toggleTransit'
        ]),
        saveHill: function() {
            if (!this.link) {
                this.generating = true;
                const m = this.markers[0];
                this.link = `https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lng}`;
                this.generating = false;
            } else {
                this.link = false;
                this.generating = false;
            };
        },
    },
};
</script>

<style scoped>
.active {
    color: #2196f3;
}
.v-icon {
    float: right;
}
.v-list-item-title {
    width: 211px;
}
</style>