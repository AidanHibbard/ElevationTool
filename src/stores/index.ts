import { Color } from '@/utils';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    center: { lat: 45.551289, lng: 14.724260 },
    markers: [],
    error: false,
    darkMode: false,
    conversion: 'MI',
    transitMode: 'DRIVING',
    grade: 0,
    elChange: 0,
    distance: 0,
  }),
  actions: {
    setCenter(loc: { geometry: { location: Cords } }) {
      this.center = loc.geometry.location;
    },
    setDistance(distance: number) {
      this.distance = distance;
    },
    addMarker(loc: { latLng: { lat: () => Cords['lat']; lng: () => Cords['lng'] } }) {
      this.markers.push({
        lat: loc.latLng.lat(),
        lng: loc.latLng.lng(),
      });
    },
    updateMarker({ idx, latLng }: { idx: number; latLng: Cords }) {
      this.markers.splice(idx, 1, latLng);
    },
    deleteMarker(idx: number) {
      this.markers.splice(idx, 1);
    },
    clearMarkers() {
      this.error = false;
      this.markers = [];
    },
    toggleTheme() {
      this.darkMode = !this.darkMode;
    },
    toggleConversion(system: string) {
      this.conversion = system;
    },
    toggleTransit(type: string) {
      this.transitMode = type;
    },
    toggleError(bool: boolean) {
      this.error = bool;
    },
    gradeInfo(payload: { grade: number; elChange: number }) {
      this.grade = payload.grade;
      this.elChange = payload.elChange;
    },
  },
  getters: {
    strokeColor: (state) => Color(state.grade),
  },
});