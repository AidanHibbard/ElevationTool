export {
  generatePolyline,
  encode,
  decode,
} from './polyline';
export {
  darkMapStyle,
} from './map/dark';
import { useAppStore }from '@/stores';

let distance: number;

export function Color(grade: number): string {
  const store = useAppStore();
  const colorMap = [
    { threshold: 1, color: '#19a84c' },
    { threshold: 3, color: '#0092ff' },
    { threshold: 6, color: '#ffed3d' },
    { threshold: 9, color: '#f6252b' }
  ];
  const aboveGrade = store.darkMode ? '#ffffff' : '#000000';
  const matchedColor = colorMap.find(color => grade < color.threshold);
  return matchedColor ? matchedColor.color : aboveGrade;
}

export function mapGrade(rise: number, run: number): number {
	return Number((rise/run*100).toFixed(2));
}

// TODO: Dont use any
export function computeDistance(route: any) {
  const store = useAppStore();
    const unit = store.conversion;
    let total = 0;
    // TODO: Dont use any
    route.legs.forEach((leg: any) => {
        total += leg.distance.value;
    });
    if (unit === 'MI') {
        // Convert from meters to miles
        total = total / 1609.344;
    } else if (unit === 'KM') {
        // Convert from meters to kilometers
        total = total / 1000;
    };
    distance = total;
    return Number(total.toFixed(2));
};

export function createTable(results: any) {
  const store = useAppStore();
  const dataTable = [['Distance', 'Elevation', { role: 'style' }]];
  const locs = [];
  const prev = 8;
  const sampleDistance = distance / 256;
  const portionLength = (distance * (store.conversion === 'MI' ? 1609 : 1000)) / (256 / prev);
  let runningDistance = 0;
  let minEl: number = results[0].elevation;
  let maxEl = 0;
  const conversionFactor = store.conversion === 'MI' ? 3.28 : 1;

  for (let i = 0; i < results.length; i++) {
    const elSample = results[i];
    const { elevation } = elSample;

    if (elevation > maxEl) maxEl = elevation;
    if (elevation < minEl) minEl = elevation;

    const prevSample = results[i - prev] || null;
    const nextSample = results[i + prev] || null;
    const prevElevation = prevSample ? prevSample.elevation : elevation;
    const nextElevation = nextSample ? nextSample.elevation : elevation;

    let portion = mapGrade(elevation - prevElevation, portionLength);
    if (i <= prev - 1) {
      portion = mapGrade(nextElevation - elevation, portionLength);
    }

    runningDistance += sampleDistance;

    const absPortion = Math.abs(portion);
    if (absPortion > maxEl) maxEl = absPortion;
    const color = Color(absPortion);

    dataTable.push([
      `${runningDistance.toFixed(2)} ${store.conversion}`,
      String(elevation * conversionFactor),
      color
    ]);

    locs.push({
      lat: elSample.location.lat(),
      lng: elSample.location.lng(),
    });
  };
  minEl *= conversionFactor;
  maxEl *= conversionFactor;
  const elChange = Number((maxEl - minEl).toFixed(0));
  const grade = Number((elChange/(distance * (store.conversion === 'MI' ? 5280 : 1000))*100).toFixed(2));
  store.gradeInfo({
    elChange,
    grade
  })
  return { dataTable, locs };
};
