export default function decodePolyline(polyline) {
    let index = 0;
    let lat = 0,
        lng = 0;
    let coordinates = [];
    const len = polyline.length;
    let b, shift = 0,
        result = 0;
    while (index < len) {
      // Decode latitude
        shift = 0;
        result = 0;
        do {
            b = polyline.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        lat += ((result & 1) ? ~(result >> 1) : (result >> 1));
    
        // Decode longitude
        shift = 0;
        result = 0;
        do {
            b = polyline.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        lng += ((result & 1) ? ~(result >> 1) : (result >> 1));
    
        coordinates.push({
            lat: lat / 1e5,
            lng: lng / 1e5
        });
    }
    return coordinates;
};
