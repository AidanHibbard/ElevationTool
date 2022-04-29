<template>
  <v-app>
    <NavBar v-if="$route.name !== 'Get Started'" />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
export default {
  name: 'App',
  components: {
    NavBar,
  },
}
</script>

<style>

</style>
