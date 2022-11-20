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
            @click="toggleSystem"
        >
            <v-list-item-content>
                <v-list-item-title>
                    <span
                        :class="[!MiKm ? 'active' : '']"
                    >MI </span>
                    / 
                    <span
                        :class="[MiKm ? 'active' : '']"
                    >KM </span>
                    <v-icon v-if="MiKm === true">mdi-toggle-switch</v-icon>
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
            v-if="this.markers.length > 1"
        >
            <v-list-item-title>
                Share Hill
            </v-list-item-title>
        </v-list-item>

        <v-list-item class="links">
            <v-list-item-title>Home</v-list-item-title>
                <v-spacer />
            <v-list-item-title>FAQ</v-list-item-title>
                <v-spacer />
            <v-list-item-title>About</v-list-item-title>
        </v-list-item>

    </v-list>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'AppSettings',
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
            'toggleSystem',
            'toggleTransit'
        ]),
        shareHill: async () => {
            
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

.links {
    text-align: center;
}
</style>