import { createStore } from 'vuex';
const store = createStore({
    state () {
        return {
            center: { lat: 45.551289, lng: 14.724260 },
        };
    },
    mutations: {
        SetCenter: (state, event) => {
            state.center = event.geometry.location;
        }
    }
});
export default store;