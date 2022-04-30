import { createStore } from 'vuex';
const store = createStore({
    state () {
        return {
            center: { lat: 45.551289, lng: 14.724260 },
            markers: [],
            distance: 0,
            change: 0,
            conversion: ['Miles','Feet'],
        };
    },
    mutations: {
        SetCenter: (state, event) => {
            state.center = event.geometry.location;
        },
        Convert: (state, type) => {
            if (type === 'MI') state.conversion = [
                'Miles',
                'Feet'
            ]
            if (type === 'KM') state.conversion = [
                'Kilometers',
                'Meters'
            ]
        }
    }
});
export default store;