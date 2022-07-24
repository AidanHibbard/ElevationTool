<template>
    <div id="key">
        Legend:
        <span :style="{ backgroundColor: '#b2c4b9'}">1%</span>
        <span :style="{ backgroundColor: '#12b5cb' }">3%</span>
        <span :style="{ backgroundColor: '#34a853' }">6%</span>
        <span :style="{ backgroundColor: '#ea4335' }">9%</span>
        <span :style="{ backgroundColor: 'black', color: 'white' }">{{"> 9%"}}</span>
    </div>
</template>

<script>
export default {
    name: 'Legend',
}
</script>

<style scoped>

</style>