<template>
    <div class="alert">
        <span class="closebtn" @click="toggleError(false)">&times;</span> 
        <div>
            Google could not find a route with the given transit mode.
            <br />
            Elevation data may still show.
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
    name: 'ErrorBanner',
    computed: {
        ...mapState({
            error: (state) => state.error,
        }),
    },
    methods: {
        ...mapMutations(['toggleError'])
    }
}
</script>

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