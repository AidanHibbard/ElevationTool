<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer />
      <GMapAutocomplete
        placeholder="Enter a place"
        @place_changed="setCenter"
      />
      <v-btn 
        primary
        color="secondary"
        small
        @click="clearMarkers"
        id="clearbtn"
      >
        Clear 
        <br />
        Map
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >

    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    group: null,
  }),
  methods: {
    ...mapMutations([
      'setCenter',
      'clearMarkers'
    ])
  }
}
</script>

<style>
/* Keep Google Autocomplete below Nav */
.pac-container {
  margin-top: 20px;
}
.pac-target-input {
  border: 1px solid black;
  border-radius: 3px;
  max-width: 190px;
  margin-right: 5px;
}
#clearbtn {
  background-color: #dafaf7;
}
</style>
