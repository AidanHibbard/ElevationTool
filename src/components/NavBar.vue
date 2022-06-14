<template>
    <nav>
        <v-app-bar
            color="light-blue"
            dark
            nav
        >
            <GMapAutocomplete
                placeholder="Enter a place"
                @place_changed="SetCenter"
            />
            <v-btn
                elevation="2"
                color="black"
                @click="ClearMarkers"
            >
                Clear
            </v-btn>
            <v-spacer />
            <v-icon
                @click="drawer = !drawer"
                aria-label="Settings" 
                role="img" 
                aria-hidden="false"
                dark
            >
                mdi-tune
            </v-icon>
        </v-app-bar>
            <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
            >
            <v-list
                nav
                dense
            >
                <v-list-item>
                    <v-list-item-title class="text-h6">
                        Measurement
                    </v-list-item-title>
                    <v-radio-group
                        v-model="radios"
                        mandatory
                        >
                        <v-radio
                            label="Miles"
                            value="MI"
                        ></v-radio>
                        <v-radio
                            label="Kilometers"
                            value="KM"
                        ></v-radio>
                    </v-radio-group>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    name: 'NavBar',
    data: () => ({
        drawer: false,
        group: null,
    }),
    methods: {
        ...mapMutations([
            'SetCenter',
            'ClearMarkers'
        ])
    }
}
</script>

<style scoped>
.pac-target-input {
    border: 1px solid black;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    max-width: 175px;
}
.v-btn {
    margin: 5px;
    background-color: #ccefff;
}
</style>