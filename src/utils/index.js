import store from '@/store';
let distance;
export function Color(grade) {
    const colorMap = [
        { threshold: 1, color: '#19a84c' },
        { threshold: 3, color: '#0092ff' },
        { threshold: 6, color: '#ffed3d' },
        { threshold: 9, color: '#f6252b' }
    ];
    const above_grade = store.state.darkMode ? '#ffffff' : '#000000';
    const matchedColor = colorMap.find(color => grade < color.threshold);
    return matchedColor ? matchedColor.color : above_grade;
}
export function mapGrade(rise, run) {
	return (rise/run*100).toFixed(2);
}
export function computeDistance(route) {
    const unit = store.state.MiKm;
    let total = 0;
    route.legs.forEach((leg) => {
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
    return total.toFixed(2);
};
export function createTable(results) {
    const dataTable = [['Distance', 'Elevation', { role: 'style' }]];
    const locs = [];
    const prev = 8;
    const sample_distance = distance / 256;
    const portion_length = (distance * (store.state.MiKm === 'MI' ? 1609 : 1000)) / (256 / prev);
    let running_distance = 0;
    let min_el = results[0].elevation;
    let max_el = 0;
    const conversion_factor = store.state.MiKm === 'MI' ? 3.28 : 1;

    for (let i = 0; i < results.length; i++) {
        const elSample = results[i];
        const { elevation } = elSample;
    
        if (elevation > max_el) max_el = elevation;
        if (elevation < min_el) min_el = elevation;
    
        const prevSample = results[i - prev] || null;
        const nextSample = results[i + prev] || null;
        const prevElevation = prevSample ? prevSample.elevation : elevation;
        const nextElevation = nextSample ? nextSample.elevation : elevation;
    
        let portion = mapGrade(elevation - prevElevation, portion_length);
        if (i <= prev - 1) {
            portion = mapGrade(nextElevation - elevation, portion_length);
        }
    
        running_distance += sample_distance;
    
        const absPortion = Math.abs(portion);
        if (absPortion > max_el) max_el = absPortion;
            const color = Color(absPortion);

            dataTable.push([
                `${running_distance.toFixed(2)} ${store.state.MiKm}`,
                elevation * conversion_factor,
                color
            ]);

            locs.push({
                lat: elSample.location.lat(),
                lng: elSample.location.lng(),
            });
        };
    min_el *= conversion_factor;
    max_el *= conversion_factor;
    const el_change = (max_el - min_el).toFixed(0);
    const grade = (el_change/(distance * (store.state.MiKm === 'MI' ? 5280 : 1000))*100).toFixed(2);
    store.commit("gradeInfo", {
        el_change,
        grade
    });
    return { dataTable, locs };
};