<script setup lang="ts">
import { useAppStore } from '@/stores';

const store = useAppStore();
</script>

<template>
  <div class="alert">
    <span class="closebtn" @click="store.toggleError(false)">&times;</span> 
    <div>
      Google could not find a route with the given transit mode.
      <br />
      Elevation data may still show.
    </div>
  </div>
</template>

<style scoped>
.alert {
  padding: 20px;
  background-color: #f44336;
  color: white;
}

.closebtn {
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 30px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.closebtn:hover {
  color: black;
}
</style>