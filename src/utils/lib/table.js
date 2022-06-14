function CreateTable(results) {
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
        // Each row
        // Don't add a name to the sample since there isn't enough space
        dataTable.push([
            '', 
            elSample.elevation * 3.28, 
            Color(Math.abs(portion))
        ]);
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
    return { dataTable, locs, elChange, grade };
};
export default CreateTable;