import { encode } from './encode';
export function generatePolyline(points: Array<Cords>) {
  const factor = 1e5;
  let prevLat = 0;
  let prevLng = 0;
  let result = '';
  for (const point of points) {
    const lat = Math.round(point.lat * factor);
    const lng = Math.round(point.lng * factor);
    const dLat = lat - prevLat;
    const dLng = lng - prevLng;
    prevLat = lat;
    prevLng = lng;
    result += encode(dLat) + encode(dLng);
  };

  return encodeURI(result);
};