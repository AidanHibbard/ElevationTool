<script setup lang="ts">
import { reactive } from 'vue';
import { RouterView } from 'vue-router';
import AppSettings from './components/AppSettings.vue';
import { useAppStore } from './stores';
const store = useAppStore();
const state = reactive({
  darkMode: false,
  drawer: false,
});
</script>

<template>
  <v-app :class="[state.darkMode ? 'darkMode' : '']">
    <v-app-bar>
      <v-icon 
        color="blue-darken-2"
        id="settings-toggle"
        @click="state.drawer = !state.drawer"
        icon="mdi-cog-outline"
      />
      <v-spacer />
      
      <GMapAutocomplete
        placeholder="Enter a place"
        @place_changed="store.setCenter"
      />
      <v-btn 
        primary
        color="secondary"
        small
        @click="store.clearMarkers()"
        id="clearbtn"
      >
        Clear
        <br> 
        Map
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="state.drawer"
      absolute
      temporary
    >
      <AppSettings />
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Keep Google Autocomplete below Nav */
/* TODO: FIX */
.pac-container {
  top: 60px !important;
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
#settings-toggle {
  margin-left: 10px;
}
</style>
