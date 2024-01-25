interface Cords {
  lat: number;
  lng: number;
}

interface AppState {
  center: Cords;
  markers: Location[];
  error: boolean;
  darkMode: boolean;
  conversion: string;
  transitMode: string;
  grade: number;
  elChange: number;
  distance: number;
}