import { Color } from '@/utils';
import { defineStore } from 'pinia';
import { ref, type Ref, computed } from 'vue';
import { useRouteQuery } from '@vueuse/router'

export const useAppStore = defineStore('app', () => {
  const center: Ref<Cords> = ref({ lat: 45.551289, lng: 14.724260 });
  const markers: Ref<Cords[]> = ref([]);
  const error = ref(false);
  const darkMode = ref(false);
  const conversion: Ref<ConversionSystem> = ref('MI');
  const transitMode: Ref<TransitMode> = ref('DRIVING');
  const currentResults = ref([]);
  const locs = ref([])
  const chartData = ref([]);
  const grade = ref(0);
  const elevationChange = ref(0);
  const distance = ref(0);
  const encoded = useRouteQuery<string>('encoded', '')
  const selectMarker = ref<null | Cords>(null)

  const strokeColor = computed(() => Color(grade.value));

  const setSelectMarker = (idx: number) => {
    selectMarker.value = locs.value[idx]
  }

  const setCenter = (loc: { geometry: { location: Cords } }) => {
    center.value = loc.geometry.location;
  };

  const setDistance = (length: number) => {
    distance.value = length;
  };
  
  const addMarker = (loc: { latLng: { lat: () => Cords['lat']; lng: () => Cords['lng']; } }) => {
    markers.value.push({
      lat: loc.latLng.lat(),
      lng: loc.latLng.lng(),
    });
  };

  const updateMarker = ({ idx, latLng }: { idx: number; latLng: Cords }) => {
    markers.value.splice(idx, 1, latLng);
  };

  const deleteMarker = (idx: number) => {
    markers.value.splice(idx, 1);
  };

  const clearMarkers = () => {
    error.value = false;
    markers.value = [];
    selectMarker.value = null;
  };

  const toggleTheme = () => {
    darkMode.value = !darkMode.value;
  };

  const toggleConversion = (system: ConversionSystem) => {
    conversion.value = system;
  };

  const toggleTransit = (type: TransitMode) => {
    transitMode.value = type;
  };

  const toggleError = (state: boolean) => {
    error.value = state;
  };

  const gradeInfo = (payload: { grade: number; elevationChange: number }) => {
    grade.value = payload.grade;
    elevationChange.value = payload.elevationChange;
  };

  return {
    center,
    markers,
    currentResults,
    encoded,
    error,
    darkMode,
    conversion,
    transitMode,
    grade,
    elevationChange,
    distance,
    chartData,
    strokeColor,
    locs,
    selectMarker,
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
    setSelectMarker,
  };
});