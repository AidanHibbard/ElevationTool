import encode from './encode.js';
export default function generatePolyline(points) {
    const factor = 1e5;
    let prev_lat = 0;
    let prev_lng = 0;
    let result = '';
    for (const point of points) {
        const lat = Math.round(point.lat * factor);
        const lng = Math.round(point.lng * factor);
        const d_lat = lat - prev_lat;
        const d_lng = lng - prev_lng;
        prev_lat = lat;
        prev_lng = lng;
        result += encode(d_lat) + encode(d_lng);
    };

    return encodeURI(result);
};


