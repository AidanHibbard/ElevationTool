<template>
    <div id="key">
        Legend:
        <span
            v-for="(color, idx) in colors"
            :key="color.percent"
            :style="{
                backgroundColor: color.color,
            }"
            :class="[ 
                idx === 0 ? 'leftRadius' : '',
                idx === 4 ? 'rightRadius' : ''
            ]"
        >
            {{color.percent}}%
        </span>
    </div>
</template>

<script>
export default {
    name: 'Legend',
    data () {
        return {
            colors: [
                {
                    percent: '< 1',
                    color: '#19a84c'
                },
                {
                    percent: '< 3',
                    color: '#0092ff'
                },
                {
                    percent: '< 6',
                    color: '#ffed3d'
                },
                {
                    percent: '< 9',
                    color: '#f6252b'
                },
                {
                    percent: '> 9',
                    color: '#000000'
                }
            ]
        }
    }
}
</script>

<style scoped>
.leftRadius {
    border-radius: 5px 0 0 5px;
}
.rightRadius {
    border-radius: 0 5px 5px 0;
    color: white;
}
</style>