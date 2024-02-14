import { Color } from '@/utils';
import { defineStore } from 'pinia';
import { ref, type Ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  const center: Ref<Cords> = ref({ lat: 45.551289, lng: 14.724260 });
  const markers: Ref<Cords[]> = ref([]);
  const error = ref(false);
  const darkMode = ref(false);
  const conversion: Ref<ConversionSystem> = ref('MI');
  const transitMode: Ref<TransitMode> = ref('DRIVING');
  const chartData = ref([]);
  const grade = ref(0);
  const elevationChange = ref(0);
  const distance = ref(0);

  const strokeColor = computed(() => Color(grade.value));

  function setCenter(loc: { geometry: { location: Cords } }) {
    center.value = loc.geometry.location;
  };

  function setDistance(length: number) {
    distance.value = length;
  };
  
  function addMarker(loc: { latLng: { lat: () => Cords['lat']; lng: () => Cords['lng']; } }) {
    markers.value.push({
      lat: loc.latLng.lat(),
      lng: loc.latLng.lng(),
    });
  };

  function updateMarker({ idx, latLng }: { idx: number; latLng: Cords }) {
    markers.value.splice(idx, 1, latLng);
  };

  function deleteMarker(idx: number) {
    markers.value.splice(idx, 1);
  };

  function clearMarkers() {
    error.value = false;
    markers.value = [];
  };

  function toggleTheme() {
    darkMode.value = !darkMode.value;
  };

  function toggleConversion(system: ConversionSystem) {
    conversion.value = system;
  };

  function toggleTransit(type: TransitMode) {
    transitMode.value = type;
  };

  function toggleError(state: boolean) {
    error.value = state;
  };

  function gradeInfo(payload: { grade: number; elevationChange: number }) {
    grade.value = payload.grade;
    elevationChange.value = payload.elevationChange;
  };

  return {
    center,
    markers,
    error,
    darkMode,
    conversion,
    transitMode,
    grade,
    elevationChange,
    distance,
    chartData,
    strokeColor,
    setCenter,
    setDistance,
    addMarker,
    updateMarker,
    deleteMarker,
    clearMarkers,
    toggleTheme,
    toggleConversion,
    toggleTransit,
    toggleError,
    gradeInfo,
  };
});