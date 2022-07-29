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
                <v-list-item-subtitle>Swap which travel mode to route with</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
            @click="toggleTransit('Driving')"
        >
            <v-list-item-content>
                <v-list-item-title>
                    DRIVING (Default) 
                    <v-icon v-if="transitMode === 'Driving'">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
            @click="toggleTransit('Bicycling')"
        >
            <v-list-item-content>
                <v-list-item-title>
                    BICYCLING 
                    <v-icon v-if="transitMode === 'Bicycling'">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
            @click="toggleTransit('Transit')"
        >
            <v-list-item-content>
                <v-list-item-title>
                    TRANSIT 
                    <v-icon v-if="transitMode === 'Transit'">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item
            @click="toggleTransit('Walking')"
        >
            <v-list-item-content>
                <v-list-item-title>
                    WALKING 
                    <v-icon v-if="transitMode === 'Walking'">mdi-toggle-switch</v-icon>
                    <v-icon v-else>mdi-toggle-switch-off</v-icon>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>

    </v-list>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'Settings',
    computed: {
        ...mapState([
            'darkMode',
            'transitMode', 
            'MiKm'
        ])
    },
    methods: {
        ...mapMutations([
            'toggleTheme',
            'toggleSystem',
            'toggleTransit'
        ])
    }
}
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