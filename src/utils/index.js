import store from '@/store';
let distance;
export function Color(grade) {
    const colorMap = [
        { threshold: 1, color: '#19a84c' },
        { threshold: 3, color: '#0092ff' },
        { threshold: 6, color: '#ffed3d' },
        { threshold: 9, color: '#f6252b' }
    ];
    const matchedColor = colorMap.find(color => grade < color.threshold);
    return matchedColor ? matchedColor.color : '#000000';
}
export function mapGrade(rise, run) {
	return (rise/run*100).toFixed(2);
}
export function computeDistance(route) {
    let total = 0;
    route.legs.forEach((leg) => {
        total += leg.distance.value;
    });
    total = (total / 1000) / 1.609;
    distance = total;
    return total.toString().substring(0, 4);
};
export function createTable(results) {
    let 
        dataTable = [],
        locs = [],
        prev = 8,
        portion,
        portion_length,
        sample_distance,
        running_distance = 0,
        minEl, 
        maxEl = 0;
    portion_length = (distance * 1609) / (256/prev)
    // Create Columns expected as [0]
    dataTable.push(['Distance', 'Elevation', { role: 'style' }]);
    // Set first elevation to check if rest are <
    minEl = results[0].elevation;
    sample_distance = distance / 256;
    results.forEach((elSample, idx) => {
        const { elevation } = elSample;
        if (elevation > maxEl) maxEl = elevation;
        if (elevation < minEl) minEl = elevation;
    
        const prevSample = results[idx - prev] || null;
        const nextSample = results[idx + prev] || null;
        const prevElevation = prevSample ? prevSample.elevation : elevation;
        const nextElevation = nextSample ? nextSample.elevation : elevation;
    
        portion = mapGrade(elevation - prevElevation, portion_length);
        if (idx <= prev - 1) {
            portion = mapGrade(nextElevation - elevation, portion_length);
        }
    
        running_distance += sample_distance;
    
        const absPortion = Math.abs(portion);
        if (absPortion > maxEl) maxEl = absPortion;
    
        const color = `${Color(absPortion)}`;
    
        dataTable.push([`${running_distance.toFixed(2)} Mi`, elevation * 3.28, color]);
    
        locs.push({
            lat: elSample.location.lat(),
            lng: elSample.location.lng(),
        });
    });
    // convert to feet of elevation
    minEl *= 3.28;
    maxEl *= 3.28;
    const elchange = (maxEl - minEl).toFixed(0);
    const grade = (elchange/(distance * 5280)*100).toFixed(2);
    store.commit("gradeInfo", {
        elchange,
        grade
    });
    return { dataTable, locs };
};