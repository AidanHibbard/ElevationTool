let distance;
function Color(grade) {
    if (Math.round(grade) < 1) {
        return '#b2c4b9';
    } else if (Math.round(grade) < 3) {
        return '#12b5cb';
    } else if (Math.round(grade) < 6) {
        return '#34a853';
    } else if (Math.round(grade) < 9) {
        return '#ea4335';
    } else {
        return '#000000';
    }
}
function mapGrade(rise,run) {
	return (rise/run*100).toFixed(2);
}
function computeDistance(route) {
    let total = 0;
    route.legs.forEach((leg) => {
        total += leg.distance.value;
    });
    total = (total / 1000) / 1.609;
    distance = total;
    return total.toString().substring(0, 4);
};
function createTable(results) {
    let dataTable = [],
        locs = [],
        prev = 8,
        portion,
        portion_length,
        minEl, 
        maxEl = 0;
    portion_length = (distance * 1609) / (256/prev)
    // Create Columns expected as [0]
    dataTable.push(['Sample', 'Elevation', { role: 'style' }]);
    // Set first elevation to check if rest are <
    minEl = results[0].elevation;
    results.forEach((elSample, idx) => {
        if (elSample.elevation > maxEl) maxEl = elSample.elevation;
        if (elSample.elevation < minEl) minEl = elSample.elevation;
        // Is the previous sample greater or lesser
        if (idx > (prev - 1)) {
            portion = mapGrade(((elSample.elevation) - results[idx-prev].elevation),portion_length);
        } else {
            portion = mapGrade(((elSample.elevation) - results[idx+prev].elevation),portion_length);
        }
        // Max grade
		if (Math.abs(portion) > maxEl) max = Math.abs(portion);
		const color = `${Color(Math.abs(portion))}`;
        // Each row
        // Don't add a name to the sample since there isn't enough space
        dataTable.push(['', elSample.elevation * 3.28, color]);
        locs.push({ 
            lat: elSample.location.lat(), 
            lng: elSample.location.lng()
        });
    });
    // convert to feet of elevation
    minEl *= 3.28;
    maxEl *= 3.28;
    const elChange = (maxEl - minEl).toFixed(0)
    const grade = (elChange/(distance * 5280)*100).toFixed(2);
    return { dataTable, locs };
};
export { computeDistance, createTable };